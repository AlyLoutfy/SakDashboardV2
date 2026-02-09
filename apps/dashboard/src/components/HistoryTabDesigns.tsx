import { ArrowRight, GitCommit, MessageSquare, ChevronRight, Clock, Calendar, User, Check, X, FileText, Activity, AlertCircle } from "lucide-react";

// Mock Data
const mockHistory = [
  {
    id: 1,
    user: { name: "Lina Mousa", initials: "LM", color: "bg-purple-100 text-purple-600", avatar: null },
    action: "Create Unit-Reservation",
    date: "04-02-2026",
    time: "02:30 PM",
    changes: [
      { field: "Lead Client Name", from: "", to: "galal fathy" },
      { field: "Sales Person Full Name", from: "", to: "Raheem Mousa" },
      { field: "Serial Number", from: "", to: "4867" },
      { field: "Unit Name", from: "", to: "F-341-M" },
      { field: "Phone Number", from: "", to: "+201555500798" },
      { field: "Email", from: "", to: "N/A" },
    ],
  },
  {
    id: 2,
    user: { name: "System Admin", initials: "SA", color: "bg-gray-100 text-gray-600", avatar: null },
    action: "Status Update",
    date: "03-02-2026",
    time: "09:15 AM",
    changes: [{ field: "Status", from: "Draft", to: "Pending Approval" }],
  },
];

const BaseWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mx-auto max-w-2xl relative">
    <div className="absolute left-8 top-6 bottom-6 w-px bg-gray-200" />
    <div className="space-y-8 relative z-10">{children}</div>
  </div>
);

// 1. Pill Shaped (User's Favorite - Originally Design 9)
const Design1 = () => (
  <div className="mx-auto max-w-2xl space-y-6">
    {mockHistory.map((item) => (
      <div key={item.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative">
        <div className="flex gap-5">
          {/* Internal Left Column with Timeline */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${item.user.color} z-10 relative ring-4 ring-white`}>{item.user.initials}</div>
            {/* Internal Line */}
            <div className="w-0.5 bg-gray-100 h-full mt-2 rounded-full min-h-[100px]" />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-bold text-gray-900 text-sm block">{item.user.name}</span>
                <span className="text-gray-400 text-xs">performed action</span>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                {item.date} • {item.time}
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">{item.action}</h4>
              <div className="space-y-3">
                {item.changes.map((change, i) => (
                  <div key={i} className="text-xs text-gray-600 flex flex-col gap-1 border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                    <div className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">{change.field}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="bg-red-50 text-red-500 px-2 py-0.5 rounded line-through decoration-red-200">{change.from || "empty"}</div>
                      <ArrowRight size={10} className="text-gray-300" />
                      <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">{change.to}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 2. Wide Clean (Sharper edges, cleaner layout)
const Design2 = () => (
  <div className="mx-auto max-w-2xl space-y-4">
    {mockHistory.map((item) => (
      <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${item.user.color} flex items-center justify-center font-bold text-xs`}>{item.user.initials}</div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{item.user.name}</div>
              <div className="text-xs text-gray-500">{item.action}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-gray-900">{item.time}</div>
            <div className="text-[10px] text-gray-400">{item.date}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.changes.map((change, i) => (
            <div key={i} className="bg-gray-50 rounded p-2 text-xs">
              <div className="text-gray-500 font-medium mb-1">{change.field}</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-red-400 line-through text-[10px]">{change.from || "-"}</span>
                <ArrowRight size={10} className="text-gray-300" />
                <span className="font-bold text-gray-900">{change.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// 3. Panel Status (Left colored border)
const Design3 = () => (
  <div className="mx-auto max-w-2xl space-y-4">
    {mockHistory.map((item) => (
      <div key={item.id} className="bg-white rounded-r-xl border-y border-r border-gray-100 shadow-sm flex overflow-hidden">
        <div className="w-1.5 bg-blue-500" />
        <div className="flex-1 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-gray-900">{item.action}</span>
              <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">by {item.user.name}</span>
            </div>
            <div className="text-xs font-mono bg-gray-900 text-white px-2 py-1 rounded">
              {item.date} {item.time}
            </div>
          </div>
          <div className="space-y-2">
            {item.changes.map((change, i) => (
              <div key={i} className="flex text-xs border-b border-gray-50 last:border-0 pb-2 last:pb-0 items-center justify-between">
                <span className="text-gray-500 w-1/3">{change.field}</span>
                <div className="flex items-center gap-2 justify-end w-2/3">
                  <span className="text-gray-400 line-through">{change.from || "∅"}</span>
                  <span className="text-blue-500">➜</span>
                  <span className="font-bold text-gray-800">{change.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 4. Modern Grid Layout
const Design4 = () => (
  <div className="mx-auto max-w-2xl space-y-6">
    {mockHistory.map((item) => (
      <div key={item.id} className="relative">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-8 h-8 rounded-full ${item.user.color} flex items-center justify-center font-bold text-[10px]`}>{item.user.initials}</div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className="text-xs text-gray-500 font-bold">
            {item.date} • {item.time}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 ml-12 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={14} className="text-blue-500" />
            {item.action}
            <span className="text-xs font-normal text-gray-400 ml-auto">by {item.user.name}</span>
          </h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 text-left">
                  <th className="pb-2 font-medium w-1/3">Field</th>
                  <th className="pb-2 font-medium w-1/3">Old</th>
                  <th className="pb-2 font-medium w-1/3">New</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {item.changes.map((change, i) => (
                  <tr key={i}>
                    <td className="py-2 font-medium text-gray-600">{change.field}</td>
                    <td className="py-2 text-gray-400">{change.from || "-"}</td>
                    <td className="py-2 font-bold text-gray-900">{change.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 5. Timeline Nodes (Clean)
const Design5 = () => (
  <div className="mx-auto max-w-2xl relative pl-6">
    <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
    {mockHistory.map((item) => (
      <div key={item.id} className="relative mb-8 last:mb-0 group">
        <div className="absolute left-[-21px] top-1.5 w-3 h-3 bg-white border-2 border-gray-400 rounded-full group-hover:border-blue-500 transition-colors" />
        <div className="flex justify-between items-baseline mb-2">
          <h4 className="font-bold text-gray-900 text-sm">{item.action}</h4>
          <span className="text-xs text-gray-400">
            {item.time} {item.date}
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
            <User size={12} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600">{item.user.name}</span>
          </div>
          <div className="space-y-1">
            {item.changes.map((change, i) => (
              <div key={i} className="text-xs flex gap-2">
                <span className="text-gray-500">{change.field}:</span>
                <span className="text-gray-400 line-through">{change.from}</span>
                <span className="text-gray-900 font-bold">{change.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 6. Focus Card (Dark Mode Interior)
const Design6 = () => (
  <div className="mx-auto max-w-2xl space-y-6">
    {mockHistory.map((item) => (
      <div key={item.id} className="bg-gray-900 rounded-2xl p-1 shadow-lg">
        <div className="bg-gray-800 rounded-t-xl px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-[10px] text-white font-bold">{item.user.initials}</div>
            <span className="text-gray-200 text-sm font-bold">{item.user.name}</span>
          </div>
          <div className="text-gray-400 text-xs font-mono">{item.time}</div>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-900">{item.action}</h4>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">{item.date}</span>
          </div>
          <div className="space-y-2">
            {item.changes.map((change, i) => (
              <div key={i} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded border border-gray-100">
                <span className="text-gray-500 font-medium">{change.field}</span>
                <div className="flex gap-2">
                  <span className="text-red-300 line-through decoration-red-200">{change.from}</span>
                  <span className="text-gray-300">→</span>
                  <span className="font-bold text-gray-900">{change.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 7. Minimal Row (Spreadsheet Vibe)
const Design7 = () => (
  <div className="mx-auto max-w-2xl border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
    {mockHistory.map((item, idx) => (
      <div key={item.id} className={`p-5 ${idx !== 0 ? "border-t border-gray-200" : ""}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{item.action}</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">{item.user.name}</span>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            {item.date} {item.time}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.changes.map((change, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
              <span className="text-gray-500">{change.field}</span>
              {change.from && <span className="text-gray-400 line-through text-[10px]">{change.from}</span>}
              <ArrowRight size={10} className="text-gray-300" />
              <span className="font-bold text-gray-800">{change.to}</span>
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// 8. Connecting Threads
const Design8 = () => (
  <div className="mx-auto max-w-2xl space-y-2">
    {mockHistory.map((item) => (
      <div key={item.id} className="group flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-gray-200 group-first:bg-transparent" />
          <div className="w-2 h-2 rounded-full bg-blue-300 ring-4 ring-white" />
          <div className="w-px h-full bg-gray-200" />
        </div>
        <div className="flex-1 pb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">{item.user.name}</span>
                <span className="text-xs text-gray-400">changed</span>
                <span className="font-bold text-gray-800 text-xs bg-gray-100 px-1.5 py-0.5 rounded">{item.action}</span>
              </div>
              <span className="text-[10px] text-gray-400">
                {item.date} • {item.time}
              </span>
            </div>
            <div className="mt-3 grid gap-1">
              {item.changes.map((change, i) => (
                <div key={i} className="text-xs grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                  <span className="text-right text-gray-500 truncate">{change.field}</span>
                  <ArrowRight size={10} className="text-gray-300" />
                  <div className="flex items-center gap-2">
                    <span className="text-red-300 line-through decoration-red-200 text-[10px]">{change.from}</span>
                    <span className="font-bold text-emerald-600">{change.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 9. Floating Islands (Subtle)
const Design9 = () => (
  <div className="mx-auto max-w-2xl space-y-8">
    {mockHistory.map((item) => (
      <div key={item.id} className="relative">
        <div className="absolute top-4 left-0 right-0 h-px bg-gray-100 -z-10" />
        <div className="flex justify-center mb-4">
          <span className="bg-white px-3 text-xs font-bold text-gray-400 border border-gray-100 rounded-full py-1 shadow-sm">
            {item.date} at {item.time}
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm max-w-xl mx-auto text-center">
          <div className="flex flex-col items-center mb-4">
            <div className={`w-10 h-10 rounded-full ${item.user.color} flex items-center justify-center font-bold text-xs mb-2`}>{item.user.initials}</div>
            <div className="font-bold text-gray-900">{item.user.name}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{item.action}</div>
          </div>
          <div className="text-left bg-gray-50 rounded-lg p-3 inline-block w-full">
            {item.changes.map((change, i) => (
              <div key={i} className="flex justify-between py-1 text-xs border-b border-gray-200/50 last:border-0">
                <span className="text-gray-500">{change.field}</span>
                <span className="font-bold text-gray-900">
                  {change.to} <span className="font-normal text-gray-400 line-through ml-1">{change.from}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 10. Gradient Border
const Design10 = () => (
  <div className="mx-auto max-w-2xl space-y-5">
    {mockHistory.map((item) => (
      <div key={item.id} className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-gray-200 to-gray-200 hover:from-blue-400 hover:to-purple-400 transition-all">
        <div className="bg-white rounded-[15px] p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <h4 className="font-bold text-gray-900 text-sm">{item.action}</h4>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-gray-900">{item.time}</span>
              <span className="text-[10px] text-gray-400">{item.user.name}</span>
            </div>
          </div>
          <div className="space-y-2">
            {item.changes.map((change, i) => (
              <div key={i} className="bg-gray-50 px-3 py-2 rounded-lg flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600">{change.field}</span>
                <div className="flex gap-2 text-right">
                  <div className="text-gray-400 line-through">{change.from || "—"}</div>
                  <div className="text-black font-bold">{change.to}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 11. Folder Tab Style
const Design11 = () => (
  <div className="mx-auto max-w-2xl space-y-2">
    {mockHistory.map((item) => (
      <div key={item.id}>
        <div className="flex items-center justify-between px-4">
          <div className="bg-gray-100 rounded-t-lg px-4 py-1 text-xs font-bold text-gray-600 border-t border-x border-gray-200 inline-block translate-y-px">
            {item.date} {item.time}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-5 shadow-sm relative z-10">
          <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.user.color} flex items-center justify-center font-bold text-xs`}>{item.user.initials}</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{item.action}</div>
                <div className="text-xs text-gray-500">by {item.user.name}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {item.changes.map((change, i) => (
              <div key={i} className="flex text-xs group">
                <div className="w-1/3 text-gray-500 font-medium py-1">{change.field}</div>
                <div className="w-2/3 pl-4 border-l border-gray-100 py-1 flex gap-2">
                  <span className="text-red-400 line-through opacity-50">{change.from}</span>
                  <span className="text-gray-300">→</span>
                  <span className="text-gray-900 font-bold">{change.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const HISTORY_TAB_DESIGNS = [
  { id: 1, name: "Pill Shaped (Winner)", Component: Design1 },
  { id: 2, name: "Wide Clean", Component: Design2 },
  { id: 3, name: "Panel Status", Component: Design3 },
  { id: 4, name: "Modern Grid", Component: Design4 },
  { id: 5, name: "Timeline Nodes", Component: Design5 },
  { id: 6, name: "Focus Card (Dark)", Component: Design6 },
  { id: 7, name: "Minimal Row", Component: Design7 },
  { id: 8, name: "Connecting Threads", Component: Design8 },
  { id: 9, name: "Floating Islands", Component: Design9 },
  { id: 10, name: "Gradient Border", Component: Design10 },
  { id: 11, name: "Folder Tab", Component: Design11 },
];
