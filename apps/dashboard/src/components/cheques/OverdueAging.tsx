import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import { useChequesStore, formatCurrency, formatDate, getStatusColor } from "../../store/chequesStore";

const OverdueAging = () => {
  const getOverdueAging = useChequesStore((s) => s.getOverdueAging);
  const markAsCollected = useChequesStore((s) => s.markAsCollected);
  const buckets = getOverdueAging();
  const [expanded, setExpanded] = useState(true);
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);

  const totalOverdue = buckets.reduce((s, b) => s + b.cheques.length, 0);
  const totalValue = buckets.reduce((s, b) => s + b.cheques.reduce((ss, c) => ss + c.amount, 0), 0);

  if (totalOverdue === 0) return null;

  const today = new Date("2026-04-06");

  const severityColors = [
    { bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-400", text: "text-amber-700", headerBg: "bg-amber-50" },
    { bg: "bg-orange-50", border: "border-orange-200", bar: "bg-orange-400", text: "text-orange-700", headerBg: "bg-orange-50" },
    { bg: "bg-red-50", border: "border-red-200", bar: "bg-red-400", text: "text-red-700", headerBg: "bg-red-50" },
    { bg: "bg-rose-50", border: "border-rose-300", bar: "bg-rose-500", text: "text-rose-800", headerBg: "bg-rose-50" },
  ];

  return (
    <div className="bg-red-50/40 border border-red-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-red-50/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle size={14} className="text-red-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-900">Overdue Aging</span>
            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
              {totalOverdue} cheques
            </span>
            <span className="text-[10px] text-red-600/70">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>

        <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-red-400">
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-2">
              {/* Aging bar visualization */}
              <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-gray-100">
                {buckets.map((bucket, i) => {
                  if (bucket.cheques.length === 0) return null;
                  const pct = (bucket.cheques.length / totalOverdue) * 100;
                  return (
                    <motion.div
                      key={bucket.bucket}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className={`h-full ${severityColors[i].bar} first:rounded-l-full last:rounded-r-full`}
                    />
                  );
                })}
              </div>

              {/* Bucket breakdown */}
              <div className="grid grid-cols-4 gap-2">
                {buckets.map((bucket, i) => {
                  const colors = severityColors[i];
                  const bucketValue = bucket.cheques.reduce((s, c) => s + c.amount, 0);
                  const isOpen = expandedBucket === bucket.bucket;

                  return (
                    <div key={bucket.bucket} className="relative">
                      <button
                        onClick={() => setExpandedBucket(isOpen ? null : bucket.bucket)}
                        disabled={bucket.cheques.length === 0}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          bucket.cheques.length === 0
                            ? "bg-gray-50 border-gray-100 opacity-50 cursor-default"
                            : `${colors.bg} ${colors.border} hover:opacity-90 cursor-pointer`
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-[10px] font-bold ${bucket.cheques.length > 0 ? colors.text : "text-gray-400"}`}>
                            {bucket.bucket}
                          </span>
                          <span className={`text-sm font-bold ${bucket.cheques.length > 0 ? colors.text : "text-gray-300"}`}>
                            {bucket.cheques.length}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {bucket.cheques.length > 0 ? formatCurrency(bucketValue) : "—"}
                        </span>
                      </button>

                      {/* Expanded cheque list */}
                      <AnimatePresence>
                        {isOpen && bucket.cheques.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute top-full left-0 right-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[280px]"
                          >
                            <div className="max-h-48 overflow-auto divide-y divide-gray-50">
                              {bucket.cheques
                                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                .map((cheque) => {
                                  const daysOverdue = Math.floor(
                                    (today.getTime() - new Date(cheque.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                                  );
                                  const statusColors = getStatusColor(cheque.status);
                                  return (
                                    <div key={cheque.id} className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-semibold text-gray-900 truncate">{cheque.clientName}</span>
                                          <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${statusColors.bg} ${statusColors.text}`}>
                                            {cheque.status === "bounced" ? "Bounced" : `${daysOverdue}d late`}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-[10px] text-gray-400 font-mono">{cheque.chequeNumber}</span>
                                          <span className="text-[10px] text-gray-400">{formatDate(cheque.dueDate)}</span>
                                          <span className="text-[10px] font-bold text-gray-700">{formatCurrency(cheque.amount)}</span>
                                        </div>
                                      </div>
                                      {cheque.status !== "collected" && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsCollected(cheque.id);
                                          }}
                                          className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 transition-colors"
                                          title="Mark as collected"
                                        >
                                          <CheckCircle2 size={11} className="text-emerald-600" />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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

export default OverdueAging;
