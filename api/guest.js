// Guest API endpoint for Vercel - using database storage
import { getJson, getStorageStatus } from '../lib/storage.js';

const useRedis = !!process.env.REDIS_URL || !!process.env.UPSTASH_REDIS_REST_URL;

async function readGuests() {
  try {
    console.log('readGuests - Starting to read guests data from database');
    
    // Try storage first (Redis/Upstash)
    if (useRedis) {
      console.log('readGuests - Attempting to read from storage');
      const data = await getJson('guests', null);
      console.log('readGuests - Got data from storage:', data ? 'exists' : 'null');
      console.log('readGuests - Data type:', typeof data);
      console.log('readGuests - Data structure:', data ? Object.keys(data) : 'N/A');
      
      if (data && typeof data === 'object') {
        // If data already has the complete structure (guests, totalGuests, etc.)
        if (data.guests && Array.isArray(data.guests)) {
          console.log('readGuests - Returning complete data structure with', data.guests.length, 'guests');
          return data;
        }
        
        // If data is just the guests array (legacy format)
        if (Array.isArray(data)) {
          console.log('readGuests - Converting array format to complete structure with', data.length, 'guests');
          return {
            guests: data,
            totalGuests: data.length
          };
        }
      }
      
      // If data is a string, try to parse it
      if (typeof data === 'string') {
        console.log('readGuests - Data is string, attempting to parse');
        try {
          const parsedData = JSON.parse(data);
          console.log('readGuests - Parsed data type:', typeof parsedData);
          console.log('readGuests - Parsed data structure:', parsedData ? Object.keys(parsedData) : 'N/A');
          
          if (parsedData && parsedData.guests && Array.isArray(parsedData.guests)) {
            console.log('readGuests - Returning parsed complete structure with', parsedData.guests.length, 'guests');
            return parsedData;
          }
          
          if (Array.isArray(parsedData)) {
            console.log('readGuests - Converting parsed array format to complete structure with', parsedData.length, 'guests');
            return {
              guests: parsedData,
              totalGuests: parsedData.length
            };
          }
        } catch (parseError) {
          console.error('readGuests - Failed to parse string data:', parseError);
        }
      }
    }
    
    // Fallback to empty structure if no storage available
    console.log('readGuests - No storage available or data not found, returning empty structure');
    return { guests: [] };
  } catch (error) {
    console.error('readGuests - Error:', error);
    return { guests: [] };
  }
}

export default async function handler(req, res) {
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
      console.log('GET /api/guest - Starting request');
      console.log('GET /api/guest - Query params:', req.query);
      
      const { slug } = req.query;
      
      if (!slug) {
        console.log('GET /api/guest - No slug provided');
        return res.status(400).json({ error: 'Guest slug is required' });
      }

      console.log('GET /api/guest - Looking for guest with slug:', slug);

      // Log storage status for debugging
      const storageStatus = getStorageStatus();
      console.log('GET /api/guest - Storage status:', storageStatus);

      const guestsData = await readGuests();
      console.log('GET /api/guest - Retrieved guests data:', {
        guestsCount: guestsData.guests?.length || 0,
        hasGuests: !!guestsData.guests,
        dataStructure: Object.keys(guestsData),
        guestsType: typeof guestsData.guests,
        isGuestsArray: Array.isArray(guestsData.guests)
      });

      // Ensure we have a valid guests array
      if (!guestsData.guests || !Array.isArray(guestsData.guests)) {
        console.log('GET /api/guest - No valid guests array found');
        return res.status(404).json({ 
          error: 'Guest not found',
          message: 'No guests data available.'
        });
      }

      console.log('GET /api/guest - Available guest slugs:', guestsData.guests.map(g => g.slug));

      // Find guest by slug
      const guest = guestsData.guests.find(g => g.slug === slug);
      
      if (!guest) {
        console.log('GET /api/guest - Guest not found with slug:', slug);
        return res.status(404).json({ 
          error: 'Guest not found',
          message: 'This guest invitation link is not valid or has expired.'
        });
      }

      console.log('GET /api/guest - Found guest:', {
        id: guest.id,
        name: guest.name,
        fullName: guest.fullName,
        slug: guest.slug
      });

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
      console.error('GET /api/guest - Error:', error);
      res.status(500).json({ error: 'Failed to retrieve guest information' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
