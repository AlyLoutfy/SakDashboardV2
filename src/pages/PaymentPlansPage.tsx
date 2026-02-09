import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, X, AlertCircle, CreditCard, Maximize2, Minimize2, FolderOpen, ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";
import { usePaymentPlansStore, calculatePlanSummary, formatCurrency, type PaymentPlan } from "../store/paymentPlansStore";

// Components
import PaymentPlansTable from "../components/paymentPlans/PaymentPlansTable";
import SmartBuilderBar from "../components/paymentPlans/SmartBuilderBar";
import LiveScheduleTable from "../components/paymentPlans/LiveScheduleTable";
import LiveSummaryFooter from "../components/paymentPlans/LiveSummaryFooter";

const PaymentPlansPage = () => {
  const { plans, currentPlan, isEditing, isCreating, createPlan, savePlan, deletePlan, selectPlan, duplicatePlan, cancelEdit, validatePlan, updateCurrentPlan } = usePaymentPlansStore();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  // Calculate summary and validation
  const summary = currentPlan ? calculatePlanSummary(currentPlan) : null;
  const validation = currentPlan ? validatePlan() : { isValid: false, errors: [], warnings: [] };

  // Handle save with validation
  const handleSave = () => {
    if (!validation.isValid) {
      return;
    }
    savePlan();
  };

  // Confirm delete
  const handleConfirmDelete = (id: string) => {
    deletePlan(id);
    setShowDeleteConfirm(null);
  };

  const handleLoadPlan = (plan: PaymentPlan) => {
    const duplicatedInstallments = plan.installments.map((inst) => ({ ...inst }));
    updateCurrentPlan({
      basePrice: plan.basePrice,
      discount: plan.discount,
      installments: duplicatedInstallments,
      gapPattern: plan.gapPattern,
      startDate: new Date(plan.startDate),
    });
    setShowLoadModal(false);
  };

  // Full Screen View Overlay
  if (isFullScreen && currentPlan && summary) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
        {/* Full Screen Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CreditCard size={20} className="text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentPlan.clientName || "New Payment Plan"}</h2>
              <p className="text-xs text-gray-500">Full Screen Preview</p>
            </div>
          </div>
          <Button onPress={() => setIsFullScreen(false)} variant="ghost" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium">
            <Minimize2 size={18} className="mr-2" />
            Exit Preview
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50/50 p-6">
          <div className="h-full max-w-7xl mx-auto flex flex-col shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden bg-white border border-gray-200">
            <LiveScheduleTable />
          </div>
        </div>

        {/* Footer */}
        <LiveSummaryFooter summary={summary} validation={validation} />
      </div>
    );
  }

  // List View
  if (!isEditing) {
    return (
      <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
        {/* Top Bar - matching integrations page style */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-2 text-gray-500">
            <CreditCard size={20} />
            <span className="text-base font-bold text-gray-900 leading-none">Payment Plans</span>
            <span className="text-gray-300 px-1">/</span>
            <span className="text-sm font-medium text-gray-500">All Plans</span>
          </div>
          <div className="flex gap-2">
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {plans.filter((p) => p.status === "active").length} Active
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Header */}

          {/* Plans Table */}
          <PaymentPlansTable plans={plans} onSelect={selectPlan} onDuplicate={duplicatePlan} onDelete={(id) => setShowDeleteConfirm(id)} onCreate={createPlan} />
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Payment Plan</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="ghost" onPress={() => setShowDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button onPress={() => handleConfirmDelete(showDeleteConfirm)} className="bg-red-500 text-white hover:bg-red-600">
                    Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Editing/Creating view
  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
      {/* Top Bar - matching integrations page style */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="ghost" onPress={cancelEdit} className="text-gray-500 hover:text-gray-700 w-8 h-8">
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-2 text-gray-500">
            <CreditCard size={20} />
            <span className="text-base font-bold text-gray-900 leading-none">Payment Plans</span>
            <span className="text-gray-300 px-1">/</span>
            <span className="text-sm font-medium text-gray-500">{isCreating ? "New Plan" : "Edit Plan"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onPress={() => setShowLoadModal(true)} variant="ghost" className="text-gray-600 font-medium hover:bg-gray-100">
            <FolderOpen size={16} className="mr-2" /> Load Payment Plan
          </Button>

          {/* Validation Status */}
          {!validation.isValid && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
              <AlertCircle size={14} />
              <span>
                {validation.errors.length} error{validation.errors.length > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <Button isIconOnly variant="ghost" onPress={() => setIsFullScreen(true)} className="text-gray-500 hover:text-gray-700">
            <Maximize2 size={18} />
          </Button>
          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <Button variant="ghost" onPress={cancelEdit} className="text-gray-600 text-sm">
            <X size={16} className="mr-1" />
            Cancel
          </Button>
          <Button onPress={handleSave} isDisabled={!validation.isValid} className="gap-2 bg-gray-900 text-white font-medium shadow-lg shadow-gray-200 hover:bg-gray-800 text-sm disabled:opacity-50">
            <Save size={16} />
            Save Plan
          </Button>
        </div>
      </div>
      {showLoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowLoadModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Load Existing Plan</h3>
              <Button isIconOnly size="sm" variant="ghost" onPress={() => setShowLoadModal(false)}>
                <X size={18} />
              </Button>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {plans.filter((p) => !currentPlan || p.id !== currentPlan.id).length === 0 ? (
                <div className="p-8 text-center text-gray-500">No other plans available to load from.</div>
              ) : (
                <div className="space-y-1">
                  {plans
                    .filter((p) => !currentPlan || p.id !== currentPlan.id)
                    .map((plan) => (
                      <button key={plan.id} onClick={() => handleLoadPlan(plan)} className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 text-left group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-100 transition-colors">{plan.installments.length}</div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{plan.clientName || "Untitled Plan"}</p>
                            <p className="text-xs text-gray-400">
                              {formatCurrency(plan.basePrice)} • {plan.unitCode || "No Unit"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500" />
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
        {/* Top Builder Section */}
        <div className="px-6 pt-6 pb-2 shrink-0">
          <SmartBuilderBar />
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex px-6 pb-0 gap-6 min-h-0 overflow-hidden">
          {/* Left: Table */}
          <div className="flex-1 flex flex-col min-h-0 pb-6">
            <LiveScheduleTable />
          </div>
        </div>

        {/* Footer Summary */}
        {currentPlan && summary && <LiveSummaryFooter summary={summary} validation={validation} />}
      </div>
    </div>
  );
};

export default PaymentPlansPage;
