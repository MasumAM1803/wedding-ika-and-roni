import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Optional dotenv loading (skips if package not installed)
try {
  const dotenv = await import('dotenv');
  dotenv.config();
} catch (e) {
  console.warn('dotenv package not found – skipping .env loading');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001; // Different port from Vite

// WhatsApp Cloud API Config from .env
const {
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_ID,
  WHATSAPP_TEMPLATE_NAME = 'wedding_invite'
} = process.env;

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

function writeGuestsToFile(data){
  try{
    fs.writeFileSync(GUESTS_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  }catch(e){
    console.error('Write guests error',e);
    return false;
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

// ===================== WhatsApp Cloud API =====================
async function sendWhatsAppTemplate(toPhone) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    throw new Error('WhatsApp API credentials not configured');
  }

  const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: toPhone,
    type: 'template',
    template: {
      name: WHATSAPP_TEMPLATE_NAME,
      language: { code: 'id' }
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WHATSAPP_TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error: ${err}`);
  }

  return await res.json();
}

function normalizePhone(p) {
  let phone = p.replace(/[^\d]/g, '');
  if (phone.startsWith('0')) phone = '62' + phone.slice(1);
  return phone;
}

function slugify(str){
  return str.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g,'')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-');
}

// Send single WhatsApp message
app.post('/api/sendMessage', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'phone required' });

    const norm = normalizePhone(phone);
    const result = await sendWhatsAppTemplate(norm);
    res.status(200).json({ success: true, result });
  } catch (e) {
    console.error('sendMessage error', e);
    res.status(500).json({ error: e.message });
  }
});

// ===================== Wishes CRUD ===========================

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

// Add single guest
app.post('/api/guests', (req,res)=>{
  const { fullName, whatsapp } = req.body;
  if(!fullName) return res.status(400).json({error:'fullName required'});

  const data = readGuestsFromFile();
  const nextId = data.guests.reduce((m,g)=>Math.max(m,g.id),0)+1;
  const slugBase = slugify(fullName);
  let slug = slugBase;
  let counter = 1;
  const existingSlugs = new Set(data.guests.map(g=>g.slug));
  while(existingSlugs.has(slug)){
    slug = `${slugBase}-${counter++}`;
  }

  const newGuest = {
    id: nextId,
    name: fullName.split(' ')[0],
    fullName,
    slug,
    whatsapp: whatsapp||''
  };
  data.guests.push(newGuest);
  if(writeGuestsToFile(data)){
    return res.status(201).json({success:true, guest:newGuest});
  }
  res.status(500).json({error:'failed save'});
});

// Increment send count for guest
app.post('/api/guest/increment', (req,res)=>{
  const { id } = req.body;
  if(!id) return res.status(400).json({error:'id required'});
  const data = readGuestsFromFile();
  const idx = data.guests.findIndex(g=>g.id===id);
  if(idx===-1) return res.status(404).json({error:'guest not found'});
  data.guests[idx].sent = (data.guests[idx].sent||0)+1;
  if(writeGuestsToFile(data)){
    return res.status(200).json({success:true, count:data.guests[idx].sent});
  }
  res.status(500).json({error:'failed save'});
});

// Bulk add/replace guests from dashboard upload
app.post('/api/guests/bulk', (req, res) => {
  try {
    const { replace = false, guests } = req.body;
    if (!Array.isArray(guests)) {
      return res.status(400).json({ error: 'guests array required' });
    }

    function normalize(input, id){
      const fullName = input.fullName || input.name || input.nama || '';
      const slugBase = slugify(fullName);
      return {
        id,
        name: input.name || input.nama || fullName.split(' ')[0],
        fullName,
        slug: input.slug || slugBase,
        whatsapp: input.whatsapp || input.phone || input.nohp || ''
      };
    }

    const currentData = readGuestsFromFile();
    let newGuestsArr;

    if (replace) {
      newGuestsArr = guests.map((g, idx) => normalize(g, idx + 1));
    } else {
      newGuestsArr = [...currentData.guests];
      const existingSlugs = new Set(currentData.guests.map(g => g.slug));
      let nextId = newGuestsArr.reduce((m, g) => Math.max(m, g.id), 0) + 1;

      guests.forEach(g => {
        const obj = normalize(g, nextId);
        if (existingSlugs.has(obj.slug)) return;
        newGuestsArr.push(obj);
        existingSlugs.add(obj.slug);
        nextId++;
      });
    }

    const dataToWrite = { guests: newGuestsArr };
    if (writeGuestsToFile(dataToWrite)) {
      return res.status(200).json({ success: true, guests: dataToWrite.guests });
    }
    res.status(500).json({ error: 'Failed to write guests' });
  } catch (error) {
    console.error('bulk guests error', error);
    res.status(500).json({ error: 'Server error' });
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
