'use client';
import React from 'react';
import { Leaf, CloudRain, ShieldCheck, Gem, Magnet } from 'lucide-react';
import { EvaluationResult } from '@/types/circuscan';

interface ImpactMetricsProps {
  evaluation: EvaluationResult;
}

export default function ImpactMetrics({ evaluation }: ImpactMetricsProps) {
  const { environmentalImpact } = evaluation;

  return (
    <div className="w-full max-w-xl mx-auto glass-panel border border-teal-500/30 rounded-3xl p-5 sm:p-7 text-white flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Circular Environmental Dividends
            </h3>
            <p className="text-xs text-teal-200/70">
              Direct ecological savings achieved through this 4R triage decision
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-glow-green text-[11px] font-black">
          <span>Verified 4R Footprint</span>
        </span>
      </div>

      {/* Metric 4-Box Grid with Vibrant Theme Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* CO2 Saved */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/70 via-teal-900/30 to-slate-950 border border-teal-500/40 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-teal-300 font-bold">
            <CloudRain className="w-4 h-4 text-teal-400" />
            <span>CO₂ Avoided</span>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {environmentalImpact.co2SavedKg} <span className="text-xs font-normal text-teal-300">kg</span>
          </div>
          <p className="text-[10px] text-teal-200/70 font-medium">Embodied carbon offset</p>
        </div>

        {/* E-Waste Diverted */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-emerald-900/30 to-slate-950 border border-emerald-500/40 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Landfill Saved</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300">
            {environmentalImpact.eWasteDivertedKg} <span className="text-xs font-normal text-emerald-300">kg</span>
          </div>
          <p className="text-[10px] text-emerald-200/70 font-medium">Zero toxins into soil</p>
        </div>

        {/* Gold Recovered */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/70 via-amber-900/30 to-slate-950 border border-amber-500/40 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
            <Gem className="w-4 h-4 text-amber-400" />
            <span>Gold Saved</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">
            {environmentalImpact.goldRecoveredMg} <span className="text-xs font-normal text-amber-300">mg</span>
          </div>
          <p className="text-[10px] text-amber-200/70 font-medium">Virgin mining averted</p>
        </div>

        {/* Copper Recovered */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/70 via-orange-900/30 to-slate-950 border border-orange-500/40 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-orange-300 font-bold">
            <Magnet className="w-4 h-4 text-orange-400" />
            <span>Pure Copper</span>
          </div>
          <div className="text-2xl font-black font-mono text-orange-300">
            {environmentalImpact.copperRecoveredGrams} <span className="text-xs font-normal text-orange-300">g</span>
          </div>
          <p className="text-[10px] text-orange-200/70 font-medium">Recycled coil conductor</p>
        </div>
      </div>
    </div>
  );
}
