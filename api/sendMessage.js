// Mock WhatsApp message sending API for Vercel
// In a real implementation, this would integrate with WhatsApp Business API

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
      const { phone, message, guestName } = req.body;
      
      // Validation
      if (!phone || !message) {
        return res.status(400).json({ 
          error: 'Missing required fields: phone and message are required' 
        });
      }

      // Mock sending logic - in real implementation, integrate with WhatsApp API
      console.log('Sending WhatsApp message:', {
        to: phone,
        message: message,
        guest: guestName
      });

      // Simulate some processing time (removed await since this is not an async function)
      // await new Promise(resolve => setTimeout(resolve, 100));

      // Mock success response
      res.status(200).json({ 
        success: true,
        message: 'Message sent successfully',
        messageId: `msg_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('SendMessage error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
