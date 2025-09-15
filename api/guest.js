// Simple guest API endpoint for Vercel
const guestsData = {
  "guests": [
    {
      "id": 1,
      "name": "masum",
      "fullName": "Ma'sum Abdul Matin",
      "slug": "masum"
    },
    {
      "id": 2,
      "name": "Rani",
      "fullName": "Rani",
      "slug": "rani"
    }
  ],
  "totalGuests": 2,
  "lastUpdated": new Date().toISOString()
};

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
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
