'use client';
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from '@/components/Header';
import ScanDevice from '@/components/ScanDevice';
import DiagnosticStep from '@/components/DiagnosticStep';
import EvaluationCard from '@/components/EvaluationCard';
import MaterialBreakdown from '@/components/MaterialBreakdown';
import FacilityLocator from '@/components/FacilityLocator';
import ImpactMetrics from '@/components/ImpactMetrics';
import DeviceHistory from '@/components/DeviceHistory';
import ApiKeyModal from '@/components/ApiKeyModal';
import SavingsBackground from '@/components/SavingsBackground';
import VideoBackground from '@/components/VideoBackground';
import { GadgetSpecs, ConditionSurvey, EvaluationResult, TriageRecord } from '@/types/circuscan';
import { computeResidualScore, computeResaleValue } from '@/lib/scoring';
import { generateTradeInLinks, generateTradeInChannels, getBrandServiceCenterInfo } from '@/lib/tradein';
import { getNearbyFacilitiesByPincode } from '@/lib/locations';
import { computeEnvironmentalImpact } from '@/lib/impact';
import { Recycle, Sparkles, ShieldCheck, Zap, ArrowLeft, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'circuscan_history_v1';
const API_KEY_STORAGE = 'circuscan_gemini_key';

type StepType = 'scan' | 'diagnostic' | 'evaluation';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepType>('scan');
  const [currentSpecs, setCurrentSpecs] = useState<GadgetSpecs | null>(null);
  const [currentSurvey, setCurrentSurvey] = useState<ConditionSurvey | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [scanHistory, setScanHistory] = useState<TriageRecord[]>([]);

  // Load history and API key from localStorage
  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem(STORAGE_KEY);
      if (rawHistory) {
        setScanHistory(JSON.parse(rawHistory));
      }
      const savedKey = localStorage.getItem(API_KEY_STORAGE);
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (e) {
      console.error('Failed to load storage state:', e);
    }
  }, []);

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    try {
      if (newKey) {
        localStorage.setItem(API_KEY_STORAGE, newKey);
      } else {
        localStorage.removeItem(API_KEY_STORAGE);
      }
    } catch (e) {
      console.error('Failed to save API key:', e);
    }
  };

  const saveRecordToHistory = (evalResult: EvaluationResult, survey: ConditionSurvey) => {
    const newRecord: TriageRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      evaluation: evalResult,
      survey
    };

    setScanHistory(prev => {
      const updated = [newRecord, ...prev.slice(0, 19)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  const calculateFullEvaluation = async (
    specs: GadgetSpecs,
    survey: ConditionSurvey
  ): Promise<EvaluationResult> => {
    const residual = computeResidualScore(
      survey, 
      specs.category, 
      specs.defaultRepairability, 
      specs.model
    );
    const resale = computeResaleValue(specs.estimatedMSRP, residual.score);
    const tradeLinks = generateTradeInLinks(specs.brand, specs.model);
    const tradeChannels = generateTradeInChannels(specs.brand, specs.model, resale);
    const brandService = getBrandServiceCenterInfo(specs.brand, specs.model);
    const facilities = await getNearbyFacilitiesByPincode('600001');
    const impact = computeEnvironmentalImpact(specs.category, residual.action);

    return {
      gadget: specs,
      conditionScore: residual.score,
      primaryAction: residual.action,
      actionReason: residual.reason,
      estimatedResaleValue: resale,
      nearbyCenters: facilities,
      tradeInLinks: tradeLinks,
      tradeInChannels: tradeChannels,
      brandServiceCenter: brandService,
      environmentalImpact: impact
    };
  };

  const handleScanComplete = (specs: GadgetSpecs, imagePreview?: string) => {
    setCurrentSpecs(specs);
    if (imagePreview) setPreviewUrl(imagePreview);

    const defaultSurvey: ConditionSurvey = {
      powersOn: true,
      screenOrBodyDamaged: false,
      batteryHealthIntact: true,
      hasAccessoriesOrBox: true,
      ageYears: Math.max(0.5, new Date().getFullYear() - (specs.releaseYear || 2022))
    };

    setCurrentSurvey(defaultSurvey);
    // Transition smoothly to Step 2: Diagnostic Assessment
    setCurrentStep('diagnostic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSurveySubmit = async (updatedSurvey: ConditionSurvey) => {
    if (!currentSpecs) return;
    setCurrentSurvey(updatedSurvey);

    const evaluation = await calculateFullEvaluation(currentSpecs, updatedSurvey);
    setCurrentEvaluation(evaluation);
    saveRecordToHistory(evaluation, updatedSurvey);

    // Transition to Step 3: Evaluation Report
    setCurrentStep('evaluation');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger celebratory confetti for circular dividend calculation
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#06B6D4']
      });
    } catch {}
  };

  const handleSelectHistoryRecord = (record: TriageRecord) => {
    setCurrentSpecs(record.evaluation.gadget);
    setCurrentSurvey(record.survey);
    setCurrentEvaluation(record.evaluation);
    setCurrentStep('evaluation');
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleReset = () => {
    setCurrentSpecs(null);
    setCurrentSurvey(null);
    setCurrentEvaluation(null);
    setPreviewUrl(null);
    setCurrentStep('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* ========================================================================= */}
      {/* 1. DYNAMIC BACKGROUND LAYERS ACCORDING TO CURRENT STEP                    */}
      {/* ========================================================================= */}

      {/* Step 1 Background: videofirst.mp4 with ultra-translucent cinematic overlay */}
      {currentStep === 'scan' && <VideoBackground src="/videofirst.mp4" stepName="scan" />}

      {/* Step 2 Background: videosecond.mp4 with diagnostic cinematic overlay */}
      {currentStep === 'diagnostic' && <VideoBackground src="/videosecond.mp4" stepName="diagnostic" />}

      {/* Step 3 Background: video third.mp4 for estimation and mapping report */}
      {currentStep === 'evaluation' && <VideoBackground src="/videothird.mp4" stepName="evaluation" />}

      <div className="relative z-10 flex flex-col min-h-screen">

      {/* ========================================================================= */}
      {/* 2. STICKY TOP HEADER                                                      */}
      {/* ========================================================================= */}
      <Header 
        savedCount={scanHistory.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        hasApiKey={Boolean(apiKey)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 3. MAIN STEP CONTAINER                                                    */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 z-10">
        
        {/* STEP 1: SCAN & UPLOAD FLOW */}
        {currentStep === 'scan' && (
          <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in">
            {/* Clean Hero Presentation */}
            <div className="text-center flex flex-col items-center gap-3 pt-2 sm:pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Recycle className="w-3.5 h-3.5 animate-spin-slow text-emerald-400" />
                <span>National Circular Electronics Triage Engine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight max-w-2xl leading-tight">
                Turn Old Electronics into <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Cash, Repurpose, or Certified Recycling
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Multimodal AI vision & edge OCR triage for smartphones, audio earbuds, speakers, smartwatches, and fast chargers.
              </p>
            </div>

            {/* Smart Scanner Card */}
            <ScanDevice 
              onScanComplete={handleScanComplete}
              apiKey={apiKey}
              onOpenKeyModal={() => setIsKeyModalOpen(true)}
            />

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-emerald-500/20">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Live Multimodal Vision</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Real-time edge OCR and Google Gemini Flash identification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-teal-500/20 backdrop-blur-md flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Prebuilt Category Schemas</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tailored diagnostic checks for phones, earbuds, speakers, and wearables.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">4R Utility & Buyback</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deterministic mathematical scoring with Cashify & Amazon trade-in links.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DIAGNOSTIC INSPECTION QUESTIONNAIRE */}
        {currentStep === 'diagnostic' && currentSpecs && (
          <DiagnosticStep
            gadget={currentSpecs}
            initialSurvey={currentSurvey || undefined}
            previewUrl={previewUrl}
            onBackToScan={() => setCurrentStep('scan')}
            onSubmit={handleSurveySubmit}
          />
        )}

        {/* STEP 3: VALUATION REPORT & ENVIRONMENTAL SAVINGS */}
        {currentStep === 'evaluation' && currentEvaluation && (
          <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in">
            {/* Stepper Navigation Bar */}
            <div className="flex items-center justify-between px-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Step 3 of 3 • Circular Valuation & E-Waste Report</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep('diagnostic')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/70 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 backdrop-blur-md"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Adjust Answers</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/90 border border-emerald-500 hover:bg-emerald-500 text-xs text-white font-semibold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/50"
                >
                  <span>Scan Next Device</span>
                </button>
              </div>
            </div>

            {/* 1. Evaluation Card */}
            <EvaluationCard
              evaluation={currentEvaluation}
              previewUrl={previewUrl || undefined}
              onOpenSurvey={() => setCurrentStep('diagnostic')}
              onReset={handleReset}
            />

            {/* 2. E-Waste Material & Toxic Profile */}
            <MaterialBreakdown composition={currentEvaluation.gadget.eWasteComposition} />

            {/* 3. Circular Environmental Impact Dividends */}
            <ImpactMetrics evaluation={currentEvaluation} />

            {/* 4. Indian Pincode Drop-off & Repair Locator */}
            <FacilityLocator initialFacilities={currentEvaluation.nearbyCenters} />
          </div>
        )}
      </main>

      {/* History Drawer */}
      <DeviceHistory
        isOpen={isHistoryOpen}
        history={scanHistory}
        onClose={() => setIsHistoryOpen(false)}
        onSelectRecord={handleSelectHistoryRecord}
        onClearHistory={handleClearHistory}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={apiKey}
      />
      </div>
    </div>
  );
}
