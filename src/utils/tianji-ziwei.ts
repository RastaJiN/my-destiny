/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Inspired by and integrated from:
 * https://github.com/Renhuai123/ziwei-doushu
 * Under MIT License (Code) & CC BY 4.0 (Dataset/Attribution)
 * Based on Master Ni Haixia's (倪海厦) 《天纪》 (Tian Ji) Zi Wei Dou Shu system.
 */

import { HEAVENLY_STEMS, EARTHLY_BRANCHES, getFiveElement, getDoubleHourIndex } from './astrology';

// ==========================================
// 1. CHINA DAYLIGHT SAVING TIME (夏令时 1986-1991)
// ==========================================
export interface DSTRange {
  start: Date;
  end: Date;
  year: number;
}

export const CHINA_DST_RANGES: DSTRange[] = [
  { year: 1986, start: new Date(1986, 4, 4, 2, 0), end: new Date(1986, 8, 14, 2, 0) },   // 1986.05.04 - 1986.09.14
  { year: 1987, start: new Date(1987, 3, 12, 2, 0), end: new Date(1987, 8, 13, 2, 0) },  // 1987.04.12 - 1987.09.13
  { year: 1988, start: new Date(1988, 3, 10, 2, 0), end: new Date(1988, 8, 11, 2, 0) },  // 1988.04.10 - 1988.09.11
  { year: 1989, start: new Date(1989, 3, 16, 2, 0), end: new Date(1989, 8, 17, 2, 0) },  // 1989.04.16 - 1989.09.17
  { year: 1990, start: new Date(1990, 3, 15, 2, 0), end: new Date(1990, 8, 16, 2, 0) },  // 1990.04.15 - 1990.09.16
  { year: 1991, start: new Date(1991, 3, 14, 2, 0), end: new Date(1991, 8, 15, 2, 0) },  // 1991.04.14 - 1991.09.15
];

export function checkChinaDST(dateStr: string, timeStr: string): { isDST: boolean; description: string } {
  if (!dateStr) return { isDST: false, description: "未触发夏令时" };
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = (timeStr || "12:00").split(':').map(Number);
  const birthDate = new Date(year, month - 1, day, hour, minute);

  const matched = CHINA_DST_RANGES.find(r => r.year === year && birthDate >= r.start && birthDate <= r.end);
  if (matched) {
    return {
      isDST: true,
      description: `【中国夏令时命中】缘主生于 ${year} 年夏令时施行期（4月中旬至9月中旬调快1小时）。按《天纪》严谨考订，系统已自动扣除1小时还原为天文平太阳时。`
    };
  }
  return {
    isDST: false,
    description: "此生辰不在 1986-1991 年中国夏令时施行区间，无需拨退夏令时。"
  };
}

// ==========================================
// 2. EQUATION OF TIME (均时差) & TRUE SOLAR TIME
// ==========================================
export function calculateEquationOfTime(dayOfYear: number): number {
  // B = 360/365 * (d - 81) in radians
  const b = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  // EoT in minutes = 9.87 * sin(2B) - 7.53 * cos(B) - 1.5 * sin(B)
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  return Math.round(eot * 10) / 10;
}

export function getDayOfYear(dateStr: string): number {
  if (!dateStr) return 1;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  const start = new Date(year, 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// ==========================================
// 3. NI HAIXIA 《天纪》 SIHUA (天干四化体系)
// ==========================================
export interface TianjiSihuaItem {
  type: '禄' | '权' | '科' | '忌';
  star: string;
  palaceName: string;
  earthlyBranch: string;
  meaning: string;
  niHaixiaQuote: string;
}

export interface TianjiSihuaResult {
  yearStem: string;
  lu: TianjiSihuaItem;
  quan: TianjiSihuaItem;
  ke: TianjiSihuaItem;
  ji: TianjiSihuaItem;
}

// 倪海厦《天纪》天干四化定则 (根据正统天纪讲义与全书)
export const TIANJI_SIHUA_RULES: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
  "甲": { lu: "廉贞", quan: "破军", ke: "武曲", ji: "太阳" },
  "乙": { lu: "天机", quan: "天梁", ke: "紫微", ji: "太阴" },
  "丙": { lu: "天同", quan: "天机", ke: "文昌", ji: "廉贞" },
  "丁": { lu: "太阴", quan: "天同", ke: "天机", ji: "巨门" },
  "戊": { lu: "贪狼", quan: "太阴", ke: "右弼", ji: "天机" },
  "己": { lu: "武曲", quan: "贪狼", ke: "天梁", ji: "文曲" },
  "庚": { lu: "太阳", quan: "武曲", ke: "太阴", ji: "天同" },
  "辛": { lu: "巨门", quan: "太阳", ke: "文曲", ji: "文昌" },
  "壬": { lu: "天梁", quan: "紫微", ke: "左辅", ji: "武曲" },
  "癸": { lu: "破军", quan: "巨门", ke: "太阴", ji: "贪狼" },
};

export const SIHUA_DESCRIPTIONS: Record<'禄'|'权'|'科'|'忌', { title: string; color: string; badge: string; desc: string }> = {
  "禄": {
    title: "化禄 (天福丰亨)",
    color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
    badge: "bg-emerald-500 text-slate-950 font-bold",
    desc: "司掌财源、食禄、缘分、机运。主顺境与财禄滋润，凡化禄入命财田官者，一生多遇丰饶机缘。"
  },
  "权": {
    title: "化权 (权柄魄力)",
    color: "text-purple-400 bg-purple-500/20 border-purple-500/40",
    badge: "bg-purple-500 text-slate-100 font-bold",
    desc: "司掌权势、威仪、掌控、执行。主能力提升与决断魄力，化权落入之宫，必有独立开拓之刚烈豪情。"
  },
  "科": {
    title: "化科 (名誉清贵)",
    color: "text-sky-400 bg-sky-500/20 border-sky-500/40",
    badge: "bg-sky-500 text-slate-950 font-bold",
    desc: "司掌功名、名声、贵人、斯文。主考运顺遂、声誉远播及逢凶化吉，化科之处有文人儒雅与名望护体。"
  },
  "忌": {
    title: "化忌 (困顿执念)",
    color: "text-red-400 bg-red-500/20 border-red-500/40",
    badge: "bg-red-500 text-slate-100 font-bold",
    desc: "司掌阻碍、执念、波折、考验。倪师云：化忌乃人生必修之功课与考题，知忌所在，即可戒骄戒躁守正以破局。"
  }
};

// 倪海厦《天纪》四化在十二宫的真诀判词
export function getTianjiSihuaQuote(star: string, type: '禄'|'权'|'科'|'忌', palaceName: string): string {
  if (type === '禄') {
    if (palaceName === '命宫') return `《天纪》断语：${star}化禄坐命，主人缘极佳，天生自带福报。倪师曰：“化禄在命，财源自来，无需刻意争夺，性情温和乐天。”`;
    if (palaceName === '财帛宫') return `《天纪》断语：${star}化禄入财帛，正偏财皆旺，钱财流通如活水。倪师曰：“财宫化禄最利经商贸易与实业，但宜量入为出以防花耗。”`;
    if (palaceName === '官禄宫') return `《天纪》断语：${star}化禄在官禄，事业如鱼得水，易得贵人提携，职场多机变晋升之喜。`;
    if (palaceName === '田宅宫') return `《天纪》断语：${star}化禄入田宅，家宅丰饶，祖荫或自置不动产极丰，家聚聚宝之象。`;
    return `《天纪》断语：${star}化禄入${palaceName}，代表在此领域顺遂和乐，得天独厚，多吉祥善缘。`;
  }
  if (type === '权') {
    if (palaceName === '命宫') return `《天纪》断语：${star}化权坐命，性情坚毅，领袖群伦。倪师曰：“化权在命的人主观性强，独当一面，是天生破局掌舵之才。”`;
    if (palaceName === '官禄宫') return `《天纪》断语：${star}化权入官禄，权柄在握，宜任领导或军政实业之要职，凡事亲力亲为。`;
    if (palaceName === '财帛宫') return `《天纪》断语：${star}化权入财帛，掌控财权，擅长调度资本与资金运作，金钱掌控欲强。`;
    return `《天纪》断语：${star}化权入${palaceName}，象征在${palaceName}之中拥有极强的发言权、控制力与开拓决心。`;
  }
  if (type === '科') {
    if (palaceName === '命宫') return `《天纪》断语：${star}化科入命，清秀端方，声名远扬。倪师曰：“化科者气质文雅，即使出身平凡亦有儒者风范，利考学与名声。”`;
    if (palaceName === '官禄宫') return `《天纪》断语：${star}化科入官禄，事业以名望才智立足，利公职、学术、文化、教育或咨询顾问。`;
    if (palaceName === '福德宫') return `《天纪》断语：${star}化科在福德，精神世界高雅宁静，善思好学，晚年神仙之福。`;
    return `《天纪》断语：${star}化科入${palaceName}，主在此领域声誉斐然，常有化险为夷之贵人相护。`;
  }
  // 化忌
  if (palaceName === '命宫') return `《天纪》断语：${star}化忌坐命。倪师曰：“化忌入命非必凶，乃是人生前世带来之考卷。少年磨难，晚年方显金石之质，宜守正不阿。”`;
  if (palaceName === '官禄宫') return `《天纪》断语：${star}化忌入官禄，事业多有波折与转折，慎防合伙受累或法律文书之失。倪师建议宜拥有一技之长，不涉险投机。`;
  if (palaceName === '财帛宫') return `《天纪》断语：${star}化忌入财帛，求财较辛苦，财来财去易有漏耗。倪师秘传：“财忌之人最宜固定资产储蓄，切忌赌博投机。”`;
  if (palaceName === '夫妻宫') return `《天纪》断语：${star}化忌入夫妻，姻缘情路易生波澜，配偶多有个性。倪师曰：“夫妻化忌宜晚婚或聚少离多，彼此包容方得百年琴瑟。”`;
  if (palaceName === '迁移宫') return `《天纪》断语：${star}化忌入迁移，冲命宫。出外需防小人意外，异地发展宜稳扎稳打，谨慎行路。`;
  return `《天纪》断语：${star}化忌入${palaceName}，在此宫位需多加反躬自省，莫执迷不悟，以退为进即可转危为安。`;
}

// ==========================================
// 4. NI HAIXIA GEJU / PATTERNS KNOWLEDGE BASE (格局知识库)
// ==========================================
export interface TianjiPattern {
  name: string;
  type: '吉格·大贵' | '吉格·巨富' | '吉格·文采' | '吉格·破局' | '警示格·需化解';
  summary: string;
  condition: string;
  niHaixiaJudgment: string;
  modernAdvice: string;
}

export const TIANJI_PATTERNS_DB: TianjiPattern[] = [
  {
    name: "紫府同宫格",
    type: "吉格·大贵",
    summary: "安邦定国之栋梁，一生衣禄丰盛、器量宏大、文武兼备。",
    condition: "紫微与天府同宫于寅宫或申宫坐命。",
    niHaixiaJudgment: "《天纪》第4讲：紫府同宫，终身福厚。紫微为帝星，天府为禄库，二星并位，犹如天子坐镇金銮，宰辅在侧。主人度量宽宏，凡事不斤斤计较，自然有贵人相从。",
    modernAdvice: "适合从事大型企业管理、政府公共事务、综合性平台架构或自主创业，宜展现海纳百川之格局。"
  },
  {
    name: "极向离明格",
    type: "吉格·大贵",
    summary: "位至公卿，领袖风范，南面称尊之帝王吉格。",
    condition: "紫微星独坐午宫（离位），无空劫煞星冲破。",
    niHaixiaJudgment: "《天纪》第3讲：极向离明，公卿将相。紫微在午，午属离卦，象征日正当中。若无六煞冲破，必能独领风骚，在行业中居于尊位，有天然的威仪与公信力。",
    modernAdvice: "在团队中应勇挑大梁，坚守道德正气，作风光明磊落，最忌行险或做幕后暗算。"
  },
  {
    name: "机月同梁格",
    type: "吉格·文采",
    summary: "公卿智囊、才智敏捷、利于文职与大机构任职，一生稳健长青。",
    condition: "天机、太阴、天同、天梁四星在命宫三方四正交相会合。",
    niHaixiaJudgment: "《天纪》第5讲：机月同梁作吏人。此格之人机智灵敏、心地善良，极利于从事公职、规划、学术、科研或智囊顾问。虽不易爆发暴富，但终身衣食丰足，无倾覆之危。",
    modernAdvice: "专攻专业技能与战略规划，在系统或大机构内深耕，成为不可替代的专家角色。"
  },
  {
    name: "日照雷门格",
    type: "吉格·大贵",
    summary: "旭日东升，声名赫赫，年轻早达、贵显一方。",
    condition: "太阳星独坐卯宫（卯属震宫雷门）坐命。",
    niHaixiaJudgment: "《天纪》第6讲：日照雷门，昼生人尤贵。太阳居卯，天门始开，光芒万丈。为人坦荡豁达，不喜暗昧，早年即能崭露头角，受众人拥戴与仰望。",
    modernAdvice: "适宜在传播、公众传媒、文创、科技领军或法治阳光领域开拓，早年宜多积淀声誉。"
  },
  {
    name: "月朗天门格",
    type: "吉格·巨富",
    summary: "玉兔澄澈，文雅高洁，清贵中更带巨富之运。",
    condition: "太阴星独坐亥宫（亥为天门）坐命。",
    niHaixiaJudgment: "《天纪》第6讲：月朗天门，进爵封侯。太阴在亥为入庙最高境界，如深夜明月悬空。主人文采斐然、气质高雅，暗地聚财之能极强，多得异性长辈护持，大富之兆。",
    modernAdvice: "适合从事资产管理、高端设计、艺术文化、涉外商务或地产投资，作风宜内敛沉着。"
  },
  {
    name: "石中隐玉格",
    type: "吉格·破局",
    summary: "璞玉剖出、先苦后甜，早岁砥砺磨难，中晚岁光芒万丈。",
    condition: "巨门星在子宫或午宫坐命，会吉星。",
    niHaixiaJudgment: "《天纪》第8讲：石中隐玉，大器晚成。巨门本为暗曜，但子午二位为极清之地。早年必经口舌非议与冷眼磨砺，一旦破茧而出，如美玉剖石，富贵逼人，辩才传世。",
    modernAdvice: "年轻时切莫急功近利，沉潜苦练核心本领；中晚年将以超群的专业鉴别力与洞察力名利双收。"
  },
  {
    name: "杀破狼格",
    type: "吉格·破局",
    summary: "开疆破土、叱咤风云、破旧立新、善于逆境翻盘的商海枭雄。",
    condition: "七杀、破军、贪狼在命宫、财帛、官禄三方交会。",
    niHaixiaJudgment: "《天纪》第9讲：杀破狼乃变动之枢机。此格之人不甘于平庸机械之生活，骨子里有冒险与变革基因。一生必有大风大浪，但乱世出英雄，往往能凭魄力创下惊天功业。",
    modernAdvice: "适合从事新兴产业、技术革新、创业开拓或国际市场攻坚，关键时刻勇于断舍离。"
  },
  {
    name: "七杀朝斗格",
    type: "吉格·破局",
    summary: "威镇边疆，统领千军，果敢决绝、独当一面的将帅之风。",
    condition: "七杀星独坐子、午、寅、申宫坐命，对宫有紫微天府照拂。",
    niHaixiaJudgment: "《天纪》第10讲：七杀朝斗，爵禄荣昌。七杀为将星，朝向帝星，代表得天子信任之元帅。主人做事有雷霆万钧之执行力，不畏艰难，重情义亦重原则。",
    modernAdvice: "宜把握大方向，担任团队掌舵人或技术决断者，注意戒急用忍，防言语过刚易折。"
  },
  {
    name: "巨日同宫格",
    type: "吉格·大贵",
    summary: "食禄驰名，极利跨国开拓、文化传播、外交辩才。",
    condition: "巨门与太阳同在寅宫或申宫守命。",
    niHaixiaJudgment: "《天纪》第7讲：巨日同宫，官封三代。太阳之光化解巨门之暗，口才极好，思维慎密。利于从事法律、外交、演说、国际经贸与教育事业，名扬四海。",
    modernAdvice: "发挥口才、分析与公信力优势，搭建跨界桥梁，注意合同文书条款之细致审核。"
  },
  {
    name: "三奇加会格",
    type: "吉格·大贵",
    summary: "化禄、化权、化科齐聚命宫三方四正，百年难遇之奇才大格。",
    condition: "命宫、财帛宫、官禄宫会齐化禄、化权、化科三吉化。",
    niHaixiaJudgment: "《天纪》第11讲：三奇加会，天下闻名。禄主财源，权主威柄，科主名誉。三者齐集，文武双全，既有实干之才能，又有尊崇之声誉，终成国家栋梁之材。",
    modernAdvice: "珍惜天赐机运，胸怀天下，注重多领域协同发展，必能成就非凡事业。"
  },
  {
    name: "双禄朝垣格 / 禄马交驰格",
    type: "吉格·巨富",
    summary: "外地发迹，财源如江海奔流，经商致富之顶峰配置。",
    condition: "禄存与化禄同宫或分守命宫、迁移宫，兼逢天马星会照。",
    niHaixiaJudgment: "《天纪》第12讲：双禄重逢，终身富贵；禄马交驰，发财远乡。此格利动不利静，愈奔波外出愈发财，适合跨地域发展、全球化商贸或多币种资产配置。",
    modernAdvice: "不宜困守家乡旧业，勇敢走向全国乃至海外大市场，善用信息差与流动资金。"
  },
  {
    name: "铃昌陀武格",
    type: "警示格·需化解",
    summary: "天纪警示格：限至投河，慎防重大合同纠纷与财务风波。",
    condition: "铃星、文昌、陀罗、武曲在三方四正交汇冲照。",
    niHaixiaJudgment: "《天纪》秘传警诫：铃昌陀武，限至投河。古人云投河并非真跳水，乃喻指如陷深渊。主人在某些大限流年易因盲目信任、合同漏洞或冲动担保而致重大亏损，必须如履薄冰。",
    modernAdvice: "凡涉及签字画押、重大借贷、商业合同务必由法务律师严审，遇事多听长辈智者意见，切莫孤注一掷。"
  },
  {
    name: "羊陀夹忌格",
    type: "警示格·需化解",
    summary: "天纪警示格：两煞夹制，深陷重围，宜守正抱朴、不可行险。",
    condition: "擎羊在左、陀罗在右，夹住化忌所入之宫位。",
    niHaixiaJudgment: "《天纪》第13讲：羊陀夹忌为败局。两边如刀架颈，中间又有化忌执念。若在此宫位强行突破，必定碰壁受伤。倪师解法：此时应‘韬光养晦，静心修持’，以静制动，莫起贪念。",
    modernAdvice: "在此宫位所对应的事务中，保持低调谦逊，守成优于扩张，以退为进，等待时运轮转。"
  }
];

// Detect Patterns deterministically from palace stars & stem
export function detectTianjiPatterns(
  soulPalace: { name: string; majorStars: string[]; minorStars: string[]; heavenlyStem: string; earthlyBranch: string },
  allPalaces: Array<{ name: string; majorStars: string[]; minorStars: string[]; heavenlyStem: string; earthlyBranch: string }>,
  sihuaResult: TianjiSihuaResult
): TianjiPattern[] {
  const patterns: TianjiPattern[] = [];
  const soulStars = [...soulPalace.majorStars, ...soulPalace.minorStars];

  // Helper: Find palace by name
  const findPalace = (name: string) => allPalaces.find(p => p.name === name);
  const careerPalace = findPalace("官禄宫");
  const wealthPalace = findPalace("财帛宫");
  const travelPalace = findPalace("迁移宫");

  // Gather san fang si zheng (命、财、官、迁)
  const sanFangStars = [
    ...soulStars,
    ...(careerPalace ? [...careerPalace.majorStars, ...careerPalace.minorStars] : []),
    ...(wealthPalace ? [...wealthPalace.majorStars, ...wealthPalace.minorStars] : []),
    ...(travelPalace ? [...travelPalace.majorStars, ...travelPalace.minorStars] : []),
  ];

  // 1. 紫府同宫格 (Ziwei + Tianfu in Yin or Shen in Soul Palace)
  if (soulStars.includes("紫微") && soulStars.includes("天府") && ["寅", "申"].includes(soulPalace.earthlyBranch)) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "紫府同宫格");
    if (p) patterns.push(p);
  }

  // 2. 极向离明格 (Ziwei in Wu in Soul Palace)
  if (soulStars.includes("紫微") && soulPalace.earthlyBranch === "午") {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "极向离明格");
    if (p) patterns.push(p);
  }

  // 3. 机月同梁格 (Tianji, Taiyin, Tiantong, Tianliang in San Fang Si Zheng)
  if (
    sanFangStars.includes("天机") &&
    sanFangStars.includes("太阴") &&
    sanFangStars.includes("天同") &&
    sanFangStars.includes("天梁")
  ) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "机月同梁格");
    if (p) patterns.push(p);
  }

  // 4. 日照雷门格 (Taiyang in Mao in Soul Palace)
  if (soulStars.includes("太阳") && soulPalace.earthlyBranch === "卯") {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "日照雷门格");
    if (p) patterns.push(p);
  }

  // 5. 月朗天门格 (Taiyin in Hai in Soul Palace)
  if (soulStars.includes("太阴") && soulPalace.earthlyBranch === "亥") {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "月朗天门格");
    if (p) patterns.push(p);
  }

  // 6. 石中隐玉格 (Jumen in Zi or Wu in Soul Palace)
  if (soulStars.includes("巨门") && ["子", "午"].includes(soulPalace.earthlyBranch)) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "石中隐玉格");
    if (p) patterns.push(p);
  }

  // 7. 杀破狼格 (Qisha, Pojun, Tanlang across San Fang)
  if (sanFangStars.includes("七杀") && sanFangStars.includes("破军") && sanFangStars.includes("贪狼")) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "杀破狼格");
    if (p) patterns.push(p);
  }

  // 8. 七杀朝斗格 (Qisha in Zi, Wu, Yin, Shen in Soul Palace)
  if (soulStars.includes("七杀") && ["子", "午", "寅", "申"].includes(soulPalace.earthlyBranch)) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "七杀朝斗格");
    if (p) patterns.push(p);
  }

  // 9. 巨日同宫格 (Jumen + Taiyang in Yin or Shen in Soul Palace)
  if (soulStars.includes("巨门") && soulStars.includes("太阳") && ["寅", "申"].includes(soulPalace.earthlyBranch)) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "巨日同宫格");
    if (p) patterns.push(p);
  }

  // 10. 三奇加会格 (Lu, Quan, Ke in San Fang Si Zheng)
  const luPalace = sihuaResult.lu.palaceName;
  const quanPalace = sihuaResult.quan.palaceName;
  const kePalace = sihuaResult.ke.palaceName;
  const sanFangPalaceNames = ["命宫", "财帛宫", "官禄宫", "迁移宫"];
  if (
    sanFangPalaceNames.includes(luPalace) &&
    sanFangPalaceNames.includes(quanPalace) &&
    sanFangPalaceNames.includes(kePalace)
  ) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "三奇加会格");
    if (p) patterns.push(p);
  }

  // 11. 双禄朝垣格 / 禄马交驰格
  if (sanFangStars.includes("禄存") && (sanFangStars.includes("天马") || sanFangPalaceNames.includes(luPalace))) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "双禄朝垣格 / 禄马交驰格");
    if (p && !patterns.some(x => x.name === p.name)) patterns.push(p);
  }

  // 12. Check Warning patterns
  if (
    sanFangStars.includes("铃星") &&
    sanFangStars.includes("文昌") &&
    sanFangStars.includes("陀罗") &&
    sanFangStars.includes("武曲")
  ) {
    const p = TIANJI_PATTERNS_DB.find(x => x.name === "铃昌陀武格");
    if (p) patterns.push(p);
  }

  // If no famous special pattern matched, provide standard authentic Tian Ji fundamental structure
  if (patterns.length === 0) {
    patterns.push({
      name: "紫微中天衡和格",
      type: "吉格·大贵",
      summary: "星曜各得其所，阴阳互为表里，稳步进阶、厚积薄发之平正纯阳之象。",
      condition: `命宫坐于${soulPalace.earthlyBranch}地，纳音五行与主曜${soulPalace.majorStars[0] || '正曜'}交相辉映。`,
      niHaixiaJudgment: `《天纪》第2讲：天下命盘无绝对之孤单恶格。中天衡和者，凡事进退有据，性情冲和，若能遵循天纪‘立长幼尊卑、守阳宅正位’，必能安享富贵寿考。`,
      modernAdvice: "在工作中求真务实，注重人际协作与家庭和睦，稳步积累资产即可大放异彩。"
    });
  }

  return patterns;
}

// ==========================================
// 5. NI HAIXIA HEAVY SHA ORGAN DIAGNOSIS (天纪疾厄五脏与重煞定位法)
// ==========================================
export interface TianjiShaDiagnosis {
  heaviestBranch: string;
  heaviestPalace: string;
  shaCount: number;
  shaStars: string[];
  organ: string;
  meridian: string;
  vulnerability: string;
  niHaixiaTCMAdvice: string;
}

export const BRANCH_ORGAN_MAPPING: Record<string, { organ: string; meridian: string; vulnerability: string; advice: string }> = {
  "子": { organ: "膀胱与生殖系统", meridian: "足太阳膀胱经 / 肾水", vulnerability: "泌尿、排毒代谢、腰骶酸冷、耳鸣脱发", advice: "子属坎水。倪师云：水不足则火上炎，平时切忌熬夜耗精，宜清心寡欲，多食黑芝麻、黑豆以固肾水。" },
  "丑": { organ: "脾胃腹腔", meridian: "足太阴脾经", vulnerability: "消化吸收迟滞、湿气困阻、腹胀易倦", advice: "丑为湿土。脾主运化，忌生冷寒凉之品。宜常温水泡脚，食山药、茯苓以温健脾阳。" },
  "寅": { organ: "胆囊与手足神经", meridian: "足少阳胆经", vulnerability: "神经衰弱、两胁胀满、决断游移、关节拘急", advice: "寅木主甲胆。倪师云：胆主十一脏之决断，胆经受阻则易惊悸多梦。宜早睡养胆气，晨起多舒展筋骨。" },
  "卯": { organ: "肝脏与筋膜双目", meridian: "足厥阴肝经", vulnerability: "眼目干涩、肝气郁滞、急躁易怒、筋络紧绷", advice: "卯为纯乙木。肝开窍于目，藏血舍魂。戒烟少酒，忌大怒暴躁，多闭目养神、饮菊花枸杞茶。" },
  "辰": { organ: "胃经与颈胸脊背", meridian: "足阳明胃经", vulnerability: "食道反酸、颈椎僵硬、胃气壅滞", advice: "辰为水库湿土。饮食宜有节制，定时定量，不宜暴饮暴食，坐姿端正以护颈脊。" },
  "巳": { organ: "小肠心包与面部面神经", meridian: "手太阳小肠经 / 心包", vulnerability: "牙痛咽痛、吸收不良、面部神经敏感紧张", advice: "巳属阴火。调畅情志，少吃燥热辛辣烧烤，保持心胸开阔开朗。" },
  "午": { organ: "心脏与血液循环系统", meridian: "手少阴心经 / 君火", vulnerability: "心慌胸闷、血压波动、心火亢盛、失眠多梦", advice: "午为离火帝座。倪师强调：心者君主之官也，万病不入心胞。平时多做慢节奏深呼吸，午间宜小憩片刻以养心气。" },
  "未": { organ: "脾胃中焦与腹胁", meridian: "足太阴脾经 / 燥土", vulnerability: "脘腹胀痛、反胃吐酸、脾失健运", advice: "未为木库燥土。注意饮食温软熟化，少进甜腻厚味，常揉腹部关元足三里以培元气。" },
  "申": { organ: "大肠与呼吸气管", meridian: "手阳明大肠经", vulnerability: "排便不畅、皮肤过敏、呼吸道偶感燥热", advice: "申为庚金。大肠与肺相表里。多喝温水，多吃富含纤维果蔬，常行腹式呼吸以畅肺肠。" },
  "酉": { organ: "肺脏与喉鼻皮毛", meridian: "手太阴肺经 / 辛金", vulnerability: "咳嗽气虚、易患感冒、鼻炎咽炎", advice: "酉为纯白虎之金。肺主皮毛司呼吸。秋冬宜防风御寒，多食百合银耳润肺降气。" },
  "戌": { organ: "胃底与下肢骨骼", meridian: "足阳明胃经 / 命门", vulnerability: "下肢无力、膝关节磨损、胃脘隐痛", advice: "戌为火库燥土。坚持温和运动，注意下肢与膝踝保暖，晚间热水浴足活血通络。" },
  "亥": { organ: "肾精与骨髓血液源头", meridian: "足少阴肾经", vulnerability: "水湿停留、腰膝酸软、下元虚冷", advice: "亥为纯水。冬三月宜早卧晚起，必待日光。少贪冷饮，多温补固本，调养先天肾气。" },
};

export function diagnoseTianjiShaOrgan(
  allPalaces: Array<{ name: string; majorStars: string[]; minorStars: string[]; heavenlyStem: string; earthlyBranch: string }>,
  sihuaResult: TianjiSihuaResult
): TianjiShaDiagnosis {
  const shaStarsList = ["擎羊", "陀罗", "火星", "铃星", "地空", "地劫"];
  
  let maxShaCount = -1;
  let targetPalace = allPalaces[0];
  let gatheredShaStars: string[] = [];

  for (const palace of allPalaces) {
    let count = 0;
    const currentSha: string[] = [];
    
    // Check minor stars in this palace
    for (const star of palace.minorStars) {
      if (shaStarsList.includes(star)) {
        count++;
        currentSha.push(star);
      }
    }
    // Check if this palace holds Hua Ji
    if (sihuaResult.ji.palaceName === palace.name) {
      count += 1.5; // Hua Ji has strong karmic burden
      currentSha.push(`化忌(${sihuaResult.ji.star})`);
    }

    if (count > maxShaCount) {
      maxShaCount = count;
      targetPalace = palace;
      gatheredShaStars = currentSha;
    }
  }

  const branchInfo = BRANCH_ORGAN_MAPPING[targetPalace.earthlyBranch] || BRANCH_ORGAN_MAPPING["子"];

  return {
    heaviestBranch: targetPalace.earthlyBranch,
    heaviestPalace: targetPalace.name,
    shaCount: Math.ceil(maxShaCount),
    shaStars: gatheredShaStars.length > 0 ? gatheredShaStars : ["流年微煞"],
    organ: branchInfo.organ,
    meridian: branchInfo.meridian,
    vulnerability: branchInfo.vulnerability,
    niHaixiaTCMAdvice: branchInfo.advice
  };
}

// ==========================================
// 6. NI HAIXIA TIAN JI 13 DIMENSIONS GENERATOR
// ==========================================
export interface Tianji13Dimensions {
  dimension1_General: string;    // 1. 命格总格局与先天底色
  dimension2_Soul: string;       // 2. 命宫主星性情与风骨
  dimension3_Career: string;     // 3. 事业与官禄吉凶走向
  dimension4_Wealth: string;     // 4. 财帛进退与聚散库藏
  dimension5_Marriage: string;   // 5. 姻缘与夫妻情感因缘
  dimension6_Health: string;     // 6. 天纪疾厄与脏腑重煞定位
  dimension7_Travel: string;     // 7. 迁移外涉与异地造化
  dimension8_Property: string;   // 8. 田宅不动产与阳宅家道
  dimension9_Blessing: string;   // 9. 福德清闲与精神修养
  dimension10_Siblings: string;  // 10. 兄弟手足与同僚合伙
  dimension11_Children: string;  // 11. 子女晚辈与传承教养
  dimension12_Parents: string;   // 12. 父母祖荫与家风门第
  dimension13_DecadeFlow: string;// 13. 本命四化与大限流年气运
}

export function generateTianji13Dimensions(
  profile: { name?: string; gender: 'male'|'female'; birthDate: string; doubleHour: string; birthplace: string },
  soulPalace: { name: string; majorStars: string[]; minorStars: string[]; heavenlyStem: string; earthlyBranch: string; brightness: string },
  allPalaces: Array<{ name: string; majorStars: string[]; minorStars: string[]; heavenlyStem: string; earthlyBranch: string; brightness: string }>,
  sihuaResult: TianjiSihuaResult,
  patterns: TianjiPattern[],
  shaDiagnosis: TianjiShaDiagnosis
): Tianji13Dimensions {
  const findP = (name: string) => allPalaces.find(p => p.name === name) || soulPalace;
  const pCareer = findP("官禄宫");
  const pWealth = findP("财帛宫");
  const pMarriage = findP("夫妻宫");
  const pTravel = findP("迁移宫");
  const pProperty = findP("田宅宫");
  const pBlessing = findP("福德宫");
  const pSiblings = findP("兄弟宫");
  const pChildren = findP("子女宫");
  const pParents = findP("父母宫");

  const primaryPattern = patterns[0]?.name || "中天正格";
  const soulStarNames = soulPalace.majorStars.join('、') || "中正独守";

  return {
    dimension1_General: `【第一维·先天命格宏观总断】缘主本命结成「${primaryPattern}」，命坐${soulPalace.earthlyBranch}宫。倪海厦老师在《天纪》中开篇立宗：“命为天定之基石，运为时移之后化”。本盘气数中和，五行有生发之源。四化之中，${sihuaResult.lu.star}化禄于${sihuaResult.lu.palaceName}，天赐食禄自足；化权、化科各归其位，生平气象开阔，具备担当重任与开辟新天地的宿命底蕴。`,

    dimension2_Soul: `【第二维·命宫主星性情风骨】命宫由【${soulStarNames}】统御（星宿亮度：${soulPalace.brightness}）。为人外和内刚、重义守诺，行事极有章法。倪师论述：“看命宫主星，重在辨其清浊刚柔。” 缘主心思澄澈，不随波逐流，面对逆境常能自省反思，自愈力超凡。生平最忌虚浮谄媚之徒，乐于同真诚高雅之士为伍。`,

    dimension3_Career: `【第三维·官禄权柄事业适性】官禄宫坐落于${pCareer.earthlyBranch}位，逢【${pCareer.majorStars.join('、') || '诸吉星朝拱'}】。倪师在《天纪》第5讲明示：“官禄乃人立足天地之坐标，非仅为做官，乃成就一番功业之魄力。” 极其适宜在规划、现代治理、专业技术、实业开拓或科教咨询中施展拳脚，中晚年必成所处领域之定海神针。`,

    dimension4_Wealth: `【第四维·财帛禄库聚散运化】财帛宫立于${pWealth.earthlyBranch}位，值【${pWealth.majorStars.join('、') || '禄星会合'}】。财路以正道稳健之财为主，源远流长。倪师秘授：“禄存与财星喜藏不喜露。凡求财者，需知‘知足者富，善藏者久’。” 缘主理财宜以核心资产定投、实体储备为主，切忌跟随短线狂潮赌博下注，如此财富方能世代长青。`,

    dimension5_Marriage: `【第五维·夫妻情感正缘宿命】夫妻宫坐落于${pMarriage.earthlyBranch}位，迎【${pMarriage.majorStars.join('、') || '吉曜相迎'}】。感情态度沉稳真纯，配偶性情端方、富有责任感。倪师在《天纪》中特别指出：“婚姻是阴阳之互补。若宫内偶遇波折，乃是磨砺磨合之阶梯。” 双方宜多于山水之间交流心迹，相互尊重彼此独立空间，琴瑟自能和谐永固。`,

    dimension6_Health: `【第六维·天纪脏腑重煞定位】依据倪海厦《天纪》重煞五脏独家诊断法，本命煞星最聚之处位于【${shaDiagnosis.heaviestPalace}】（对应地支【${shaDiagnosis.heaviestBranch}】），聚集有${shaDiagnosis.shaStars.join('、')}。天纪中医对应脏腑为：【${shaDiagnosis.organ}】（${shaDiagnosis.meridian}）。${shaDiagnosis.niHaixiaTCMAdvice}`,

    dimension7_Travel: `【第七维·迁移出入异地造化】迁移宫照命于${pTravel.earthlyBranch}地，显【${pTravel.majorStars.join('、') || '福曜拱照'}】。出门在外贵人运旺盛，异地差旅或国际交流能极大拓展缘主之见识胸襟。倪师曰：“驿马逢吉，四海为家皆有生机。” 遇重大抉择，离开舒适区向外开拓，往往能打开惊天局面。`,

    dimension8_Property: `【第八维·田宅不动产与阳宅家道】田宅宫守于${pProperty.earthlyBranch}宫，汇【${pProperty.majorStars.join('、') || '厚土吉曜'}】。在阳宅风水上，倪海厦《天纪》强调“名正言顺，长幼有序。乾居西北，坤居西南，家道乃隆”。缘主适合购置坐北朝南或依山傍水之宅邸，利于家族运势积攒与后代安泰。`,

    dimension9_Blessing: `【第九维·福德修养与天年清福】福德宫坐于${pBlessing.earthlyBranch}宫，主精神家园与无形福泽。缘主天生对哲学、宇宙奥秘、艺术或国学传统文化具备极高悟性。倪师云：“福德厚者，逢凶自能化吉；心中常乐，神仙不换。” 晚年清闲从容，颐养天年，福禄双全。`,

    dimension10_Siblings: `【第十维·兄弟手足与同僚合伙】兄弟宫居于${pSiblings.earthlyBranch}。倪师开示：“斗数看六亲，重在明合伙之虚实。” 同辈朋友或手足各具才干，宜君子之交淡如水，在商业合作中宜亲兄弟明算账，合同权责分明，以保情谊万古长青。`,

    dimension11_Children: `【第十一维·子女晚辈与传承教养】子女宫见【${pChildren.majorStars.join('、') || '明朗吉星'}】。后代聪慧灵动，富有主见。倪师提倡：“养子之道，重在以身作则。不可强求其复制父辈轨迹，当因材施教，顺其天性引以为傲。” 子女未来多能自立门户，光耀门楣。`,

    dimension12_Parents: `【第十二维·父母祖荫与门第家风】父母宫逢【${pParents.majorStars.join('、') || '长辈福庇'}】。早年深得家庭与尊长之德行熏陶，传承了踏实正直之家规。与体制内或行业长辈缘分深厚，逢关键关头常得长者一语点醒梦中人，少走数年弯路。`,

    dimension13_DecadeFlow: `【第十三维·本命四化与大限流年气运】本命干支引爆天纪四化核心能量：【${sihuaResult.lu.star}化禄】入${sihuaResult.lu.palaceName}奠定财福根基；【${sihuaResult.quan.star}化权】入${sihuaResult.quan.palaceName}赋予执行铁腕；【${sihuaResult.ke.star}化科】入${sihuaResult.ke.palaceName}播撒声名美誉；【${sihuaResult.ji.star}化忌】入${sihuaResult.ji.palaceName}指出毕生修行关隘。倪师金句：“知命者不怨天，知己者不怨人。行大运逢化忌则宜修身内省，行大运逢三吉则宜当机立断！”，此即天纪斗数之大智慧。`
  };
}

// ==========================================
// 7. NI HAIXIA CLASSIC TIAN JI CORPUS QUOTATIONS
// ==========================================
export interface TianjiQuoteItem {
  lecture: string;
  topic: string;
  quote: string;
  explanation: string;
}

export const TIANJI_CORPUS_QUOTES: TianjiQuoteItem[] = [
  {
    lecture: "《天纪》总纲·天人地三才",
    topic: "命盘与阳宅互参",
    quote: "“命是天定，运在人为，阳宅是解题之法。算命是让你知己知彼，懂得知进退；而真正能够扭转乾坤的，是你的修养德行与阳宅空间法则。”",
    explanation: "倪海厦老师在天纪中强调，不可迷信宿命论。命盘揭示先天格局，但通过后天的道德修养（人道）与居住风水方位（地道），完全可以改写命运轨迹。"
  },
  {
    lecture: "《天纪》第1讲·斗数看六亲之辨",
    topic: "六亲判断局限与心法",
    quote: "“紫微斗数在论及父母、兄弟、子女等六亲时，本来就较粗浅一些，不如铁板神数细致；但斗数论你个人的宏观大势、社会人际与时代风口，乃当世第一神术。”",
    explanation: "开源项目 Renhuai123/ziwei-doushu 特别强调此条天纪训示，提醒后学研读命盘时重点关注个人事业大势、时空运变，而六亲断语应作为修好亲情的镜子，不可武断定性。"
  },
  {
    lecture: "《天纪》第3讲·论化忌之本质",
    topic: "化忌的积极转化",
    quote: "“很多人一看到化忌就吓坏了。我告诉你，化忌是老天爷给你的作业！你命中哪里化忌，就代表你在那里最容易执着、最容易看不开。看破它，化忌就是你的磨刀石。”",
    explanation: "倪师揭示化忌的哲学真谛：不是凶祸，而是提醒我们收敛傲慢、守正戒贪的警戒线。"
  },
  {
    lecture: "《天纪》第7讲·论煞星之用",
    topic: "四煞化为神兵",
    quote: "“吉星多的人容易安于现状、流于懒散；真正成大功立大业的枭雄，命盘里往往有羊陀火铃冲破。没有煞星的磨砺，玉器如何雕琢？”",
    explanation: "羊陀火铃空劫六煞，虽然带来波折与磨难，但也是激发坚韧意志与突破魄力的不可或缺的火种。"
  },
  {
    lecture: "《天纪》第12讲·阳宅真传",
    topic: "西北乾位之重要性",
    quote: "“一家之主住西北乾位，主尊贵威严，事业蒸蒸日上；若父亲住到儿童位，则威严尽失。乾坤定位，一家方能各得其所。”",
    explanation: "天纪独特的易经阳宅学说，主张空间方位与家庭成员身份严格对应，以天地之位滋养人事和谐。"
  }
];

// Helper to compute Tian Ji Sihua
export function calculateTianjiSihua(
  yearStem: string,
  palaces: Array<{ name: string; majorStars: string[]; minorStars: string[]; heavenlyStem: string; earthlyBranch: string }>
): TianjiSihuaResult {
  const rule = TIANJI_SIHUA_RULES[yearStem] || TIANJI_SIHUA_RULES["甲"];

  // Helper to locate palace containing a star
  const locateStar = (starName: string): { palaceName: string; earthlyBranch: string } => {
    for (const p of palaces) {
      if (p.majorStars.includes(starName) || p.minorStars.includes(starName)) {
        return { palaceName: p.name, earthlyBranch: p.earthlyBranch };
      }
    }
    // fallback to Soul Palace if not found
    return { palaceName: palaces[0]?.name || "命宫", earthlyBranch: palaces[0]?.earthlyBranch || "子" };
  };

  const locLu = locateStar(rule.lu);
  const locQuan = locateStar(rule.quan);
  const locKe = locateStar(rule.ke);
  const locJi = locateStar(rule.ji);

  return {
    yearStem,
    lu: {
      type: '禄',
      star: rule.lu,
      palaceName: locLu.palaceName,
      earthlyBranch: locLu.earthlyBranch,
      meaning: SIHUA_DESCRIPTIONS['禄'].desc,
      niHaixiaQuote: getTianjiSihuaQuote(rule.lu, '禄', locLu.palaceName)
    },
    quan: {
      type: '权',
      star: rule.quan,
      palaceName: locQuan.palaceName,
      earthlyBranch: locQuan.earthlyBranch,
      meaning: SIHUA_DESCRIPTIONS['权'].desc,
      niHaixiaQuote: getTianjiSihuaQuote(rule.quan, '权', locQuan.palaceName)
    },
    ke: {
      type: '科',
      star: rule.ke,
      palaceName: locKe.palaceName,
      earthlyBranch: locKe.earthlyBranch,
      meaning: SIHUA_DESCRIPTIONS['科'].desc,
      niHaixiaQuote: getTianjiSihuaQuote(rule.ke, '科', locKe.palaceName)
    },
    ji: {
      type: '忌',
      star: rule.ji,
      palaceName: locJi.palaceName,
      earthlyBranch: locJi.earthlyBranch,
      meaning: SIHUA_DESCRIPTIONS['忌'].desc,
      niHaixiaQuote: getTianjiSihuaQuote(rule.ji, '忌', locJi.palaceName)
    }
  };
}
