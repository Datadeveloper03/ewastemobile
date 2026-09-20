'use client';
import React, { useState, useEffect } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export default function ApiKeyModal({ isOpen, onClose, onSaveKey, currentKey }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(currentKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setApiKey(currentKey);
    setTestResult(null);
    setErrorMessage('');
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      onSaveKey('');
      onClose();
      return;
    }

    setTesting(true);
    setTestResult(null);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('textQuery', 'Apple AirPods');
      formData.append('apiKey', trimmed);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setTestResult('success');
        onSaveKey(trimmed);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error('API key rejected by Google Gemini endpoint.');
      }
    } catch (err: any) {
      setTestResult('error');
      setErrorMessage(err.message || 'Verification failed. Please check the API key.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">Enables live multimodal zero-shot Vision AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice explaining zero key requirement */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Good News: No API Key Required!</span>
          </div>
          <p className="text-[11px] text-emerald-100/80 leading-relaxed">
            CircuScan works 100% out of the box for OnePlus, Apple, boAt, JBL, Samsung, chargers, and e-waste triage using its built-in circular intelligence engine. You only need a Gemini key if you want custom multimodal vision for rare or unlisted devices.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 font-mono">
            Optional: Google Gemini API Key (starts with AIzaSy...)
          </label>
          <input
            type="password"
            placeholder="Paste your Gemini API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-950/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        {/* Free Key Link */}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-medium"
        >
          <span>Get a Free Google Gemini API Key at AI Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Success or Error Status */}
        {testResult === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 font-medium">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Key verified and connected successfully!</span>
          </div>
        )}

        {testResult === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-xs text-red-300 font-medium">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Continue in Free Mode</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTestAndSave}
              disabled={testing}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-98"
            >
              {testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating...</span>
                </>
              ) : (
                <span>Save & Connect</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
