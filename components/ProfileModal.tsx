'use client';
import React, { useState } from 'react';
import { 
  User, 
  X, 
  Award, 
  Leaf, 
  Coins, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Gift, 
  ExternalLink,
  Edit2,
  Save
} from 'lucide-react';
import { UserProfile, TriageRecord, EcoTier } from '@/types/circuscan';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  history: TriageRecord[];
}

export default function ProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  history
}: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [activeTab, setActiveTab] = useState<'stats' | 'rewards' | 'badges'>('stats');

  if (!isOpen) return null;

  // Aggregate cumulative lifetime impact
  const totalScans = history.length;
  const totalCo2 = history.reduce((acc, h) => acc + (h.evaluation.environmentalImpact?.co2SavedKg || 0), 0);
  const totalDivertedKg = history.reduce((acc, h) => acc + (h.evaluation.environmentalImpact?.eWasteDivertedKg || 0), 0);
  const totalValueInr = history.reduce((acc, h) => acc + (h.evaluation.estimatedResaleValue || 0), 0);

  // Compute tier progress
  const getTierProgress = (credits: number): { nextTier: string; needed: number; pct: number } => {
    if (credits < 250) return { nextTier: 'Green Guardian', needed: 250 - credits, pct: Math.min(100, Math.round((credits / 250) * 100)) };
    if (credits < 750) return { nextTier: 'Circularity Champion', needed: 750 - credits, pct: Math.min(100, Math.round(((credits - 250) / 500) * 100)) };
    if (credits < 1500) return { nextTier: 'Zero-Waste Master', needed: 1500 - credits, pct: Math.min(100, Math.round(((credits - 750) / 750) * 100)) };
    return { nextTier: 'Maximum Level', needed: 0, pct: 100 };
  };

  const tierInfo = getTierProgress(profile.ecoCredits);

  const handleSaveName = () => {
    onUpdateProfile({ name: editName.trim() || 'Eco Warrior', handle: editHandle.trim() || '@circular_citizen' });
    setIsEditing(false);
  };

  const rewards = [
    { id: 'rw1', title: '₹250 Extra on Cashify Buyback', cost: 150, partner: 'Cashify', code: 'CIRCUCASH250' },
    { id: 'rw2', title: '15% Off Authorized Screen/Battery Repair', cost: 200, partner: 'Brand Care', code: 'ECOREPAIR15' },
    { id: 'rw3', title: 'Free Home E-Waste Pickup Pass', cost: 100, partner: 'EcoRecycle India', code: 'GREENPICKUP' },
    { id: 'rw4', title: '₹500 Croma Green Exchange Voucher', cost: 400, partner: 'Croma', code: 'CROMAECO500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] flex flex-col gap-4 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Eco-Identity & Profile</h3>
              <p className="text-[11px] text-slate-400">CircuScan Citizen Profile & Impact Wallet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950/80 to-slate-900/90 border border-emerald-500/20 shadow-inner flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-950/50 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-emerald-300 text-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-800 text-white text-xs px-2 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
                      placeholder="Your Name"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                      title="Save"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-white text-sm sm:text-base">{profile.name}</h4>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-slate-400 hover:text-emerald-300 transition"
                      title="Edit Name"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-slate-400">{profile.handle}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {profile.ecoTier}
                  </span>
                </div>
              </div>
            </div>

            {/* Eco Credits Pill */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-emerald-400 font-extrabold text-base">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{profile.ecoCredits}</span>
              </div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Eco-Credits</span>
            </div>
          </div>

          {/* Tier Progress Bar */}
          {tierInfo.needed > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Next Rank: <strong className="text-emerald-300">{tierInfo.nextTier}</strong></span>
                <span>{tierInfo.needed} pts needed</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${tierInfo.pct}%` }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-1.5 rounded-lg font-medium transition ${
              activeTab === 'stats' 
                ? 'bg-slate-800 text-emerald-300 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Impact Stats
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-1.5 rounded-lg font-medium transition ${
              activeTab === 'rewards' 
                ? 'bg-slate-800 text-emerald-300 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Eco Rewards
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-1.5 rounded-lg font-medium transition ${
              activeTab === 'badges' 
                ? 'bg-slate-800 text-emerald-300 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Badges ({profile.badges.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: CUMULATIVE STATS */}
          {activeTab === 'stats' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Devices Triaged</span>
                  </div>
                  <span className="text-xl font-extrabold text-white">{totalScans}</span>
                  <span className="text-[10px] text-slate-500">Total verified scans</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CO₂ Abated</span>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-400">{totalCo2.toFixed(1)} kg</span>
                  <span className="text-[10px] text-slate-500">~{Math.round(totalCo2 * 0.05)} tree-equivalents</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>E-Waste Diverted</span>
                  </div>
                  <span className="text-xl font-extrabold text-teal-300">{totalDivertedKg.toFixed(2)} kg</span>
                  <span className="text-[10px] text-slate-500">Saved from landfills</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Recovered Value</span>
                  </div>
                  <span className="text-xl font-extrabold text-cyan-300">₹{totalValueInr.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-500">Estimated trade-in cash</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
                <span className="text-base">🌱</span>
                <span>
                  Every scan and triage action adds <strong>+50 Eco-Credits</strong> to your wallet and updates your cumulative circular footprint.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: ECO REWARDS */}
          {activeTab === 'rewards' && (
            <div className="flex flex-col gap-2.5">
              <p className="text-xs text-slate-400 mb-1">
                Redeem your earned Eco-Credits for discounts and perks across partner recycling & repair hubs:
              </p>
              {rewards.map((rw) => {
                const canRedeem = profile.ecoCredits >= rw.cost;
                return (
                  <div 
                    key={rw.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{rw.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-emerald-400 font-mono font-bold">{rw.partner}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Coins className="w-3 h-3" /> {rw.cost} pts
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={!canRedeem}
                      onClick={() => alert(`Coupon code unlocked: ${rw.code} - Applied for ${rw.partner}!`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        canRedeem
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem ? 'Claim' : 'Locked'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: BADGES */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 gap-2">
              {profile.badges.map((b) => (
                <div 
                  key={b.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-xs font-bold text-white">{b.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{b.description}</p>
                  <span className="text-[9px] text-emerald-400 font-mono mt-auto">
                    ✓ Unlocked {b.unlockedAt ? new Date(b.unlockedAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>CircuScan Citizen ID: <strong className="font-mono text-slate-400">CS-{profile.handle.replace('@', '')}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
