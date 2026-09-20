import { TradeInOption, BrandServiceCenterInfo } from '@/types/circuscan';

export function generateTradeInLinks(brand: string, model: string) {
  const query = encodeURIComponent(`${brand} ${model}`.trim());
  return {
    cashifyUrl: `https://www.cashify.in/sell-old-mobile-phone/search?keyword=${query}`,
    amazonExchangeUrl: `https://www.amazon.in/s?k=${query}+exchange`,
    flipkartRecommerceUrl: `https://www.flipkart.com/search?q=${query}+exchange`,
    cromaExchangeUrl: `https://www.croma.com/searchB?q=${query}`,
    relianceDigitalUrl: `https://www.reliancedigital.in/search?q=${query}`,
    sahivalueUrl: `https://www.sahivalue.com/search?q=${query}`,
  };
}

export function generateTradeInChannels(brand: string, model: string, estimatedValue: number): TradeInOption[] {
  const query = encodeURIComponent(`${brand} ${model}`.trim());

  return [
    {
      platform: 'Cashify India',
      category: 'Doorstep Buyback',
      payoutSpeed: 'Instant UPI / Cash',
      actionUrl: `https://www.cashify.in/sell-old-mobile-phone/search?keyword=${query}`,
      badge: 'Popular Doorstep',
      description: 'Free technician doorstep inspection with instant bank account credit on pickup.'
    },
    {
      platform: 'Amazon India Trade-In',
      category: 'Retail Exchange',
      payoutSpeed: 'Immediate Order Offset',
      actionUrl: `https://www.amazon.in/s?k=${query}+exchange`,
      badge: 'Cart Discount',
      description: 'Exchange discount applied directly against new electronics orders on Amazon India.'
    },
    {
      platform: 'Flipkart Reset Recommerce',
      category: 'Doorstep Buyback',
      payoutSpeed: 'Instant Flipkart Pay / Bank',
      actionUrl: `https://www.flipkart.com/search?q=${query}+exchange`,
      badge: '+500 SuperCoins',
      description: 'Doorstep device pickup with certified diagnostics and guaranteed exchange value.'
    },
    {
      platform: 'Croma Green Exchange',
      category: 'Retail Exchange',
      payoutSpeed: 'In-Store Gift Voucher',
      actionUrl: `https://www.croma.com/searchB?q=${query}`,
      badge: 'Green E-Waste Bonus',
      description: 'Drop off at any Croma megastore for e-waste recycling credits & brand upgrade vouchers.'
    },
    {
      platform: 'Reliance Digital ResQ',
      category: 'Retail Exchange',
      payoutSpeed: 'Same-day Reliance Voucher',
      actionUrl: `https://www.reliancedigital.in/search?q=${query}`,
      badge: 'Official ResQ Partner',
      description: 'Authorized store evaluation across 500+ Reliance Digital stores with certified data wipe.'
    },
    {
      platform: 'SahiValue Refurbished',
      category: 'Refurbished Hub',
      payoutSpeed: '48hr Bank Transfer',
      actionUrl: `https://www.sahivalue.com/search?q=${query}`,
      badge: 'Fair Market Quote',
      description: 'Specialized secondary marketplace for pre-owned phones, audio gear, and laptops.'
    }
  ];
}

export function getBrandServiceCenterInfo(brand: string, model: string): BrandServiceCenterInfo {
  const b = brand.toLowerCase();
  const query = encodeURIComponent(`${brand} ${model} authorized service center near me`);

  if (b.includes('apple')) {
    return {
      brandName: 'Apple India',
      supportTitle: 'Apple Authorized Service Providers (AASP)',
      officialLocatorUrl: 'https://locate.apple.com/in/en/service',
      repairBookingUrl: 'https://support.apple.com/en-in/repair',
      warrantyCheckUrl: 'https://checkcoverage.apple.com/in/en/',
      helpline: '000800 1009009'
    };
  }

  if (b.includes('oneplus')) {
    return {
      brandName: 'OnePlus India',
      supportTitle: 'OnePlus Exclusive Service Centers',
      officialLocatorUrl: 'https://service.oneplus.com/in/service-center',
      repairBookingUrl: 'https://service.oneplus.com/in/repair',
      warrantyCheckUrl: 'https://service.oneplus.com/in/warranty-check',
      helpline: '1800 102 8411'
    };
  }

  if (b.includes('samsung')) {
    return {
      brandName: 'Samsung India',
      supportTitle: 'Samsung Smart Care Centers',
      officialLocatorUrl: 'https://www.samsung.com/in/support/service-centre/',
      repairBookingUrl: 'https://www.samsung.com/in/support/book-a-repair/',
      warrantyCheckUrl: 'https://www.samsung.com/in/support/your-service/warranty-check',
      helpline: '1800 5726 7864'
    };
  }

  if (b.includes('boat')) {
    return {
      brandName: 'boAt Lifestyle',
      supportTitle: 'boAt Authorized Care Hubs',
      officialLocatorUrl: 'https://support.boat-lifestyle.com/',
      repairBookingUrl: 'https://support.boat-lifestyle.com/',
      warrantyCheckUrl: 'https://warranty.boat-lifestyle.com/',
      helpline: '022-6918-1920'
    };
  }

  if (b.includes('xiaomi') || b.includes('redmi') || b.includes('poco')) {
    return {
      brandName: 'Xiaomi India',
      supportTitle: 'Mi Authorized Service Centers',
      officialLocatorUrl: 'https://www.mi.com/in/service/repair/',
      repairBookingUrl: 'https://service.mi.com/in/repair-appointment',
      warrantyCheckUrl: 'https://www.mi.com/in/service/imei',
      helpline: '1800 103 6286'
    };
  }

  if (b.includes('realme')) {
    return {
      brandName: 'Realme India',
      supportTitle: 'Realme Exclusive Service Centers',
      officialLocatorUrl: 'https://www.realme.com/in/support/services',
      repairBookingUrl: 'https://www.realme.com/in/support/repair',
      warrantyCheckUrl: 'https://www.realme.com/in/support/phonecheck',
      helpline: '1800 102 2777'
    };
  }

  if (b.includes('vivo')) {
    return {
      brandName: 'Vivo India',
      supportTitle: 'Vivo Authorized Customer Care',
      officialLocatorUrl: 'https://www.vivo.com/in/support/service-center',
      repairBookingUrl: 'https://www.vivo.com/in/support/appointment',
      warrantyCheckUrl: 'https://www.vivo.com/in/support/IMEI',
      helpline: '1800 208 3388'
    };
  }

  if (b.includes('oppo')) {
    return {
      brandName: 'Oppo India',
      supportTitle: 'Oppo Official Care Centers',
      officialLocatorUrl: 'https://support.oppo.com/in/service-center/',
      repairBookingUrl: 'https://support.oppo.com/in/send-in-repair/',
      warrantyCheckUrl: 'https://support.oppo.com/in/warranty-check/',
      helpline: '1800 103 2777'
    };
  }

  return {
    brandName: `${brand} Official Support`,
    supportTitle: `${brand} Authorized Service & Spares`,
    officialLocatorUrl: `https://www.google.com/maps/search/${query}`,
    repairBookingUrl: `https://www.google.com/search?q=${encodeURIComponent(`${brand} authorized customer care booking`)}`,
    helpline: '1800-Authorized-Care'
  };
}
