'use client';
import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Smartphone,
  Headphones,
  Speaker,
  Watch,
  Zap,
  Cpu,
  PackageCheck
} from 'lucide-react';
import { ConditionSurvey, GadgetSpecs, ActionRecommendation } from '@/types/circuscan';
import { computeResidualScore } from '@/lib/scoring';
import { getQuestionnaireForDevice, CategoryQuestionnaire } from '@/lib/schemaQuestions';

interface ConditionSurveyModalProps {
  gadget: GadgetSpecs;
  initialSurvey?: ConditionSurvey;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (survey: ConditionSurvey) => void;
}

export default function ConditionSurveyModal({
  gadget,
  initialSurvey,
  isOpen,
  onClose,
  onSubmit
}: ConditionSurveyModalProps) {
  const questionnaire: CategoryQuestionnaire = getQuestionnaireForDevice(gadget.category, gadget.model);

  // Initialize detailedAnswers map from questionnaire questions (default all true / working)
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
    ageYears: Math.max(0.5, new Date().getFullYear() - (gadget.releaseYear || 2021)),
    detailedAnswers: defaultDetailedAnswers()
  });

  useEffect(() => {
    if (initialSurvey) {
      setSurvey({
        ...initialSurvey,
        detailedAnswers: initialSurvey.detailedAnswers || defaultDetailedAnswers()
      });
    } else {
      setSurvey({
        powersOn: true,
        screenOrBodyDamaged: false,
        batteryHealthIntact: true,
        hasAccessoriesOrBox: true,
        ageYears: Math.max(0.5, new Date().getFullYear() - (gadget.releaseYear || 2021)),
        detailedAnswers: defaultDetailedAnswers()
      });
    }
  }, [gadget, initialSurvey]);

  if (!isOpen) return null;

  // Real-time calculation preview
  const previewScore = computeResidualScore(
    survey, 
    gadget.category, 
    gadget.defaultRepairability, 
    gadget.model
  );

  const getBadgeColor = (action: ActionRecommendation) => {
    switch (action) {
      case 'Reuse': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Repair': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Donate': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Recycle': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
  };

  const getCategoryIcon = () => {
    switch (questionnaire.icon) {
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Headphones': return <Headphones className="w-4 h-4 text-teal-400" />;
      case 'Speaker': return <Speaker className="w-4 h-4 text-cyan-400" />;
      case 'Watch': return <Watch className="w-4 h-4 text-purple-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      default: return <Cpu className="w-4 h-4 text-emerald-400" />;
    }
  };

  const toggleQuestion = (id: string, value: boolean) => {
    setSurvey(prev => {
      const updated = { ...(prev.detailedAnswers || {}) };
      updated[id] = value;

      // Also sync standard survey fields
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono uppercase tracking-wider font-semibold mb-1">
              {getCategoryIcon()}
              <span>{questionnaire.badge}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {gadget.brand} {gadget.model}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Answer the prebuilt diagnostic checks below to compute the exact 4R circular utility score.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Residual Score Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-slate-800/80 flex flex-col items-center justify-center border border-slate-700">
              <span className="text-xl font-black text-white leading-none">
                {previewScore.score}
              </span>
              <span className="text-[9px] uppercase font-mono text-slate-400 mt-0.5">/ 100</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Computed 4R Verdict</div>
              <span className={`inline-flex items-center px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-bold border ${getBadgeColor(previewScore.action)}`}>
                {previewScore.action}
              </span>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-400 max-w-[190px] leading-tight hidden sm:block">
            {previewScore.reason}
          </div>
        </div>

        {/* Prebuilt Schema Questions */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Targeted Hardware Diagnostics ({questionnaire.questions.length} checks)</span>
          </div>

          {questionnaire.questions.map((q) => {
            const isWorking = survey.detailedAnswers?.[q.id] ?? true;

            return (
              <div
                key={q.id}
                className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <div className="text-sm font-semibold text-white leading-snug">
                    {q.label}
                  </div>
                  <div className="text-xs text-slate-400 leading-tight">
                    {q.description}
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleQuestion(q.id, true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isWorking
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Yes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleQuestion(q.id, false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      !isWorking
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>No / Defect</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Original Accessories & Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Original Box & Accessories Included?</div>
                <div className="text-xs text-slate-400">Includes original packaging, cables, or retail accessories</div>
              </div>
            </div>

            <div className="flex gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setSurvey(s => ({ ...s, hasAccessoriesOrBox: true }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  survey.hasAccessoriesOrBox
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setSurvey(s => ({ ...s, hasAccessoriesOrBox: false }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  !survey.hasAccessoriesOrBox
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Age Slider */}
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Device Age & Purchase Timeline</span>
              </div>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {survey.ageYears} {survey.ageYears === 1 ? 'Year' : 'Years'}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={survey.ageYears}
              onChange={(e) => setSurvey(s => ({ ...s, ageYears: parseFloat(e.target.value) }))}
              className="w-full accent-emerald-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 yr (&lt;6 mos)</span>
              <span>2 yrs</span>
              <span>4 yrs</span>
              <span>7+ yrs (E-Waste)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setSurvey({
              powersOn: true,
              screenOrBodyDamaged: false,
              batteryHealthIntact: true,
              hasAccessoriesOrBox: true,
              ageYears: Math.max(0.5, new Date().getFullYear() - (gadget.releaseYear || 2021)),
              detailedAnswers: defaultDetailedAnswers()
            })}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={() => onSubmit(survey)}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition active:scale-98"
          >
            <span>Confirm Diagnostics & View Complete 4R Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
