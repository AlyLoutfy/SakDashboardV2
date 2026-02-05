import { motion } from "framer-motion";
import { TrendingUp, Calendar, Hash, Wallet, CheckCircle2, AlertTriangle, XCircle, Tag } from "lucide-react";
import { formatCurrency } from "../../store/paymentPlansStore";
import type { PlanValidation } from "../../store/paymentPlansStore";

interface LiveSummaryCardProps {
  basePrice: number;
  discountAmount: number;
  priceAfterDiscount: number;
  downPaymentAmount: number;
  remainingToFinance: number;
  totalInstallmentsCreated: number;
  installmentCount: number;
  durationMonths: number;
  validation: PlanValidation;
}

const LiveSummaryCard = ({ basePrice, discountAmount, priceAfterDiscount, downPaymentAmount, remainingToFinance, totalInstallmentsCreated, installmentCount, durationMonths, validation }: LiveSummaryCardProps) => {
  const years = Math.floor(durationMonths / 12);
  const months = durationMonths % 12;
  const durationText = years > 0 ? `${years}y${months > 0 ? ` ${months}m` : ""}` : `${months}m`;

  // How much still needs installments created
  const stillNeeded = remainingToFinance - totalInstallmentsCreated;
  const coveragePercent = remainingToFinance > 0 ? (totalInstallmentsCreated / remainingToFinance) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-4">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/50">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 opacity-20" />
        <div className="absolute inset-[1px] bg-white rounded-2xl" />

        {/* Content */}
        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Plan Summary</h3>
                <p className="text-[10px] text-gray-500">Live calculation</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${validation.errors.length > 0 ? "bg-red-100 text-red-700" : validation.warnings.length > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
              {validation.errors.length > 0 ? (
                <>
                  <XCircle size={10} />
                  Invalid
                </>
              ) : validation.warnings.length > 0 ? (
                <>
                  <AlertTriangle size={10} />
                  Warn
                </>
              ) : (
                <>
                  <CheckCircle2 size={10} />
                  Valid
                </>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs mb-4">
            {discountAmount > 0 ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Price</span>
                  <span className="font-medium text-gray-900">{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between text-amber-600">
                  <span className="flex items-center gap-1">
                    <Tag size={10} />
                    Discount
                  </span>
                  <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-700 font-medium">Final Price</span>
                  <span className="font-bold text-gray-900">{formatCurrency(priceAfterDiscount)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Total Price</span>
                <span className="font-bold text-gray-900">{formatCurrency(basePrice)}</span>
              </div>
            )}
          </div>

          {/* Down Payment & Financing */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-emerald-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-emerald-500 mb-0.5">
                <Wallet size={10} />
                <span className="text-[10px]">Down Payment</span>
              </div>
              <p className="text-sm font-bold text-emerald-700">{formatCurrency(downPaymentAmount)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                <TrendingUp size={10} />
                <span className="text-[10px]">To Finance</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(remainingToFinance)}</p>
            </div>
          </div>

          {/* Installment Coverage Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
              <span>Installments Coverage</span>
              <span className="font-medium text-emerald-600">{Math.min(100, coveragePercent).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, coveragePercent)}%` }} transition={{ duration: 0.5, ease: "easeOut" }} className={`h-full rounded-full ${coveragePercent >= 100 ? "bg-emerald-500" : "bg-amber-400"}`} />
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1">
              <span className="text-gray-500">Created: {formatCurrency(totalInstallmentsCreated)}</span>
              <span className={stillNeeded > 1 ? "text-amber-600 font-medium" : "text-emerald-600"}>{stillNeeded > 1 ? `Remaining: ${formatCurrency(stillNeeded)}` : "Fully covered ✓"}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                <Hash size={10} />
                <span className="text-[10px]">Installments</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{installmentCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                <Calendar size={10} />
                <span className="text-[10px]">Duration</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{durationText || "—"}</p>
            </div>
          </div>

          {/* Per Installment Footer */}
          {installmentCount > 0 && remainingToFinance > 0 && (
            <div className="mt-3 p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white text-center">
              <p className="text-[10px] text-emerald-100">Average per installment</p>
              <p className="text-base font-bold">{formatCurrency(remainingToFinance / installmentCount)}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveSummaryCard;
