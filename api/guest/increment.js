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
    console.log('Increment updated in memory (note: will not persist in serverless environment)');
    return true;
  } catch (err) {
    console.error('Failed to update guests data:', err);
    return false;
  }
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
      const { id } = req.body;
      
      // Validation
      if (!id) {
        return res.status(400).json({ error: 'Guest id is required' });
      }

      const guestsData = readGuestsFromFile();
      const guestIndex = guestsData.guests.findIndex(g => g.id === id);
      
      if (guestIndex === -1) {
        return res.status(404).json({ error: 'Guest not found' });
      }

      // Increment sent count
      guestsData.guests[guestIndex].sent = (guestsData.guests[guestIndex].sent || 0) + 1;

      // Save to file
      if (!writeGuestsToFile(guestsData)) {
        return res.status(500).json({ error: 'Failed to save increment' });
      }

      res.status(200).json({ 
        success: true,
        guest: guestsData.guests[guestIndex]
      });
    } catch (error) {
      console.error('Increment error:', error);
      res.status(500).json({ error: 'Failed to increment counter' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
