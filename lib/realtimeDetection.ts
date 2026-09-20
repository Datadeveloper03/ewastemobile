import { createWorker } from 'tesseract.js';
import { GadgetSpecs, GadgetCategory, GadgetSubCategory } from '@/types/circuscan';

interface RealtimeSearchResult {
  title: string;
  snippet: string;
}

// Live search using DuckDuckGo HTML
export async function searchDuckDuckGo(query: string): Promise<RealtimeSearchResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' price specs india')}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(/class="result__title"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const snippetMatch = html.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    if (title || snippet) {
      return { title, snippet };
    }
    return null;
  } catch (err) {
    console.warn('DuckDuckGo search error/timeout:', err);
    return null;
  }
}

import path from 'path';

// Extract text from image buffer via Tesseract OCR
export async function extractOcrFromBuffer(buffer: Buffer): Promise<string> {
  try {
    const workerPath = path.join(
      process.cwd(),
      'node_modules',
      'tesseract.js',
      'src',
      'worker-script',
      'node',
      'index.js'
    );
    const worker = await createWorker('eng', 1, {
      workerPath,
    });
    const ret = await worker.recognize(buffer);
    await worker.terminate();
    return ret.data.text ? ret.data.text.trim() : '';
  } catch (err) {
    console.warn('Tesseract OCR error:', err);
    return '';
  }
}

// Brand detection dictionary
const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Redmi', 'Realme', 'Vivo', 'Oppo',
  'Google', 'Motorola', 'Sony', 'Asus', 'Poco', 'iQOO', 'Nothing', 'Nokia',
  'JBL', 'boAt', 'Noise', 'Boult', 'Fire-Boltt', 'Anker', 'Belkin', 'Boat'
];

export async function detectDeviceRealtime(
  imageBuffer: Buffer | null,
  fileName: string = '',
  userText: string = '',
  aspectRatio: number = 1.0
): Promise<GadgetSpecs> {
  let extractedOcr = '';

  if (imageBuffer && imageBuffer.length > 0) {
    extractedOcr = await extractOcrFromBuffer(imageBuffer);
  }

  const combinedText = `${userText} ${fileName} ${extractedOcr}`.toLowerCase();

  // 1. Identify Brand
  let detectedBrand = 'Generic';
  for (const brand of KNOWN_BRANDS) {
    if (combinedText.includes(brand.toLowerCase())) {
      detectedBrand = brand === 'Boat' ? 'boAt' : brand;
      break;
    }
  }

  // 2. Identify Category and SubCategory
  let category: GadgetCategory = 'smartphones';
  let subCategory: GadgetSubCategory = 'phone';

  const isPhone = 
    combinedText.includes('phone') ||
    combinedText.includes('mobile') ||
    combinedText.includes('smartphone') ||
    combinedText.includes('galaxy') ||
    combinedText.includes('iphone') ||
    combinedText.includes('redmi') ||
    combinedText.includes('realme') ||
    combinedText.includes('pixel') ||
    combinedText.includes('vivo') ||
    combinedText.includes('oppo') ||
    combinedText.includes('poco') ||
    combinedText.includes('moto') ||
    combinedText.includes('android') ||
    combinedText.includes('display') ||
    combinedText.includes('screen') ||
    aspectRatio > 1.45 || aspectRatio < 0.65; // Typical tall smartphone aspect ratio

  const isEarbuds = 
    !isPhone && (
      combinedText.includes('earbud') ||
      combinedText.includes('tws') ||
      combinedText.includes('airpod') ||
      combinedText.includes('buds') ||
      combinedText.includes('airdopes') ||
      combinedText.includes('in-ear') ||
      (combinedText.includes('oneplus') && !combinedText.includes('phone') && !combinedText.includes('mobile'))
    );

  const isSpeaker = 
    !isPhone && !isEarbuds && (
      combinedText.includes('speaker') ||
      combinedText.includes('soundbar') ||
      combinedText.includes('jbl') ||
      combinedText.includes('flip') ||
      combinedText.includes('stone')
    );

  const isWatch = 
    !isPhone && !isEarbuds && !isSpeaker && (
      combinedText.includes('watch') ||
      combinedText.includes('smartwatch') ||
      combinedText.includes('band')
    );

  const isCharger = 
    !isPhone && !isEarbuds && !isSpeaker && !isWatch && (
      combinedText.includes('charger') ||
      combinedText.includes('adapter') ||
      combinedText.includes('gan') ||
      combinedText.includes('power bank')
    );

  const isCable = 
    !isPhone && !isEarbuds && !isSpeaker && !isWatch && !isCharger && (
      combinedText.includes('cable') ||
      combinedText.includes('wire') ||
      combinedText.includes('cord')
    );

  if (isEarbuds) {
    category = 'audio';
    subCategory = 'earbuds';
  } else if (isSpeaker) {
    category = 'audio';
    subCategory = 'speaker';
  } else if (isWatch) {
    category = 'wearables';
    subCategory = 'smartwatch';
  } else if (isCharger) {
    category = 'chargers_adapters';
    subCategory = 'charger';
  } else if (isCable) {
    category = 'cables';
    subCategory = 'cable';
  } else {
    category = 'smartphones';
    subCategory = 'phone';
  }

  // 3. Search DuckDuckGo for live real-time details
  const searchQuery = [detectedBrand !== 'Generic' ? detectedBrand : '', subCategory, userText]
    .filter(Boolean)
    .join(' ');

  const searchResult = searchQuery.trim() ? await searchDuckDuckGo(searchQuery) : null;

  // 4. Synthesize Model Name & Pricing
  let modelName = '';
  let estimatedMSRP = 19999;
  let releaseYear = 2022;

  if (category === 'smartphones') {
    if (detectedBrand === 'Apple') {
      modelName = combinedText.includes('14') ? 'Apple iPhone 14' : combinedText.includes('15') ? 'Apple iPhone 15' : 'Apple iPhone 13';
      estimatedMSRP = 69900;
      releaseYear = 2021;
    } else if (detectedBrand === 'Samsung') {
      modelName = combinedText.includes('ultra') ? 'Samsung Galaxy S23 Ultra' : combinedText.includes('a') ? 'Samsung Galaxy A34 5G' : 'Samsung Galaxy 5G Smartphone';
      estimatedMSRP = 28999;
      releaseYear = 2022;
    } else if (detectedBrand === 'OnePlus') {
      modelName = 'OnePlus Nord / 11R 5G Smartphone';
      estimatedMSRP = 29999;
      releaseYear = 2023;
    } else if (detectedBrand === 'Xiaomi' || detectedBrand === 'Redmi') {
      modelName = 'Xiaomi Redmi Note 5G Smartphone';
      estimatedMSRP = 17999;
      releaseYear = 2022;
    } else if (detectedBrand !== 'Generic') {
      modelName = `${detectedBrand} 5G Smartphone`;
      estimatedMSRP = 18999;
      releaseYear = 2022;
    } else {
      modelName = 'Touchscreen 5G Smartphone (Android / iOS)';
      estimatedMSRP = 18999;
      releaseYear = 2022;
    }
  } else if (category === 'audio' && subCategory === 'earbuds') {
    if (detectedBrand === 'OnePlus') {
      modelName = 'OnePlus Nord Buds / Buds Z2 (TWS Case & Earbuds)';
      estimatedMSRP = 2999;
      releaseYear = 2022;
    } else if (detectedBrand === 'Apple') {
      modelName = 'Apple AirPods (TWS Wireless Case)';
      estimatedMSRP = 12900;
      releaseYear = 2021;
    } else if (detectedBrand === 'boAt') {
      modelName = 'boAt Airdopes TWS Earbuds';
      estimatedMSRP = 2490;
      releaseYear = 2021;
    } else {
      modelName = `${detectedBrand !== 'Generic' ? detectedBrand : 'True Wireless'} TWS Earbuds`;
      estimatedMSRP = 2999;
      releaseYear = 2022;
    }
  } else if (category === 'audio' && subCategory === 'speaker') {
    modelName = `${detectedBrand !== 'Generic' ? detectedBrand : 'Portable'} Wireless Bluetooth Speaker`;
    estimatedMSRP = 4999;
    releaseYear = 2021;
  } else if (category === 'wearables') {
    modelName = `${detectedBrand !== 'Generic' ? detectedBrand : 'Fitness'} Smartwatch with SpO2`;
    estimatedMSRP = 3499;
    releaseYear = 2022;
  } else if (category === 'chargers_adapters') {
    modelName = `${detectedBrand !== 'Generic' ? detectedBrand : 'Fast'} 65W GaN USB-C Charger`;
    estimatedMSRP = 2499;
    releaseYear = 2022;
  } else {
    modelName = 'Braided Fast Charging USB Cable';
    estimatedMSRP = 799;
    releaseYear = 2022;
  }

  // If DuckDuckGo found a specific clean title snippet, enrich the specs
  if (searchResult && searchResult.title) {
    const lower = searchResult.title.toLowerCase();
    if (
      !lower.includes('order') &&
      !lower.includes('buy') &&
      !lower.includes('shop') &&
      !lower.includes('amazon') &&
      !lower.includes('flipkart')
    ) {
      const cleanTitle = searchResult.title.split('-')[0].split('|')[0].trim();
      if (cleanTitle.length > 5 && cleanTitle.length < 50) {
        modelName = cleanTitle;
      }
    }
  }

  return {
    category,
    subCategory,
    brand: detectedBrand,
    model: modelName,
    releaseYear,
    confidence: 0.94,
    estimatedMSRP,
    defaultRepairability: category === 'smartphones' ? 3 : category === 'audio' ? 2 : 3,
    eWasteComposition: {
      lithiumBattery: category === 'smartphones' || category === 'audio' || category === 'wearables',
      heavyMetals: category === 'smartphones'
        ? ['Lead in secondary interconnects', 'Cobalt in battery cathode', 'Cadmium in display driver']
        : ['Lead solder traces', 'Nickel plating'],
      preciousMetals: category === 'smartphones'
        ? ['Recycled Gold in logic board plating', 'Rare Earth Neodymium in speaker magnets', 'Copper wiring']
        : ['Gold plated contact pins', 'Silver solder', 'Micro copper voice coils']
    }
  };
}
