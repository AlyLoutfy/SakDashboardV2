import React, { useState } from "react";
import { Calendar, Layers, Plus, Trash2, ChevronDown, ChevronRight, ArrowRight, TrendingDown, TrendingUp, X, Percent, DollarSign, Check, Edit3, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types & Utilities ──────────────────────────────────────────────

interface Inst {
  id: string;
  name: string;
  amount: number | null;
  percentage: number | null;
  dueDate: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

const addM = (d: string, m: number): string => {
  const [y, mo, day] = d.split("-").map(Number);
  let ny = y,
    nm = mo + m;
  while (nm > 12) {
    nm -= 12;
    ny++;
  }
  while (nm < 1) {
    nm += 12;
    ny--;
  }
  const dim = new Date(ny, nm, 0).getDate();
  return `${ny}-${String(nm).padStart(2, "0")}-${String(Math.min(day, dim)).padStart(2, "0")}`;
};

const today = () => new Date().toISOString().split("T")[0];
const PRICE = 3600000;

const SEED: Inst[] = [
  { id: "1", name: "Down Payment", amount: null, percentage: 10, dueDate: "2026-03-01" },
  { id: "2", name: "Installment 1", amount: null, percentage: 5, dueDate: "2026-06-01" },
  { id: "3", name: "Installment 2", amount: 100000, percentage: null, dueDate: "2026-09-01" },
];

const useLogic = (seed = SEED) => {
  const [insts, setInsts] = useState<Inst[]>(seed);
  const [adj, setAdj] = useState(0);
  const [gap, setGap] = useState(3);
  const eff = PRICE * (1 + adj / 100);
  const diff = eff - PRICE;
  const totPct = insts.reduce((s, i) => s + (i.percentage || 0), 0);
  const totAmt = insts.reduce((s, i) => {
    if (i.amount) return s + i.amount;
    if (i.percentage) return s + (eff * i.percentage) / 100;
    return s;
  }, 0);
  const valid = Math.abs(totPct - 100) < 0.1;
  const instAmt = (i: Inst) => (i.percentage ? (eff * i.percentage) / 100 : i.amount || 0);
  const upd = (id: string, u: Partial<Inst>) =>
    setInsts((p) =>
      p.map((i) => {
        if (i.id !== id) return i;
        const n = { ...i, ...u };
        if (u.percentage !== undefined) n.amount = null;
        if (u.amount !== undefined) n.percentage = null;
        return n;
      }),
    );
  const del = (id: string) => setInsts((p) => p.filter((i) => i.id !== id));
  const addOne = () => {
    const last = insts[insts.length - 1]?.dueDate || today();
    setInsts((p) => [...p, { id: Date.now().toString(), name: `Installment ${p.length}`, amount: null, percentage: 5, dueDate: addM(last, gap) }]);
  };
  const bulkAdd = (count: number, pct: number, freqM: number, gapM: number) => {
    const last = insts[insts.length - 1]?.dueDate || today();
    let cur = addM(last, gapM);
    const news: Inst[] = [];
    for (let i = 0; i < count; i++) {
      news.push({ id: `b-${Date.now()}-${i}`, name: `Installment ${insts.length + i + 1}`, amount: null, percentage: pct, dueDate: cur });
      cur = addM(cur, freqM);
    }
    setInsts((p) => [...p, ...news]);
  };
  return { insts, setInsts, adj, setAdj, eff, diff, totPct, totAmt, valid, instAmt, upd, del, addOne, bulkAdd, gap, setGap, price: PRICE };
};

// ── Shared: Price Adjustment ───────────────────────────────────────

const PriceAdj = ({ adj, setAdj, price, eff, diff }: { adj: number; setAdj: (v: number) => void; price: number; eff: number; diff: number }) => {
  const disc = adj < 0,
    has = adj !== 0;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 overflow-hidden">
      <div className="px-3 py-2 flex items-center gap-2">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide shrink-0">Adjust Price</label>
        <div className="relative flex-1 max-w-[100px]">
          <input type="number" value={adj || ""} onChange={(e) => setAdj(e.target.value === "" ? 0 : parseFloat(e.target.value))} placeholder="0" className="w-full py-1 pl-2 pr-5 bg-white border border-slate-200 rounded-md outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-300 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 pointer-events-none">%</span>
        </div>
        {has && (
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 ${disc ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
            {disc ? <TrendingDown size={9} /> : <TrendingUp size={9} />} {disc ? "Discount" : "Premium"}
          </span>
        )}
      </div>
      <AnimatePresence>
        {has && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className={`px-3 py-1.5 border-t flex items-center gap-2 text-xs ${disc ? "border-emerald-100 bg-emerald-50/60" : "border-blue-100 bg-blue-50/60"}`}>
              <span className="font-bold text-slate-400 line-through tabular-nums">{fmt(price)}</span>
              <ArrowRight size={10} className={disc ? "text-emerald-400" : "text-blue-400"} />
              <span className={`font-extrabold tabular-nums ${disc ? "text-emerald-700" : "text-blue-700"}`}>{fmt(eff)}</span>
              <span className={`ml-auto text-[10px] font-bold tabular-nums ${disc ? "text-emerald-600" : "text-blue-600"}`}>
                {disc ? "−" : "+"}
                {fmt(Math.abs(diff))}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Shared: Total Footer ───────────────────────────────────────────

const TotalFooter = ({ totPct, totAmt, valid }: { totPct: number; totAmt: number; valid: boolean }) => (
  <div className={`px-5 py-3 border-t-2 flex items-center justify-between ${valid ? "border-blue-500 bg-blue-50" : "border-amber-500 bg-amber-50"}`}>
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${valid ? "text-blue-700" : "text-amber-700"}`}>Total</p>
      {!valid && <p className="text-[9px] text-amber-600 mt-0.5">Total should equal 100%</p>}
    </div>
    <div className="text-right">
      <p className={`text-base font-bold ${valid ? "text-blue-700" : "text-amber-700"}`}>{totPct}%</p>
      <p className="text-xs text-slate-600 tabular-nums">{fmt(totAmt)}</p>
    </div>
  </div>
);

const NumInput = ({ label, value, onChange, placeholder, suffix, className = "" }: { label?: string; value: any; onChange: (v: string) => void; placeholder: string; suffix?: string; className?: string }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>}
    <div className="relative">
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={suffix ? { paddingRight: 28 } : {}} />
      {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium pointer-events-none">{suffix}</span>}
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════
// DESIGN 1: "Labeled Form Cards"
// Each installment is a full form card with labeled inputs.
// % vs Fixed is a clear segmented tab control per card.
// ════════════════════════════════════════════════════════════════════

const Design1 = () => {
  const L = useLogic();
  const [bulkOpen, setBulkOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="p-4 border-b border-slate-100">
        <div className="w-full px-3 py-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-sm font-medium text-slate-800 cursor-pointer hover:border-slate-300">
          Custom Plan <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <PriceAdj adj={L.adj} setAdj={L.setAdj} price={L.price} eff={L.eff} diff={L.diff} />

        {/* Installment cards */}
        <div className="space-y-3">
          {L.insts.map((inst) => {
            const mode: "pct" | "fixed" = inst.percentage !== null ? "pct" : "fixed";
            return (
              <div key={inst.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
                  <input type="text" value={inst.name} onChange={(e) => L.upd(inst.id, { name: e.target.value })} className="font-semibold text-sm text-slate-800 bg-transparent border-none outline-none flex-1 mr-2" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 tabular-nums">{fmt(L.instAmt(inst))}</span>
                    <button onClick={() => L.del(inst.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* Card body */}
                <div className="p-3 grid grid-cols-2 gap-3">
                  {/* Due Date */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Due Date</label>
                    <input type="date" value={inst.dueDate} onChange={(e) => L.upd(inst.id, { dueDate: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500" />
                  </div>
                  {/* Value — segmented toggle */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Value</label>
                    <div className="flex items-stretch border border-slate-200 rounded-md overflow-hidden">
                      {/* % tab */}
                      <button
                        onClick={() => {
                          if (mode !== "pct") L.upd(inst.id, { percentage: 5, amount: null });
                        }}
                        className={`px-2 text-[10px] font-bold flex items-center gap-0.5 transition-colors ${mode === "pct" ? "bg-blue-50 text-blue-600 border-r border-blue-200" : "bg-white text-slate-400 border-r border-slate-200 hover:bg-slate-50"}`}
                      >
                        <Percent size={10} /> %
                      </button>
                      {mode === "pct" ? <input type="number" value={inst.percentage ?? ""} onChange={(e) => L.upd(inst.id, { percentage: parseFloat(e.target.value) || 0 })} className="flex-1 px-2 py-1.5 text-xs outline-none bg-blue-50/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="e.g. 10" /> : <input type="number" value={inst.amount ?? ""} onChange={(e) => L.upd(inst.id, { amount: parseFloat(e.target.value) || 0 })} className="flex-1 px-2 py-1.5 text-xs outline-none bg-emerald-50/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="e.g. 500000" />}
                      {/* Fixed tab */}
                      <button
                        onClick={() => {
                          if (mode !== "fixed") L.upd(inst.id, { amount: 0, percentage: null });
                        }}
                        className={`px-2 text-[10px] font-bold flex items-center gap-0.5 transition-colors ${mode === "fixed" ? "bg-emerald-50 text-emerald-600 border-l border-emerald-200" : "bg-white text-slate-400 border-l border-slate-200 hover:bg-slate-50"}`}
                      >
                        <DollarSign size={10} /> Fixed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add actions */}
        <div className="flex gap-2">
          <button onClick={L.addOne} className="flex-1 py-2.5 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5">
            <Plus size={14} /> Add Installment
          </button>
          <button onClick={() => setBulkOpen(!bulkOpen)} className={`flex-1 py-2.5 border rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${bulkOpen ? "border-blue-300 bg-blue-50 text-blue-600" : "border-dashed border-slate-300 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50"}`}>
            <Layers size={14} /> Bulk Generate
          </button>
        </div>

        {/* Inline gap control */}
        <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400">
          <span className="font-semibold uppercase">Default gap between installments:</span>
          <div className="flex items-center border border-slate-200 rounded overflow-hidden">
            <input type="number" value={L.gap} onChange={(e) => L.setGap(parseInt(e.target.value) || 1)} className="w-8 px-1 py-0.5 text-center text-[10px] border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="1" />
            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-bold border-l border-slate-200">mo</span>
          </div>
        </div>

        {/* Bulk generate panel */}
        <AnimatePresence>
          {bulkOpen && (
            <BulkSection
              onAdd={(c, p, f, g) => {
                L.bulkAdd(c, p, f, g);
                setBulkOpen(false);
              }}
              onClose={() => setBulkOpen(false)}
              hasExisting={L.insts.length > 0}
            />
          )}
        </AnimatePresence>
      </div>
      <TotalFooter totPct={L.totPct} totAmt={L.totAmt} valid={L.valid} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// DESIGN 2: "Generate-First"
// Primary flow: configure a bulk template → generate → then fine-tune.
// The generator is the HERO element, the schedule list is secondary.
// ════════════════════════════════════════════════════════════════════

const Design2 = () => {
  const L = useLogic([]);
  const [genCount, setGenCount] = useState<number | "">(12);
  const [genPct, setGenPct] = useState<number | "">(5);
  const [genFreq, setGenFreq] = useState<number | "">(3);
  const [genStart, setGenStart] = useState(today());
  const [genDP, setGenDP] = useState<number | "">(10);

  const generate = () => {
    const newInsts: Inst[] = [];
    // Down payment
    if (genDP && Number(genDP) > 0) {
      newInsts.push({ id: `dp-${Date.now()}`, name: "Down Payment", amount: null, percentage: Number(genDP), dueDate: genStart });
    }
    // Installments
    let cur = genStart;
    if (genCount && genPct && genFreq) {
      for (let i = 0; i < Number(genCount); i++) {
        cur = addM(cur, Number(genFreq));
        newInsts.push({ id: `g-${Date.now()}-${i}`, name: `Installment ${i + 1}`, amount: null, percentage: Number(genPct), dueDate: cur });
      }
    }
    L.setInsts(newInsts);
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b border-slate-100">
        <div className="w-full px-3 py-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-sm font-medium text-slate-800">
          Custom Plan <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        <PriceAdj adj={L.adj} setAdj={L.setAdj} price={L.price} eff={L.eff} diff={L.diff} />

        {/* Generator — the hero section */}
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50/40 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Settings2 size={14} className="text-blue-600" />
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Quick Schedule Generator</h4>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <NumInput label="Down Payment %" value={genDP} onChange={(v) => setGenDP(v === "" ? "" : parseFloat(v))} placeholder="10" suffix="%" />
            <NumInput label="Start Date" value="" onChange={() => {}} placeholder="" suffix="" className="[&_input]:hidden" />
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Start Date</label>
              <input type="date" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-blue-500 outline-none" />
            </div>
            <NumInput label="Installments" value={genCount} onChange={(v) => setGenCount(v === "" ? "" : parseInt(v))} placeholder="12" />
            <NumInput label="Each installment" value={genPct} onChange={(v) => setGenPct(v === "" ? "" : parseFloat(v))} placeholder="5" suffix="%" />
            <NumInput label="Every" value={genFreq} onChange={(v) => setGenFreq(v === "" ? "" : parseInt(v))} placeholder="3" suffix="mo" />
          </div>

          <button onClick={generate} className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Layers size={14} /> Generate Schedule
          </button>
        </div>

        {/* Generated schedule — editable list */}
        {L.insts.length > 0 && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{L.insts.length} Installments</span>
              <span className="text-xs font-bold text-slate-800 tabular-nums">{fmt(L.eff)}</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {L.insts.map((inst) => (
                <div key={inst.id} className="group flex items-center gap-3 px-4 py-2 hover:bg-slate-50/50">
                  <div className="flex-1 min-w-0">
                    <input type="text" value={inst.name} onChange={(e) => L.upd(inst.id, { name: e.target.value })} className="font-medium text-sm text-slate-800 bg-transparent border-none outline-none w-full" />
                    <div className="flex items-center gap-3 mt-0.5">
                      <input type="date" value={inst.dueDate} onChange={(e) => L.upd(inst.id, { dueDate: e.target.value })} className="text-[10px] text-slate-400 bg-transparent border-none outline-none" />
                      <MiniToggle inst={inst} onUpdate={L.upd} />
                    </div>
                  </div>
                  <span className="font-bold text-sm text-slate-800 tabular-nums shrink-0">{fmt(L.instAmt(inst))}</span>
                  <button onClick={() => L.del(inst.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 flex">
              <button onClick={L.addOne} className="flex-1 px-3 py-2 hover:bg-slate-50 text-xs font-medium text-slate-500 flex items-center justify-center gap-1.5">
                <Plus size={13} /> Add Row
              </button>
            </div>
          </div>
        )}
      </div>
      {L.insts.length > 0 && <TotalFooter totPct={L.totPct} totAmt={L.totAmt} valid={L.valid} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// DESIGN 3: "Full Spreadsheet"
// Power-user grid. Every field is a visible, editable column.
// No hidden inputs, no toggles. Both % and Fixed columns always show.
// ════════════════════════════════════════════════════════════════════

const Design3 = () => {
  const L = useLogic();
  const [bulkOpen, setBulkOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Payment Schedule</span>
        <span className="text-xs font-bold text-slate-800 tabular-nums bg-white px-2 py-0.5 rounded border border-slate-200">{fmt(L.eff)}</span>
      </div>

      <div className="p-4">
        <PriceAdj adj={L.adj} setAdj={L.setAdj} price={L.price} eff={L.eff} diff={L.diff} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-t border-slate-200">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <th className="px-3 py-2 text-left font-semibold w-[140px]">Name</th>
              <th className="px-3 py-2 text-left font-semibold w-[100px]">Due Date</th>
              <th className="px-3 py-2 text-center font-semibold w-[60px]">
                <span className="inline-flex items-center gap-0.5">
                  <Percent size={10} /> of Price
                </span>
              </th>
              <th className="px-3 py-2 text-center font-semibold w-[90px]">
                <span className="inline-flex items-center gap-0.5">
                  <DollarSign size={10} /> Fixed Amt
                </span>
              </th>
              <th className="px-3 py-2 text-right font-semibold w-[90px]">Calculated</th>
              <th className="px-2 py-2 w-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {L.insts.map((inst) => (
              <tr key={inst.id} className="group hover:bg-blue-50/30 transition-colors">
                <td className="px-3 py-1.5">
                  <input type="text" value={inst.name} onChange={(e) => L.upd(inst.id, { name: e.target.value })} className="w-full font-medium text-slate-800 bg-transparent border-none outline-none text-xs py-0.5" />
                </td>
                <td className="px-3 py-1.5">
                  <input type="date" value={inst.dueDate} onChange={(e) => L.upd(inst.id, { dueDate: e.target.value })} className="w-full text-slate-600 bg-transparent border-none outline-none text-[11px]" />
                </td>
                <td className="px-3 py-1.5">
                  <input type="number" value={inst.percentage ?? ""} onChange={(e) => L.upd(inst.id, { percentage: parseFloat(e.target.value) || 0 })} className={`w-full text-center rounded px-1 py-0.5 text-xs font-mono outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${inst.percentage ? "bg-blue-50 text-blue-700 font-bold" : "bg-transparent text-slate-300"}`} placeholder="—" />
                </td>
                <td className="px-3 py-1.5">
                  <input type="number" value={inst.amount ?? ""} onChange={(e) => L.upd(inst.id, { amount: parseFloat(e.target.value) || 0 })} className={`w-full text-center rounded px-1 py-0.5 text-xs font-mono outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${inst.amount ? "bg-emerald-50 text-emerald-700 font-bold" : "bg-transparent text-slate-300"}`} placeholder="—" />
                </td>
                <td className="px-3 py-1.5 text-right">
                  <span className="font-bold text-slate-800 tabular-nums">{fmt(L.instAmt(inst))}</span>
                </td>
                <td className="px-2 py-1.5">
                  <button onClick={() => L.del(inst.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50">
              <td colSpan={4} className="px-3 py-1.5">
                <div className="flex gap-2">
                  <button onClick={L.addOne} className="text-[10px] font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1">
                    <Plus size={11} /> Add row
                  </button>
                  <span className="text-slate-200">|</span>
                  <button onClick={() => setBulkOpen(!bulkOpen)} className="text-[10px] font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1">
                    <Layers size={11} /> Bulk add
                  </button>
                  <span className="text-slate-200">|</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    Gap: <input type="number" value={L.gap} onChange={(e) => L.setGap(parseInt(e.target.value) || 1)} className="w-6 text-center bg-white border border-slate-200 rounded text-[10px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="1" />
                    mo
                  </span>
                </div>
              </td>
              <td className="px-3 py-1.5 text-right font-bold text-slate-800 tabular-nums">{fmt(L.totAmt)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AnimatePresence>
        {bulkOpen && (
          <BulkSection
            onAdd={(c, p, f, g) => {
              L.bulkAdd(c, p, f, g);
              setBulkOpen(false);
            }}
            onClose={() => setBulkOpen(false)}
            hasExisting={L.insts.length > 0}
          />
        )}
      </AnimatePresence>
      <TotalFooter totPct={L.totPct} totAmt={L.totAmt} valid={L.valid} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// DESIGN 4: "Accordion / Progressive Disclosure"
// Compact summary row → click to expand full detail editing form.
// Keeps the list clean, full editing power when you need it.
// ════════════════════════════════════════════════════════════════════

const Design4 = () => {
  const L = useLogic();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [adjDirection, setAdjDirection] = useState<"decrease" | "increase">("decrease");
  const [adjValue, setAdjValue] = useState<number | "">(0);

  const handleAdjChange = (dir: "decrease" | "increase", val: number | "") => {
    setAdjDirection(dir);
    setAdjValue(val);
    const numVal = Number(val) || 0;
    L.setAdj(dir === "decrease" ? -numVal : numVal);
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b border-slate-100">
        <div className="w-full px-3 py-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-sm font-medium text-slate-800">
          Custom Plan <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Price Adjustment with direction toggle */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 overflow-hidden">
          <div className="px-3 py-2 flex items-center gap-2">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide shrink-0">Adjust Price</label>
            <div className="flex rounded-md border border-slate-200 overflow-hidden">
              <button onClick={() => handleAdjChange("decrease", adjValue)} className={`px-3 py-[5px] text-[11px] font-bold transition-colors ${adjDirection === "decrease" ? "bg-emerald-600 text-white" : "bg-white text-slate-400 hover:bg-slate-50"}`}>
                Discount
              </button>
              <button onClick={() => handleAdjChange("increase", adjValue)} className={`px-3 py-[5px] text-[11px] font-bold transition-colors ${adjDirection === "increase" ? "bg-blue-600 text-white" : "bg-white text-slate-400 hover:bg-slate-50"}`}>
                Increase
              </button>
            </div>
            <div className="relative flex-1 max-w-[80px]">
              <input
                type="number"
                value={adjValue || ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? "" : parseFloat(e.target.value);
                  handleAdjChange(adjDirection, typeof v === "number" && v < 0 ? 0 : v);
                }}
                placeholder="0"
                min="0"
                className="w-full py-1 pl-2 pr-5 bg-white border border-slate-200 rounded-md outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-300 focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 pointer-events-none">%</span>
            </div>
          </div>
          <AnimatePresence>
            {L.adj !== 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className={`px-3 py-1.5 border-t flex items-center gap-2 text-xs ${L.adj < 0 ? "border-emerald-100 bg-emerald-50/60" : "border-blue-100 bg-blue-50/60"}`}>
                  <span className="font-bold text-slate-400 line-through tabular-nums">{fmt(L.price)}</span>
                  <ArrowRight size={10} className={L.adj < 0 ? "text-emerald-400" : "text-blue-400"} />
                  <span className={`font-extrabold tabular-nums ${L.adj < 0 ? "text-emerald-700" : "text-blue-700"}`}>{fmt(L.eff)}</span>
                  <span className={`ml-auto text-[10px] font-bold tabular-nums ${L.adj < 0 ? "text-emerald-600" : "text-blue-600"}`}>
                    {L.adj < 0 ? "−" : "+"}
                    {fmt(Math.abs(L.diff))}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Schedule</span>
            <span className="text-xs font-bold text-slate-800 tabular-nums">{fmt(L.eff)}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {L.insts.map((inst) => {
              const isOpen = expandedId === inst.id;
              const mode: "pct" | "fixed" = inst.percentage !== null ? "pct" : "fixed";
              return (
                <div key={inst.id}>
                  {/* Summary row — always visible */}
                  <button onClick={() => setExpandedId(isOpen ? null : inst.id)} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors text-left">
                    <ChevronRight size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">{inst.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{inst.dueDate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm text-slate-800 tabular-nums">{fmt(L.instAmt(inst))}</span>
                      {mode === "pct" && <p className="text-[10px] text-blue-500 font-semibold tabular-nums">{inst.percentage}%</p>}
                    </div>
                  </button>

                  {/* Expanded detail form */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-3 pt-1 bg-slate-50/50 space-y-3 border-t border-slate-100">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase">Name</label>
                              <input type="text" value={inst.name} onChange={(e) => L.upd(inst.id, { name: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase">Due Date</label>
                              <input type="date" value={inst.dueDate} onChange={(e) => L.upd(inst.id, { dueDate: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500" />
                            </div>
                          </div>
                          {/* Value type selector */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Amount Type</label>
                            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                              <button
                                onClick={() => {
                                  if (mode !== "pct") L.upd(inst.id, { percentage: 5, amount: null });
                                }}
                                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${mode === "pct" ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                              >
                                <Percent size={12} /> Percentage
                              </button>
                              <button
                                onClick={() => {
                                  if (mode !== "fixed") L.upd(inst.id, { amount: 100000, percentage: null });
                                }}
                                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${mode === "fixed" ? "bg-emerald-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                              >
                                <DollarSign size={12} /> Fixed Amount
                              </button>
                            </div>
                            <div className="mt-2">{mode === "pct" ? <NumInput value={inst.percentage} onChange={(v) => L.upd(inst.id, { percentage: parseFloat(v) || 0 })} placeholder="e.g. 10" suffix="%" /> : <NumInput value={inst.amount} onChange={(v) => L.upd(inst.id, { amount: parseFloat(v) || 0 })} placeholder="e.g. 500000" />}</div>
                          </div>
                          <button
                            onClick={() => {
                              L.del(inst.id);
                              setExpandedId(null);
                            }}
                            className="w-full py-1.5 text-[10px] font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 size={11} /> Remove this installment
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Add actions */}
          <div className="border-t border-slate-200 bg-slate-50 flex divide-x divide-slate-200">
            <button onClick={L.addOne} className="flex-1 py-2.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5">
              <Plus size={13} /> Add Installment
            </button>
            <button onClick={() => setBulkOpen(!bulkOpen)} className="flex-1 py-2.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5">
              <Layers size={13} /> Bulk Add
            </button>
            <div className="flex items-center px-3 gap-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Gap</span>
              <input type="number" value={L.gap} onChange={(e) => L.setGap(parseInt(e.target.value) || 1)} className="w-7 text-center bg-white border border-slate-200 rounded text-[10px] font-medium outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="1" />
              <span className="text-[8px] text-slate-400">months</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {bulkOpen && (
            <BulkSection
              onAdd={(c, p, f, g) => {
                L.bulkAdd(c, p, f, g);
                setBulkOpen(false);
              }}
              onClose={() => setBulkOpen(false)}
              hasExisting={L.insts.length > 0}
            />
          )}
        </AnimatePresence>
      </div>
      <TotalFooter totPct={L.totPct} totAmt={L.totAmt} valid={L.valid} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// DESIGN 5: "Side Form"
// Left: persistent "Add Installment" form. Right: live schedule list.
// Fill the form → hit Add → it appears in the list instantly.
// ════════════════════════════════════════════════════════════════════

const Design5 = () => {
  const L = useLogic([{ id: "1", name: "Down Payment", amount: null, percentage: 10, dueDate: "2026-03-01" }]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [formName, setFormName] = useState("Installment 2");
  const [formDate, setFormDate] = useState("2026-06-01");
  const [formMode, setFormMode] = useState<"pct" | "fixed">("pct");
  const [formVal, setFormVal] = useState<number | "">(5);

  const handleAdd = () => {
    const newInst: Inst = {
      id: Date.now().toString(),
      name: formName,
      dueDate: formDate,
      percentage: formMode === "pct" ? Number(formVal) || 0 : null,
      amount: formMode === "fixed" ? Number(formVal) || 0 : null,
    };
    L.setInsts((p) => [...p, newInst]);
    // Reset for next
    setFormName(`Installment ${L.insts.length + 2}`);
    setFormDate(addM(formDate, L.gap));
    setFormVal(formMode === "pct" ? 5 : 100000);
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b border-slate-100">
        <div className="w-full px-3 py-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-sm font-medium text-slate-800">
          Custom Plan <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
      <div className="p-4">
        <PriceAdj adj={L.adj} setAdj={L.setAdj} price={L.price} eff={L.eff} diff={L.diff} />
      </div>

      <div className="flex border-t border-slate-200 min-h-[320px]">
        {/* LEFT: Add form */}
        <div className="w-[200px] p-4 border-r border-slate-200 bg-slate-50/50 space-y-3 shrink-0">
          <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Plus size={11} className="text-blue-500" /> New Installment
          </h4>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase">Name</label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase">Due Date</label>
            <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase">Type</label>
            <div className="flex rounded-md border border-slate-200 overflow-hidden">
              <button onClick={() => setFormMode("pct")} className={`flex-1 py-1.5 text-[10px] font-bold transition-colors ${formMode === "pct" ? "bg-blue-600 text-white" : "bg-white text-slate-400"}`}>
                %
              </button>
              <button onClick={() => setFormMode("fixed")} className={`flex-1 py-1.5 text-[10px] font-bold transition-colors ${formMode === "fixed" ? "bg-emerald-600 text-white" : "bg-white text-slate-400"}`}>
                Fixed
              </button>
            </div>
          </div>
          <NumInput label="Value" value={formVal} onChange={(v) => setFormVal(v === "" ? "" : parseFloat(v))} placeholder={formMode === "pct" ? "5" : "500000"} suffix={formMode === "pct" ? "%" : undefined} />
          <button onClick={handleAdd} className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
            <Plus size={13} /> Add
          </button>

          <div className="pt-2 border-t border-slate-200">
            <button onClick={() => setBulkOpen(!bulkOpen)} className="w-full py-1.5 text-[10px] font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1">
              <Layers size={11} /> Bulk Generate
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
            <span className="font-bold uppercase">Gap:</span>
            <input type="number" value={L.gap} onChange={(e) => L.setGap(parseInt(e.target.value) || 1)} className="w-6 text-center bg-white border border-slate-200 rounded text-[9px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="1" />
            <span>months</span>
          </div>
        </div>

        {/* RIGHT: Schedule list */}
        <div className="flex-1 overflow-y-auto">
          {L.insts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-300 text-xs">Add your first installment →</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {L.insts.map((inst) => (
                <div key={inst.id} className="group flex items-center gap-2 px-3 py-2 hover:bg-slate-50/50">
                  <div className="flex-1 min-w-0">
                    <input type="text" value={inst.name} onChange={(e) => L.upd(inst.id, { name: e.target.value })} className="font-medium text-xs text-slate-800 bg-transparent border-none outline-none w-full" />
                    <div className="flex items-center gap-2 mt-0.5">
                      <input type="date" value={inst.dueDate} onChange={(e) => L.upd(inst.id, { dueDate: e.target.value })} className="text-[10px] text-slate-400 bg-transparent border-none outline-none" />
                      <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${inst.percentage !== null ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>{inst.percentage !== null ? `${inst.percentage}%` : `Fixed: ${fmt(inst.amount || 0)}`}</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-slate-800 tabular-nums shrink-0">{fmt(L.instAmt(inst))}</span>
                  <button onClick={() => L.del(inst.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {bulkOpen && (
          <BulkSection
            onAdd={(c, p, f, g) => {
              L.bulkAdd(c, p, f, g);
              setBulkOpen(false);
            }}
            onClose={() => setBulkOpen(false)}
            hasExisting={L.insts.length > 0}
          />
        )}
      </AnimatePresence>
      <TotalFooter totPct={L.totPct} totAmt={L.totAmt} valid={L.valid} />
    </div>
  );
};

// ── Shared: Bulk Add Section ───────────────────────────────────────

const BulkSection = ({ onAdd, onClose, hasExisting }: { onAdd: (c: number, p: number, f: number, g: number) => void; onClose: () => void; hasExisting: boolean }) => {
  const [count, setCount] = useState<number | "">(8);
  const [pct, setPct] = useState<number | "">(5);
  const [freq, setFreq] = useState<number | "">(3);
  const [gapV, setGapV] = useState<number | "">(1);
  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
      <div className="p-4 bg-blue-50/60 border-t border-blue-200 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={12} /> Bulk Generate
          </h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-0.5">
            <X size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <NumInput label="Count" value={count} onChange={(v) => setCount(v === "" ? "" : parseInt(v))} placeholder="8" />
          <NumInput label="Per installment" value={pct} onChange={(v) => setPct(v === "" ? "" : parseFloat(v))} placeholder="5" suffix="%" />
          {hasExisting && <NumInput label="Gap from last" value={gapV} onChange={(v) => setGapV(v === "" ? "" : parseInt(v))} placeholder="1" suffix="mo" />}
          <NumInput label="Frequency" value={freq} onChange={(v) => setFreq(v === "" ? "" : parseInt(v))} placeholder="3" suffix="mo" />
        </div>
        <button
          onClick={() => {
            if (count && pct && freq) onAdd(Number(count), Number(pct), Number(freq), Number(gapV || 1));
          }}
          disabled={!count || !pct || !freq}
          className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md disabled:opacity-40 hover:bg-blue-700 transition-colors"
        >
          Generate {count || 0} Installments
        </button>
      </div>
    </motion.div>
  );
};

// ── Shared: Mini Toggle (for inline rows) ──────────────────────────

const MiniToggle = ({ inst, onUpdate }: { inst: Inst; onUpdate: (id: string, u: Partial<Inst>) => void }) => {
  const isPct = inst.percentage !== null;
  return (
    <div className="flex items-center gap-1">
      <div
        className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${isPct ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-gray-50 text-gray-400 border border-transparent hover:border-gray-200"}`}
        onClick={() => {
          if (!isPct) onUpdate(inst.id, { percentage: 5, amount: null });
        }}
      >
        {isPct ? (
          <>
            <input type="number" value={inst.percentage ?? ""} onChange={(e) => onUpdate(inst.id, { percentage: parseFloat(e.target.value) || 0 })} className="bg-transparent border-none outline-none w-6 text-right p-0 text-inherit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />%
          </>
        ) : (
          "%"
        )}
      </div>
      <span className="text-[8px] text-gray-300 font-bold">or</span>
      <div
        className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${!isPct ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-50 text-gray-400 border border-transparent hover:border-gray-200"}`}
        onClick={() => {
          if (isPct) onUpdate(inst.id, { amount: 100000, percentage: null });
        }}
      >
        {!isPct ? <input type="number" value={inst.amount ?? ""} onChange={(e) => onUpdate(inst.id, { amount: parseFloat(e.target.value) || 0 })} className="bg-transparent border-none outline-none w-14 text-right p-0 text-inherit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="Fixed" /> : "Fixed"}
      </div>
    </div>
  );
};

// ── Exports ────────────────────────────────────────────────────────

export const CUSTOM_PLAN_DESIGNS = [
  { id: 1, name: "Labeled Form Cards", Component: Design1 },
  { id: 2, name: "Generate-First Flow", Component: Design2 },
  { id: 3, name: "Full Spreadsheet", Component: Design3 },
  { id: 4, name: "Accordion (Progressive Disclosure)", Component: Design4 },
  { id: 5, name: "Side-by-Side Form + List", Component: Design5 },
];
