import os
import re
from typing import Tuple, List
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import pymupdf
from rapidocr_onnxruntime import RapidOCR

app = FastAPI(title="CircuScan Resilient RapidOCR Engine", version="1.0.0")
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

ocr_engine = None

def get_ocr_engine():
    global ocr_engine
    if ocr_engine is None:
        try:
            ocr_engine = RapidOCR()
        except Exception as e:
            print(f"RapidOCR initialization notice: {e}")
            ocr_engine = False
    return ocr_engine if ocr_engine is not False else None

def clean_ocr_text(text: str) -> str:
    cleaned = re.sub(r"[^\w\s\-\.,/:\(\)\+₹$€£%#@]", " ", text)
    return re.sub(r"\s+", " ", cleaned).strip()

def preprocess_gadget_image(image_bgr: np.ndarray) -> np.ndarray:
    h, w = image_bgr.shape[:2]
    max_dim = max(h, w)
    
    if max_dim > 1024:
        scale = 1024.0 / max_dim
        new_w, new_h = max(1, int(w * scale)), max(1, int(h * scale))
        resized = cv2.resize(image_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)
    elif 0 < max_dim < 200:
        scale = min(2.0, 200.0 / max_dim)
        new_w, new_h = int(w * scale), int(h * scale)
        resized = cv2.resize(image_bgr, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
    else:
        resized = image_bgr

    return cv2.copyMakeBorder(resized, 15, 15, 15, 15, cv2.BORDER_CONSTANT, value=[255, 255, 255])

def extract_text_from_image_bytes(image_bytes: bytes) -> Tuple[str, float]:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return "", 0.0

    h, w = img.shape[:2]
    engine = get_ocr_engine()
    if engine is None:
        return "", 0.0

    processed = preprocess_gadget_image(img)
    result, _ = engine(processed)

    # Pass 1: Standard detection pipeline
    if result:
        sorted_results = sorted(result, key=lambda x: (x[0][0][1] // 25, x[0][0][0]))
        detected_parts: List[str] = []
        confidences: List[float] = []

        for item in sorted_results:
            box, text, conf = item
            clean_part = clean_ocr_text(str(text))
            if clean_part:
                detected_parts.append(clean_part)
                confidences.append(float(conf))

        full_text = "\n".join(detected_parts)
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
        return full_text, avg_conf

    # Pass 2: Direct recognition fallback for tight sticker crops
    rec_target = cv2.resize(img, (max(180, int(w * 3)), 64), interpolation=cv2.INTER_CUBIC)
    rec_result, _ = engine(rec_target, use_det=False, use_cls=False)

    if rec_result and isinstance(rec_result, list) and len(rec_result) > 0:
        rec_text = str(rec_result[0][0]).strip()
        rec_conf = float(rec_result[0][1]) if len(rec_result[0]) > 1 else 0.0
        return clean_ocr_text(rec_text), rec_conf

    return "", 0.0

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    extracted_chunks = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text").strip()
        if page_text:
            extracted_chunks.append(f"--- Page {page_num + 1} ---\n{page_text}")
    doc.close()
    return "\n\n".join(extracted_chunks)

@app.get("/")
@app.get("/health")
def health_check():
    engine_ready = get_ocr_engine() is not None
    return {
        "status": "healthy",
        "service": "CircuScan RapidOCR Engine",
        "engine_ready": engine_ready
    }

@app.post("/extract")
async def extract_document_or_image(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename.lower() if file.filename else ""
    content_type = file.content_type or ""

    if filename.endswith(".pdf") or "pdf" in content_type:
        extracted = extract_text_from_pdf_bytes(contents)
        return {"text": extracted, "confidence": 1.0, "source": "pdf"}
    
    text, confidence = extract_text_from_image_bytes(contents)
    return {"text": text, "confidence": round(confidence, 3), "source": "image"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
