// Simple in-memory storage for Vercel serverless environment
let wishesData = {
  wishes: [],
  totalWishes: 0,
  attendanceStats: {
    present: 0,
    absent: 0
  },
  lastUpdated: new Date().toISOString()
};

export default function handler(req, res) {
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
    // GET: Retrieve all wishes
    try {
      res.status(200).json(wishesData);
    } catch (error) {
      console.error('GET error:', error);
      res.status(500).json({ error: 'Failed to read wishes' });
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

      res.status(201).json({ 
        success: true, 
        message: 'Wish added successfully',
        wish: newWish,
        totalWishes: wishesData.totalWishes
      });
    } catch (error) {
      console.error('POST error:', error);
      res.status(500).json({ error: 'Failed to add wish' });
    }
  } else {
    if (req.method === 'PUT') {
      try {
        const { id, name, message, attendance, guestCount } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Wish id is required' });
        }

        const idx = wishesData.wishes.findIndex(w => w.id === id);
        if (idx === -1) {
          return res.status(404).json({ error: 'Wish not found' });
        }

        if (name !== undefined) wishesData.wishes[idx].name = name.trim();
        if (message !== undefined) wishesData.wishes[idx].message = message.trim();
        if (attendance !== undefined) wishesData.wishes[idx].attendance = attendance;
        if (guestCount !== undefined) wishesData.wishes[idx].guestCount = guestCount;

        wishesData.lastUpdated = new Date().toISOString();

        res.status(200).json({ success: true, wish: wishesData.wishes[idx] });
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
        wishesData.lastUpdated = new Date().toISOString();

        res.status(200).json({ success: true });
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
