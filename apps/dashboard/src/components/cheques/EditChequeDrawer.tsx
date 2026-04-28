import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useChequesStore,
  getStatusColor,
  getStatusLabel,
  type Cheque,
  type ChequeType,
} from "../../store/chequesStore";
import { useDrawerDimmer } from "../../hooks/useDrawerDimmer";

const labelClass = "text-[10px] font-semibold text-gray-500 mb-1 block";
const inputClass = "w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300";
const disabledInputClass = "w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed";

const TYPE_OPTIONS: { value: ChequeType; label: string }[] = [
  { value: "down_payment", label: "Down Payment" },
  { value: "installment", label: "Installment" },
  { value: "maintenance", label: "Maintenance" },
  { value: "balloon", label: "Balloon" },
  { value: "booking", label: "Booking" },
  { value: "finishing", label: "Finishing" },
  { value: "parking", label: "Parking" },
  { value: "club_membership", label: "Club Membership" },
  { value: "other", label: "Other" },
];

const CATEGORY_OPTIONS = [
  { value: "property", label: "Property" },
  { value: "maintenance", label: "Maintenance" },
  { value: "finishing", label: "Finishing" },
  { value: "parking", label: "Parking" },
  { value: "club_membership", label: "Club Membership" },
];

interface Props {
  cheque: Cheque | null;
  onClose: () => void;
}

const EditChequeDrawer = ({ cheque, onClose }: Props) => {
  const updateCheque = useChequesStore((s) => s.updateCheque);
  const isOpen = cheque !== null;
  useDrawerDimmer(isOpen);
  const isCollected = cheque?.status === "collected";

  const [chequeNumber, setChequeNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<ChequeType>("installment");
  const [category, setCategory] = useState("property");
  const [bank, setBank] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!cheque) return;
    setChequeNumber(cheque.chequeNumber);
    setAmount(String(cheque.amount));
    setDueDate(cheque.dueDate);
    setType(cheque.type);
    setCategory(cheque.category);
    setBank(cheque.bank);
    setNotes(cheque.notes);
  }, [cheque]);

  if (!cheque) {
    return (
      <AnimatePresence>
        {null}
      </AnimatePresence>
    );
  }

  const colors = getStatusColor(cheque.status);
  const parsedAmount = Number(amount);
  const amountValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const hasChanges =
    chequeNumber !== cheque.chequeNumber ||
    parsedAmount !== cheque.amount ||
    dueDate !== cheque.dueDate ||
    type !== cheque.type ||
    category !== cheque.category ||
    bank !== cheque.bank ||
    notes !== cheque.notes;

  const canSave = hasChanges && amountValid && chequeNumber.trim() && dueDate;

  const handleSave = () => {
    if (!canSave) return;
    updateCheque(cheque.id, {
      chequeNumber: chequeNumber.trim(),
      amount: parsedAmount,
      dueDate,
      type,
      category,
      bank: bank.trim(),
      notes,
    });
    onClose();
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
            onClick={onClose}
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
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Edit Cheque</h2>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  {getStatusLabel(cheque.status)}
                </span>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Identity (read-only) */}
              <div className="bg-gray-50 rounded-xl p-3.5">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Cheque Owner</div>
                <div className="text-sm font-bold text-gray-900">{cheque.clientName}</div>
                <div className="text-xs text-gray-500 mt-0.5">{cheque.unitCode} · {cheque.compound}</div>
              </div>

              {/* Locked banner */}
              {isCollected && (
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-800 leading-relaxed">
                    This cheque is already <span className="font-semibold">collected</span>. To preserve the audit trail, only <span className="font-semibold">Bank</span> and <span className="font-semibold">Notes</span> can be edited.
                  </div>
                </div>
              )}

              {/* Cheque Number */}
              <div>
                <label className={labelClass}>
                  Cheque Number {isCollected && <Lock size={9} className="inline ml-0.5 text-gray-400" />}
                </label>
                <input
                  type="text"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  disabled={isCollected}
                  className={isCollected ? disabledInputClass : inputClass}
                />
              </div>

              {/* Amount + Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    Amount (EGP) {isCollected && <Lock size={9} className="inline ml-0.5 text-gray-400" />}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isCollected}
                    className={isCollected ? disabledInputClass : inputClass}
                  />
                  {!amountValid && amount !== "" && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-red-600">
                      <AlertTriangle size={9} /> Enter a positive amount
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Due Date {isCollected && <Lock size={9} className="inline ml-0.5 text-gray-400" />}
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={isCollected}
                    className={isCollected ? disabledInputClass : inputClass}
                  />
                </div>
              </div>

              {/* Type + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    Type {isCollected && <Lock size={9} className="inline ml-0.5 text-gray-400" />}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ChequeType)}
                    disabled={isCollected}
                    className={isCollected ? disabledInputClass : `${inputClass} bg-white cursor-pointer`}
                  >
                    {TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Category {isCollected && <Lock size={9} className="inline ml-0.5 text-gray-400" />}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isCollected}
                    className={isCollected ? disabledInputClass : `${inputClass} bg-white cursor-pointer`}
                  >
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bank (always editable) */}
              <div>
                <label className={labelClass}>Bank</label>
                <input
                  type="text"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Notes (always editable) */}
              <div>
                <label className={labelClass}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add a note..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50/50 shrink-0">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} className="h-9 px-4 text-xs text-gray-600">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!canSave}
                  className="h-9 px-5 bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium shadow-sm disabled:opacity-40 gap-1.5"
                >
                  <Check size={14} />
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditChequeDrawer;
