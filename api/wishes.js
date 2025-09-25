import { getJson, setJson, getStorageStatus } from '../lib/storage.js';

// Timeout wrapper for Redis operations
function withTimeout(promise, timeoutMs = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
}

async function readWishes() {
  try {
    console.log('readWishes - Starting to read from Redis');
    const data = await withTimeout(getJson('wishes', null));
    console.log('readWishes - Got data from Redis:', data ? 'exists' : 'null');
    
    // Check if data exists and has the expected structure
    if (data && typeof data === 'object') {
      // If data already has the complete structure (wishes, totalWishes, etc.)
      if (data.wishes && Array.isArray(data.wishes)) {
        console.log('readWishes - Returning complete data structure with', data.wishes.length, 'wishes');
        return data;
      }
      
      // If data is just the wishes array (legacy format)
      if (Array.isArray(data)) {
        console.log('readWishes - Converting array format to complete structure with', data.length, 'wishes');
        return {
          wishes: data,
          totalWishes: data.length,
          attendanceStats: {
            present: data.filter(w => w.attendance === 'present').length,
            absent: data.filter(w => w.attendance === 'absent').length
          },
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    console.log('readWishes - Returning default empty structure');
    return { 
      wishes: [], 
      totalWishes: 0, 
      attendanceStats: { present: 0, absent: 0 }, 
      lastUpdated: new Date().toISOString() 
    };
  } catch (error) {
    console.error('readWishes - Error:', error);
    return { 
      wishes: [], 
      totalWishes: 0, 
      attendanceStats: { present: 0, absent: 0 }, 
      lastUpdated: new Date().toISOString() 
    };
  }
}

async function writeWishes(data) {
  try {
    console.log('writeWishes - Starting to write data');
    data.lastUpdated = new Date().toISOString();
    
    console.log('writeWishes - Data to write:', {
      wishesCount: data.wishes?.length || 0,
      totalWishes: data.totalWishes || 0,
      hasWishes: !!data.wishes,
      dataStructure: Object.keys(data)
    });
    
    await withTimeout(setJson('wishes', data));
    console.log('writeWishes - Successfully saved to storage');
    return true;
  } catch (error) {
    console.error('writeWishes - Failed to write wishes to storage:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      console.log('GET /api/wishes - Starting request');
      
      // Log storage status for debugging
      const storageStatus = getStorageStatus();
      console.log('Storage status:', storageStatus);
      
      // Log environment variables for debugging (without exposing sensitive data)
      console.log('Environment check:', {
        hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
        hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        hasVercelKVUrl: !!process.env.KV_REST_API_URL,
        hasVercelKVToken: !!process.env.KV_REST_API_TOKEN
      });
      
      // Get data from storage
      const wishesData = await readWishes();
      
      console.log('GET /api/wishes - Retrieved data:', {
        wishesCount: wishesData.wishes?.length || 0,
        totalWishes: wishesData.totalWishes || 0,
        hasWishes: !!wishesData.wishes,
        storageType: storageStatus.status,
        dataStructure: Object.keys(wishesData)
      });
      
      res.status(200).json(wishesData);
    } catch (error) {
      console.error('GET /api/wishes - Error:', error);
      // Return empty structure as fallback
      const fallbackData = { 
        wishes: [], 
        totalWishes: 0, 
        attendanceStats: { present: 0, absent: 0 }, 
        lastUpdated: new Date().toISOString() 
      };
      res.status(200).json(fallbackData);
    }
  } else if (req.method === 'POST') {
    // POST: Add new wish
    try {
      console.log('POST /api/wishes - Starting request');
      console.log('POST /api/wishes - Request body:', req.body);
      
      const { name, message, attendance, guestCount } = req.body;
      
      // Validation
      if (!name || !message || !attendance) {
        console.log('POST /api/wishes - Validation failed: missing required fields');
        return res.status(400).json({ 
          error: 'Missing required fields: name, message, and attendance are required' 
        });
      }

      // Log storage status for debugging
      const storageStatus = getStorageStatus();
      console.log('POST /api/wishes - Storage status:', storageStatus);
      
      // Read current wishes data
      let wishesData = await readWishes();
      console.log('POST /api/wishes - Current wishes data before adding:', {
        wishesCount: wishesData.wishes?.length || 0,
        totalWishes: wishesData.totalWishes || 0,
        hasWishes: !!wishesData.wishes,
        dataStructure: Object.keys(wishesData)
      });
      
      // Ensure wishes array exists and is valid
      if (!wishesData.wishes || !Array.isArray(wishesData.wishes)) {
        console.log('POST /api/wishes - Initializing empty wishes array');
        wishesData.wishes = [];
      }
      
      // Generate new ID - find the highest existing ID and add 1
      let newId = 1;
      if (wishesData.wishes.length > 0) {
        const existingIds = wishesData.wishes.map(w => w.id || 0).filter(id => typeof id === 'number');
        if (existingIds.length > 0) {
          newId = Math.max(...existingIds) + 1;
        }
      }
      
      console.log('POST /api/wishes - Generated new ID:', newId);
      
      const newWish = {
        id: newId,
        name: name.trim(),
        message: message.trim(),
        attendance,
        timestamp: new Date().toISOString(),
        guestCount: guestCount || 1
      };

      console.log('POST /api/wishes - New wish object:', newWish);

      // Add to beginning of array (newest first)
      wishesData.wishes.unshift(newWish);
      
      // Update metadata
      wishesData.totalWishes = wishesData.wishes.length;
      wishesData.attendanceStats = {
        present: wishesData.wishes.filter(w => w.attendance === 'present').length,
        absent: wishesData.wishes.filter(w => w.attendance === 'absent').length
      };
      
      console.log('POST /api/wishes - Wishes data after adding:', {
        wishesCount: wishesData.wishes.length,
        totalWishes: wishesData.totalWishes,
        attendanceStats: wishesData.attendanceStats
      });
      
      // Write to storage
      console.log('POST /api/wishes - Attempting to save to storage');
      await writeWishes(wishesData);
      console.log('POST /api/wishes - Successfully saved to storage');
      
      res.status(201).json({ 
        success: true, 
        wish: newWish, 
        totalWishes: wishesData.totalWishes,
        attendanceStats: wishesData.attendanceStats
      });
    } catch (error) {
      console.error('POST /api/wishes - Error:', error);
      res.status(500).json({ error: 'Failed to add wish: ' + error.message });
    }
  } else {
    if (req.method === 'PUT') {
      try {
        const { id, name, message, attendance, guestCount } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Wish id is required' });
        }

        let wishesData = await readWishes();
        const idx = wishesData.wishes.findIndex(w => w.id === id);
        if (idx === -1) {
          return res.status(404).json({ error: 'Wish not found' });
        }

        if (name !== undefined) wishesData.wishes[idx].name = name.trim();
        if (message !== undefined) wishesData.wishes[idx].message = message.trim();
        if (attendance !== undefined) wishesData.wishes[idx].attendance = attendance;
        if (guestCount !== undefined) wishesData.wishes[idx].guestCount = guestCount;

        const writeSuccess = await writeWishes(wishesData);
        if (!writeSuccess) {
          throw new Error('Failed to save wishes to database');
        }
        res.status(200).json({ success:true, wish:wishesData.wishes[idx] });
      } catch (error) {
        console.error('PUT error:', error);
        res.status(500).json({ error: 'Failed to update wish' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Wish id is required' });
        }

        let wishesData = await readWishes();
        const newWishes = wishesData.wishes.filter(w => w.id !== id);
        if (newWishes.length === wishesData.wishes.length) {
          return res.status(404).json({ error: 'Wish not found' });
        }

        wishesData.wishes = newWishes;
        wishesData.totalWishes = newWishes.length;
        wishesData.attendanceStats = {
          present: newWishes.filter(w => w.attendance === 'present').length,
          absent: newWishes.filter(w => w.attendance === 'absent').length
        };
        const writeSuccess = await writeWishes(wishesData);
        if (!writeSuccess) {
          throw new Error('Failed to save wishes to database');
        }
        res.status(200).json({ success:true });
      } catch (error) {
        console.error('DELETE error:', error);
        res.status(500).json({ error: 'Failed to delete wish' });
      }
    } else {
      // Method not allowed
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  }
}
