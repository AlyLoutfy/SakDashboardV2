import { X, User, Phone, Mail, FileText, ChevronDown, Plus, CreditCard, Upload, Wallet, PieChart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSalesStore } from "../../store/salesStore";
import type { PaymentPlan, Installment } from "../../store/salesStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomPlanBuilder from "./CustomPlanBuilder";
import { useDrawerDimmer } from "../../hooks/useDrawerDimmer";

interface ReservationDrawerProps {
  isOpen: boolean;
  unitPrice: number;
  onSubmit?: (data: any) => void;
  isEditing?: boolean;
}

const ReservationDrawer = ({ isOpen, unitPrice, onSubmit, isEditing }: ReservationDrawerProps) => {
  useDrawerDimmer(isOpen);
  const { closeReservationDrawer, currentReservation, updateCurrentClient, updateReservationDetails, paymentPlans, setCurrentPaymentPlan, createReservation, updateReservation, editingReservationId, openWithCustomPlan } = useSalesStore();

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isCustomPlan, setIsCustomPlan] = useState(false);
  const [customInstallments, setCustomInstallments] = useState<Installment[]>([]);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [priceAdjustmentPercent, setPriceAdjustmentPercent] = useState(0);
  const [isPlanValid, setIsPlanValid] = useState(true);

  const isEditMode = isEditing !== undefined ? isEditing : !!editingReservationId;

  useEffect(() => {
    if (isOpen && currentReservation) {
      if (openWithCustomPlan && !currentReservation.paymentPlan) {
        // Auto-select custom plan when opened from table dropdown
        setIsCustomPlan(true);
        setSelectedPlanId("");
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
      } else if (currentReservation.paymentPlan) {
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
  }, [isOpen, currentReservation, openWithCustomPlan]);

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
        paymentMethod: currentReservation.paymentMethod || "Bank Transfer",
      });
    }

    closeReservationDrawer();
  };

  const handleClearPlan = () => {
    setSelectedPlanId("");
    setIsCustomPlan(false);
    setCustomInstallments([]);
    setPriceAdjustmentPercent(0);
    setIsPlanValid(true);
    setShowPlanDropdown(false);
  };

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
                  <div className="relative flex items-center gap-2">
                    <button onClick={() => setShowPlanDropdown(!showPlanDropdown)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left text-sm">
                      <span className={selectedPlanId || isCustomPlan ? "text-slate-800 font-medium" : "text-slate-400"}>{isCustomPlan ? "Custom Plan" : selectedPlanId ? paymentPlans.find((p) => p.id === selectedPlanId)?.name : "Select a payment plan..."}</span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${showPlanDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {(selectedPlanId || isCustomPlan) && (
                      <button onClick={handleClearPlan} className="shrink-0 h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors" title="Remove payment plan">
                        <X size={16} />
                      </button>
                    )}

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

                {/* Payment Schedule — Custom Plan Builder or Selected Plan */}
                {(isCustomPlan || (selectedPlanId && customInstallments.length > 0)) && <CustomPlanBuilder unitPrice={unitPrice} installments={customInstallments} onInstallmentsChange={setCustomInstallments} adjustmentPercent={priceAdjustmentPercent} onAdjustmentChange={setPriceAdjustmentPercent} onValidationChange={setIsPlanValid} />}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 shrink-0 space-y-2">
              {isCustomPlan && !isPlanValid && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-xs font-semibold text-red-600">Installments must total 100% before you can save.</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={closeReservationDrawer} className="flex-1 h-10 font-bold rounded-lg hover:bg-gray-200 text-gray-700 bg-gray-100 border border-transparent">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isCustomPlan && !isPlanValid} className={`flex-1 h-10 font-bold shadow-lg transition-all rounded-lg ${isCustomPlan && !isPlanValid ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"}`}>
                  {isEditMode ? "Save Changes" : "Create Reservation"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReservationDrawer;
