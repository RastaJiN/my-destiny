/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Integrated Knowledge Base from Renhuai123/ziwei-doushu
 * Under MIT License (Code) & CC BY 4.0 (Dataset/Attribution)
 * Based on Master Ni Haixia's (倪海厦) 《天纪》 (Tian Ji) Zi Wei Dou Shu system.
 */

import React, { useState } from 'react';
import { BookOpen, Search, Compass, Shield, Flame, Sparkles, ExternalLink, Activity, Award, Bookmark } from 'lucide-react';
import { BirthProfile, ZiweiPalace, BaziChart } from '../types';
import { 
  TIANJI_PATTERNS_DB, 
  detectTianjiPatterns, 
  calculateTianjiSihua, 
  diagnoseTianjiShaOrgan, 
  TIANJI_CORPUS_QUOTES,
  SIHUA_DESCRIPTIONS,
  TianjiPattern
} from '../utils/tianji-ziwei';
import { METAPHYSICAL_DICTIONARY } from '../utils/astrology';

interface TianjiKnowledgeBaseProps {
  profile: BirthProfile;
  baziChart: BaziChart | null;
  ziweiChart: ZiweiPalace[] | null;
}

export default function TianjiKnowledgeBase({ profile, baziChart, ziweiChart }: TianjiKnowledgeBaseProps) {
  const [activeCategory, setActiveCategory] = useState<'matched' | 'patterns' | 'sihua' | 'health' | 'quotes' | 'dictionary'>('matched');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<TianjiPattern | null>(null);

  // Derive matched Tian Ji patterns & sihua for current user chart
  const soulPalace = ziweiChart?.find(p => p.name === '命宫') || ziweiChart?.[0];
  const yearStem = baziChart?.year.stem || "甲";
  const sihuaResult = ziweiChart ? calculateTianjiSihua(yearStem, ziweiChart) : null;
  
  const matchedPatterns = (soulPalace && ziweiChart && sihuaResult) 
    ? detectTianjiPatterns(soulPalace, ziweiChart, sihuaResult)
    : [];

  const shaDiagnosis = (ziweiChart && sihuaResult)
    ? diagnoseTianjiShaOrgan(ziweiChart, sihuaResult)
    : null;

  // Filtered patterns for pattern browser
  const filteredPatterns = TIANJI_PATTERNS_DB.filter(p => 
    !searchQuery || 
    p.name.includes(searchQuery) || 
    p.summary.includes(searchQuery) || 
    p.condition.includes(searchQuery) ||
    p.niHaixiaJudgment.includes(searchQuery)
  );

  // Filtered quotes
  const filteredQuotes = TIANJI_CORPUS_QUOTES.filter(q =>
    !searchQuery ||
    q.lecture.includes(searchQuery) ||
    q.topic.includes(searchQuery) ||
    q.quote.includes(searchQuery) ||
    q.explanation.includes(searchQuery)
  );

  return (
    <div className="w-full bg-slate-900/90 border border-amber-500/25 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
      
      {/* Header with Project Attribution */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-serif text-amber-200 tracking-widest font-semibold flex items-center gap-2">
              <span>《天纪》命理知识库 · 典藏阁</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-serif mt-1 tracking-wide">
            融合 GitHub 开源项目 <span className="text-amber-300 font-mono">Renhuai123/ziwei-doushu</span> 知识库 · 承袭倪海厦先生正统《天纪》体系
          </p>
        </div>

        {/* Source link badge */}
        <a 
          href="https://github.com/Renhuai123/ziwei-doushu" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-500/30 text-[11px] text-amber-300 hover:text-amber-100 hover:border-amber-400 transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          <span>知识库源: Renhuai123/ziwei-doushu (MIT & CC BY 4.0)</span>
        </a>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => { setActiveCategory('matched'); setSelectedPattern(null); }}
          className={`px-3 py-1.5 text-xs font-serif tracking-wider rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'matched'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'bg-slate-950/80 text-slate-300 hover:text-amber-200 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>当前排盘知识库匹配</span>
        </button>

        <button
          onClick={() => { setActiveCategory('patterns'); setSelectedPattern(null); }}
          className={`px-3 py-1.5 text-xs font-serif tracking-wider rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'patterns'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'bg-slate-950/80 text-slate-300 hover:text-amber-200 border border-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>格局大典知识库 ({TIANJI_PATTERNS_DB.length}大经典格局)</span>
        </button>

        <button
          onClick={() => { setActiveCategory('sihua'); setSelectedPattern(null); }}
          className={`px-3 py-1.5 text-xs font-serif tracking-wider rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'sihua'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'bg-slate-950/80 text-slate-300 hover:text-amber-200 border border-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>天纪四化精微论</span>
        </button>

        <button
          onClick={() => { setActiveCategory('health'); setSelectedPattern(null); }}
          className={`px-3 py-1.5 text-xs font-serif tracking-wider rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'health'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'bg-slate-950/80 text-slate-300 hover:text-amber-200 border border-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>五脏重煞定位疾厄法</span>
        </button>

        <button
          onClick={() => { setActiveCategory('quotes'); setSelectedPattern(null); }}
          className={`px-3 py-1.5 text-xs font-serif tracking-wider rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'quotes'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'bg-slate-950/80 text-slate-300 hover:text-amber-200 border border-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>倪师《天纪》原声讲义摘录</span>
        </button>
      </div>

      {/* SEARCH BAR (For browsing mode) */}
      {activeCategory !== 'matched' && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="在《天纪》知识库中搜索格局、星曜、断语或关键词（如 紫府同宫、化忌、心脏、七杀、六亲...）"
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400/70 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none tracking-wide transition"
          />
        </div>
      )}

      {/* 1. CURRENT CHART MATCHED KNOWLEDGE VIEW */}
      {activeCategory === 'matched' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Section: Matched Patterns */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-serif text-amber-300 font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>知识库自动识别：本命星盘触发格局</span>
            </h4>

            {matchedPatterns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedPatterns.map((pat) => (
                  <div key={pat.name} className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 space-y-2 hover:border-amber-400/60 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-amber-200 font-bold text-sm tracking-wider">
                        {pat.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-serif">
                        {pat.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {pat.summary}
                    </p>
                    <div className="text-[11px] text-slate-400 bg-slate-900/90 rounded p-2 border border-slate-800 space-y-1">
                      <span className="text-amber-400/90 font-serif block">📜 倪海厦《天纪》真传断语：</span>
                      <p className="text-slate-300 italic font-serif leading-relaxed">
                        {pat.niHaixiaJudgment}
                      </p>
                    </div>
                    <p className="text-[11px] text-emerald-400/90 font-serif pt-1">
                      💡 现代处世指引：{pat.modernAdvice}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic font-serif">
                本命各星曜归位中平，属于中天衡和之常态正格。
              </p>
            )}
          </div>

          {/* Section: Four Transformations Matched */}
          {sihuaResult && (
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <h4 className="text-xs sm:text-sm font-serif text-amber-300 font-semibold flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>知识库本命天干四化定位 (年干: {sihuaResult.yearStem})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[sihuaResult.lu, sihuaResult.quan, sihuaResult.ke, sihuaResult.ji].map(item => {
                  const cfg = SIHUA_DESCRIPTIONS[item.type];
                  return (
                    <div key={item.type} className={`bg-slate-950/80 border rounded-xl p-3 space-y-2 ${cfg.color}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold tracking-wider">
                          {cfg.title}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${cfg.badge}`}>
                          化{item.type}
                        </span>
                      </div>
                      <div className="text-xs font-serif text-slate-200">
                        落入星宿：<span className="font-bold text-amber-200">{item.star}</span> (在 <span className="font-bold text-amber-300">{item.palaceName}</span>)
                      </div>
                      <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                        {item.niHaixiaQuote}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Heavy Sha Organ Health Grounding */}
          {shaDiagnosis && (
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <h4 className="text-xs sm:text-sm font-serif text-amber-300 font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>天纪全盘重煞定位与中医五脏养生映射</span>
              </h4>

              <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-4 space-y-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-serif text-slate-400">
                    全盘煞曜最聚之地：<span className="text-amber-300 font-bold">{shaDiagnosis.heaviestPalace} ({shaDiagnosis.heaviestBranch}支)</span>
                  </span>
                  <span className="text-xs font-serif text-slate-400">
                    聚煞之宿：<span className="text-red-400 font-mono">{shaDiagnosis.shaStars.join('、')}</span>
                  </span>
                  <span className="text-xs font-serif text-slate-400">
                    对应脏腑经络：<span className="text-emerald-300 font-bold">{shaDiagnosis.organ} ({shaDiagnosis.meridian})</span>
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-serif leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">倪海厦老师中医养生真传指导：</span>
                  {shaDiagnosis.niHaixiaTCMAdvice}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PATTERNS KNOWLEDGE BASE BROWSER */}
      {activeCategory === 'patterns' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPatterns.map(pat => (
              <div 
                key={pat.name} 
                className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 space-y-2 cursor-pointer transition"
                onClick={() => setSelectedPattern(pat)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-amber-200 font-bold text-sm tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    {pat.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-serif ${
                    pat.type.includes('警示') ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  }`}>
                    {pat.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {pat.summary}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  触发配置：{pat.condition}
                </p>
                <div className="text-[11px] text-slate-400 font-serif italic bg-slate-900/60 p-2 rounded border border-slate-850">
                  {pat.niHaixiaJudgment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SIHUA DEEP EXPLANATIONS */}
      {activeCategory === 'sihua' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-slate-300 font-serif leading-relaxed">
            倪海厦老师在《天纪》中指出：紫微斗数若无四化，犹如画龙未曾点睛。四化（化禄、化权、化科、化忌）是因天干引动而产生的能量质变，乃命盘吉凶运转之灵魂。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(SIHUA_DESCRIPTIONS).map(([type, item]) => (
              <div key={type} className={`bg-slate-950/80 border rounded-xl p-4 space-y-2 ${item.color}`}>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm tracking-wide">
                    {item.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${item.badge}`}>
                    化{type}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-300 font-serif">
            <span className="text-amber-400 font-bold block">倪师关于“化忌”的重构解说：</span>
            <p className="leading-relaxed font-light">
              “很多人算命，一看到化忌就心惊胆战。我常讲，化忌不是绝路，化忌是人生的警铃。比如财帛宫化忌，不是说你永远穷，而是告诉你‘不可投机赌博，守正做实业即可安然度过’。懂得四化之理，就能趋吉避凶，化被动为主动。”
            </p>
          </div>
        </div>
      )}

      {/* 4. HEALTH SHA DIAGNOSIS */}
      {activeCategory === 'health' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-slate-300 font-serif leading-relaxed">
            《天纪》第8讲核心秘传：紫微斗数断疾，不单看疾厄宫。倪海厦身为名医，指出全盘最危险的隐患往往潜藏在“煞星聚集最多之地支宫位”。将该地支对应上中医经络与五脏六腑，即可精准预判一生的体质弱点。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { branch: "子", organ: "膀胱 / 生殖系统", meridian: "足太阳膀胱经", tip: "熬夜伤阴，宜顾护肾水" },
              { branch: "丑", organ: "脾胃 / 腹腔", meridian: "足太阴脾经", tip: "湿土困脾，忌生冷寒凉" },
              { branch: "寅", organ: "胆囊 / 神经系统", meridian: "足少阳胆经", tip: "胆主决断，早睡养胆气" },
              { branch: "卯", organ: "肝脏 / 双目筋骨", meridian: "足厥阴肝经", tip: "肝藏血，戒大怒急躁" },
              { branch: "辰", organ: "胃经 / 颈胸脊背", meridian: "足阳明胃经", tip: "饮食有节，端正坐姿" },
              { branch: "巳", organ: "小肠 / 面部神经", meridian: "手太阳小肠经", tip: "调畅情志，少辛辣火燥" },
              { branch: "午", organ: "心脏 / 血液循环", meridian: "手少阴心经", tip: "心为君主，午间宜小憩" },
              { branch: "未", organ: "脾胃 / 腹胁脘部", meridian: "足太阴脾经", tip: "温软熟食，健运中焦" },
              { branch: "申", organ: "大肠 / 气管呼吸", meridian: "手阳明大肠经", tip: "多饮温水，畅通肠肺" },
              { branch: "酉", organ: "肺脏 / 喉鼻皮毛", meridian: "手太阴肺经", tip: "防寒润肺，常行深呼吸" },
              { branch: "戌", organ: "胃底 / 下肢骨骼", meridian: "足阳明胃经", tip: "温和运动，暖足通络" },
              { branch: "亥", organ: "肾精 / 骨髓元阳", meridian: "足少阴肾经", tip: "温补固本，少贪冷饮" },
            ].map(item => (
              <div key={item.branch} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-amber-200 font-bold text-xs">
                    【{item.branch}】宫位对应
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {item.meridian}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium font-serif">
                  {item.organ}
                </div>
                <p className="text-[11px] text-slate-500 font-light font-serif">
                  养生诀：{item.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TIAN JI CORPUS QUOTES */}
      {activeCategory === 'quotes' && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-3">
            {filteredQuotes.map((item, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-4 space-y-2 hover:border-amber-400/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif text-amber-300 font-bold">
                    {item.lecture}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-serif">
                    {item.topic}
                  </span>
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed pl-3 border-l-2 border-amber-500/60">
                  {item.quote}
                </blockquote>
                <p className="text-[11px] text-slate-400 font-serif leading-relaxed pt-1">
                  💡 知识库解析：{item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
