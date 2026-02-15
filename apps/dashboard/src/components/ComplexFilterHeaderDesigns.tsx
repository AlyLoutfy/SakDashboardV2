import React, { useState } from "react";
import { Search, Calendar, ChevronDown, Filter, LayoutGrid, List, SlidersHorizontal, User, Users, MapPin, X, Plus, Check, Clock, Tag, Briefcase, Building, ChevronRight, XCircle, Command, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

// =============================================================================
// Mock Data & Helpers
// =============================================================================

const FILTER_FACETS = {
  status: ["All Statuses", "Pending", "Approved", "Rejected", "Canceled", "Incomplete"],
  location: ["All Locations", "New Cairo", "Sheikh Zayed", "North Coast", "Red Sea"],
  salesperson: ["All Salespeople", "Ahmed Hassan", "Sara Mostafa", "Omar Khaled", "Nour El Din"],
  type: ["All Types", "Apartment", "Villa", "Twin House", "Town House", "Chalet"],
  priceRange: ["Any Price", "Under 5M", "5M - 10M", "10M - 20M", "20M+"],
  date: ["Any Time", "Today", "Yesterday", "Last 7 Days", "This Month", "Last Month"],
};

const HeaderWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`w-full p-6 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 ${className}`}>{children}</div>;

// =============================================================================
// Design 1: The Stacked Chips (Priority & Overflow)
// =============================================================================
// Strategy: distinct rows. Top for search & primary actions. Bottom for "Active Filters" as removable chips.
// Best for: Users who need to see exactly what criteria are active at a glance.

const HeaderDesign1 = () => {
  const [activeFilters, setActiveFilters] = useState([
    { id: "loc", label: "Location: New Cairo", type: "location" },
    { id: "stat", label: "Status: Pending", type: "status" },
    { id: "price", label: "Price: 10M - 20M", type: "price" },
  ]);

  const removeFilter = (id: string) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== id));
  };

  return (
    <HeaderWrapper className="bg-white">
      <div className="flex flex-col gap-4">
        {/* Top Bar: Title + Primary Search + Add Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search by ID, Name, Phone..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-300">
              <Plus size={16} />
              Add Filter
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 bg-gray-100 text-gray-900 rounded-lg transition-colors">
              <List size={18} />
            </button>
            <Button className="bg-black text-white hover:bg-gray-800 ml-2">Export Report</Button>
          </div>
        </div>

        {/* Active Filters Row */}
        {activeFilters.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-xs font-semibold text-gray-500 mr-1 uppercase tracking-wider">Active:</span>
            {activeFilters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold group hover:border-blue-200 transition-colors cursor-default">
                {filter.label}
                <button onClick={() => removeFilter(filter.id)} className="p-0.5 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
            <button onClick={() => setActiveFilters([])} className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-2">
              Clear All
            </button>
          </div>
        )}
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 2: The Logic Sentence (Natural Language)
// =============================================================================
// Strategy: A "sentence" where users fill in the blanks.
// Best for: Complex queries where context matters (e.g. "Show me X from Y that are Z")

const HeaderDesign2 = () => {
  return (
    <HeaderWrapper className="bg-white">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900">Filter Logic</h3>
          <button className="text-xs font-medium text-blue-600 hover:underline">Saved Segments</button>
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="text-lg md:text-xl font-medium text-gray-400 leading-relaxed flex flex-wrap items-baseline gap-2">
            <span>Show me</span>

            <div className="relative group inline-block">
              <select className="appearance-none bg-white text-gray-900 font-bold border-b-2 border-dashed border-gray-300 hover:border-blue-500 focus:border-blue-500 cursor-pointer py-1 px-2 pr-6 rounded-t-md outline-none transition-colors">
                <option>All Reservations</option>
                <option>My Approvals</option>
                <option>Pending Requests</option>
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            <span>from</span>

            <div className="relative group inline-block">
              <select className="appearance-none bg-white text-gray-900 font-bold border-b-2 border-dashed border-gray-300 hover:border-blue-500 focus:border-blue-500 cursor-pointer py-1 px-2 pr-6 rounded-t-md outline-none transition-colors">
                <option>New Cairo</option>
                <option>Any Location</option>
                <option>Sheikh Zayed</option>
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            <span>where status is</span>

            <div className="relative group inline-block">
              <select className="appearance-none bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-200 hover:border-blue-500 focus:border-blue-500 cursor-pointer py-1 px-2 pr-6 rounded-t-md outline-none transition-colors">
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={14} />
            </div>

            <span>and price is</span>

            <div className="relative group inline-block">
              <button className="text-gray-400 hover:text-gray-600 border-b-2 border-dashed border-gray-300 hover:border-gray-400 py-1 px-2 transition-colors flex items-center gap-1">
                <Plus size={14} /> Set Price
              </button>
            </div>

            <span>sorted by</span>

            <div className="relative group inline-block">
              <select className="appearance-none bg-transparent text-gray-600 font-bold border-b-2 border-dashed border-gray-300 hover:border-blue-500 focus:border-blue-500 cursor-pointer py-1 px-2 pr-6 outline-none transition-colors text-base">
                <option>Newest First</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 3: The Command Palette (Omnibar)
// =============================================================================
// Strategy: Single input that accepts text (search) OR categorical tokens.
// Best for: Power users, saving vertical space.

const HeaderDesign3 = () => {
  return (
    <HeaderWrapper className="bg-white">
      <div className="flex flex-col gap-4">
        <div className="w-full relative shadow-lg shadow-gray-200/50 rounded-xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Command size={18} />
          </div>

          <div className="flex items-center w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all pl-12 gap-2 flex-wrap">
            {/* Token 1 */}
            <div className="bg-gray-100 border border-gray-200 rounded-md px-2 py-1 flex items-center gap-1.5 animate-in zoom-in-95 duration-200">
              <MapPin size={12} className="text-gray-500" />
              <span className="text-xs font-medium text-gray-700">Loc: New Cairo</span>
              <button className="hover:bg-gray-200 rounded-full p-0.5">
                <X size={10} />
              </button>
            </div>
            {/* Token 2 */}
            <div className="bg-amber-50 border border-amber-100 rounded-md px-2 py-1 flex items-center gap-1.5 animate-in zoom-in-95 duration-200">
              <Clock size={12} className="text-amber-500" />
              <span className="text-xs font-medium text-amber-700">Status: Pending</span>
              <button className="hover:bg-amber-100 rounded-full p-0.5">
                <X size={10} />
              </button>
            </div>

            <input type="text" placeholder="Type to filter (e.g. 'Status', 'Agent') or search..." className="flex-1 bg-transparent border-none outline-none text-sm min-w-[200px] placeholder:text-gray-400" />

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 border-l border-gray-100 pl-3">
              <span className="bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-[10px] font-mono">⌘ K</span>
              <span>to focus</span>
            </div>
          </div>

          {/* Suggestions Dropdown (Mocked as if open) */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10 hidden group-focus-within:block">
            <div className="p-2">
              <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Filters</div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                <Users size={16} className="text-gray-400" /> Sales Person...
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                <Tag size={16} className="text-gray-400" /> Type...
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-xs text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">12</span> results
          </span>
          <div className="flex gap-2">
            <button className="text-xs font-semibold text-gray-500 hover:text-gray-900 underline">Save View</button>
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 4: The Sidebar Architect (Split View)
// =============================================================================
// Strategy: Move filters out of the header entirely into a sidebar column.
// Best for: Very dense pages where header height is precious.

const HeaderDesign4 = () => {
  return (
    <HeaderWrapper className="bg-gray-100/50 p-4">
      <div className="flex gap-6 relative">
        {/* Sidebar Filters Area */}
        <div className="w-64 shrink-0 hidden md:block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Filter size={16} /> Filters
            </h3>
            <span className="text-xs text-blue-600 font-medium cursor-pointer">Reset</span>
          </div>

          <div className="space-y-4">
            {/* Group 1 */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2 cursor-pointer group">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
              </div>
              <div className="space-y-2">
                {["All", "Pending", "Approved"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status_demo" defaultChecked={opt === "Pending"} className="text-blue-600 border-gray-300 focus:ring-blue-500 w-3.5 h-3.5" />
                    <span className="text-sm text-gray-600">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Group 2 */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center cursor-pointer group">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Location</span>
                <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area Header */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input type="text" placeholder="Search results..." className="w-full text-sm outline-none placeholder:text-gray-400 font-medium" />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
                <span>Sort:</span>
                <span className="font-bold text-gray-900">Newest</span>
                <ChevronDown size={12} />
              </div>
            </div>
          </div>

          {/* Mock Content */}
          <div className="space-y-3 opacity-50">
            <div className="h-16 bg-white border border-gray-200 rounded-xl" />
            <div className="h-16 bg-white border border-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

// =============================================================================
// Design 5: The Mega Menu (Popover)
// =============================================================================
// Strategy: A dedicated "Filter" button opens a comprehensive mega-menu.
// Best for: Cleanest header look, but requires 2 clicks to filter.

const HeaderDesign5 = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <HeaderWrapper className="bg-white py-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 relative z-0">
        <h2 className="text-xl font-bold text-gray-900">Reservations</h2>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm shadow-sm focus:outline-none w-48 transition-all focus:w-64" />
          </div>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${isOpen ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
            <Filter size={16} />
            Filters
            <span className="flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-[10px] rounded-full ml-1">3</span>
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown (Relative for demo, would be absolute/popover in real) */}
      <div className="relative z-10 mx-auto max-w-4xl animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="absolute top-0 right-0 w-full md:w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ring-1 ring-black/5">
          <div className="flex min-h-[300px]">
            {/* Left: Categories */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-2 space-y-1 text-sm font-medium text-gray-600">
              {["Location", "Status", "Sales Person", "Date Range", "Price", "Unit Type"].map((cat, i) => (
                <button key={cat} className={`w-full text-left px-3 py-2.5 rounded-lg flex justify-between items-center ${i === 1 ? "bg-white shadow-sm text-blue-600 font-bold" : "hover:bg-gray-100 hover:text-gray-900"}`}>
                  {cat}
                  {i === 1 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              ))}
            </div>

            {/* Right: Options */}
            <div className="w-2/3 p-4 bg-white flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                <h4 className="font-bold text-gray-900">Select Status</h4>
                <span className="text-xs text-gray-400">Multi-select allowed</span>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                {["Pending Approval", "Approved", "Rejected", "Canceled", "Incomplete", "Draft"].map((status) => (
                  <label key={status} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${["Pending Approval"].includes(status) ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white group-hover:border-gray-400"}`}>
                      <Check size={12} className="text-white opactiy-100" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{status}</span>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full group-hover:bg-white">12</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-between items-center">
            <button className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">Clear All Filters</button>
            <Button className="h-9 px-6 text-xs bg-gray-900 hover:bg-gray-800">Show 32 Results</Button>
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export const COMPLEX_FILTER_DESIGNS = [
  { id: 1, name: "Stacked Chips & Drawer", Component: HeaderDesign1 },
  { id: 2, name: "Natural Language Builder", Component: HeaderDesign2 },
  { id: 3, name: "Command Palette (Omni)", Component: HeaderDesign3 },
  { id: 4, name: "Sidebar Architect", Component: HeaderDesign4 },
  { id: 5, name: "Mega Menu Popover", Component: HeaderDesign5 },
];
