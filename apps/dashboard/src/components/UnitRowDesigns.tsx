import {
  Building2,
  ChevronDown,
  Pencil,
  Download,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Wallet,
  Receipt,
  CircleDollarSign,
} from "lucide-react";

// Shared mock data for all design variants — mirrors the real unit row on ClientDetailPage
const MOCK_UNIT = {
  code: "A-101",
  compound: "Nile View Residences",
  totalValue: 5_695_000,
  collected: 2_357_504,
  cheques: { collected: 18, total: 48 },
  paidPct: 41,
  nextDueDate: "15 Apr 2026",
  nextDueAmount: 132_813,
  hasIssues: false,
};

const fmt = (n: number) => `EGP ${n.toLocaleString("en-US")}`;

// ─────────────────────────────────────────────
// 1. Embedded Progress Hero
//    Progress bar runs along the full bottom edge of the row
// ─────────────────────────────────────────────
const Design1 = () => (
  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
    <div className="px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
        <Building2 size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900">{MOCK_UNIT.code}</div>
        <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
      </div>
      <div className="flex items-center gap-8 shrink-0">
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Total</div>
          <div className="text-sm font-bold text-gray-900 tabular-nums">{fmt(MOCK_UNIT.totalValue)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Collected</div>
          <div className="text-sm font-bold text-emerald-600 tabular-nums">{fmt(MOCK_UNIT.collected)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Cheques</div>
          <div className="text-sm font-bold text-gray-700">
            {MOCK_UNIT.cheques.collected}
            <span className="text-gray-300 font-normal">/{MOCK_UNIT.cheques.total}</span>
          </div>
        </div>
        <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
          <Pencil size={11} /> Edit
        </button>
        <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
          <Download size={11} /> PDF
        </button>
        <ChevronDown size={18} className="text-gray-400" />
      </div>
    </div>
    {/* Progress strip */}
    <div className="relative h-1.5 bg-gray-100">
      <div className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-blue-600" style={{ width: `${MOCK_UNIT.paidPct}%` }} />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <span className="text-[10px] font-bold text-gray-500 bg-white px-1.5 rounded">{MOCK_UNIT.paidPct}% paid</span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 2. Ring + Compact Stats
//    Donut progress ring on the right replaces "Paid %" stat
// ─────────────────────────────────────────────
const RingChart = ({ pct, color }: { pct: number; color: string }) => {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
      <circle cx="24" cy="24" r={r} stroke="#f1f5f9" strokeWidth="4" fill="none" />
      <circle cx="24" cy="24" r={r} stroke={color} strokeWidth="4" fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 24 24)" />
      <text x="24" y="27" textAnchor="middle" className="fill-gray-700 font-bold" fontSize="11">
        {pct}%
      </text>
    </svg>
  );
};

const Design2 = () => (
  <div className="border border-gray-200 rounded-xl bg-white px-5 py-4 flex items-center gap-5">
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
      <Building2 size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-gray-900">{MOCK_UNIT.code}</div>
      <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
    </div>
    <div className="flex items-center gap-7 shrink-0">
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Total</div>
        <div className="text-sm font-bold text-gray-900 tabular-nums">{fmt(MOCK_UNIT.totalValue)}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Collected</div>
        <div className="text-sm font-bold text-emerald-600 tabular-nums">{fmt(MOCK_UNIT.collected)}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Cheques</div>
        <div className="text-sm font-bold text-gray-700">
          {MOCK_UNIT.cheques.collected}<span className="text-gray-300 font-normal">/{MOCK_UNIT.cheques.total}</span>
        </div>
      </div>
      <RingChart pct={MOCK_UNIT.paidPct} color="#2563eb" />
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="Edit">
          <Pencil size={13} />
        </button>
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="PDF">
          <Download size={13} />
        </button>
      </div>
      <ChevronDown size={18} className="text-gray-400" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 3. Status Spine (colored left edge)
// ─────────────────────────────────────────────
const Design3 = () => (
  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white flex">
    <div className="w-1 bg-linear-to-b from-amber-400 to-amber-500" />
    <div className="flex-1 px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
        <Building2 size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{MOCK_UNIT.code}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            On Track
          </span>
        </div>
        <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Total Value</div>
          <div className="text-sm font-bold text-gray-900 tabular-nums">{fmt(MOCK_UNIT.totalValue)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Collected</div>
          <div className="text-sm font-bold text-emerald-600 tabular-nums">{fmt(MOCK_UNIT.collected)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Cheques</div>
          <div className="text-sm font-bold text-gray-700">
            {MOCK_UNIT.cheques.collected}<span className="text-gray-300 font-normal">/{MOCK_UNIT.cheques.total}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Paid</div>
          <div className="text-sm font-bold text-amber-600">{MOCK_UNIT.paidPct}%</div>
        </div>
        <div className="flex items-center gap-1">
          <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
            <Pencil size={11} /> Edit
          </button>
          <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
            <Download size={11} /> PDF
          </button>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 4. Bento Tiles (each stat as a discrete tile)
// ─────────────────────────────────────────────
const Tile = ({ label, value, valueClass = "text-gray-900", tone = "bg-gray-50/60" }: { label: string; value: React.ReactNode; valueClass?: string; tone?: string }) => (
  <div className={`${tone} rounded-lg px-3 py-2 min-w-[110px]`}>
    <div className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">{label}</div>
    <div className={`text-sm font-bold tabular-nums mt-0.5 ${valueClass}`}>{value}</div>
  </div>
);

const Design4 = () => (
  <div className="border border-gray-200 rounded-xl bg-white px-5 py-3.5 flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
      <Building2 size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-gray-900">{MOCK_UNIT.code}</div>
      <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Tile label="Total" value={fmt(MOCK_UNIT.totalValue)} />
      <Tile label="Collected" value={fmt(MOCK_UNIT.collected)} valueClass="text-emerald-700" tone="bg-emerald-50/60" />
      <Tile label="Cheques" value={`${MOCK_UNIT.cheques.collected}/${MOCK_UNIT.cheques.total}`} />
      <Tile label="Paid" value={`${MOCK_UNIT.paidPct}%`} valueClass="text-red-600" tone="bg-red-50/40" />
    </div>
    <div className="flex items-center gap-1 shrink-0 ml-2">
      <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="Edit"><Pencil size={13} /></button>
      <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="PDF"><Download size={13} /></button>
      <ChevronDown size={18} className="text-gray-400 ml-1" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 5. Timeline / Next-Due Pin
//    Surfaces "next cheque due" prominently
// ─────────────────────────────────────────────
const Design5 = () => (
  <div className="border border-gray-200 rounded-xl bg-white px-5 py-4 flex items-center gap-5">
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
      <Building2 size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-gray-900">{MOCK_UNIT.code}</div>
      <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
    </div>
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
      <Calendar size={14} className="text-amber-600" />
      <div>
        <div className="text-[9px] uppercase tracking-wide text-amber-700 font-semibold">Next Due</div>
        <div className="text-[11px] font-bold text-amber-900 tabular-nums">{MOCK_UNIT.nextDueDate} · {fmt(MOCK_UNIT.nextDueAmount)}</div>
      </div>
    </div>
    <div className="flex items-center gap-6 shrink-0">
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Collected</div>
        <div className="text-sm font-bold text-emerald-600 tabular-nums">{fmt(MOCK_UNIT.collected)}</div>
        <div className="text-[10px] text-gray-400">of {fmt(MOCK_UNIT.totalValue)}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Cheques</div>
        <div className="text-sm font-bold text-gray-700">
          {MOCK_UNIT.cheques.collected}<span className="text-gray-300 font-normal">/{MOCK_UNIT.cheques.total}</span>
        </div>
        <div className="text-[10px] text-red-500 font-semibold">{MOCK_UNIT.paidPct}% paid</div>
      </div>
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="Edit"><Pencil size={13} /></button>
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="PDF"><Download size={13} /></button>
      </div>
      <ChevronDown size={18} className="text-gray-400" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 6. Sparkline / Cash Flow
//    Mini chart of paid cheques over time
// ─────────────────────────────────────────────
const Sparkline = () => (
  <svg width="120" height="40" viewBox="0 0 120 40" className="shrink-0">
    <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0 30 L15 28 L30 24 L45 25 L60 18 L75 20 L90 12 L105 14 L120 8 L120 40 L0 40 Z" fill="url(#sparkGrad)" />
    <path d="M0 30 L15 28 L30 24 L45 25 L60 18 L75 20 L90 12 L105 14 L120 8" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="120" cy="8" r="2.5" fill="#10b981" />
  </svg>
);

const Design6 = () => (
  <div className="border border-gray-200 rounded-xl bg-white px-5 py-4 flex items-center gap-5">
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
      <Building2 size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-gray-900">{MOCK_UNIT.code}</div>
      <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
    </div>
    <div className="flex flex-col items-end">
      <div className="text-[10px] text-gray-400 uppercase tracking-wide">Collection Trend</div>
      <Sparkline />
    </div>
    <div className="flex items-center gap-6 shrink-0">
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Total</div>
        <div className="text-sm font-bold text-gray-900 tabular-nums">{fmt(MOCK_UNIT.totalValue)}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Paid</div>
        <div className="flex items-baseline gap-1 justify-end">
          <span className="text-sm font-bold text-emerald-600">{MOCK_UNIT.paidPct}%</span>
          <TrendingUp size={11} className="text-emerald-500" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="Edit"><Pencil size={13} /></button>
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="PDF"><Download size={13} /></button>
      </div>
      <ChevronDown size={18} className="text-gray-400" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 7. Stacked Two-Line Layout
//    Title bar on top, full progress + meta on bottom
// ─────────────────────────────────────────────
const Design7 = () => (
  <div className="border border-gray-200 rounded-xl bg-white px-5 py-3.5 hover:bg-gray-50/30 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
        <Building2 size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{MOCK_UNIT.code}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">{MOCK_UNIT.compound}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-gray-900 tabular-nums">{fmt(MOCK_UNIT.totalValue)}</div>
        <div className="text-[10px] text-gray-400">Total wallet value</div>
      </div>
      <div className="flex items-center gap-1">
        <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-white text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
          <Pencil size={11} /> Edit
        </button>
        <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-white text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
          <Download size={11} /> PDF
        </button>
        <ChevronDown size={18} className="text-gray-400 ml-2" />
      </div>
    </div>
    <div className="ml-14 mt-3 flex items-center gap-4">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-linear-to-r from-emerald-400 to-emerald-500" style={{ width: `${MOCK_UNIT.paidPct}%` }} />
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-emerald-600 font-semibold">{fmt(MOCK_UNIT.collected)} collected</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-500">
          {MOCK_UNIT.cheques.collected}/{MOCK_UNIT.cheques.total} cheques
        </span>
        <span className="text-gray-300">·</span>
        <span className="text-red-600 font-semibold">{MOCK_UNIT.paidPct}% paid</span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 8. Gradient Hero Card
//    Subtle gradient background, large primary metric
// ─────────────────────────────────────────────
const Design8 = () => (
  <div className="border border-blue-100 rounded-xl bg-linear-to-r from-blue-50/40 via-white to-white px-5 py-4 flex items-center gap-5">
    <div className="w-12 h-12 rounded-xl bg-white border border-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
      <Building2 size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-3">
        <span className="font-bold text-gray-900 text-base">{MOCK_UNIT.code}</span>
        <span className="text-xs text-gray-500">{MOCK_UNIT.compound}</span>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="text-[11px] text-gray-500 flex items-center gap-1">
          <CheckCircle2 size={11} className="text-emerald-500" />
          {MOCK_UNIT.cheques.collected} of {MOCK_UNIT.cheques.total} cheques
        </div>
        <span className="text-gray-300">·</span>
        <div className="text-[11px] text-gray-500 flex items-center gap-1">
          <Clock size={11} className="text-amber-500" />
          Next: {MOCK_UNIT.nextDueDate}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-[10px] text-gray-400 uppercase tracking-wide">Collected</div>
      <div className="text-lg font-bold text-emerald-600 tabular-nums">{fmt(MOCK_UNIT.collected)}</div>
      <div className="text-[10px] text-gray-400 tabular-nums">of {fmt(MOCK_UNIT.totalValue)}</div>
    </div>
    <div className="w-24">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Paid</span>
        <span className="text-[11px] font-bold text-blue-600">{MOCK_UNIT.paidPct}%</span>
      </div>
      <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${MOCK_UNIT.paidPct}%` }} />
      </div>
    </div>
    <div className="flex items-center gap-1">
      <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-blue-300 flex items-center justify-center text-gray-500 hover:text-blue-600" title="Edit"><Pencil size={13} /></button>
      <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-blue-300 flex items-center justify-center text-gray-500 hover:text-blue-600" title="PDF"><Download size={13} /></button>
    </div>
    <ChevronDown size={18} className="text-gray-400" />
  </div>
);

// ─────────────────────────────────────────────
// 9. Segmented Bar
//    Visualize collected / pending / overdue as a single split bar
// ─────────────────────────────────────────────
const Design9 = () => (
  <div className="border border-gray-200 rounded-xl bg-white px-5 py-4">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
        <Building2 size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900">{MOCK_UNIT.code}</div>
        <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Wallet Total</div>
        <div className="text-sm font-bold text-gray-900 tabular-nums">{fmt(MOCK_UNIT.totalValue)}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
          <Pencil size={11} /> Edit
        </button>
        <button className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
          <Download size={11} /> PDF
        </button>
        <ChevronDown size={18} className="text-gray-400 ml-1" />
      </div>
    </div>
    {/* Segmented bar */}
    <div className="ml-14 mt-3">
      <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
        <div className="bg-emerald-500" style={{ width: `${MOCK_UNIT.paidPct}%` }} />
        <div className="bg-amber-400" style={{ width: `${100 - MOCK_UNIT.paidPct - 5}%` }} />
        <div className="bg-gray-200" style={{ width: "5%" }} />
      </div>
      <div className="flex items-center gap-5 mt-2">
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-gray-700">{fmt(MOCK_UNIT.collected)}</span>
          <span className="text-gray-400">collected</span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-semibold text-gray-700">{fmt(MOCK_UNIT.totalValue - MOCK_UNIT.collected)}</span>
          <span className="text-gray-400">pending</span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="text-gray-400">{MOCK_UNIT.cheques.total - MOCK_UNIT.cheques.collected} cheques remaining</span>
        </span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 10. Iconographic Stats
//    Each metric paired with a contextual icon; very scannable
// ─────────────────────────────────────────────
const IconStat = ({ icon: Icon, label, value, valueClass = "text-gray-900", iconBg = "bg-gray-100", iconColor = "text-gray-500" }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
  iconBg?: string;
  iconColor?: string;
}) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}>
      <Icon size={14} />
    </div>
    <div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wide leading-none">{label}</div>
      <div className={`text-sm font-bold tabular-nums leading-tight ${valueClass}`}>{value}</div>
    </div>
  </div>
);

const Design10 = () => (
  <div className="border border-gray-200 rounded-xl bg-white px-5 py-4 flex items-center gap-5">
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
      <Building2 size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-gray-900">{MOCK_UNIT.code}</div>
      <span className="text-xs text-gray-400">{MOCK_UNIT.compound}</span>
    </div>
    <div className="flex items-center gap-6 shrink-0">
      <IconStat icon={Wallet} label="Total" value={fmt(MOCK_UNIT.totalValue)} />
      <IconStat icon={CircleDollarSign} label="Collected" value={fmt(MOCK_UNIT.collected)} valueClass="text-emerald-700" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      <IconStat icon={Receipt} label="Cheques" value={`${MOCK_UNIT.cheques.collected}/${MOCK_UNIT.cheques.total}`} />
      <IconStat icon={TrendingUp} label="Paid" value={`${MOCK_UNIT.paidPct}%`} valueClass="text-red-600" iconBg="bg-red-50" iconColor="text-red-500" />
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="Edit"><Pencil size={13} /></button>
        <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500" title="PDF"><Download size={13} /></button>
      </div>
      <ChevronDown size={18} className="text-gray-400" />
    </div>
  </div>
);

export const UNIT_ROW_DESIGNS: { id: number; name: string; Component: React.FC }[] = [
  { id: 1, name: "Embedded Progress Bar (full-width strip)", Component: Design1 },
  { id: 2, name: "Donut Ring + Compact Stats", Component: Design2 },
  { id: 3, name: "Status Spine (colored left edge + tag)", Component: Design3 },
  { id: 4, name: "Bento Tiles (each stat as a tile)", Component: Design4 },
  { id: 5, name: "Next-Due Pin (timeline-aware)", Component: Design5 },
  { id: 6, name: "Sparkline / Cash-flow Trend", Component: Design6 },
  { id: 7, name: "Two-Line Stacked (progress on row 2)", Component: Design7 },
  { id: 8, name: "Gradient Hero Card (premium feel)", Component: Design8 },
  { id: 9, name: "Segmented Bar (collected / pending split)", Component: Design9 },
  { id: 10, name: "Iconographic Stats (icon-paired metrics)", Component: Design10 },
];
