// Simple wishes API that works without Redis
export default async function handler(req, res) {
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
    try {
      // Return empty structure for now
      const wishesData = { 
        wishes: [], 
        totalWishes: 0, 
        attendanceStats: { present: 0, absent: 0 }, 
        lastUpdated: new Date().toISOString() 
      };
      
      console.log('GET /api/wishes-simple - Returning empty data');
      res.status(200).json(wishesData);
    } catch (error) {
      console.error('GET /api/wishes-simple - Error:', error);
      res.status(200).json({ 
        wishes: [], 
        totalWishes: 0, 
        attendanceStats: { present: 0, absent: 0 }, 
        lastUpdated: new Date().toISOString() 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, message, attendance, guestCount } = req.body;
      
      // Validation
      if (!name || !message || !attendance) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, message, and attendance are required' 
        });
      }

      // For now, just return success without persisting
      const newWish = {
        id: Date.now(), // Simple ID generation
        name: name.trim(),
        message: message.trim(),
        attendance,
        timestamp: new Date().toISOString(),
        guestCount: guestCount || 1
      };

      console.log('POST /api/wishes-simple - Wish received:', newWish);
      
      res.status(201).json({ 
        success: true, 
        wish: newWish, 
        totalWishes: 1, // Mock count
        attendanceStats: { present: attendance === 'present' ? 1 : 0, absent: attendance === 'absent' ? 1 : 0 }
      });
    } catch (error) {
      console.error('POST /api/wishes-simple - Error:', error);
      res.status(500).json({ error: 'Failed to add wish: ' + error.message });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
