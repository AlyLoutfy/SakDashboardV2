import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertCircle, Plus, Trash2, FileText, Building2, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useChequesStore,
  formatCurrency,
  formatDate,
  getCategoryColor,
  getCategoryLabel,
  generateDraftInstallments,
  type DraftInstallment,
  type ChequeType,
} from "../store/chequesStore";

// --- Constants ---

const BANK_OPTIONS = ["CIB", "NBE", "Banque Misr", "QNB", "HSBC", "Alex Bank", "AAIB", "Faisal Islamic"];

const PLAN_TEMPLATES = [
  { id: "plan-5yr-q", name: "5-Year Quarterly", years: 5, downPaymentPct: 10, maintenance: 0.005 },
  { id: "plan-6yr-q", name: "6-Year Quarterly", years: 6, downPaymentPct: 10, maintenance: 0.005 },
  { id: "plan-7yr-q", name: "7-Year Quarterly", years: 7, downPaymentPct: 10, maintenance: 0.005 },
  { id: "plan-8yr-q", name: "8-Year Quarterly", years: 8, downPaymentPct: 15, maintenance: 0.005 },
  { id: "plan-8yr-q-20", name: "8-Year (20% DP)", years: 8, downPaymentPct: 20, maintenance: 0.005 },
  { id: "plan-10yr-q", name: "10-Year Quarterly", years: 10, downPaymentPct: 20, maintenance: 0.005 },
];

const TYPE_OPTIONS: { value: ChequeType; label: string; category: string }[] = [
  { value: "down_payment", label: "Down Payment", category: "property" },
  { value: "installment", label: "Installment", category: "property" },
  { value: "balloon", label: "Balloon", category: "property" },
  { value: "maintenance", label: "Maintenance", category: "maintenance" },
  { value: "finishing", label: "Finishing", category: "finishing" },
  { value: "parking", label: "Parking", category: "parking" },
  { value: "club_membership", label: "Club", category: "club_membership" },
];

type ColKey = "chequeNumber" | "dueDate" | "type" | "bank" | "pct" | "amount";
const ALL_COLS: ColKey[] = ["chequeNumber", "dueDate", "type", "bank", "pct", "amount"];

function makeId() { return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }
function addMonthsStr(d: string, m: number) { const dt = new Date(d); dt.setMonth(dt.getMonth() + m); return dt.toISOString().slice(0, 10); }

// --- Selection helpers ---

interface CellRef { row: number; col: number; }

function cellsInRange(anchor: CellRef, end: CellRef): Set<string> {
  const set = new Set<string>();
  const r0 = Math.min(anchor.row, end.row), r1 = Math.max(anchor.row, end.row);
  const c0 = Math.min(anchor.col, end.col), c1 = Math.max(anchor.col, end.col);
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) set.add(`${r}:${c}`);
  return set;
}

// --- Component ---

const ChequeConfirmationPage = () => {
  const { pendingId } = useParams<{ pendingId: string }>();
  const navigate = useNavigate();
  const pendingConfirmations = useChequesStore((s) => s.pendingConfirmations);
  const updatePendingInstallments = useChequesStore((s) => s.updatePendingInstallments);
  const confirmPending = useChequesStore((s) => s.confirmPending);

  const pending = pendingConfirmations.find((p) => p.id === pendingId);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  // Multi-cell selection
  const [anchor, setAnchor] = useState<CellRef | null>(null);
  const [selEnd, setSelEnd] = useState<CellRef | null>(null);
  const mouseDown = useRef(false);

  const selected = useMemo(() => {
    if (!anchor) return new Set<string>();
    return cellsInRange(anchor, selEnd || anchor);
  }, [anchor, selEnd]);

  const isSel = (r: number, c: number) => selected.has(`${r}:${c}`);

  // Drag fill
  const [dragAnchorRow, setDragAnchorRow] = useState<number | null>(null);
  const [dragEndRow, setDragEndRow] = useState<number | null>(null);
  const isDragging = useRef(false);

  if (!pending) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Confirmation not found</p>
          <Button onClick={() => navigate("/cheques")} variant="ghost" className="mt-3 text-xs text-gray-600 gap-1.5"><ArrowLeft size={14} /> Back to Cheques</Button>
        </div>
      </div>
    );
  }

  const installments = pending.installments;
  const unitPrice = pending.unitPrice;
  const sorted = useMemo(() => [...installments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()), [installments]);
  const totalAmount = installments.reduce((s, i) => s + i.amount, 0);
  const totalPct = unitPrice > 0 ? (totalAmount / unitPrice) * 100 : 0;
  const missingCheques = installments.filter((i) => !i.chequeNumber.trim()).length;
  const canConfirm = missingCheques === 0 && installments.length > 0;

  const catTotals = useMemo(() => {
    const m = new Map<string, { count: number; total: number }>();
    installments.forEach((i) => { const e = m.get(i.category) || { count: 0, total: 0 }; e.count++; e.total += i.amount; m.set(i.category, e); });
    return [...m.entries()].map(([c, d]) => ({ category: c, ...d }));
  }, [installments]);

  // --- Actions ---

  const update = (id: string, u: Partial<DraftInstallment>) => updatePendingInstallments(pending.id, installments.map((i) => i.id === id ? { ...i, ...u } : i));
  const remove = (id: string) => updatePendingInstallments(pending.id, installments.filter((i) => i.id !== id));
  const addRow = () => {
    const last = sorted[sorted.length - 1];
    updatePendingInstallments(pending.id, [...installments, {
      id: makeId(), chequeNumber: "", amount: last?.amount || 0, dueDate: last ? addMonthsStr(last.dueDate, 3) : new Date().toISOString().slice(0, 10),
      type: "installment", category: "property", bank: last?.bank || "", notes: "",
    }]);
  };

  const handleTypeChange = (id: string, type: ChequeType) => { const o = TYPE_OPTIONS.find((t) => t.value === type); update(id, { type, category: o?.category || "property" }); };

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    if (!planId) return;
    const t = PLAN_TEMPLATES.find((p) => p.id === planId);
    if (!t) return;
    updatePendingInstallments(pending.id, generateDraftInstallments(unitPrice, t.downPaymentPct, t.years, pending.contractDate, Math.round(unitPrice * t.maintenance)));
  };

  const handleConfirm = () => { confirmPending(pending.id); navigate("/cheques"); };

  // --- Cell click with shift for range ---

  const handleCellMouseDown = (row: number, col: number, e: React.MouseEvent) => {
    if (isDragging.current) return;
    if (e.shiftKey && anchor) {
      setSelEnd({ row, col });
    } else {
      setAnchor({ row, col });
      setSelEnd(null);
      mouseDown.current = true;
    }
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (mouseDown.current && anchor) setSelEnd({ row, col });
  };

  useEffect(() => {
    const up = () => { mouseDown.current = false; };
    document.addEventListener("mouseup", up);
    return () => document.removeEventListener("mouseup", up);
  }, []);

  // --- Keyboard ---

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!anchor) return;
    const r = anchor.row, c = anchor.col, maxR = sorted.length - 1;
    if (e.key === "Tab") { e.preventDefault(); const nc = e.shiftKey ? c - 1 : c + 1; if (nc >= 0 && nc < ALL_COLS.length) { setAnchor({ row: r, col: nc }); setSelEnd(null); } else if (!e.shiftKey && r < maxR) { setAnchor({ row: r + 1, col: 0 }); setSelEnd(null); } }
    else if (e.key === "ArrowDown" && r < maxR) { e.preventDefault(); setAnchor({ row: r + 1, col: c }); setSelEnd(e.shiftKey ? { row: (selEnd?.row ?? r) + 1, col: selEnd?.col ?? c } : null); }
    else if (e.key === "ArrowUp" && r > 0) { e.preventDefault(); setAnchor({ row: r - 1, col: c }); setSelEnd(e.shiftKey ? { row: (selEnd?.row ?? r) - 1, col: selEnd?.col ?? c } : null); }
    else if (e.key === "ArrowRight" && c < ALL_COLS.length - 1) { e.preventDefault(); setAnchor({ row: r, col: c + 1 }); setSelEnd(null); }
    else if (e.key === "ArrowLeft" && c > 0) { e.preventDefault(); setAnchor({ row: r, col: c - 1 }); setSelEnd(null); }
    else if (e.key === "Escape") { setAnchor(null); setSelEnd(null); }
  }, [anchor, selEnd, sorted.length]);

  // --- Paste ---

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!anchor) return;
      const text = e.clipboardData?.getData("text/plain");
      if (!text) return;
      e.preventDefault();
      const rows = text.split("\n").filter(Boolean).map((r) => r.split("\t"));
      const updated = [...installments];
      for (let r = 0; r < rows.length; r++) {
        const ti = anchor.row + r;
        if (ti >= sorted.length) break;
        const inst = sorted[ti];
        const ri = updated.findIndex((i) => i.id === inst.id);
        if (ri === -1) continue;
        for (let c = 0; c < rows[r].length; c++) {
          const col = ALL_COLS[anchor.col + c];
          const v = rows[r][c].trim();
          if (col === "chequeNumber") updated[ri] = { ...updated[ri], chequeNumber: v };
          else if (col === "amount") updated[ri] = { ...updated[ri], amount: parseInt(v.replace(/\D/g, "")) || 0 };
          else if (col === "dueDate" && v) updated[ri] = { ...updated[ri], dueDate: v };
          else if (col === "bank") updated[ri] = { ...updated[ri], bank: v };
          else if (col === "pct" && unitPrice > 0) updated[ri] = { ...updated[ri], amount: Math.round(unitPrice * (parseFloat(v) || 0) / 100) };
        }
      }
      updatePendingInstallments(pending.id, updated);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [anchor, installments, sorted, pending.id, unitPrice, updatePendingInstallments]);

  // --- Drag fill ---

  const handleDragFillEnd = useCallback(() => {
    if (dragAnchorRow === null || dragEndRow === null || !anchor) return;
    const src = sorted[dragAnchorRow];
    if (!src) return;
    const col = ALL_COLS[anchor.col];
    const updated = [...installments];
    const from = Math.min(dragAnchorRow + 1, dragEndRow), to = Math.max(dragAnchorRow + 1, dragEndRow);
    for (let r = from; r <= to; r++) {
      if (r >= sorted.length || r === dragAnchorRow) continue;
      const t = sorted[r];
      const ri = updated.findIndex((i) => i.id === t.id);
      if (ri === -1) continue;
      if (col === "chequeNumber") {
        const m = src.chequeNumber.match(/^(.*?)(\d+)$/);
        updated[ri] = { ...updated[ri], chequeNumber: m ? m[1] + String(parseInt(m[2]) + r - dragAnchorRow).padStart(m[2].length, "0") : src.chequeNumber };
      } else if (col === "amount" || col === "pct") updated[ri] = { ...updated[ri], amount: src.amount };
      else if (col === "bank") updated[ri] = { ...updated[ri], bank: src.bank };
      else if (col === "dueDate") {
        const prev = dragAnchorRow > 0 ? sorted[dragAnchorRow - 1].dueDate : src.dueDate;
        const gap = Math.round((new Date(src.dueDate).getTime() - new Date(prev).getTime()) / (1000 * 60 * 60 * 24 * 30));
        updated[ri] = { ...updated[ri], dueDate: addMonthsStr(src.dueDate, gap * (r - dragAnchorRow)) };
      } else if (col === "type") {
        const o = TYPE_OPTIONS.find((t) => t.value === src.type);
        updated[ri] = { ...updated[ri], type: src.type, category: o?.category || src.category };
      }
    }
    updatePendingInstallments(pending.id, updated);
    setDragAnchorRow(null); setDragEndRow(null); isDragging.current = false;
  }, [dragAnchorRow, dragEndRow, anchor, sorted, installments, pending.id, updatePendingInstallments]);

  useEffect(() => {
    const up = () => { if (isDragging.current) handleDragFillEnd(); };
    document.addEventListener("mouseup", up);
    return () => document.removeEventListener("mouseup", up);
  }, [handleDragFillEnd]);

  const isDragHL = (r: number) => {
    if (dragAnchorRow === null || dragEndRow === null) return false;
    return r >= Math.min(dragAnchorRow, dragEndRow) && r <= Math.max(dragAnchorRow, dragEndRow) && r !== dragAnchorRow;
  };

  // --- Cell styling ---

  const cClass = (r: number, c: number) => isSel(r, c) ? "ring-2 ring-blue-500 ring-inset z-[1]" : "";
  const isActiveCell = (r: number, c: number) => anchor?.row === r && anchor?.col === c && !selEnd;

  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Top Bar */}
      <div className="h-11 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate("/cheques")} className="text-gray-500 hover:text-gray-700 w-7 h-7"><ArrowLeft size={15} /></Button>
          <CreditCard size={15} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-900">Confirm Cheques</span>
          <span className="text-gray-300">/</span>
          <span className="text-xs text-gray-500">{pending.clientName}</span>
        </div>
        <div className="flex items-center gap-2">
          {missingCheques > 0 && (
            <div className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 text-[11px] font-medium">
              <AlertCircle size={11} />{missingCheques} missing
            </div>
          )}
          <Button onClick={() => setShowConfirmDialog(true)} disabled={!canConfirm} className="h-7 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-medium px-3 disabled:opacity-40">
            <CheckCircle2 size={12} />Confirm All
          </Button>
        </div>
      </div>

      {/* Header bar */}
      <div className="border-b border-gray-100 bg-gray-50/30 px-4 py-2 shrink-0 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-4 min-w-max">
          {/* Client */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold">
              {pending.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-900 leading-tight">{pending.clientName}</div>
              <div className="text-[9px] text-gray-400">{pending.unitCode} · {pending.compound}</div>
            </div>
          </div>
          <div className="w-px h-6 bg-gray-200 shrink-0" />
          {/* Contract */}
          <div className="flex items-center gap-3 text-[10px] shrink-0">
            <span className="text-gray-400 flex items-center gap-1"><Calendar size={10} />{formatDate(pending.contractDate)}</span>
            <span className="text-gray-400 flex items-center gap-1"><Building2 size={10} /><span className="font-bold text-gray-700">{formatCurrency(unitPrice)}</span></span>
          </div>
          <div className="w-px h-6 bg-gray-200 shrink-0" />
          {/* Plan */}
          <select value={selectedPlanId} onChange={(e) => handlePlanChange(e.target.value)} className="h-6 pl-1.5 pr-5 text-[10px] border border-gray-200 rounded bg-white cursor-pointer text-gray-700 focus:outline-none focus:border-blue-300 shrink-0">
            <option value="">Select plan...</option>
            {PLAN_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.downPaymentPct}%)</option>)}
          </select>
          <div className="w-px h-6 bg-gray-200 shrink-0" />
          {/* Breakdown */}
          {catTotals.map(({ category, count, total }) => {
            const col = getCategoryColor(category);
            return (
              <div key={category} className="flex items-center gap-1 text-[10px] shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${col.bar}`} />
                <span className="text-gray-500">{getCategoryLabel(category)}</span>
                <span className="font-bold text-gray-700">{formatCurrency(total)}</span>
                <span className="text-gray-300">({count})</span>
              </div>
            );
          })}
          <div className="w-px h-6 bg-gray-200 shrink-0" />
          {/* Total */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
            <span className={`text-[10px] font-semibold ${Math.abs(totalPct - 100) < 1 ? "text-emerald-600" : "text-amber-600"}`}>{totalPct.toFixed(1)}%</span>
            <span className="text-[9px] text-gray-400">({installments.length})</span>
          </div>
        </div>
      </div>

      {/* Spreadsheet table */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto" onMouseLeave={() => { if (isDragging.current) handleDragFillEnd(); }}>
          <table className="w-full text-xs border-collapse" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col />
              <col style={{ width: 110 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 64 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 28 }} />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50">
                <th className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200">#</th>
                {(["Cheque Number", "Due Date", "Type", "Bank", "%", "Amount"] as const).map((label, i) => (
                  <th
                    key={label}
                    onClick={() => { setAnchor({ row: 0, col: i }); setSelEnd({ row: sorted.length - 1, col: i }); }}
                    className="text-left text-[10px] font-semibold text-gray-400 px-2 py-1.5 border-b border-r border-gray-200 cursor-pointer hover:bg-blue-50 hover:text-blue-600 select-none transition-colors"
                  >
                    {label}
                  </th>
                ))}
                <th className="border-b border-gray-200" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((inst, idx) => {
                const missing = !inst.chequeNumber.trim();
                const color = getCategoryColor(inst.category);
                const pct = unitPrice > 0 ? (inst.amount / unitPrice) * 100 : 0;
                const dragHL = isDragHL(idx);

                const cell = (colIdx: number, content: React.ReactNode) => (
                  <td
                    className={`border-b border-r border-gray-100 relative ${dragHL && anchor?.col === colIdx ? "bg-blue-50" : ""} ${cClass(idx, colIdx)}`}
                    onMouseDown={(e) => handleCellMouseDown(idx, colIdx, e)}
                    onMouseEnter={() => { handleCellMouseEnter(idx, colIdx); if (isDragging.current) setDragEndRow(idx); }}
                  >
                    {content}
                    {isActiveCell(idx, colIdx) && (colIdx === 0 || colIdx === 5 || colIdx === 6) && (
                      <div onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); isDragging.current = true; setDragAnchorRow(idx); setDragEndRow(idx); }} className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-blue-500 border border-white cursor-crosshair z-20" />
                    )}
                  </td>
                );

                return (
                  <tr key={inst.id} className={`${dragHL ? "bg-blue-50/30" : "hover:bg-gray-50/30"} group`}>
                    <td className="border-b border-r border-gray-100 px-2 py-0 text-[10px] text-gray-400 tabular-nums text-center">{idx + 1}</td>

                    {cell(0,
                      <input type="text" value={inst.chequeNumber} onChange={(e) => update(inst.id, { chequeNumber: e.target.value })} placeholder="Enter cheque #"
                        className={`w-full h-7 px-2 text-xs font-mono border-0 bg-transparent focus:outline-none focus:bg-white ${missing ? "bg-amber-50/50 placeholder:text-amber-400" : ""}`}
                      />
                    )}

                    {cell(1,
                      <input type="date" value={inst.dueDate} onChange={(e) => update(inst.id, { dueDate: e.target.value })}
                        className="w-full h-7 px-2 text-[11px] border-0 bg-transparent focus:outline-none focus:bg-white"
                      />
                    )}

                    {cell(2,
                      <select value={inst.type} onChange={(e) => handleTypeChange(inst.id, e.target.value as ChequeType)}
                        className={`w-full h-7 px-1.5 text-[11px] border-0 bg-transparent focus:outline-none cursor-pointer font-medium ${color.text}`}
                      >
                        {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    )}

                    {cell(3,
                      <select value={inst.bank} onChange={(e) => update(inst.id, { bank: e.target.value })}
                        className="w-full h-7 px-1.5 text-[11px] border-0 bg-transparent focus:outline-none cursor-pointer text-gray-600"
                      >
                        <option value="">—</option>
                        {BANK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    )}

                    {cell(4,
                      <div className="relative">
                        <input type="text" value={pct.toFixed(2).replace(/\.?0+$/, "")}
                          onChange={(e) => { const p = parseFloat(e.target.value) || 0; update(inst.id, { amount: Math.round(unitPrice * p / 100) }); }}
                          className="w-full h-7 pl-2 pr-5 text-[11px] border-0 bg-transparent focus:outline-none focus:bg-white tabular-nums text-gray-500"
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-300 pointer-events-none">%</span>
                      </div>
                    )}

                    {cell(5,
                      <input type="text" value={inst.amount ? inst.amount.toLocaleString("en-EG") : ""} placeholder="0"
                        onChange={(e) => update(inst.id, { amount: parseInt(e.target.value.replace(/\D/g, "")) || 0 })}
                        className="w-full h-7 px-2 text-xs font-bold border-0 bg-transparent focus:outline-none focus:bg-white tabular-nums"
                      />
                    )}

                    <td className="border-b border-gray-100 px-0">
                      <button onClick={() => remove(inst.id)} className="w-full h-7 flex items-center justify-center text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-colors">
                        <Trash2 size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={8} className="px-2 py-1">
                  <button onClick={addRow} className="w-full border border-dashed border-gray-200 hover:border-gray-300 rounded py-1 text-[11px] text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition-colors">
                    <Plus size={11} />Add Row
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-1.5 bg-gray-50/50 shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-gray-500">
            <span className="font-bold text-gray-900">{installments.length}</span> cheques
            <span className="text-gray-300 mx-1.5">|</span>
            <span className="font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
            {totalAmount !== unitPrice && (
              <span className={`ml-1.5 font-medium ${totalAmount > unitPrice ? "text-red-500" : "text-amber-500"}`}>
                ({totalAmount > unitPrice ? "+" : ""}{formatCurrency(totalAmount - unitPrice)})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/cheques")} className="h-7 px-3 text-[11px] text-gray-600">Cancel</Button>
            <Button onClick={() => setShowConfirmDialog(true)} disabled={!canConfirm} className="h-7 px-4 bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-medium disabled:opacity-40 gap-1.5">
              <CheckCircle2 size={12} />Confirm {installments.length}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfirmDialog(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 size={24} className="text-emerald-600" /></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Cheques</h3>
                  <p className="text-sm text-gray-500">{installments.length} cheques for {pending.clientName} · {pending.unitCode}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">This will create {installments.length} cheques totaling {formatCurrency(totalAmount)} and move this client to the active collection view.</p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                <Button onClick={handleConfirm} className="bg-emerald-600 text-white hover:bg-emerald-700">Confirm</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChequeConfirmationPage;
