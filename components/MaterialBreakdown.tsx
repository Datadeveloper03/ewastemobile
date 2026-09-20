'use client';
import React from 'react';
import { ShieldAlert, BatteryCharging, AlertTriangle, Gem, Layers } from 'lucide-react';
import { EWasteComposition } from '@/types/circuscan';

interface MaterialBreakdownProps {
  composition: EWasteComposition;
}

export default function MaterialBreakdown({ composition }: MaterialBreakdownProps) {
  const { lithiumBattery, heavyMetals, preciousMetals } = composition;

  return (
    <div className="w-full max-w-xl mx-auto glass-panel border border-emerald-500/20 rounded-3xl p-5 sm:p-7 text-white flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              E-Waste Composition & Toxic Profile
            </h3>
            <p className="text-xs text-slate-300">
              Chemical constituents & circular mineral recovery inventory
            </p>
          </div>
        </div>

        {lithiumBattery && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-glow-rose text-[11px] font-black">
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>Lithium-Ion Hazard</span>
          </span>
        )}
      </div>

      {/* Grid: Hazardous vs Precious */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hazardous & Heavy Metals */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 via-rose-900/20 to-slate-950 border border-rose-500/30 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Hazardous Contaminants</span>
          </div>
          <p className="text-[11px] text-rose-200/70 leading-snug">
            Requires controlled neutralization to prevent groundwater leaching:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {heavyMetals && heavyMetals.length > 0 ? (
              heavyMetals.map((metal, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-mono font-bold shadow-sm"
                >
                  {metal}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No volatile heavy metals detected</span>
            )}
            {lithiumBattery && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-mono font-bold shadow-sm">
                Li-Ion Cobalt Oxide
              </span>
            )}
          </div>
        </div>

        {/* Precious & Recoverable Metals */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 via-amber-900/20 to-slate-950 border border-amber-500/30 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Gem className="w-4 h-4 text-amber-400" />
            <span>Recoverable Precious Elements</span>
          </div>
          <p className="text-[11px] text-amber-200/70 leading-snug">
            Recovers circular virgin-grade minerals without carbon-intensive mining:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {preciousMetals && preciousMetals.length > 0 ? (
              preciousMetals.map((metal, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-mono font-bold shadow-sm"
                >
                  {metal}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Ferrous & plastic polymers only</span>
            )}
          </div>
        </div>
      </div>

      {/* Safety Guideline Note */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong className="text-emerald-300 font-bold">Zero-Landfill Protocol:</strong> Never throw electronic hardware into household municipal garbage. Drop off at any certified recycling point to guarantee hydrometallurgical closed-loop recovery.
        </span>
      </div>
    </div>
  );
}
