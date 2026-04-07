import { FileCheck, ChevronRight, Clock, AlertCircle, FileText, CheckCircle2, Users, Bell, Inbox, ClipboardList } from "lucide-react";

const MOCK_COUNT = 8;
const MOCK_CARDS = [
  { initials: "YK", name: "Youssef Kamal", unit: "G-401", compound: "Nile View Residences", price: "EGP 4,200,000" },
  { initials: "MR", name: "Mona Rashid", unit: "H-108", compound: "Palm Hills Gardens", price: "EGP 7,500,000" },
  { initials: "TI", name: "Tarek Ibrahim", unit: "J-305", compound: "Sunset Bay", price: "EGP 3,100,000" },
];

// 1. Warm Amber Banner (current style refined)
const Design1 = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <FileCheck size={16} className="text-amber-600" />
        </div>
        <div>
          <span className="text-sm font-bold text-amber-900">{MOCK_COUNT} Pending Confirmations</span>
          <p className="text-[10px] text-amber-600 mt-0.5">Contracts signed, cheques need to be confirmed</p>
        </div>
      </div>
      <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors">
        View all
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {MOCK_CARDS.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5 bg-white border border-amber-200 rounded-lg px-3 py-2 hover:border-amber-300 cursor-pointer transition-colors group">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">{p.initials}</div>
          <div>
            <div className="text-xs font-semibold text-gray-900">{p.name}</div>
            <div className="text-[10px] text-gray-400">{p.unit} · {p.compound} · {p.price}</div>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
        </div>
      ))}
      <div className="flex items-center justify-center bg-white border border-amber-200 rounded-lg px-4 py-2 cursor-pointer hover:border-amber-300 transition-colors">
        <span className="text-xs font-semibold text-amber-700">+5 more</span>
      </div>
    </div>
  </div>
);

// 2. Minimal Top Bar
const Design2 = () => (
  <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Clock size={14} className="text-orange-500" />
        <span className="text-xs font-bold text-orange-800">{MOCK_COUNT} pending</span>
      </div>
      <div className="w-px h-4 bg-orange-200" />
      <div className="flex items-center gap-1.5">
        {MOCK_CARDS.map((p) => (
          <div key={p.name} className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold border-2 border-orange-50 -ml-1 first:ml-0">
            {p.initials}
          </div>
        ))}
        <span className="text-[10px] font-semibold text-orange-600 ml-1">+5 more</span>
      </div>
      <span className="text-[10px] text-orange-500">Contracts signed, awaiting cheque confirmation</span>
    </div>
    <button className="text-xs font-semibold text-orange-700 hover:underline">Review all &rarr;</button>
  </div>
);

// 3. Card Grid with Badge
const Design3 = () => (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <FileText size={15} className="text-gray-500" />
        <span className="text-sm font-bold text-gray-800">Cheque Confirmations</span>
        <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{MOCK_COUNT}</span>
      </div>
      <button className="text-[10px] font-semibold text-gray-500 hover:text-gray-700">View all &rarr;</button>
    </div>
    <div className="p-3 grid grid-cols-3 gap-2">
      {MOCK_CARDS.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-lg px-3 py-2.5 hover:border-gray-300 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">{p.initials}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-900 truncate">{p.name}</div>
            <div className="text-[10px] text-gray-400 truncate">{p.unit} · {p.price}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 4. Alert-style with Yellow Left Accent
const Design4 = () => (
  <div className="flex items-stretch border border-amber-200 rounded-xl overflow-hidden bg-white">
    <div className="w-1.5 bg-amber-400 shrink-0" />
    <div className="flex items-center justify-between flex-1 px-4 py-3">
      <div className="flex items-center gap-3">
        <AlertCircle size={18} className="text-amber-500" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{MOCK_COUNT} cheque confirmations pending</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {MOCK_CARDS.map((p) => (
              <span key={p.name} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{p.name}</span>
            ))}
            <span className="text-[10px] text-gray-400">+5 more</span>
          </div>
        </div>
      </div>
      <button className="bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors">
        Review
      </button>
    </div>
  </div>
);

// 5. Stacked Avatars with Hover Expand
const Design5 = () => (
  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center -space-x-2">
          {MOCK_CARDS.map((p) => (
            <div key={p.name} className="w-9 h-9 rounded-full bg-white border-2 border-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold shadow-sm">
              {p.initials}
            </div>
          ))}
          <div className="w-9 h-9 rounded-full bg-amber-200 border-2 border-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">
            +5
          </div>
        </div>
        <div>
          <span className="text-sm font-bold text-gray-900">{MOCK_COUNT} pending confirmations</span>
          <p className="text-[10px] text-amber-600 mt-0.5">New contracts need cheque details confirmed</p>
        </div>
      </div>
      <button className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-white border border-amber-200 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors">
        Review all
        <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

// 6. Dark Compact Bar
const Design6 = () => (
  <div className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
        <Inbox size={16} className="text-amber-400" />
      </div>
      <div>
        <span className="text-sm font-bold text-white">{MOCK_COUNT} pending cheque confirmations</span>
        <div className="flex items-center gap-2 mt-0.5">
          {MOCK_CARDS.slice(0, 2).map((p) => (
            <span key={p.name} className="text-[10px] text-gray-400">{p.name}</span>
          ))}
          <span className="text-[10px] text-gray-500">and {MOCK_COUNT - 2} more</span>
        </div>
      </div>
    </div>
    <button className="bg-amber-500 text-gray-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">
      Review
    </button>
  </div>
);

// 7. Pill-style Inline
const Design7 = () => (
  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
      <Bell size={12} className="text-amber-500" />
      <span className="text-xs font-bold text-amber-800">{MOCK_COUNT}</span>
      <span className="text-[10px] text-amber-600">pending</span>
    </div>
    <div className="w-px h-5 bg-gray-200" />
    <div className="flex items-center gap-2 flex-1">
      {MOCK_CARDS.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2.5 py-1 cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[8px] font-bold">{p.initials}</div>
          <span className="text-[10px] font-medium text-gray-700">{p.name}</span>
        </div>
      ))}
      <span className="text-[10px] text-gray-400">+5 more</span>
    </div>
    <button className="text-xs font-semibold text-blue-600 hover:underline shrink-0">View all</button>
  </div>
);

// 8. Two-tone Split
const Design8 = () => (
  <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden">
    <div className="bg-amber-500 px-5 flex items-center gap-3 shrink-0">
      <ClipboardList size={20} className="text-white" />
      <div>
        <div className="text-2xl font-bold text-white">{MOCK_COUNT}</div>
        <div className="text-[10px] text-amber-100 font-medium uppercase tracking-wide">Pending</div>
      </div>
    </div>
    <div className="flex-1 bg-white px-4 py-3">
      <div className="text-xs font-semibold text-gray-700 mb-2">Cheque confirmations awaiting review</div>
      <div className="flex items-center gap-2 flex-wrap">
        {MOCK_CARDS.map((p) => (
          <span key={p.name} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium cursor-pointer hover:bg-gray-200 transition-colors">
            {p.name} · {p.unit}
          </span>
        ))}
        <span className="text-[10px] text-gray-400">+5 more</span>
      </div>
    </div>
    <div className="flex items-center px-4 bg-gray-50 border-l border-gray-200 shrink-0">
      <button className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
        Review &rarr;
      </button>
    </div>
  </div>
);

// 9. Notification-style with Dot
const Design9 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <div className="relative shrink-0 mt-0.5">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <Users size={18} className="text-amber-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          {MOCK_COUNT}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-900">Pending Cheque Confirmations</div>
        <p className="text-[10px] text-gray-400 mt-0.5 mb-2">New contracts signed — confirm cheque schedules to activate collection tracking</p>
        <div className="flex items-center gap-1.5">
          {MOCK_CARDS.map((p) => (
            <div key={p.name} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-md px-2 py-1 cursor-pointer hover:border-gray-300 transition-colors">
              <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[7px] font-bold">{p.initials}</div>
              <span className="text-[10px] font-medium text-gray-600">{p.name}</span>
            </div>
          ))}
          <span className="text-[10px] text-gray-400 ml-1">+5</span>
        </div>
      </div>
      <button className="shrink-0 bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
        Review all
      </button>
    </div>
  </div>
);

// 10. Clean Progress Style
const Design10 = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-amber-500" />
        <span className="text-sm font-bold text-gray-900">Cheque Confirmations</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400">0 of {MOCK_COUNT} confirmed</span>
        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-emerald-500 rounded-full" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {MOCK_CARDS.map((p) => (
        <div key={p.name} className="border border-gray-100 rounded-lg p-2.5 hover:border-amber-300 hover:bg-amber-50/30 cursor-pointer transition-all">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-[9px] font-bold">{p.initials}</div>
            <span className="text-xs font-semibold text-gray-900 truncate">{p.name}</span>
          </div>
          <div className="text-[10px] text-gray-400">{p.unit} · {p.compound}</div>
          <div className="text-[10px] font-bold text-gray-700 mt-1">{p.price}</div>
        </div>
      ))}
      <div className="border border-dashed border-gray-200 rounded-lg p-2.5 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
        <span className="text-xs font-semibold text-gray-400">+5 more</span>
      </div>
    </div>
  </div>
);

export const PENDING_CONFIRMATION_HEADER_DESIGNS = [
  { id: 1, name: "Warm Amber Banner", Component: Design1 },
  { id: 2, name: "Minimal Top Bar", Component: Design2 },
  { id: 3, name: "Card Grid with Badge", Component: Design3 },
  { id: 4, name: "Yellow Left Accent Alert", Component: Design4 },
  { id: 5, name: "Stacked Avatars", Component: Design5 },
  { id: 6, name: "Dark Compact Bar", Component: Design6 },
  { id: 7, name: "Pill-style Inline", Component: Design7 },
  { id: 8, name: "Two-tone Split", Component: Design8 },
  { id: 9, name: "Notification with Badge", Component: Design9 },
  { id: 10, name: "Clean Progress Grid", Component: Design10 },
];
