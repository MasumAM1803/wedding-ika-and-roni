import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GUESTS_FILE_PATH = path.join(__dirname, '../..', 'src/assets/data/guests.json');

function readGuestsFromFile() {
  try {
    const data = fs.readFileSync(GUESTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading guests.json:', err);
    return { guests: [] };
  }
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { slug } = req.query;
      
      if (!slug) {
        return res.status(400).json({ error: 'Guest slug is required' });
      }

      const guestsData = readGuestsFromFile();
      const guest = guestsData.guests.find(g => g.slug === slug);
      
      if (!guest) {
        return res.status(404).json({ 
          error: 'Guest not found',
          message: 'This guest invitation link is not valid or has expired.'
        });
      }

      // Return guest information
      res.status(200).json({
        success: true,
        guest: {
          id: guest.id,
          name: guest.name,
          fullName: guest.fullName,
          slug: guest.slug,
          whatsapp: guest.whatsapp || ''
        }
      });
    } catch (error) {
      console.error('GET guest error:', error);
      res.status(500).json({ error: 'Failed to retrieve guest information' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
