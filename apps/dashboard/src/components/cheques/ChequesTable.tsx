import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, MoreHorizontal, FileText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, AlertTriangle, Check, Clock, Pencil, Building2, RefreshCw, Paperclip } from "lucide-react";
import {
  useChequesStore,
  getNextInLineIds,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
  getCategoryColor,
  type Cheque,
} from "../../store/chequesStore";
import EditChequeDrawer from "./EditChequeDrawer";
import ChequeNoteCell from "./ChequeNoteCell";
import ChequeNoteModal from "./ChequeNoteModal";
import PaymentResolutionDrawer from "./PaymentResolutionDrawer";

const ChequesTable = () => {
  const navigate = useNavigate();
  const getFilteredCheques = useChequesStore((s) => s.getFilteredCheques);
  const allCheques = useChequesStore((s) => s.cheques);
  const markAsCollected = useChequesStore((s) => s.markAsCollected);
  const markAsBounced = useChequesStore((s) => s.markAsBounced);
  const bulkMarkAsCollected = useChequesStore((s) => s.bulkMarkAsCollected);
  const cheques = getFilteredCheques();
  // Compute next-in-line against ALL cheques, not filtered — filters mustn't change order-of-collection rule
  const nextInLineIds = useMemo(() => getNextInLineIds(allCheques), [allCheques]);

  const [sortField, setSortField] = useState<"dueDate" | "amount" | "clientName" | "status">("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);
  const [noteCheque, setNoteCheque] = useState<Cheque | null>(null);
  const [resolutionCheque, setResolutionCheque] = useState<Cheque | null>(null);
  const [resolutionMode, setResolutionMode] = useState<"bank_transfer" | "replacement">("bank_transfer");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const statusOrder = { overdue: 0, bounced: 1, pending: 2, post_dated: 3, collected: 4 };

  const sorted = [...cheques].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "dueDate":
        cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "clientName":
        cmp = a.clientName.localeCompare(b.clientName);
        break;
      case "status":
        cmp = statusOrder[a.status] - statusOrder[b.status];
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  if (safePage !== currentPage && totalPages > 0) setCurrentPage(safePage);
  const paginated = sorted.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  // Bulk selection helpers — only next-in-line cheques are selectable (sequential approval rule)
  const selectableInPage = paginated.filter((c) => nextInLineIds.has(c.id));
  const allSelected = selectableInPage.length > 0 && selectableInPage.every((c) => selectedIds.has(c.id));
  const someSelected = selectedIds.size > 0;
  const hasNonCollectedSelected = [...selectedIds].some((id) => {
    const c = cheques.find((ch) => ch.id === id);
    return c && c.status !== "collected";
  });

  const toggleSelect = (id: string) => {
    if (!nextInLineIds.has(id)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableInPage.map((c) => c.id)));
    }
  };

  const handleBulkCollect = () => {
    bulkMarkAsCollected([...selectedIds]);
    setSelectedIds(new Set());
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-gray-300" />;
    return sortDir === "asc" ? <ChevronUp size={12} className="text-gray-700" /> : <ChevronDown size={12} className="text-gray-700" />;
  };

  const getDaysOverdue = (cheque: Cheque) => {
    if (cheque.status !== "overdue") return 0;
    const diff = new Date("2026-04-06").getTime() - new Date(cheque.dueDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  if (cheques.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No cheques match your filters</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting the filters above</p>
        </div>
      </div>
    );
  }

  // Page number buttons with smart truncation
  const pageNumbers = (() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  })();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Scrollable table */}
      <div className="flex-1 overflow-auto relative">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-50 border-b border-gray-200">
            {/* Checkbox header */}
            <th className="w-10 px-3 py-2.5">
              <button
                onClick={toggleSelectAll}
                disabled={selectableInPage.length === 0}
                title={selectableInPage.length === 0 ? "No selectable rows (only next-in-line cheques can be collected)" : "Select all next-in-line"}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  allSelected
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
              >
                {allSelected && <Check size={10} className="text-white" strokeWidth={3} />}
              </button>
            </th>
            <th className="text-left font-semibold text-gray-500 px-3 py-2.5 cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort("status")}>
              <div className="flex items-center gap-1">Status <SortIcon field="status" /></div>
            </th>
            <th className="text-left font-semibold text-gray-500 px-3 py-2.5">Cheque #</th>
            <th className="text-left font-semibold text-gray-500 px-3 py-2.5 cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort("clientName")}>
              <div className="flex items-center gap-1">Client <SortIcon field="clientName" /></div>
            </th>
            <th className="text-left font-semibold text-gray-500 px-3 py-2.5">Unit</th>
            <th className="text-left font-semibold text-gray-500 px-3 py-2.5">Type</th>
            <th className="text-right font-semibold text-gray-500 px-3 py-2.5 cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort("amount")}>
              <div className="flex items-center gap-1 justify-end">Amount <SortIcon field="amount" /></div>
            </th>
            <th className="text-left font-semibold text-gray-500 px-3 py-2.5 cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort("dueDate")}>
              <div className="flex items-center gap-1">Due Date <SortIcon field="dueDate" /></div>
            </th>
            <th className="text-left font-semibold text-gray-500 px-3 py-2.5">Bank</th>
            <th className="text-center font-semibold text-gray-500 px-3 py-2.5 w-12">Note</th>
            <th className="text-center font-semibold text-gray-500 px-3 py-2.5 w-16">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((cheque, i) => {
            const colors = getStatusColor(cheque.status);
            const daysOverdue = getDaysOverdue(cheque);
            const isSelected = selectedIds.has(cheque.id);
            return (
              <motion.tr
                key={cheque.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className={`border-b border-gray-100 transition-colors group ${
                  isSelected ? "bg-blue-50/60" : "hover:bg-gray-50/50"
                }`}
              >
                {/* Checkbox */}
                <td className="w-10 px-3 py-2.5">
                  <button
                    onClick={() => toggleSelect(cheque.id)}
                    disabled={!nextInLineIds.has(cheque.id)}
                    title={!nextInLineIds.has(cheque.id) ? (cheque.status === "collected" ? "Already collected" : "Earlier cheque must be collected first") : undefined}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                  </button>
                </td>

                {/* Status */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      {getStatusLabel(cheque.status)}
                    </span>
                    {cheque.paymentMethod === "bank_transfer" && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                        <Building2 size={9} />
                        Transfer
                      </span>
                    )}
                    {cheque.replacementOf && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200">
                        <RefreshCw size={9} />
                        Replacement
                      </span>
                    )}
                    {daysOverdue > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-red-500 font-medium">
                        <AlertTriangle size={10} />
                        {daysOverdue}d
                      </span>
                    )}
                    {cheque.status !== "collected" && nextInLineIds.has(cheque.id) && (
                      <div className="relative group/collect opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => markAsCollected(cheque.id)}
                          className="w-5 h-5 rounded-full bg-emerald-50 hover:bg-emerald-500 border border-emerald-200 hover:border-emerald-500 flex items-center justify-center transition-all"
                        >
                          <CheckCircle2 size={11} className="text-emerald-500 group-hover/collect:text-white transition-colors" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/collect:block pointer-events-none z-10">
                          <div className="bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                            Mark as collected (next in line)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                {/* Cheque Number */}
                <td className="px-3 py-2.5">
                  <span className="font-mono text-gray-700 font-medium">{cheque.chequeNumber}</span>
                </td>

                {/* Client */}
                <td className="px-3 py-2.5">
                  <button
                    onClick={() => navigate(`/cheques/client/${cheque.clientId}`)}
                    className="font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {cheque.clientName}
                  </button>
                </td>

                {/* Unit */}
                <td className="px-3 py-2.5">
                  <div>
                    <button
                      onClick={() => navigate(`/cheques/client/${cheque.clientId}?unit=${encodeURIComponent(cheque.unitCode)}`)}
                      className="font-medium text-gray-700 hover:text-blue-600 hover:underline transition-colors"
                    >
                      {cheque.unitCode}
                    </button>
                    <span className="text-gray-400 ml-1.5">{cheque.compound}</span>
                  </div>
                </td>

                {/* Type */}
                <td className="px-3 py-2.5">
                  {(() => {
                    const catColor = getCategoryColor(cheque.category);
                    return (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catColor.bg} ${catColor.text}`}>
                        {getTypeLabel(cheque.type)}
                      </span>
                    );
                  })()}
                </td>

                {/* Amount */}
                <td className="px-3 py-2.5 text-right">
                  <span className="font-bold text-gray-900">{formatCurrency(cheque.amount)}</span>
                </td>

                {/* Due Date */}
                <td className="px-3 py-2.5">
                  <span className="text-gray-600">{formatDate(cheque.dueDate)}</span>
                  {cheque.collectedDate && (
                    <span className="block text-[10px] text-emerald-500">Collected {formatDate(cheque.collectedDate)}</span>
                  )}
                </td>

                {/* Bank */}
                <td className="px-3 py-2.5">
                  <span className="text-gray-500">{cheque.bank}</span>
                </td>

                {/* Note */}
                <td className="px-3 py-2.5 text-center">
                  <div className="flex justify-center items-center gap-1">
                    <ChequeNoteCell cheque={cheque} onEdit={setNoteCheque} />
                    {cheque.paymentProof && (
                      <a
                        href={cheque.paymentProof.dataUrl}
                        download={cheque.paymentProof.name}
                        title={`Proof: ${cheque.paymentProof.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded flex items-center justify-center text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Paperclip size={11} />
                      </a>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-3 py-2.5 text-center relative">
                  <button
                    onClick={() => setActionMenuId(actionMenuId === cheque.id ? null : cheque.id)}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center mx-auto text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  <AnimatePresence>
                    {actionMenuId === cheque.id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setActionMenuId(null)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          className="absolute right-3 top-full mt-0.5 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 min-w-[140px]"
                        >
                          <button
                            onClick={() => { setEditingCheque(cheque); setActionMenuId(null); }}
                            className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          {cheque.status !== "collected" && nextInLineIds.has(cheque.id) && (
                            <button
                              onClick={() => { markAsCollected(cheque.id); setActionMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors"
                            >
                              <CheckCircle2 size={13} /> Mark Collected
                            </button>
                          )}
                          {cheque.status !== "collected" && !nextInLineIds.has(cheque.id) && (
                            <div className="px-3 py-1.5 text-[10px] text-gray-400 border-b border-gray-100">
                              Collect the earlier cheque in this wallet first.
                            </div>
                          )}
                          {cheque.status !== "bounced" && cheque.status !== "collected" && (
                            <button
                              onClick={() => { markAsBounced(cheque.id); setActionMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                            >
                              <XCircle size={13} /> Mark Bounced
                            </button>
                          )}
                          {cheque.status !== "collected" && (
                            <button
                              onClick={() => { setResolutionMode("bank_transfer"); setResolutionCheque(cheque); setActionMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                            >
                              <Building2 size={13} /> Record Bank Transfer
                            </button>
                          )}
                          {cheque.status === "bounced" && (
                            <button
                              onClick={() => { setResolutionMode("replacement"); setResolutionCheque(cheque); setActionMenuId(null); }}
                              className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-2 transition-colors"
                            >
                              <RefreshCw size={13} /> Create Replacement
                            </button>
                          )}
                          {cheque.statusHistory.length > 0 && (
                            <div className="border-t border-gray-100 mt-1 px-3 py-2">
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 mb-1.5">
                                <Clock size={10} />
                                History
                              </div>
                              <div className="space-y-1">
                                {cheque.statusHistory.map((h, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                                    <span className="text-gray-400 tabular-nums">{formatDate(h.date)}</span>
                                    <span className="text-gray-300">&rarr;</span>
                                    <span className={`font-semibold ${getStatusColor(h.to).text}`}>{getStatusLabel(h.to)}</span>
                                    {h.note && <span className="text-gray-400 italic">({h.note})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* Floating bottom pill */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="sticky bottom-4 z-20 flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto bg-gray-900 text-white pl-4 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-3">
              <span className="text-xs font-semibold">{selectedIds.size} selected</span>
              <span className="text-[10px] text-gray-400">{formatCurrency([...selectedIds].reduce((s, id) => {
                const c = cheques.find((ch) => ch.id === id);
                return s + (c?.amount ?? 0);
              }, 0))}</span>

              {hasNonCollectedSelected && (
                <button
                  onClick={handleBulkCollect}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold rounded-full transition-colors"
                >
                  <CheckCircle2 size={12} />
                  Mark Collected
                </button>
              )}
              <button
                onClick={() => setSelectedIds(new Set())}
                className="w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <XCircle size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 shrink-0">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">Rows</span>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="h-7 pl-2 pr-6 text-[11px] border border-gray-200 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_4px_center] bg-no-repeat"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} className="text-gray-600" />
          </button>

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="w-7 h-7 flex items-center justify-center text-[10px] text-gray-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p as number)}
                className={`w-7 h-7 rounded-md text-[11px] font-medium transition-colors ${
                  safePage === p
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages || totalPages === 0}
            className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Results counter */}
        <div className="text-[11px] text-gray-500 tabular-nums">
          {sorted.length > 0 ? (
            <>
              {(safePage - 1) * itemsPerPage + 1}–{Math.min(safePage * itemsPerPage, sorted.length)} of {sorted.length}
            </>
          ) : (
            "0 results"
          )}
        </div>
      </div>

      <EditChequeDrawer cheque={editingCheque} onClose={() => setEditingCheque(null)} />
      <ChequeNoteModal cheque={noteCheque} onClose={() => setNoteCheque(null)} />
      <PaymentResolutionDrawer
        cheque={resolutionCheque}
        mode={resolutionMode}
        onClose={() => setResolutionCheque(null)}
      />
    </div>
  );
};

export default ChequesTable;
