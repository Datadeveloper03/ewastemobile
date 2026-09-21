export type GadgetCategory = 
  | 'smartphones' 
  | 'audio' 
  | 'chargers_adapters' 
  | 'wearables' 
  | 'cables' 
  | 'other';

export type GadgetSubCategory = 
  | 'phone' 
  | 'earbuds' 
  | 'speaker' 
  | 'headphones' 
  | 'smartwatch' 
  | 'charger' 
  | 'cable' 
  | 'other';

export type ActionRecommendation = 'Reuse' | 'Repair' | 'Donate' | 'Recycle';

export interface EWasteComposition {
  lithiumBattery: boolean;
  heavyMetals: string[];     // e.g., ["Lead", "Mercury", "Cadmium"]
  preciousMetals: string[];  // e.g., ["Gold traces", "Silver", "Copper coil"]
}

export interface GadgetSpecs {
  category: GadgetCategory;
  subCategory?: string; // e.g. 'earbuds' | 'speaker' | 'phone' | 'smartwatch' | 'charger'
  brand: string;
  model: string;
  releaseYear: number;
  confidence: number;
  eWasteComposition: EWasteComposition;
  defaultRepairability: number; // 1 - 5 scale
  estimatedMSRP: number;        // in INR (₹)
}

export interface ConditionSurvey {
  powersOn: boolean;
  screenOrBodyDamaged: boolean;
  batteryHealthIntact: boolean;
  hasAccessoriesOrBox: boolean;
  ageYears: number;
  detailedAnswers?: Record<string, boolean>; // Category-specific schema answers
}

export interface NearbyFacility {
  name: string;
  type: 'Repair' | 'Recycler' | 'Collection_Bin';
  address: string;
  distanceKm: number;
  contact?: string;
  timings?: string;
  verifiedGovt?: boolean;
  brandAuthorized?: string;
  lat: number;
  lng: number;
}

export interface TradeInOption {
  platform: string;
  category: 'Doorstep Buyback' | 'Retail Exchange' | 'Brand Care' | 'Refurbished Hub';
  payoutSpeed: string;
  actionUrl: string;
  badge: string;
  description: string;
}

export interface BrandServiceCenterInfo {
  brandName: string;
  supportTitle: string;
  officialLocatorUrl: string;
  repairBookingUrl: string;
  warrantyCheckUrl?: string;
  helpline: string;
}

export interface EvaluationResult {
  gadget: GadgetSpecs;
  conditionScore: number;       // 0 - 100
  primaryAction: ActionRecommendation;
  actionReason: string;
  estimatedResaleValue: number; // in INR (₹)
  nearbyCenters: NearbyFacility[];
  tradeInLinks: {
    cashifyUrl: string;
    amazonExchangeUrl: string;
    flipkartRecommerceUrl: string;
    cromaExchangeUrl: string;
    relianceDigitalUrl: string;
    sahivalueUrl: string;
  };
  tradeInChannels: TradeInOption[];
  brandServiceCenter: BrandServiceCenterInfo;
  environmentalImpact: {
    co2SavedKg: number;
    eWasteDivertedKg: number;
    goldRecoveredMg: number;
    copperRecoveredGrams: number;
  };
}

export interface TriageRecord {
  id: string;
  timestamp: string;
  evaluation: EvaluationResult;
  survey: ConditionSurvey;
}

export type EcoTier = 'Eco Explorer' | 'Green Guardian' | 'Circularity Champion' | 'Zero-Waste Master';

export interface UserProfile {
  name: string;
  handle: string;
  avatarSeed: string;
  ecoCredits: number;
  ecoTier: EcoTier;
  memberSince: string;
  badges: Array<{
    id: string;
    label: string;
    icon: string;
    description: string;
    unlockedAt?: string;
  }>;
}

export interface SanitizationItem {
  id: string;
  title: string;
  category: 'cloud' | 'storage' | 'hardware' | 'security';
  description: string;
  standard: string; // e.g. "NIST 800-88 Clear"
  completed: boolean;
}

export interface DisposalCertificate {
  certificateId: string;
  deviceBrand: string;
  deviceModel: string;
  deviceCategory: string;
  issueDate: string;
  actionTaken: ActionRecommendation;
  sanitizationScore: number;
  verificationHash: string;
  co2SavedKg: number;
  eWasteDivertedKg: number;
  authorizedPartner: string;
}

