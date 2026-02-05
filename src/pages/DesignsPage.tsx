import React from "react";

import { REPORT_DESIGNS } from "../components/ReportDesigns";
import { INTEGRATION_DESIGNS } from "../components/IntegrationDesigns";
import { FAILED_CONNECTION_DESIGNS } from "../components/FailedConnectionDesigns";
import { BLOCKING_CARD_DESIGNS } from "../components/BlockingCardDesigns";
import { RESERVATION_TABLE_DESIGNS } from "../components/ReservationTableDesigns";
import { HEADER_DESIGNS } from "../components/HeaderDesigns";
import { CROWDED_HEADER_DESIGNS } from "../components/ReservationHeaderDesigns";
import { PENDING_ANIMATION_DESIGNS } from "../components/PendingAnimationDesigns";
import { UNIT_DRAWER_DESIGNS } from "../components/UnitDrawerDesigns";
import { APPROVAL_FLOW_DESIGNS } from "../components/ApprovalFlowDesigns";
import { HISTORY_TAB_DESIGNS } from "../components/HistoryTabDesigns";
import { Search } from "lucide-react";

const DESIGNS = INTEGRATION_DESIGNS;

// --- Dropdown Search Designs ---

const SEARCH_MOCK_ITEMS = ["Full Name", "Email Address", "Phone Number", "Budget Min", "Budget Max"];

const SearchDesignWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    <div className="w-[280px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden pb-2">
      {children}
      <div className="max-h-[160px] overflow-y-auto pt-1">
        {SEARCH_MOCK_ITEMS.map((item) => (
          <div key={item} className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 1. Standard Border
const SearchDesign1 = () => (
  <SearchDesignWrapper title="1. Standard Gray Border">
    <div className="p-2 border-b border-gray-100 dark:border-zinc-800">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search fields..." className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:border-blue-500 transition-colors" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 2. Soft & Rounded (Pill)
const SearchDesign2 = () => (
  <SearchDesignWrapper title="2. Soft Pill">
    <div className="p-3 border-b border-gray-100 dark:border-zinc-800">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search fields..." className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-zinc-800 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 3. Underlined Material
const SearchDesign3 = () => (
  <SearchDesignWrapper title="3. Material Underlined">
    <div className="pt-3 px-3 pb-1 mb-1">
      <div className="relative group">
        <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        <input type="text" placeholder="Search fields..." className="w-full pl-6 pr-0 py-1.5 text-sm bg-transparent border-0 border-b-2 border-gray-200 dark:border-zinc-700 rounded-none focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 4. Filled Box (Subtle)
const SearchDesign4 = () => (
  <SearchDesignWrapper title="4. Filled Subtle">
    <div className="p-2">
      <div className="relative">
        <input type="text" placeholder="Search..." className="w-full pl-3 pr-8 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border border-transparent hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-zinc-700 transition-all" />
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 5. Floating Shadow
const SearchDesign5 = () => (
  <SearchDesignWrapper title="5. Floating Shadow">
    <div className="p-3 bg-gray-50 dark:bg-zinc-900/50">
      <div className="relative shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-800 rounded-lg overflow-hidden">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={14} />
        </div>
        <input type="text" placeholder="Type to search..." className="w-full pl-9 pr-3 py-2 text-sm border-none bg-transparent focus:outline-none focus:placeholder-gray-300" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 6. Accent Border Left (Modern)
const SearchDesign6 = () => (
  <SearchDesignWrapper title="6. Accent Left">
    <div className="p-2 border-b border-gray-100 dark:border-zinc-800">
      <div className="flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <div className="pl-3 pr-2 text-gray-400 border-r border-gray-100 dark:border-zinc-800 h-full py-1.5">
          <Search size={14} />
        </div>
        <input type="text" placeholder="Search..." className="w-full px-3 py-1.5 text-sm border-none focus:outline-none bg-transparent" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 7. Gradient Border (Premium)
const SearchDesign7 = () => (
  <SearchDesignWrapper title="7. Gradient Border">
    <div className="p-2.5">
      <div className="p-[1px] rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <div className="bg-white dark:bg-zinc-900 rounded-[7px] flex items-center">
          <input type="text" placeholder="Search..." className="w-full pl-3 pr-3 py-1.5 text-sm bg-transparent border-none rounded-lg focus:outline-none" />
          <div className="pr-3 text-purple-500">
            <Search size={14} />
          </div>
        </div>
      </div>
    </div>
  </SearchDesignWrapper>
);

// 8. Minimal Ghost (Text Only)
const SearchDesign8 = () => (
  <SearchDesignWrapper title="8. Minimal Ghost">
    <div className="p-2 border-b border-gray-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 group px-2">
        <Search size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        <input type="text" placeholder="Filter options..." className="w-full py-1.5 text-sm bg-transparent border-none focus:outline-none placeholder:text-gray-300 focus:placeholder:text-gray-400 font-medium" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 9. Dark Contrast
const SearchDesign9 = () => (
  <SearchDesignWrapper title="9. Dark Contrast">
    <div className="p-2 bg-gray-900 dark:bg-black rounded-t-xl -mx-[1px] -mt-[1px]">
      <div className="relative">
        <input type="text" placeholder="Search..." className="w-full pl-3 pr-8 py-1.5 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:outline-none focus:border-gray-500 placeholder:text-gray-500" />
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  </SearchDesignWrapper>
);

// 10. Neumorphic (Soft)
const SearchDesign10 = () => (
  <SearchDesignWrapper title="10. Neumorphic">
    <div className="p-3 bg-[#e0e5ec] dark:bg-zinc-800">
      <div className="relative rounded-full shadow-[inset_3px_3px_6px_#bec3c9,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_2px_2px_4px_#000000,inset_-2px_-2px_4px_#333333] bg-[#e0e5ec] dark:bg-zinc-800">
        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-none focus:outline-none text-gray-600 dark:text-gray-300" />
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  </SearchDesignWrapper>
);

const SEARCH_DESIGNS = [
  { id: 1, Component: SearchDesign1 },
  { id: 2, Component: SearchDesign2 },
  { id: 3, Component: SearchDesign3 },
  { id: 4, Component: SearchDesign4 },
  { id: 5, Component: SearchDesign5 },
  { id: 6, Component: SearchDesign6 },
  { id: 7, Component: SearchDesign7 },
  { id: 8, Component: SearchDesign8 },
  { id: 9, Component: SearchDesign9 },
  { id: 10, Component: SearchDesign10 },
];

const DesignsPage = () => {
  const [activeTab, setActiveTab] = React.useState("history_tab");
  const topRef = React.useRef<HTMLDivElement>(null);

  // Synchronous scroll reset before browser paints
  React.useLayoutEffect(() => {
    const mainContainer = document.querySelector("main");
    if (mainContainer) {
      mainContainer.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeTab]); // Run on every tab change

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-12 pb-20" ref={topRef}>
      <div className="w-full">
        <div className="mb-8 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex gap-6 relative overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
            <button onClick={() => handleTabChange("history_tab")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "history_tab" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              History Tab (Active)
              {activeTab === "history_tab" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("cards")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "cards" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Integration Cards
              {activeTab === "cards" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("blocking")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "blocking" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Blocking Cards
              {activeTab === "blocking" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("search")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "search" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Dropdown Search
              {activeTab === "search" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("reports")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "reports" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Report Layouts
              {activeTab === "reports" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("failed")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "failed" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Failed Pages
              {activeTab === "failed" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("reservations")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "reservations" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Tables
              {activeTab === "reservations" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("headers")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "headers" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Headers
              {activeTab === "headers" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("crowded")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "crowded" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Res. Layouts
              {activeTab === "crowded" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("animations")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "animations" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Animations
              {activeTab === "animations" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("unit_drawer")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "unit_drawer" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Unit Drawer
              {activeTab === "unit_drawer" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("approval_flow")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "approval_flow" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Approval Flow
              {activeTab === "approval_flow" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
            <button onClick={() => handleTabChange("history_tab")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "history_tab" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              History Tab
              {activeTab === "history_tab" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
          </div>
        </div>

        {activeTab === "cards" && (
          <div key={`cards-${Date.now()}`} className="space-y-16 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Design {id}: {name}
                  </h2>
                  <p className="text-sm text-gray-500">Showing all 3 status states.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50/50 dark:bg-black/20 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/50">
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold ml-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" /> Disconnected
                    </span>
                    <div className="h-[280px]">
                      <Component status="disconnected" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider text-emerald-500 font-bold ml-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> Connected
                    </span>
                    <div className="h-[280px]">
                      <Component status="connected" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider text-amber-500 font-bold ml-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" /> Expired
                    </span>
                    <div className="h-[280px]">
                      <Component status="expired" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blocking Cards Section */}
        {activeTab === "blocking" && (
          <div key={`blocking-${Date.now()}`} className="space-y-16 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {BLOCKING_CARD_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Design {id}: {name}
                  </h2>
                  <p className="text-sm text-gray-500">Showing Pending, Active, and Expired states.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50/50 dark:bg-black/20 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/50">
                  {/* Pending State */}
                  <div className="space-y-3 h-full">
                    <span className="text-xs uppercase tracking-wider text-amber-500 font-bold ml-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" /> Pending Approval
                    </span>
                    <div className="h-full min-h-[340px]">
                      <Component status="pending" />
                    </div>
                  </div>

                  {/* Active State */}
                  <div className="space-y-3 h-full">
                    <span className="text-xs uppercase tracking-wider text-blue-500 font-bold ml-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" /> Active Blocking
                    </span>
                    <div className="h-full min-h-[340px]">
                      <Component status="active" />
                    </div>
                  </div>

                  {/* Expired State */}
                  <div className="space-y-3 h-full">
                    <span className="text-xs uppercase tracking-wider text-red-500 font-bold ml-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" /> Expired
                    </span>
                    <div className="h-full min-h-[340px]">
                      <Component status="expired" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "search" && (
          <div key={`search-${Date.now()}`} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 pt-4 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {SEARCH_DESIGNS.map(({ id, Component }) => (
              <div key={id} className="flex justify-center">
                <Component />
              </div>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div key={`reports-${Date.now()}`} className="space-y-20 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {REPORT_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-400">
                  Design {id}: {name}
                </h2>
                <div className="w-full">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "failed" && (
          <div key={`failed-${Date.now()}`} className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {FAILED_CONNECTION_DESIGNS.map(({ id, Component }) => (
              <div key={id} className="flex justify-center w-full">
                <Component />
              </div>
            ))}
          </div>
        )}

        {activeTab === "reservations" && (
          <div key={`reservations-${Date.now()}`} className="space-y-20 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {RESERVATION_TABLE_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-400">
                  Design {id}: {name}
                </h2>
                <div className="w-full">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "headers" && (
          <div key={`headers-${Date.now()}`} className="space-y-12 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {HEADER_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-400">
                  Design {id}: {name}
                </h2>
                <div className="w-full">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "crowded" && (
          <div key={`crowded-${Date.now()}`} className="space-y-12 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {CROWDED_HEADER_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-400">
                  Solution {id}: {name}
                </h2>
                <div className="w-full">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Animation Designs */}
        {activeTab === "animations" && (
          <div key={`animations-${Date.now()}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {PENDING_ANIMATION_DESIGNS.map(({ id, Component }) => (
              <div key={id} className="space-y-2">
                <Component />
              </div>
            ))}
          </div>
        )}

        {/* Unit Drawer Designs */}
        {activeTab === "unit_drawer" && (
          <div key={`unit_drawer-${Date.now()}`} className="space-y-16 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {UNIT_DRAWER_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Option {id}: {name}
                  </h2>
                  <p className="text-sm text-gray-500">Full-size preview of the drawer content.</p>
                </div>
                <div className="w-full max-w-5xl mx-auto">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approval Flow Designs */}
        {activeTab === "approval_flow" && (
          <div key={`approval_flow-${Date.now()}`} className="space-y-16 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {APPROVAL_FLOW_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Option {id}: {name}
                  </h2>
                  <p className="text-sm text-gray-500">Visualization of the approval process steps.</p>
                </div>
                <div className="w-full bg-gray-50/30 p-8 rounded-3xl border border-gray-100">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Tab Designs */}
        {activeTab === "history_tab" && (
          <div key={`history_tab-${Date.now()}`} className="space-y-16 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {HISTORY_TAB_DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Option {id}: {name}
                  </h2>
                  <p className="text-sm text-gray-500">Visualization of the history log and changes.</p>
                </div>
                <div className="w-full bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                  <Component />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignsPage;
