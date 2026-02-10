import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Settings2, Zap, AlertCircle, Link2, Calendar, Clock, ArrowRight } from "lucide-react";

// --- Shared Mock Data ---
const MOCK_DATA = {
  name: "Salesforce CRM",
  description: "Sync leads & contacts bi-directionally.",
  connectedDate: "Connected: Jan 12, 2026",
  expiryDate: "Expires: Feb 14, 2026",
};

const SalesforceLogo = ({ size = 24, mono = false }: { size?: number; mono?: boolean }) => (
  <div className={`flex items-center justify-center rounded-lg ${mono ? "text-current" : "text-[#00A1E0]"}`}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.28 12.01c0-2.33-1.89-4.22-4.22-4.22-.11 0-.21.01-.32.02a4.93 4.93 0 0 0-9.67-.71c-.17-.14-.38-.21-.61-.21-1.95 0-3.53 1.58-3.53 3.53 0 .76.24 1.48.66 2.06a4.95 4.95 0 0 0-.71 2.51c0 2.74 2.22 4.95 4.95 4.95 1.38 0 2.63-.56 3.53-1.46a4.77 4.77 0 0 0 2.7 0.85c1.54 0 2.91-.71 3.8-1.83a4.1 4.1 0 0 0 6.64-3.21c0-.18-.01-.35-.04-.53.11-.23.16-.49.16-.75z" />
    </svg>
  </div>
);

type IntegrationStatus = "connected" | "disconnected" | "expired";

interface DesignProps {
  status: IntegrationStatus;
}

// --- DESIGN 1: Vibrant Dark Glass (The Favorite) ---
// Retained Design 5 as requested, with dates added.
const Design1 = ({ status }: DesignProps) => {
  const isConnected = status === "connected";
  const isExpired = status === "expired";

  return (
    <div className="h-full relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-xl text-white group">
      {/* Vibrant Gradients */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-40 pointer-events-none transition-all duration-500 group-hover:opacity-50
          ${isConnected ? "bg-emerald-600 -mr-20 -mt-20" : isExpired ? "bg-orange-600 -mr-20 -mt-20" : "bg-indigo-600 -mr-20 -mt-20"}
       `}
      />

      <div className="p-6 relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
            <SalesforceLogo size={24} mono />
          </div>
          {isConnected && (
            <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={16} />
            </div>
          )}
          {isExpired && (
            <div className="p-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
              <AlertCircle size={16} />
            </div>
          )}
          {!isConnected && !isExpired && (
            <div className="p-1.5 rounded-full bg-white/10 text-white/40 border border-white/10">
              <Link2 size={16} />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold tracking-tight mb-2">{MOCK_DATA.name}</h3>
        <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">{MOCK_DATA.description}</p>

        {/* Status/Date Info */}
        {(isConnected || isExpired) && (
          <div
            className={`mb-6 p-3 rounded-xl border flex items-center gap-3 backdrop-blur-md transition-colors
                ${isConnected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200" : "bg-orange-500/10 border-orange-500/20 text-orange-200"}
             `}
          >
            {isConnected ? <Calendar size={14} /> : <Clock size={14} />}
            <span className="text-xs font-semibold tracking-wide">{isConnected ? MOCK_DATA.connectedDate : MOCK_DATA.expiryDate}</span>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2
                ${isConnected ? "bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg" : isExpired ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 text-white shadow-lg shadow-orange-900/40 border border-orange-400/20" : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white shadow-lg shadow-indigo-900/40 border border-indigo-400/20"}
             `}
          >
            {isConnected ? (
              <>
                Manage Access <Settings2 size={14} className="opacity-70" />
              </>
            ) : isExpired ? (
              <>
                Resolve Issue <ArrowRight size={14} />
              </>
            ) : (
              <>
                Connect Now <Zap size={14} fill="currentColor" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- DESIGN 2: Obsidian Frost ---
// Dark, heavy glass with sharp borders and distinct status zones.
const Design2 = ({ status }: DesignProps) => {
  const isConnected = status === "connected";
  const isExpired = status === "expired";

  return (
    <div className="h-full relative rounded-3xl overflow-hidden bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col group">
      {/* Top Banner / Status Indicator */}
      <div
        className={`h-1.5 w-full transition-colors duration-500
         ${isConnected ? "bg-gradient-to-r from-emerald-500 to-teal-500" : isExpired ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-slate-700 to-slate-800"}
      `}
      />

      <div className="p-6 flex-1 flex flex-col relative z-10">
        {/* Background Glow */}
        <div
          className={`absolute top-10 right-10 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none
            ${isConnected ? "bg-emerald-500" : isExpired ? "bg-amber-500" : "bg-blue-500"}
         `}
        />

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
            <SalesforceLogo size={28} mono />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white leading-tight">{MOCK_DATA.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : isExpired ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "bg-slate-600"}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isConnected ? "text-emerald-400" : isExpired ? "text-amber-400" : "text-slate-500"}`}>{isConnected ? "Active" : isExpired ? "Attention" : "Offline"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden mb-6 backdrop-blur-md">
          <div className="bg-white/5 p-3 flex flex-col gap-1 items-center justify-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Latency</span>
            <span className="text-sm font-mono font-medium text-white">24ms</span>
          </div>
          <div className="bg-white/5 p-3 flex flex-col gap-1 items-center justify-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Uptime</span>
            <span className="text-sm font-mono font-medium text-white">99.9%</span>
          </div>
        </div>

        {/* Date Info Bubble */}
        {(isConnected || isExpired) && (
          <div className="mb-auto flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
              <Clock size={10} />
              {isConnected ? MOCK_DATA.connectedDate : MOCK_DATA.expiryDate}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button className={`w-full font-semibold border transition-all h-10 ${isConnected ? "bg-white/10 border-white/10 text-white hover:bg-white/20" : isExpired ? "bg-amber-500/20 border-amber-500/50 text-amber-200 hover:bg-amber-500/30" : "bg-blue-600 border-transparent text-white hover:bg-blue-500 shadow-lg shadow-blue-900/50"}`}>{isConnected ? "Configure" : isExpired ? "Reconnect" : "Connect"}</Button>
        </div>
      </div>
    </div>
  );
};

// --- DESIGN 3: Deep Ocean Glass ---
// Beautiful blue-heavy glass theme, very premium.
const Design3 = ({ status }: DesignProps) => {
  const isConnected = status === "connected";
  const isExpired = status === "expired";

  return (
    <div className="h-full relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/50 shadow-2xl group">
      {/* Inner Light Source */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50`} />

      <div className="p-1.5 h-full">
        <div className="h-full rounded-2xl bg-black/20 border border-white/5 p-5 flex flex-col relative overflow-hidden backdrop-blur-sm">
          {/* Ambient Backlight */}
          <div
            className={`absolute bottom-0 inset-x-0 h-40 opacity-20 transition-colors duration-700 blur-3xl pointer-events-none
               ${isConnected ? "bg-emerald-500" : isExpired ? "bg-amber-500" : "bg-blue-600"}
            `}
          />

          <div className="flex justify-between items-start z-10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-md">
              <SalesforceLogo size={22} mono />
            </div>

            {(isConnected || isExpired) && <Badge className={`border border-opacity-30 ${isConnected ? "text-emerald-400 border-emerald-400 bg-emerald-900/20" : "text-amber-400 border-amber-400 bg-amber-900/20"}`}>{isConnected ? "Active" : "Expired"}</Badge>}
          </div>

          <div className="mt-4 mb-2 z-10">
            <h3 className="text-xl font-bold text-white tracking-wide">{MOCK_DATA.name}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{MOCK_DATA.description}</p>
          </div>

          {(isConnected || isExpired) && (
            <div className="mt-4 py-2 border-y border-white/5 flex items-center gap-2 text-xs text-slate-400 z-10 mb-auto">
              <Calendar size={12} className="text-slate-500" />
              <span>{isConnected ? MOCK_DATA.connectedDate.replace("Connected: ", "") : MOCK_DATA.expiryDate.replace("Expires: ", "")}</span>
            </div>
          )}

          <div className="mt-auto pt-5 z-10">
            <button
              className={`w-full group/btn relative overflow-hidden rounded-lg p-px h-10 flex items-center justify-center font-medium text-sm transition-all
                  ${isConnected ? "bg-slate-800 text-slate-300" : "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]"}
               `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isConnected ? "Manage" : "Connect"} {!isConnected && <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />}
              </span>
              {!isConnected && <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-200" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DESIGN 4: Neon Cyber Glass ---
// High tech, cyberpunk inspired glass.
const Design4 = ({ status }: DesignProps) => {
  const isConnected = status === "connected";
  const isExpired = status === "expired";

  const themeColor = isConnected ? "text-emerald-400" : isExpired ? "text-amber-400" : "text-cyan-400";
  const borderColor = isConnected ? "border-emerald-500/30" : isExpired ? "border-amber-500/30" : "border-cyan-500/30";

  return (
    <div className={`h-full rounded-2xl bg-[#050510] border ${borderColor} p-6 relative overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]" />

      <div className="relative z-10 flex items-center justify-between mb-8">
        <SalesforceLogo size={28} />

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : isExpired ? "bg-amber-500 animate-pulse" : "bg-slate-700"}`} />
            <span className={`text-[10px] font-mono uppercase tracking-wider ${themeColor}`}>{isConnected ? "LINKED" : isExpired ? "ERROR" : "READY"}</span>
          </div>
          {(isConnected || isExpired) && <span className="text-[9px] text-slate-500 font-mono mt-0.5">{isConnected ? "12.01.26" : "14.02.26"}</span>}
        </div>
      </div>

      <h3 className="relative z-10 text-lg font-bold text-white mb-2">{MOCK_DATA.name}</h3>

      <div className="relative z-10 mt-auto pt-6 border-t border-white/5">
        <button
          className={`w-full py-2.5 rounded hover:opacity-90 font-mono text-xs font-bold uppercase tracking-widest transition-all
             ${isConnected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/50" : isExpired ? "bg-amber-500/10 text-amber-400 border border-amber-500/50" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50"}
          `}
        >
          {isConnected ? "[ SYSTEM_OK ]" : isExpired ? "[ REPAIR ]" : "[ INITIALIZE ]"}
        </button>
      </div>
    </div>
  );
};

// --- DESIGN 5: Soft Haze Glass ---
// Extremely subtle, premium softness.
const Design5 = ({ status }: DesignProps) => {
  const isConnected = status === "connected";
  const isExpired = status === "expired";

  return (
    <div className="h-full relative rounded-[2rem] p-6 bg-white/5 backdrop-blur-3xl border border-white/20 shadow-xl overflow-hidden text-white flex flex-col group hover:bg-white/10 transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10 mb-6 flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-lg">
          <SalesforceLogo size={24} mono />
        </div>
        {isConnected && <div className="text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/30 backdrop-blur-md">ACTIVE</div>}
        {isExpired && <div className="text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-500/30 backdrop-blur-md">EXPIRED</div>}
      </div>

      <h3 className="relative z-10 text-2xl font-light mb-1">{MOCK_DATA.name}</h3>
      <p className="relative z-10 text-xs text-white/50 font-light tracking-wide mb-8">Customer Relationship Mgmt</p>

      {(isConnected || isExpired) && (
        <div className="relative z-10 mb-8 flex items-center gap-3 text-sm text-white/70 font-light">
          <Calendar size={14} className="opacity-70" />
          <span className="tracking-wide">{isConnected ? "Since Jan 12" : "Exp Feb 14"}</span>
        </div>
      )}

      <div className="relative z-10 mt-auto">
        <Button className="w-full bg-white text-black hover:bg-gray-200 border-none rounded-xl font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)]">{isConnected ? "Settings" : "Connect"}</Button>
      </div>
    </div>
  );
};

export const INTEGRATION_DESIGNS = [
  { id: 1, name: "Vibrant Dark Glass", Component: Design1 },
  { id: 2, name: "Obsidian Frost", Component: Design2 },
  { id: 3, name: "Deep Ocean Glass", Component: Design3 },
  { id: 4, name: "Neon Cyber Glass", Component: Design4 },
  { id: 5, name: "Soft Haze Glass", Component: Design5 },
];
