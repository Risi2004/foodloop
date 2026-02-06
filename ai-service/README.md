# FoodLoop AI Service

FastAPI service for food detection and quality assessment using Google Gemini AI.

## Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Get Google Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) or [MakerSuite](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

3. **Set up environment variables:**
Create a `.env` file in the `ai-service` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

4. **Optional – Chatbot knowledge base:** To add a proposal or reference PDF so the chatbot answers from it, set `KNOWLEDGE_PDF_PATH` to the PDF path (e.g. `./proposal.pdf` or an absolute path). If unset, the service looks for `ai-service/knowledge/proposal.pdf`. Place your PDF there or set the env var, then restart the service.

## Running the Service

**Development:**
```bash
python app.py
```

**Production:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - Service status
- `GET /health` - Health check with analyzer status

### Prediction
- `POST /predict` - Analyze food image using Gemini AI
  - Request body: `{"imageUrl": "https://..."}`
  - Returns: PredictionResponse with food category, item name, quantity, quality, etc.

## Features

- **Accurate Food Recognition**: Gemini AI identifies specific food items like "Chappati", "Rice and Curry", "Biryani"
- **Quality Assessment**: Analyzes freshness and quality of food
- **Non-Food Detection**: Rejects non-food items (cleaning products, etc.)
- **No Model Files**: No need to download or store large model files
- **Fast Setup**: Just requires API key

## Notes

- Set `KNOWLEDGE_PDF_PATH` (or place a PDF at `knowledge/proposal.pdf`) to use it as the chatbot knowledge base.
- The service uses mock predictions if Gemini API key is not configured
- Image URLs must be publicly accessible
- Gemini AI provides superior food recognition compared to object detection models
- Supports CORS for frontend integration
