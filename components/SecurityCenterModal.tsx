'use client';
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Smartphone, 
  Laptop, 
  HardDrive, 
  KeyRound, 
  ExternalLink,
  Info
} from 'lucide-react';
import { SanitizationItem, GadgetSpecs } from '@/types/circuscan';

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGadget?: GadgetSpecs | null;
  onGenerateCertificate: (sanitizationScore: number) => void;
}

const DEFAULT_CHECKLIST: SanitizationItem[] = [
  {
    id: 'reset',
    title: 'NIST 800-88 Cryptographic Factory Reset',
    category: 'storage',
    description: 'Perform a complete factory reset from System Settings. This overwrites the encryption keys, rendering residual data irrecoverable.',
    standard: 'NIST SP 800-88 Rev 1',
    completed: false
  },
  {
    id: 'cloud_lock',
    title: 'Unlink iCloud / Google Account / FRP Lock',
    category: 'cloud',
    description: 'Sign out of Apple ID (Find My) or Google Account. Failure to remove this bricks the device for reuse or refurbished donation.',
    standard: 'FRP / Activation Lock Clearance',
    completed: false
  },
  {
    id: 'cards',
    title: 'Eject Physical SIM & MicroSD / Dongles',
    category: 'hardware',
    description: 'Check SIM trays, SD card slots, and USB adapters. Remove all external storage media to prevent personal media leakage.',
    standard: 'Physical Media Inspection',
    completed: false
  },
  {
    id: 'auth_2fa',
    title: 'De-authorize 2FA & Banking Tokens',
    category: 'security',
    description: 'Transfer Google/Microsoft Authenticator keys and remove device from trusted multi-factor authenticators in banking portals.',
    standard: 'Identity Protection Standard',
    completed: false
  },
  {
    id: 'unpair',
    title: 'Unpair Bluetooth & Peripheral Ecosystem',
    category: 'hardware',
    description: 'Disconnect paired smartwatches, car infotainment, and earbuds so they do not attempt automatic background re-pairing.',
    standard: 'Peripheral Sanctity',
    completed: false
  }
];

export default function SecurityCenterModal({
  isOpen,
  onClose,
  activeGadget,
  onGenerateCertificate
}: SecurityCenterModalProps) {
  const [checklist, setChecklist] = useState<SanitizationItem[]>(DEFAULT_CHECKLIST);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  const handleGenerate = () => {
    onGenerateCertificate(progressPct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] flex flex-col gap-4 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Security & Sanitization Vault</h3>
              <p className="text-[11px] text-slate-400">NIST 800-88 Data Wipe & Identity Shield</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Device Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              {activeGadget?.category === 'smartphones' ? (
                <Smartphone className="w-4 h-4" />
              ) : activeGadget?.category === 'cables' || activeGadget?.category === 'chargers_adapters' ? (
                <HardDrive className="w-4 h-4" />
              ) : (
                <Laptop className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">Target Device</span>
              <h4 className="text-xs font-bold text-white">
                {activeGadget ? `${activeGadget.brand} ${activeGadget.model}` : 'Generic Electronic Device'}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 font-mono">{progressPct}%</span>
            <p className="text-[10px] text-slate-400">Sanitized</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              progressPct === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Informative Tip */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Never hand over electronics without removing Cloud/FRP locks. Unwiped devices risk identity theft and cannot be safely refurbished.
          </span>
        </div>

        {/* Interactive Checklist */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 select-none ${
                item.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>

              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold ${item.completed ? 'text-emerald-300' : 'text-white'}`}>
                    {item.title}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.standard}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500">
            {completedCount}/{checklist.length} Steps Cleared
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Close
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Green Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
