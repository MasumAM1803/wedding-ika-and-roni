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

// Helper to update wish by id
function updateWishById(wishId, payload) {
  const wishesData = readWishesFromFile()
  const idx = wishesData.wishes.findIndex(w => w.id === wishId)
  if (idx === -1) return { error: 'Wish not found' }

  const { name, message, attendance, guestCount } = payload
  if (name !== undefined) wishesData.wishes[idx].name = name.trim()
  if (message !== undefined) wishesData.wishes[idx].message = message.trim()
  if (attendance !== undefined) wishesData.wishes[idx].attendance = attendance
  if (guestCount !== undefined) wishesData.wishes[idx].guestCount = guestCount
  wishesData.lastUpdated = new Date().toISOString()
  if (!writeWishesToFile(wishesData)) return { error: 'Failed to update wish' }
  return { wish: wishesData.wishes[idx] }
}

// Helper to delete wish by id
function deleteWishById(wishId) {
  const wishesData = readWishesFromFile()
  const newWishes = wishesData.wishes.filter(w => w.id !== wishId)
  if (newWishes.length === wishesData.wishes.length) return { error: 'Wish not found' }
  wishesData.wishes = newWishes
  wishesData.totalWishes = newWishes.length
  wishesData.attendanceStats = {
    present: newWishes.filter(w => w.attendance === 'present').length,
    absent: newWishes.filter(w => w.attendance === 'absent').length
  }
  wishesData.lastUpdated = new Date().toISOString()
  if (!writeWishesToFile(wishesData)) return { error: 'Failed to delete wish' }
  return { success: true }
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

// Update existing wish by ID param
app.put('/api/wishes/:id', (req, res) => {
  try {
    const wishId = parseInt(req.params.id, 10)
    const result = updateWishById(wishId, req.body)
    if (result.error) return res.status(400).json({ error: result.error })
    res.status(200).json({ success: true, wish: result.wish })
  } catch (error) {
    console.error('Error updating wish:', error)
    res.status(500).json({ error: 'Failed to update wish' })
  }
})

// Update wish (id in body) – convenience for dashboard
app.put('/api/wishes', (req, res) => {
  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Wish id required' })
  const result = updateWishById(parseInt(id, 10), req.body)
  if (result.error) return res.status(400).json({ error: result.error })
  res.status(200).json({ success: true, wish: result.wish })
})

// Delete wish by ID param
app.delete('/api/wishes/:id', (req, res) => {
  try {
    const wishId = parseInt(req.params.id, 10)
    const result = deleteWishById(wishId)
    if (result.error) return res.status(400).json({ error: result.error })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error deleting wish:', error)
    res.status(500).json({ error: 'Failed to delete wish' })
  }
})

// Delete wish (id in body)
app.delete('/api/wishes', (req, res) => {
  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Wish id required' })
  const result = deleteWishById(parseInt(id, 10))
  if (result.error) return res.status(400).json({ error: result.error })
  res.status(200).json({ success: true })
})

// Guest API endpoint
app.get('/api/guest/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: 'Guest slug is required' });
    }

    const guestsData = readGuestsFromFile();
    
    // Find guest by slug
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
        slug: guest.slug
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
  console.log(`   POST   http://localhost:${PORT}/api/wishes`);
  console.log(`   PUT    http://localhost:${PORT}/api/wishes/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/wishes/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/guest/:slug`);
  console.log(`\n💡 Keep this server running while developing your Vue app`);
  console.log(`💡 Your Vue app should run on http://localhost:3000`);
});
