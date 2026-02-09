import React, { useState } from "react";
import { Search, Calendar, ChevronDown, Filter, LayoutGrid, List, SlidersHorizontal, User, MapPin, X } from "lucide-react";

// Mock Data
const TABS = [
  { id: "approval", label: "PENDING YOUR APPROVAL", count: 9, color: "amber" },
  { id: "all", label: "ALL", count: 124, color: "gray" },
  { id: "pending", label: "PENDING", count: 30, color: "gray" },
  { id: "approved", label: "APPROVED", count: 73, color: "gray" },
  { id: "rejected", label: "REJECTED", count: 6, color: "gray" },
  { id: "canceled", label: "CANCELED", count: 8, color: "gray" },
  { id: "incomplete", label: "INCOMPLETE", count: 7, color: "gray" },
];

const HeaderWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`w-full p-6 bg-gray-50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 ${className}`}>{children}</div>;

// =============================================================================
// Design 1: Clean & Minimal (Stripe-like)
// =============================================================================
const HeaderDesign1 = () => {
  const [activeTab, setActiveTab] = useState("approval");

  return (
    <HeaderWrapper>
      <div className="flex flex-col gap-6">
        {/* Chips Row */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all border
                ${activeTab === tab.id && tab.id === "approval" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
                ${activeTab === tab.id && tab.id !== "approval" ? "bg-gray-800 text-white border-gray-800" : ""}
                ${activeTab !== tab.id ? "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700" : ""}
              `}
            >
              {tab.label} <span className={`ml-1 ${activeTab === tab.id ? "opacity-100" : "opacity-60"}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search for unit ID" className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <MapPin size={16} className="text-gray-400" />
            Location
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Status
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          </button>

          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden h-[38px]">
            <input type="text" placeholder="dd/mm/yyyy" className="w-28 px-3 py-1 text-sm border-none focus:outline-none text-center bg-transparent" />
            <div className="text-gray-400">→</div>
            <input type="text" placeholder="dd/mm/yyyy" className="w-28 px-3 py-1 text-sm border-none focus:outline-none text-center bg-transparent" />
            <div className="px-2 border-l border-gray-100 h-full flex items-center justify-center bg-gray-50 text-gray-500">
              <Calendar size={14} />
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <User size={16} className="text-gray-400" />
            Sales Persons
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          </button>

          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors ml-auto">
            More
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 2: Integrated Card (Notion-like)
// =============================================================================
const HeaderDesign2 = () => {
  const [activeTab, setActiveTab] = useState("approval");

  return (
    <HeaderWrapper className="!bg-white !p-0 !border-gray-200 overflow-hidden shadow-sm">
      {/* Top Bar with Tabs - Gray Background */}
      <div className="bg-gray-50/80 border-b border-gray-200 p-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-start gap-1 p-2 min-w-max rounded-lg transition-all
                ${activeTab === tab.id ? "bg-white shadow-sm ring-1 ring-gray-200" : "hover:bg-gray-100"}
              `}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === tab.id ? (tab.id === "approval" ? "text-amber-600" : "text-gray-900") : "text-gray-400"}`}>{tab.label}</span>
              <span className={`text-xl font-semibold leading-none ${activeTab === tab.id ? "text-gray-900" : "text-gray-400"}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar - White */}
      <div className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative group mr-2">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input type="text" placeholder="Filter reservations..." className="pl-7 pr-4 py-1.5 bg-transparent border-b-2 border-transparent focus:border-blue-600 hover:border-gray-200 outline-none text-sm w-64 transition-all placeholder:text-gray-400" />
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1.5">
            Location is <span className="text-gray-900 font-bold">Any</span>
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1.5">
            Status is <span className="text-gray-900 font-bold">Any</span>
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1.5">
            Date is <span className="text-gray-900 font-bold">Any time</span>
          </button>
          <button className="px-2 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <div className="flex items-center gap-1 text-xs">
              <SlidersHorizontal size={14} />
              Add Filter
            </div>
          </button>
        </div>
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 3: Glassmorphism Floating
// =============================================================================
const HeaderDesign3 = () => {
  const [activeTab, setActiveTab] = useState("approval");

  return (
    <HeaderWrapper className="bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        {/* Floating Tabs */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-white/50 inline-flex flex-wrap gap-1 self-start">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300
                ${activeTab === tab.id ? "bg-white text-indigo-600 shadow-md transform scale-105" : "text-gray-500 hover:bg-white/50 hover:text-gray-700"}
              `}
            >
              {tab.label} <span className="opacity-70 ml-1">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Floating Filter Bar */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-white/50 flex flex-wrap items-center gap-2">
          <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm border border-gray-100 flex-1 min-w-[240px]">
            <Search size={16} className="text-indigo-400" />
            <input type="text" placeholder="Start typing to search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400" />
          </div>

          {[
            { label: "Location", icon: MapPin },
            { label: "Status", icon: Filter },
            { label: "Date Range", icon: Calendar },
            { label: "Sales Team", icon: User },
          ].map((filter) => (
            <button key={filter.label} className="px-4 py-2 bg-white/50 hover:bg-white rounded-xl text-sm font-medium text-gray-600 transition-all border border-transparent hover:border-indigo-100 shadow-sm hover:shadow flex items-center gap-2 group">
              <filter.icon size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
              {filter.label}
              <ChevronDown size={12} className="opacity-50 group-hover:translate-y-0.5 transition-transform" />
            </button>
          ))}

          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors ml-auto">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 4: Split Level (Dark Header)
// =============================================================================
const HeaderDesign4 = () => {
  const [activeTab, setActiveTab] = useState("approval");

  return (
    <HeaderWrapper className="!p-0 !bg-white !border-gray-200 overflow-hidden">
      {/* Dark Header */}
      <div className="bg-gray-900 text-white p-5 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold tracking-tight">Reservation Requests</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors bg-gray-700 text-white">
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Search Field Embedded in Header */}
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by ID, client name, or unit..." className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
        </div>
      </div>

      {/* Overlapping Filters Card */}
      <div className="-mt-6 mx-5 mb-5 space-y-4">
        <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-1 overflow-x-auto">
          {TABS.slice(0, 5).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2
                ${activeTab === tab.id ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
              `}
            >
              <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? "bg-blue-600" : "bg-gray-300"}`} />
              {tab.label}
              <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-md text-gray-600">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4 pl-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Calendar size={14} /> Created: <span className="text-gray-900 font-medium">This Month</span>
            <X size={12} className="cursor-pointer hover:text-red-500" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <User size={14} /> Sales: <span className="text-gray-900 font-medium">Amr Diab</span>
            <X size={12} className="cursor-pointer hover:text-red-500" />
          </div>
          <button className="text-xs text-blue-600 font-medium hover:underline">+ Add Filter</button>
        </div>
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 5: High Contrast & Compact (Dense)
// =============================================================================
const HeaderDesign5 = () => {
  const [activeTab, setActiveTab] = useState("approval");

  return (
    <HeaderWrapper className="!p-2 bg-zinc-50 border border-zinc-200">
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm mb-2">
        {/* Dense Tabs */}
        <div className="flex flex-1 gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                  relative px-3 py-1.5 min-w-max text-xs font-bold uppercase tracking-wider rounded border transition-all
                  ${activeTab === tab.id ? "bg-gray-900 text-white border-gray-900 shadow-md" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"}
                `}
            >
              {tab.label}
              <span className={`ml-2 px-1 py-0.5 rounded text-[10px] ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{tab.count}</span>
              {activeTab === tab.id && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />}
            </button>
          ))}
        </div>
      </div>

      {/* Dense Filters */}
      <div className="bg-gray-100/50 p-2 rounded-lg border border-gray-200/50 flex flex-wrap gap-2 items-center">
        <div className="relative w-64">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Quick search..." className="w-full pl-8 pr-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1" />

        <select className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 shadow-sm focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-50">
          <option>Location: All</option>
          <option>New Cairo</option>
          <option>Zayed</option>
        </select>

        <select className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 shadow-sm focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-50">
          <option>Status: All</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">Export</button>
          <button className="px-3 py-1.5 bg-blue-600 border border-blue-600 rounded text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all">+ New Request</button>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export const HEADER_DESIGNS = [
  { id: 1, name: "Clean Minimal", Component: HeaderDesign1 },
  { id: 2, name: "Integrated Card", Component: HeaderDesign2 },
  { id: 3, name: "Glassmorphism", Component: HeaderDesign3 },
  { id: 4, name: "Split Level", Component: HeaderDesign4 },
  { id: 5, name: "High Contrast", Component: HeaderDesign5 },
];
