import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useChequesStore, formatCurrency } from "../../store/chequesStore";

type CashFlowMode = "due_date" | "collection_date";

const selectClass =
  "h-8 pl-2.5 pr-7 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-gray-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-size-[12px] bg-position-[right_8px_center] bg-no-repeat";

const CashFlowChart = () => {
  const getMonthlyCashFlow = useChequesStore((s) => s.getMonthlyCashFlow);
  const allData = getMonthlyCashFlow();

  const currentMonthKey = "2026-04";
  const [mode, setMode] = useState<CashFlowMode>("due_date");

  // Default range: 6 months back to 6 months forward from current month
  const defaultFrom = useMemo(() => {
    const idx = allData.findIndex((d) => d.key === currentMonthKey);
    const startIdx = Math.max(0, idx - 6);
    return allData[startIdx]?.key ?? allData[0]?.key ?? currentMonthKey;
  }, [allData]);

  const defaultTo = useMemo(() => {
    const idx = allData.findIndex((d) => d.key === currentMonthKey);
    const endIdx = Math.min(allData.length - 1, idx + 5);
    return allData[endIdx]?.key ?? allData[allData.length - 1]?.key ?? currentMonthKey;
  }, [allData]);

  const [fromMonth, setFromMonth] = useState(defaultFrom);
  const [toMonth, setToMonth] = useState(defaultTo);

  const visibleData = useMemo(
    () => allData.filter((d) => d.key >= fromMonth && d.key <= toMonth),
    [allData, fromMonth, toMonth]
  );

  // Pick the correct collected value based on mode
  const getCollected = (d: (typeof allData)[0]) =>
    mode === "due_date" ? d.collected : d.collectedByDate;

  const maxValue = Math.max(...visibleData.map((d) => Math.max(d.expected, getCollected(d))), 1);

  const niceMax = (() => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const normalized = maxValue / magnitude;
    if (normalized <= 1) return magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 5) return 5 * magnitude;
    return 10 * magnitude;
  })();

  const gridLines = [0.25, 0.5, 0.75, 1].map((pct) => ({
    value: niceMax * pct,
    pct: pct * 100,
  }));

  const visibleTotalExpected = visibleData.reduce((s, d) => s + d.expected, 0);
  const visibleTotalCollected = visibleData.reduce((s, d) => s + getCollected(d), 0);
  const collectionRate = visibleTotalExpected > 0 ? (visibleTotalCollected / visibleTotalExpected) * 100 : 0;

  const currentMonthLabel = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(currentMonthKey + "-01"));

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const fmtAxis = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toString();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Cash Flow</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {mode === "due_date"
              ? "Collections attributed to the month they were originally due"
              : "Collections attributed to the month the payment was actually received"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Summary pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
              <div className="w-2 h-2 rounded-sm bg-gray-300" />
              <span className="text-[10px] text-gray-500">Expected</span>
              <span className="text-[10px] font-bold text-gray-700 ml-0.5">{formatCurrency(visibleTotalExpected)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 rounded-lg px-2.5 py-1.5">
              <div className="w-2 h-2 rounded-sm bg-emerald-500" />
              <span className="text-[10px] text-emerald-600">Collected</span>
              <span className="text-[10px] font-bold text-emerald-700 ml-0.5">{formatCurrency(visibleTotalCollected)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-2.5 py-1.5">
              {collectionRate >= 50 ? (
                <TrendingUp size={11} className="text-blue-500" />
              ) : (
                <TrendingDown size={11} className="text-blue-500" />
              )}
              <span className="text-[10px] font-bold text-blue-700">{collectionRate.toFixed(0)}%</span>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setMode("due_date")}
              className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-md transition-all ${
                mode === "due_date"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              By Due Date
            </button>
            <button
              onClick={() => setMode("collection_date")}
              className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-md transition-all ${
                mode === "collection_date"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              By Collection Date
            </button>
          </div>

          {/* Month range selectors */}
          <div className="flex items-center gap-1.5">
            <select
              value={fromMonth}
              onChange={(e) => {
                const v = e.target.value;
                setFromMonth(v);
                if (v > toMonth) setToMonth(v);
              }}
              className={selectClass}
            >
              {allData.map((d) => (
                <option key={d.key} value={d.key}>{d.month}</option>
              ))}
            </select>
            <span className="text-[10px] text-gray-400 font-medium">to</span>
            <select
              value={toMonth}
              onChange={(e) => {
                const v = e.target.value;
                setToMonth(v);
                if (v < fromMonth) setFromMonth(v);
              }}
              className={selectClass}
            >
              {allData.filter((d) => d.key >= fromMonth).map((d) => (
                <option key={d.key} value={d.key}>{d.month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      {visibleData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
          No data for the selected range
        </div>
      ) : (
        <div>
          {/* Chart area */}
          <div className="relative" style={{ height: 200 }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-7 w-14 flex flex-col justify-between pointer-events-none">
              {[...gridLines].reverse().map((line) => (
                <div key={line.pct} className="text-[9px] text-gray-300 font-medium tabular-nums">
                  {fmtAxis(line.value)}
                </div>
              ))}
              <div className="text-[9px] text-gray-300 font-medium">0</div>
            </div>

            {/* Bars area */}
            <div className="ml-14 relative" style={{ height: 200 }}>
              {/* Grid lines */}
              {gridLines.map((line) => (
                <div
                  key={line.pct}
                  className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                  style={{ bottom: `calc(${(line.pct / 100) * 172}px + 28px)` }}
                />
              ))}

              <div className="flex items-end gap-1.5 h-full">
                {visibleData.map((d, i) => {
                  const collected = getCollected(d);
                  const expectedH = (d.expected / niceMax) * 100;
                  const collectedH = (collected / niceMax) * 100;
                  const isCurrent = d.month === currentMonthLabel;
                  const isHovered = hoveredIdx === i;
                  const collectedPct = d.expected > 0 ? ((collected / d.expected) * 100).toFixed(0) : "0";

                  const tallerBarPct = Math.max(expectedH, collectedH);
                  const tooltipBottom = Math.round((tallerBarPct / 100) * 172) + 28 + 8;

                  return (
                    <div
                      key={d.key}
                      className="flex-1 flex flex-col items-center relative"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {/* Hover tooltip */}
                      {isHovered && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                          style={{ bottom: tooltipBottom }}
                        >
                          <div className="bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                            <div className="font-bold mb-1 text-[11px]">{d.month}</div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="w-1.5 h-1.5 rounded-sm bg-gray-400" />
                              <span className="text-gray-300">Expected:</span>
                              <span className="font-semibold">{formatCurrency(d.expected)}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="w-1.5 h-1.5 rounded-sm bg-emerald-400" />
                              <span className="text-gray-300">Collected:</span>
                              <span className="font-semibold text-emerald-400">{formatCurrency(collected)}</span>
                            </div>
                            <div className="border-t border-gray-700 mt-1 pt-1 text-gray-400">
                              Rate: <span className="font-semibold text-white">{collectedPct}%</span>
                            </div>
                            {mode === "collection_date" && d.collected !== collected && (
                              <div className="text-[9px] text-gray-500 mt-1">
                                By due date: {formatCurrency(d.collected)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Current month indicator */}
                      {isCurrent && (
                        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: tooltipBottom }}>
                          <span className="text-[8px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">NOW</span>
                        </div>
                      )}

                      {/* Bar group */}
                      <div className="w-full flex items-end gap-[3px] h-[172px]">
                        <motion.div
                          key={`e-${d.key}-${mode}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${expectedH}%` }}
                          transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
                          className={`flex-1 rounded-t-md min-h-[2px] transition-colors ${
                            isCurrent ? "bg-blue-200" : isHovered ? "bg-gray-300" : "bg-gray-100"
                          }`}
                        />
                        <motion.div
                          key={`c-${d.key}-${mode}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${collectedH}%` }}
                          transition={{ delay: i * 0.03 + 0.08, duration: 0.4, ease: "easeOut" }}
                          className={`flex-1 rounded-t-md min-h-[2px] transition-colors ${
                            isHovered ? "bg-emerald-400" : "bg-emerald-500"
                          } ${collected === 0 && d.expected > 0 ? "opacity-0" : ""}`}
                        />
                      </div>

                      {/* Month label */}
                      <span
                        className={`text-[9px] mt-1.5 font-medium transition-colors ${
                          isCurrent ? "text-blue-600 font-bold" : isHovered ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monthly summary table */}
          <div className="mt-5 border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left font-semibold text-gray-400 px-3 py-2">Month</th>
                  <th className="text-right font-semibold text-gray-400 px-3 py-2">Expected</th>
                  <th className="text-right font-semibold text-gray-400 px-3 py-2">Collected</th>
                  <th className="text-right font-semibold text-gray-400 px-3 py-2">Outstanding</th>
                  <th className="text-right font-semibold text-gray-400 px-3 py-2 w-20">Rate</th>
                </tr>
              </thead>
              <tbody>
                {visibleData.map((d) => {
                  const collected = getCollected(d);
                  const outstanding = d.expected - collected;
                  const rate = d.expected > 0 ? (collected / d.expected) * 100 : 0;
                  const isCurrent = d.month === currentMonthLabel;
                  return (
                    <tr
                      key={d.key}
                      className={`border-b border-gray-50 transition-colors ${isCurrent ? "bg-blue-50/40" : "hover:bg-gray-50/50"}`}
                    >
                      <td className="px-3 py-2">
                        <span className={`font-medium ${isCurrent ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                          {d.month}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-gray-600">{formatCurrency(d.expected)}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-semibold text-emerald-600">{formatCurrency(collected)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        <span className={outstanding > 0 ? "text-amber-600" : "text-gray-300"}>
                          {outstanding > 0 ? formatCurrency(outstanding) : "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5 justify-end">
                          <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${rate >= 100 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-semibold tabular-nums w-7 text-right ${
                            rate >= 100 ? "text-emerald-600" : rate >= 50 ? "text-amber-600" : "text-red-500"
                          }`}>
                            {rate.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="px-3 py-2 font-bold text-gray-700">Total</td>
                  <td className="px-3 py-2 text-right tabular-nums font-bold text-gray-700">{formatCurrency(visibleTotalExpected)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-bold text-emerald-600">{formatCurrency(visibleTotalCollected)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-bold">
                    <span className={visibleTotalExpected - visibleTotalCollected > 0 ? "text-amber-600" : "text-gray-300"}>
                      {visibleTotalExpected - visibleTotalCollected > 0 ? formatCurrency(visibleTotalExpected - visibleTotalCollected) : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5 justify-end">
                      <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${Math.min(collectionRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 tabular-nums w-7 text-right">{collectionRate.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlowChart;
