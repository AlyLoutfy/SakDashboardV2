import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, Clock, Percent, Hash, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { AdminRestrictions, PlanValidation } from "../../store/paymentPlansStore";

interface AdminRestrictionsPanelProps {
  restrictions: AdminRestrictions;
  validation: PlanValidation;
  currentValues: {
    durationYears: number;
    downPaymentPercent: number;
    installmentCount: number;
    discountPercent: number;
  };
}

const AdminRestrictionsPanel = ({ restrictions, validation, currentValues }: AdminRestrictionsPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const restrictionItems = [
    {
      icon: Clock,
      label: "Max Duration",
      limit: `${restrictions.maxYears} years`,
      current: `${currentValues.durationYears.toFixed(1)} years`,
      ratio: currentValues.durationYears / restrictions.maxYears,
      exceeded: currentValues.durationYears > restrictions.maxYears,
    },
    {
      icon: Percent,
      label: "Min Down Payment",
      limit: `${restrictions.minDownPaymentPercent}%`,
      current: `${currentValues.downPaymentPercent.toFixed(1)}%`,
      ratio: currentValues.downPaymentPercent / restrictions.minDownPaymentPercent,
      exceeded: currentValues.downPaymentPercent < restrictions.minDownPaymentPercent,
      isMinimum: true,
    },
    {
      icon: Hash,
      label: "Max Installments",
      limit: `${restrictions.maxInstallments}`,
      current: `${currentValues.installmentCount}`,
      ratio: currentValues.installmentCount / restrictions.maxInstallments,
      exceeded: currentValues.installmentCount > restrictions.maxInstallments,
    },
    {
      icon: Percent,
      label: "Max Discount",
      limit: `${restrictions.maxDiscountPercent}%`,
      current: `${currentValues.discountPercent.toFixed(1)}%`,
      ratio: currentValues.discountPercent / restrictions.maxDiscountPercent,
      exceeded: currentValues.discountPercent > restrictions.maxDiscountPercent,
    },
  ];

  const getStatusIcon = (item: (typeof restrictionItems)[0]) => {
    if (item.exceeded) {
      return <XCircle size={16} className="text-red-500" />;
    }
    if (item.isMinimum) {
      // For minimums, check if we're above the threshold
      return item.ratio >= 1 ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />;
    }
    // For maximums
    if (item.ratio > 0.8) {
      return <AlertTriangle size={16} className="text-amber-500" />;
    }
    return <CheckCircle2 size={16} className="text-emerald-500" />;
  };

  const getProgressColor = (item: (typeof restrictionItems)[0]) => {
    if (item.exceeded) return "bg-red-500";
    if (item.isMinimum) {
      return item.ratio >= 1 ? "bg-emerald-500" : "bg-amber-500";
    }
    if (item.ratio > 0.8) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div
      className={`
      rounded-2xl border transition-all duration-200
      ${validation.errors.length > 0 ? "bg-red-50 border-red-200" : validation.warnings.length > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}
    `}
    >
      {/* Header */}
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3">
          <div
            className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${validation.errors.length > 0 ? "bg-red-100" : validation.warnings.length > 0 ? "bg-amber-100" : "bg-emerald-100"}
          `}
          >
            <Shield size={20} className={validation.errors.length > 0 ? "text-red-600" : validation.warnings.length > 0 ? "text-amber-600" : "text-emerald-600"} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Admin Restrictions</h3>
            <p className="text-xs text-gray-500">{validation.errors.length > 0 ? `${validation.errors.length} violation${validation.errors.length > 1 ? "s" : ""}` : validation.warnings.length > 0 ? `${validation.warnings.length} warning${validation.warnings.length > 1 ? "s" : ""}` : "All requirements met"}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-4">
              {/* Restriction Items */}
              {restrictionItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <item.icon size={14} className="text-gray-400" />
                      <span className="text-gray-600">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">{item.current}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-500">{item.limit}</span>
                      {getStatusIcon(item)}
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (item.isMinimum ? item.ratio : item.ratio) * 100)}%` }} transition={{ duration: 0.5, ease: "easeOut" }} className={`h-full rounded-full ${getProgressColor(item)}`} />
                  </div>
                </div>
              ))}

              {/* Error Messages */}
              {validation.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 rounded-xl space-y-1">
                  {validation.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-700 flex items-start gap-2">
                      <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Warning Messages */}
              {validation.warnings.length > 0 && validation.errors.length === 0 && (
                <div className="mt-4 p-3 bg-amber-100 rounded-xl space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <p key={index} className="text-sm text-amber-700 flex items-start gap-2">
                      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                      {warning}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRestrictionsPanel;
