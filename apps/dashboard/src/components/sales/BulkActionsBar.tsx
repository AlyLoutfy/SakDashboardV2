import { useState, useEffect, useCallback } from "react";
import { FileText, GitCompareArrows, Share2, Star, Download, X, Check, ChevronDown, ChevronUp, Sparkles, Building2, Loader2, CheckCircle2, FileCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCompoundsStore, type Unit } from "../../store/compoundsStore";
import { useSalesStore, type PaymentPlan } from "../../store/salesStore";
import { motion, AnimatePresence } from "framer-motion";
import CompareUnitsDrawer from "./CompareUnitsDrawer";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface BulkActionsBarProps {
  compoundId: string;
}

const BulkActionsBar = ({ compoundId }: BulkActionsBarProps) => {
  const { selectedUnitIds, clearSelection, getUnitById } = useCompoundsStore();
  const { paymentPlans } = useSalesStore();
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);

  const selectedUnits = selectedUnitIds.map((id) => getUnitById(id)).filter((u): u is Unit => !!u && u.compoundId === compoundId);

  if (selectedUnits.length === 0) return null;

  const handleCompare = () => {
    if (selectedUnits.length < 2 || selectedUnits.length > 4) return;
    setShowCompareDrawer(true);
  };

  const handleRemoveFromCompare = (unitId: string) => {
    const { toggleUnitSelection } = useCompoundsStore.getState();
    toggleUnitSelection(unitId);
  };

  const handleShare = () => {
    alert(`Share link generated for ${selectedUnits.length} unit(s): ${selectedUnits.map((u) => u.id).join(", ")}`);
  };

  const handleShortlist = () => {
    alert(`${selectedUnits.length} unit(s) added to your shortlist!`);
  };

  const handleExport = () => {
    alert(`Exporting data for ${selectedUnits.length} unit(s) to Excel...`);
  };

  return (
    <>
      {/* Floating Action Bar */}
      <AnimatePresence>
        <motion.div initial={{ y: 80, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 80, opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 22, stiffness: 300 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 px-2 py-2 bg-slate-900 rounded-2xl shadow-2xl shadow-black/30 border border-slate-700/50">
            {/* Selected Count */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white select-none">
              <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold">{selectedUnits.length}</div>
              <span className="text-slate-300 hidden sm:inline">selected</span>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-slate-700 mx-1" />

            {/* Action Buttons */}
            <TooltipProvider delayDuration={200}>
              {/* Generate Offers */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setShowOfferDrawer(true)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-500/20 transition-all duration-200 group" id="action-generate-offers">
                    <FileText size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12}>
                  Generate Offers
                </TooltipContent>
              </Tooltip>

              {/* Compare Units */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleCompare} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group ${selectedUnits.length >= 2 ? "text-slate-300 hover:text-white hover:bg-purple-500/20" : "text-slate-600 cursor-not-allowed"}`} disabled={selectedUnits.length < 2} id="action-compare-units">
                    <GitCompareArrows size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12}>
                  {selectedUnits.length >= 2 ? "Compare Units Side by Side" : "Select at least 2 units to compare"}
                </TooltipContent>
              </Tooltip>

              {/* Share / Send to Client */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleShare} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-200 group" id="action-share-units">
                    <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12}>
                  Share / Send to Client
                </TooltipContent>
              </Tooltip>

              {/* Add to Shortlist */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleShortlist} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-amber-500/20 transition-all duration-200 group" id="action-shortlist-units">
                    <Star size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12}>
                  Add to Shortlist
                </TooltipContent>
              </Tooltip>

              {/* Export to Excel */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleExport} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-500/20 transition-all duration-200 group" id="action-export-units">
                    <Download size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12}>
                  Export to Excel
                </TooltipContent>
              </Tooltip>

              {/* Divider */}
              <div className="w-px h-7 bg-slate-700 mx-1" />

              {/* Clear Selection */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={clearSelection} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/15 transition-all duration-200 group" id="action-clear-selection">
                    <X size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12}>
                  Clear Selection
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Generate Offers Drawer */}
      <AnimatePresence>{showOfferDrawer && <OfferGenerationDrawer units={selectedUnits} paymentPlans={paymentPlans} onClose={() => setShowOfferDrawer(false)} />}</AnimatePresence>

      {/* Compare Units Drawer */}
      <AnimatePresence>{showCompareDrawer && <CompareUnitsDrawer units={selectedUnits.slice(0, 4)} onClose={() => setShowCompareDrawer(false)} onRemoveUnit={handleRemoveFromCompare} />}</AnimatePresence>
    </>
  );
};

// ─── Offer Generation Drawer ─────────────────────────────────────────

type DrawerPhase = "select" | "generating" | "complete";

interface GeneratingUnit {
  unitId: string;
  planCount: number;
  status: "waiting" | "generating" | "done";
}

interface OfferGenerationDrawerProps {
  units: Unit[];
  paymentPlans: PaymentPlan[];
  onClose: () => void;
}

const OfferGenerationDrawer = ({ units, paymentPlans, onClose }: OfferGenerationDrawerProps) => {
  // Track which plans are selected per unit
  const [selectedPlans, setSelectedPlans] = useState<Record<string, Set<string>>>(() => {
    const initial: Record<string, Set<string>> = {};
    units.forEach((u) => {
      initial[u.id] = new Set(paymentPlans.length > 0 ? [paymentPlans[0].id] : []);
    });
    return initial;
  });

  const [expandedUnit, setExpandedUnit] = useState<string | null>(units.length === 1 ? units[0].id : null);
  const [phase, setPhase] = useState<DrawerPhase>("select");
  const [generatingUnits, setGeneratingUnits] = useState<GeneratingUnit[]>([]);
  const [progress, setProgress] = useState(0);

  const togglePlan = (unitId: string, planId: string) => {
    setSelectedPlans((prev) => {
      const next = { ...prev };
      const unitPlans = new Set(next[unitId] || []);
      if (unitPlans.has(planId)) {
        unitPlans.delete(planId);
      } else {
        unitPlans.add(planId);
      }
      next[unitId] = unitPlans;
      return next;
    });
  };

  const selectAllPlans = (unitId: string) => {
    setSelectedPlans((prev) => {
      const next = { ...prev };
      const unitPlans = new Set(next[unitId] || []);
      const allSelected = paymentPlans.every((p) => unitPlans.has(p.id));
      if (allSelected) {
        next[unitId] = new Set();
      } else {
        next[unitId] = new Set(paymentPlans.map((p) => p.id));
      }
      return next;
    });
  };

  const totalOffers = Object.values(selectedPlans).reduce((sum, planSet) => sum + planSet.size, 0);
  const hasAnySelection = totalOffers > 0;

  // ─── Generating Animation ─────────────────────────────────────────
  const runGeneratingAnimation = useCallback(() => {
    // Build the list of units being generated
    const genUnits: GeneratingUnit[] = units
      .filter((u) => (selectedPlans[u.id]?.size || 0) > 0)
      .map((u) => ({
        unitId: u.id,
        planCount: selectedPlans[u.id]?.size || 0,
        status: "waiting" as const,
      }));

    setGeneratingUnits(genUnits);
    setPhase("generating");
    setProgress(0);

    const totalSteps = genUnits.length;
    let currentStep = 0;

    const processNext = () => {
      if (currentStep >= totalSteps) {
        // All done
        setProgress(100);
        setTimeout(() => {
          setPhase("complete");
        }, 400);
        return;
      }

      // Mark current as generating
      setGeneratingUnits((prev) => prev.map((u, i) => (i === currentStep ? { ...u, status: "generating" } : u)));

      // Simulate generation time (800-1500ms per unit)
      const delay = 800 + Math.random() * 700;
      setTimeout(() => {
        // Mark current as done
        setGeneratingUnits((prev) => prev.map((u, i) => (i === currentStep ? { ...u, status: "done" } : u)));
        currentStep++;
        setProgress(Math.round((currentStep / totalSteps) * 100));

        // Small pause before next
        setTimeout(processNext, 200);
      }, delay);
    };

    // Start after a brief moment
    setTimeout(processNext, 300);
  }, [units, selectedPlans]);

  const handleGenerate = () => {
    runGeneratingAnimation();
  };

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "select") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, phase]);

  return (
    <>
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/25 z-[60]" onClick={phase === "select" ? onClose : undefined} />

      {/* Drawer */}
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[61] flex flex-col rounded-l-2xl overflow-hidden">
        {/* ───────────── PHASE: SELECT ───────────── */}
        <AnimatePresence mode="wait">
          {phase === "select" && (
            <motion.div key="select" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-shrink-0 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                      <Sparkles className="text-white" size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Generate Offers</h2>
                      <p className="text-[11px] text-gray-500">
                        Select payment plans for {units.length} unit{units.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Unit List with Plan Selection */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {units.map((unit) => {
                  const unitPlans = selectedPlans[unit.id] || new Set();
                  const isExpanded = expandedUnit === unit.id;
                  const allPlansSelected = paymentPlans.every((p) => unitPlans.has(p.id));

                  return (
                    <div key={unit.id} className="rounded-xl border border-gray-200 overflow-hidden transition-all hover:border-gray-300">
                      {/* Unit Header */}
                      <button onClick={() => setExpandedUnit(isExpanded ? null : unit.id)} className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Building2 size={14} className="text-gray-500" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs">{unit.id}</span>
                              <span className="text-[10px] text-gray-400">•</span>
                              <span className="text-[10px] text-gray-500">{unit.type}</span>
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {unit.bua} m² · {formatCurrency(unit.price)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${unitPlans.size > 0 ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-gray-100 text-gray-400"}`}>
                            {unitPlans.size} plan{unitPlans.size !== 1 ? "s" : ""}
                          </div>
                          {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </div>
                      </button>

                      {/* Payment Plans */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
                              {/* Select All Toggle */}
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Payment Plans</span>
                                <button onClick={() => selectAllPlans(unit.id)} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                  {allPlansSelected ? "Deselect All" : "Select All"}
                                </button>
                              </div>

                              {/* Plan Options */}
                              <div className="space-y-1.5">
                                {paymentPlans.map((plan) => {
                                  const isSelected = unitPlans.has(plan.id);
                                  return (
                                    <label key={plan.id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${isSelected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                                      <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>{isSelected && <Check size={10} className="text-white" />}</div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800">{plan.name}</p>
                                        <p className="text-[10px] text-gray-500">
                                          {plan.installments.length} installment
                                          {plan.installments.length !== 1 ? "s" : ""}
                                          {" · "}
                                          {plan.installments[0]?.name}: {plan.installments[0]?.percentage}%
                                        </p>
                                      </div>
                                      <input type="checkbox" checked={isSelected} onChange={() => togglePlan(unit.id, plan.id)} className="sr-only" />
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span className="font-bold text-gray-700">{totalOffers}</span> offer{totalOffers !== 1 ? "s" : ""} will be generated
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleGenerate} disabled={!hasAnySelection} className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${hasAnySelection ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600 active:scale-[0.98]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                      <FileText size={14} />
                      Generate Offers
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───────────── PHASE: GENERATING ───────────── */}
          {phase === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-shrink-0 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                      <Loader2 className="text-white" size={16} />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Generating Offers...</h2>
                    <p className="text-[11px] text-gray-500">Please wait while we prepare your documents</p>
                  </div>
                </div>
              </div>

              {/* Progress Area */}
              <div className="flex-1 overflow-y-auto px-5 py-6">
                {/* Overall Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">Overall Progress</span>
                    <span className="text-xs font-bold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    {generatingUnits.filter((u) => u.status === "done").length} of {generatingUnits.length} units processed
                  </p>
                </div>

                {/* Per-Unit Progress */}
                <div className="space-y-3">
                  {generatingUnits.map((gu, index) => {
                    const unit = units.find((u) => u.id === gu.unitId);
                    return (
                      <motion.div key={gu.unitId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${gu.status === "done" ? "bg-emerald-50/50 border-emerald-200" : gu.status === "generating" ? "bg-blue-50/50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {gu.status === "done" ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }} className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <CheckCircle2 size={16} className="text-emerald-600" />
                            </motion.div>
                          ) : gu.status === "generating" ? (
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                <Loader2 size={16} className="text-blue-600" />
                              </motion.div>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FileText size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Unit Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${gu.status === "done" ? "text-emerald-800" : gu.status === "generating" ? "text-blue-800" : "text-gray-500"}`}>{unit?.id || gu.unitId}</p>
                          <p className="text-[10px] text-gray-400">
                            {gu.planCount} offer{gu.planCount !== 1 ? "s" : ""}
                            {gu.status === "generating" && (
                              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} className="ml-1 text-blue-500">
                                — Generating...
                              </motion.span>
                            )}
                            {gu.status === "done" && <span className="ml-1 text-emerald-600">— Complete</span>}
                          </p>
                        </div>

                        {/* Mini progress dots for each plan */}
                        <div className="flex gap-1 flex-shrink-0">
                          {Array.from({ length: gu.planCount }).map((_, i) => (
                            <motion.div key={i} className={`w-1.5 h-1.5 rounded-full ${gu.status === "done" ? "bg-emerald-400" : gu.status === "generating" ? "bg-blue-400" : "bg-gray-300"}`} animate={gu.status === "generating" ? { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] } : {}} transition={gu.status === "generating" ? { duration: 0.8, repeat: Infinity, delay: i * 0.15 } : {}} />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ───────────── PHASE: COMPLETE ───────────── */}
          {phase === "complete" && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-shrink-0 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                    <FileCheck className="text-white" size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Offers Generated!</h2>
                    <p className="text-[11px] text-gray-500">All documents are ready to download</p>
                  </div>
                </div>
              </div>

              {/* Success Content */}
              <div className="flex-1 overflow-y-auto px-5 py-6">
                {/* Big success icon */}
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.1 }} className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.3 }}>
                      <CheckCircle2 size={40} className="text-emerald-600" />
                    </motion.div>
                  </motion.div>
                  <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg font-bold text-gray-900 mb-1">
                    {totalOffers} Offer{totalOffers !== 1 ? "s" : ""} Ready
                  </motion.h3>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-sm text-gray-500">
                    Your offer documents have been generated successfully
                  </motion.p>
                </div>

                {/* Generated files list */}
                <div className="space-y-2">
                  {generatingUnits.map((gu, index) => {
                    const unit = units.find((u) => u.id === gu.unitId);
                    const planNames = [...(selectedPlans[gu.unitId] || [])].map((planId) => paymentPlans.find((p) => p.id === planId)?.name || planId);

                    return (
                      <motion.div key={gu.unitId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <FileCheck size={14} className="text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900">{unit?.id}</p>
                          <p className="text-[10px] text-gray-500 truncate">{planNames.join(", ")}</p>
                        </div>
                        <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors">
                          <Download size={10} />
                          PDF
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <button onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    Close
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={onClose} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition-all active:scale-[0.98]">
                      <Download size={14} />
                      Download All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default BulkActionsBar;
