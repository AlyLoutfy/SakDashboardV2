import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, CalendarClock, AlertTriangle } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  useChequesStore,
  getStatusColor,
  applyAutoOverdue,
  type Cheque,
} from "../../store/chequesStore";

type Period = "this_month" | "this_quarter" | "this_year" | "all_time";

const PERIOD_LABELS: Record<Period, string> = {
  this_month: "This Month",
  this_quarter: "This Quarter",
  this_year: "This Year",
  all_time: "All Time",
};

function filterByPeriod(cheques: Cheque[], period: Period): Cheque[] {
  if (period === "all_time") return cheques;
  const today = new Date("2026-04-06");
  const year = today.getFullYear();
  const month = today.getMonth();

  let start: Date;
  let end: Date;

  if (period === "this_month") {
    start = new Date(year, month, 1);
    end = new Date(year, month + 1, 0);
  } else if (period === "this_quarter") {
    const qStart = Math.floor(month / 3) * 3;
    start = new Date(year, qStart, 1);
    end = new Date(year, qStart + 3, 0);
  } else {
    start = new Date(year, 0, 1);
    end = new Date(year, 11, 31);
  }

  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);
  return cheques.filter((c) => c.dueDate >= startStr && c.dueDate <= endStr);
}

// Popover wrapper that closes on outside click
const Popover = ({
  trigger,
  children,
  open,
  onToggle,
  align = "left",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  align?: "left" | "right";
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button onClick={onToggle} className="cursor-pointer">
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`absolute top-full mt-2 z-30 bg-white border border-gray-200 rounded-xl shadow-xl ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Upcoming Due popover content
const UpcomingDuePopover = () => {
  const getUpcomingDue = useChequesStore((s) => s.getUpcomingDue);
  const markAsCollected = useChequesStore((s) => s.markAsCollected);
  const [window, setWindow] = useState<7 | 14 | 30>(14);
  const cheques = getUpcomingDue(window);
  const today = new Date("2026-04-06");
  const totalValue = cheques.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="w-[520px]">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock size={14} className="text-amber-600" />
          <span className="text-xs font-bold text-gray-900">Upcoming Due</span>
          <span className="text-[10px] text-gray-400">{formatCurrency(totalValue)}</span>
        </div>
        <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
          {([7, 14, 30] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={`px-2 py-1 text-[10px] font-semibold transition-colors ${
                window === w ? "bg-amber-500 text-white" : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {w}d
            </button>
          ))}
        </div>
      </div>

      {cheques.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-gray-400">No cheques due in the next {window} days</div>
      ) : (
        <div className="max-h-64 overflow-auto divide-y divide-gray-50">
          {cheques.map((cheque) => {
            const dueDate = new Date(cheque.dueDate);
            const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysUntil <= 3;
            return (
              <div key={cheque.id} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900 truncate">{cheque.clientName}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{cheque.chequeNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">{cheque.unitCode}</span>
                    <span className="text-[10px] text-gray-600 tabular-nums">{formatDate(cheque.dueDate)}</span>
                    {isUrgent ? (
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded">
                        {daysUntil === 0 ? "TODAY" : `${daysUntil}d`}
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-amber-500">{daysUntil}d</span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-900 tabular-nums shrink-0">{formatCurrency(cheque.amount)}</span>
                <button
                  onClick={() => markAsCollected(cheque.id)}
                  className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 transition-colors"
                  title="Mark as collected"
                >
                  <CheckCircle2 size={11} className="text-emerald-600" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Overdue Aging popover content
const OverdueAgingPopover = () => {
  const getOverdueAging = useChequesStore((s) => s.getOverdueAging);
  const markAsCollected = useChequesStore((s) => s.markAsCollected);
  const buckets = getOverdueAging();
  const today = new Date("2026-04-06");
  const totalOverdue = buckets.reduce((s, b) => s + b.cheques.length, 0);
  const totalValue = buckets.reduce((s, b) => s + b.cheques.reduce((ss, c) => ss + c.amount, 0), 0);

  const severityColors = [
    { bg: "bg-amber-50", bar: "bg-amber-400", text: "text-amber-700" },
    { bg: "bg-orange-50", bar: "bg-orange-400", text: "text-orange-700" },
    { bg: "bg-red-50", bar: "bg-red-400", text: "text-red-700" },
    { bg: "bg-rose-50", bar: "bg-rose-500", text: "text-rose-800" },
  ];

  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);

  return (
    <div className="w-[440px]">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500" />
          <span className="text-xs font-bold text-gray-900">Overdue Aging</span>
          <span className="text-[10px] text-gray-400">{totalOverdue} cheques &middot; {formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Aging bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-0.5 h-2.5 rounded-full overflow-hidden bg-gray-100">
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
      </div>

      {/* Buckets */}
      <div className="px-4 pb-3 grid grid-cols-4 gap-1.5">
        {buckets.map((bucket, i) => {
          const colors = severityColors[i];
          const bucketValue = bucket.cheques.reduce((s, c) => s + c.amount, 0);
          const isOpen = expandedBucket === bucket.bucket;
          return (
            <button
              key={bucket.bucket}
              onClick={() => setExpandedBucket(isOpen ? null : bucket.bucket)}
              disabled={bucket.cheques.length === 0}
              className={`text-left px-2.5 py-2 rounded-lg transition-colors ${
                bucket.cheques.length === 0
                  ? "bg-gray-50 opacity-40 cursor-default"
                  : isOpen
                  ? `${colors.bg} ring-1 ring-inset ring-current ${colors.text}`
                  : `${colors.bg} hover:opacity-80 cursor-pointer`
              }`}
            >
              <div className={`text-[10px] font-bold ${bucket.cheques.length > 0 ? colors.text : "text-gray-400"}`}>
                {bucket.bucket}
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-sm font-bold ${bucket.cheques.length > 0 ? colors.text : "text-gray-300"}`}>
                  {bucket.cheques.length}
                </span>
                {bucket.cheques.length > 0 && (
                  <span className="text-[9px] text-gray-400">{formatCurrency(bucketValue)}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded bucket cheques */}
      <AnimatePresence>
        {expandedBucket && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="max-h-48 overflow-auto divide-y divide-gray-50">
              {buckets
                .find((b) => b.bucket === expandedBucket)
                ?.cheques.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((cheque) => {
                  const daysOverdue = Math.floor(
                    (today.getTime() - new Date(cheque.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const statusColors = getStatusColor(cheque.status);
                  return (
                    <div key={cheque.id} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors">
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
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-900 tabular-nums shrink-0">{formatCurrency(cheque.amount)}</span>
                      {cheque.status !== "collected" && (
                        <button
                          onClick={() => markAsCollected(cheque.id)}
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
};

const StatCards = () => {
  const [period, setPeriod] = useState<Period>("this_quarter");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePopover, setActivePopover] = useState<"upcoming" | "overdue" | null>(null);
  const allCheques = useChequesStore((s) => s.cheques).map(applyAutoOverdue);
  const getUpcomingDue = useChequesStore((s) => s.getUpcomingDue);

  const cheques = filterByPeriod(allCheques, period);
  const sum = (arr: Cheque[]) => arr.reduce((s, c) => s + c.amount, 0);

  const collected = cheques.filter((c) => c.status === "collected");
  const overdue = cheques.filter((c) => c.status === "overdue");
  const bounced = cheques.filter((c) => c.status === "bounced");
  const pending = cheques.filter((c) => c.status === "pending" || c.status === "post_dated");

  const dueTotal = cheques.filter((c) => c.status !== "post_dated");
  const collectionRate = dueTotal.length > 0 ? (collected.length / dueTotal.length) * 100 : 0;

  const upcomingCount = getUpcomingDue(14).length;
  const overdueAndBounced = allCheques.filter((c) => c.status === "overdue" || c.status === "bounced").length;

  const items = [
    { label: "Due", count: cheques.length, value: sum(cheques), color: "text-gray-900", dot: "bg-gray-400" },
    { label: "Collected", count: collected.length, value: sum(collected), color: "text-emerald-700", dot: "bg-emerald-500" },
    { label: "Pending", count: pending.length, value: sum(pending), color: "text-amber-700", dot: "bg-amber-500", hide: pending.length === 0 },
    { label: "Bounced", count: bounced.length, value: sum(bounced), color: "text-rose-700", dot: "bg-rose-600", hide: bounced.length === 0 },
  ].filter((i) => !i.hide);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-5 px-4 py-3 bg-gray-50/80 rounded-xl border border-gray-100"
    >
      {/* Period selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-gray-300 transition-colors"
        >
          {PERIOD_LABELS[period]}
          <ChevronDown size={12} className="text-gray-400" />
        </button>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setShowDropdown(false)} />
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 min-w-[130px]">
              {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPeriod(p); setShowDropdown(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                    period === p ? "bg-gray-50 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Stats inline */}
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
          <span className={`text-sm font-bold ${item.color} tabular-nums`}>{item.count}</span>
          <span className="text-[10px] text-gray-400">{item.label}</span>
          <span className="text-[10px] text-gray-300 ml-0.5">{formatCurrency(item.value)}</span>
        </div>
      ))}

      <div className="w-px h-6 bg-gray-200" />

      {/* Upcoming Due - clickable */}
      {upcomingCount > 0 && (
        <Popover
          open={activePopover === "upcoming"}
          onToggle={() => setActivePopover(activePopover === "upcoming" ? null : "upcoming")}
          trigger={
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
              activePopover === "upcoming" ? "bg-amber-100" : "hover:bg-amber-50"
            }`}>
              <CalendarClock size={12} className="text-amber-500" />
              <span className="text-sm font-bold text-amber-600 tabular-nums">{upcomingCount}</span>
              <span className="text-[10px] text-amber-500">Upcoming</span>
            </div>
          }
        >
          <UpcomingDuePopover />
        </Popover>
      )}

      {/* Overdue Aging - clickable */}
      {overdueAndBounced > 0 && (
        <Popover
          open={activePopover === "overdue"}
          onToggle={() => setActivePopover(activePopover === "overdue" ? null : "overdue")}
          align="right"
          trigger={
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
              activePopover === "overdue" ? "bg-red-100" : "hover:bg-red-50"
            }`}>
              <AlertTriangle size={12} className="text-red-500" />
              <span className="text-sm font-bold text-red-600 tabular-nums">{overdueAndBounced}</span>
              <span className="text-[10px] text-red-500">Overdue</span>
            </div>
          }
        >
          <OverdueAgingPopover />
        </Popover>
      )}

      <div className="w-px h-6 bg-gray-200 ml-auto" />

      {/* Collection Rate */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900 tabular-nums">{collectionRate.toFixed(0)}%</span>
        <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(collectionRate, 100)}%` }} />
        </div>
        <span className="text-[10px] text-gray-400">collected</span>
      </div>
    </motion.div>
  );
};

export default StatCards;
