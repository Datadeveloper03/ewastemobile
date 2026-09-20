import { GadgetCategory, ActionRecommendation } from '@/types/circuscan';

export interface EnvironmentalImpact {
  co2SavedKg: number;
  eWasteDivertedKg: number;
  goldRecoveredMg: number;
  copperRecoveredGrams: number;
}

const CATEGORY_IMPACT_MULTIPLIERS: Record<GadgetCategory, {
  eWasteKg: number;
  co2Kg: number;
  goldMg: number;
  copperGrams: number;
}> = {
  smartphones: { eWasteKg: 0.19, co2Kg: 58.0, goldMg: 34.0, copperGrams: 16.0 },
  audio: { eWasteKg: 0.25, co2Kg: 18.5, goldMg: 8.5, copperGrams: 28.0 },
  chargers_adapters: { eWasteKg: 0.12, co2Kg: 6.2, goldMg: 1.2, copperGrams: 42.0 },
  wearables: { eWasteKg: 0.08, co2Kg: 24.0, goldMg: 15.0, copperGrams: 9.0 },
  cables: { eWasteKg: 0.06, co2Kg: 2.1, goldMg: 0.4, copperGrams: 35.0 },
  other: { eWasteKg: 0.35, co2Kg: 22.0, goldMg: 10.0, copperGrams: 25.0 }
};

export function computeEnvironmentalImpact(
  category: GadgetCategory,
  action: ActionRecommendation
): EnvironmentalImpact {
  const base = CATEGORY_IMPACT_MULTIPLIERS[category] || CATEGORY_IMPACT_MULTIPLIERS.other;

  let factor = 1.0;
  if (action === 'Reuse') factor = 1.0;       // 100% replacement offset
  else if (action === 'Repair') factor = 0.85; // 85% lifecycle extension offset
  else if (action === 'Donate') factor = 0.90; // 90% social utility & deferred replacement
  else factor = 0.65;                          // 65% raw material chemical extraction recovery

  return {
    co2SavedKg: Math.round(base.co2Kg * factor * 10) / 10,
    eWasteDivertedKg: Math.round(base.eWasteKg * factor * 100) / 100,
    goldRecoveredMg: Math.round(base.goldMg * factor * 10) / 10,
    copperRecoveredGrams: Math.round(base.copperGrams * factor * 10) / 10,
  };
}
