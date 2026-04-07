import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useChequesStore,
  generateDraftInstallments,
  type PendingConfirmation,
  type DraftInstallment,
} from "../../store/chequesStore";

const labelClass = "text-[10px] font-semibold text-gray-500 mb-1 block";

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
  const closeDrawer = useChequesStore((s) => s.closeDrawer);
  const addPendingConfirmation = useChequesStore((s) => s.addPendingConfirmation);
  const allCheques = useChequesStore((s) => s.cheques);

  const [clientName, setClientName] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Derive existing clients for autocomplete
  const existingClients = useMemo(() => {
    const map = new Map<string, { clientName: string; unitCode: string; compound: string }>();
    allCheques.forEach((c) => {
      if (!map.has(c.clientId)) map.set(c.clientId, { clientName: c.clientName, unitCode: c.unitCode, compound: c.compound });
    });
    return [...map.values()];
  }, [allCheques]);

  const suggestions = clientName.length > 0
    ? existingClients.filter((c) => c.clientName.toLowerCase().includes(clientName.toLowerCase()))
    : existingClients;

  const unit = AVAILABLE_UNITS.find((u) => u.unitCode === selectedUnit);
  const isValid = clientName.trim() && selectedUnit && unit;

  const resetForm = () => {
    setClientName("");
    setSelectedUnit("");
    setShowSuggestions(false);
  };

  const handleClose = () => {
    closeDrawer();
    resetForm();
  };

  const handleNext = () => {
    if (!isValid || !unit) return;

    const pendingId = makeId();
    const clientId = `cli-${clientName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    // Create empty pending with no installments — user picks plan on confirm page
    const pending: PendingConfirmation = {
      id: pendingId,
      clientName: clientName.trim(),
      clientId,
      unitCode: unit.unitCode,
      compound: unit.compound,
      contractDate: today,
      paymentPlanName: "Custom",
      unitPrice: unit.price,
      installments: [],
      createdAt: today,
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
              <h2 className="text-sm font-bold text-gray-900">Add Cheques</h2>
              <button onClick={handleClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <div className="text-sm font-bold text-gray-900 mb-1">Client & Unit</div>
                <div className="text-xs text-gray-400">Select client and unit, then configure cheques on the next screen.</div>
              </div>

              {/* Client Name */}
              <div className="relative">
                <label className={labelClass}>Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => { setClientName(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Start typing a name..."
                  className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-44 overflow-y-auto py-1">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setClientName(s.clientName);
                            setShowSuggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                              {s.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="font-medium text-gray-700">{s.clientName}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">{s.unitCode} · {s.compound}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Unit */}
              <div>
                <label className={labelClass}>Unit</label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 bg-white cursor-pointer"
                >
                  <option value="">Select unit...</option>
                  {AVAILABLE_UNITS.map((u) => (
                    <option key={u.unitCode} value={u.unitCode}>
                      {u.unitCode} — {u.compound} — EGP {u.price.toLocaleString()}
                    </option>
                  ))}
                </select>
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
                  Configure Cheques
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
