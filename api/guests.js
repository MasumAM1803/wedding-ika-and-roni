import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getJson, setJson, getStorageStatus } from '../lib/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GUESTS_FILE_PATH = path.join(__dirname, '..', 'src/assets/data/guests.json');

const useRedis = !!process.env.REDIS_URL || !!process.env.UPSTASH_REDIS_REST_URL;

// In-memory storage for Vercel serverless environment (read-only filesystem)
let guestsCache = null;

async function readGuests() {
  try {
    console.log('readGuests - Starting to read guests data');
    
    // Try storage first (Redis/Upstash)
    if (useRedis) {
      console.log('readGuests - Attempting to read from storage');
      const data = await getJson('guests', null);
      console.log('readGuests - Got data from storage:', data ? 'exists' : 'null');
      
      if (data && data.guests && Array.isArray(data.guests)) {
        console.log('readGuests - Returning data with', data.guests.length, 'guests');
        return data;
      }
      
      // If data exists but doesn't have expected structure, try to fix it
      if (data && Array.isArray(data)) {
        console.log('readGuests - Converting array format to complete structure with', data.length, 'guests');
        return {
          guests: data,
          totalGuests: data.length
        };
      }
    }
    
    // Fallback to file / memory (local dev)
    console.log('readGuests - Falling back to file/memory storage');
    try {
      if (!guestsCache) {
        const fileContent = fs.readFileSync(GUESTS_FILE_PATH, 'utf8');
        guestsCache = JSON.parse(fileContent);
      }
      const result = JSON.parse(JSON.stringify(guestsCache));
      console.log('readGuests - Returning file data with', result.guests?.length || 0, 'guests');
      return result;
    } catch (e) { 
      console.error('readGuests - File read error:', e); 
      return { guests: [] }; 
    }
  } catch (error) {
    console.error('readGuests - Error:', error);
    return { guests: [] };
  }
}

async function writeGuests(data) {
  try {
    console.log('writeGuests - Starting to write guests data');
    console.log('writeGuests - Data to write:', {
      guestsCount: data.guests?.length || 0,
      hasGuests: !!data.guests,
      dataStructure: Object.keys(data)
    });
    
    if (useRedis) {
      console.log('writeGuests - Attempting to save to storage');
      await setJson('guests', data);
      console.log('writeGuests - Successfully saved to storage');
      return true;
    }
    
    // Fallback local (dev only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('writeGuests - Saving to local file (dev mode)');
      guestsCache = JSON.parse(JSON.stringify(data));
      fs.writeFileSync(GUESTS_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
      console.log('writeGuests - Successfully saved to local file');
      return true;
    }
    
    console.log('writeGuests - No storage available, returning false');
    return false;
  } catch (e) {
    console.error('writeGuests - Error:', e);
    return false;
  }
}

function slugify(str) {
  return str.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // GET: Retrieve all guests
    try {
      console.log('GET /api/guests - Starting request');
      
      // Log storage status for debugging
      const storageStatus = getStorageStatus();
      console.log('GET /api/guests - Storage status:', storageStatus);
      
      const guestsData = await readGuests();
      console.log('GET /api/guests - Retrieved data:', {
        guestsCount: guestsData.guests?.length || 0,
        hasGuests: !!guestsData.guests,
        dataStructure: Object.keys(guestsData)
      });

      // If ID supplied return single guest
      let idParam;
      if (req.query && req.query.id) {
        const q = parseInt(req.query.id, 10);
        if (!isNaN(q)) idParam = q;
      }
      if (!idParam) {
        const parts = req.url.split('?')[0].split('/');
        const last = parts[parts.length-1];
        const p = parseInt(last,10);
        if (!isNaN(p)) idParam=p;
      }

      if (idParam) {
        console.log('GET /api/guests - Looking for guest with ID:', idParam);
        const g = guestsData.guests.find(x=>x.id===idParam);
        if (!g) {
          console.log('GET /api/guests - Guest not found');
          return res.status(404).json({error:'Guest not found'});
        }
        console.log('GET /api/guests - Found guest:', g.name);
        return res.status(200).json({success:true,guest:g});
      }

      console.log('GET /api/guests - Returning all guests');
      res.status(200).json(guestsData);
    } catch (error) {
      console.error('GET /api/guests - Error:', error);
      res.status(500).json({ error: 'Failed to read guests' });
    }
  } else if (req.method === 'POST') {
    // POST: Add new guest
    try {
      console.log('POST /api/guests - Starting request');
      console.log('POST /api/guests - Request body:', req.body);
      
      const { fullName, whatsapp } = req.body;
      
      // Validation
      if (!fullName || !whatsapp) {
        console.log('POST /api/guests - Validation failed: missing required fields');
        return res.status(400).json({ 
          error: 'Missing required fields: fullName and whatsapp are required' 
        });
      }

      // Log storage status for debugging
      const storageStatus = getStorageStatus();
      console.log('POST /api/guests - Storage status:', storageStatus);

      const guestsData = await readGuests();
      console.log('POST /api/guests - Current guests data before adding:', {
        guestsCount: guestsData.guests?.length || 0,
        hasGuests: !!guestsData.guests,
        dataStructure: Object.keys(guestsData)
      });
      
      const slug = slugify(fullName);
      console.log('POST /api/guests - Generated slug:', slug);
      
      // Check if slug already exists
      if (guestsData.guests.find(g => g.slug === slug)) {
        console.log('POST /api/guests - Slug already exists');
        return res.status(400).json({ error: 'Guest with this name already exists' });
      }

      // Generate new ID - find the highest existing ID and add 1
      let newId = 1;
      if (guestsData.guests.length > 0) {
        const existingIds = guestsData.guests.map(g => g.id || 0).filter(id => typeof id === 'number');
        if (existingIds.length > 0) {
          newId = Math.max(...existingIds) + 1;
        }
      }
      
      console.log('POST /api/guests - Generated new ID:', newId);

      // Create new guest
      const newGuest = {
        id: newId,
        name: fullName.split(' ')[0], // First name
        fullName: fullName.trim(),
        slug: slug,
        whatsapp: whatsapp.trim(),
        sent: 0
      };

      console.log('POST /api/guests - New guest object:', newGuest);

      // Add to guests array
      guestsData.guests.push(newGuest);
      
      console.log('POST /api/guests - Guests data after adding:', {
        guestsCount: guestsData.guests.length,
        hasGuests: !!guestsData.guests
      });
      
      // Save to storage
      console.log('POST /api/guests - Attempting to save to storage');
      const saveSuccess = await writeGuests(guestsData);
      if (!saveSuccess) {
        console.log('POST /api/guests - Failed to save guest');
        return res.status(500).json({ error: 'Failed to save guest' });
      }
      
      console.log('POST /api/guests - Successfully saved guest');

      res.status(201).json({ 
        success: true, 
        message: 'Guest added successfully',
        guest: newGuest
      });
    } catch (error) {
      console.error('POST /api/guests - Error:', error);
      res.status(500).json({ error: 'Failed to add guest' });
    }
  } else if (req.method === 'PUT') {
    // PUT: Update existing guest
    try {
      const { id, fullName, whatsapp, sent } = req.body;

      // Try to obtain id from body, query (Vercel rewrite), or URL path
      let guestId = id;
      // 1) From query string when using Vercel rewrite e.g. /api/guests/147 ➜ /api/guests.js?id=147
      if (!guestId && req.query && req.query.id) {
        const q = parseInt(req.query.id, 10);
        if (!isNaN(q)) guestId = q;
      }

      // 2) Fallback: parse from path (local dev server pattern /api/guests/147)
      if (!guestId) {
        const pathParts = req.url.split('?')[0].split('/');
        const last = pathParts[pathParts.length - 1];
        const parsed = parseInt(last, 10);
        if (!isNaN(parsed)) guestId = parsed;
      }

      if (!guestId) {
        return res.status(400).json({ error: 'Guest id is required' });
      }

      const guestsData = await readGuests();
      const guestIndex = guestsData.guests.findIndex(g => g.id === guestId);
      
      if (guestIndex === -1) {
        return res.status(404).json({ error: 'Guest not found' });
      }

      // Update guest data
      if (fullName !== undefined) {
        guestsData.guests[guestIndex].fullName = fullName.trim();
        guestsData.guests[guestIndex].name = fullName.split(' ')[0];
        guestsData.guests[guestIndex].slug = slugify(fullName);
      }
      if (whatsapp !== undefined) {
        guestsData.guests[guestIndex].whatsapp = whatsapp.trim();
      }
      if (sent !== undefined) {
        guestsData.guests[guestIndex].sent = sent;
      }

      // Save to file
      if (!await writeGuests(guestsData)) {
        return res.status(500).json({ error: 'Failed to save guest' });
      }

      res.status(200).json({ 
        success: true, 
        guest: guestsData.guests[guestIndex] 
      });
    } catch (error) {
      console.error('PUT error:', error);
      res.status(500).json({ error: 'Failed to update guest' });
    }
  } else if (req.method === 'DELETE') {
    // DELETE: Remove guest by ID from URL path or query string
    try {
      // 1) Attempt to read from query string (Vercel rewrite provides ?id=123)
      let id = undefined;
      if (req.query && req.query.id) {
        const q = parseInt(req.query.id, 10);
        if (!isNaN(q)) id = q;
      }

      // 2) Fallback: parse from URL path (e.g., /api/guests/123)
      if (!id) {
        const pathParts = req.url.split('?')[0].split('/');
        const last = pathParts[pathParts.length - 1];
        const parsed = parseInt(last, 10);
        if (!isNaN(parsed)) id = parsed;
      }

      if (!id) {
        return res.status(400).json({ error: 'Valid guest id is required' });
      }

      const guestsData = await readGuests();
      const originalLength = guestsData.guests.length;
      
      // Filter out the guest with matching ID
      guestsData.guests = guestsData.guests.filter(g => g.id !== id);
      
      if (guestsData.guests.length === originalLength) {
        return res.status(404).json({ error: 'Guest not found' });
      }

      // Save to file
      if (!await writeGuests(guestsData)) {
        return res.status(500).json({ error: 'Failed to save changes' });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE error:', error);
      res.status(500).json({ error: 'Failed to delete guest' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
