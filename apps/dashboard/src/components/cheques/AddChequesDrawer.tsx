import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useChequesStore,
  generateDraftInstallments,
  type PendingConfirmation,
  type DraftInstallment,
} from "../../store/chequesStore";
import { useDrawerDimmer } from "../../hooks/useDrawerDimmer";

const labelClass = "text-[10px] font-semibold text-gray-500 mb-1 block";

// Dummy clients with lead IDs and phone numbers
const AVAILABLE_CLIENTS = [
  { clientId: "cli-001", clientName: "Ahmed Hassan", leadId: "LD-1001", phone: "01001234567" },
  { clientId: "cli-002", clientName: "Sara Mohamed", leadId: "LD-1002", phone: "01112345678" },
  { clientId: "cli-003", clientName: "Khaled Mostafa", leadId: "LD-1003", phone: "01223456789" },
  { clientId: "cli-004", clientName: "Nadia El-Sayed", leadId: "LD-1004", phone: "01034567890" },
  { clientId: "cli-005", clientName: "Omar Farouk", leadId: "LD-1005", phone: "01145678901" },
  { clientId: "cli-006", clientName: "Fatma Ali", leadId: "LD-1006", phone: "01256789012" },
  { clientId: "cli-007", clientName: "Hassan El-Din", leadId: "LD-1007", phone: "01067890123" },
  { clientId: "cli-008", clientName: "Mona Ibrahim", leadId: "LD-1008", phone: "01178901234" },
  { clientId: "cli-009", clientName: "Youssef Kamal", leadId: "LD-1009", phone: "01289012345" },
  { clientId: "cli-010", clientName: "Layla Abdel-Rahim", leadId: "LD-1010", phone: "01090123456" },
];

// Dummy payment plan templates per unit (keyed by unitCode)
interface PlanTemplate {
  id: string;
  name: string;
  downPaymentPct: number;
  years: number;
  gapPattern: "monthly" | "quarterly" | "semi-annual" | "annual";
}

const UNIT_PLANS: Record<string, PlanTemplate[]> = {
  "A-101": [
    { id: "pl-a101-1", name: "8-Year Quarterly — 15% DP", downPaymentPct: 15, years: 8, gapPattern: "quarterly" },
    { id: "pl-a101-2", name: "6-Year Quarterly — 20% DP", downPaymentPct: 20, years: 6, gapPattern: "quarterly" },
    { id: "pl-a101-3", name: "10-Year Semi-Annual — 10% DP", downPaymentPct: 10, years: 10, gapPattern: "semi-annual" },
  ],
  "A-204": [
    { id: "pl-a204-1", name: "6-Year Quarterly — 10% DP", downPaymentPct: 10, years: 6, gapPattern: "quarterly" },
    { id: "pl-a204-2", name: "4-Year Monthly — 20% DP", downPaymentPct: 20, years: 4, gapPattern: "monthly" },
  ],
  "B-205": [
    { id: "pl-b205-1", name: "7-Year Quarterly — 10% DP", downPaymentPct: 10, years: 7, gapPattern: "quarterly" },
    { id: "pl-b205-2", name: "5-Year Monthly — 15% DP", downPaymentPct: 15, years: 5, gapPattern: "monthly" },
  ],
  "C-310": [
    { id: "pl-c310-1", name: "10-Year Quarterly — 20% DP", downPaymentPct: 20, years: 10, gapPattern: "quarterly" },
    { id: "pl-c310-2", name: "8-Year Semi-Annual — 15% DP", downPaymentPct: 15, years: 8, gapPattern: "semi-annual" },
    { id: "pl-c310-3", name: "6-Year Quarterly — 25% DP", downPaymentPct: 25, years: 6, gapPattern: "quarterly" },
  ],
  "C-415": [
    { id: "pl-c415-1", name: "6-Year Quarterly — 15% DP", downPaymentPct: 15, years: 6, gapPattern: "quarterly" },
  ],
  "D-102": [
    { id: "pl-d102-1", name: "6-Year Quarterly — 12% DP", downPaymentPct: 12, years: 6, gapPattern: "quarterly" },
    { id: "pl-d102-2", name: "8-Year Quarterly — 10% DP", downPaymentPct: 10, years: 8, gapPattern: "quarterly" },
  ],
  "E-501": [
    { id: "pl-e501-1", name: "8-Year Quarterly — 15% DP", downPaymentPct: 15, years: 8, gapPattern: "quarterly" },
    { id: "pl-e501-2", name: "10-Year Semi-Annual — 10% DP", downPaymentPct: 10, years: 10, gapPattern: "semi-annual" },
  ],
  "F-203": [
    { id: "pl-f203-1", name: "6-Year Quarterly — 10% DP", downPaymentPct: 10, years: 6, gapPattern: "quarterly" },
  ],
  "G-107": [
    { id: "pl-g107-1", name: "7-Year Quarterly — 12% DP", downPaymentPct: 12, years: 7, gapPattern: "quarterly" },
    { id: "pl-g107-2", name: "5-Year Monthly — 15% DP", downPaymentPct: 15, years: 5, gapPattern: "monthly" },
  ],
  "G-401": [
    { id: "pl-g401-1", name: "6-Year Quarterly — 15% DP", downPaymentPct: 15, years: 6, gapPattern: "quarterly" },
  ],
  "H-108": [
    { id: "pl-h108-1", name: "10-Year Quarterly — 20% DP", downPaymentPct: 20, years: 10, gapPattern: "quarterly" },
    { id: "pl-h108-2", name: "8-Year Semi-Annual — 15% DP", downPaymentPct: 15, years: 8, gapPattern: "semi-annual" },
  ],
  "J-305": [
    { id: "pl-j305-1", name: "6-Year Quarterly — 10% DP", downPaymentPct: 10, years: 6, gapPattern: "quarterly" },
  ],
  "K-201": [
    { id: "pl-k201-1", name: "7-Year Quarterly — 12% DP", downPaymentPct: 12, years: 7, gapPattern: "quarterly" },
    { id: "pl-k201-2", name: "5-Year Monthly — 20% DP", downPaymentPct: 20, years: 5, gapPattern: "monthly" },
  ],
  "K-502": [
    { id: "pl-k502-1", name: "8-Year Quarterly — 15% DP", downPaymentPct: 15, years: 8, gapPattern: "quarterly" },
    { id: "pl-k502-2", name: "6-Year Quarterly — 20% DP", downPaymentPct: 20, years: 6, gapPattern: "quarterly" },
  ],
  "L-104": [
    { id: "pl-l104-1", name: "6-Year Quarterly — 12% DP", downPaymentPct: 12, years: 6, gapPattern: "quarterly" },
  ],
};

const GAP_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  "semi-annual": "Semi-Annual",
  annual: "Annual",
};

// Dummy available units (in reality this would come from the compounds/units store)
const AVAILABLE_UNITS = [
  { unitCode: "A-101", compound: "Nile View Residences", price: 5_000_000 },
  { unitCode: "A-204", compound: "Nile View Residences", price: 3_200_000 },
  { unitCode: "B-205", compound: "Nile View Residences", price: 3_400_000 },
  { unitCode: "C-310", compound: "Palm Hills Gardens", price: 8_200_000 },
  { unitCode: "C-415", compound: "Palm Hills Gardens", price: 2_800_000 },
  { unitCode: "D-102", compound: "Palm Hills Gardens", price: 4_500_000 },
  { unitCode: "E-501", compound: "Sunset Bay", price: 6_800_000 },
  { unitCode: "F-203", compound: "Sunset Bay", price: 2_900_000 },
  { unitCode: "G-107", compound: "Nile View Residences", price: 3_600_000 },
  { unitCode: "G-401", compound: "Nile View Residences", price: 4_200_000 },
  { unitCode: "H-108", compound: "Palm Hills Gardens", price: 7_500_000 },
  { unitCode: "J-305", compound: "Sunset Bay", price: 3_100_000 },
  { unitCode: "K-201", compound: "Nile View Residences", price: 3_800_000 },
  { unitCode: "K-502", compound: "Palm Hills Gardens", price: 5_200_000 },
  { unitCode: "L-104", compound: "Sunset Bay", price: 4_100_000 },
];

function makeId() {
  return `pend-new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const AddChequesDrawer = () => {
  const navigate = useNavigate();
  const isOpen = useChequesStore((s) => s.isDrawerOpen);
  useDrawerDimmer(isOpen);
  const closeDrawer = useChequesStore((s) => s.closeDrawer);
  const addPendingConfirmation = useChequesStore((s) => s.addPendingConfirmation);

  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<typeof AVAILABLE_CLIENTS[number] | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const [unitSearch, setUnitSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const unitInputRef = useRef<HTMLInputElement>(null);

  const [planSearch, setPlanSearch] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);

  // Client search: match by name, lead ID, or phone
  const clientSuggestions = useMemo(() => {
    const q = clientSearch.toLowerCase().trim();
    if (!q) return AVAILABLE_CLIENTS;
    return AVAILABLE_CLIENTS.filter(
      (c) =>
        c.clientName.toLowerCase().includes(q) ||
        c.leadId.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [clientSearch]);

  // Unit search: match by unit code, compound, or price
  const unitSuggestions = useMemo(() => {
    const q = unitSearch.toLowerCase().trim();
    if (!q) return AVAILABLE_UNITS;
    return AVAILABLE_UNITS.filter(
      (u) =>
        u.unitCode.toLowerCase().includes(q) ||
        u.compound.toLowerCase().includes(q) ||
        u.price.toLocaleString().includes(q)
    );
  }, [unitSearch]);

  // Payment plan search: depends on selected unit
  const availablePlans = useMemo(() => selectedUnit ? (UNIT_PLANS[selectedUnit] ?? []) : [], [selectedUnit]);
  const planSuggestions = useMemo(() => {
    const q = planSearch.toLowerCase().trim();
    if (!q) return availablePlans;
    return availablePlans.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.gapPattern.toLowerCase().includes(q) ||
        String(p.downPaymentPct).includes(q) ||
        String(p.years).includes(q)
    );
  }, [planSearch, availablePlans]);

  const unit = AVAILABLE_UNITS.find((u) => u.unitCode === selectedUnit);
  const selectedPlan = availablePlans.find((p) => p.id === selectedPlanId);
  const isValid = selectedClient && selectedUnit && unit && selectedPlanId && selectedPlan;

  const resetForm = () => {
    setClientSearch("");
    setSelectedClient(null);
    setShowClientDropdown(false);
    setUnitSearch("");
    setSelectedUnit("");
    setShowUnitDropdown(false);
    setPlanSearch("");
    setSelectedPlanId("");
    setShowPlanDropdown(false);
  };

  const handleClose = () => {
    closeDrawer();
    resetForm();
  };

  const handleNext = () => {
    if (!isValid || !unit || !selectedClient || !selectedPlan) return;

    const pendingId = makeId();
    const today = new Date().toISOString().slice(0, 10);

    const pending: PendingConfirmation = {
      id: pendingId,
      clientName: selectedClient.clientName,
      clientId: selectedClient.clientId,
      unitCode: unit.unitCode,
      compound: unit.compound,
      contractDate: today,
      paymentPlanName: selectedPlan.name,
      unitPrice: unit.price,
      installments: [],
      createdAt: today,
      planDownPaymentPct: selectedPlan.downPaymentPct,
      planYears: selectedPlan.years,
    };

    addPendingConfirmation(pending);
    resetForm();
    navigate(`/cheques/confirm/${pendingId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 z-60"
            onClick={handleClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl z-70 flex flex-col sm:rounded-l-2xl"
          >
            {/* Header */}
            <div className="h-12 border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
              <h2 className="text-sm font-bold text-gray-900">Create Cheques Wallet</h2>
              <button onClick={handleClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <div className="text-sm font-bold text-gray-900 mb-1">Wallet Details</div>
                <div className="text-xs text-gray-400">Select client, unit, and payment plan to create a new cheques wallet.</div>
              </div>

              {/* Client Name */}
              <div className="relative">
                <label className={labelClass}>Client Name</label>
                {selectedClient ? (
                  <div className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                        {selectedClient.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-700">{selectedClient.clientName}</span>
                      <span className="text-[10px] text-gray-400">{selectedClient.leadId}</span>
                    </div>
                    <button
                      onClick={() => { setSelectedClient(null); setClientSearch(""); }}
                      className="w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => { setClientSearch(e.target.value); setShowClientDropdown(true); }}
                      onFocus={() => setShowClientDropdown(true)}
                      placeholder="Search by name, lead ID, or phone..."
                      className="w-full h-10 pl-9 pr-3.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>
                )}
                {showClientDropdown && !selectedClient && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowClientDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-52 overflow-y-auto py-1">
                      {clientSuggestions.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-gray-400 text-center">No clients found</div>
                      ) : (
                        clientSuggestions.map((c) => (
                          <button
                            key={c.clientId}
                            onClick={() => {
                              setSelectedClient(c);
                              setClientSearch("");
                              setShowClientDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                {c.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">{c.clientName}</span>
                                <div className="text-[10px] text-gray-400 mt-0.5">{c.leadId} · {c.phone}</div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Unit */}
              <div className="relative">
                <label className={labelClass}>Unit</label>
                {selectedUnit && unit ? (
                  <div className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{unit.unitCode} — {unit.compound}</span>
                    <button
                      onClick={() => { setSelectedUnit(""); setUnitSearch(""); setSelectedPlanId(""); setPlanSearch(""); }}
                      className="w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      ref={unitInputRef}
                      type="text"
                      value={unitSearch}
                      onChange={(e) => { setUnitSearch(e.target.value); setShowUnitDropdown(true); }}
                      onFocus={() => setShowUnitDropdown(true)}
                      placeholder="Search by unit code or compound..."
                      className="w-full h-10 pl-9 pr-3.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>
                )}
                {showUnitDropdown && !selectedUnit && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUnitDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-52 overflow-y-auto py-1">
                      {unitSuggestions.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-gray-400 text-center">No units found</div>
                      ) : (
                        unitSuggestions.map((u) => (
                          <button
                            key={u.unitCode}
                            onClick={() => {
                              setSelectedUnit(u.unitCode);
                              setUnitSearch("");
                              setShowUnitDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 flex items-center justify-between transition-colors"
                          >
                            <div>
                              <span className="font-medium text-gray-700">{u.unitCode}</span>
                              <span className="text-gray-400 ml-1.5">— {u.compound}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">EGP {u.price.toLocaleString()}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Payment Plan */}
              <div className="relative">
                <label className={labelClass}>Payment Plan</label>
                {!selectedUnit ? (
                  <div className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg bg-gray-100 flex items-center text-gray-400 cursor-not-allowed">
                    Select a unit first...
                  </div>
                ) : selectedPlan ? (
                  <div className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-gray-700 truncate">{selectedPlan.name}</span>
                    </div>
                    <button
                      onClick={() => { setSelectedPlanId(""); setPlanSearch(""); }}
                      className="w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={planSearch}
                      onChange={(e) => { setPlanSearch(e.target.value); setShowPlanDropdown(true); }}
                      onFocus={() => setShowPlanDropdown(true)}
                      placeholder="Search plans..."
                      className="w-full h-10 pl-9 pr-3.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>
                )}
                {showPlanDropdown && selectedUnit && !selectedPlan && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowPlanDropdown(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-52 overflow-y-auto py-1">
                      {planSuggestions.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-gray-400 text-center">No plans found</div>
                      ) : (
                        planSuggestions.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedPlanId(p.id);
                              setPlanSearch("");
                              setShowPlanDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-gray-700">{p.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {p.downPaymentPct}% down · {p.years} years · {GAP_LABELS[p.gapPattern]}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Selected unit preview */}
              {unit && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-4 space-y-2"
                >
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Selected Unit</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{unit.unitCode}</div>
                      <div className="text-xs text-gray-500">{unit.compound}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">EGP {unit.price.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400">Unit Price</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50/50 shrink-0">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={handleClose} className="h-9 px-4 text-xs text-gray-600">
                  Cancel
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isValid}
                  className="h-9 px-5 bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium shadow-sm disabled:opacity-40 gap-1.5"
                >
                  Create Wallet
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddChequesDrawer;
