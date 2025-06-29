# Clarity Backend

Backend server for the Clarity wellness app - AI-powered journal analysis using OpenAI GPT-4.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment variables:**
   Create a `.env` file in the backend directory:

   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   PORT=3001
   NODE_ENV=development
   ```

3. **Get OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

## Running the Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

- **GET** `/api/health`
- Returns server status and timestamp

### Journal Analysis

- **POST** `/api/analyze`
- Analyzes journal entries for mood and provides suggestions

**Request Body:**

```json
{
  "text": "Your journal entry here..."
}
```

**Response:**

```json
{
  "mood": "happy",
  "suggestion": "Keep up the positive mindset!"
}
```

**Error Response:**

```json
{
  "error": "Error description",
  "message": "User-friendly message"
}
```

## Features

- ✅ OpenAI GPT-4 integration for mood analysis
- ✅ Robust error handling and validation
- ✅ CORS configured for frontend integration
- ✅ Health check endpoint
- ✅ Request logging
- ✅ Rate limiting protection
- ✅ JSON response validation

## Mood Categories

The AI analyzes entries and returns one of these moods:

- happy
- sad
- angry
- anxious
- tired
- neutral
- excited
- calm

## Development

The backend is designed to work seamlessly with the Clarity frontend. It expects requests from `http://localhost:5173` (Vite dev server) and handles CORS appropriately.
