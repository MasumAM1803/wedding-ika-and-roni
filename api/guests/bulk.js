import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GUESTS_FILE_PATH = path.join(__dirname, '../..', 'src/assets/data/guests.json');

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
    console.log('Bulk data updated in memory (note: will not persist in serverless environment)');
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { guests: newGuests, replaceAll } = req.body;
      
      // Validation
      if (!Array.isArray(newGuests)) {
        return res.status(400).json({ error: 'guests must be an array' });
      }

      const guestsData = readGuestsFromFile();
      let processedGuests = [];
      
      // Process each guest
      let nextId = replaceAll ? 1 : Math.max(...guestsData.guests.map(g => g.id), 0) + 1;
      
      for (const guest of newGuests) {
        if (!guest.fullName || !guest.whatsapp) {
          continue; // Skip invalid guests
        }

        const processedGuest = {
          id: nextId++,
          name: guest.fullName.split(' ')[0],
          fullName: guest.fullName.trim(),
          slug: slugify(guest.fullName),
          whatsapp: guest.whatsapp.trim(),
          sent: guest.sent || 0
        };
        
        processedGuests.push(processedGuest);
      }

      // Update guests data
      if (replaceAll) {
        guestsData.guests = processedGuests;
      } else {
        // Append new guests, avoiding duplicates by slug
        const existingSlugs = new Set(guestsData.guests.map(g => g.slug));
        const uniqueNewGuests = processedGuests.filter(g => !existingSlugs.has(g.slug));
        guestsData.guests.push(...uniqueNewGuests);
      }

      // Save to file
      if (!writeGuestsToFile(guestsData)) {
        return res.status(500).json({ error: 'Failed to save guests' });
      }

      res.status(200).json({ 
        success: true,
        message: `${processedGuests.length} guests processed`,
        guests: guestsData.guests
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({ error: 'Failed to process bulk upload' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
