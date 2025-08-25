import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001; // Different port from Vite

// Middleware
app.use(cors());
app.use(express.json());

// Path to data files
const WISHES_FILE_PATH = path.join(__dirname, 'src/assets/data/wishes.json');
const GUESTS_FILE_PATH = path.join(__dirname, 'src/assets/data/guests.json');

// Helper function to read wishes from file
function readWishesFromFile() {
  try {
    const data = fs.readFileSync(WISHES_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading wishes file:', error);
    return { wishes: [] };
  }
}

// Helper function to read guests from file
function readGuestsFromFile() {
  try {
    const data = fs.readFileSync(GUESTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading guests file:', error);
    return { guests: [] };
  }
}

// Helper function to write wishes to file
function writeWishesToFile(wishesData) {
  try {
    fs.writeFileSync(WISHES_FILE_PATH, JSON.stringify(wishesData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing wishes file:', error);
    return false;
  }
}

// API Routes
app.get('/api/wishes', (req, res) => {
  try {
    const wishesData = readWishesFromFile();
    res.json(wishesData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read wishes' });
  }
});

app.post('/api/wishes', (req, res) => {
  try {
    const { name, message, attendance, guestCount } = req.body;
    
    // Validation
    if (!name || !message || !attendance) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, message, and attendance are required' 
      });
    }

    const wishesData = readWishesFromFile();
    
    // Create new wish
    const newWish = {
      id: wishesData.wishes.length + 1,
      name: name.trim(),
      message: message.trim(),
      attendance: attendance,
      timestamp: new Date().toISOString(),
      guestCount: guestCount || 1
    };

    // Add to beginning of array
    wishesData.wishes.unshift(newWish);
    
    // Update metadata
    wishesData.totalWishes = wishesData.wishes.length;
    wishesData.attendanceStats = {
      present: wishesData.wishes.filter(w => w.attendance === 'present').length,
      absent: wishesData.wishes.filter(w => w.attendance === 'absent').length
    };
    wishesData.lastUpdated = new Date().toISOString();

    // Write to file
    if (writeWishesToFile(wishesData)) {
      res.status(201).json({ 
        success: true, 
        message: 'Wish added successfully',
        wish: newWish,
        totalWishes: wishesData.totalWishes
      });
    } else {
      res.status(500).json({ error: 'Failed to save wish to file' });
    }
  } catch (error) {
    console.error('Error adding wish:', error);
    res.status(500).json({ error: 'Failed to add wish' });
  }
});

// Guest API endpoint
app.get('/api/guest/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: 'Guest slug is required' });
    }

    const guestsData = readGuestsFromFile();
    
    // Find guest by slug
    const guest = guestsData.guests.find(g => g.slug === slug && g.isActive);
    
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
        relationship: guest.relationship,
        invitationMessage: guest.invitationMessage
      }
    });
  } catch (error) {
    console.error('GET guest error:', error);
    res.status(500).json({ error: 'Failed to retrieve guest information' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/wishes`);
  console.log(`   POST http://localhost:${PORT}/api/wishes`);
  console.log(`   GET  http://localhost:${PORT}/api/guest/:slug`);
  console.log(`\n💡 Keep this server running while developing your Vue app`);
  console.log(`💡 Your Vue app should run on http://localhost:3000`);
});
