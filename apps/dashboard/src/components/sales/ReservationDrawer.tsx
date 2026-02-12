import { X, User, Phone, Mail, FileText, ChevronDown, Plus, Trash2, Calendar, GripVertical, FileCheck, Layers, ArrowRight, CreditCard, Upload, Wallet, Percent, TrendingDown, TrendingUp, ArrowDown, ArrowUp, Tag, Sparkles, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSalesStore } from "../../store/salesStore";
import type { PaymentPlan, Installment } from "../../store/salesStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface ReservationDrawerProps {
  isOpen: boolean;
  unitPrice: number;
  onSubmit?: (data: any) => void;
  isEditing?: boolean;
}

const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to safely add months to a date string (YYYY-MM-DD)
// Keeps the same day if possible, or clamps to the last day of the target month.
// Avoids timezone shifts by working with year/month/day integers directly.
const addMonthsToDate = (dateStr: string, months: number): string => {
  const [y, m, d] = dateStr.split("-").map(Number);

  // Calculate new year and month
  // m is 1-based (01 to 12)
  let newYear = y;
  let newMonth = m + months;

  // Normalize month > 12
  while (newMonth > 12) {
    newMonth -= 12;
    newYear++;
  }
  // Normalize month < 1
  while (newMonth < 1) {
    newMonth += 12;
    newYear--;
  }

  // Determine max days in the new month
  // new Date(year, monthIndex, 0).getDate() returns last day of previous month
  // monthIndex is 0-based. newMonth is 1-based.
  // So new Date(newYear, newMonth, 0).getDate() gives last day of newMonth.
  const daysInMonth = new Date(newYear, newMonth, 0).getDate();

  // Clamp day to max days in new month
  const newDay = Math.min(d, daysInMonth);

  return `${newYear}-${String(newMonth).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`;
};

const BulkAddSection = ({ onAdd, onClose, lastInstallmentDate }: { onAdd: (count: number, percentage: number, frequency: string, startDate: string) => void; onClose: () => void; lastInstallmentDate?: string }) => {
  const [count, setCount] = useState<number | "">("");
  const [percentage, setPercentage] = useState<number | "">("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [gap, setGap] = useState<number | "">("");

  // Initialize startDate and gap when component mounts or lastInstallmentDate changes
  useEffect(() => {
    if (lastInstallmentDate) {
      setGap(1);
      setStartDate(addMonthsToDate(lastInstallmentDate, 1));
    } else {
      setGap("");
      setStartDate(new Date().toISOString().split("T")[0]);
    }
  }, [lastInstallmentDate]);

  const handleGapChange = (val: number | "") => {
    setGap(val);
    if (val !== "" && lastInstallmentDate) {
      setStartDate(addMonthsToDate(lastInstallmentDate, Number(val)));
    }
  };

  return (
    <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          <Layers size={14} className="text-blue-500" />
          Bulk Installments
        </h4>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase">Count</label>
          <input type="number" value={count} onChange={(e) => setCount(e.target.value === "" ? "" : parseInt(e.target.value))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 12" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase">Per Installment %</label>
          <div className="relative">
            <input type="number" value={percentage} onChange={(e) => setPercentage(e.target.value === "" ? "" : parseFloat(e.target.value))} className="w-full px-3 py-2 pl-3 pr-7 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 2.5" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">%</span>
          </div>
        </div>

        {lastInstallmentDate ? (
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] font-semibold text-slate-500 uppercase">Months from last installment</label>
            <input type="number" value={gap} onChange={(e) => handleGapChange(e.target.value === "" ? "" : parseInt(e.target.value))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. 1" />
          </div>
        ) : null}

        <div className="space-y-1 col-span-2">
          <label className="text-[10px] font-semibold text-slate-500 uppercase">Frequency</label>
          <div className="relative">
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          if (count && percentage) {
            onAdd(Number(count), Number(percentage), frequency, startDate);
            onClose();
          }
        }}
        disabled={!count || !percentage}
        className="w-full bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20"
      >
        Generate {count || 0} Installments
      </Button>
    </div>
  );
};

// Price Adjustment Component
const PriceAdjustment = ({ unitPrice, adjustmentPercent, onAdjustmentChange }: { unitPrice: number; adjustmentPercent: number; onAdjustmentChange: (val: number) => void }) => {
  const adjustedPrice = unitPrice * (1 + adjustmentPercent / 100);
  const priceDiff = adjustedPrice - unitPrice;
  const isDiscount = adjustmentPercent < 0;
  const isPremium = adjustmentPercent > 0;
  const hasAdjustment = adjustmentPercent !== 0;

  return (
    <div className="w-full mb-2">
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 overflow-hidden">
        {/* Input Row */}
        <div className="px-3 py-2 flex items-center gap-2.5">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap shrink-0">Adjust Price</label>
          <div className="relative flex-1 max-w-[120px]">
            <input type="number" value={adjustmentPercent || ""} onChange={(e) => onAdjustmentChange(e.target.value === "" ? 0 : parseFloat(e.target.value))} placeholder="0" className="w-full py-1 pl-2 pr-6 bg-white border border-slate-200 rounded-md outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 pointer-events-none">%</span>
          </div>
          {hasAdjustment && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${isDiscount ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
              {isDiscount ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
              {isDiscount ? "Discount" : "Premium"}
            </motion.div>
          )}
        </div>

        {/* Before / After — compact animated reveal */}
        <AnimatePresence>
          {hasAdjustment && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="overflow-hidden">
              <div className={`px-3 py-2 border-t flex items-center gap-2 ${isDiscount ? "border-emerald-100 bg-emerald-50/60" : "border-blue-100 bg-blue-50/60"}`}>
                {/* Original */}
                <span className="text-xs font-bold text-slate-400 line-through tabular-nums">{formatNumber(unitPrice)}</span>
                {/* Arrow */}
                <ArrowRight size={12} className={isDiscount ? "text-emerald-400 shrink-0" : "text-blue-400 shrink-0"} />
                {/* Adjusted */}
                <motion.span key={adjustedPrice} initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-xs font-extrabold tabular-nums ${isDiscount ? "text-emerald-700" : "text-blue-700"}`}>
                  {formatNumber(adjustedPrice)}
                </motion.span>
                {/* Diff pill */}
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

const ReservationDrawer = ({ isOpen, unitPrice, onSubmit, isEditing }: ReservationDrawerProps) => {
  const { closeReservationDrawer, currentReservation, updateCurrentClient, updateReservationDetails, paymentPlans, setCurrentPaymentPlan, createReservation, updateReservation, editingReservationId } = useSalesStore();

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isCustomPlan, setIsCustomPlan] = useState(false);
  const [customInstallments, setCustomInstallments] = useState<Installment[]>([]);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [priceAdjustmentPercent, setPriceAdjustmentPercent] = useState(0);
  const [defaultGap, setDefaultGap] = useState(3);

  // Effective price after adjustment
  const effectiveUnitPrice = unitPrice * (1 + priceAdjustmentPercent / 100);

  const isEditMode = isEditing !== undefined ? isEditing : !!editingReservationId;

  useEffect(() => {
    if (isOpen && currentReservation) {
      setIsBulkAddOpen(false);
      if (currentReservation.paymentPlan) {
        if (currentReservation.paymentPlan.isCustom) {
          setIsCustomPlan(true);
          setCustomInstallments(currentReservation.paymentPlan.installments);
          setSelectedPlanId("");
        } else {
          setSelectedPlanId(currentReservation.paymentPlan.id);
          setIsCustomPlan(false);
          setCustomInstallments([]);
        }
      } else {
        setSelectedPlanId("");
        setIsCustomPlan(false);
        setCustomInstallments([]);
        setPriceAdjustmentPercent(0);
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
    setPriceAdjustmentPercent(0);
    setCustomInstallments([
      {
        id: `inst-${Date.now()}`,
        name: "Down Payment",
        amount: null,
        percentage: 10,
        dueDate: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const handleAddInstallment = () => {
    let newDate = new Date().toISOString().split("T")[0];
    if (customInstallments.length > 0) {
      const lastDate = customInstallments[customInstallments.length - 1].dueDate;
      newDate = addMonthsToDate(lastDate, defaultGap);
    }

    const newInstallment: Installment = {
      id: `inst-${Date.now()}`,
      name: `Installment ${customInstallments.length}`,
      amount: null,
      percentage: 0,
      dueDate: newDate,
    };
    setCustomInstallments([...customInstallments, newInstallment]);
  };

  const handleUpdateInstallment = (id: string, updates: Partial<Installment>) => {
    setCustomInstallments(customInstallments.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst)));
  };

  const handleRemoveInstallment = (id: string) => {
    setCustomInstallments(customInstallments.filter((inst) => inst.id !== id));
  };

  const calculateTotalPercentage = () => {
    return customInstallments.reduce((sum, inst) => sum + (inst.percentage || 0), 0);
  };

  const calculateTotalAmount = () => {
    return customInstallments.reduce((sum, inst) => {
      if (inst.amount) return sum + inst.amount;
      if (inst.percentage) return sum + (effectiveUnitPrice * inst.percentage) / 100;
      return sum;
    }, 0);
  };

  const handleSubmit = () => {
    if (!currentReservation) return;

    let finalPaymentPlan: PaymentPlan | null = null;

    if (isCustomPlan && customInstallments.length > 0) {
      finalPaymentPlan = {
        id: `custom-${Date.now()}`,
        name: "Custom Plan",
        installments: customInstallments,
        isCustom: true,
      };
    } else if (selectedPlanId) {
      const plan = paymentPlans.find((p) => p.id === selectedPlanId);
      if (plan) {
        finalPaymentPlan = {
          ...plan,
          installments: customInstallments.length > 0 ? customInstallments : plan.installments,
        };
      }
    }

    const payload = {
      client: currentReservation.client,
      paymentPlan: finalPaymentPlan,
      paymentMethod: currentReservation.paymentMethod,
      paymentProofUrl: currentReservation.paymentProofUrl,
    };

    if (onSubmit) {
      onSubmit(payload);
    } else if (editingReservationId) {
      updateReservation(editingReservationId, payload);
    } else {
      createReservation({
        unitId: currentReservation.unitId,
        unitTitle: currentReservation.unitTitle,
        ...payload,
        paymentMethod: currentReservation.paymentMethod || "Bank Transfer", // Default or current
      });
    }

    closeReservationDrawer();
  };

  const totalPercentage = calculateTotalPercentage();
  const totalAmount = calculateTotalAmount();
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.01 || Math.abs(totalAmount - unitPrice) < 0.01;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/25 z-[60]" onClick={closeReservationDrawer} />

          {/* Drawer - Full screen on mobile */}
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white shadow-2xl z-[70] flex flex-col sm:rounded-l-2xl overflow-hidden">
            {/* Header */}
            <div className="relative px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{isEditMode ? "Edit Reservation" : "New Reservation"}</h2>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{currentReservation?.unitTitle}</p>
                </div>
                <button onClick={closeReservationDrawer} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors shrink-0 ml-3">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Client Details Section */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User size={14} className="text-blue-500" />
                  Client Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input placeholder="Client Name" value={currentReservation?.client.name || ""} onChange={(e) => updateCurrentClient({ name: e.target.value })} className="pl-9 h-10 text-sm" />
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input placeholder="National ID" value={currentReservation?.client.nationalId || ""} onChange={(e) => updateCurrentClient({ nationalId: e.target.value })} className="pl-9 h-10 text-sm" />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input placeholder="Phone Number" value={currentReservation?.client.phone || ""} onChange={(e) => updateCurrentClient({ phone: e.target.value })} className="pl-9 h-10 text-sm" />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input placeholder="Email Address" type="email" value={currentReservation?.client.email || ""} onChange={(e) => updateCurrentClient({ email: e.target.value })} className="pl-9 h-10 text-sm" />
                  </div>

                  {/* ID Upload */}
                  <div className="relative sm:col-span-2">
                    <label className="flex items-center justify-center w-full h-[42px] px-4 transition bg-white border-2 border-slate-200 border-dashed rounded-lg appearance-none cursor-pointer hover:border-slate-300 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Upload className="text-slate-400" size={16} />
                        <span className="text-sm font-medium text-slate-500">{currentReservation?.client.idDocumentUrl ? "ID Uploaded" : "Upload ID"}</span>
                      </span>
                      <input type="file" name="file_upload" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Information Section */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wallet size={14} className="text-blue-500" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none text-slate-600" value={currentReservation?.paymentMethod || ""} onChange={(e) => updateReservationDetails({ paymentMethod: e.target.value })}>
                      <option value="" disabled>
                        Select Payment Method
                      </option>
                      <option value="Cash">Cash</option>
                      <option value="Check">Check</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {/* Payment Proof Upload */}
                  <div className="relative">
                    <label className="flex items-center justify-center w-full h-[42px] px-4 transition bg-white border-2 border-slate-200 border-dashed rounded-lg appearance-none cursor-pointer hover:border-slate-300 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Upload className="text-slate-400" size={16} />
                        <span className="text-sm font-medium text-slate-500">{currentReservation?.paymentProofUrl ? "Proof Uploaded" : "Upload Payment Proof"}</span>
                      </span>
                      <input type="file" name="payment_proof" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm relative z-0">
                {/* Plan Selector & Header */}
                <div className={`p-4 ${!(isCustomPlan || (selectedPlanId && customInstallments.length > 0)) ? "" : "border-b border-slate-100"}`}>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <PieChart size={14} className="text-blue-500" />
                    Payment Plan
                  </h3>
                  <div className="relative">
                    <button onClick={() => setShowPlanDropdown(!showPlanDropdown)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left text-sm">
                      <span className={selectedPlanId || isCustomPlan ? "text-slate-800 font-medium" : "text-slate-400"}>{isCustomPlan ? "Custom Plan" : selectedPlanId ? paymentPlans.find((p) => p.id === selectedPlanId)?.name : "Select a payment plan..."}</span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${showPlanDropdown ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showPlanDropdown && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-200 shadow-xl z-50 overflow-hidden">
                          {paymentPlans.map((plan) => (
                            <button key={plan.id} onClick={() => handleSelectPlan(plan.id)} className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                              <p className="text-sm font-medium text-slate-800">{plan.name}</p>
                              <p className="text-xs text-slate-500">{plan.installments.length} installments</p>
                            </button>
                          ))}
                          <button onClick={handleCreateCustomPlan} className="w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 text-blue-600 font-medium text-sm">
                            <Plus size={14} />
                            Create Custom Plan
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Payment Schedule Document - Design 2 Style */}
                {(isCustomPlan || (selectedPlanId && customInstallments.length > 0)) && (
                  <div className="px-5 pb-5">
                    {/* Price Adjustment */}
                    {isCustomPlan && (
                      <div className="mb-4 pt-4">
                        <PriceAdjustment unitPrice={unitPrice} adjustmentPercent={priceAdjustmentPercent} onAdjustmentChange={setPriceAdjustmentPercent} />
                        <p className="text-[10px] text-slate-400 mt-1 pl-5">
                          * <span className="font-semibold text-slate-500">Price Adjustment:</span> Use <span className="font-mono font-bold text-slate-600">-</span> for discount, <span className="font-mono font-bold text-slate-600">+</span> for increase
                        </p>
                      </div>
                    )}

                    {/* Installment List */}
                    {/* Installments Table */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-2 shadow-sm">
                      {/* Header */}
                      <div className="flex justify-between items-center bg-gray-50 border-b border-gray-200 px-4 py-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Schedule</span>
                        <span className="text-xs font-bold text-gray-900 tabular-nums">{formatNumber(totalAmount)}</span>
                      </div>

                      {/* List */}
                      <div className="divide-y divide-gray-100">
                        <AnimatePresence initial={false}>
                          {customInstallments.map((inst, index) => (
                            <motion.div key={inst.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="group hover:bg-gray-50/50 transition-colors bg-white">
                              <div className="px-4 py-2.5">
                                {/* Top Row: Name and Amount */}
                                <div className="flex justify-between items-center mb-1">
                                  <input type="text" value={inst.name} onChange={(e) => handleUpdateInstallment(inst.id, { name: e.target.value })} className="font-bold text-gray-900 text-sm bg-transparent border-none outline-none p-0 focus:bg-blue-50/30 rounded w-full max-w-[200px] placeholder:text-gray-300" placeholder="Description" />

                                  <div className="flex items-center gap-3">
                                    <p className="font-bold text-gray-900 text-sm tabular-nums whitespace-nowrap">{inst.percentage ? formatNumber((effectiveUnitPrice * inst.percentage) / 100) : inst.amount ? formatNumber(inst.amount) : "—"}</p>
                                    <button onClick={() => handleRemoveInstallment(inst.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 -mr-2">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>

                                {/* Bottom Row: Date and Percentage */}
                                <div className="flex justify-between items-center">
                                  {/* Date (Left Under Name) */}
                                  <div className="relative flex items-center">
                                    <input type="date" value={inst.dueDate} onChange={(e) => handleUpdateInstallment(inst.id, { dueDate: e.target.value })} className="text-[10px] text-gray-400 font-medium bg-transparent border-none outline-none p-0 focus:text-gray-600 rounded appearance-none" />
                                  </div>

                                  {/* Percentage (Right Under Amount) */}
                                  <div className="flex items-center gap-0.5 pr-6">
                                    <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-500 group-hover:bg-white border border-transparent group-hover:border-gray-200 transition-colors">
                                      <input type="number" value={inst.percentage || ""} onChange={(e) => handleUpdateInstallment(inst.id, { percentage: parseFloat(e.target.value) || 0, amount: null })} className="bg-transparent border-none outline-none w-6 text-right p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-gray-600" placeholder="0" />
                                      <span>%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-slate-100 mt-5 -mx-5 bg-white">
                      {isBulkAddOpen ? (
                        <BulkAddSection
                          onClose={() => setIsBulkAddOpen(false)}
                          lastInstallmentDate={customInstallments.length > 0 ? customInstallments[customInstallments.length - 1].dueDate : undefined}
                          onAdd={(count, percentage, frequency, startDate) => {
                            const newInstallments: Installment[] = [];
                            let currentDate = new Date(startDate);
                            for (let i = 0; i < count; i++) {
                              newInstallments.push({
                                id: `inst-bulk-${Date.now()}-${i}`,
                                name: `Installment ${customInstallments.length + i + 1}`,
                                amount: null,
                                percentage: percentage,
                                dueDate: currentDate.toISOString().split("T")[0],
                              });
                              if (frequency === "monthly") currentDate.setMonth(currentDate.getMonth() + 1);
                              else if (frequency === "quarterly") currentDate.setMonth(currentDate.getMonth() + 3);
                              else if (frequency === "yearly") currentDate.setFullYear(currentDate.getFullYear() + 1);
                            }
                            setCustomInstallments([...customInstallments, ...newInstallments]);
                          }}
                        />
                      ) : (
                        <div className="flex flex-col divide-y divide-slate-100">
                          <button onClick={() => setIsBulkAddOpen(true)} className="w-full px-3 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-blue-600 font-medium text-sm">
                            <Layers size={16} />
                            Bulk Add Installments
                          </button>
                          <div className="w-full flex items-center">
                            <button onClick={handleAddInstallment} className="flex-1 px-3 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-600 font-medium text-sm">
                              <Plus size={16} />
                              Add Single Installment
                            </button>
                            <div className="px-3 py-3 bg-slate-50 border-l border-slate-100 flex items-center gap-2" title="Default gap in months for new installments">
                              <span className="text-[10px] uppercase font-bold text-slate-400">Gap</span>
                              <div className="relative w-10">
                                <input type="number" value={defaultGap} onChange={(e) => setDefaultGap(parseInt(e.target.value) || 0)} className="w-full pl-1 pr-1 py-1 text-center bg-white border border-slate-200 rounded text-xs font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" min="1" />
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] text-slate-400 bg-white px-0.5">Months</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className={`px-4 py-3 border-t-2 rounded-b-xl -mx-5 -mb-5 ${Math.abs(totalPercentage - 100) < 0.1 ? "border-blue-500 bg-blue-50" : "border-amber-500 bg-amber-50"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-wider ${Math.abs(totalPercentage - 100) < 0.1 ? "text-blue-700" : "text-amber-700"}`}>Total</p>
                          {Math.abs(totalPercentage - 100) >= 0.1 && <p className="text-[10px] text-amber-600 mt-0.5">Total should equal 100%</p>}
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${Math.abs(totalPercentage - 100) < 0.1 ? "text-blue-700" : "text-amber-700"}`}>{totalPercentage}%</p>
                          <p className="text-sm text-slate-600 tabular-nums">{formatNumber(totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-3 shrink-0">
              <Button variant="ghost" onClick={closeReservationDrawer} className="flex-1 h-10 font-bold rounded-lg hover:bg-gray-200 text-gray-700 bg-gray-100 border border-transparent">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all rounded-lg">
                {isEditMode ? "Save Changes" : "Create Reservation"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReservationDrawer;
