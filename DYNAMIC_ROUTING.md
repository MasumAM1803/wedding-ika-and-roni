# Dynamic Routing for Guest Invitations

This Vue.js wedding invitation application now supports dynamic routing for personalized guest invitations.

## Features

- **Dynamic Routes**: Each guest gets a unique URL with their name as a slug
- **Personalized Content**: Guest information is displayed in the right section before opening the invitation
- **API Integration**: Guest data is fetched from the backend API
- **Responsive Design**: Works on both desktop and mobile devices

## How It Works

### 1. URL Structure
- **Home page**: `/` - Shows generic invitation
- **Guest invitation**: `/guest/[slug]` - Shows personalized invitation for specific guest

### 2. Guest Data Structure
Guests are defined in `src/assets/data/guests.json`:

```json
{
  "guests": [
    {
      "id": 1,
      "name": "Masum",
      "fullName": "Masum Abdul Matin",
      "slug": "masum",
      "relationship": "Family",
      "invitationMessage": "Dear Abdul, you are cordially invited to our wedding celebration.",
      "isActive": true
    }
  ]
}
```

### 3. API Endpoints
- `GET /api/guest/:slug` - Retrieves guest information by slug
- `GET /api/wishes` - Retrieves wishes/RSVPs
- `POST /api/wishes` - Submits new wish/RSVP

## Usage Examples

### Access Guest Invitations
- **Abdul's invitation**: `http://localhost:3000/guest/abdul`
- **Sarah's invitation**: `http://localhost:3000/guest/sarah`

### Guest Display
When a guest accesses their invitation:
1. The right section shows their personalized information
2. Guest name appears below "Kepada Yth."
3. Relationship and invitation message are displayed
4. The invitation maintains the same beautiful design

### Default Behavior
When no guest slug is provided (home page):
- Shows generic greeting "Bapak/Ibu/Saudara/i"
- Includes disclaimer about name/title accuracy

## Technical Implementation

### Router Configuration
```javascript
// src/router/index.js
{
  path: '/guest/:slug',
  name: 'GuestInvitation',
  component: WeddingInvitation,
  props: true
}
```

### Component Logic
The `WeddingInvitation` component:
- Watches for route changes
- Fetches guest data from API when slug changes
- Displays guest information conditionally
- Falls back to default greeting when no guest is found

### API Integration
- Guest data is fetched using the guest slug from the route
- API calls are made to the local development server (port 3001)
- Production builds use relative API paths

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the API server**:
   ```bash
   node server.js
   ```

3. **Start the Vue development server**:
   ```bash
   npm run dev
   ```

4. **Test guest invitations**:
   - Visit `http://localhost:3000/guest/abdul`
   - Visit `http://localhost:3000/guest/sarah`

## Adding New Guests

To add a new guest:

1. Edit `src/assets/data/guests.json`
2. Add a new guest object with:
   - Unique `id`
   - `name` (short name)
   - `fullName` (full name)
   - `slug` (URL-friendly version of name)
   - `relationship` (e.g., "Family", "Friend", "Colleague")
   - `invitationMessage` (personalized message)
   - `isActive: true`

3. The guest will automatically be available at `/guest/[slug]`

## Production Deployment

- The application uses Vue Router with HTML5 history mode
- Ensure your hosting provider supports client-side routing
- API endpoints should be configured for production
- Guest data can be moved to a database for dynamic management

## Browser Support

- Modern browsers with ES6+ support
- Vue 3 with Composition API
- Responsive design for mobile and desktop
- Progressive Web App features supported
