/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Calendar, User, Compass, Flame, MapPin } from 'lucide-react';
import { BirthProfile } from '../types';
import { getWesternZodiac } from '../utils/astrology';
import { checkChinaDST } from '../utils/tianji-ziwei';

// Chinese traditional 时辰 Mapping
const SHICHEN_HOURS = [
  { name: '子时', range: '23:00 - 01:00', defaultVal: '23:30' },
  { name: '丑时', range: '01:00 - 03:00', defaultVal: '02:00' },
  { name: '寅时', range: '03:00 - 05:00', defaultVal: '04:00' },
  { name: '卯时', range: '05:00 - 07:00', defaultVal: '06:00' },
  { name: '辰时', range: '07:00 - 09:00', defaultVal: '08:00' },
  { name: '巳时', range: '09:00 - 11:00', defaultVal: '10:00' },
  { name: '午时', range: '11:00 - 13:00', defaultVal: '12:00' },
  { name: '未时', range: '13:00 - 15:00', defaultVal: '14:00' },
  { name: '申时', range: '15:00 - 17:00', defaultVal: '16:00' },
  { name: '酉时', range: '17:00 - 19:00', defaultVal: '18:00' },
  { name: '戌时', range: '19:00 - 21:00', defaultVal: '20:00' },
  { name: '亥时', range: '21:00 - 23:00', defaultVal: '22:00' }
];

interface BirthFormProps {
  onSubmit: (profile: BirthProfile) => void;
  isLoading: boolean;
}

export default function BirthForm({ onSubmit, isLoading }: BirthFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('1998-10-24');
  const [birthplace, setBirthplace] = useState('上海');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [shichenIndex, setShichenIndex] = useState(6); // Default 午时 (noon)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = birthDate.split('-');
    const month = Number(parts[1]) || 1;
    const day = Number(parts[2]) || 1;

    // Derive Western Zodiac
    const zod = getWesternZodiac(month, day);
    const shichen = SHICHEN_HOURS[shichenIndex];
    const dstCheck = checkChinaDST(birthDate, shichen.defaultVal);

    const profile: BirthProfile = {
      name: name.trim() || undefined, // Optional name
      birthDate,
      birthTime: shichen.defaultVal,
      doubleHour: shichen.name,
      gender,
      calendarType,
      zodiacSign: zod.name,
      birthplace: birthplace.trim(),
      isDSTAdjusted: dstCheck.isDST
    };

    onSubmit(profile);
  };

  return (
    <div id="birth-form-container" className="relative w-full max-w-2xl bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Mystical subtle golden light glow in corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none"></div>

      {/* Title */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center justify-center space-x-2">
          <Compass className="w-8 h-8 text-amber-400 animate-spin-slow" />
          <h2 className="text-2xl sm:text-3xl font-serif text-amber-200 tracking-widest font-semibold">星勺居 · 录疏天盘</h2>
          <Compass className="w-8 h-8 text-amber-400 animate-spin-slow" />
        </div>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 tracking-wide font-light">
          请输入缘主的生辰印记与其诞生地。出生地将用于精确推算【真太阳时】，让星曜排定纤毫不差。
        </p>
        <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-4" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative">
        {/* Row 1: Optional Name and Required Birthplace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-amber-300 font-serif text-sm tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              雅号 / 姓名 <span className="text-slate-500 text-xs">(选填，不输入亦可)</span>
            </label>
            <input
              id="user-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="默认显示：缘主"
              className="w-full bg-slate-950/80 border border-slate-700/65 focus:border-amber-400/80 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/20 tracking-wider text-sm transition"
            />
          </div>

          <div>
            <label className="block text-amber-300 font-serif text-sm tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              降诞之境 / 出生地 <span className="text-amber-500 text-xs font-bold">(必填，用于校准经度)</span>
            </label>
            <input
              id="user-birth-place-input"
              type="text"
              required
              value={birthplace}
              onChange={(e) => setBirthplace(e.target.value)}
              placeholder="如：上海、北京、成都、广州..."
              className="w-full bg-slate-950/80 border border-slate-700/65 focus:border-amber-400/80 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/20 tracking-wider text-sm transition"
            />
          </div>
        </div>

        {/* Gender and Calendar Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-amber-300 font-serif text-sm tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              阴阳法资 <span className="text-slate-500 text-xs">(性别)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="gender-male-btn"
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 rounded-lg border text-sm font-serif tracking-widest transition flex items-center justify-center gap-1.5 ${
                  gender === 'male'
                    ? 'bg-amber-900/30 border-amber-500 text-amber-200 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                乾造 ♂ <span className="text-xs opacity-80">(男命)</span>
              </button>
              <button
                id="gender-female-btn"
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 rounded-lg border text-sm font-serif tracking-widest transition flex items-center justify-center gap-1.5 ${
                  gender === 'female'
                    ? 'bg-purple-900/30 border-purple-500 text-purple-200 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                坤造 ♀ <span className="text-xs opacity-80">(女命)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-amber-300 font-serif text-sm tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              生辰历法 <span className="text-slate-500 text-xs">(岁律)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="calendar-solar-btn"
                type="button"
                onClick={() => setCalendarType('solar')}
                className={`py-2 rounded-lg border text-sm font-serif tracking-widest transition ${
                  calendarType === 'solar'
                    ? 'bg-amber-900/30 border-amber-550 text-amber-200 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                公历 (新历)
              </button>
              <button
                id="calendar-lunar-btn"
                type="button"
                onClick={() => setCalendarType('lunar')}
                className={`py-2 rounded-lg border text-sm font-serif tracking-widest transition ${
                  calendarType === 'lunar'
                    ? 'bg-amber-900/30 border-amber-450 text-amber-200 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                农历 (阴历)
              </button>
            </div>
          </div>
        </div>

        {/* Birth Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-amber-300 font-serif text-sm tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              诞辰之日
            </label>
            <input
              id="birth-date-picker"
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/65 focus:border-amber-400/80 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/20 text-sm tracking-wider"
            />
          </div>

          <div>
            <label className="block text-amber-300 font-serif text-sm tracking-wider mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              降诞时辰 <span className="text-slate-500 text-xs">(一昼夜十二时)</span>
            </label>
            <select
              id="birth-shichen-select"
              value={shichenIndex}
              onChange={(e) => setShichenIndex(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-slate-700/65 focus:border-amber-400/80 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500/20 text-sm tracking-wider"
            >
              {SHICHEN_HOURS.map((hour, idx) => (
                <option key={hour.name} value={idx}>
                  {hour.name} ({hour.range})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Knowledge Base Astronomical DST Notice */}
        {checkChinaDST(birthDate, SHICHEN_HOURS[shichenIndex]?.defaultVal).isDST && (
          <div className="p-3 bg-amber-950/25 border border-amber-500/30 rounded-xl text-xs text-amber-200 font-serif flex items-start gap-2 animate-fade-in">
            <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin-slow" />
            <p className="leading-relaxed text-[11px] sm:text-xs">
              {checkChinaDST(birthDate, SHICHEN_HOURS[shichenIndex]?.defaultVal).description}
            </p>
          </div>
        )}

        {/* Submit action */}
        <div className="pt-2">
          <button
            id="astrology-submit-btn"
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-750 hover:from-amber-500 hover:to-amber-650 active:scale-[0.98] border border-amber-400/30 rounded-xl text-amber-950 font-serif font-bold tracking-widest text-base shadow-[0_0_15px_rgba(245,158,11,0.2)] transition flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-950 animate-spin" />
                <span>天星经纬校准，天机精演中...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-950" />
                <span>起盘推演 · 开启星勺命理所</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
