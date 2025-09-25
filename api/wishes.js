import { getJson, setJson } from '../lib/upstash.js';

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
    
    if (data && data.wishes && Array.isArray(data.wishes)) {
      console.log('readWishes - Returning data with', data.wishes.length, 'wishes');
      return data;
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
    data.lastUpdated = new Date().toISOString();
    await withTimeout(setJson('wishes', data));
    console.log('writeWishes - Successfully saved to Redis');
    return true;
  } catch (error) {
    console.error('Failed to write wishes to Redis:', error);
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
      
      // Get data from Redis
      const wishesData = await readWishes();
      
      console.log('GET /api/wishes - Retrieved data:', {
        wishesCount: wishesData.wishes?.length || 0,
        totalWishes: wishesData.totalWishes || 0,
        hasWishes: !!wishesData.wishes
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
      const { name, message, attendance, guestCount } = req.body;
      
      // Validation
      if (!name || !message || !attendance) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, message, and attendance are required' 
        });
      }

      // Read current wishes data
      let wishesData = await readWishes();
      console.log('Current wishes data before adding:', JSON.stringify(wishesData, null, 2));
      
      // Ensure wishes array exists and is valid
      if (!wishesData.wishes || !Array.isArray(wishesData.wishes)) {
        wishesData.wishes = [];
      }
      
      // Generate new ID - find the highest existing ID and add 1
      const newId = wishesData.wishes.length > 0 
        ? Math.max(...wishesData.wishes.map(w => w.id || 0)) + 1 
        : 1;
      
      const newWish = {
        id: newId,
        name: name.trim(),
        message: message.trim(),
        attendance,
        timestamp: new Date().toISOString(),
        guestCount: guestCount || 1
      };

      // Add to beginning of array (newest first)
      wishesData.wishes.unshift(newWish);
      
      // Update metadata
      wishesData.totalWishes = wishesData.wishes.length;
      wishesData.attendanceStats = {
        present: wishesData.wishes.filter(w => w.attendance === 'present').length,
        absent: wishesData.wishes.filter(w => w.attendance === 'absent').length
      };
      
      console.log('Wishes data after adding new wish:', JSON.stringify(wishesData, null, 2));
      
      // Write to Redis
      const writeSuccess = await writeWishes(wishesData);
      if (!writeSuccess) {
        throw new Error('Failed to save wishes to database');
      }
      
      console.log('Successfully saved wishes to Redis');
      res.status(201).json({ 
        success: true, 
        wish: newWish, 
        totalWishes: wishesData.totalWishes,
        attendanceStats: wishesData.attendanceStats
      });
    } catch (error) {
      console.error('POST error:', error);
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
