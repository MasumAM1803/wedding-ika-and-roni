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
    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
