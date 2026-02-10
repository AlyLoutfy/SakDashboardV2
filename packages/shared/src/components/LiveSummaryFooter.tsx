import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { formatCurrency, type PlanValidation } from "../../store/paymentPlansStore";

interface LiveSummaryFooterProps {
  summary: any; // Using the return type of calculatePlanSummary
  validation: PlanValidation;
}

export default function LiveSummaryFooter({ summary, validation }: LiveSummaryFooterProps) {
  const { priceAfterDiscount, totalInstallmentsCreated, remainingToFinance, downPaymentAmount } = summary;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopoverOpen]);

  // Coverage check
  const stillNeeded = remainingToFinance - totalInstallmentsCreated;
  const coveragePercent = remainingToFinance > 0 ? (totalInstallmentsCreated / remainingToFinance) * 100 : 0;
  const isCovered = Math.abs(stillNeeded) < 1; // Tolerance for floats

  // Validation Status Logic
  const statusColor = validation.errors.length > 0 ? "bg-red-50 text-red-700 border-red-200" : validation.warnings.length > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const StatusIcon = validation.errors.length > 0 ? XCircle : validation.warnings.length > 0 ? AlertTriangle : CheckCircle2;

  return (
    <div className="bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
      <div className="flex items-center justify-between gap-6">
        {/* Left: Status & Validation */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={popoverRef}>
            <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusColor} transition-all hover:brightness-95`}>
              <StatusIcon size={16} />
              <span className="text-xs font-bold">{validation.errors.length > 0 ? "Invalid Plan" : validation.warnings.length > 0 ? "Warnings Found" : "Valid Plan"}</span>
              {(validation.errors.length > 0 || validation.warnings.length > 0) && <div className="bg-white/50 px-1.5 rounded-md text-[10px] font-bold">{validation.errors.length + validation.warnings.length}</div>}
              <ChevronUp size={14} />
            </button>
            {isPopoverOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-80 p-4 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">System Validation</h4>
                  {validation.errors.length === 0 && validation.warnings.length === 0 && <p className="text-sm text-gray-500">All checks passed successfully.</p>}
                  <div className="space-y-2">
                    {validation.errors.map((err: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                        <XCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{err}</span>
                      </div>
                    ))}
                    {validation.warnings.map((warn: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Coverage Progress */}
        <div className="flex-1 max-w-xl flex flex-col justify-center gap-1.5 px-4 border-l border-r border-gray-100">
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-gray-500 font-medium">Financing Coverage</span>
            <span className={`font-bold ${isCovered ? "text-emerald-600" : "text-amber-600"}`}>{Math.min(100, coveragePercent).toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, coveragePercent)}%` }} className={`h-full rounded-full ${isCovered ? "bg-emerald-500" : "bg-amber-400"}`} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Rec: {formatCurrency(totalInstallmentsCreated)}</span>
            <span>Target: {formatCurrency(remainingToFinance)}</span>
          </div>
        </div>

        {/* Right: Key Metrics */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Down Payment</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(downPaymentAmount)}</p>
          </div>

          <div className="text-right pl-6 border-l border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Final Price</p>
            <p className="text-xl font-black text-emerald-600">{formatCurrency(priceAfterDiscount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
