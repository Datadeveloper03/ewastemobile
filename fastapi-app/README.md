# CircuScan RapidOCR Microservice

This microservice handles high-accuracy edge OCR extraction for device serial labels, regulatory markings, FCC IDs, and PDF purchase invoices.

## Quick Local Run

1. Navigate to this directory:
   ```bash
   cd fastapi-app
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Uvicorn server:
   ```bash
   python main.py
   # Or: uvicorn main:app --host 0.0.0.0 --port 7860 --reload
   ```
5. Check health:
   ```bash
   curl http://localhost:7860/health
   ```

## Cloud Deployment

### Hugging Face Spaces (Docker Free Tier)
1. Create a new Space with the **Docker** SDK.
2. Push all files inside `fastapi-app/` to the Space repository.
3. Hugging Face will automatically build and expose the container at `https://<user>-<space-name>.hf.space`.
4. Add the URL to your Next.js frontend as:
   ```env
   NEXT_PUBLIC_RAPID_OCR_URL=https://<user>-<space-name>.hf.space
   ```

### Render Free Web Service
1. Create a **Web Service** on Render pointing to this directory.
2. Select **Docker** environment and port `7860`.
