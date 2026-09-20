'use client';
import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  Sparkles,
  Smartphone,
  Headphones,
  Speaker,
  Watch,
  Zap,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { ConditionSurvey, GadgetSpecs, ActionRecommendation } from '@/types/circuscan';
import { computeResidualScore } from '@/lib/scoring';
import { getQuestionnaireForDevice, CategoryQuestionnaire } from '@/lib/schemaQuestions';

interface DiagnosticStepProps {
  gadget: GadgetSpecs;
  initialSurvey?: ConditionSurvey;
  previewUrl?: string | null;
  onBackToScan: () => void;
  onSubmit: (survey: ConditionSurvey) => void;
  onChangeCategory?: (newCategory: string) => void;
}

export default function DiagnosticStep({
  gadget,
  initialSurvey,
  previewUrl,
  onBackToScan,
  onSubmit,
  onChangeCategory
}: DiagnosticStepProps) {
  const questionnaire: CategoryQuestionnaire = getQuestionnaireForDevice(gadget.category, gadget.model);

  const defaultDetailedAnswers = () => {
    const map: Record<string, boolean> = {};
    for (const q of questionnaire.questions) {
      map[q.id] = true;
    }
    return map;
  };

  const [survey, setSurvey] = useState<ConditionSurvey>(initialSurvey || {
    powersOn: true,
    screenOrBodyDamaged: false,
    batteryHealthIntact: true,
    hasAccessoriesOrBox: true,
    ageYears: Math.max(0.5, new Date().getFullYear() - (gadget.releaseYear || 2022)),
    detailedAnswers: defaultDetailedAnswers()
  });

  // Calculate live preview score
  const liveScore = computeResidualScore(
    survey, 
    gadget.category, 
    gadget.defaultRepairability, 
    gadget.model
  );

  const getActionBadge = (action: ActionRecommendation) => {
    switch (action) {
      case 'Reuse':
        return {
          bg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
          dot: 'bg-emerald-400',
          text: 'Recommended: Buyback / Direct Reuse'
        };
      case 'Repair':
        return {
          bg: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
          dot: 'bg-blue-400',
          text: 'Recommended: Component Repair & Servicing'
        };
      case 'Donate':
        return {
          bg: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
          dot: 'bg-amber-400',
          text: 'Recommended: Social / Community Donation'
        };
      case 'Recycle':
        return {
          bg: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
          dot: 'bg-rose-400',
          text: 'Recommended: Certified Urban Mining & Recycling'
        };
    }
  };

  const currentBadge = getActionBadge(liveScore.action);

  const getCategoryIcon = () => {
    switch (gadget.category) {
      case 'smartphones': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'audio': return gadget.subCategory === 'speaker' ? <Speaker className="w-4 h-4 text-cyan-400" /> : <Headphones className="w-4 h-4 text-teal-400" />;
      case 'wearables': return <Watch className="w-4 h-4 text-purple-400" />;
      case 'chargers_adapters': return <Zap className="w-4 h-4 text-amber-400" />;
      default: return <Cpu className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleToggle = (id: string, value: boolean) => {
    setSurvey(prev => {
      const updated = { ...(prev.detailedAnswers || {}) };
      updated[id] = value;

      const hasDamaged = questionnaire.questions.some(
        q => q.type === 'aesthetic' && updated[q.id] === false
      );
      const isPowerDead = questionnaire.questions.some(
        q => (q.id.includes('power') || q.id.includes('display')) && updated[q.id] === false
      );
      const isBatteryBad = questionnaire.questions.some(
        q => q.id.includes('battery') && updated[q.id] === false
      );

      return {
        ...prev,
        detailedAnswers: updated,
        screenOrBodyDamaged: hasDamaged,
        powersOn: !isPowerDead,
        batteryHealthIntact: !isBatteryBad
      };
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-slide-up pb-10">
      {/* Top Stepper Indicator */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onBackToScan}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Rescan Device</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Step 2 of 3 • Hardware Inspection</span>
        </div>
      </div>

      {/* Identified Device Hero Card */}
      <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-emerald-500/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt={gadget.model} 
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-emerald-500/40 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              {getCategoryIcon()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold">
                {getCategoryIcon()}
                <span className="capitalize">{gadget.brand || 'Detected Gadget'}</span>
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                Launch: ₹{gadget.estimatedMSRP.toLocaleString('en-IN')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {gadget.model}
            </h2>
            <p className="text-xs text-slate-200 mt-0.5 font-medium">
              Confirm current condition checks below to compute certified resale & recycling tier.
            </p>
          </div>
        </div>

        {/* Live Score Pill */}
        <div className="w-full sm:w-auto p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex sm:flex-col items-center justify-between sm:justify-center gap-1 min-w-[120px] backdrop-blur-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
            Live 4R Score
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {liveScore.score}
            </span>
            <span className="text-xs text-slate-400 font-mono">/100</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentBadge.bg}`}>
            {liveScore.action}
          </span>
        </div>
      </div>

      {/* Category Schema Diagnostic Questions */}
      <div className="p-5 sm:p-7 rounded-3xl glass-panel border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {questionnaire.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select the operational state for each component
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {questionnaire.questions.length} Diagnostic Checks
          </span>
        </div>

        {/* Question Rows */}
        <div className="flex flex-col gap-3">
          {questionnaire.questions.map((q, idx) => {
            const isWorking = (survey.detailedAnswers?.[q.id] ?? true) === true;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isWorking 
                    ? 'bg-slate-950/70 border-emerald-500/30' 
                    : 'bg-rose-950/20 border-rose-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                    isWorking ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {q.label}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {q.description}
                    </p>
                  </div>
                </div>

                {/* Tactile Toggle Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(q.id, true)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isWorking 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-400' 
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Working</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(q.id, false)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      !isWorking 
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-950 border border-rose-400' 
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Damaged</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Device Age Slider */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-semibold text-white">
                Device Age Since Purchase
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-300">
              {survey.ageYears} {survey.ageYears === 1 ? 'Year' : 'Years'}
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="7"
            step="0.5"
            value={survey.ageYears}
            onChange={(e) => setSurvey(s => ({ ...s, ageYears: parseFloat(e.target.value) }))}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>&lt;6 mos (New)</span>
            <span>2 Years</span>
            <span>4 Years</span>
            <span>6+ Years (Legacy)</span>
          </div>
        </div>

        {/* Action Footer Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Deterministic 4R circular scoring formula ready</span>
          </div>

          <button
            type="button"
            onClick={() => onSubmit(survey)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition active:scale-[0.98]"
          >
            <span>View Full 4R Valuation & Dividends Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
