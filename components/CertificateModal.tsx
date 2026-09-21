'use client';
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Award, 
  Printer, 
  Share2, 
  Check, 
  QrCode, 
  Leaf, 
  Sparkles, 
  Copy 
} from 'lucide-react';
import { DisposalCertificate } from '@/types/circuscan';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: DisposalCertificate | null;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificate
}: CertificateModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://circuscan.app/verify/${certificate.certificateId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white max-h-[92vh] flex flex-col gap-4 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Digital Green Certificate</h3>
              <p className="text-[11px] text-slate-400">Verifiable Circular Disposal & Sanitization Pass</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card Container */}
        <div 
          id="printable-certificate"
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden flex flex-col gap-4"
        >
          {/* Background watermark badge */}
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-emerald-400" />
          </div>

          {/* Certificate Header Banner */}
          <div className="flex items-start justify-between border-b border-emerald-500/20 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  CircuScan Circular Pass
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Certificate of Safe Circular Handover
              </h2>
            </div>

            {/* Verification Stamp */}
            <div className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] text-center">
              <span>STATUS</span>
              <div className="font-extrabold text-[11px]">VERIFIED</div>
            </div>
          </div>

          {/* Certificate Body Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Device Description</span>
              <strong className="text-white font-semibold text-sm">
                {certificate.deviceBrand} {certificate.deviceModel}
              </strong>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Action Route</span>
              <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>{certificate.actionTaken} Protocol</span>
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Certificate ID</span>
              <span className="font-mono text-slate-300 text-[11px] font-bold">
                {certificate.certificateId}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Issue Timestamp</span>
              <span className="text-slate-300 text-[11px]">
                {new Date(certificate.issueDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </div>

          {/* Environmental Dividends */}
          <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] uppercase font-mono text-emerald-300">CO₂ Abated</span>
              <div className="text-base font-extrabold text-white">
                {certificate.co2SavedKg.toFixed(1)} kg
              </div>
            </div>
            <div className="w-px h-8 bg-emerald-500/20" />
            <div>
              <span className="text-[10px] uppercase font-mono text-teal-300">Landfill Diverted</span>
              <div className="text-base font-extrabold text-white">
                {certificate.eWasteDivertedKg.toFixed(2)} kg
              </div>
            </div>
            <div className="w-px h-8 bg-emerald-500/20" />
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-300">Data Sanitization</span>
              <div className="text-base font-extrabold text-emerald-400">
                {certificate.sanitizationScore}% NIST
              </div>
            </div>
          </div>

          {/* Cryptographic Hash & Verification Badge */}
          <div className="flex items-center justify-between border-t border-emerald-500/20 pt-3 text-[10px] text-slate-400 font-mono">
            <div className="flex flex-col gap-0.5 max-w-[260px] truncate">
              <span>SHA-256 Tamper Hash:</span>
              <span className="text-emerald-400 truncate text-[9px]">{certificate.verificationHash}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[9px] text-slate-300">
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>SCAN TO AUDIT</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Audit Link'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-950/50"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
