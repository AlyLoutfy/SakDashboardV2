import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Building2, RefreshCw, Upload, Image, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useChequesStore,
  getStatusColor,
  getStatusLabel,
  formatCurrency,
  type Cheque,
} from "../../store/chequesStore";
import { useDrawerDimmer } from "../../hooks/useDrawerDimmer";

type Mode = "bank_transfer" | "replacement";

interface Props {
  cheque: Cheque | null;
  mode: Mode;
  onClose: () => void;
}

const labelClass = "text-[10px] font-semibold text-gray-500 mb-1 block";
const inputClass =
  "w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300";

const TODAY = "2026-04-06";

const PaymentResolutionDrawer = ({ cheque, mode, onClose }: Props) => {
  const markAsBankTransfer = useChequesStore((s) => s.markAsBankTransfer);
  const createReplacement = useChequesStore((s) => s.createReplacement);
  const isOpen = cheque !== null;
  useDrawerDimmer(isOpen);

  // Bank transfer fields
  const [transferRef, setTransferRef] = useState("");
  const [collectedDate, setCollectedDate] = useState(TODAY);
  const [proof, setProof] = useState<{ name: string; dataUrl: string } | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Replacement fields
  const [repChequeNumber, setRepChequeNumber] = useState("");
  const [repBank, setRepBank] = useState("");
  const [repDueDate, setRepDueDate] = useState("");
  const [repNotes, setRepNotes] = useState("");

  useEffect(() => {
    if (!cheque) return;
    setTransferRef("");
    setCollectedDate(TODAY);
    setProof(null);
    setProofPreview(null);
    setRepChequeNumber("");
    setRepBank(cheque.bank || "");
    setRepDueDate("");
    setRepNotes("");
  }, [cheque]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProof({ name: file.name, dataUrl });
      if (file.type.startsWith("image/")) {
        setProofPreview(dataUrl);
      } else {
        setProofPreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmBankTransfer = () => {
    if (!cheque || !transferRef.trim()) return;
    markAsBankTransfer(cheque.id, transferRef.trim(), collectedDate, proof);
    onClose();
  };

  const handleConfirmReplacement = () => {
    if (!cheque || !repChequeNumber.trim() || !repDueDate) return;
    createReplacement(cheque.id, {
      chequeNumber: repChequeNumber.trim(),
      bank: repBank.trim(),
      dueDate: repDueDate,
      notes: repNotes.trim() || undefined,
    });
    onClose();
  };

  const canConfirmTransfer = transferRef.trim().length > 0 && collectedDate;
  const canConfirmReplacement = repChequeNumber.trim().length > 0 && repDueDate;

  return (
    <AnimatePresence>
      {isOpen && cheque && (
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
                {mode === "bank_transfer" ? (
                  <Building2 size={15} className="text-blue-500" />
                ) : (
                  <RefreshCw size={15} className="text-orange-500" />
                )}
                <h2 className="text-sm font-bold text-gray-900">
                  {mode === "bank_transfer" ? "Record Bank Transfer" : "Create Replacement Cheque"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Original cheque summary */}
              <div className="bg-gray-50 rounded-xl p-3.5">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  {mode === "replacement" ? "Bounced Cheque" : "Cheque"}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{cheque.clientName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {cheque.unitCode} · {cheque.compound}
                    </div>
                    <div className="font-mono text-[11px] text-gray-400 mt-1">{cheque.chequeNumber}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-900">{formatCurrency(cheque.amount)}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Due {cheque.dueDate}</div>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${getStatusColor(cheque.status).bg} ${getStatusColor(cheque.status).text} border ${getStatusColor(cheque.status).border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(cheque.status).dot}`} />
                      {getStatusLabel(cheque.status)}
                    </span>
                  </div>
                </div>
              </div>

              {mode === "bank_transfer" && (
                <>
                  <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <Building2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Record a bank transfer as payment. Enter the reference number, date received, and optionally attach the proof of payment sent by the client.
                    </p>
                  </div>

                  {/* Transfer Reference */}
                  <div>
                    <label className={labelClass}>Transfer Reference Number *</label>
                    <input
                      type="text"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="e.g. TRF-2026-0041882"
                      className={inputClass}
                    />
                  </div>

                  {/* Date Received */}
                  <div>
                    <label className={labelClass}>Date Received *</label>
                    <input
                      type="date"
                      value={collectedDate}
                      onChange={(e) => setCollectedDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Proof of Payment Upload */}
                  <div>
                    <label className={labelClass}>Proof of Payment (optional)</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {proof ? (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        {proofPreview ? (
                          <div className="relative">
                            <img
                              src={proofPreview}
                              alt="Proof of payment"
                              className="w-full max-h-56 object-contain bg-gray-50"
                            />
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => { setProof(null); setProofPreview(null); }}
                                className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center shadow-sm transition-colors"
                              >
                                <Trash2 size={12} className="text-red-500" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                              <Image size={16} className="text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-700 truncate">{proof.name}</div>
                              <div className="text-[10px] text-gray-400">PDF document</div>
                            </div>
                            <button
                              onClick={() => { setProof(null); setProofPreview(null); }}
                              className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              <Trash2 size={13} className="text-red-500" />
                            </button>
                          </div>
                        )}
                        <div className="px-3 py-2 border-t border-gray-100 bg-white">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Replace file
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                          <Upload size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                          Click to upload proof of payment
                        </div>
                        <div className="text-[10px] text-gray-400">Images or PDF up to 10MB</div>
                      </button>
                    )}
                  </div>
                </>
              )}

              {mode === "replacement" && (
                <>
                  <div className="flex items-start gap-2.5 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <AlertTriangle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-orange-800 leading-relaxed">
                      The original bounced cheque will remain on record. A new replacement cheque will be created for the same amount and linked to it.
                    </p>
                  </div>

                  {/* New Cheque Number */}
                  <div>
                    <label className={labelClass}>New Cheque Number *</label>
                    <input
                      type="text"
                      value={repChequeNumber}
                      onChange={(e) => setRepChequeNumber(e.target.value)}
                      placeholder="e.g. CHQ-001-NEW"
                      className={inputClass}
                    />
                  </div>

                  {/* Amount (locked) */}
                  <div>
                    <label className={labelClass}>Amount (EGP)</label>
                    <div className="w-full h-10 px-3.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 flex items-center">
                      {formatCurrency(cheque.amount)}
                      <span className="ml-2 text-[10px] text-gray-400">(same as original)</span>
                    </div>
                  </div>

                  {/* Bank + New Due Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Bank *</label>
                      <input
                        type="text"
                        value={repBank}
                        onChange={(e) => setRepBank(e.target.value)}
                        placeholder="e.g. CIB"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>New Due Date *</label>
                      <input
                        type="date"
                        value={repDueDate}
                        onChange={(e) => setRepDueDate(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={labelClass}>Notes</label>
                    <textarea
                      value={repNotes}
                      onChange={(e) => setRepNotes(e.target.value)}
                      rows={3}
                      placeholder="Reason for replacement, client communication, etc."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50/50 shrink-0">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} className="h-9 px-4 text-xs text-gray-600">
                  Cancel
                </Button>
                {mode === "bank_transfer" ? (
                  <Button
                    onClick={handleConfirmBankTransfer}
                    disabled={!canConfirmTransfer}
                    className="h-9 px-5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium shadow-sm disabled:opacity-40 gap-1.5"
                  >
                    <Check size={14} />
                    Confirm Transfer
                  </Button>
                ) : (
                  <Button
                    onClick={handleConfirmReplacement}
                    disabled={!canConfirmReplacement}
                    className="h-9 px-5 bg-orange-500 text-white hover:bg-orange-600 text-xs font-medium shadow-sm disabled:opacity-40 gap-1.5"
                  >
                    <RefreshCw size={14} />
                    Create Replacement
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentResolutionDrawer;
