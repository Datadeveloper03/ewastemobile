'use client';
import React from 'react';
import { History, X, Trash2, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { TriageRecord } from '@/types/circuscan';

interface DeviceHistoryProps {
  isOpen: boolean;
  history: TriageRecord[];
  onClose: () => void;
  onSelectRecord: (record: TriageRecord) => void;
  onClearHistory: () => void;
}

export default function DeviceHistory({
  isOpen,
  history,
  onClose,
  onSelectRecord,
  onClearHistory
}: DeviceHistoryProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white max-h-[85vh] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Scan History & Saved Logs</h3>
              <p className="text-xs text-slate-400">Locally archived circular triage evaluations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
          {history.length > 0 ? (
            history.map((record) => {
              const { evaluation, timestamp } = record;
              const { gadget, conditionScore, primaryAction } = evaluation;

              const getBadgeColor = () => {
                switch (primaryAction) {
                  case 'Reuse': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  case 'Repair': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                  case 'Donate': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                  case 'Recycle': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                }
              };

              return (
                <div
                  key={record.id}
                  onClick={() => {
                    onSelectRecord(record);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                        {gadget.brand} {gadget.model}
                      </span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${getBadgeColor()}`}>
                        {primaryAction}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>Score: {conditionScore}/100</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              No devices scanned yet. Take a photo or search a model to begin!
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-medium">
              {history.length} {history.length === 1 ? 'device' : 'devices'} recorded
            </span>
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
