import React, { useState } from "react";
import { User, Clock, Building2, CreditCard, FileText, ArrowRight, LayoutGrid, Calendar, Home, Layers, Box } from "lucide-react";

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_UNIT = {
  id: "F-336-M",
  price: "3,116,000",
  compound: "C9",
  type: "Medical",
  phase: "Phase 1",
  bua: "41",
  floor: "Third",
  garden: "—",
  status: "Reserved",
  paymentPlan: { name: "1% monthly 8 years", type: "Custom", dp: "1%", years: 8 },
  history: [
    { id: 1, date: "Today, 2:30 PM", action: "Status Change", from: "Hold", to: "Reserved", user: "Alaa Samir" },
    { id: 2, date: "Feb 1, 10:00 AM", action: "Reservation Created", from: null, to: null, user: "Raheem Moussa" },
    { id: 3, date: "Jan 28, 4:15 PM", action: "Status Change", from: "Available", to: "Hold", user: "Mariam Hossam" },
  ],
  reservation: {
    client: "Ahmed Soliman",
    phone: "+201030189609",
    date: "01/02/2026",
    amount: "31,160",
    contract: "3,116,000",
    sales: "Raheem Moussa",
  },
};

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
    <Icon size={14} className="text-gray-400" />
    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
  </div>
);

const Field = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between items-baseline mb-1.5 last:mb-0">
    <span className="text-[11px] text-gray-500">{label}</span>
    <span className={`text-xs font-semibold ${highlight ? "text-emerald-700 bg-emerald-50 px-1 rounded" : "text-gray-900"}`}>{value}</span>
  </div>
);

// =============================================================================
// DESIGN 1: DENSE SPLIT (Classic)
// =============================================================================
// A clean, high-density split view with bordered sections.

const Design1 = () => {
  return (
    <div className="w-full h-[600px] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">{MOCK_UNIT.id}</h2>
          <div className="flex gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">
            <span>{MOCK_UNIT.compound}</span> • <span>{MOCK_UNIT.phase}</span> • <span className="text-emerald-600 font-bold">{MOCK_UNIT.status}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900">{MOCK_UNIT.price} EGP</div>
          <div className="text-[10px] text-gray-500">Total Price</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Details */}
        <div className="w-2/3 p-5 overflow-y-auto border-r border-gray-100 space-y-6">
          {/* Property Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <SectionHeader icon={Building2} title="Unit Details" />
              <div className="space-y-0.5">
                <Field label="Type" value={MOCK_UNIT.type} />
                <Field label="BUA" value={MOCK_UNIT.bua + " m²"} />
                <Field label="Floor" value={MOCK_UNIT.floor} />
                <Field label="Garden" value={MOCK_UNIT.garden} />
              </div>
            </div>
            <div>
              <SectionHeader icon={CreditCard} title="Payment Plan" />
              <div className="space-y-0.5">
                <Field label="Plan" value={MOCK_UNIT.paymentPlan.name} />
                <Field label="Type" value={MOCK_UNIT.paymentPlan.type} />
                <Field label="Down Payment" value={MOCK_UNIT.paymentPlan.dp} />
                <Field label="Years" value={MOCK_UNIT.paymentPlan.years + " Years"} />
              </div>
            </div>
          </div>

          {/* Reservation Info */}
          <div>
            <SectionHeader icon={FileText} title="Active Reservation" />
            <div className="bg-blue-50/30 rounded-lg p-3 border border-blue-100">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <Field label="Client" value={MOCK_UNIT.reservation.client} />
                <Field label="Phone" value={MOCK_UNIT.reservation.phone} />
                <Field label="Salesperson" value={MOCK_UNIT.reservation.sales} />
                <Field label="Date" value={MOCK_UNIT.reservation.date} />
                <div className="col-span-2 border-t border-blue-200 mt-1 pt-2 flex justify-between">
                  <span className="text-[10px] text-blue-600 font-medium">Paid Amount</span>
                  <span className="text-sm font-bold text-blue-900">{MOCK_UNIT.reservation.amount} EGP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: History */}
        <div className="w-1/3 bg-gray-50/50 p-5 overflow-y-auto">
          <SectionHeader icon={Clock} title="History Log" />
          <div className="space-y-4">
            {MOCK_UNIT.history.map((h, i) => (
              <div key={i} className="relative pl-4 border-l-2 border-gray-200 pb-1">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-400 border-2 border-white ring-1 ring-gray-100"></div>
                <div className="mb-0.5 flex justify-between items-start">
                  <span className="text-[10px] text-gray-400 font-medium">{h.date}</span>
                </div>
                <p className="text-xs font-bold text-gray-800 mb-0.5">{h.action}</p>
                <p className="text-[10px] text-gray-500">by {h.user}</p>
                {h.from && (
                  <div className="mt-1.5 text-[10px] bg-white border border-gray-200 p-1.5 rounded flex items-center gap-1.5 w-fit">
                    <span className="text-gray-400 line-through">{h.from}</span>
                    <ArrowRight size={8} className="text-gray-300" />
                    <span className="text-emerald-600 font-bold">{h.to}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DESIGN 2: TABBED COMPACT (Modern)
// =============================================================================
// Saves vertical space by using tabs. Very clean.

const Design2 = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div className="w-full h-[500px] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{MOCK_UNIT.id}</h2>
          <div className="text-[10px] text-gray-400 font-medium">
            {MOCK_UNIT.compound} / {MOCK_UNIT.type}
          </div>
        </div>
        <div className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{MOCK_UNIT.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {["overview", "finance", "history"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${tab === t ? "bg-white text-gray-900 border-b-2 border-orange-500 mb-[-1px]" : "text-gray-400 hover:text-gray-600"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {tab === "overview" && (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home size={16} className="text-orange-500" /> Specs
              </h3>
              <div className="space-y-2">
                {[
                  { l: "Type", v: MOCK_UNIT.type },
                  { l: "Phase", v: MOCK_UNIT.phase },
                  { l: "Area", v: MOCK_UNIT.bua + " m²" },
                  { l: "Floor", v: MOCK_UNIT.floor },
                  { l: "Garden", v: MOCK_UNIT.garden },
                ].map((f, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">{f.l}</span>
                    <span className="text-xs font-bold text-gray-800">{f.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={16} className="text-orange-500" /> Current Holder
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-xs text-gray-400 mb-1">Reservation Holder</div>
                <div className="text-sm font-bold text-gray-900 mb-4">{MOCK_UNIT.reservation.client}</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Phone</span>
                    <span className="font-semibold">{MOCK_UNIT.reservation.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Sales</span>
                    <span className="font-semibold">{MOCK_UNIT.reservation.sales}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "finance" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-2">Total Contract</div>
              <div className="text-2xl font-bold text-emerald-900">
                {MOCK_UNIT.price} <span className="text-sm font-normal text-emerald-700">EGP</span>
              </div>
              <div className="mt-6 space-y-2">
                <Field label="Reservation Paid" value={MOCK_UNIT.reservation.amount + " EGP"} />
                <Field label="Contract Value" value={MOCK_UNIT.reservation.contract + " EGP"} />
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Selected Plan</h4>
              <div className="text-sm font-bold text-gray-900 mb-1">{MOCK_UNIT.paymentPlan.name}</div>
              <div className="text-xs text-gray-500 mb-4">{MOCK_UNIT.paymentPlan.type}</div>
              <div className="flex gap-4">
                <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-semibold">{MOCK_UNIT.paymentPlan.dp} DP</div>
                <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-semibold">{MOCK_UNIT.paymentPlan.years} Years</div>
              </div>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="max-w-xl mx-auto">
            {MOCK_UNIT.history.map((h, i) => (
              <div key={i} className="flex gap-4 mb-6">
                <div className="text-[10px] text-gray-400 font-mono w-20 pt-1 text-right">{h.date.split(",")[0]}</div>
                <div className="flex-1 pb-6 border-b border-gray-50 last:border-0 last:pb-0 relative">
                  <div className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-orange-400"></div>
                  <div className="text-xs font-bold text-gray-900">{h.action}</div>
                  <div className="text-[11px] text-gray-500">by {h.user}</div>
                  {h.from && (
                    <div className="text-[10px] text-gray-400 mt-1">
                      {h.from} → {h.to}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// DESIGN 3: SIDEBAR NAV (App Style)
// =============================================================================
// Fixed sidebar for key info, scrollable content area.

const Design3 = () => {
  return (
    <div className="w-full h-[550px] bg-white border border-gray-200 rounded-xl shadow-xl flex font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[200px] bg-gray-50 border-r border-gray-200 flex flex-col p-4">
        <div className="mb-6">
          <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-900 shadow-sm mb-3">{MOCK_UNIT.id.split("-")[1]}</div>
          <div className="text-sm font-bold text-gray-900">{MOCK_UNIT.id}</div>
          <div className="text-[10px] text-gray-500">{MOCK_UNIT.compound}</div>
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm text-xs font-bold text-gray-800 border-l-2 border-black">
            <LayoutGrid size={14} /> Overview
          </div>
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
            <CreditCard size={14} /> Financials
          </div>
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Layers size={14} /> History
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">Status</div>
          <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded text-center">{MOCK_UNIT.status}</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Overview</h3>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { l: "Unit Type", v: MOCK_UNIT.type, i: Home },
            { l: "Built Area", v: MOCK_UNIT.bua + " m²", i: Box },
            { l: "Garden", v: MOCK_UNIT.garden, i: Building2 },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <stat.i size={14} className="text-gray-400 mb-2" />
              <div className="text-[10px] text-gray-500">{stat.l}</div>
              <div className="text-sm font-bold text-gray-900">{stat.v}</div>
            </div>
          ))}
        </div>

        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">Current Activity</h4>

        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">AS</div>
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-bold text-gray-900">{MOCK_UNIT.reservation.client}</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">Active Reservation</span>
            </div>
            <div className="text-xs text-gray-500 mb-2">{MOCK_UNIT.reservation.phone}</div>
            <div className="flex gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar size={10} /> {MOCK_UNIT.reservation.date}
              </span>
              <span className="flex items-center gap-1">
                <User size={10} /> {MOCK_UNIT.reservation.sales}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DESIGN 4: DATA GRID (Spec Sheet)
// =============================================================================
// Ultra high density, table-like display for maximum data visibility.

const Design4 = () => {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex border-b border-gray-200 last:border-0 text-xs">
      <div className="w-1/3 bg-gray-50 p-2 font-medium text-gray-500 border-r border-gray-200">{label}</div>
      <div className="flex-1 p-2 font-semibold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="w-full h-[600px] bg-white border border-gray-800 rounded-lg shadow-xl flex flex-col font-mono text-sm overflow-hidden">
      <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
        <div className="font-bold flex gap-4">
          <span>
            ID: <span className="text-emerald-400">{MOCK_UNIT.id}</span>
          </span>
          <span className="text-gray-500">|</span>
          <span>CMP: {MOCK_UNIT.compound}</span>
          <span className="text-gray-500">|</span>
          <span>STS: {MOCK_UNIT.status}</span>
        </div>
        <div className="text-xs text-gray-400">UNIT_DETAILS_V2.0</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r border-gray-200">
          <div className="bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-500 uppercase">Property Specification</div>
          <div className="border-b border-gray-200">
            <Row label="Type" value={MOCK_UNIT.type} />
            <Row label="Phase" value={MOCK_UNIT.phase} />
            <Row label="Building Area" value={MOCK_UNIT.bua + " m²"} />
            <Row label="Floor Level" value={MOCK_UNIT.floor} />
            <Row label="Garden Area" value={MOCK_UNIT.garden} />
            <Row label="List Price" value={MOCK_UNIT.price + " EGP"} />
          </div>

          <div className="bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-500 uppercase mt-4">Reservation Data</div>
          <div className="border-b border-gray-200">
            <Row label="Client Name" value={MOCK_UNIT.reservation.client} />
            <Row label="Contact" value={MOCK_UNIT.reservation.phone} />
            <Row label="Sales Agent" value={MOCK_UNIT.reservation.sales} />
            <Row label="Booking Amount" value={MOCK_UNIT.reservation.amount} />
          </div>
        </div>

        <div className="w-1/2 overflow-y-auto bg-gray-50">
          <div className="p-4 space-y-4">
            {MOCK_UNIT.history.map((h, i) => (
              <div key={i} className="flex gap-3 text-xs font-sans">
                <div className="text-gray-500 w-16 text-right shrink-0 leading-tight">
                  {h.date.split(",")[0]}
                  <br />
                  <span className="text-[10px]">{h.date.split(",")[1]}</span>
                </div>
                <div className="flex-1 bg-white border border-gray-300 p-2 rounded shadow-sm">
                  <div className="font-bold text-gray-900">{h.action}</div>
                  <div className="text-[10px] text-gray-500">User: {h.user}</div>
                  {h.from && (
                    <div className="mt-1 text-xs border-t border-gray-100 pt-1 font-mono">
                      {h.from} &gt; {h.to}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DESIGN 5: DASHBOARD CARDS (Floating)
// =============================================================================
// Uses a gray background with floating white cards for distinct data separation.

const Design5 = () => {
  return (
    <div className="w-full h-[600px] bg-slate-100 border border-slate-200 rounded-xl shadow-xl p-6 font-sans overflow-y-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">{MOCK_UNIT.id}</h2>
          <p className="text-slate-500 text-sm font-medium">
            {MOCK_UNIT.compound}, {MOCK_UNIT.phase}
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {MOCK_UNIT.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Card 1: Unit Specs */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 col-span-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Specs & Price</h3>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {MOCK_UNIT.bua}
                <span className="text-sm text-slate-400 font-medium">m²</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Area</div>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{MOCK_UNIT.type}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Type</div>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{MOCK_UNIT.floor}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Level</div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs font-medium text-slate-600">Total Price</span>
            <span className="text-lg font-bold text-slate-900">{MOCK_UNIT.price} EGP</span>
          </div>
        </div>

        {/* Card 2: Quick History */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 row-span-2 overflow-hidden flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Timeline</h3>
          <div className="space-y-6 relative flex-1 overflow-y-auto pr-2">
            <div className="absolute top-2 bottom-0 left-[7px] w-0.5 bg-slate-100" />
            {MOCK_UNIT.history.map((h, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${i === 0 ? "bg-emerald-500" : "bg-slate-300"}`} />
                <div className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{h.action}</div>
                <div className="text-[10px] text-slate-500 mb-1">{h.date.split(",")[0]}</div>
                <div className="text-[10px] text-slate-400">by {h.user.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Reservation */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Reservation</h3>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-100">CONFIRMED</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">AS</div>
            <div>
              <div className="text-sm font-bold text-slate-900">{MOCK_UNIT.reservation.client}</div>
              <div className="text-xs text-slate-500">{MOCK_UNIT.reservation.phone}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-slate-400 font-medium">Salesperson</div>
              <div className="text-xs font-bold text-slate-900">{MOCK_UNIT.reservation.sales}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UNIT_DRAWER_DESIGNS = [
  { id: 1, name: "Dense Split", Component: Design1 },
  { id: 2, name: "Tabbed Compact", Component: Design2 },
  { id: 3, name: "Sidebar Nav", Component: Design3 },
  { id: 4, name: "Data Grid", Component: Design4 },
  { id: 5, name: "Dashboard Cards", Component: Design5 },
];
