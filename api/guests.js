import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GUESTS_FILE_PATH = path.join(__dirname, '..', 'src/assets/data/guests.json');

// In-memory storage for Vercel serverless environment (read-only filesystem)
let guestsCache = null;

function readGuestsFromFile() {
  try {
    if (!guestsCache) {
      const fileContent = fs.readFileSync(GUESTS_FILE_PATH, 'utf8');
      guestsCache = JSON.parse(fileContent);
    }
    return JSON.parse(JSON.stringify(guestsCache)); // Return a copy
  } catch (err) {
    console.error('Failed to read guests.json:', err);
    return { guests: [] };
  }
}

// Note: In Vercel serverless environment, we can't write to filesystem
// This function simulates writing but data won't persist between requests
function writeGuestsToFile(data) {
  try {
    // Update in-memory cache only (won't persist in serverless environment)
    guestsCache = JSON.parse(JSON.stringify(data));
    console.log('Data updated in memory (note: will not persist in serverless environment)');
    return true;
  } catch (err) {
    console.error('Failed to update guests data:', err);
    return false;
  }
}

function slugify(str) {
  return str.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function handler(req, res) {
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
      const guestsData = readGuestsFromFile();
      res.status(200).json(guestsData);
    } catch (error) {
      console.error('GET error:', error);
      res.status(500).json({ error: 'Failed to read guests' });
    }
  } else if (req.method === 'POST') {
    // POST: Add new guest
    try {
      const { fullName, whatsapp } = req.body;
      
      // Validation
      if (!fullName || !whatsapp) {
        return res.status(400).json({ 
          error: 'Missing required fields: fullName and whatsapp are required' 
        });
      }

      const guestsData = readGuestsFromFile();
      const slug = slugify(fullName);
      
      // Check if slug already exists
      if (guestsData.guests.find(g => g.slug === slug)) {
        return res.status(400).json({ error: 'Guest with this name already exists' });
      }

      // Create new guest
      const newGuest = {
        id: Math.max(...guestsData.guests.map(g => g.id), 0) + 1,
        name: fullName.split(' ')[0], // First name
        fullName: fullName.trim(),
        slug: slug,
        whatsapp: whatsapp.trim(),
        sent: 0
      };

      // Add to guests array
      guestsData.guests.push(newGuest);
      
      // Save to file
      if (!writeGuestsToFile(guestsData)) {
        return res.status(500).json({ error: 'Failed to save guest' });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Guest added successfully',
        guest: newGuest
      });
    } catch (error) {
      console.error('POST error:', error);
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

      const guestsData = readGuestsFromFile();
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
      if (!writeGuestsToFile(guestsData)) {
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

      const guestsData = readGuestsFromFile();
      const originalLength = guestsData.guests.length;
      
      // Filter out the guest with matching ID
      guestsData.guests = guestsData.guests.filter(g => g.id !== id);
      
      if (guestsData.guests.length === originalLength) {
        return res.status(404).json({ error: 'Guest not found' });
      }

      // Save to file
      if (!writeGuestsToFile(guestsData)) {
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
