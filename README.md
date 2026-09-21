# CircuScan 📱♻️
### Circular Electronics & E-Waste Triage Mobile Web App (PWA)

CircuScan is an intelligent, AI-powered progressive web application designed to combat electronic waste (e-waste). By leveraging real-time computer vision and multimodal OCR, CircuScan automatically recognizes electronic devices, labels, and specs, assesses their operational health, and guides users through the circular economy with actionable recommendations: **Reuse**, **Repair**, **Donate**, or **Recycle**.

---

## ✨ Features

- 🔍 **Real-Time Multimodal Recognition**:
  - Uses **Google Gemini Flash Vision** and **Edge OCR** (RapidOCR / Tesseract) to identify device make, model, category, and specifications from photos or live camera captures.
  - Automatically reads regulatory labels, adapter ratings, FCC IDs, model names (e.g. smartphones, laptops, chargers, audio gear, wearables).

- 🧠 **Dynamic 4R Decision Engine**:
  - **Reuse**: Provides direct trade-in / buyback estimates (in ₹ INR) across top exchange platforms.
  - **Repair**: Identifies fixable faults, estimates repairability index (1–5 scale), and provides brand-authorized service center links.
  - **Donate**: Connects working or lightly used electronics with community reuse programs.
  - **Recycle**: Routes unrepairable or hazardous gadgets to verified authorized e-waste recyclers.

- 📊 **Material & Toxic Hazard Breakdown**:
  - Visual breakdown of e-waste composition: lithium-ion battery risks, hazardous heavy metals (Lead, Mercury, Cadmium), and recoverable precious metals (Gold, Silver, Copper).

- 🌱 **Environmental Impact Calculator**:
  - Computes quantifiable ecological metrics for every triaged device:
    - 🌍 **CO₂ Emissions Saved** (kg)
    - ⚖️ **E-Waste Diverted from Landfills** (kg)
    - ✨ **Precious Metals Recovered** (Gold in mg, Copper in grams)

- 📍 **Nearby Facility & Recycler Locator**:
  - Locates verified government-authorized e-waste collection bins, repair centers, and recyclers by pincode and location.

- 🛒 **Trade-In & Buyback Hub**:
  - Generates pre-populated exchange links for platforms like **Cashify**, **Amazon Recommerce**, **Flipkart Exchange**, **Croma**, and **Reliance Digital**.

- 💾 **Local History & Privacy-First**:
  - Stores scan records locally on the user's device (`localStorage`) with no mandatory database requirement.
  - PWA-ready for smooth mobile and desktop experience.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router), React 18, TypeScript |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), Lucide Icons, Canvas Confetti |
| **AI & Multimodal Vision** | [Google Generative AI (Gemini Flash)](https://ai.google.dev/), Tesseract.js |
| **Edge OCR Microservice** | FastAPI, Python 3.10, RapidOCR, Uvicorn, Docker (optional high-speed OCR) |
| **Image Compression** | `browser-image-compression` |
| **Deployment** | [Vercel](https://vercel.com/) (Frontend), Hugging Face Spaces / Render (OCR backend) |

---

## 📁 Project Structure

```text
Ewaste-mobile/
├── app/                        # Next.js App Router
│   ├── api/
│   │   └── analyze/            # Multimodal device analysis API route
│   ├── layout.tsx              # Root HTML layout & fonts
│   ├── page.tsx                # Main single-page interactive triage flow
│   └── globals.css             # Tailwind & base style rules
├── components/                 # UI Components
│   ├── Header.tsx              # Navigation bar, brand logo, history & key buttons
│   ├── ScanDevice.tsx          # Camera / photo upload & preview interface
│   ├── DiagnosticStep.tsx      # Quick device health & condition survey
│   ├── EvaluationCard.tsx      # 4R Recommendation card with resale estimate
│   ├── MaterialBreakdown.tsx   # E-waste elemental & toxic composition
│   ├── ImpactMetrics.tsx       # CO2, diverted waste & metals metrics
│   ├── FacilityLocator.tsx     # Map & verified recycler locator
│   ├── DeviceHistory.tsx       # Scan history drawer
│   └── ApiKeyModal.tsx         # Gemini API Key configuration modal
├── fastapi-app/                # Optional Python RapidOCR edge microservice
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
├── lib/                        # Domain logic & helpers
│   ├── scoring.ts              # Depreciation & residual condition algorithms
│   ├── impact.ts               # Carbon and material recovery calculations
│   ├── tradein.ts              # Buyback & service center link generators
│   ├── locations.ts            # Authorized recycling facilities directory
│   ├── schemaQuestions.ts      # Category-specific diagnostic questions
│   └── realtimeDetection.ts    # Fallback and OCR processing pipelines
├── types/                      # TypeScript definitions (circuscan.ts)
├── public/                     # Static assets and icons
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm** or **yarn** / **pnpm**
- *(Optional)* Python 3.9+ if running the FastAPI RapidOCR microservice locally

### 1. Clone the Repository

```bash
git clone https://github.com/Datadeveloper03/ewastemobile.git
cd ewastemobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: Pre-configure your Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: URL to external RapidOCR microservice (defaults to client fallback if unset)
NEXT_PUBLIC_RAPID_OCR_URL=http://127.0.0.1:7860
```

> **Note**: Users can also input their Gemini API key directly through the in-app key modal, which stores it securely in client-side `localStorage`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience CircuScan.

---

## 🐍 Optional: Running the RapidOCR Microservice

For ultra-fast and offline OCR on complex regulatory labels and charger plates:

1. Navigate to the microservice directory:
   ```bash
   cd fastapi-app
   ```
2. Set up a virtual environment and install requirements:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS / Linux:
   source venv/bin/activate

   pip install -r requirements.txt
   ```
3. Run the service:
   ```bash
   python main.py
   # Runs on http://127.0.0.1:7860
   ```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Import your GitHub repository into [Vercel](https://vercel.com/).
2. In **Project Settings > Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API Key from Google AI Studio.
   - `NEXT_PUBLIC_RAPID_OCR_URL`: (Optional) URL of your deployed OCR microservice.
3. Deploy! Next.js will automatically build and serve the application globally.

### Edge Microservice (Hugging Face Spaces / Render)

- Push the `fastapi-app/` directory as a Docker Space on [Hugging Face Spaces](https://huggingface.co/spaces) or a Docker Web Service on [Render](https://render.com/).
- Set the resulting public URL as `NEXT_PUBLIC_RAPID_OCR_URL` on your Vercel deployment.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
