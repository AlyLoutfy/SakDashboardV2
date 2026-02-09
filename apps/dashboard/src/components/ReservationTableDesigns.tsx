import React from "react";
import { Check, X, MoreVertical, Clock, Building2, TrendingUp, ChevronRight } from "lucide-react";

// Mock Data
const MOCK_RESERVATIONS = [
  {
    id: "RES-2024-001",
    client: "Ahmed Hassan",
    unit: "A-102",
    compound: "Palm Hills",
    amount: "EGP 5,200,000",
    status: "pending",
    date: "2 hours ago",
    salesperson: "Sarah M.",
    avatar: "AH",
    currentStep: 2,
    totalSteps: 4,
    stepName: "Finance Review",
  },
  {
    id: "RES-2024-002",
    client: "Laila Mahmoud",
    unit: "B-205",
    compound: "Mountain View",
    amount: "EGP 8,450,000",
    status: "approved",
    date: "1 day ago",
    salesperson: "Karim T.",
    avatar: "LM",
    currentStep: 4,
    totalSteps: 4,
    stepName: "Completed",
  },
  {
    id: "RES-2024-003",
    client: "Tarek Zaki",
    unit: "C-304",
    compound: "Hyde Park",
    amount: "EGP 12,000,000",
    status: "rejected",
    date: "3 days ago",
    salesperson: "Youssef N.",
    avatar: "TZ",
    currentStep: 1,
    totalSteps: 4,
    stepName: "Manager Approval",
  },
  {
    id: "RES-2024-004",
    client: "Nour El-Sherif",
    unit: "V-11",
    compound: "Palm Hills",
    amount: "EGP 25,000,000",
    status: "pending",
    date: "5 mins ago",
    salesperson: "Sarah M.",
    avatar: "NS",
    currentStep: 0,
    totalSteps: 3,
    stepName: "Initial Review",
  },
];

// Helper for Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Design 1: Classic Corporate (Clean, Dense, Structured)
const Design1 = () => (
  <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
        <tr>
          <th className="px-4 py-3 font-medium">Reservation ID</th>
          <th className="px-4 py-3 font-medium">Client</th>
          <th className="px-4 py-3 font-medium">Unit</th>
          <th className="px-4 py-3 font-medium">Compound</th>
          <th className="px-4 py-3 font-medium w-32">Steps</th>
          <th className="px-4 py-3 font-medium text-center">Status</th>
          <th className="px-4 py-3 font-medium text-right">Amount</th>
          <th className="px-4 py-3 font-medium text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {MOCK_RESERVATIONS.map((res) => (
          <tr key={res.id} className="hover:bg-gray-50/80 transition-colors">
            <td className="px-4 py-3 font-medium text-gray-900">{res.id}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">{res.avatar}</div>
                <span className="text-gray-700">{res.client}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-gray-600">{res.unit}</td>
            <td className="px-4 py-3 text-gray-500">{res.compound}</td>
            <td className="px-4 py-3">
              <div className="flex flex-col gap-1 w-24">
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>
                    {res.currentStep}/{res.totalSteps}
                  </span>
                  <span>{Math.round((res.currentStep / res.totalSteps) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${res.status === "approved" ? "bg-emerald-500" : res.status === "rejected" ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${(res.currentStep / res.totalSteps) * 100}%` }} />
                </div>
                <span className="text-[9px] text-gray-400 truncate">{res.stepName}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-center">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(res.status)}`}>{res.status.charAt(0).toUpperCase() + res.status.slice(1)}</span>
            </td>
            <td className="px-4 py-3 text-right font-medium text-gray-900">{res.amount}</td>
            <td className="px-4 py-3 text-center">
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Design 2: Modern Glass (Floating rows, soft shadows, gradient accents)
const Design2 = () => (
  <div className="w-full p-4 bg-gray-50 rounded-xl space-y-3">
    {/* Header */}
    <div className="grid grid-cols-6 gap-4 px-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider pl-12">
      <div className="col-span-1">Details</div>
      <div className="col-span-1">Client</div>
      <div className="col-span-1">Unit</div>
      <div className="col-span-1 text-center">Status</div>
      <div className="col-span-1 text-right">Value</div>
      <div className="col-span-1 text-right">Activity</div>
    </div>

    {/* Rows */}
    {MOCK_RESERVATIONS.map((res) => (
      <div key={res.id} className="group relative bg-white hover:bg-white/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-blue-100">
        {/* Status Stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${res.status === "approved" ? "bg-emerald-400" : res.status === "rejected" ? "bg-red-400" : "bg-amber-400"}`} />

        <div className="grid grid-cols-6 gap-4 items-center pl-8">
          {/* ID & Date */}
          <div className="col-span-1">
            <p className="font-bold text-gray-900">{res.id}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <Clock size={10} />
              {res.date}
            </div>
          </div>

          {/* Client */}
          <div className="col-span-1 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{res.avatar}</div>
            <div>
              <p className="text-sm font-medium text-gray-900">{res.client}</p>
              <p className="text-xs text-gray-400">{res.salesperson}</p>
            </div>
          </div>

          {/* Unit */}
          <div className="col-span-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-md text-sm text-gray-700 font-medium">
              <Building2 size={12} className="text-gray-400" />
              {res.unit}
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-1">{res.compound}</p>
          </div>

          {/* Status */}
          <div className="col-span-1 flex justify-center">
            {res.status === "pending" ? (
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? "bg-amber-400" : "bg-gray-200"} animate-pulse`} />
                ))}
              </div>
            ) : res.status === "approved" ? (
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Check size={16} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <X size={16} />
              </div>
            )}
          </div>

          {/* Value */}
          <div className="col-span-1 text-right">
            <p className="font-bold text-gray-900">{res.amount}</p>
            <p className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
              <TrendingUp size={10} />
              Confirmed
            </p>
          </div>

          {/* Action */}
          <div className="col-span-1 text-right">
            <button className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-gray-900/20 transform hover:scale-105 active:scale-95">Review</button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Design 3: Kanban Board (Visual Pipeline)
const Design3 = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full bg-slate-50 p-6 rounded-2xl border border-slate-200">
    {/* Columns */}
    {[
      { title: "Pending Review", count: 2, color: "bg-amber-500", items: MOCK_RESERVATIONS.filter((r) => r.status === "pending") },
      { title: "Approved", count: 1, color: "bg-emerald-500", items: MOCK_RESERVATIONS.filter((r) => r.status === "approved") },
      { title: "Rejected", count: 1, color: "bg-red-500", items: MOCK_RESERVATIONS.filter((r) => r.status === "rejected") },
    ].map((col) => (
      <div key={col.title} className="flex flex-col gap-4">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-gray-200">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${col.color}`} />
            <h3 className="font-bold text-gray-700 text-sm">{col.title}</h3>
          </div>
          <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold text-gray-400 shadow-sm border border-gray-100">{col.count}</span>
        </div>

        {/* Cards */}
        {col.items.map((res) => (
          <div key={res.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{res.id}</span>
              <button className="text-gray-300 hover:text-gray-600">
                <MoreVertical size={14} />
              </button>
            </div>

            <h4 className="font-bold text-gray-900 mb-1">{res.unit}</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Building2 size={10} />
              {res.compound}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-[8px] font-bold">{res.avatar}</div>
                <span className="text-xs font-medium text-gray-600">{res.client.split(" ")[0]}</span>
              </div>
              <div className="text-xs font-bold text-gray-900">{res.amount.replace("EGP", "")}</div>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium hover:border-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
          <span className="text-lg">+</span> Add New
        </button>
      </div>
    ))}
  </div>
);

// Design 4: Minimalist & Data-Rich (High density, clean typography)
const Design4 = () => (
  <div className="w-full">
    <div className="border-b border-black mb-4 pb-2 flex justify-between items-end">
      <h3 className="text-2xl font-light text-black tracking-tight">Recent Reservations</h3>
      <span className="text-sm text-gray-500 font-medium">Sort by: Date ↓</span>
    </div>

    <div className="space-y-1">
      {MOCK_RESERVATIONS.map((res) => (
        <div key={res.id} className="group grid grid-cols-12 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center px-2">
          <div className="col-span-2 font-mono text-xs text-gray-500">{res.id}</div>
          <div className="col-span-3 font-medium text-gray-900">{res.client}</div>
          <div className="col-span-2">
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold">{res.unit}</span>
          </div>
          <div className="col-span-2 text-right font-medium text-gray-900">{res.amount}</div>
          <div className="col-span-2 text-center">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${res.status === "approved" ? "text-emerald-500" : res.status === "rejected" ? "text-red-500" : "text-amber-500"}`}>{res.status}</span>
          </div>
          <div className="col-span-1 text-right">
            <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const RESERVATION_TABLE_DESIGNS = [
  { id: 1, name: "Corporate Classic", Component: Design1 },
  { id: 2, name: "Modern Glass Cards", Component: Design2 },
  { id: 3, name: "Vertical Kanban", Component: Design3 },
  { id: 4, name: "Swiss Minimalist", Component: Design4 },
];
