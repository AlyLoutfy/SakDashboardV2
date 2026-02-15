/**
 * CustomPlanBuilder — Reusable custom payment plan component (based on Design 4).
 *
 * This component is extracted from the "Accordion / Progressive Disclosure" design
 * so it can be used in the ReservationDrawer and anywhere else a custom payment plan
 * builder is needed.
 *
 * Props let the parent control state (installments, price adjustment) so it
 * can wire into the store / form submission logic.
 */

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Layers, ArrowRight, X, Percent, DollarSign, PieChart, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────

export interface Installment {
  id: string;
  name: string;
  amount: number | null;
  percentage: number | null;
  dueDate: string;
}

export interface CustomPlanBuilderProps {
  /** Unit price before any adjustment */
  unitPrice: number;
  /** Current installments array (controlled) */
  installments: Installment[];
  /** Called whenever the installments change */
  onInstallmentsChange: (installments: Installment[]) => void;
  /** Current price adjustment percentage (controlled) */
  adjustmentPercent: number;
  /** Called when price adjustment changes */
  onAdjustmentChange: (pct: number) => void;
  /** Called when validation state changes (true = valid, false = invalid) */
  onValidationChange?: (isValid: boolean) => void;
  /** Optional: currently selected plan name to display */
  planLabel?: string;
  /** Optional: callback when user clicks the plan selector */
  onPlanSelectorClick?: () => void;
  /** Whether to show the plan selector header */
  showPlanSelector?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

const addMonths = (d: string, m: number): string => {
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

// ── Component ──────────────────────────────────────────────────────

const CustomPlanBuilder: React.FC<CustomPlanBuilderProps> = ({ unitPrice, installments, onInstallmentsChange, adjustmentPercent, onAdjustmentChange, onValidationChange, planLabel = "Custom Plan", onPlanSelectorClick, showPlanSelector = false }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [gap, setGap] = useState(3);
  const [adjDirection, setAdjDirection] = useState<"decrease" | "increase">(adjustmentPercent < 0 ? "decrease" : "decrease");
  const [adjValue, setAdjValue] = useState<number | "">(Math.abs(adjustmentPercent) || 0);

  // Sync direction/value if adjustmentPercent changes externally
  useEffect(() => {
    if (adjustmentPercent < 0) {
      setAdjDirection("decrease");
      setAdjValue(Math.abs(adjustmentPercent));
    } else if (adjustmentPercent > 0) {
      setAdjDirection("increase");
      setAdjValue(adjustmentPercent);
    } else {
      setAdjValue(0);
    }
  }, [adjustmentPercent]);

  const eff = unitPrice * (1 + adjustmentPercent / 100);
  const diff = eff - unitPrice;

  const totPct = installments.reduce((s, i) => s + (i.percentage || 0), 0);
  const totAmt = installments.reduce((s, i) => {
    if (i.amount) return s + i.amount;
    if (i.percentage) return s + (eff * i.percentage) / 100;
    return s;
  }, 0);
  const valid = Math.abs(totPct - 100) < 0.1;
  const instAmt = (i: Installment) => (i.percentage ? (eff * i.percentage) / 100 : i.amount || 0);

  // Notify parent of validation state changes
  useEffect(() => {
    onValidationChange?.(valid);
  }, [valid, onValidationChange]);

  const upd = (id: string, u: Partial<Installment>) => {
    onInstallmentsChange(
      installments.map((i) => {
        if (i.id !== id) return i;
        const n = { ...i, ...u };
        if (u.percentage !== undefined) n.amount = null;
        if (u.amount !== undefined) n.percentage = null;
        return n;
      }),
    );
  };

  const del = (id: string) => {
    onInstallmentsChange(installments.filter((i) => i.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addOne = () => {
    const last = installments[installments.length - 1]?.dueDate || today();
    onInstallmentsChange([...installments, { id: `inst-${Date.now()}`, name: `Installment ${installments.length}`, amount: null, percentage: 5, dueDate: addMonths(last, gap) }]);
  };

  const bulkAdd = (count: number, pct: number, freqM: number, gapM: number) => {
    const last = installments[installments.length - 1]?.dueDate || today();
    let cur = addMonths(last, gapM);
    const news: Installment[] = [];
    for (let i = 0; i < count; i++) {
      news.push({ id: `inst-bulk-${Date.now()}-${i}`, name: `Installment ${installments.length + i + 1}`, amount: null, percentage: pct, dueDate: cur });
      cur = addMonths(cur, freqM);
    }
    onInstallmentsChange([...installments, ...news]);
    setBulkOpen(false);
  };

  const handleAdjChange = (dir: "decrease" | "increase", val: number | "") => {
    setAdjDirection(dir);
    setAdjValue(val);
    const numVal = Number(val) || 0;
    onAdjustmentChange(dir === "decrease" ? -numVal : numVal);
  };

  return (
    <div className="w-full">
      {/* Plan Selector (optional) */}
      {showPlanSelector && (
        <div className="p-4 border-b border-slate-100">
          <div onClick={onPlanSelectorClick} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-sm font-medium text-slate-800 cursor-pointer hover:border-slate-300 transition-colors">
            {planLabel} <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      )}

      <div className={`${showPlanSelector ? "p-4" : ""} space-y-4`}>
        {/* Price Adjustment with Discount/Increase toggle */}
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
            {adjustmentPercent !== 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className={`px-3 py-1.5 border-t flex items-center gap-2 text-xs ${adjustmentPercent < 0 ? "border-emerald-100 bg-emerald-50/60" : "border-blue-100 bg-blue-50/60"}`}>
                  <span className="font-bold text-slate-400 line-through tabular-nums">{fmt(unitPrice)}</span>
                  <ArrowRight size={10} className={adjustmentPercent < 0 ? "text-emerald-400" : "text-blue-400"} />
                  <span className={`font-extrabold tabular-nums ${adjustmentPercent < 0 ? "text-emerald-700" : "text-blue-700"}`}>{fmt(eff)}</span>
                  <span className={`ml-auto text-[10px] font-bold tabular-nums ${adjustmentPercent < 0 ? "text-emerald-600" : "text-blue-600"}`}>
                    {adjustmentPercent < 0 ? "−" : "+"}
                    {fmt(Math.abs(diff))}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Schedule */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Schedule</span>
            <span className="text-xs font-bold text-slate-800 tabular-nums">{fmt(eff)}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {installments.map((inst) => {
              const isOpen = expandedId === inst.id;
              const mode: "pct" | "fixed" = inst.percentage !== null ? "pct" : "fixed";
              return (
                <div key={inst.id}>
                  {/* Summary row */}
                  <button onClick={() => setExpandedId(isOpen ? null : inst.id)} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors text-left">
                    <ChevronRight size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">{inst.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{inst.dueDate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm text-slate-800 tabular-nums">{fmt(instAmt(inst))}</span>
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
                              <input type="text" value={inst.name} onChange={(e) => upd(inst.id, { name: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase">Due Date</label>
                              <input type="date" value={inst.dueDate} onChange={(e) => upd(inst.id, { dueDate: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500" />
                            </div>
                          </div>
                          {/* Value type selector */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Amount Type</label>
                            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                              <button
                                onClick={() => {
                                  if (mode !== "pct") upd(inst.id, { percentage: 5, amount: null });
                                }}
                                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${mode === "pct" ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                              >
                                <Percent size={12} /> Percentage
                              </button>
                              <button
                                onClick={() => {
                                  if (mode !== "fixed") upd(inst.id, { amount: 100000, percentage: null });
                                }}
                                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${mode === "fixed" ? "bg-emerald-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                              >
                                <DollarSign size={12} /> Fixed Amount
                              </button>
                            </div>
                            <div className="mt-2">
                              {mode === "pct" ? (
                                <div className="space-y-1">
                                  <div className="relative">
                                    <input type="number" value={inst.percentage ?? ""} onChange={(e) => upd(inst.id, { percentage: parseFloat(e.target.value) || 0 })} placeholder="e.g. 10" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-7" />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium pointer-events-none">%</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <input type="number" value={inst.amount ?? ""} onChange={(e) => upd(inst.id, { amount: parseFloat(e.target.value) || 0 })} placeholder="e.g. 500000" className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                </div>
                              )}
                            </div>
                          </div>
                          <button onClick={() => del(inst.id)} className="w-full py-1.5 text-[10px] font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center gap-1">
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
            <button onClick={addOne} className="flex-1 py-2.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5">
              <Plus size={13} /> Add Installment
            </button>
            <button onClick={() => setBulkOpen(!bulkOpen)} className="flex-1 py-2.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5">
              <Layers size={13} /> Bulk Add
            </button>
            <div className="flex items-center px-3 gap-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Gap</span>
              <input type="number" value={gap} onChange={(e) => setGap(parseInt(e.target.value) || 1)} className="w-7 text-center bg-white border border-slate-200 rounded text-[10px] font-medium outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="1" />
              <span className="text-[8px] text-slate-400">months</span>
            </div>
          </div>
        </div>

        {/* Bulk add panel */}
        <AnimatePresence>{bulkOpen && <BulkPanel onAdd={bulkAdd} onClose={() => setBulkOpen(false)} hasExisting={installments.length > 0} />}</AnimatePresence>
      </div>

      {/* Total Footer */}
      <div className={`px-5 py-3 border-t-2 flex items-center justify-between ${valid ? "border-blue-500 bg-blue-50" : "border-red-500 bg-red-50"}`}>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${valid ? "text-blue-700" : "text-red-700"}`}>Total</p>
          {!valid && (
            <div className="flex items-center gap-1 mt-0.5">
              <AlertTriangle size={10} className="text-red-500" />
              <p className="text-[9px] text-red-600 font-semibold">Must equal 100% to save</p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className={`text-base font-bold ${valid ? "text-blue-700" : "text-red-700"}`}>{totPct}%</p>
          <p className="text-xs text-slate-600 tabular-nums">{fmt(totAmt)}</p>
        </div>
      </div>
    </div>
  );
};

// ── Bulk Panel ─────────────────────────────────────────────────────

const BulkPanel = ({ onAdd, onClose, hasExisting }: { onAdd: (c: number, p: number, f: number, g: number) => void; onClose: () => void; hasExisting: boolean }) => {
  const [count, setCount] = useState<number | "">(8);
  const [pct, setPct] = useState<number | "">(5);
  const [freq, setFreq] = useState<number | "">(3);
  const [gapV, setGapV] = useState<number | "">(1);

  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={12} /> Bulk Generate
          </h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-0.5">
            <X size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <FieldInput label="Count" value={count} onChange={(v) => setCount(v === "" ? "" : parseInt(v))} placeholder="8" />
          <FieldInput label="Per installment" value={pct} onChange={(v) => setPct(v === "" ? "" : parseFloat(v))} placeholder="5" suffix="%" />
          {hasExisting && <FieldInput label="Gap from last" value={gapV} onChange={(v) => setGapV(v === "" ? "" : parseInt(v))} placeholder="1" suffix="months" />}
          <FieldInput label="Frequency" value={freq} onChange={(v) => setFreq(v === "" ? "" : parseInt(v))} placeholder="3" suffix="months" />
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

const FieldInput = ({ label, value, onChange, placeholder, suffix }: { label: string; value: any; onChange: (v: string) => void; placeholder: string; suffix?: string }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={suffix ? { paddingRight: 38 } : {}} />
      {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium pointer-events-none">{suffix}</span>}
    </div>
  </div>
);

export default CustomPlanBuilder;
