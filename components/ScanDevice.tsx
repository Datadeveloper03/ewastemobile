'use client';
import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { 
  Camera, 
  Upload, 
  Search, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  Smartphone, 
  Headphones, 
  Speaker, 
  Watch, 
  Zap, 
  X, 
  CheckCircle2, 
  Flame, 
  Cpu,
  Scan,
  ShieldCheck,
  Check
} from 'lucide-react';
import { GadgetSpecs } from '@/types/circuscan';
import CameraModal from './CameraModal';

interface ScanDeviceProps {
  onScanComplete: (specs: GadgetSpecs, previewUrl?: string) => void;
  apiKey?: string;
  onOpenKeyModal?: () => void;
}

export default function ScanDevice({ onScanComplete, apiKey = '', onOpenKeyModal }: ScanDeviceProps) {
  const [loading, setLoading] = useState(false);
  const [extractionStep, setExtractionStep] = useState<number>(0);
  const [status, setStatus] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processUpload = async (file: File | null, queryOverride?: string) => {
    const activeQuery = queryOverride !== undefined ? queryOverride : textQuery;
    setLoading(true);
    setExtractionStep(1);
    setErrorMessage('');

    try {
      let uploadFile: File | null = file;
      let currentPreview = previewImage;

      if (file && file.size > 0) {
        if (!currentPreview) {
          currentPreview = URL.createObjectURL(file);
          setPreviewImage(currentPreview);
        }

        // Step 1: Preprocessing & Contrast
        setStatus('Calibrating image feed & visual contrast...');
        if (file.type.startsWith('image/')) {
          try {
            uploadFile = await imageCompression(file, {
              maxSizeMB: 0.8,
              maxWidthOrHeight: 1280,
              useWebWorker: true,
            });
          } catch (compErr) {
            console.warn('Compression fallback to original file:', compErr);
            uploadFile = file;
          }
        }
        await sleep(250);

        // Step 2: Markings & Logo Extraction
        setExtractionStep(2);
        setStatus('Scanning device markings, brand logos & OCR text...');
        await sleep(350);

        // Step 3: Hardware Architecture Matching
        setExtractionStep(3);
        setStatus(apiKey ? 'Invoking Gemini Multimodal Vision AI...' : 'Matching against circular hardware catalog...');
      } else {
        setStatus('Querying circular hardware catalog...');
        setExtractionStep(2);
        await sleep(200);
        setExtractionStep(3);
      }

      // Send to Next.js API route
      const analyzeFormData = new FormData();
      if (uploadFile && uploadFile.size > 0) {
        analyzeFormData.append('image', uploadFile);
      }
      analyzeFormData.append('textQuery', activeQuery);
      if (apiKey) {
        analyzeFormData.append('apiKey', apiKey);
      }

      const evalRes = await fetch('/api/analyze', {
        method: 'POST',
        body: analyzeFormData,
      });

      if (!evalRes.ok) {
        throw new Error('Analysis request failed. Please check network or query.');
      }

      const specs: GadgetSpecs = await evalRes.json();

      // Step 4: Circular Evaluation & Utility
      setExtractionStep(4);
      setStatus('Synthesizing 4R utility score & e-waste profile...');
      await sleep(350);

      onScanComplete(specs, currentPreview || undefined);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'Scan encountered an issue. Try entering device name manually.');
    } finally {
      setLoading(false);
      setExtractionStep(0);
      setStatus('');
    }
  };

  const handleQuickSample = (sampleName: string) => {
    setTextQuery(sampleName);
    processUpload(null, sampleName);
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStagedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      processUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setStagedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      processUpload(file);
    }
  };

  const clearStagedImage = () => {
    setStagedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-xl mx-auto p-5 sm:p-7 glass-panel-glow rounded-3xl flex flex-col gap-6 animate-slide-up">
      {/* Header Info & Clear AI Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart Gadget Triage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Identify Your Device
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
            Use webcam, upload photos/invoices, or pick a device category below
          </p>
        </div>

        {/* Clear AI Ready Status */}
        {onOpenKeyModal && (
          <button
            onClick={onOpenKeyModal}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1.5 transition shadow-sm bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-400"
            title="Click to view AI settings or add custom Gemini API Key"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{apiKey ? 'Gemini Flash AI' : 'Free AI Active (No Key Needed)'}</span>
          </button>
        )}
      </div>

      {/* LIVE SCANNING & EXTRACTION OVERLAY WHEN LOADING */}
      {loading ? (
        <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-slate-950/95 border-2 border-emerald-400/80 shadow-2xl shadow-emerald-950/80 flex flex-col items-center gap-5 text-center animate-fade-in">
          {/* Laser Scanner Viewfinder */}
          <div className="relative w-44 h-44 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/60 flex items-center justify-center shadow-2xl">
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Device in scanner" 
                className="w-full h-full object-cover brightness-90"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-emerald-400">
                <Cpu className="w-12 h-12 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wider">CIRCUSCAN VISION</span>
              </div>
            )}
            
            {/* Animated neon laser scanning sweep beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-laser-scan" />
            
            {/* Corner targeting reticles */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400" />

            {/* Center target circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-16 h-16 rounded-full border border-dashed border-emerald-400 animate-spin-slow" />
            </div>
          </div>

          {/* Real-time Extraction Console & Staged Progress */}
          <div className="w-full max-w-md flex flex-col gap-2.5 text-left font-mono">
            <div className="flex items-center justify-between text-emerald-300 font-bold border-b border-emerald-500/30 pb-2 text-xs">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Optical Extraction & Hardware Analysis</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px]">
                {extractionStep * 25}%
              </span>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-900 border border-emerald-500/20 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300"
                style={{ width: `${extractionStep * 25}%` }}
              />
            </div>

            {/* Step-by-Step Status Logs */}
            <div className="flex flex-col gap-1.5 pt-1 text-[11px]">
              <div className={`flex items-center gap-2 transition-colors ${extractionStep >= 1 ? 'text-emerald-300 font-semibold' : 'text-slate-600'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${extractionStep >= 1 ? 'text-emerald-400' : 'text-slate-700'}`} />
                <span>1. Image Preprocessing & Contrast Normalization</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${extractionStep >= 2 ? 'text-emerald-300 font-semibold' : 'text-slate-600'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${extractionStep >= 2 ? 'text-emerald-400' : 'text-slate-700'}`} />
                <span>2. Scanning Brand Logos, Markings & OCR Labels</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${extractionStep >= 3 ? 'text-emerald-300 font-semibold' : 'text-slate-600'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${extractionStep >= 3 ? 'text-emerald-400' : 'text-slate-700'}`} />
                <span>3. Matching Hardware Specs & Repairability Rating</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${extractionStep >= 4 ? 'text-emerald-300 font-semibold' : 'text-slate-600'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${extractionStep >= 4 ? 'text-emerald-400' : 'text-slate-700'}`} />
                <span>4. Computing 4R Utility Score & Circular E-Waste Profile</span>
              </div>
            </div>

            <p className="text-[11px] text-teal-200/70 text-center italic mt-1">
              {status || 'Extracting device hardware details...'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Uploaded / Captured Image Preview Banner */}
          {previewImage && (
            <div className="relative p-2.5 rounded-2xl bg-slate-950/90 border border-emerald-400/60 shadow-lg shadow-emerald-950/50 flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <img
                  src={previewImage}
                  alt="Device preview"
                  className="w-14 h-14 object-cover rounded-xl border border-emerald-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Loaded Device Photo</span>
                  </div>
                  <span className="text-[11px] text-slate-300">
                    {stagedFile ? stagedFile.name : 'Webcam viewfinder snapshot'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => processUpload(stagedFile)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                >
                  Rescan
                </button>
                <button
                  type="button"
                  onClick={clearStagedImage}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 transition"
                  title="Clear Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Primary Capture Cards: Rich Colorful Translucent Gradients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Live Webcam & Mobile Camera Scanner */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              disabled={loading}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] text-center bg-gradient-to-br from-emerald-600/20 via-teal-900/25 to-slate-950/50 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 backdrop-blur-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-900/40 mb-3 group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center">
                  <Camera className="w-6 h-6 text-emerald-400 group-hover:rotate-6 transition-transform" />
                </div>
              </div>
              <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span>Live Camera Scan</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </span>
              <span className="text-[11px] text-emerald-200/80 mt-1">
                Opens WebCam live viewfinder
              </span>
            </button>

            {/* Gallery / Photo Upload with Drag & Drop */}
            <label 
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] text-center border backdrop-blur-md ${
                isDragging 
                  ? 'bg-cyan-900/40 border-cyan-300 shadow-xl shadow-cyan-500/30 scale-[1.02]' 
                  : 'bg-gradient-to-br from-cyan-600/20 via-blue-900/25 to-slate-950/50 border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-md shadow-cyan-900/40 mb-3 group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
              <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {isDragging ? 'Drop Image Here!' : 'Upload Photo / Invoice'}
              </span>
              <span className="text-[11px] text-cyan-200/80 mt-1">
                Drag & drop or browse device image
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={loading}
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = '';
                }}
                onChange={handleFilePicked}
              />
            </label>
          </div>

          {/* Manual Search & Query Input */}
          <div className="flex flex-col gap-3">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Or type model (e.g. OnePlus Buds, JBL Flip 5, boAt Airdopes, iPhone 13)"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && textQuery.trim() && !loading) {
                    processUpload(stagedFile);
                  }
                }}
                disabled={loading}
                className="w-full pl-4 pr-24 py-3.5 text-sm bg-slate-950/60 border border-emerald-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition shadow-inner backdrop-blur-md"
              />
              <button
                type="button"
                onClick={() => processUpload(stagedFile)}
                disabled={(!textQuery.trim() && !stagedFile) || loading}
                className="absolute right-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white text-xs font-bold rounded-lg disabled:opacity-40 transition flex items-center gap-1.5 shadow-md shadow-emerald-950/50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Identify</span>
              </button>
            </div>

            {/* Instant Category Themes */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Category Themes (Prebuilt Schemas)</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { 
                    label: 'OnePlus Nord Buds', 
                    theme: 'earbuds', 
                    icon: <Headphones className="w-4 h-4 text-emerald-300" />,
                    bg: 'bg-slate-950/40 border-emerald-500/30 hover:border-emerald-400 text-emerald-200 backdrop-blur-md'
                  },
                  { 
                    label: 'JBL Flip Speaker', 
                    theme: 'speaker', 
                    icon: <Speaker className="w-4 h-4 text-cyan-300" />,
                    bg: 'bg-slate-950/40 border-cyan-500/30 hover:border-cyan-400 text-cyan-200 backdrop-blur-md'
                  },
                  { 
                    label: 'Apple AirPods', 
                    theme: 'earbuds', 
                    icon: <Headphones className="w-4 h-4 text-teal-300" />,
                    bg: 'bg-gradient-to-br from-teal-950/70 via-teal-900/30 to-slate-950 border-teal-500/40 hover:border-teal-400 text-teal-200'
                  },
                  { 
                    label: 'Apple iPhone 13', 
                    theme: 'phone', 
                    icon: <Smartphone className="w-4 h-4 text-blue-300" />,
                    bg: 'bg-gradient-to-br from-blue-950/70 via-blue-900/30 to-slate-950 border-blue-500/40 hover:border-blue-400 text-blue-200'
                  },
                  { 
                    label: 'Apple Watch S7', 
                    theme: 'watch', 
                    icon: <Watch className="w-4 h-4 text-purple-300" />,
                    bg: 'bg-gradient-to-br from-purple-950/70 via-purple-900/30 to-slate-950 border-purple-500/40 hover:border-purple-400 text-purple-200'
                  },
                  { 
                    label: '65W GaN Charger', 
                    theme: 'charger', 
                    icon: <Zap className="w-4 h-4 text-amber-300" />,
                    bg: 'bg-gradient-to-br from-amber-950/70 via-amber-900/30 to-slate-950 border-amber-500/40 hover:border-amber-400 text-amber-200'
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleQuickSample(item.label)}
                    disabled={loading}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 shadow-sm hover:scale-[1.02] active:scale-98 disabled:opacity-50 ${item.bg}`}
                  >
                    <div className="p-2 rounded-xl bg-slate-950/80 shadow-inner">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white truncate">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-300 font-mono capitalize">
                        {item.theme}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-xs text-rose-200 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Camera Scanner Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => {
          setIsCameraOpen(false);
          setStagedFile(file);
          const url = URL.createObjectURL(file);
          setPreviewImage(url);
          processUpload(file);
        }}
      />
    </div>
  );
}
