'use client';
import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Sliders, 
  Wrench, 
  Calendar, 
  ShoppingBag, 
  TrendingUp, 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  Phone, 
  ArrowRight,
  Store,
  Truck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { EvaluationResult, ActionRecommendation } from '@/types/circuscan';

interface EvaluationCardProps {
  evaluation: EvaluationResult;
  previewUrl?: string;
  onOpenSurvey: () => void;
  onReset: () => void;
  onOpenSecurity?: () => void;
}

export default function EvaluationCard({
  evaluation,
  previewUrl,
  onOpenSurvey,
  onReset,
  onOpenSecurity
}: EvaluationCardProps) {
  const { 
    gadget, 
    conditionScore, 
    primaryAction, 
    actionReason, 
    estimatedResaleValue, 
    tradeInChannels,
    brandServiceCenter 
  } = evaluation;

  const [selectedChannelCategory, setSelectedChannelCategory] = useState<'All' | 'Doorstep Buyback' | 'Retail Exchange' | 'Refurbished Hub'>('All');

  const getActionConfig = (action: ActionRecommendation) => {
    switch (action) {
      case 'Reuse':
        return {
          title: 'Direct High Value Reuse',
          bgBadge: 'badge-glow-green',
          textColor: 'text-emerald-300',
          ringColor: '#10B981',
          accentBorder: 'border-emerald-500/40',
          gradientBg: 'from-emerald-950/40 to-slate-900/60'
        };
      case 'Repair':
        return {
          title: 'Viable for Repair & Resale',
          bgBadge: 'badge-glow-blue',
          textColor: 'text-blue-300',
          ringColor: '#3B82F6',
          accentBorder: 'border-blue-500/40',
          gradientBg: 'from-blue-950/40 to-slate-900/60'
        };
      case 'Donate':
        return {
          title: 'Community Tech Donation',
          bgBadge: 'badge-glow-amber',
          textColor: 'text-amber-300',
          ringColor: '#F59E0B',
          accentBorder: 'border-amber-500/40',
          gradientBg: 'from-amber-950/40 to-slate-900/60'
        };
      case 'Recycle':
        return {
          title: 'Certified E-Waste Urban Mining',
          bgBadge: 'badge-glow-rose',
          textColor: 'text-rose-300',
          ringColor: '#EF4444',
          accentBorder: 'border-rose-500/40',
          gradientBg: 'from-rose-950/40 to-slate-900/60'
        };
    }
  };

  const actionCfg = getActionConfig(primaryAction);

  // SVG circular gauge math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (conditionScore / 100) * circumference;

  const filteredChannels = (tradeInChannels || []).filter(c => {
    if (selectedChannelCategory === 'All') return true;
    return c.category === selectedChannelCategory;
  });

  return (
    <div className={`w-full max-w-2xl mx-auto glass-panel border ${actionCfg.accentBorder} rounded-3xl p-5 sm:p-7 text-white flex flex-col gap-6 shadow-2xl backdrop-blur-xl animate-fade-in`}>
      {/* Top Header: Verdict Badge & New Scan */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${actionCfg.bgBadge}`}>
            4R Verdict: {primaryAction}
          </span>
          <span className="text-xs font-mono font-bold text-emerald-300">
            Confidence {Math.round(gadget.confidence * 100)}%
          </span>
        </div>

        <button
          onClick={onReset}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 backdrop-blur-md"
          title="New Scan"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>New Scan</span>
        </button>
      </div>

      {/* Main Grid: Device Overview + Circular Score Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
        {/* Gadget Title & Specs */}
        <div className="sm:col-span-2 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-xs uppercase tracking-widest font-mono text-emerald-300 font-bold">
              {gadget.brand}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 capitalize font-medium">
              {gadget.subCategory || gadget.category.replace('_', ' ')}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {gadget.model}
          </h2>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {actionReason}
          </p>

          {/* Device Meta Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-200 backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Released {gadget.releaseYear}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-200 backdrop-blur-md">
              <Wrench className="w-3.5 h-3.5 text-teal-400" />
              <span>Repairability: {gadget.defaultRepairability}/5</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-200 backdrop-blur-md">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <span>MSRP ₹{gadget.estimatedMSRP.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Circular SVG Gauge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/50 border border-white/10 shadow-inner backdrop-blur-md">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-800/80 stroke-current"
                strokeWidth="9"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={actionCfg.ringColor}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white leading-none tracking-tight">
                {conditionScore}
              </span>
              <span className="text-[10px] uppercase font-mono text-emerald-300 font-bold mt-0.5">
                Score / 100
              </span>
            </div>
          </div>

          <button
            onClick={onOpenSurvey}
            className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition active:scale-95"
          >
            <Sliders className="w-3 h-3 text-emerald-400" />
            <span>Refine Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Financial Valuation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Estimated Secondary Market Cash / Trade-In Value</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            {estimatedResaleValue > 0 ? (
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                ₹{estimatedResaleValue.toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-rose-300">Recycling Scrap Recovery</span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Aggregated from Indian secondary electronics indices (Cashify, Amazon Trade-In, Flipkart Reset).
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BRAND OFFICIAL SERVICE CENTER CARD                                        */}
      {/* ========================================================================= */}
      {brandServiceCenter && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-950/60 border border-blue-500/40 flex flex-col gap-3 shadow-lg backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {brandServiceCenter.supportTitle}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                    Official Brand Network
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Genuine parts, certified battery/screen replacement, and warranty validation for {gadget.brand}.
                </p>
              </div>
            </div>

            <a
              href={`tel:${brandServiceCenter.helpline.replace(/\s+/g, '')}`}
              className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{brandServiceCenter.helpline}</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href={brandServiceCenter.officialLocatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30 transition active:scale-95"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Locate Official Service Center</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>

            <a
              href={brandServiceCenter.repairBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-blue-500/30 text-blue-200 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-400" />
              <span>Book Brand Repair Appointment</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>

            {brandServiceCenter.warrantyCheckUrl && (
              <a
                href={brandServiceCenter.warrantyCheckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>Check Warranty Status</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ALL BUYBACK & TRADE-IN CHANNELS                                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Verified Trade-In & Buyback Channels</span>
            </h3>
            <p className="text-xs text-slate-300">
              Compare direct cash payouts, exchange credits, and brand vouchers
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['All', 'Doorstep Buyback', 'Retail Exchange', 'Refurbished Hub'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedChannelCategory(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedChannelCategory === filter
                    ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredChannels.map((channel, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-3 shadow-md backdrop-blur-md group"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {channel.platform}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                    {channel.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {channel.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                  <Truck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Payout: <strong className="text-slate-200">{channel.payoutSpeed}</strong></span>
                </div>
              </div>

              <a
                href={channel.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600 border border-slate-700/60 hover:border-emerald-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span>Check Quote on {channel.platform.split(' ')[0]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Data Sanitization Action Banner */}
      {onOpenSecurity && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Pre-Disposal Data Sanitization Vault</h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  NIST 800-88
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Protect your identity before handover. Clear FRP/iCloud locks, run secure cryptographic erasure, and generate your verifiable <strong>Digital Green Certificate</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSecurity}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-950/50 shrink-0 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sanitize & Get Certificate</span>
          </button>
        </div>
      )}
    </div>
  );
}

