import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Building2, Calendar, CreditCard, Lock, Save, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useChequesStore,
  applyAutoOverdue,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  getCategoryColor,
  type Cheque,
  type ChequeType,
} from "../store/chequesStore";

const BANK_OPTIONS = ["CIB", "NBE", "Banque Misr", "QNB", "HSBC", "Alex Bank", "AAIB", "Faisal Islamic"];

const TYPE_OPTIONS: { value: ChequeType; label: string; category: string }[] = [
  { value: "down_payment", label: "Down Payment", category: "property" },
  { value: "installment", label: "Installment", category: "property" },
  { value: "balloon", label: "Balloon", category: "property" },
  { value: "maintenance", label: "Maintenance", category: "maintenance" },
  { value: "finishing", label: "Finishing", category: "finishing" },
  { value: "parking", label: "Parking", category: "parking" },
  { value: "club_membership", label: "Club", category: "club_membership" },
  { value: "booking", label: "Booking", category: "property" },
  { value: "other", label: "Other", category: "property" },
];

type EditableField = "chequeNumber" | "amount" | "dueDate" | "type" | "category" | "bank" | "notes";

interface DraftRow {
  id: string;
  chequeNumber: string;
  amount: number;
  dueDate: string;
  type: ChequeType;
  category: string;
  bank: string;
  notes: string;
}

const toDraft = (c: Cheque): DraftRow => ({
  id: c.id,
  chequeNumber: c.chequeNumber,
  amount: c.amount,
  dueDate: c.dueDate,
  type: c.type,
  category: c.category,
  bank: c.bank,
  notes: c.notes,
});

const WalletEditPage = () => {
  const { clientId, unitCode: rawUnitCode } = useParams<{ clientId: string; unitCode: string }>();
  const unitCode = rawUnitCode ? decodeURIComponent(rawUnitCode) : "";
  const navigate = useNavigate();
  const allCheques = useChequesStore((s) => s.cheques);
  const bulkUpdateCheques = useChequesStore((s) => s.bulkUpdateCheques);

  const walletCheques = useMemo(
    () => allCheques
      .filter((c) => c.clientId === clientId && c.unitCode === unitCode)
      .map(applyAutoOverdue)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [allCheques, clientId, unitCode]
  );

  const [drafts, setDrafts] = useState<Record<string, DraftRow>>(() =>
    Object.fromEntries(walletCheques.map((c) => [c.id, toDraft(c)]))
  );

  if (walletCheques.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <CreditCard size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Wallet not found</p>
          <Button onClick={() => navigate(-1)} variant="ghost" className="mt-3 text-xs text-gray-600 gap-1.5">
            <ArrowLeft size={14} /> Back
          </Button>
        </div>
      </div>
    );
  }

  const first = walletCheques[0];
  const clientName = first.clientName;
  const compound = first.compound;

  const isFieldLocked = (cheque: Cheque, field: EditableField): boolean => {
    if (cheque.status !== "collected") return false;
    return field !== "bank" && field !== "notes";
  };

  const update = (id: string, patch: Partial<DraftRow>) => {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  };

  const handleTypeChange = (id: string, type: ChequeType) => {
    const o = TYPE_OPTIONS.find((t) => t.value === type);
    update(id, { type, category: o?.category || "property" });
  };

  // Detect changes per row vs original
  const changedIds = useMemo(() => {
    const changed = new Set<string>();
    walletCheques.forEach((c) => {
      const d = drafts[c.id];
      if (!d) return;
      if (
        d.chequeNumber !== c.chequeNumber ||
        d.amount !== c.amount ||
        d.dueDate !== c.dueDate ||
        d.type !== c.type ||
        d.category !== c.category ||
        d.bank !== c.bank ||
        d.notes !== c.notes
      ) changed.add(c.id);
    });
    return changed;
  }, [drafts, walletCheques]);

  const hasErrors = useMemo(() => {
    return walletCheques.some((c) => {
      const d = drafts[c.id];
      if (!d) return false;
      if (!d.chequeNumber.trim()) return true;
      if (!(d.amount > 0)) return true;
      if (!d.dueDate) return true;
      return false;
    });
  }, [drafts, walletCheques]);

  const canSave = changedIds.size > 0 && !hasErrors;

  const handleSave = () => {
    if (!canSave) return;
    const updates = walletCheques
      .filter((c) => changedIds.has(c.id))
      .map((c) => {
        const d = drafts[c.id];
        return {
          id: c.id,
          patch: {
            chequeNumber: d.chequeNumber.trim(),
            amount: d.amount,
            dueDate: d.dueDate,
            type: d.type,
            category: d.category,
            bank: d.bank.trim(),
            notes: d.notes,
          },
        };
      });
    bulkUpdateCheques(updates);
    navigate(`/cheques/client/${clientId}?unit=${encodeURIComponent(unitCode)}`);
  };

  const handleRevert = () => {
    setDrafts(Object.fromEntries(walletCheques.map((c) => [c.id, toDraft(c)])));
  };

  const totalValue = walletCheques.reduce((s, c) => s + c.amount, 0);
  const collectedCount = walletCheques.filter((c) => c.status === "collected").length;
  const lockedCount = collectedCount;

  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
      {/* Top Bar */}
      <div className="h-11 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate(`/cheques/client/${clientId}`)} className="text-gray-500 hover:text-gray-700 w-7 h-7">
            <ArrowLeft size={15} />
          </Button>
          <CreditCard size={15} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-900">Edit Wallet</span>
          <span className="text-gray-300">/</span>
          <span className="text-xs text-gray-500">{clientName} · {unitCode}</span>
        </div>
        <div className="flex items-center gap-2">
          {changedIds.size > 0 && (
            <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 text-[11px] font-medium">
              {changedIds.size} unsaved change{changedIds.size > 1 ? "s" : ""}
            </span>
          )}
          {hasErrors && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 text-[11px] font-medium">
              <AlertCircle size={11} /> Invalid values
            </span>
          )}
          <Button
            variant="ghost"
            onClick={handleRevert}
            disabled={changedIds.size === 0}
            className="h-7 px-3 text-[11px] text-gray-600 gap-1.5 disabled:opacity-40"
          >
            <RotateCcw size={11} /> Revert
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="h-7 gap-1.5 bg-gray-900 text-white hover:bg-gray-800 text-[11px] font-medium px-3 disabled:opacity-40"
          >
            <Save size={12} /> Save Changes
          </Button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="border-b border-gray-100 bg-gray-50/30 px-4 py-2 shrink-0 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-4 min-w-max">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold">
              {clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-900 leading-tight">{clientName}</div>
              <div className="text-[9px] text-gray-400">{unitCode} · {compound}</div>
            </div>
          </div>
          <div className="w-px h-6 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-3 text-[10px] shrink-0">
            <span className="text-gray-400 flex items-center gap-1">
              <Building2 size={10} />
              <span className="font-bold text-gray-700">{formatCurrency(totalValue)}</span>
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar size={10} />
              {walletCheques.length} cheques
            </span>
            {lockedCount > 0 && (
              <span className="text-amber-600 flex items-center gap-1">
                <Lock size={10} />
                {lockedCount} collected (financial fields locked)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Spreadsheet table */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs border-collapse" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: 90 }} />
              <col />
              <col style={{ width: 110 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 120 }} />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50">
                <th className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200">#</th>
                <th className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200">Status</th>
                <th className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200">Cheque Number</th>
                <th className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200">Due Date</th>
                <th className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200">Type</th>
                <th className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200">Bank</th>
                <th className="text-right text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-gray-200">Amount (EGP)</th>
              </tr>
            </thead>
            <tbody>
              {walletCheques.map((cheque, idx) => {
                const draft = drafts[cheque.id];
                if (!draft) return null;
                const color = getCategoryColor(draft.category);
                const statusColors = getStatusColor(cheque.status);
                const isChanged = changedIds.has(cheque.id);
                const lockedNum = isFieldLocked(cheque, "chequeNumber");
                const lockedDate = isFieldLocked(cheque, "dueDate");
                const lockedType = isFieldLocked(cheque, "type");
                const lockedAmount = isFieldLocked(cheque, "amount");
                const missing = !draft.chequeNumber.trim();
                const badAmount = !(draft.amount > 0);

                return (
                  <tr key={cheque.id} className={`${isChanged ? "bg-blue-50/30" : "hover:bg-gray-50/30"}`}>
                    <td className="border-b border-r border-gray-100 px-2 py-0 text-[10px] text-gray-400 tabular-nums text-center">
                      {idx + 1}
                    </td>

                    <td className="border-b border-r border-gray-100 px-2 py-1">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${statusColors.bg} ${statusColors.text}`}>
                        <span className={`w-1 h-1 rounded-full ${statusColors.dot}`} />
                        {getStatusLabel(cheque.status)}
                      </span>
                    </td>

                    <td className={`border-b border-r border-gray-100 ${lockedNum ? "bg-gray-50" : ""}`}>
                      <input
                        type="text"
                        value={draft.chequeNumber}
                        onChange={(e) => update(cheque.id, { chequeNumber: e.target.value })}
                        disabled={lockedNum}
                        className={`w-full h-7 px-2 text-xs font-mono border-0 bg-transparent focus:outline-none focus:bg-white disabled:cursor-not-allowed ${missing && !lockedNum ? "bg-amber-50/60 placeholder:text-amber-400" : ""}`}
                      />
                    </td>

                    <td className={`border-b border-r border-gray-100 ${lockedDate ? "bg-gray-50" : ""}`}>
                      <input
                        type="date"
                        value={draft.dueDate}
                        onChange={(e) => update(cheque.id, { dueDate: e.target.value })}
                        disabled={lockedDate}
                        className="w-full h-7 px-2 text-[11px] border-0 bg-transparent focus:outline-none focus:bg-white disabled:cursor-not-allowed"
                      />
                    </td>

                    <td className={`border-b border-r border-gray-100 ${lockedType ? "bg-gray-50" : ""}`}>
                      <select
                        value={draft.type}
                        onChange={(e) => handleTypeChange(cheque.id, e.target.value as ChequeType)}
                        disabled={lockedType}
                        className={`w-full h-7 px-1.5 text-[11px] border-0 bg-transparent focus:outline-none cursor-pointer font-medium disabled:cursor-not-allowed ${color.text}`}
                      >
                        {TYPE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="border-b border-r border-gray-100">
                      <select
                        value={draft.bank}
                        onChange={(e) => update(cheque.id, { bank: e.target.value })}
                        className="w-full h-7 px-1.5 text-[11px] border-0 bg-transparent focus:outline-none cursor-pointer text-gray-600"
                      >
                        <option value="">—</option>
                        {BANK_OPTIONS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </td>

                    <td className={`border-b border-gray-100 text-right ${lockedAmount ? "bg-gray-50" : ""}`}>
                      <div className="relative">
                        <input
                          type="text"
                          value={draft.amount ? draft.amount.toLocaleString("en-EG") : ""}
                          placeholder="0"
                          onChange={(e) => update(cheque.id, { amount: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
                          disabled={lockedAmount}
                          className={`w-full h-7 px-2 text-xs font-bold border-0 bg-transparent focus:outline-none focus:bg-white tabular-nums text-right disabled:cursor-not-allowed ${badAmount && !lockedAmount ? "bg-amber-50/60" : ""}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50/50 shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-gray-500 flex items-center gap-2">
            <span>
              <span className="font-bold text-gray-900">{walletCheques.length}</span> cheques ·
              <span className="font-bold text-gray-900 ml-1">{formatCurrency(totalValue)}</span>
            </span>
            {lockedCount > 0 && (
              <span className="text-[10px] text-amber-600 flex items-center gap-1">
                <Lock size={9} /> Collected rows allow bank and notes only
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate(`/cheques/client/${clientId}`)} className="h-7 px-3 text-[11px] text-gray-600">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="h-7 px-4 bg-gray-900 text-white hover:bg-gray-800 text-[11px] font-medium disabled:opacity-40 gap-1.5"
            >
              <Save size={12} /> Save {changedIds.size > 0 ? `(${changedIds.size})` : ""}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {walletCheques.every((c) => c.status === "collected") && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-14 left-1/2 -translate-x-1/2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-3 py-1.5 text-[11px] font-medium flex items-center gap-1.5 shadow-sm pointer-events-none">
            <CheckCircle2 size={12} /> Wallet fully collected — only bank and notes can be edited
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default WalletEditPage;
