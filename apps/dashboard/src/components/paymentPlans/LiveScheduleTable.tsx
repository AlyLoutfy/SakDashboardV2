import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { usePaymentPlansStore, formatCurrency } from "../../store/paymentPlansStore";

export default function LiveScheduleTable() {
  const { currentPlan, removeInstallment, updateInstallment } = usePaymentPlansStore();

  if (!currentPlan) return null;

  const { basePrice, discount } = currentPlan;
  const discountAmount = discount.type === "percentage" ? (basePrice * discount.value) / 100 : discount.value;
  const priceAfterDiscount = basePrice - discountAmount;

  // Sort installments by date
  const sortedInstallments = useMemo(() => {
    return [...currentPlan.installments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [currentPlan.installments]);

  // Running totals
  let runningTotal = 0;
  let runningPercent = 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200"># / Name</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">Date</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right">Installment</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right">Other / Maint</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right w-16">%</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right w-24">Total %</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right w-32">Total Paid</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedInstallments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  No payments added yet. Use the builder above.
                </td>
              </tr>
            ) : (
              sortedInstallments.map((inst) => {
                runningTotal += inst.amount;
                const rowPercent = priceAfterDiscount > 0 ? (inst.amount / priceAfterDiscount) * 100 : 0;
                runningPercent += rowPercent;

                const isInstallment = inst.type === "installment";
                const dateVal = new Date(inst.dueDate).toISOString().split("T")[0];

                return (
                  <motion.tr key={inst.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="hover:bg-gray-50/80 group transition-colors">
                    {/* Name / Number */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isInstallment ? "bg-blue-500" : "bg-emerald-500"}`} />
                        <input type="text" value={inst.label || ""} onChange={(e) => updateInstallment(inst.id, { label: e.target.value })} className="font-medium text-sm text-gray-900 bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 transition-all w-full" placeholder={inst.type} />
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-4">
                      <input type="date" value={dateVal} onChange={(e) => updateInstallment(inst.id, { dueDate: new Date(e.target.value) })} className="bg-transparent text-sm text-gray-600 font-medium focus:outline-none focus:text-emerald-600 focus:font-bold w-full cursor-pointer hover:text-gray-900" />
                    </td>

                    {/* Installment Value */}
                    <td className="py-2.5 px-4 text-right">
                      {isInstallment ? (
                        <input
                          type="text"
                          value={inst.amount ? inst.amount.toLocaleString() : "0"}
                          onChange={(e) => {
                            const val = e.target.value.replace(/,/g, "");
                            if (!isNaN(Number(val))) {
                              updateInstallment(inst.id, { amount: Number(val) });
                            }
                          }}
                          className="w-full text-right bg-transparent text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded px-1 transition-all"
                        />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    {/* Other Value */}
                    <td className="py-2.5 px-4 text-right">
                      {!isInstallment ? (
                        <input
                          type="text"
                          value={inst.amount ? inst.amount.toLocaleString() : "0"}
                          onChange={(e) => {
                            const val = e.target.value.replace(/,/g, "");
                            if (!isNaN(Number(val))) {
                              updateInstallment(inst.id, { amount: Number(val) });
                            }
                          }}
                          className="w-full text-right bg-transparent text-sm font-medium text-amber-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 rounded px-1 transition-all"
                        />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    {/* Percentage */}
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-xs text-gray-500 font-medium">{rowPercent.toFixed(1)}%</span>
                    </td>

                    {/* Total % */}
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-xs font-bold text-gray-700">{runningPercent.toFixed(1)}%</span>
                    </td>

                    {/* Total Paid */}
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-sm font-mono text-gray-600">{formatCurrency(runningTotal)}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-center">
                      <button onClick={() => removeInstallment(inst.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={2} className="py-3 px-4 font-bold text-gray-800 text-right">
                Totals
              </td>
              <td className="py-3 px-4 font-bold text-gray-900 text-right">{formatCurrency(sortedInstallments.filter((i) => i.type === "installment").reduce((sum, i) => sum + i.amount, 0))}</td>
              <td className="py-3 px-4 font-bold text-amber-700 text-right">{formatCurrency(sortedInstallments.filter((i) => i.type !== "installment").reduce((sum, i) => sum + i.amount, 0))}</td>
              <td colSpan={2} className="py-3 px-4 text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${Math.abs(runningPercent - 100) < 0.1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{runningPercent.toFixed(1)}%</span>
              </td>
              <td className="py-3 px-4 font-bold text-gray-900 text-right">{formatCurrency(runningTotal)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
