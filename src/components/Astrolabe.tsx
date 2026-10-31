/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Stars, 
  Shield, 
  Flame, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Smartphone, 
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { BaziChart, ZiweiPalace, BirthProfile } from '../types';
import { METAPHYSICAL_DICTIONARY, getStarInPalaceExplanation } from '../utils/astrology';
import { 
  PLAIN_PALACES_DICT, 
  PLAIN_MINOR_STARS, 
  PLAIN_SIHUA_DICT, 
  getStarPalacePlainExplanation 
} from '../utils/plainAstrology';

interface AstrolabeProps {
  birthProfile: BirthProfile;
  baziChart: BaziChart;
  ziweiChart: ZiweiPalace[];
}

// Map Western Zodiac Elements to styles
const ZODIAC_ELEMENTS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  "火象": { bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-400", label: "火象 (热情与本能)" },
  "土象": { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-400", label: "土象 (务实与定力)" },
  "风象": { bg: "bg-sky-500/10", border: "border-sky-500/40", text: "text-sky-400", label: "风象 (智慧与交际)" },
  "水象": { bg: "bg-indigo-500/10", border: "border-indigo-500/40", text: "text-indigo-400", label: "水象 (灵感与情感)" },
};

// Five Elements colors
const ELEMENT_COLORS: Record<string, { text: string; bg: string; fill: string; desc: string }> = {
  "木": { text: "text-emerald-400", bg: "bg-emerald-500/15", fill: "bg-emerald-500", desc: "主仁、生发、生机流行" },
  "火": { text: "text-red-400", bg: "bg-red-500/15", fill: "bg-red-500", desc: "主礼、热烈、文明之象" },
  "土": { text: "text-amber-400", bg: "bg-amber-500/15", fill: "bg-amber-500", desc: "主信、稼穑、厚载万物" },
  "金": { text: "text-yellow-400", bg: "bg-yellow-500/15", fill: "bg-yellow-500", desc: "主义、刚坚、收敛变革" },
  "水": { text: "text-blue-400", bg: "bg-blue-500/15", fill: "bg-blue-500", desc: "主智、润下、通达周流" },
};

export default function Astrolabe({ birthProfile, baziChart, ziweiChart }: AstrolabeProps) {
  const zodiacInfo = ZODIAC_ELEMENTS[birthProfile.zodiacSign] || ZODIAC_ELEMENTS["火象"];

  // Default selected palace: 命宫
  const initialIndex = ziweiChart.findIndex(p => p.name === "命宫");
  const [selectedPalaceIndex, setSelectedPalaceIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 0);

  // Inspector mode: 'plain' (大白话详解) or 'classical' (古籍玄学)
  const [explainMode, setExplainMode] = useState<'plain' | 'classical'>('plain');

  // Floating explanation popover state for Bazi / hover elements
  const [activeExplanations, setActiveExplanations] = useState<{
    term: string;
    originalMeaning: string;
    combinedMeaning?: string;
    category: string;
  } | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const inspectorCardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll mobile carousel tab into view when selectedPalaceIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      const activeBtn = carouselRef.current.querySelector(`[data-palace-index="${selectedPalaceIndex}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedPalaceIndex]);

  const handleSelectPalace = (index: number, shouldScrollToInspector = false) => {
    setSelectedPalaceIndex(index);
    const palace = ziweiChart[index];
    if (palace) {
      handleTermHoverOrClick(palace.name, "斗数宫位");
    }
    if (shouldScrollToInspector && inspectorCardRef.current) {
      inspectorCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevPalace = () => {
    const nextIdx = (selectedPalaceIndex - 1 + ziweiChart.length) % ziweiChart.length;
    handleSelectPalace(nextIdx);
  };

  const handleNextPalace = () => {
    const nextIdx = (selectedPalaceIndex + 1) % ziweiChart.length;
    handleSelectPalace(nextIdx);
  };

  // Helper trigger for term hover/click
  const handleTermHoverOrClick = (
    term: string, 
    category: string, 
    palaceContext?: string
  ) => {
    let originalMeaning = METAPHYSICAL_DICTIONARY[term] || METAPHYSICAL_DICTIONARY[term.replace("宫", "")] || `【${term}】此为上古典籍命理中的关键格局词组，蕴含先贤智慧印记。`;
    let combinedMeaning = undefined;
    if (palaceContext && category === "星曜") {
      combinedMeaning = getStarInPalaceExplanation(term, palaceContext);
    }

    setActiveExplanations({
      term,
      originalMeaning,
      combinedMeaning,
      category
    });
  };

  // Mapping standard 4x4 surrounding grid coordinates clockwise
  const perimeterCoords = [
    { row: "row-start-1 col-start-1" },
    { row: "row-start-1 col-start-2" },
    { row: "row-start-1 col-start-3" },
    { row: "row-start-1 col-start-4" },
    { row: "row-start-2 col-start-4" },
    { row: "row-start-3 col-start-4" },
    { row: "row-start-4 col-start-4" },
    { row: "row-start-4 col-start-3" },
    { row: "row-start-4 col-start-2" },
    { row: "row-start-4 col-start-1" },
    { row: "row-start-3 col-start-1" },
    { row: "row-start-2 col-start-1" }
  ];

  const getElementSingle = (stemOrBranch: string) => {
    if (["甲", "乙", "寅", "卯"].includes(stemOrBranch)) return "木";
    if (["丙", "丁", "巳", "午"].includes(stemOrBranch)) return "火";
    if (["戊", "己", "辰", "戌", "丑", "未"].includes(stemOrBranch)) return "土";
    if (["庚", "辛", "申", "酉"].includes(stemOrBranch)) return "金";
    return "水";
  };

  // Active palace data
  const currentPalace = ziweiChart[selectedPalaceIndex] || ziweiChart[0];
  const currentPalacePlain = PLAIN_PALACES_DICT[currentPalace.name] || {
    name: currentPalace.name,
    shortDesc: "关键人生领域",
    plainTalk: `掌管人生中与${currentPalace.name}密切相关的现实生活事务。`,
    lifeField: "日常行事"
  };

  // Calculate opposite palace (对宫)
  const oppositeIndex = (selectedPalaceIndex + 6) % 12;
  const oppositePalace = ziweiChart[oppositeIndex];

  return (
    <div className="w-full space-y-6">
      
      {/* SECTION 1: Oriental Eight Characters (八字四柱) */}
      <div id="bazi-card" className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600/10 via-amber-500/80 to-amber-600/10" />
        <h3 className="text-md sm:text-lg font-serif text-amber-200 tracking-widest mb-3 sm:mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>中式排盘 · 四柱八字乾坤</span>
          </span>
          <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
            真太阳时修正生辰
          </span>
        </h3>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-4 text-center mt-2">
          {/* Year Pillar */}
          <div 
            className="bg-slate-950/60 rounded-xl p-2 sm:p-3 border border-slate-800 hover:border-amber-400/40 transition cursor-pointer"
            onClick={() => handleTermHoverOrClick(`${baziChart.year.stem}${baziChart.year.branch}`, "年柱柱命", `${baziChart.year.stem}${baziChart.year.branch}`)}
          >
            <span className="text-slate-500 text-[9px] sm:text-xs font-serif mb-1 block">年柱 (祖荫)</span>
            <div className="text-lg sm:text-2xl font-serif text-amber-100 font-semibold mb-0.5 sm:mb-1">
              <span className={getElementSingle(baziChart.year.stem) === "木" ? "text-emerald-400" : getElementSingle(baziChart.year.stem) === "火" ? "text-red-400" : getElementSingle(baziChart.year.stem) === "土" ? "text-amber-400" : getElementSingle(baziChart.year.stem) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.year.stem}
              </span>
              <span className={getElementSingle(baziChart.year.branch) === "木" ? "text-emerald-400" : getElementSingle(baziChart.year.branch) === "火" ? "text-red-400" : getElementSingle(baziChart.year.branch) === "土" ? "text-amber-400" : getElementSingle(baziChart.year.branch) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.year.branch}
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] text-slate-400 bg-slate-900 border border-slate-800 rounded px-1 font-mono inline-block">
              {baziChart.year.fiveElement}
            </span>
            <div className="text-[9px] sm:text-[10px] text-amber-500/80 font-serif mt-1 font-medium truncate">
              {baziChart.year.tenDeities}
            </div>
          </div>

          {/* Month Pillar */}
          <div 
            className="bg-slate-950/60 rounded-xl p-2 sm:p-3 border border-slate-800 hover:border-amber-400/40 transition cursor-pointer"
            onClick={() => handleTermHoverOrClick(`${baziChart.month.stem}${baziChart.month.branch}`, "月柱柱命", `${baziChart.month.stem}${baziChart.month.branch}`)}
          >
            <span className="text-slate-500 text-[9px] sm:text-xs font-serif mb-1 block">月柱 (家尊)</span>
            <div className="text-lg sm:text-2xl font-serif text-amber-100 font-semibold mb-0.5 sm:mb-1">
              <span className={getElementSingle(baziChart.month.stem) === "木" ? "text-emerald-400" : getElementSingle(baziChart.month.stem) === "火" ? "text-red-400" : getElementSingle(baziChart.month.stem) === "土" ? "text-amber-400" : getElementSingle(baziChart.month.stem) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.month.stem}
              </span>
              <span className={getElementSingle(baziChart.month.branch) === "木" ? "text-emerald-400" : getElementSingle(baziChart.month.branch) === "火" ? "text-red-400" : getElementSingle(baziChart.month.branch) === "土" ? "text-amber-400" : getElementSingle(baziChart.month.branch) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.month.branch}
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] text-slate-400 bg-slate-900 border border-slate-800 rounded px-1 font-mono inline-block">
              {baziChart.month.fiveElement}
            </span>
            <div className="text-[9px] sm:text-[10px] text-amber-500/80 font-serif mt-1 font-medium truncate">
              {baziChart.month.tenDeities}
            </div>
          </div>

          {/* Day Pillar */}
          <div 
            className="bg-slate-950/80 rounded-xl p-2 sm:p-3 border border-amber-500/50 ring-1 ring-amber-500/20 shadow-lg cursor-pointer"
            onClick={() => handleTermHoverOrClick(`正印`, "日干元骨")}
          >
            <span className="text-amber-400 text-[9px] sm:text-xs font-serif mb-1 block font-bold">日柱 (日元本我)</span>
            <div className="text-lg sm:text-2xl font-serif text-amber-100 font-semibold mb-0.5 sm:mb-1">
              <span className={getElementSingle(baziChart.day.stem) === "木" ? "text-emerald-400" : getElementSingle(baziChart.day.stem) === "火" ? "text-red-400" : getElementSingle(baziChart.day.stem) === "土" ? "text-amber-400" : getElementSingle(baziChart.day.stem) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.day.stem}
              </span>
              <span className={getElementSingle(baziChart.day.branch) === "木" ? "text-emerald-400" : getElementSingle(baziChart.day.branch) === "火" ? "text-red-400" : getElementSingle(baziChart.day.branch) === "土" ? "text-amber-400" : getElementSingle(baziChart.day.branch) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.day.branch}
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] text-amber-300 bg-amber-900/30 border border-amber-500/30 rounded px-1 font-mono inline-block">
              {baziChart.day.fiveElement}
            </span>
            <div className="text-[9px] sm:text-[10px] text-amber-400 font-serif mt-1 font-bold truncate">
              本命日主
            </div>
          </div>

          {/* Hour Pillar */}
          <div 
            className="bg-slate-950/60 rounded-xl p-2 sm:p-3 border border-slate-800 hover:border-amber-400/40 transition cursor-pointer"
            onClick={() => handleTermHoverOrClick(`${baziChart.hour.stem}${baziChart.hour.branch}`, "时柱归结", `${baziChart.hour.stem}${baziChart.hour.branch}`)}
          >
            <span className="text-slate-500 text-[9px] sm:text-xs font-serif mb-1 block">时柱 (归宿)</span>
            <div className="text-lg sm:text-2xl font-serif text-amber-100 font-semibold mb-0.5 sm:mb-1">
              <span className={getElementSingle(baziChart.hour.stem) === "木" ? "text-emerald-400" : getElementSingle(baziChart.hour.stem) === "火" ? "text-red-400" : getElementSingle(baziChart.hour.stem) === "土" ? "text-amber-400" : getElementSingle(baziChart.hour.stem) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.hour.stem}
              </span>
              <span className={getElementSingle(baziChart.hour.branch) === "木" ? "text-emerald-400" : getElementSingle(baziChart.hour.branch) === "火" ? "text-red-400" : getElementSingle(baziChart.hour.branch) === "土" ? "text-amber-400" : getElementSingle(baziChart.hour.branch) === "金" ? "text-yellow-400" : "text-blue-400"}>
                {baziChart.hour.branch}
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] text-slate-400 bg-slate-900 border border-slate-800 rounded px-1 font-mono inline-block">
              {baziChart.hour.fiveElement}
            </span>
            <div className="text-[9px] sm:text-[10px] text-amber-500/80 font-serif mt-1 font-medium truncate">
              {baziChart.hour.tenDeities}
            </div>
          </div>
        </div>

        {/* Five Elements Balance Indicators */}
        <div className="mt-4 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-serif">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>干支五行气数 (点击可查解意)</span>
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {Object.entries({
              "木": baziChart.fiveElementsCount.wood,
              "火": baziChart.fiveElementsCount.fire,
              "土": baziChart.fiveElementsCount.earth,
              "金": baziChart.fiveElementsCount.gold,
              "水": baziChart.fiveElementsCount.water
            }).map(([elem, val]) => {
              const info = ELEMENT_COLORS[elem];
              return (
                <button
                  key={elem}
                  type="button"
                  onClick={() => handleTermHoverOrClick(elem, "五行气路")}
                  className="bg-slate-950/70 border border-slate-800/80 hover:border-amber-400/40 rounded-lg p-1.5 sm:p-2 text-center transition active:scale-95"
                >
                  <div className={`text-xs sm:text-sm font-serif font-bold ${info.text}`}>{elem}</div>
                  <div className="text-[11px] sm:text-xs font-mono text-slate-300 font-semibold">{val} 曜</div>
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
                    <div className={`h-full ${info.fill}`} style={{ width: `${Math.min(100, (val / 5) * 100)}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Astrolabe Chart with Mobile Touch Enhancements */}
      <div id="astrology-map-container" className="bg-slate-900/85 border border-amber-500/30 rounded-2xl p-3.5 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500/20 via-amber-500/80 to-purple-500/20" />
        
        {/* Header with mobile touch guidance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-md sm:text-lg font-serif text-amber-200 tracking-wider flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400 animate-spin-slow shrink-0" />
            <span>紫微斗数 · 十二天宫命盘</span>
            <span className="text-[10px] text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded bg-amber-500/10 font-sans">
              {ziweiChart[0]?.wujuName || "水二局"}
            </span>
          </h3>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full font-sans">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>支持点击选取宫格 · 手机触控</span>
            </span>
          </div>
        </div>

        {/* MOBILE PALACE QUICK-SELECTOR CAROUSEL (Thumb-friendly horizontal pill bar) */}
        <div className="mb-3.5 bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5">
          <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
            <span className="text-[11px] font-serif text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>十二宫快捷轮播 (手指滑动或点击切换)：</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevPalace}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 active:text-slate-950 rounded text-[11px] text-slate-200 flex items-center gap-0.5 transition font-serif"
                title="上一宫位"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>上宫</span>
              </button>
              <button
                type="button"
                onClick={handleNextPalace}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 active:text-slate-950 rounded text-[11px] text-slate-200 flex items-center gap-0.5 transition font-serif"
                title="下一宫位"
              >
                <span>下宫</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Horizontal scroll container */}
          <div 
            ref={carouselRef}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/30 py-1 px-0.5"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {ziweiChart.map((p, idx) => {
              const isSelected = idx === selectedPalaceIndex;
              const isSoulPalace = p.name === "命宫";
              const hasSihua = (p.sihuaStars && p.sihuaStars.length > 0);

              return (
                <button
                  key={p.name}
                  data-palace-index={idx}
                  type="button"
                  onClick={() => handleSelectPalace(idx, true)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all duration-200 flex items-center gap-1.5 border active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold border-amber-300 shadow-lg shadow-amber-500/20 ring-1 ring-amber-300'
                      : isSoulPalace
                      ? 'bg-amber-950/30 text-amber-300 border-amber-500/40 hover:bg-amber-900/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-amber-200'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className={`text-[10px] font-mono opacity-80 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                    ({p.earthlyBranch})
                  </span>
                  {hasSihua && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-rose-400'} animate-ping`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4x4 Outer Perimeter Grid Layout */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 bg-slate-950/90 border border-slate-850 p-1.5 sm:p-2.5 rounded-xl relative select-none">
          
          {/* CENTER PANEL: Dual Display (Western Constellation + Current Selected Palace Preview) */}
          <div 
            onClick={() => handleSelectPalace(selectedPalaceIndex, true)}
            className="col-start-2 col-span-2 row-start-2 row-span-2 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-xl p-2 sm:p-4 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden cursor-pointer group hover:border-amber-400 transition"
          >
            <div className="absolute inset-1.5 border border-dashed border-amber-500/15 rounded-full animate-spin-slow pointer-events-none" />
            
            <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
              <Stars className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-serif font-bold tracking-wider">中西交会中枢</span>
            </div>

            <p className="text-base sm:text-xl font-serif text-amber-100 font-bold tracking-wide">
              {birthProfile.zodiacSign} · {currentPalace.name}
            </p>

            <div className="flex items-center gap-1 mt-1 flex-wrap justify-center">
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${zodiacInfo.bg} ${zodiacInfo.border} ${zodiacInfo.text} font-bold`}>
                {zodiacInfo.label.split(' ')[0]}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-serif">
                {currentPalace.heavenlyStem}{currentPalace.earthlyBranch} · {currentPalacePlain.shortDesc}
              </span>
            </div>

            <p className="text-[10px] text-amber-300/80 font-sans mt-2 tracking-tight group-hover:underline flex items-center gap-1">
              <span>👇 点击下方看【白话通俗解】</span>
            </p>
          </div>

          {/* 12 PALACES OUTER LOOP */}
          {ziweiChart.map((palace, index) => {
            const coord = perimeterCoords[index];
            const isSoulPalace = palace.name === "命宫";
            const isSelected = index === selectedPalaceIndex;
            
            return (
              <div
                id={`palace-box-${index}`}
                key={palace.name}
                onClick={() => handleSelectPalace(index, true)}
                className={`${coord.row} rounded-lg p-1.5 sm:p-2 flex flex-col justify-between min-h-[96px] sm:h-32 transition-all duration-150 cursor-pointer relative group border ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 ring-2 ring-amber-400/90 shadow-[0_0_14px_rgba(251,191,36,0.25)] z-10'
                    : isSoulPalace 
                    ? 'border-amber-500/60 bg-amber-950/15 shadow-[0_0_8px_rgba(245,158,11,0.12)] hover:border-amber-400' 
                    : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 hover:bg-slate-850'
                } active:scale-95`}
              >
                {/* Header (Palace name & elements) */}
                <div className="flex justify-between items-start gap-1">
                  <span className={`text-[10px] sm:text-xs font-serif font-bold px-1.5 py-0.5 rounded transition ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : isSoulPalace 
                      ? 'bg-amber-500/90 text-slate-950 font-bold' 
                      : 'bg-slate-800 text-slate-300 group-hover:text-amber-200'
                  }`}>
                    {palace.name}
                  </span>
                  
                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">
                    {palace.heavenlyStem}{palace.earthlyBranch}
                  </span>
                </div>

                {/* Major/Minor Stars section */}
                <div className="flex-1 my-0.5 overflow-hidden flex flex-col gap-0.5 justify-center">
                  {/* Major Stars (bold amber/gold) */}
                  {palace.majorStars.length > 0 ? (
                    palace.majorStars.map(star => (
                      <div key={star} className="flex items-center justify-center gap-0.5">
                        <span className="text-[11px] sm:text-xs text-amber-300 font-serif font-bold tracking-tight group-hover:text-white transition">
                          {star}
                        </span>
                        {/* Sihua badge if matches */}
                        {palace.sihuaStars?.filter(s => s.star === star).map(si => (
                          <span
                            key={si.type}
                            className={`text-[8px] px-1 py-0 rounded font-bold ${
                              si.type === '禄' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' :
                              si.type === '权' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' :
                              si.type === '科' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40' :
                              'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            化{si.type}
                          </span>
                        ))}
                      </div>
                    ))
                  ) : (
                    <span className="text-[9px] text-slate-500 font-serif text-center italic">
                      借对宫星
                    </span>
                  )}

                  {/* Minor Stars */}
                  {palace.minorStars.slice(0, 2).map(star => (
                    <span 
                      key={star} 
                      className="text-[8px] sm:text-[9px] text-slate-400 font-serif text-center truncate"
                    >
                      {star}
                    </span>
                  ))}
                </div>

                {/* Footer (Decade and brightness) */}
                <div className="flex justify-between items-center text-[7.5px] sm:text-[8px] text-slate-400 border-t border-slate-800/80 pt-0.5">
                  <span className="font-mono text-amber-400/80">
                    {palace.decadeRange ? `${palace.decadeRange}岁` : `${palace.brightness || ''}`}
                  </span>
                  <span className="font-mono text-slate-400">
                    {isSelected ? '✓ 选中' : `${palace.earthlyBranch}支`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: THE PLAIN-TALK EXPLANATION INSPECTOR CARD (大白话通俗解密阁) */}
      <div 
        ref={inspectorCardRef}
        id="plain-explanation-inspector"
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/25 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 shadow-md" />

        {/* Card Header with Palace Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs sm:text-sm font-serif font-black shadow-sm">
                【{currentPalace.name}】
              </span>
              <span className="text-xs text-amber-300 font-mono">
                {currentPalace.heavenlyStem}{currentPalace.earthlyBranch}位 ({currentPalace.wujuName || "水二局"})
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-serif">
                {currentPalacePlain.shortDesc}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-serif text-amber-100 font-semibold flex items-center gap-1.5 pt-1">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>命盘文字大白话注解 · 不懂的人一目了然</span>
            </h4>
          </div>

          {/* Switch tabs: Plain Talk vs Classical */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setExplainMode('plain')}
                className={`px-3 py-1 text-xs rounded-md font-serif transition ${
                  explainMode === 'plain'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💬 通俗大白话
              </button>
              <button
                type="button"
                onClick={() => setExplainMode('classical')}
                className={`px-3 py-1 text-xs rounded-md font-serif transition ${
                  explainMode === 'classical'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📜 《天纪》古籍原旨
              </button>
            </div>

            {/* Quick Next/Prev Buttons on Inspector */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevPalace}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-lg text-slate-200 border border-slate-700 transition"
                title="上一宫"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPalace}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-lg text-slate-200 border border-slate-700 transition"
                title="下一宫"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 1. PALACE OVERVIEW IN PLAIN TALK */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shrink-0 mt-0.5">
              宫位管什么
            </span>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">
              {currentPalacePlain.plainTalk}
            </p>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-850">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>核心关联领域：<strong className="text-amber-200 font-normal">{currentPalacePlain.lifeField}</strong></span>
          </div>
        </div>

        {/* 2. MAJOR STARS IN THIS PALACE - THE CORE "白话解释" USER REQUESTED */}
        <div className="mt-4 space-y-3">
          <h5 className="text-xs sm:text-sm font-serif text-amber-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>【{currentPalace.name}】坐守主星 · 白话详解（例如：贪狼在迁移宫等）</span>
          </h5>

          {currentPalace.majorStars.length > 0 ? (
            currentPalace.majorStars.map((star) => {
              const plainData = getStarPalacePlainExplanation(star, currentPalace.name);
              const starClassical = METAPHYSICAL_DICTIONARY[star] || `【${star}星】北斗/南斗主星之一。`;

              return (
                <div 
                  key={star}
                  className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 sm:p-4 hover:border-amber-400/60 transition shadow-lg space-y-2.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-serif font-black text-amber-300 bg-amber-950/50 border border-amber-500/40 px-2.5 py-0.5 rounded-lg shadow-sm">
                        {star}星
                      </span>
                      <span className="text-xs font-serif text-slate-300 font-semibold">
                        {plainData.title}
                      </span>
                    </div>

                    {/* Sihua highlight for this star */}
                    {currentPalace.sihuaStars?.filter(s => s.star === star).map(si => {
                      const sihuaInfo = PLAIN_SIHUA_DICT[si.type];
                      return (
                        <span 
                          key={si.type}
                          className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1"
                        >
                          🔥 逢化{si.type} ({sihuaInfo?.name || "天命加持"})
                        </span>
                      );
                    })}
                  </div>

                  {explainMode === 'plain' ? (
                    <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                      {/* Plain talk meaning */}
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                        <p className="text-amber-300 font-serif font-medium text-xs flex items-center gap-1">
                          <span>💬 大白话真相：</span>
                        </p>
                        <p className="text-slate-200 font-light leading-relaxed">
                          {plainData.plainTalk}
                        </p>
                      </div>

                      {/* Practical life guidance */}
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1">
                        <p className="text-amber-400 font-serif font-medium text-xs flex items-center gap-1">
                          <span>💡 避坑与生活指南：</span>
                        </p>
                        <p className="text-amber-100/90 font-light leading-relaxed">
                          {plainData.advice}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Classical mode */
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs sm:text-sm leading-relaxed">
                      <p className="text-amber-400 font-serif font-medium text-xs">📜 《天纪》古籍原解：</p>
                      <p className="text-slate-300 font-light">{starClassical}</p>
                      <p className="text-slate-400 text-xs pt-1 border-t border-slate-800/80">
                        结合{currentPalace.name}气象：{getStarInPalaceExplanation(star, currentPalace.name)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Empty palace (借对宫) */
            <div className="bg-slate-950/70 border border-dashed border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 space-y-2">
              <p className="text-amber-300 font-serif font-semibold">
                📌 此宫无主星坐守（命理称‘空宫’）
              </p>
              <p className="text-slate-300 font-light leading-relaxed">
                【大白话】：这个宫位本身没有十四颗主曜之一，代表你在该生活领域受外界环境、他人以及<strong>对宫【{oppositePalace?.name || "对宫"}】</strong>的影响非常大！行事不宜过于主观武断，宜多借对宫星曜为镜，借力发力。
              </p>
            </div>
          )}
        </div>

        {/* 3. SIHUA EXPLANATION IN PLAIN TALK (化禄/化权/化科/化忌) */}
        {currentPalace.sihuaStars && currentPalace.sihuaStars.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
            <h5 className="text-xs sm:text-sm font-serif text-purple-300 font-semibold flex items-center gap-1.5">
              <span>⚡ 此宫天干化曜四化大白话精解</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentPalace.sihuaStars.map(si => {
                const info = PLAIN_SIHUA_DICT[si.type];
                return (
                  <div key={si.type} className="p-2.5 rounded-lg bg-slate-950/80 border border-purple-500/20 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {si.star} 化{si.type}
                      </span>
                      <span className="text-xs text-amber-200 font-serif">{info?.name}</span>
                    </div>
                    <p className="text-slate-300 text-xs font-light leading-relaxed">
                      {info?.plainMeaning}
                    </p>
                    <p className="text-[11px] text-amber-300/90 font-light">
                      💡 指南：{info?.advice}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. MINOR STARS PLAIN EXPLANATION */}
        {currentPalace.minorStars.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h5 className="text-xs font-serif text-slate-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>辅佐星曜白话速览</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {currentPalace.minorStars.map(star => {
                const plainMinor = PLAIN_MINOR_STARS[star] || `【${star}】辅助星曜，影响此宫位之细微机遇与性格色彩。`;
                return (
                  <div key={star} className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-850">
                    {plainMinor}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Mobile Bottom Fast Nav */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <button
            type="button"
            onClick={handlePrevPalace}
            className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-amber-300 rounded-lg flex items-center gap-1 border border-slate-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>上一宫: {ziweiChart[(selectedPalaceIndex - 1 + 12) % 12]?.name}</span>
          </button>
          
          <span className="text-slate-500 font-mono text-[11px]">
            {selectedPalaceIndex + 1} / 12 宫
          </span>

          <button
            type="button"
            onClick={handleNextPalace}
            className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-amber-300 rounded-lg flex items-center gap-1 border border-slate-700 transition"
          >
            <span>下一宫: {ziweiChart[(selectedPalaceIndex + 1) % 12]?.name}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 4: GLOBAL HOVER/TAP INTERACTIVE DICTIONARY PANEL */}
      {activeExplanations && (
        <div 
          id="hover-explanation-box" 
          className="bg-slate-950 border border-amber-500/30 rounded-xl p-3.5 shadow-xl transition-all duration-300 animate-fade-in"
        >
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1 w-full text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold font-serif">
                  {activeExplanations.category} · {activeExplanations.term}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveExplanations(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  关闭 ✕
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed font-light pt-1">
                {activeExplanations.originalMeaning}
              </p>
              {activeExplanations.combinedMeaning && (
                <div className="p-2 rounded bg-slate-900 border border-amber-500/20 mt-1.5 text-xs text-amber-200">
                  {activeExplanations.combinedMeaning}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
