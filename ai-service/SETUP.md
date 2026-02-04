# AI Service Setup Guide

## Quick Start

1. **Install Python dependencies:**
```bash
cd ai-service
pip install -r requirements.txt
```

2. **Get Google Gemini API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

3. **Set up environment variables:**
Create a `.env` file in the `ai-service` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

4. **Run the service:**
```bash
python app.py
```

The service will start on `http://localhost:8000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `PORT` | Port number for the service (default: 8000) | No |

## How to Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the API key
5. Add it to your `.env` file

**Note**: Keep your API key secure and never commit it to version control.

## API Endpoints

- `GET /` - Service status
- `GET /health` - Health check with analyzer status
- `POST /predict` - Analyze food image using Gemini AI
  - Body: `{"imageUrl": "https://..."}`
  - Returns: Predictions with food category, item name, quantity, quality, etc.

## Testing

Test the service:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/food.jpg"}'
```

## Benefits of Gemini AI

- **Better Recognition**: Accurately identifies specific foods like "Chappati", "Rice", "Curry"
- **No Model Files**: No need to download or store large model files
- **Fast Setup**: Just requires API key
- **Natural Language**: Understands context and provides descriptive names
- **Quality Assessment**: Analyzes freshness and quality automatically

## Notes

- The service uses mock predictions if Gemini API key is not configured
- Image URLs must be publicly accessible
- Gemini AI provides superior food recognition
- Supports CORS for frontend integration
