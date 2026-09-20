'use client';
import React from 'react';
import { Recycle, Sparkles, History, Key, Check } from 'lucide-react';

interface HeaderProps {
  onOpenHistory?: () => void;
  savedCount?: number;
  onReset?: () => void;
  hasApiKey?: boolean;
  onOpenKeyModal?: () => void;
}

export default function Header({
  onOpenHistory,
  savedCount = 0,
  onReset,
  hasApiKey = false,
  onOpenKeyModal
}: HeaderProps) {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Recycle className="w-5 h-5 text-emerald-400 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                CircuScan
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Circular Electronics & E-Waste Triage</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* API Key Configure Button */}
          {onOpenKeyModal && (
            <button
              onClick={onOpenKeyModal}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition active:scale-95 ${
                hasApiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
              }`}
              title="AI Scanner Status (Click to configure Gemini API Key)"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {hasApiKey ? 'Gemini Flash AI' : '⚡ AI Active (Free Mode)'}
              </span>
              <Check className="w-3 h-3 text-emerald-400 hidden sm:inline" />
            </button>
          )}

          {/* History Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition active:scale-95 flex items-center gap-1.5 text-xs font-medium"
              title="View Scan History"
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span className="hidden xs:inline">History</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
