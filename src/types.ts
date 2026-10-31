/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BirthProfile {
  name?: string; // 可选姓名 (Optional)
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // "00:00" - "23:59"
  doubleHour: string; // 时辰
  gender: 'male' | 'female'; // 乾造 / 坤造
  calendarType: 'solar' | 'lunar'; // 公历 / 农历
  zodiacSign: string; // 太阳星座
  birthplace: string; // 出生地 (Required for precise solar time)
  isDSTAdjusted?: boolean; // 是否触发中国夏令时 (1986-1991) 自动校准
  nightZiRule?: 'next_day' | 'same_day'; // 晚子时规则 (23:00-24:00 归次日或当日)
}

export interface BaziPillar {
  stem: string;  // 天干
  branch: string; // 地支
  fiveElement: string; // 五行
  hiddenStems: string[]; // 藏干
  tenDeities: string; // 十神
}

export interface BaziChart {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  fiveElementsCount: {
    gold: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
  };
}

export interface ZiweiPalace {
  name: string; // 宫位 (命宫, 兄弟 etc)
  heavenlyStem: string; // 宫干
  earthlyBranch: string; // 宫支
  majorStars: string[]; // 主星
  minorStars: string[]; // 辅星
  brightness: string; // 妙旺利陷
  sihuaStars?: Array<{ star: string; type: '禄' | '权' | '科' | '忌' }>; // 天纪四化入此宫之星
  isBodyPalace?: boolean; // 是否为身宫 (天纪身宫同位)
  decadeRange?: string; // 大限岁数 (如 24-33)
  wujuName?: string; // 五局 (如 水二局)
}

// Western Star details
export interface WesternPlanet {
  name: string; // 太阳, 月亮, 水星 etc
  zodiac: string; // 落在什么星座
  house: number; // 落在第几宫
  degree: number; // 角度
  significance: string; // 象征意义
}

export interface WesternChart {
  planets: WesternPlanet[];
  risingSign: string; // 上升星座
  dominantElement: string; // 主导元素
}

export interface MBTIPersonality {
  type: string; // INFJ, ENTJ etc
  title: string; // 比如 "策划分裂家", "守卫之盾"
  description: string;
  jungianConcept: string; // 荣格八维机制 (Ni-Fe-Ti-Se etc)
  strengths: string[];
  weaknesses: string[];
  luckyCrystal: string;
  idealPartners: string[]; // 绝配人格
  growthAdvice: string;
}

export interface FortuneAnalysis {
  baziSummary: string;
  ziweiSummary: string;
  zodiacSummary: string; // 西方排盘深度叙述
  overlappingAnalysis: string; // 中西合璧星象重叠深度解析
  romanceFortune: {
    rating: number; 
    description: string;
  };
  careerFortune: {
    rating: number; 
    description: string;
  };
  wealthFortune: {
    rating: number; 
    description: string;
  };
  healthFortune: {
    rating: number; 
    description: string;
  };
  overallAdvice: string;
  dailyAdvice: {
    luckyColors: string[];
    luckyNumbers: number[];
    luckyDirection: string;
    luckyHours: string[];
    talismanQuote: string; // 每日命理签
    cosmicScore: number; 
  };
  // Western Daily Horoscope with terms interpreted
  westernDaily: {
    rating: number;
    forecast: string;
    luckyPlanet: string;
    aspectTip: string;
  };
}
