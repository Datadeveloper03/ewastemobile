import { ConditionSurvey, GadgetCategory, ActionRecommendation } from '@/types/circuscan';
import { getQuestionnaireForDevice } from './schemaQuestions';

export function computeResidualScore(
  survey: ConditionSurvey, 
  category: GadgetCategory,
  defaultRepairability: number,
  modelName: string = ''
): { score: number; action: ActionRecommendation; reason: string } {
  // 1. Functional & Aesthetic components (1 to 5)
  let functional = 1;
  let aesthetic = survey.screenOrBodyDamaged ? 2 : 5;

  if (survey.detailedAnswers && Object.keys(survey.detailedAnswers).length > 0) {
    const qData = getQuestionnaireForDevice(category, modelName);
    let funcScore = 1;
    let funcMax = 1;
    let aesthScore = 1;
    let aesthMax = 1;

    for (const q of qData.questions) {
      const isYes = survey.detailedAnswers[q.id] ?? true;
      if (q.type === 'functional') {
        funcMax += q.weight;
        if (isYes) funcScore += q.weight;
      } else {
        aesthMax += q.weight;
        if (isYes) aesthScore += q.weight;
      }
    }

    if (defaultRepairability >= 3) {
      funcScore += 0.5;
    }
    funcMax += 0.5;

    functional = Math.max(1, Math.min(5, (funcScore / funcMax) * 5));
    aesthetic = Math.max(1, Math.min(5, (aesthScore / aesthMax) * 5));
  } else {
    if (survey.powersOn) functional += 2;
    if (survey.batteryHealthIntact) functional += 1;
    if (defaultRepairability >= 3) functional += 1;
    functional = Math.max(1, Math.min(5, functional));
  }

  // 3. Category degradation constants (lambda)
  const lambdaMap: Record<GadgetCategory, number> = {
    smartphones: 0.16,
    audio: 0.10,
    chargers_adapters: 0.05,
    wearables: 0.18,
    cables: 0.03,
    other: 0.12
  };
  const lambda = lambdaMap[category] ?? 0.12;

  // 4. Score calculation (Weights: 75% Functional, 25% Aesthetic)
  const baseUtility = (0.75 * (functional / 5)) + (0.25 * (aesthetic / 5));
  const timeDecay = Math.exp(-lambda * Math.max(0.5, survey.ageYears));
  
  const rawScore = Math.round(100 * baseUtility * timeDecay);
  const score = Math.max(0, Math.min(100, rawScore));

  let action: ActionRecommendation;
  let reason = '';

  if (score >= 70) {
    action = 'Reuse';
    reason = 'The gadget holds high functional and resale value. Prioritize buyback platforms or trade-in exchanges.';
  } else if (score >= 45) {
    action = 'Repair';
    reason = 'Core electronics are viable. Minor repairs (screen/battery swap) can extend device lifespan.';
  } else if (score >= 20) {
    action = 'Donate';
    reason = 'Low commercial market value, but operational for school repurposing or community tech drives.';
  } else {
    action = 'Recycle';
    reason = 'End-of-life status. Contains hazardous toxins and precious metals requiring certified chemical extraction.';
  }

  return { score, action, reason };
}

export function computeResaleValue(msrp: number, residualScore: number): number {
  if (residualScore < 20) return 0;
  // Non-linear pricing curve based on residual utility score
  const priceFraction = (residualScore / 100) ** 1.35;
  const estimated = Math.round((msrp * priceFraction) / 100) * 100;
  return Math.max(150, Math.min(msrp * 0.85, estimated));
}
