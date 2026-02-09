import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// Mock calendar data
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const CURRENT_MONTH = "February 2026";
const DATES: (number | null)[][] = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, null],
];
const TODAY: number | null = 5;
const SELECTED: number | null = 14;

const DesignWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-4">
    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
    <div className="w-[320px]">{children}</div>
  </div>
);

// Design 1: Clean Minimal
const Design1 = () => (
  <DesignWrapper title="1. Clean Minimal">
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <span className="font-bold text-gray-900">{CURRENT_MONTH}</span>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-1">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-9 w-9 mx-auto rounded-full text-sm font-medium transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "bg-blue-600 text-white shadow-md shadow-blue-200" : ""}
                  ${date === TODAY && date !== SELECTED ? "bg-gray-100 font-bold" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:bg-gray-100 text-gray-700" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  </DesignWrapper>
);

// Design 2: Glassmorphism
const Design2 = () => (
  <DesignWrapper title="2. Glassmorphism">
    <div className="relative">
      {/* Gradient blobs */}
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-400 rounded-full blur-3xl opacity-30" />

      <div className="relative bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <span className="font-bold text-gray-800">{CURRENT_MONTH}</span>
          <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        {/* Dates */}
        <div className="space-y-1">
          {DATES.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-1">
              {week.map((date, j) => (
                <button
                  key={j}
                  className={`h-9 w-9 mx-auto rounded-xl text-sm font-medium transition-all
                    ${!date ? "invisible" : ""}
                    ${date === SELECTED ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg" : ""}
                    ${date === TODAY && date !== SELECTED ? "bg-white/80 font-bold ring-2 ring-purple-200" : ""}
                    ${date && date !== SELECTED && date !== TODAY ? "hover:bg-white/60 text-gray-700" : ""}
                  `}
                >
                  {date}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </DesignWrapper>
);

// Design 3: Dark Mode Premium
const Design3 = () => (
  <DesignWrapper title="3. Dark Premium">
    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <ChevronLeft size={18} className="text-gray-400" />
        </button>
        <span className="font-bold text-white">{CURRENT_MONTH}</span>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-1">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-9 w-9 mx-auto rounded-full text-sm font-medium transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : ""}
                  ${date === TODAY && date !== SELECTED ? "bg-gray-800 text-emerald-400 font-bold ring-1 ring-emerald-500/50" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:bg-gray-800 text-gray-300" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  </DesignWrapper>
);

// Design 4: Soft Gradient Border
const Design4 = () => (
  <DesignWrapper title="4. Gradient Border">
    <div className="p-[2px] rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
      <div className="bg-white rounded-[14px] p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={18} className="text-purple-600" />
          </button>
          <span className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{CURRENT_MONTH}</span>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={18} className="text-purple-600" />
          </button>
        </div>
        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-purple-400 py-2">
              {day}
            </div>
          ))}
        </div>
        {/* Dates */}
        <div className="space-y-1">
          {DATES.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-1">
              {week.map((date, j) => (
                <button
                  key={j}
                  className={`h-9 w-9 mx-auto rounded-lg text-sm font-medium transition-all
                    ${!date ? "invisible" : ""}
                    ${date === SELECTED ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg" : ""}
                    ${date === TODAY && date !== SELECTED ? "bg-purple-50 text-purple-700 font-bold" : ""}
                    ${date && date !== SELECTED && date !== TODAY ? "hover:bg-purple-50 text-gray-700" : ""}
                  `}
                >
                  {date}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </DesignWrapper>
);

// Design 5: Elevated Card
const Design5 = () => (
  <DesignWrapper title="5. Elevated Card">
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 space-y-5">
      {/* Header with month selector look */}
      <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3">
        <button className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm bg-white">
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-500" />
          <span className="font-bold text-gray-800">{CURRENT_MONTH}</span>
        </div>
        <button className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm bg-white">
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-2">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-10 w-10 mx-auto rounded-xl text-sm font-semibold transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105" : ""}
                  ${date === TODAY && date !== SELECTED ? "bg-blue-50 text-blue-600 font-bold" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:bg-gray-100 text-gray-700" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  </DesignWrapper>
);

// Design 6: Neumorphism
const Design6 = () => (
  <DesignWrapper title="6. Neumorphism">
    <div className="bg-[#e8ecef] rounded-3xl p-6 space-y-5 shadow-[8px_8px_16px_#c8ccd0,-8px_-8px_16px_#ffffff]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="p-2 rounded-xl shadow-[4px_4px_8px_#c8ccd0,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8ccd0,inset_-4px_-4px_8px_#ffffff] transition-all">
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <span className="font-bold text-gray-700">{CURRENT_MONTH}</span>
        <button className="p-2 rounded-xl shadow-[4px_4px_8px_#c8ccd0,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8ccd0,inset_-4px_-4px_8px_#ffffff] transition-all">
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-2">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-9 w-9 mx-auto rounded-xl text-sm font-medium transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "shadow-[inset_4px_4px_8px_#c8ccd0,inset_-4px_-4px_8px_#ffffff] text-blue-600 font-bold" : ""}
                  ${date === TODAY && date !== SELECTED ? "shadow-[2px_2px_4px_#c8ccd0,-2px_-2px_4px_#ffffff] text-gray-700 font-bold" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:shadow-[2px_2px_4px_#c8ccd0,-2px_-2px_4px_#ffffff] text-gray-600" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  </DesignWrapper>
);

// Design 7: Compact Pill Style
const Design7 = () => (
  <DesignWrapper title="7. Compact Pills">
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={16} className="text-gray-500" />
        </button>
        <span className="font-bold text-sm text-gray-800">{CURRENT_MONTH}</span>
        <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-0.5 bg-gray-50 rounded-xl p-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-1 px-1">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-0.5">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "bg-indigo-500 text-white" : ""}
                  ${date === TODAY && date !== SELECTED ? "bg-indigo-100 text-indigo-600" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:bg-gray-100 text-gray-600" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  </DesignWrapper>
);

// Design 8: Colorful Accent
const Design8 = () => (
  <DesignWrapper title="8. Colorful Accent">
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100 rounded-3xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="p-2 bg-white hover:bg-orange-100 rounded-xl transition-colors shadow-sm">
          <ChevronLeft size={18} className="text-orange-500" />
        </button>
        <span className="font-bold text-gray-800 bg-white px-4 py-1.5 rounded-full shadow-sm">{CURRENT_MONTH}</span>
        <button className="p-2 bg-white hover:bg-orange-100 rounded-xl transition-colors shadow-sm">
          <ChevronRight size={18} className="text-orange-500" />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-orange-400 py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-1">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-9 w-9 mx-auto rounded-xl text-sm font-semibold transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-md" : ""}
                  ${date === TODAY && date !== SELECTED ? "bg-white text-orange-600 shadow-sm font-bold" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:bg-white text-gray-700" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  </DesignWrapper>
);

// Design 9: iOS Inspired
const Design9 = () => (
  <DesignWrapper title="9. iOS Inspired">
    <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-[20px] shadow-2xl shadow-gray-200/50 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <button className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Jan
        </button>
        <span className="font-semibold text-gray-900">February 2026</span>
        <button className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors flex items-center gap-1">
          Mar <ChevronRight size={16} />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 border-b border-gray-100 pb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center text-[11px] font-semibold text-gray-400">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-1">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-9 w-9 mx-auto rounded-full text-[15px] font-medium transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "bg-blue-500 text-white" : ""}
                  ${date === TODAY && date !== SELECTED ? "text-blue-500 font-bold" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:bg-gray-100 text-gray-900" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* Today button */}
      <div className="pt-2 border-t border-gray-100">
        <button className="w-full py-2 text-blue-500 font-semibold text-sm hover:bg-blue-50 rounded-xl transition-colors">Today</button>
      </div>
    </div>
  </DesignWrapper>
);

// Design 10: Material Design 3
const Design10 = () => (
  <DesignWrapper title="10. Material Design 3">
    <div className="bg-[#FFFBFE] border border-[#E7E0EC] rounded-[28px] shadow-lg p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="p-3 hover:bg-[#E8DEF8] rounded-full transition-colors">
          <ChevronLeft size={20} className="text-[#1D1B20]" />
        </button>
        <span className="font-medium text-[#1D1B20] text-base">{CURRENT_MONTH}</span>
        <button className="p-3 hover:bg-[#E8DEF8] rounded-full transition-colors">
          <ChevronRight size={20} className="text-[#1D1B20]" />
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-[#49454F] py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="space-y-0.5">
        {DATES.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((date, j) => (
              <button
                key={j}
                className={`h-10 w-10 mx-auto rounded-full text-sm transition-all
                  ${!date ? "invisible" : ""}
                  ${date === SELECTED ? "bg-[#6750A4] text-white font-medium" : ""}
                  ${date === TODAY && date !== SELECTED ? "border-2 border-[#6750A4] text-[#6750A4] font-medium" : ""}
                  ${date && date !== SELECTED && date !== TODAY ? "hover:bg-[#E8DEF8] text-[#1D1B20]" : ""}
                `}
              >
                {date}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E0EC]">
        <button className="px-4 py-2 text-[#6750A4] font-medium text-sm rounded-full hover:bg-[#E8DEF8] transition-colors">Cancel</button>
        <button className="px-4 py-2 bg-[#6750A4] text-white font-medium text-sm rounded-full hover:bg-[#7965AF] transition-colors">OK</button>
      </div>
    </div>
  </DesignWrapper>
);

export const DATE_PICKER_DESIGNS = [
  { id: 1, name: "Clean Minimal", Component: Design1 },
  { id: 2, name: "Glassmorphism", Component: Design2 },
  { id: 3, name: "Dark Premium", Component: Design3 },
  { id: 4, name: "Gradient Border", Component: Design4 },
  { id: 5, name: "Elevated Card", Component: Design5 },
  { id: 6, name: "Neumorphism", Component: Design6 },
  { id: 7, name: "Compact Pills", Component: Design7 },
  { id: 8, name: "Colorful Accent", Component: Design8 },
  { id: 9, name: "iOS Inspired", Component: Design9 },
  { id: 10, name: "Material Design 3", Component: Design10 },
];
