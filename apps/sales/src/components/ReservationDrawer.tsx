import { X, User, Phone, Mail, FileText, ChevronDown, Plus, Trash2, Calendar, Percent, DollarSign } from "lucide-react";
import { Button, Input } from "@heroui/react";
import { useSalesStore } from "../store/salesStore";
import type { PaymentPlan, Installment } from "../store/salesStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReservationDrawerProps {
  isOpen: boolean;
  unitPrice: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-EG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ReservationDrawer = ({ isOpen, unitPrice }: ReservationDrawerProps) => {
  const { closeReservationDrawer, currentReservation, updateCurrentClient, paymentPlans, setCurrentPaymentPlan, createReservation, updateReservation, editingReservationId } = useSalesStore();

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isCustomPlan, setIsCustomPlan] = useState(false);
  const [customInstallments, setCustomInstallments] = useState<Installment[]>([]);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);

  // Reset state when drawer opens/closes
  useEffect(() => {
    if (isOpen && currentReservation) {
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
      }
    }
  }, [isOpen, currentReservation]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setShowPlanDropdown(false);
    setIsCustomPlan(false);
    const plan = paymentPlans.find((p) => p.id === planId);
    if (plan) {
      // Clone the plan so modifications are local
      setCustomInstallments([...plan.installments]);
      setCurrentPaymentPlan({ ...plan, installments: [...plan.installments] });
    }
  };

  const handleCreateCustomPlan = () => {
    setIsCustomPlan(true);
    setSelectedPlanId("");
    setShowPlanDropdown(false);
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
    const newInstallment: Installment = {
      id: `inst-${Date.now()}`,
      name: `Installment ${customInstallments.length + 1}`,
      amount: null,
      percentage: 0,
      dueDate: new Date().toISOString().split("T")[0],
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
      if (inst.percentage) return sum + (unitPrice * inst.percentage) / 100;
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

    if (editingReservationId) {
      updateReservation(editingReservationId, {
        client: currentReservation.client,
        paymentPlan: finalPaymentPlan,
      });
    } else {
      createReservation({
        unitId: currentReservation.unitId,
        unitTitle: currentReservation.unitTitle,
        client: currentReservation.client,
        paymentPlan: finalPaymentPlan,
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={closeReservationDrawer} />

          {/* Drawer */}
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{editingReservationId ? "Edit Reservation" : "New Reservation"}</h2>
                <p className="text-sm text-slate-500">{currentReservation?.unitTitle}</p>
              </div>
              <button onClick={closeReservationDrawer} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Client Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Client Details</h3>

                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input placeholder="Client Name" value={currentReservation?.client.name || ""} onChange={(e) => updateCurrentClient({ name: e.target.value })} className="pl-10" />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input placeholder="Phone Number" value={currentReservation?.client.phone || ""} onChange={(e) => updateCurrentClient({ phone: e.target.value })} className="pl-10" />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input placeholder="Email Address" type="email" value={currentReservation?.client.email || ""} onChange={(e) => updateCurrentClient({ email: e.target.value })} className="pl-10" />
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                    <textarea placeholder="Notes (optional)" value={currentReservation?.client.notes || ""} onChange={(e) => updateCurrentClient({ notes: e.target.value })} className="w-full min-h-[80px] pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-sm" />
                  </div>
                </div>
              </div>

              {/* Payment Plan Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Payment Plan (Optional)</h3>

                {/* Plan Selector */}
                <div className="relative">
                  <button onClick={() => setShowPlanDropdown(!showPlanDropdown)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors text-left">
                    <span className={selectedPlanId || isCustomPlan ? "text-slate-800" : "text-slate-400"}>{isCustomPlan ? "Custom Plan" : selectedPlanId ? paymentPlans.find((p) => p.id === selectedPlanId)?.name : "Select a payment plan..."}</span>
                    <ChevronDown size={18} className="text-slate-400" />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showPlanDropdown && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-10 overflow-hidden">
                        {paymentPlans.map((plan) => (
                          <button key={plan.id} onClick={() => handleSelectPlan(plan.id)} className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                            <p className="font-medium text-slate-800">{plan.name}</p>
                            <p className="text-xs text-slate-500">{plan.installments.length} installments</p>
                          </button>
                        ))}
                        <button onClick={handleCreateCustomPlan} className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 text-blue-600 font-medium">
                          <Plus size={16} />
                          Create Custom Plan
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Custom Plan Builder */}
                {(isCustomPlan || (selectedPlanId && customInstallments.length > 0)) && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">Installments</p>
                      <button onClick={handleAddInstallment} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Plus size={14} />
                        Add
                      </button>
                    </div>

                    {/* Installment List */}
                    <div className="space-y-2">
                      {customInstallments.map((inst, index) => (
                        <motion.div key={inst.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <input type="text" value={inst.name} onChange={(e) => handleUpdateInstallment(inst.id, { name: e.target.value })} className="font-medium text-slate-800 bg-transparent border-none outline-none flex-1" placeholder="Installment name" />
                            {customInstallments.length > 1 && (
                              <button onClick={() => handleRemoveInstallment(inst.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {/* Percentage Input */}
                            <div className="relative">
                              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              <input
                                type="number"
                                value={inst.percentage || ""}
                                onChange={(e) =>
                                  handleUpdateInstallment(inst.id, {
                                    percentage: parseFloat(e.target.value) || 0,
                                    amount: null,
                                  })
                                }
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="Percentage"
                              />
                            </div>

                            {/* Amount Display */}
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              <input type="text" value={inst.percentage ? formatCurrency((unitPrice * inst.percentage) / 100) : inst.amount ? formatCurrency(inst.amount) : ""} readOnly className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-100 text-slate-600" placeholder="Amount" />
                            </div>
                          </div>

                          {/* Due Date */}
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="date" value={inst.dueDate} onChange={(e) => handleUpdateInstallment(inst.id, { dueDate: e.target.value })} className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Running Total */}
                    <div className={`p-4 rounded-xl border ${isValidTotal ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Total</span>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${isValidTotal ? "text-emerald-600" : "text-amber-600"}`}>{totalPercentage}%</p>
                          <p className="text-sm text-slate-500">{formatCurrency(totalAmount)} EGP</p>
                        </div>
                      </div>
                      {!isValidTotal && <p className="text-xs text-amber-600 mt-2">Total should equal 100% or {formatCurrency(unitPrice)} EGP</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3">
              <Button variant="ghost" onPress={closeReservationDrawer} className="flex-1">
                Cancel
              </Button>
              <Button onPress={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                {editingReservationId ? "Save Changes" : "Create Reservation"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReservationDrawer;
