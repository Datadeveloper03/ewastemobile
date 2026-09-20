export interface DiagnosticQuestion {
  id: string;
  label: string;
  description: string;
  type: 'functional' | 'aesthetic';
  weight: number; // 1 to 5 contribution
}

export interface CategoryQuestionnaire {
  categoryKey: string;
  title: string;
  badge: string;
  icon: string;
  questions: DiagnosticQuestion[];
}

export const CATEGORY_QUESTIONNAIRES: Record<string, CategoryQuestionnaire> = {
  smartphones: {
    categoryKey: 'smartphones',
    title: 'Smartphone Hardware Diagnostic',
    badge: 'Mobile Phone Schema',
    icon: 'Smartphone',
    questions: [
      {
        id: 'phone_display',
        label: 'Display & Touch Digitizer Fully Working?',
        description: 'Screen illuminates with no vertical green/pink lines, black ink spots, or touch deadzones.',
        type: 'functional',
        weight: 1.5,
      },
      {
        id: 'phone_glass',
        label: 'Screen & Rear Glass Free of Cracks?',
        description: 'No deep spiderweb cracks or glass shards peeling off front or back panels.',
        type: 'aesthetic',
        weight: 1.0,
      },
      {
        id: 'phone_battery',
        label: 'Battery Health Above 75%?',
        description: 'Holds charge throughout normal daily usage without sudden drops from 30% to 0%.',
        type: 'functional',
        weight: 1.0,
      },
      {
        id: 'phone_cameras_biometrics',
        label: 'Cameras & Biometrics (Face/Fingerprint) Functional?',
        description: 'Rear autofocus works, front camera operates, and security sensor unlocks device.',
        type: 'functional',
        weight: 0.8,
      },
      {
        id: 'phone_port',
        label: 'Charging Port & Speakers Intact?',
        description: 'USB-C/Lightning connector charges without loose wiggling, and speaker sounds clear.',
        type: 'functional',
        weight: 0.7,
      },
    ],
  },

  earbuds: {
    categoryKey: 'earbuds',
    title: 'TWS Earbuds & Case Diagnostic',
    badge: 'True Wireless Audio Schema',
    icon: 'Headphones',
    questions: [
      {
        id: 'buds_both_audio',
        label: 'Both Left & Right Buds Produce Balanced Audio?',
        description: 'Both earbuds connect, output sound at equal volume, and have no silent dead channel.',
        type: 'functional',
        weight: 1.8,
      },
      {
        id: 'buds_charging_case',
        label: 'Charging Case Battery & Magnetic Contacts Working?',
        description: 'Case charges the earbuds, battery LED status lights up, and lid hinge closes securely.',
        type: 'functional',
        weight: 1.2,
      },
      {
        id: 'buds_mics',
        label: 'Microphones & Voice Calls Clear?',
        description: 'Callers can hear your voice clearly without muffled distortion or loud buzzing.',
        type: 'functional',
        weight: 0.8,
      },
      {
        id: 'buds_mesh',
        label: 'Acoustic Grille Mesh & Casing Intact?',
        description: 'Earbud plastic is not split open and fine acoustic wax filter mesh is in place.',
        type: 'aesthetic',
        weight: 1.2,
      },
    ],
  },

  speaker: {
    categoryKey: 'speaker',
    title: 'Bluetooth Speaker Diagnostic',
    badge: 'Wireless Speaker Schema',
    icon: 'Speaker',
    questions: [
      {
        id: 'speaker_sound',
        label: 'Clear Sound at High Volume Without Buzzing?',
        description: 'No distorted buzzing, torn driver cones, or blown subwoofer rattles at 70%+ volume.',
        type: 'functional',
        weight: 1.8,
      },
      {
        id: 'speaker_battery',
        label: 'Internal Battery Plays for 3+ Hours Unplugged?',
        description: 'Holds portable battery charge without immediately dying when disconnected from wall.',
        type: 'functional',
        weight: 1.2,
      },
      {
        id: 'speaker_bluetooth',
        label: 'Bluetooth Pairing & Physical Buttons Responsive?',
        description: 'Pairs smoothly with phones and power/volume control buttons actuate properly.',
        type: 'functional',
        weight: 1.0,
      },
      {
        id: 'speaker_casing',
        label: 'Fabric Grille & Passive Bass Radiators Intact?',
        description: 'No punctured rubber passive radiators or rusted metal mesh grilles.',
        type: 'aesthetic',
        weight: 1.0,
      },
    ],
  },

  wearables: {
    categoryKey: 'wearables',
    title: 'Smartwatch & Band Diagnostic',
    badge: 'Wearables Sensor Schema',
    icon: 'Watch',
    questions: [
      {
        id: 'watch_display',
        label: 'OLED/LCD Display & Touch Screen Fully Responsive?',
        description: 'No screen burn-in, vertical color bars, and swipes register accurately across screen.',
        type: 'functional',
        weight: 1.6,
      },
      {
        id: 'watch_sensors',
        label: 'Optical Heart Rate & SpO2 Sensors Functional?',
        description: 'Green/infrared LEDs on backplate illuminate and report valid physiological data.',
        type: 'functional',
        weight: 1.2,
      },
      {
        id: 'watch_battery',
        label: 'Battery Lasts a Full Working Day?',
        description: 'Operates continuously without overheating against wrist or dying within hours.',
        type: 'functional',
        weight: 1.2,
      },
      {
        id: 'watch_glass',
        label: 'Top Glass & Rear Sensor Ceramic Free of Deep Cracks?',
        description: 'Water-resistant seal intact and sensor glass in contact with skin is not cracked.',
        type: 'aesthetic',
        weight: 1.0,
      },
    ],
  },

  chargers_cables: {
    categoryKey: 'chargers_cables',
    title: 'Power Adapter & Fast Charger Diagnostic',
    badge: 'Power & GaN Schema',
    icon: 'Zap',
    questions: [
      {
        id: 'charger_fast_charge',
        label: 'Negotiates Full Fast Charging (PD / QC / GaN)?',
        description: 'Delivers full rapid power without intermittent disconnecting or voltage drops.',
        type: 'functional',
        weight: 2.0,
      },
      {
        id: 'charger_pins',
        label: 'Wall Prongs & USB Ports Firm and Secure?',
        description: 'Wall plug prongs are not loose or bent; USB-C / USB-A port ports grip cables firmly.',
        type: 'functional',
        weight: 1.2,
      },
      {
        id: 'charger_safety',
        label: 'Operates Without Excessive Heat or High-Pitched Coil Whine?',
        description: 'No electrical sparks, abnormal thermal burning smell, or audible coil screeching.',
        type: 'functional',
        weight: 1.0,
      },
      {
        id: 'cable_sheath',
        label: 'Outer Rubber / Braided Jacket Free of Exposed Copper?',
        description: 'No ripped strain reliefs, fraying, or exposed live conductive wire.',
        type: 'aesthetic',
        weight: 0.8,
      },
    ],
  },

  general: {
    categoryKey: 'general',
    title: 'General Electronic Gadget Diagnostic',
    badge: 'Universal Hardware Schema',
    icon: 'Cpu',
    questions: [
      {
        id: 'gen_power',
        label: 'Powers On & Indicator Lights Turn On?',
        description: 'Device powers up from cold start and indicator LEDs confirm operation.',
        type: 'functional',
        weight: 2.0,
      },
      {
        id: 'gen_battery',
        label: 'Battery / Power Supply Runs Stably?',
        description: 'Does not suddenly power down or restart during active usage.',
        type: 'functional',
        weight: 1.5,
      },
      {
        id: 'gen_controls',
        label: 'Primary Switches, Knobs & Connectors Functional?',
        description: 'Mechanical and electrical controls respond accurately.',
        type: 'functional',
        weight: 1.0,
      },
      {
        id: 'gen_casing',
        label: 'Outer Chassis & Housing Structurally Intact?',
        description: 'No broken clips, gaping openings, or loose internal rattle.',
        type: 'aesthetic',
        weight: 0.5,
      },
    ],
  },
};

export function getQuestionnaireForDevice(
  category: string,
  modelName: string = ''
): CategoryQuestionnaire {
  const normCategory = (category || '').toLowerCase();
  const normModel = (modelName || '').toLowerCase();

  // Check audio subtypes: speaker vs earbuds
  if (
    normCategory === 'audio' ||
    normCategory.includes('audio') ||
    normCategory.includes('headphone')
  ) {
    if (
      normModel.includes('speaker') ||
      normModel.includes('soundbar') ||
      normModel.includes('flip') ||
      normModel.includes('charge') ||
      normModel.includes('boom') ||
      normModel.includes('stone') ||
      normModel.includes('go') ||
      normModel.includes('jbl')
    ) {
      return CATEGORY_QUESTIONNAIRES.speaker;
    }
    // TWS earbuds / in-ear / headphones
    return CATEGORY_QUESTIONNAIRES.earbuds;
  }

  if (normCategory === 'smartphones' || normCategory.includes('phone')) {
    return CATEGORY_QUESTIONNAIRES.smartphones;
  }

  if (
    normCategory === 'wearables' ||
    normCategory.includes('watch') ||
    normCategory.includes('band')
  ) {
    return CATEGORY_QUESTIONNAIRES.wearables;
  }

  if (
    normCategory === 'chargers_adapters' ||
    normCategory === 'cables' ||
    normCategory.includes('charger') ||
    normCategory.includes('cable') ||
    normCategory.includes('adapter')
  ) {
    return CATEGORY_QUESTIONNAIRES.chargers_cables;
  }

  return CATEGORY_QUESTIONNAIRES.general;
}
