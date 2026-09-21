'use client';
import React from 'react';
import { 
  Camera, 
  History, 
  ShieldCheck, 
  User, 
  Coins 
} from 'lucide-react';

export type AppTab = 'scan' | 'vault' | 'security' | 'profile';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  savedCount: number;
  ecoCredits: number;
}

export default function BottomNav({
  activeTab,
  onSelectTab,
  savedCount,
  ecoCredits
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-white sm:hidden px-3 py-2">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 items-center">
        
        {/* TAB 1: SCAN */}
        <button
          onClick={() => onSelectTab('scan')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'scan'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'scan' ? 'bg-emerald-500/20' : ''}`}>
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Scan</span>
        </button>

        {/* TAB 2: VAULT / HISTORY */}
        <button
          onClick={() => onSelectTab('vault')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition relative ${
            activeTab === 'vault'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition relative ${activeTab === 'vault' ? 'bg-emerald-500/20' : ''}`}>
            <History className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Vault</span>
        </button>

        {/* TAB 3: SECURITY */}
        <button
          onClick={() => onSelectTab('security')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'security'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'security' ? 'bg-emerald-500/20' : ''}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Security</span>
        </button>

        {/* TAB 4: PROFILE */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition relative ${
            activeTab === 'profile'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${activeTab === 'profile' ? 'bg-emerald-500/20' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>

      </div>
    </div>
  );
}
