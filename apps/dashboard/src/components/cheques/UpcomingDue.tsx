import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, ChevronDown, CheckCircle2 } from "lucide-react";
import { useChequesStore, formatCurrency, formatDate } from "../../store/chequesStore";

type Window = 7 | 14 | 30;

const UpcomingDue = () => {
  const getUpcomingDue = useChequesStore((s) => s.getUpcomingDue);
  const markAsCollected = useChequesStore((s) => s.markAsCollected);
  const [window, setWindow] = useState<Window>(14);
  const [expanded, setExpanded] = useState(true);

  const cheques = getUpcomingDue(window);
  const totalValue = cheques.reduce((s, c) => s + c.amount, 0);

  if (cheques.length === 0) return null;

  const today = new Date("2026-04-06");

  return (
    <div className="bg-amber-50/60 border border-amber-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-amber-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
            <CalendarClock size={14} className="text-amber-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900">Upcoming Due</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
              {cheques.length} cheques
            </span>
            <span className="text-[10px] text-amber-600/70">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Window selector */}
          <div
            className="flex items-center bg-white rounded-md border border-amber-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {([7, 14, 30] as Window[]).map((w) => (
              <button
                key={w}
                onClick={() => setWindow(w)}
                className={`px-2 py-1 text-[10px] font-semibold transition-colors ${
                  window === w
                    ? "bg-amber-500 text-white"
                    : "text-amber-700 hover:bg-amber-50"
                }`}
              >
                {w}d
              </button>
            ))}
          </div>

          <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-amber-400">
            <ChevronDown size={14} />
          </motion.div>
        </div>
      </button>

      {/* Cheque list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_80px_100px_110px_70px] gap-x-3 px-2 py-1.5 border-b border-amber-200/60">
                <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Client</div>
                <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Cheque #</div>
                <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Unit</div>
                <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Due Date</div>
                <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide text-right">Amount</div>
                <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide text-center">Action</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-amber-100">
                {cheques.map((cheque) => {
                  const dueDate = new Date(cheque.dueDate);
                  const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntil <= 3;

                  return (
                    <div
                      key={cheque.id}
                      className="grid grid-cols-[1fr_100px_80px_100px_110px_70px] gap-x-3 items-center px-2 py-2 hover:bg-amber-50/50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-gray-900 truncate">{cheque.clientName}</span>
                      <span className="text-xs font-mono text-gray-600">{cheque.chequeNumber}</span>
                      <span className="text-xs text-gray-500">{cheque.unitCode}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-700 tabular-nums">{formatDate(cheque.dueDate)}</span>
                        {isUrgent && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded">
                            {daysUntil === 0 ? "TODAY" : `${daysUntil}d`}
                          </span>
                        )}
                        {!isUrgent && (
                          <span className="text-[9px] font-medium text-amber-500">
                            {daysUntil}d
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-900 text-right tabular-nums">{formatCurrency(cheque.amount)}</span>
                      <div className="flex justify-center">
                        <button
                          onClick={() => markAsCollected(cheque.id)}
                          className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-colors"
                          title="Mark as collected"
                        >
                          <CheckCircle2 size={12} className="text-emerald-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpcomingDue;
