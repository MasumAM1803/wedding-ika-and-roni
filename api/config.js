import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE_PATH = path.join(__dirname, '..', 'src/assets/data/wedding-config.json');

// In-memory storage for Vercel serverless environment (read-only filesystem)
let configCache = null;

function readConfigFromFile() {
  try {
    if (!configCache) {
      const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      configCache = JSON.parse(fileContent);
    }
    return JSON.parse(JSON.stringify(configCache)); // Return a copy
  } catch (err) {
    console.error('Failed to read wedding-config.json:', err);
    return { invitationMessage: '' };
  }
}

// Note: In Vercel serverless environment, we can't write to filesystem
// This function simulates writing but data won't persist between requests
function writeConfigToFile(data) {
  try {
    // Update in-memory cache only (won't persist in serverless environment)
    configCache = JSON.parse(JSON.stringify(data));
    console.log('Config updated in memory (note: will not persist in serverless environment)');
    return true;
  } catch (err) {
    console.error('Failed to update config data:', err);
    return false;
  }
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // GET: Retrieve configuration
    try {
      const configData = readConfigFromFile();
      res.status(200).json(configData);
    } catch (error) {
      console.error('GET config error:', error);
      res.status(500).json({ error: 'Failed to read configuration' });
    }
  } else if (req.method === 'PUT') {
    // PUT: Update configuration
    try {
      const { invitationMessage } = req.body;
      
      if (invitationMessage === undefined) {
        return res.status(400).json({ error: 'invitationMessage is required' });
      }

      const configData = readConfigFromFile();
      configData.invitationMessage = invitationMessage;

      // Save to file
      if (!writeConfigToFile(configData)) {
        return res.status(500).json({ error: 'Failed to save configuration' });
      }

      res.status(200).json({ 
        success: true,
        message: 'Configuration updated successfully',
        config: configData
      });
    } catch (error) {
      console.error('PUT config error:', error);
      res.status(500).json({ error: 'Failed to update configuration' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
