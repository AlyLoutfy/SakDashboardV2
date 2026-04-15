import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Phone,
  Mail,
  Building2,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  useChequesStore,
  applyAutoOverdue,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
  getCategoryColor,
  getCategoryLabel,
  type Cheque,
  type UnitInfo,
} from "../store/chequesStore";

// ── Helpers ──

const ProgressBar = ({ paid, total, barColor }: { paid: number; total: number; barColor: string }) => {
  const pct = total > 0 ? (paid / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      <span className="text-xs font-bold text-gray-500 w-10 text-right tabular-nums">{pct.toFixed(0)}%</span>
    </div>
  );
};

// ── Unit Section ──

const UnitSection = ({
  unit,
  cheques,
  isExpanded,
  onToggle,
  markAsCollected,
  unitIndex,
}: {
  unit: UnitInfo;
  cheques: Cheque[];
  isExpanded: boolean;
  onToggle: () => void;
  markAsCollected: (id: string) => void;
  unitIndex: number;
}) => {
  const collected = cheques.filter((c) => c.status === "collected");
  const totalValue = cheques.reduce((s, c) => s + c.amount, 0);
  const collectedValue = collected.reduce((s, c) => s + c.amount, 0);
  const rate = totalValue > 0 ? (collectedValue / totalValue) * 100 : 0;
  const hasIssues = cheques.some((c) => c.status === "overdue" || c.status === "bounced");

  // Category breakdown for this unit
  const categories = useMemo(() => {
    const catMap = new Map<string, { total: number; paid: number }>();
    cheques.forEach((c) => {
      const entry = catMap.get(c.category) || { total: 0, paid: 0 };
      entry.total += c.amount;
      if (c.status === "collected") entry.paid += c.amount;
      catMap.set(c.category, entry);
    });
    const order = ["property", "maintenance", "finishing", "parking", "club_membership"];
    return [...catMap.entries()]
      .sort(([a], [b]) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
      .map(([cat, data]) => ({
        category: cat,
        label: getCategoryLabel(cat),
        ...data,
        remaining: data.total - data.paid,
        color: getCategoryColor(cat),
      }));
  }, [cheques]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: unitIndex * 0.1 }}
      className={`border rounded-xl overflow-hidden transition-colors ${
        hasIssues ? "border-red-200" : "border-gray-200"
      }`}
    >
      {/* Unit header */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
          hasIssues ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
        }`}>
          <Building2 size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{unit.unitCode}</span>
            {hasIssues && <AlertTriangle size={13} className="text-red-500" />}
          </div>
          <span className="text-xs text-gray-400">{unit.compound}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Total Value</div>
            <div className="text-sm font-bold text-gray-900 tabular-nums">{formatCurrency(totalValue)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Collected</div>
            <div className="text-sm font-bold text-emerald-600 tabular-nums">{formatCurrency(collectedValue)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Cheques</div>
            <div className="text-sm font-bold text-gray-700">{collected.length}<span className="text-gray-300 font-normal">/{cheques.length}</span></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Paid</div>
            <div className={`text-sm font-bold ${rate >= 80 ? "text-emerald-600" : rate >= 50 ? "text-amber-600" : "text-red-600"}`}>
              {rate.toFixed(0)}%
            </div>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-gray-400">
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100">
              {/* Category progress bars */}
              <div className={`grid gap-4 mb-5 ${categories.length <= 2 ? "grid-cols-2" : categories.length <= 4 ? "grid-cols-4" : "grid-cols-5"}`}>
                {categories.map((cat) => (
                  <div key={cat.category} className="bg-gray-50/70 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className={`w-2 h-2 rounded-full ${cat.color.bar}`} />
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{cat.label}</span>
                    </div>
                    <ProgressBar paid={cat.paid} total={cat.total} barColor={cat.color.bar} />
                    <div className="flex justify-between mt-2">
                      <span className={`text-[10px] font-medium ${cat.color.text}`}>{formatCurrency(cat.paid)} paid</span>
                      <span className="text-[10px] text-gray-400">{formatCurrency(cat.remaining)} rem.</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cheque table */}
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="w-8 px-3 py-2.5" />
                      <th className="text-left font-semibold text-gray-400 px-3 py-2.5">Cheque #</th>
                      <th className="text-left font-semibold text-gray-400 px-3 py-2.5">Due Date</th>
                      <th className="text-left font-semibold text-gray-400 px-3 py-2.5">Type</th>
                      <th className="text-right font-semibold text-gray-400 px-3 py-2.5">Amount</th>
                      <th className="text-center font-semibold text-gray-400 px-3 py-2.5">Status</th>
                      <th className="w-10 px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {cheques.map((cheque) => {
                      const colors = getStatusColor(cheque.status);
                      const catColor = getCategoryColor(cheque.category);
                      const isOverdue = cheque.status === "overdue";
                      const daysOverdue = isOverdue
                        ? Math.floor((new Date("2026-04-07").getTime() - new Date(cheque.dueDate).getTime()) / (1000 * 60 * 60 * 24))
                        : 0;

                      return (
                        <tr key={cheque.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                          {/* Status icon */}
                          <td className="px-3 py-2.5 text-center">
                            {cheque.status === "collected" ? (
                              <CheckCircle2 size={15} className="text-emerald-500 mx-auto" />
                            ) : (
                              <span className={`block w-2.5 h-2.5 rounded-full mx-auto ${colors.dot}`} />
                            )}
                          </td>

                          {/* Cheque # */}
                          <td className="px-3 py-2.5">
                            <span className="font-mono text-gray-700 font-medium">{cheque.chequeNumber}</span>
                          </td>

                          {/* Due date */}
                          <td className="px-3 py-2.5">
                            <span className="text-gray-600 tabular-nums">{formatDate(cheque.dueDate)}</span>
                            {cheque.collectedDate && (
                              <span className="block text-[10px] text-emerald-500 mt-0.5">Collected {formatDate(cheque.collectedDate)}</span>
                            )}
                            {daysOverdue > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-red-500 font-medium mt-0.5">
                                <AlertTriangle size={9} />
                                {daysOverdue}d overdue
                              </span>
                            )}
                          </td>

                          {/* Type */}
                          <td className="px-3 py-2.5">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${catColor.bg} ${catColor.text}`}>
                              {getTypeLabel(cheque.type)}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="px-3 py-2.5 text-right">
                            <span className="font-bold text-gray-900 tabular-nums">{formatCurrency(cheque.amount)}</span>
                          </td>

                          {/* Status badge */}
                          <td className="px-3 py-2.5 text-center">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${colors.bg} ${colors.text}`}>
                              {getStatusLabel(cheque.status)}
                            </span>
                          </td>

                          {/* Quick collect */}
                          <td className="px-3 py-2.5 text-center">
                            {cheque.status !== "collected" && (
                              <button
                                onClick={() => markAsCollected(cheque.id)}
                                title="Mark as collected"
                                className="w-6 h-6 rounded-full bg-emerald-50 hover:bg-emerald-500 border border-emerald-200 hover:border-emerald-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 mx-auto"
                              >
                                <CheckCircle2 size={12} className="text-emerald-500 hover:text-white transition-colors" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Status history for this unit (if any cheques have history) */}
              {(() => {
                const withHistory = cheques.filter((c) => c.statusHistory.length > 0);
                if (withHistory.length === 0) return null;
                return (
                  <div className="mt-4 bg-gray-50/70 rounded-lg p-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-3">
                      <Clock size={12} />
                      Recent Activity
                    </div>
                    <div className="space-y-2">
                      {withHistory
                        .flatMap((c) =>
                          c.statusHistory.map((h) => ({ cheque: c, ...h }))
                        )
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .slice(0, 5)
                        .map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 tabular-nums w-20">{formatDate(entry.date)}</span>
                            <span className="font-mono text-gray-500">{entry.cheque.chequeNumber}</span>
                            <span className="text-gray-300">&rarr;</span>
                            <span className={`font-semibold ${getStatusColor(entry.to).text}`}>{getStatusLabel(entry.to)}</span>
                            {entry.note && <span className="text-gray-400 italic">({entry.note})</span>}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Page ──

const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUnit = searchParams.get("unit");
  const unitRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const allCheques = useChequesStore((s) => s.cheques).map(applyAutoOverdue);
  const markAsCollected = useChequesStore((s) => s.markAsCollected);

  const clientCheques = useMemo(
    () => allCheques.filter((c) => c.clientId === clientId),
    [allCheques, clientId]
  );

  const unitsList = useMemo(() => {
    const map = new Map<string, UnitInfo>();
    clientCheques.forEach((c) => {
      const key = `${c.unitCode}-${c.compound}`;
      if (!map.has(key)) map.set(key, { unitCode: c.unitCode, compound: c.compound });
    });
    return [...map.values()];
  }, [clientCheques]);

  // Default: expand single unit, or expand target unit from query param
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => {
    if (targetUnit) {
      const match = unitsList.find((u) => u.unitCode === targetUnit);
      if (match) return new Set([`${match.unitCode}-${match.compound}`]);
    }
    return unitsList.length === 1 ? new Set([`${unitsList[0].unitCode}-${unitsList[0].compound}`]) : new Set();
  });

  // Scroll to target unit after mount
  useEffect(() => {
    if (targetUnit) {
      const match = unitsList.find((u) => u.unitCode === targetUnit);
      if (match) {
        const key = `${match.unitCode}-${match.compound}`;
        setExpandedUnits((prev) => new Set(prev).add(key));
        // Small delay for DOM to render expanded content
        setTimeout(() => {
          unitRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleUnit = (key: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (clientCheques.length === 0) {
    return (
      <div className="h-full w-full bg-white flex flex-col">
        <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-gray-50/50">
          <button onClick={() => navigate("/cheques")} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Cheques</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">Client not found</p>
        </div>
      </div>
    );
  }

  const clientName = clientCheques[0].clientName;
  const initials = clientName.split(" ").map((n) => n[0]).join("").slice(0, 2);

  // Overall stats
  const totalValue = clientCheques.reduce((s, c) => s + c.amount, 0);
  const collectedCheques = clientCheques.filter((c) => c.status === "collected");
  const collectedValue = collectedCheques.reduce((s, c) => s + c.amount, 0);
  const pendingCheques = clientCheques.filter((c) => c.status === "pending" || c.status === "post_dated");
  const pendingValue = pendingCheques.reduce((s, c) => s + c.amount, 0);
  const overdueCheques = clientCheques.filter((c) => c.status === "overdue");
  const overdueValue = overdueCheques.reduce((s, c) => s + c.amount, 0);
  const bouncedCheques = clientCheques.filter((c) => c.status === "bounced");
  const collectionRate = totalValue > 0 ? (collectedValue / totalValue) * 100 : 0;
  const hasIssues = overdueCheques.length > 0 || bouncedCheques.length > 0;

  // Next due cheque
  const nextDue = clientCheques
    .filter((c) => c.status !== "collected" && c.status !== "bounced")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <div className="h-full w-full bg-gray-50/30 text-gray-900 overflow-hidden font-sans flex flex-col">
      {/* Top bar with breadcrumb */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-5 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cheques")}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate("/cheques")} className="text-gray-400 hover:text-gray-600 transition-colors">
              Cheques Collection
            </button>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">{clientName}</span>
          </div>
        </div>

        {hasIssues && (
          <div className="flex items-center gap-2">
            {overdueCheques.length > 0 && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {overdueCheques.length} Overdue
              </div>
            )}
            {bouncedCheques.length > 0 && (
              <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-medium">
                {bouncedCheques.length} Bounced
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-6">

          {/* Client header card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${
                hasIssues ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
              }`}>
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900">{clientName}</h1>
                  {hasIssues && <AlertTriangle size={16} className="text-red-500" />}
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                  {unitsList.map((u, idx) => (
                    <span key={u.unitCode} className="flex items-center gap-1.5 text-xs text-gray-500">
                      {idx > 0 && <span className="text-gray-300">·</span>}
                      <Building2 size={12} className="text-gray-400" />
                      <span className="font-medium text-gray-600">{u.unitCode}</span>
                      <span>{u.compound}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Next due */}
              {nextDue && (
                <div className="shrink-0 text-right bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                  <div className="text-[10px] text-amber-600 uppercase tracking-wide font-semibold flex items-center gap-1 justify-end">
                    <Calendar size={10} />
                    Next Due
                  </div>
                  <div className="text-sm font-bold text-amber-800 mt-0.5">{formatDate(nextDue.dueDate)}</div>
                  <div className="text-[10px] text-amber-600">
                    {formatCurrency(nextDue.amount)} · {nextDue.unitCode}
                  </div>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-5 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-3.5 text-center">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Total Value</div>
                <div className="text-lg font-bold text-gray-900 mt-1 tabular-nums">{formatCurrency(totalValue)}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{clientCheques.length} cheques</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3.5 text-center">
                <div className="text-[10px] text-emerald-600 uppercase tracking-wide font-semibold">Collected</div>
                <div className="text-lg font-bold text-emerald-700 mt-1 tabular-nums">{formatCurrency(collectedValue)}</div>
                <div className="text-[10px] text-emerald-500 mt-0.5">{collectedCheques.length} cheques</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3.5 text-center">
                <div className="text-[10px] text-amber-600 uppercase tracking-wide font-semibold">Pending</div>
                <div className="text-lg font-bold text-amber-700 mt-1 tabular-nums">{formatCurrency(pendingValue)}</div>
                <div className="text-[10px] text-amber-500 mt-0.5">{pendingCheques.length} cheques</div>
              </div>
              <div className={`rounded-lg p-3.5 text-center ${overdueValue > 0 ? "bg-red-50" : "bg-gray-50"}`}>
                <div className={`text-[10px] uppercase tracking-wide font-semibold ${overdueValue > 0 ? "text-red-600" : "text-gray-400"}`}>Overdue</div>
                <div className={`text-lg font-bold mt-1 tabular-nums ${overdueValue > 0 ? "text-red-700" : "text-gray-300"}`}>
                  {overdueValue > 0 ? formatCurrency(overdueValue) : "—"}
                </div>
                <div className={`text-[10px] mt-0.5 ${overdueValue > 0 ? "text-red-500" : "text-gray-300"}`}>
                  {overdueCheques.length} cheques
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3.5 text-center">
                <div className="text-[10px] text-blue-600 uppercase tracking-wide font-semibold flex items-center gap-1 justify-center">
                  <TrendingUp size={10} />
                  Paid
                </div>
                <div className="text-lg font-bold text-blue-700 mt-1 tabular-nums">{collectionRate.toFixed(0)}%</div>
                <div className="text-[10px] text-blue-500 mt-0.5">{formatCurrency(collectedValue)} of {formatCurrency(totalValue)}</div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(collectionRate, 100)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Units */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">
                Units <span className="text-gray-400 font-normal ml-1">({unitsList.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedUnits(new Set(unitsList.map((u) => `${u.unitCode}-${u.compound}`)))}
                  className="text-[10px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Expand all
                </button>
                <span className="text-gray-200">|</span>
                <button
                  onClick={() => setExpandedUnits(new Set())}
                  className="text-[10px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Collapse all
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {unitsList.map((unit, idx) => {
                const key = `${unit.unitCode}-${unit.compound}`;
                const unitCheques = clientCheques
                  .filter((c) => c.unitCode === unit.unitCode && c.compound === unit.compound)
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                return (
                  <div key={key} ref={(el) => { unitRefs.current[key] = el; }}>
                    <UnitSection
                      unit={unit}
                      cheques={unitCheques}
                      isExpanded={expandedUnits.has(key)}
                      onToggle={() => toggleUnit(key)}
                      markAsCollected={markAsCollected}
                      unitIndex={idx}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
