import { X, User, Phone, Mail, FileText, ChevronDown, Plus, Trash2, Calendar, FileCheck, Layers, CreditCard, Sparkles, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSalesStore } from "../../../store/salesStore";
import type { PaymentPlan, Installment } from "../../../store/salesStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DesignProps {
  isOpen: boolean;
  unitPrice: number;
  onClose: () => void;
}

const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const BulkAddSection = ({ onAdd }: { onAdd: (count: number, percentage: number, frequency: string, startDate: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState<number | "">("");
  const [percentage, setPercentage] = useState<number | "">("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  if (!isOpen)
    return (
      <button onClick={() => setIsOpen(true)} className="w-full py-4 flex items-center justify-center gap-2 text-indigo-600 font-medium text-sm hover:bg-indigo-50/80 rounded-xl transition-colors border border-dashed border-indigo-200">
        <Layers size={16} /> Bulk Generate Installments
      </button>
    );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Bulk Configuration</h4>
        <button onClick={() => setIsOpen(false)} className="text-indigo-400 hover:text-indigo-600">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] text-indigo-400 font-semibold uppercase">Count</label>
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full px-3 py-2 bg-white rounded-lg text-sm border-0 shadow-sm focus:ring-2 ring-indigo-300 text-indigo-900 font-medium" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-indigo-400 font-semibold uppercase">Percentage</label>
          <input type="number" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="w-full px-3 py-2 bg-white rounded-lg text-sm border-0 shadow-sm focus:ring-2 ring-indigo-300 text-indigo-900 font-medium" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-indigo-400 font-semibold uppercase">Period</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg text-sm border-0 shadow-sm focus:ring-2 ring-indigo-300 text-indigo-900 font-medium">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-indigo-400 font-semibold uppercase">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg text-sm border-0 shadow-sm focus:ring-2 ring-indigo-300 text-indigo-900 font-medium" />
        </div>
      </div>
      <Button
        onClick={() => {
          if (count && percentage) {
            onAdd(Number(count), Number(percentage), frequency, startDate);
            setIsOpen(false);
          }
        }}
        className="w-full bg-indigo-600 text-white font-medium shadow-md shadow-indigo-200"
      >
        Generate
      </Button>
    </motion.div>
  );
};

const Design1 = ({ isOpen, unitPrice, onClose }: DesignProps) => {
  const { currentReservation, updateCurrentClient, paymentPlans, setCurrentPaymentPlan, createReservation, updateReservation, editingReservationId } = useSalesStore();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isCustomPlan, setIsCustomPlan] = useState(false);
  const [customInstallments, setCustomInstallments] = useState<Installment[]>([]);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);

  useEffect(() => {
    if (isOpen && currentReservation) {
      if (currentReservation.paymentPlan?.isCustom) {
        setIsCustomPlan(true);
        setCustomInstallments(currentReservation.paymentPlan.installments);
        setSelectedPlanId("");
      } else if (currentReservation.paymentPlan) {
        setSelectedPlanId(currentReservation.paymentPlan.id);
        setIsCustomPlan(false);
        setCustomInstallments([]);
      }
    }
  }, [isOpen, currentReservation]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setShowPlanDropdown(false);
    setIsCustomPlan(false);
    const plan = paymentPlans.find((p) => p.id === planId);
    if (plan) {
      setCustomInstallments([...plan.installments]);
      setCurrentPaymentPlan({ ...plan, installments: [...plan.installments] });
    }
  };
  const handleCreateCustomPlan = () => {
    setIsCustomPlan(true);
    setSelectedPlanId("");
    setShowPlanDropdown(false);
    setCustomInstallments([{ id: `inst-${Date.now()}`, name: "Down Payment", amount: null, percentage: 10, dueDate: new Date().toISOString().split("T")[0] }]);
  };
  const handleAddInstallment = () => {
    setCustomInstallments([...customInstallments, { id: `inst-${Date.now()}`, name: `Installment ${customInstallments.length}`, amount: null, percentage: 0, dueDate: new Date().toISOString().split("T")[0] }]);
  };
  const handleUpdateInstallment = (id: string, updates: Partial<Installment>) => {
    setCustomInstallments(customInstallments.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst)));
  };
  const handleRemoveInstallment = (id: string) => {
    setCustomInstallments(customInstallments.filter((inst) => inst.id !== id));
  };
  const handleSubmit = () => {
    if (!currentReservation) return;
    const finalPaymentPlan = isCustomPlan || selectedPlanId ? { id: `custom-${Date.now()}`, name: "Custom Plan", installments: customInstallments, isCustom: true } : currentReservation.paymentPlan;
    if (editingReservationId) updateReservation(editingReservationId, { client: currentReservation.client, paymentPlan: finalPaymentPlan });
    else createReservation({ ...currentReservation, paymentPlan: finalPaymentPlan });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 350 }} className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="pt-8 pb-6 px-6 border-b border-slate-100 flex justify-between items-center bg-white backdrop-blur-xl bg-white/80 sticky top-0 z-20">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Payment Schedule</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {currentReservation?.unitTitle} • {formatNumber(unitPrice)}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Content - Modern Cards */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
              {/* Plan Selector Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <button onClick={() => setShowPlanDropdown(!showPlanDropdown)} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileText size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide">Selected Plan</p>
                      <p className="font-semibold text-slate-700">{selectedPlanId ? paymentPlans.find((p) => p.id === selectedPlanId)?.name : isCustomPlan ? "Custom Schedule" : "Choose a payment plan"}</p>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${showPlanDropdown ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {showPlanDropdown && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="border-t border-slate-100 bg-slate-50/50">
                      {paymentPlans.map((p) => (
                        <button key={p.id} onClick={() => handleSelectPlan(p.id)} className="w-full p-3 pl-[4.5rem] text-left text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors border-b border-slate-100 last:border-0">
                          {p.name}
                        </button>
                      ))}
                      <button onClick={handleCreateCustomPlan} className="w-full p-3 pl-[4.5rem] text-left text-sm font-bold text-indigo-600 hover:bg-white transition-colors">
                        Create Custom +
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Installment Cards */}
              <div className="space-y-3">
                {customInstallments.map((inst, i) => (
                  <motion.div layout key={inst.id} className="group relative bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 hover:border-indigo-200 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-[10px] font-bold text-slate-500">{(i + 1).toString().padStart(2, "0")}</span>
                        <input value={inst.name} onChange={(e) => handleUpdateInstallment(inst.id, { name: e.target.value })} className="bg-transparent border-0 p-0 text-sm font-semibold text-slate-700 focus:ring-0 placeholder-slate-400" placeholder="Installment Name" />
                      </div>
                      <button onClick={() => handleRemoveInstallment(inst.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 group-focus-within:border-indigo-100 group-focus-within:bg-indigo-50/30 transition-colors">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Percentage</label>
                        <div className="flex items-center">
                          <input type="number" value={inst.percentage || ""} onChange={(e) => handleUpdateInstallment(inst.id, { percentage: Number(e.target.value) })} className="w-full bg-transparent border-0 p-0 text-lg font-bold text-slate-700 focus:ring-0" placeholder="0" />
                          <span className="text-slate-400 text-sm font-medium">%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Amount</label>
                        <div className="text-sm font-medium text-slate-500 pt-1">${inst.percentage ? formatNumber((unitPrice * inst.percentage) / 100) : formatNumber(inst.amount || 0)}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Calendar size={12} className="text-slate-400" />
                      <input type="date" value={inst.dueDate} onChange={(e) => handleUpdateInstallment(inst.id, { dueDate: e.target.value })} className="bg-transparent border-0 p-0 text-xs font-medium text-slate-500 focus:ring-0" />
                    </div>
                  </motion.div>
                ))}

                {customInstallments.length === 0 && (
                  <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-400 font-medium">No installments yet</p>
                    <p className="text-xs text-slate-300">Select a plan or create custom</p>
                  </div>
                )}

                <div className="pt-2 gap-2 flex flex-col">
                  <BulkAddSection
                    onAdd={(c, p, f, s) => {
                      /* logic */ const newInsts = [];
                      let date = new Date(s);
                      for (let k = 0; k < c; k++) {
                        newInsts.push({ id: `bulk-${Date.now()}-${k}`, name: `Installment ${customInstallments.length + k + 1}`, percentage: p, amount: null, dueDate: date.toISOString().split("T")[0] });
                        if (f === "monthly") date.setMonth(date.getMonth() + 1);
                        else if (f === "quarterly") date.setMonth(date.getMonth() + 3);
                        else date.setFullYear(date.getFullYear() + 1);
                      }
                      setCustomInstallments([...customInstallments, ...newInsts]);
                    }}
                  />
                  <button onClick={handleAddInstallment} className="w-full py-4 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Single Installment
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Scheduled</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${customInstallments.reduce((s, i) => s + (i.percentage || 0), 0) === 100 ? "text-emerald-600" : "text-amber-500"}`}>{customInstallments.reduce((s, i) => s + (i.percentage || 0), 0)}%</span>
                    <span className="text-sm text-slate-400 font-medium">of 100%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-800">${formatNumber(customInstallments.reduce((s, i) => s + (i.percentage ? (unitPrice * i.percentage) / 100 : i.amount || 0), 0))}</p>
                </div>
              </div>
              <button onClick={handleSubmit} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
                Confirm Schedule
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default Design1;
