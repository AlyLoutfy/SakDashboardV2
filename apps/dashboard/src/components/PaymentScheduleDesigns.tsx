import React, { useState } from "react";
import { Calendar, Layers, Plus, Trash2, ChevronDown, ArrowRight, TrendingDown, TrendingUp, Percent, CreditCard, DollarSign, PieChart, FileText, CheckCircle2, MoreVertical, ArrowUpRight, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

// --- Types & Utility Functions ---

interface Installment {
  id: string;
  name: string;
  amount: number | null;
  percentage: number | null;
  dueDate: string;
}

const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Mock Data
const MOCK_UNIT_PRICE = 12500000;
const INITIAL_INSTALLMENTS: Installment[] = [
  { id: "1", name: "Down Payment", amount: null, percentage: 10, dueDate: "2026-02-10" },
  { id: "2", name: "Installment 1", amount: null, percentage: 5, dueDate: "2026-05-10" },
  { id: "3", name: "Installment 2", amount: null, percentage: 5, dueDate: "2026-08-10" },
  { id: "4", name: "Installment 3", amount: null, percentage: 5, dueDate: "2026-11-10" },
];

// --- Reusable Logic Hook for Designs ---

const usePaymentScheduleLogic = () => {
  const [installments, setInstallments] = useState<Installment[]>(INITIAL_INSTALLMENTS);
  const [adjustmentPercent, setAdjustmentPercent] = useState(0);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const effectivePrice = MOCK_UNIT_PRICE * (1 + adjustmentPercent / 100);
  const priceDiff = effectivePrice - MOCK_UNIT_PRICE;

  const totalPercentage = installments.reduce((sum, inst) => sum + (inst.percentage || 0), 0);
  const totalAmount = installments.reduce((sum, inst) => {
    if (inst.amount) return sum + inst.amount;
    if (inst.percentage) return sum + (effectivePrice * inst.percentage) / 100;
    return sum;
  }, 0);

  const handleUpdate = (id: string, updates: Partial<Installment>) => {
    setInstallments(installments.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const handleDelete = (id: string) => {
    setInstallments(installments.filter((i) => i.id !== id));
  };

  const handleAddStart = () => {
    setInstallments([
      ...installments,
      {
        id: Date.now().toString(),
        name: `Installment ${installments.length + 1}`,
        amount: null,
        percentage: 0,
        dueDate: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  return {
    installments,
    adjustmentPercent,
    setAdjustmentPercent,
    effectivePrice,
    priceDiff,
    totalPercentage,
    totalAmount,
    handleUpdate,
    handleDelete,
    handleAddStart,
    isBulkOpen,
    setIsBulkOpen,
    unitPrice: MOCK_UNIT_PRICE,
  };
};

// --- Shared Components ---

const PriceAdjustmentSelector = ({ percent, onChange, unitPrice, effectivePrice, priceDiff }: any) => {
  const isDiscount = percent < 0;
  const hasAdjustment = percent !== 0;

  return (
    <div className="mb-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 overflow-hidden">
        <div className="px-3 py-2 flex items-center gap-2.5">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap shrink-0">Adjust Price</label>
          <div className="relative flex-1 max-w-[120px]">
            <input type="number" value={percent || ""} onChange={(e) => onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))} placeholder="0" className="w-full py-1 pl-2 pr-6 bg-white border border-slate-200 rounded-md outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 pointer-events-none">%</span>
          </div>
          {hasAdjustment && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${isDiscount ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
              {isDiscount ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
              {isDiscount ? "Discount" : "Premium"}
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {hasAdjustment && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className={`px-3 py-2 border-t flex items-center gap-2 ${isDiscount ? "border-emerald-100 bg-emerald-50/60" : "border-blue-100 bg-blue-50/60"}`}>
                <span className="text-xs font-bold text-slate-400 line-through tabular-nums">{formatNumber(unitPrice)}</span>
                <ArrowRight size={12} className={isDiscount ? "text-emerald-400 shrink-0" : "text-blue-400 shrink-0"} />
                <span className={`text-xs font-extrabold tabular-nums ${isDiscount ? "text-emerald-700" : "text-blue-700"}`}>{formatNumber(effectivePrice)}</span>
                <span className={`ml-auto text-[10px] font-bold tabular-nums ${isDiscount ? "text-emerald-600" : "text-blue-600"}`}>
                  {isDiscount ? "−" : "+"}
                  {formatNumber(Math.abs(priceDiff))}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Designs ---

// 1. Clean Minimalist (Base)
const Design1 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-700">Payment Schedule</h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-full px-2 py-0.5 text-[10px] text-slate-500 font-medium">Optional Only</div>
      </div>

      <div className="p-4">
        {/* Plan Selector Mock */}
        <div className="mb-4">
          <div className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white flex justify-between items-center text-sm font-medium text-slate-800">
            Custom Plan
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>

        <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />

        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</span>
            <span className="text-xs font-bold text-slate-700 tabular-nums">{formatNumber(logic.effectivePrice)}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {logic.installments.map((inst) => (
              <div key={inst.id} className="p-3 grid grid-cols-[1fr_auto_auto] gap-4 items-center hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-sm font-medium text-slate-800">{inst.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">{inst.percentage}%</span>
                    <span className="text-[10px] text-slate-400">{inst.dueDate}</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-800 tabular-nums">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</div>
                <button onClick={() => logic.handleDelete(inst.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-2 flex gap-2 border-t border-slate-200">
            <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 bg-white border border-slate-200 shadow-sm">
              <Layers size={12} className="mr-2 text-blue-500" /> Bulk Add
            </Button>
            <Button variant="ghost" size="sm" onClick={logic.handleAddStart} className="flex-1 text-xs h-8 bg-white border border-slate-200 shadow-sm">
              <Plus size={12} className="mr-2 text-green-500" /> Add Item
            </Button>
          </div>

          <div className={`px-4 py-3 border-t border-slate-200 flex justify-between items-center ${Math.abs(logic.totalPercentage - 100) < 0.1 ? "bg-emerald-50/50" : "bg-amber-50/50"}`}>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
              {Math.abs(logic.totalPercentage - 100) >= 0.1 && <span className="text-[10px] text-amber-600 font-medium">Must equal 100%</span>}
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold leading-none ${Math.abs(logic.totalPercentage - 100) < 0.1 ? "text-emerald-600" : "text-amber-600"}`}>{logic.totalPercentage}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Modern Card (Card-based Layout)
const Design2 = () => {
  const logic = usePaymentScheduleLogic();
  const isValidTotal = Math.abs(logic.totalPercentage - 100) < 0.1;

  return (
    <div className="w-full max-w-lg mx-auto p-1">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Payment Plan</h3>
            <div className="text-blue-100 text-xs mt-1 opacity-80">Custom Schedule Breakdown</div>
          </div>
          <PieChart className="text-white/20" size={32} />
        </div>

        <div className="p-5 space-y-5 pb-0">
          <div>
            <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />
            <p className="text-[10px] text-slate-400 mt-1 pl-1">
              * <span className="font-semibold text-slate-500">Price Adjustment:</span> Use <span className="font-mono font-bold text-slate-600">-</span> for discount, <span className="font-mono font-bold text-slate-600">+</span> for increase
            </p>
          </div>

          <div className="space-y-2">
            {logic.installments.map((inst, idx) => (
              <div key={inst.id} className="group flex items-center bg-white border border-slate-100 hover:border-blue-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-all">
                <div className="ml-1 flex-1">
                  {/* Top Line: Name -- Amount -- Delete */}
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-slate-800 text-xs">{inst.name}</p>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-slate-900 text-xs tabular-nums">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</p>
                      <button onClick={() => logic.handleDelete(inst.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 -mr-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Line: Date -- Percentage */}
                  <div className="flex justify-between items-center mt-1 pr-6">
                    <p className="text-[10px] text-slate-500">{inst.dueDate}</p>
                    <p className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-1 rounded">{inst.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons - Extracted from Current Design */}
        <div className="border-t border-slate-100 mt-5">
          <div className="flex divide-x divide-slate-100">
            <button className="flex-1 px-3 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-blue-600 font-medium text-sm">
              <Layers size={16} />
              Bulk Add Installments
            </button>
            <button onClick={logic.handleAddStart} className="flex-1 px-3 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-600 font-medium text-sm">
              <Plus size={16} />
              Add Single Installment
            </button>
          </div>
        </div>

        {/* Footer - Extracted from Current Design */}
        <div className={`px-4 py-3 border-t-2 ${isValidTotal ? "border-blue-500 bg-blue-50" : "border-amber-500 bg-amber-50"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isValidTotal ? "text-blue-700" : "text-amber-700"}`}>Total</p>
              {!isValidTotal && <p className="text-[10px] text-amber-600 mt-0.5">Total should equal 100%</p>}
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${isValidTotal ? "text-blue-700" : "text-amber-700"}`}>{logic.totalPercentage}%</p>
              <p className="text-sm text-slate-600 tabular-nums">{formatNumber(logic.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Office / Enterprise Style
const Design3 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto font-sans">
      <div className="border-t-4 border-slate-600 bg-white shadow-sm">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Schedule Statement</h3>
          <span className="text-xs font-mono text-slate-500">REF: CST-PLN</span>
        </div>

        <div className="p-5">
          <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-800 text-left">
                <th className="py-2 font-bold text-slate-800 w-12">#</th>
                <th className="py-2 font-bold text-slate-800">Date / Desc</th>
                <th className="py-2 font-bold text-slate-800 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logic.installments.map((inst, i) => (
                <tr key={inst.id} className="group">
                  <td className="py-3 text-slate-400 font-mono text-xs">{String(i + 1).padStart(2, "0")}</td>
                  <td className="py-3">
                    <div className="font-semibold text-slate-800">{inst.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{inst.dueDate}</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-mono font-medium text-slate-700">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</div>
                    <div className="text-[10px] text-slate-400">{inst.percentage}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-800 bg-slate-50">
                <td colSpan={2} className="py-3 pl-2 font-bold text-slate-800 uppercase text-xs">
                  Total Payable
                </td>
                <td className="py-3 text-right pr-2">
                  <div className="font-bold text-slate-900">{formatNumber(logic.totalAmount)}</div>
                  <div className={`text-xs font-bold ${Math.abs(logic.totalPercentage - 100) < 0.1 ? "text-slate-500" : "text-red-500"}`}>{logic.totalPercentage}%</div>
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-4 flex justify-end">
            <button className="text-xs font-bold uppercase tracking-wide text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
              <Plus size={12} /> Add Line Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Soft & Airy (Light Blue Theme)
const Design4 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-sky-50/30 rounded-3xl border border-sky-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Timeline</h3>
            <p className="text-xs text-slate-500">Scheduled payments</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-400 font-medium">UNIT VALUE</p>
            <p className="font-bold text-slate-700">{formatNumber(logic.unitPrice)}</p>
          </div>
        </div>

        <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />

        <div className="relative pl-4 border-l-2 border-dashed border-sky-200 space-y-6 my-6">
          {logic.installments.map((inst, i) => (
            <div key={inst.id} className="relative">
              <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-white border-2 border-sky-400 ring-2 ring-sky-50" />
              <div className="flex justify-between items-start bg-white p-3 rounded-xl border border-sky-100 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-sky-500 uppercase mb-0.5">{inst.dueDate}</p>
                  <p className="font-semibold text-slate-700 text-sm">{inst.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</p>
                  <span className="inline-block bg-sky-50 text-sky-600 font-bold text-[10px] px-1.5 py-0.5 rounded-md mt-1">{inst.percentage}%</span>
                </div>
              </div>
            </div>
          ))}

          <button className="relative w-full flex items-center gap-3 group">
            <div className="absolute -left-[21px] h-3 w-3 rounded-full bg-slate-200 group-hover:bg-sky-400 transition-colors" />
            <div className="h-8 w-full rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs font-medium text-slate-400 group-hover:border-sky-300 group-hover:text-sky-600 transition-all bg-white/50">Add Payment Event</div>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-sky-100 flex items-center justify-between shadow-sm">
          <span className="text-sm font-medium text-slate-600">Total Scheduled</span>
          <div className="text-right">
            <span className={`block font-black text-lg ${Math.abs(logic.totalPercentage - 100) < 0.1 ? "text-sky-600" : "text-amber-500"}`}>{logic.totalPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Dark Mode Concept
const Design5 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 rounded-xl overflow-hidden shadow-2xl p-1">
      <div className="bg-slate-800/50 rounded-lg p-5">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-white font-bold text-lg">Payments</h3>
            <p className="text-slate-400 text-xs">Configuration Setup</p>
          </div>
          <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-600/50">USD / EGP</div>
        </div>

        {/* Dark Mode Price Adjustment Logic */}
        <div className="mb-6 bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] uppercase font-bold text-slate-500">Adjust Base Price</label>
            <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded">
              {logic.adjustmentPercent > 0 ? "+" : ""}
              {logic.adjustmentPercent}%
            </span>
          </div>
          <input type="range" min="-20" max="20" value={logic.adjustmentPercent} onChange={(e) => logic.setAdjustmentPercent(Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between mt-3 text-xs">
            <span className="text-slate-500 decoration-slate-600 line-through">{formatNumber(logic.unitPrice)}</span>
            <span className={`font-bold ${logic.adjustmentPercent < 0 ? "text-emerald-400" : logic.adjustmentPercent > 0 ? "text-indigo-400" : "text-white"}`}>{formatNumber(logic.effectivePrice)}</span>
          </div>
        </div>

        <div className="space-y-2">
          {logic.installments.map((inst, i) => (
            <div key={inst.id} className="bg-slate-800 border border-slate-700/50 p-3 rounded-lg flex items-center justify-between hover:bg-slate-750 transition duration-200">
              <div>
                <div className="text-slate-200 font-medium text-sm">{inst.name}</div>
                <div className="text-slate-500 text-xs">{inst.dueDate}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono text-sm">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</div>
                <div className="text-slate-500 text-[10px]">{inst.percentage}%</div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2">Generate Schedule</button>
      </div>
    </div>
  );
};

// 6. Split Pane (Visual Density)
const Design6 = () => {
  const logic = usePaymentScheduleLogic();
  const isValid = Math.abs(logic.totalPercentage - 100) < 0.1;

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row h-full min-h-[300px]">
      {/* Left Summary Pane */}
      <div className="md:w-1/3 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</h4>
          <div className={`text-2xl font-black ${isValid ? "text-slate-800" : "text-amber-500"}`}>{logic.totalPercentage}%</div>
          <div className="text-xs text-slate-500 font-medium mt-1">of {formatNumber(logic.effectivePrice)}</div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Adjustment</h4>
            <div className="flex items-center gap-2">
              <button onClick={() => logic.setAdjustmentPercent(logic.adjustmentPercent - 1)} className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100">
                -
              </button>
              <span className="text-sm font-bold text-slate-700 w-8 text-center">{logic.adjustmentPercent}%</span>
              <button onClick={() => logic.setAdjustmentPercent(logic.adjustmentPercent + 1)} className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100">
                +
              </button>
            </div>
          </div>

          <div className={`text-[10px] px-2 py-1.5 rounded border ${isValid ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>{isValid ? "Schedule Valid" : "Target: 100%"}</div>
        </div>
      </div>

      {/* Right List Pane */}
      <div className="md:w-2/3 p-0 overflow-y-auto max-h-[400px]">
        {logic.installments.map((inst, i) => (
          <div key={inst.id} className="p-3 border-b border-slate-100 flex justify-between items-center hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <div className="text-sm font-medium text-slate-700">{inst.name}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-800">{inst.percentage}%</span>
              <span className="text-[10px] text-slate-400 tabular-nums">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</span>
            </div>
          </div>
        ))}
        <button className="w-full text-xs text-slate-400 font-medium p-3 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1">
          <Plus size={14} /> Add new line
        </button>
      </div>
    </div>
  );
};

// 7. Grid / Tile Layout
const Design7 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-4">
        <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {logic.installments.map((inst) => (
          <div key={inst.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">{inst.percentage}%</div>
              <button className="text-slate-300 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 truncate">{inst.name}</div>
              <div className="text-sm font-bold text-slate-800">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</div>
            </div>
          </div>
        ))}
        <button onClick={logic.handleAddStart} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center h-24 text-slate-400 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-all gap-1">
          <Plus size={20} />
          <span className="text-xs font-medium">Add</span>
        </button>
      </div>

      <div className="bg-slate-900 text-white mt-3 p-4 rounded-xl flex justify-between items-center">
        <span className="text-sm font-medium">Total Value</span>
        <span className="text-lg font-bold">{formatNumber(logic.totalAmount)}</span>
      </div>
    </div>
  );
};

// 8. Interactive "Builder" Style
const Design8 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto bg-gray-50 p-6 rounded-3xl border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-gray-900 font-bold text-lg">Plan Builder</h3>
        <p className="text-gray-500 text-xs">Drag and customize your schedule</p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />
      </div>

      <div className="space-y-4 relative">
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 rounded-full" />
        {logic.installments.map((inst, i) => (
          <div key={inst.id} className="relative pl-10">
            <div className="absolute left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full z-10" />
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">{inst.name}</span>
                <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 rounded">{inst.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-8 w-full bg-black text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5">Confirm Schedule ({logic.totalPercentage}%)</button>
    </div>
  );
};

// 9. Compact "Data" List
const Design9 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto border border-slate-300 rounded-lg bg-white">
      <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
        <span className="font-bold text-xs text-slate-700 uppercase">Payment Schedule</span>
        <span className="font-mono text-xs text-slate-600 font-semibold">{formatNumber(logic.effectivePrice)}</span>
      </div>

      <div className="p-2 border-b border-slate-200 bg-slate-50">
        <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-slate-500 bg-white border-b border-slate-100">
            <tr>
              <th className="px-4 py-2 font-medium w-1/2">Description</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium text-right">%</th>
              <th className="px-4 py-2 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logic.installments.map((inst) => (
              <tr key={inst.id} className="hover:bg-blue-50/50">
                <td className="px-4 py-2 font-medium text-slate-700">{inst.name}</td>
                <td className="px-4 py-2 text-slate-500">{inst.dueDate}</td>
                <td className="px-4 py-2 text-right">{inst.percentage}%</td>
                <td className="px-4 py-2 text-right font-semibold">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 10. Gradient Header
const Design10 = () => {
  const logic = usePaymentScheduleLogic();
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-t-3xl border border-slate-100 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
            <CreditCard size={20} className="text-white" />
          </div>
          <div className="text-right">
            <div className="text-purple-200 text-xs font-medium uppercase tracking-wider">Total Est.</div>
            <div className="text-2xl font-bold">{formatNumber(logic.totalAmount)}</div>
          </div>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">Monthly</span>
          <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">{logic.installments.length} Installments</span>
        </div>
      </div>

      <div className="p-4 -mt-4 bg-white rounded-t-3xl relative z-10">
        <div className="mx-auto w-12 h-1 bg-slate-200 rounded-full mb-6" />

        <PriceAdjustmentSelector percent={logic.adjustmentPercent} onChange={logic.setAdjustmentPercent} unitPrice={logic.unitPrice} effectivePrice={logic.effectivePrice} priceDiff={logic.priceDiff} />

        <div className="space-y-4 mt-6">
          {logic.installments.map((inst, i) => (
            <div key={inst.id} className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 ring-4 ring-purple-50" />
                {i !== logic.installments.length - 1 && <div className="w-0.5 flex-1 bg-slate-100" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">{inst.name}</h4>
                  <span className="font-bold text-purple-700 text-sm">{formatNumber(inst.percentage ? (logic.effectivePrice * inst.percentage) / 100 : inst.amount || 0)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {inst.dueDate} • {inst.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PAYMENT_SCHEDULE_DESIGNS = [
  { id: 1, name: "Clean Minimalist", Component: Design1 },
  { id: 2, name: "Modern Card", Component: Design2 },
  { id: 3, name: "Enterprise Statement", Component: Design3 },
  { id: 4, name: "Soft Sky", Component: Design4 },
  { id: 5, name: "Dark Mode Config", Component: Design5 },
  { id: 6, name: "Split Summary", Component: Design6 },
  { id: 7, name: "Grid Tiles", Component: Design7 },
  { id: 8, name: "Interactive Builder", Component: Design8 },
  { id: 9, name: "Data Dense Table", Component: Design9 },
  { id: 10, name: "Gradient Header", Component: Design10 },
];
