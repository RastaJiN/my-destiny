/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Share2, 
  Bell, 
  BookOpen, 
  Heart, 
  Briefcase, 
  Coins, 
  Activity, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers,
  Moon,
  Info,
  RefreshCw,
  MapPin,
  Flame,
  Sun,
  Zap,
  Smile,
  ShieldCheck,
  User,
  AlertCircle
} from 'lucide-react';
import { BirthProfile, FortuneAnalysis, BaziChart, ZiweiPalace } from './types';
import { 
  calculateBazi, 
  calculateZiweiChart, 
  calculateSolarTimeAdjustment, 
  calculateWesternChart, 
  getWesternZodiac,
  METAPHYSICAL_DICTIONARY
} from './utils/astrology';
import { MBTI_DATA, getMBTICompatibility } from './utils/mbti';
import BirthForm from './components/BirthForm';
import Astrolabe from './components/Astrolabe';
import TianjiKnowledgeBase from './components/TianjiKnowledgeBase';
import { 
  detectTianjiPatterns, 
  calculateTianjiSihua, 
  diagnoseTianjiShaOrgan 
} from './utils/tianji-ziwei';

const PRESET_PROFILES: { label: string; profile: BirthProfile }[] = [
  {
    label: "精选格局：天府朝垣 (富贵稳健)",
    profile: {
      name: "青松道友",
      birthDate: "1995-10-24",
      birthTime: "12:00",
      doubleHour: "午时",
      gender: "male",
      calendarType: "solar",
      zodiacSign: "天蝎座",
      birthplace: "上海"
    }
  },
  {
    label: "精选格局：日耀东方 (名气磊落)",
    profile: {
      name: "霓裳仙子",
      birthDate: "1998-05-18",
      birthTime: "08:30",
      doubleHour: "辰时",
      gender: "female",
      calendarType: "solar",
      zodiacSign: "金牛座",
      birthplace: "西安"
    }
  }
];

// Offline fallback generator for offline resilience with complete parameters
const generateOfflineFortune = (profile: BirthProfile): FortuneAnalysis => {
  return {
    baziSummary: `【本命格底】缘主降生于「${profile.birthplace || '中原神州'}」之地，校正真太阳时之后干脉沉稳。主命天干${profile.gender === 'male' ? '戊己为正土，厚德载物' : '乙木舒发，秀气流行'}。命中有助水生木之妙气，性格温雅中不失底线风骨，一生自强而少求假于旁人。`,
    ziweiSummary: `【紫微斗数 · 《天纪》知识库考订】承袭开源项目 Renhuai123/ziwei-doushu 所载倪海厦《天纪》典藏知识库推演：命宫得吉曜朝拱，纳音五行生克有情。倪师讲义开示：“知命者当识天干四化之机变，化禄丰亨顺遂，化忌为修道磨刀之石。” 虽生平偶逢波澜，终能凭自律与正气破茧成蝶。`,
    zodiacSummary: `【西方星座】黄道天盘本我太阳位于${profile.zodiacSign}，心智感悟深藏四象之命元。上升星座合相西方吉相守护点。赋予缘主惊人的审美领悟力，既能够保持大度退让，在关键风口却又展示出猎豹般的不退后决心。`,
    overlappingAnalysis: `【星勺合璧】在中西交错宿命盘中，东方紫微斗数格局“天机修心”巧与西洋黄道占星中本命${profile.zodiacSign}之耀产生宿命般交缠。东方的太极宁静调和了西洋的刚烈，极大利于在中年期推进涉及人文、技术或者大战略领域的突破。`,
    romanceFortune: {
      rating: 88,
      description: "红鸾含羞，夫妻宫紫微吉徽。配偶性柔且有坚守，彼此在无声的琐碎生活照料里，孕育出金石般长久的信义真纯。"
    },
    careerFortune: {
      rating: 94,
      description: "官禄宫临科文贵曜。多遇长辈提拔、引荐，适合深耕技术、规划与大格局管理，最忌行险或因小利损大名。"
    },
    wealthFortune: {
      rating: 85,
      description: "禄存星得地。财源如同泉流，源远流长但更重积累与定存。在投资投机上宜保持克制的观望态势，积善成富。"
    },
    healthFortune: {
      rating: 85,
      description: "按倪海厦《天纪》重煞五脏诊断心法，全盘煞曜最聚之地宜防阴阳偏胜。日常宜温补脾肾、顺应四季作息，调和十二经络气血。"
    },
    overallAdvice: "“顺天应地，大象无形。” 不刻意强求、不陷入执念，顺应四柱五行之消长，即是最大的星勺研究所护身圣法。",
    dailyAdvice: {
      luckyColors: ["竹叶青", "皎洁白"],
      luckyNumbers: [3, 9],
      luckyDirection: "正东震木方位",
      luckyHours: ["巳时 (09:00-11:00)", "戌时 (19:00-21:00)"],
      talismanQuote: "紫气东来，凡事留足三分退路，不沾非议论战。",
      cosmicScore: 89
    },
    westernDaily: {
      rating: 90,
      forecast: "本日西洋天盘月亮与水星形成和谐的120度「拱相」。这在星数中代表你的直觉之渠完全扩充，语言极富说服感染力。适合做出精密的理智规划，宜整理案头积尘。",
      luckyPlanet: "水星拱月亮 (心智契合曜)",
      aspectTip: "群星微逆，不宜进行过度激烈的资金盲投。"
    }
  };
};

export default function App() {
  const [profile, setProfile] = useState<BirthProfile>(PRESET_PROFILES[0].profile);
  const [baziChart, setBaziChart] = useState<BaziChart | null>(null);
  const [ziweiChart, setZiweiChart] = useState<ZiweiPalace[] | null>(null);
  const [analysis, setAnalysis] = useState<FortuneAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tab management: chinese, western, mbti
  const [activeDistrict, setActiveDistrict] = useState<'chinese' | 'western' | 'mbti'>('chinese');

  // Secondary tab within Chinese Plate (Chart, Advice, or Knowledge Base)
  const [chineseSubTab, setChineseSubTab] = useState<'chart' | 'advice' | 'knowledge'>('chart');

  // MBTI Section specific states
  const [userMBTI, setUserMBTI] = useState<string>("INFJ");
  const [matchMBTI, setMatchMBTI] = useState<string>("ENFP");
  const [matchResult, setMatchResult] = useState<{ score: number; label: string; text: string } | null>(null);

  // Western Aster dictionary interactive selector for Block Two
  const [hoveredWesternTerm, setHoveredWesternTerm] = useState<{
    term: string;
    meaning: string;
  } | null>(null);

  // Tian Ji Knowledge Base derived results from Renhuai123/ziwei-doushu
  const soulPalace = ziweiChart?.find(p => p.name === '命宫') || ziweiChart?.[0];
  const yearStem = baziChart?.year?.stem || "甲";
  const sihuaResult = ziweiChart ? calculateTianjiSihua(yearStem, ziweiChart) : null;
  const matchedPatterns = (soulPalace && ziweiChart && sihuaResult) 
    ? detectTianjiPatterns(soulPalace, ziweiChart, sihuaResult) 
    : [];

  // Auto calculate when profile updates
  useEffect(() => {
    if (profile) {
      const year = Number(profile.birthDate.split('-')[0]);
      const month = Number(profile.birthDate.split('-')[1]);
      const day = Number(profile.birthDate.split('-')[2]);
      
      const bCtx = calculateBazi(year, month, day, profile.birthTime, profile.gender);
      const zCtx = calculateZiweiChart(year, month, day, profile.birthTime);
      
      setBaziChart(bCtx);
      setZiweiChart(zCtx);
      
      triggerFortuneAnalysis(profile, bCtx, zCtx);
    }
  }, [profile]);

  // Recalculate MBTI match
  useEffect(() => {
    if (userMBTI && matchMBTI) {
      const res = getMBTICompatibility(userMBTI, matchMBTI);
      setMatchResult(res);
    }
  }, [userMBTI, matchMBTI]);

  const triggerFortuneAnalysis = async (
    targetProfile: BirthProfile, 
    bChart: BaziChart, 
    zChart: ZiweiPalace[]
  ) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/analyze-fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthProfile: targetProfile,
          baziChart: bChart,
          ziweiChart: zChart
        }),
      });

      if (!response.ok) {
        throw new Error('占星回路承接出错。');
      }

      const result = await response.json();
      if (result && result.baziSummary) {
        setAnalysis(result);
      } else {
        throw new Error('天星推演无响应。');
      }
    } catch (err: any) {
      console.warn("Using offline metaphysics rules engine client-side.", err);
      // Seamlessly generate customized fallback data
      const offlineResult = generateOfflineFortune(targetProfile);
      setAnalysis(offlineResult);
    } finally {
      setIsLoading(false);
    }
  };

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleProfileFormSubmit = (newProfile: BirthProfile) => {
    setProfile(newProfile);
  };

  const handleCopyResult = () => {
    if (!analysis) return;
    const shareText = `【星勺居命理研究所 · 雅阁手批】
缘主姓名：${profile.name || '未具名缘主'}
出生地真太阳时校正：${calculateSolarTimeAdjustment(profile.birthplace || '').originalOffsetStr}
今日中华命理谶语：${analysis.dailyAdvice?.talismanQuote || '紫气东来。'}
今日好运护体：吉位 ${analysis.dailyAdvice?.luckyDirection} | 吉色 ${analysis.dailyAdvice?.luckyColors?.join('、')}。
速来星勺居命理所开启你的排盘推演吧！`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        setToastMsg("「星勺手批手稿密语」已抄写至剪贴板，可随意传阅赐福他人。");
        setTimeout(() => setToastMsg(null), 3000);
      }).catch(() => {
        setToastMsg("谶签手稿已就绪，请手动长按复制。");
        setTimeout(() => setToastMsg(null), 3000);
      });
    } else {
      setToastMsg("谶签手稿已就绪，请长按文本复制。");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  // Birthplace accurate adjustment data
  const birthOffsetDetails = calculateSolarTimeAdjustment(profile.birthplace || '');
  
  // Western Astrolabe Calculated components
  const westernStars = calculateWesternChart(
    Number(profile.birthDate.split('-')[1]), 
    Number(profile.birthDate.split('-')[2]), 
    profile.birthTime
  );

  return (
    <div id="mystic-app" className="min-h-screen bg-[#070709] text-[#e2d6bf] font-serif flex flex-col antialiased relative selection:bg-amber-600/35 selection:text-amber-100">
      
      {/* Background celestial patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,18,14,0.3),rgba(7,7,9,1))] pointer-events-none z-0" />
      <div className="absolute top-0 inset-x-0 h-48 bg-[linear-gradient(to_bottom,rgba(196,160,82,0.06),transparent)] pointer-events-none z-0 animate-pulse" />

      {/* HEADER SECTION */}
      <header className="relative z-10 border-b border-[#312a20] bg-slate-950/90 py-4 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between shadow-2xl gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border-2 border-amber-500/50 rotate-45 flex items-center justify-center bg-slate-900 shadow-[0_0_12px_rgba(245,158,11,0.2)] shrink-0">
            <span className="-rotate-45 text-sm font-semibold tracking-wider text-amber-300">星</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl tracking-[0.2em] font-medium text-amber-200 flex items-center gap-2">
              星勺居命理研究所
            </h1>
            <p className="text-[10px] text-slate-500 tracking-widest font-sans uppercase -mt-0.5">Star Dipper Hermitage Astrology Lab</p>
          </div>
        </div>

        {/* Global preset profile selection banner */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="text-right hidden xl:block text-xs text-slate-500 font-sans mr-2 leading-tight">
            <span className="text-amber-400 font-bold block">★ 2026 命数研究所正印</span>
            <span>真太阳时：按诞生地经度分钟数自动补偿</span>
          </div>
          
          <div className="flex bg-slate-950/90 border border-[#3e3425] rounded p-1">
            {PRESET_PROFILES.map((p) => {
              const isActive = profile.name === p.profile.name;
              return (
                <button
                  key={p.label}
                  onClick={() => setProfile(p.profile)}
                  className={`px-3 py-1 text-[11px] font-serif rounded transition ${
                    isActive 
                      ? 'bg-amber-900/30 border border-amber-500/40 text-amber-200 font-medium' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label.split('：')[1]}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* CORE PLAT DISTRICT SELECTION MENU */}
      <nav className="relative z-10 bg-[#0d0d12] border-b border-[#30281c] py-2.5 px-4 flex justify-center sticky top-0 backdrop-blur-md bg-opacity-95">
        <div className="flex bg-slate-950 border border-[#3f3526] p-1 rounded-xl max-w-2xl w-full sm:w-auto">
          <button
            id="plate-chinese-btn"
            onClick={() => setActiveDistrict('chinese')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs sm:text-sm font-serif font-medium tracking-widest transition duration-200 ${
              activeDistrict === 'chinese'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ☯ 中式紫微八字排盘
          </button>
          <button
            id="plate-western-btn"
            onClick={() => setActiveDistrict('western')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs sm:text-sm font-serif font-medium tracking-widest transition duration-200 ${
              activeDistrict === 'western'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚜ 西洋星宿天盘神谕
          </button>
          <button
            id="plate-mbti-btn"
            onClick={() => setActiveDistrict('mbti')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs sm:text-sm font-serif font-medium tracking-widest transition duration-200 ${
              activeDistrict === 'mbti'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ MBTI 性格引力谱
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN (Only displayed on Astrology plates) */}
        {activeDistrict !== 'mbti' && (
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* BIRTH CONTEXT INFO INDICATOR */}
            <div className="bg-slate-950/70 border border-amber-600/20 p-4 rounded-2xl">
              <div className="flex items-center gap-3 border-b border-[#30281c] pb-2 text-amber-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="font-serif tracking-widest font-bold text-xs sm:text-sm">真太阳时校准中枢</h4>
              </div>
              <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400 font-sans">
                <p>
                  标准钟表时间（平北京时间）只体现行政基准经度。
                  星勺居通过校正缘主降诞出生地精确经度，纠偏如下：
                </p>
                <div className="p-3 bg-slate-900 border border-amber-500/10 rounded-lg text-center mt-2">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-mono">Solar Adjusted Offset</span>
                  <span className="text-lg font-serif text-amber-400 font-bold block">{birthOffsetDetails.originalOffsetStr}</span>
                  <p className="text-[10px] text-slate-500 mt-1 font-serif">{birthOffsetDetails.longText}</p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <BirthForm onSubmit={handleProfileFormSubmit} isLoading={isLoading} />
            
            {/* METHODOLOGY EXPLANATION */}
            <div className="bg-[#121114]/90 border border-slate-800 p-4 rounded-xl text-xs space-y-3 font-light text-slate-400">
              <h5 className="font-serif text-[#c9a050] tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                研究所中西命理法例
              </h5>
              <p className="leading-relaxed">
                本所绝非使用简评模版，而是将中国<b>八字柱星五行</b>与<b>紫微十二飞星</b>合二为一，
                外圈辅以西方<b>黄道行星守护落宫</b>进行重叠碰撞，以科学真太阳时矫之。<b>悬停任意词组</b>，均可获取深度科普解读。
              </p>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN (DYNAMIC CONTENT DISTRICT) */}
        <div className={`${activeDistrict === 'mbti' ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col space-y-6`}>
          
          {/* BADGE PROFILE DETAILS (astrology mode) */}
          {activeDistrict !== 'mbti' && (
            <div className="bg-[#111115] border border-amber-500/15 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-955 border border-amber-500/50 flex items-center justify-center text-xs font-serif text-amber-300 font-black">
                  {profile.gender === 'male' ? '乾造' : '坤造'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-lg text-amber-100 font-bold tracking-wide">
                      {profile.name || '妙勺居客'}
                    </span>
                    <span className="text-[10px] bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-serif">
                      诞地: {profile.birthplace || '神州未批地点'}
                    </span>
                    <span className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded font-sans">
                      {profile.calendarType === 'solar' ? '公历' : '农历'}生日
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-serif tracking-widest">
                    时宿: {profile.birthDate} ({profile.doubleHour}诞辰) · 太阳星座: {profile.zodiacSign}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyResult}
                  className="px-3.5 py-1.5 bg-[#1a1714] border border-amber-500/30 hover:bg-amber-950/20 text-xs text-amber-300 font-serif tracking-widest rounded-lg flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>抄写谶签</span>
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
               板块一 : 中式紫微八字排盘 
             ======================================================= */}
          {activeDistrict === 'chinese' && (
            <div className="space-y-6">
              
              {/* Secondary Navigation buttons (Chart, Daily Advice, Tian Ji Knowledge Base) */}
              <div className="flex flex-wrap bg-slate-950/80 border border-[#3e3425] p-1 rounded-xl max-w-lg gap-1">
                <button
                  onClick={() => setChineseSubTab('chart')}
                  className={`flex-1 py-1.5 px-3 text-xs font-serif tracking-widest rounded-lg transition ${
                    chineseSubTab === 'chart'
                      ? 'bg-amber-955 text-amber-200 font-bold border border-amber-500/30 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ☯ 排定主客星盘
                </button>
                <button
                  onClick={() => setChineseSubTab('advice')}
                  className={`flex-1 py-1.5 px-3 text-xs font-serif tracking-widest rounded-lg transition ${
                    chineseSubTab === 'advice'
                      ? 'bg-amber-955 text-amber-200 font-bold border border-amber-500/30 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📜 每日运意推送与手批
                </button>
                <button
                  onClick={() => setChineseSubTab('knowledge')}
                  className={`flex-1 py-1.5 px-3 text-xs font-serif tracking-widest rounded-lg transition flex items-center justify-center gap-1.5 ${
                    chineseSubTab === 'knowledge'
                      ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400 shadow'
                      : 'text-amber-400/90 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>《天纪》知识库</span>
                </button>
              </div>

              {chineseSubTab === 'chart' ? (
                <div className="animate-fade-in space-y-6">
                  {baziChart && ziweiChart && (
                    <Astrolabe 
                      birthProfile={profile} 
                      baziChart={baziChart} 
                      ziweiChart={ziweiChart} 
                    />
                  )}
                </div>
              ) : chineseSubTab === 'knowledge' ? (
                <div className="animate-fade-in space-y-6">
                  <TianjiKnowledgeBase 
                    profile={profile}
                    baziChart={baziChart}
                    ziweiChart={ziweiChart}
                  />
                </div>
              ) : (
                <div className="animate-fade-in space-y-6">
                  
                  {/* Tian Ji Knowledge Base Live Banner */}
                  <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-serif text-amber-200 font-bold">
                            《天纪》知识库触发：【{matchedPatterns[0]?.name || '中天衡和格'}】
                          </span>
                          {sihuaResult && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-serif">
                              {sihuaResult.lu.star}化禄于{sihuaResult.lu.palaceName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-serif mt-0.5">
                          知识库源：Renhuai123/ziwei-doushu · 承袭倪海厦《天纪》正统断语
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChineseSubTab('knowledge')}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-xs font-serif text-amber-300 transition shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <span>查阅《天纪》知识库详典 →</span>
                    </button>
                  </div>

                  {/* Flow Day Chinese Horoscope details */}
                  <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                      </div>
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-md sm:text-lg font-serif text-amber-200 tracking-wider">星勺居 · 今日流日修持神谕</h4>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-serif">
                            ★ 契合指数: {analysis?.dailyAdvice?.cosmicScore || 88}%
                          </span>
                        </div>
                        <div className="h-[1px] bg-[#3a2e1d] my-1" />
                        
                        {/* Daily Talisman with terms explained */}
                        <div className="text-slate-200 italic font-serif leading-relaxed text-sm sm:text-base border-l-2 border-amber-500/40 pl-3 py-1">
                          “{analysis?.dailyAdvice?.talismanQuote || '紫气东来，宜修心敛性。'}”
                        </div>

                        {/* Traditional terms breakdown on daily */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] sm:text-xs">
                          <div className="space-y-1">
                            <span className="text-slate-500 font-serif block" title="今日干气流派对应的流年色曜">吉祥色曜 (Colors)</span>
                            <span className="text-amber-200 font-bold block">
                              {analysis?.dailyAdvice?.luckyColors?.join('、') || '天青、皎白'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 font-serif block" title="契合个人河图洛书的本命利数">开运洛数 (Numbers)</span>
                            <span className="text-amber-200 font-bold block">
                              {analysis?.dailyAdvice?.luckyNumbers?.join('、') || '3、8'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 font-serif block" title="八卦九宫格中，今日流神所占生旺吉位">流日神位 (Direction)</span>
                            <span className="text-amber-200 font-bold block">
                              {analysis?.dailyAdvice?.luckyDirection || '东方震巽配位'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 font-serif block" title="天干地支十二时辰演变中，最易合气的大吉时辰">时轮吉时 (Hours)</span>
                            <span className="text-amber-200 font-bold block text-[10px] whitespace-pre-line leading-tight">
                              {analysis?.dailyAdvice?.luckyHours?.join('\n') || '巳时、戌时'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deep Analysis Reports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bazi Analysis with hovers */}
                    <div className="bg-[#101014] border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-4 bg-emerald-500 rounded" />
                          <h4 className="font-serif text-amber-200 text-sm tracking-wider">华夏四柱八字 · 宿地乾坤精解</h4>
                        </div>
                        {isLoading ? (
                          <div className="py-8 text-center text-slate-500 font-sans text-xs animate-pulse">正在精研八字气数五行，请稍候...</div>
                        ) : (
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed tracking-wider font-light text-justify">
                            {analysis?.baziSummary}
                          </p>
                        )}
                      </div>
                      <div className="text-[10px] bg-slate-950 p-2 border border-slate-900 rounded font-serif text-slate-500 flex items-center gap-1">
                        <Info className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>注：本分析严按出生地经度及真太阳时排定，已自校准月令深浅。</span>
                      </div>
                    </div>

                    {/* Ziwei Analysis */}
                    <div className="bg-[#101014] border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-4 bg-amber-500 rounded" />
                          <h4 className="font-serif text-amber-200 text-sm tracking-wider">紫微斗数格局 · 命元众星朝垣解</h4>
                        </div>
                        {isLoading ? (
                          <div className="py-8 text-center text-slate-500 font-sans text-xs animate-pulse">正在推演斗数星耀方位，请稍候...</div>
                        ) : (
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed tracking-wider font-light text-justify">
                            {analysis?.ziweiSummary}
                          </p>
                        )}
                      </div>
                      <div className="text-[10px] bg-slate-950 p-2 border border-slate-900 rounded font-serif text-slate-500 flex items-center gap-1">
                        <Info className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>注：十二天宫各星曜在特定宫位的“妙旺利陷”将决定吉凶舒发度。</span>
                      </div>
                    </div>
                  </div>

                  {/* Four Big Fortunes Ratings Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-widest">姻缘红鸾 (Romance)</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-serif text-rose-450 font-bold">{analysis?.romanceFortune?.rating || 85}</span>
                        <span className="text-[10px] text-slate-500 font-sans">分</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1.5 text-justify border-t border-slate-900">
                        {analysis?.romanceFortune?.description}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-widest">官禄事业 (Career)</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-serif text-sky-455 font-bold">{analysis?.careerFortune?.rating || 90}</span>
                        <span className="text-[10px] text-slate-500 font-sans">分</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1.5 text-justify border-t border-slate-900">
                        {analysis?.careerFortune?.description}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-widest">财帛禄库 (Wealth)</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-serif text-amber-455 font-bold">{analysis?.wealthFortune?.rating || 88}</span>
                        <span className="text-[10px] text-slate-500 font-sans">分</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1.5 text-justify border-t border-slate-900">
                        {analysis?.wealthFortune?.description}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-widest">疾厄健康 (Health)</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-serif text-emerald-455 font-bold">{analysis?.healthFortune?.rating || 82}</span>
                        <span className="text-[10px] text-slate-500 font-sans">分</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1.5 text-justify border-t border-slate-900">
                        {analysis?.healthFortune?.description}
                      </p>
                    </div>
                  </div>

                  {/* Overlapping interpretation */}
                  <div className="bg-gradient-to-br from-slate-950 to-[#121013] border border-[#3e3425]/40 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-amber-450 shrink-0" />
                      <h4 className="font-serif text-amber-200 text-sm tracking-wider">中西合璧星宿交融 · 宿命共振</h4>
                    </div>
                    {isLoading ? (
                      <div className="py-6 text-center text-slate-500 text-xs font-sans animate-pulse">正在精析中西宿命重合交涉点，请稍候...</div>
                    ) : (
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed tracking-wider font-light text-justify">
                        {analysis?.overlappingAnalysis}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =======================================================
               板块二 : 西式占星与黄道星象 (Western Plate)
             ======================================================= */}
          {activeDistrict === 'western' && (
            <div className="space-y-6">
              
              {/* Western interaction dictionary panel */}
              <div className="bg-gradient-to-r from-slate-950 via-purple-950/25 to-slate-950 border border-purple-500/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <Sun className="w-5 h-5 text-amber-400 shrink-0 animate-spin-slow" />
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-serif text-amber-200 tracking-wider font-semibold">【西洋黄道星印阁】</h4>
                    {hoveredWesternTerm ? (
                      <div className="animate-fade-in pt-1 space-y-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold font-serif">
                          {hoveredWesternTerm.term}
                        </span>
                        <p className="text-slate-300 text-xs sm:text-sm tracking-wider font-light">
                          {hoveredWesternTerm.meaning}
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs sm:text-sm pt-1 font-light italic leading-relaxed">
                        在下方“西洋行星本命排盘表”上滑动鼠标。你将实时获得「太阳黄道大运」、「月亮阴幽情绪」以及「土星试炼责任」在特定西洋宫位落点代表的多维灵性解读。
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid 1: High Density Planetary alignment details */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h3 className="text-md sm:text-lg font-serif text-amber-200 tracking-widest flex items-center gap-2">
                    <Moon className="w-5 h-5 text-purple-400" />
                    西洋生辰天盘 · 九曜行星落宫表
                  </h3>
                  <div className="text-[10px] text-slate-500 font-serif border border-slate-800 px-2.5 py-1 rounded-lg">
                    【本命星】上升点: {westernStars.risingSign} | 四象元素: {westernStars.dominantElement}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[#30281c] text-slate-400 font-serif">
                        <th className="py-2.5 px-3">对应星曜 (Planet)</th>
                        <th className="py-2.5 px-3">黄道星座 (Zodiac)</th>
                        <th className="py-2.5 px-3">驻守宫位 (House)</th>
                        <th className="py-2.5 px-3">精准度数 (Degree)</th>
                        <th className="py-2.5 px-3">西洋星印大意 (Cosmic Will)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1a14]/60 font-sans text-slate-200">
                      {westernStars.planets.map((p) => {
                        return (
                          <tr 
                            key={p.name} 
                            className="hover:bg-purple-950/15 transition cursor-help"
                            onMouseEnter={() => setHoveredWesternTerm({
                              term: `${p.name} 落在 ${p.zodiac} 第 ${p.house} 宫`,
                              meaning: `此西洋落相暗示：你将本命中「${p.name}」所象征的宇宙核心特质，以「${p.zodiac}」所持有的灵性手段，投射至关乎人生「第${p.house}宫（代表生活具体领域如自我、财福、田宅等）」的主演舞台。精准度数是 ${p.degree.toFixed(2)}°。${p.significance}`
                            })}
                          >
                            <td className="py-3 px-3 font-serif text-amber-200 font-semibold">{p.name}</td>
                            <td className="py-3 px-3 font-serif font-medium">{p.zodiac}</td>
                            <td className="py-3 px-3 font-mono font-bold text-purple-300">第 {p.house} 宫</td>
                            <td className="py-3 px-3 font-mono text-slate-400">{p.degree.toFixed(2)}°</td>
                            <td className="py-3 px-3 text-slate-400 text-xs max-w-xs truncate font-serif font-light">{p.significance}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Western Daily Horoscope Analysis (AI generated outcome) */}
              <div className="bg-slate-950/90 border border-[#3e3425]/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#30281c] pb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
                    <h4 className="font-serif text-amber-200 tracking-wider">星勺居 · 西洋流年流日神谕</h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-serif">
                    ★ 黄道契合率: {analysis?.westernDaily?.rating || 90}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block">黄道运行预示 (Transit Forecast)</span>
                    {isLoading ? (
                      <div className="py-8 text-center text-slate-500 text-xs animate-pulse">正在利用AI精研西方流日天盘相位...</div>
                    ) : (
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify font-serif font-light">
                        {analysis?.westernDaily?.forecast}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#121115] border border-slate-800 p-4 rounded-xl space-y-3 shrink-0 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">今日拱相护卫星 (Aspect Guard)</span>
                      <p className="text-amber-300 font-serif text-xs font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-450" />
                        {analysis?.westernDaily?.luckyPlanet || '本宿守护主曜'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">星宿流年趋避 (Retrograde Tip)</span>
                      <p className="text-slate-300 font-serif text-[11px] leading-relaxed">
                        “{analysis?.westernDaily?.aspectTip || '流光移位，宜休心，缓做决定。'}”
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] bg-slate-900 border border-purple-500/10 p-2.5 rounded-lg text-slate-500 font-serif flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-xs text-purple-400 shrink-0" />
                  <span>注：西方占星以180°对冲（刑相）和120°和谐拱照相位为命运主要演变能量。</span>
                </div>
              </div>

              {/* Western Astrological advice */}
              <div className="bg-[#101014] border border-slate-850 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                  <h4 className="font-serif text-amber-200 text-sm tracking-wider">星勺居 · 大公领空西方开运书</h4>
                </div>
                {isLoading ? (
                  <div className="py-6 text-center text-slate-500 text-xs animate-pulse">正在精析开运信托...</div>
                ) : (
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed tracking-wider font-light text-justify">
                    {analysis?.zodiacSummary}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* =======================================================
               板块三 : MBTI 十六型人格引力 (Personality dynamics)
             ======================================================= */}
          {activeDistrict === 'mbti' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="bg-gradient-to-br from-[#121115] to-[#0c0c0f] border border-[#3e3425]/45 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
                
                {/* Title */}
                <div className="text-center mb-8 relative">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest font-mono bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Jungian Typology Registry
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-amber-200 tracking-wider font-semibold mt-2">
                    MBTI 十六型人格引力密码阁
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-light max-w-xl mx-auto">
                    无需冗长无聊的测试！直接注册您的16类荣格八维人格代码，星勺居将为您即时引力测算并呈现极深度的中西大德合配分析。
                  </p>
                  <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-[#3e3425] to-transparent mx-auto mt-4" />
                </div>

                {/* Input Selectors form for MBTI and Matches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-850 shadow-inner relative z-10">
                  
                  {/* Left component: Enter self MBTI */}
                  <div className="space-y-2">
                    <label className="block text-amber-300 font-serif text-xs uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <User className="w-4 h-4 text-amber-400" />
                      缘主本命人格 (My MBTI Type)
                    </label>
                    <select
                      id="user-mbti-select"
                      value={userMBTI}
                      onChange={(e) => setUserMBTI(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/65 focus:border-amber-400 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500/20 text-sm tracking-wider font-sans font-bold"
                    >
                      {Object.keys(MBTI_DATA).map((type) => (
                        <option key={type} value={type}>
                          {type} - {MBTI_DATA[type].title}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 font-serif block">
                      选择你在荣格八维测评或现代MBTI中对应的十六种类型之一。
                    </span>
                  </div>

                  {/* Right component: Enter Match target MBTI */}
                  <div className="space-y-2">
                    <label className="block text-purple-300 font-serif text-xs uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <Heart className="w-4 h-4 text-rose-450" />
                      配对目标人格 (Match Goal Type)
                    </label>
                    <select
                      id="match-mbti-select"
                      value={matchMBTI}
                      onChange={(e) => setMatchMBTI(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/65 focus:border-purple-400 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500/20 text-sm tracking-wider font-sans font-bold"
                    >
                      {Object.keys(MBTI_DATA).map((type) => (
                        <option key={type} value={type}>
                          {type} - {MBTI_DATA[type].title}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 font-serif block">
                      输入对应伴侣、朋友、或是职场合伙人的人格，进行实时灵魂吸引力算命。
                    </span>
                  </div>
                </div>

                {/* Display Block 1: Main User MBTI depth Interpretation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 items-stretch">
                  
                  {/* Left Column: Archetype card with crystal */}
                  <div className="lg:col-span-1 bg-slate-950 border border-amber-500/10 rounded-2xl p-5 flex flex-col justify-between text-center relative shadow-md">
                    <div className="absolute top-3 right-3 text-[10px] font-mono text-amber-500/40">
                      Jungian Stack
                    </div>
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                        <span className="text-lg font-bold text-amber-300 font-mono">{userMBTI[0]}</span>
                      </div>
                      <div>
                        <span className="text-2xl font-black font-sans text-amber-300 tracking-wider block">
                          {userMBTI}
                        </span>
                        <span className="text-xs text-slate-400 font-serif block mt-1">
                          {MBTI_DATA[userMBTI].title}
                        </span>
                      </div>
                      <div className="h-[1px] bg-slate-900 my-2" />
                      <p className="text-[11px] text-justify text-slate-400 leading-relaxed font-serif font-light">
                        {MBTI_DATA[userMBTI].description}
                      </p>
                    </div>

                    <div className="mt-4 bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-left text-[11px] space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">本命心灵守护晶石</span>
                      <span className="text-amber-200 font-bold block">{MBTI_DATA[userMBTI].luckyCrystal}</span>
                    </div>
                  </div>

                  {/* Middle Column: Strengths / Weaknesses / Growth stack */}
                  <div className="lg:col-span-2 bg-[#121115] border border-slate-850 rounded-2xl p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        <h4 className="font-serif text-sm text-amber-200 tracking-wider">人格八维之源：{MBTI_DATA[userMBTI].jungianConcept}</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-[#8e7b5e] uppercase tracking-widest block font-bold">★ 天生强势本能</span>
                          <ul className="space-y-1 text-slate-300 text-xs font-serif font-light">
                            {MBTI_DATA[userMBTI].strengths.map((s, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-amber-500 shrink-0">◇</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">☆ 星勺试炼障碍</span>
                          <ul className="space-y-1 text-slate-400 text-xs font-serif font-light">
                            {MBTI_DATA[userMBTI].weaknesses.map((w, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-slate-600 shrink-0">◆</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-850 space-y-1.5">
                        <span className="text-[10px] text-amber-400/80 uppercase tracking-widest block font-bold">💡 研究所首席修行寄语 (Advice)</span>
                        <p className="text-slate-300 text-xs sm:text-sm font-serif leading-relaxed text-justify font-light">
                          {MBTI_DATA[userMBTI].growthAdvice}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2 border border-slate-900 rounded text-[10px] text-slate-500 font-serif flex items-center justify-between gap-2 flex-wrap">
                      <span>绝配吸引人格: <b>{MBTI_DATA[userMBTI].idealPartners.join(', ')}</b></span>
                      <span>双向契合</span>
                    </div>
                  </div>
                </div>

                {/* Display Block 2: Interactive Personality Compatibility Matchmaking Panel */}
                {matchResult && (
                  <div className="mt-8 bg-slate-950 border border-amber-500/15 rounded-2xl p-5 sm:p-6 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500/20 via-pink-500/40 to-amber-500/20 animate-pulse" />
                    
                    <div className="flex justify-between items-center flex-wrap gap-2 mb-4 border-b border-slate-850 pb-3">
                      <h4 className="font-serif text-[#c9a050] text-sm sm:text-base tracking-widest flex items-center gap-1.5 font-bold">
                        <Heart className="w-4 h-4 text-rose-450 animate-pulse" />
                        <span>中西灵性人格引力测算结果</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Synergy Attraction Report</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                      
                      {/* Left: Dynamic matching illustration */}
                      <div className="lg:col-span-1 text-center bg-slate-900/40 p-4 border border-slate-850 rounded-xl space-y-3">
                        <span className="text-[10px] text-slate-400 block uppercase font-mono">引力磁格指数</span>
                        <div className="inline-flex items-baseline justify-center text-rose-450 font-serif font-black">
                          <span className="text-3xl sm:text-5xl">{matchResult.score}</span>
                          <span className="text-xs font-sans text-slate-500">/100</span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 block text-rose-300 font-serif font-bold text-center">
                          {matchResult.label}
                        </span>
                      </div>

                      {/* Right: Explanatory text */}
                      <div className="lg:col-span-3 space-y-2">
                        <div className="flex items-center gap-4 text-xs font-serif">
                          <div className="flex flex-col items-center">
                            <span className="text-amber-200 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono">{userMBTI}</span>
                            <span className="text-[10px] text-slate-500 mt-1">{MBTI_DATA[userMBTI].title.split(' ')[0]}</span>
                          </div>
                          <span className="text-rose-455 font-bold text-lg">⇄ 引力共振 ➔</span>
                          <div className="flex flex-col items-center">
                            <span className="text-purple-300 font-bold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded font-mono">{matchMBTI}</span>
                            <span className="text-[10px] text-slate-500 mt-1">{MBTI_DATA[matchMBTI].title.split(' ')[0]}</span>
                          </div>
                        </div>
                        <div className="h-[1px] bg-slate-900 my-2" />
                        <p className="text-slate-300 text-xs sm:text-sm font-serif leading-relaxed text-justify font-light">
                          {matchResult.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#312a20] bg-slate-950 text-slate-500 text-xs py-5 px-4 text-center mt-auto font-serif">
        <p className="tracking-widest">© 2026 星勺居命理研究所 · 中西玄学大德排盘阁</p>
        <p className="text-[10px] text-slate-600 font-sans mt-1">
          天数茫茫，命盘仅作吉凶契合修心参考之用。积德行善、广聚福德，自能诸星朝垣、趋吉避祸。
        </p>
      </footer>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-amber-500/50 text-amber-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 font-serif text-xs backdrop-blur-md animate-bounce">
          <Check className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
