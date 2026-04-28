import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquareText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChequesStore, type Cheque } from "../../store/chequesStore";
import { useDrawerDimmer } from "../../hooks/useDrawerDimmer";

interface Props {
  cheque: Cheque | null;
  onClose: () => void;
}

const ChequeNoteModal = ({ cheque, onClose }: Props) => {
  const updateCheque = useChequesStore((s) => s.updateCheque);
  const isOpen = cheque !== null;
  useDrawerDimmer(isOpen);

  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!cheque) return;
    setValue(cheque.notes);
  }, [cheque]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, value, cheque]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      textareaRef.current?.focus();
      const len = textareaRef.current?.value.length ?? 0;
      textareaRef.current?.setSelectionRange(len, len);
    }, 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleSave = () => {
    if (!cheque) return;
    const trimmed = value.trimEnd();
    if (trimmed === cheque.notes) {
      onClose();
      return;
    }
    updateCheque(cheque.id, { notes: trimmed });
    onClose();
  };

  const handleClear = () => {
    if (!cheque) return;
    updateCheque(cheque.id, { notes: "" });
    onClose();
  };

  const hasExistingNote = (cheque?.notes.trim().length ?? 0) > 0;

  return (
    <AnimatePresence>
      {isOpen && cheque && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-80 bg-gray-900/30 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-90 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cheque-note-title"
            >
              {/* Header */}
              <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MessageSquareText size={15} />
                  </div>
                  <div className="min-w-0">
                    <h2 id="cheque-note-title" className="text-sm font-bold text-gray-900 leading-tight">
                      {hasExistingNote ? "Edit note" : "Add note"}
                    </h2>
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {cheque.clientName}
                      <span className="text-gray-300 px-1.5">·</span>
                      <span className="font-mono">{cheque.chequeNumber}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 pb-4">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={6}
                  placeholder="Add context: reason, next steps, client conversation…"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 resize-none leading-relaxed"
                />
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between gap-2">
                {hasExistingNote ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-8 px-2.5 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear note
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="h-8 text-xs font-medium px-3 border-gray-200 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="h-8 text-xs font-semibold px-3 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Save note
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChequeNoteModal;
