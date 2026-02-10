import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreVertical, Copy, Trash2, Eye, FileText } from "lucide-react";
import type { PaymentPlan } from "../../store/paymentPlansStore";
import { formatCurrency, formatDate, calculatePlanSummary } from "../../store/paymentPlansStore";

interface PaymentPlansTableProps {
  plans: PaymentPlan[];
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

// Simple dropdown component to replace HeroUI Dropdown
const ActionsDropdown = ({ onView, onDuplicate, onDelete }: { onView: () => void; onDuplicate: () => void; onDelete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 hover:bg-gray-100">
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-1 overflow-hidden">
          <button
            onClick={() => {
              onView();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={14} />
            <span>View & Edit</span>
          </button>
          <button
            onClick={() => {
              onDuplicate();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy size={14} />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

const STATUS_CONFIG: Record<PaymentPlan["status"], { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  sent: { label: "Sent", color: "text-blue-600", bg: "bg-blue-100" },
  active: { label: "Active", color: "text-emerald-600", bg: "bg-emerald-100" },
  completed: { label: "Completed", color: "text-purple-600", bg: "bg-purple-100" },
};

const PaymentPlansTable = ({ plans, onSelect, onDuplicate, onDelete, onCreate }: PaymentPlansTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch = plan.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || plan.unitCode.toLowerCase().includes(searchQuery.toLowerCase()) || plan.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [plans, searchQuery]);

  return (
    <div className="flex flex-col">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by client, unit, or ID..." className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
        </div>

        {/* Status Filter */}

        <button onClick={onCreate} className="flex items-center gap-2 bg-gray-900 text-white font-medium shadow-lg shadow-gray-200 hover:bg-gray-800 rounded-xl h-[42px] px-4 transition-colors">
          <Plus size={18} />
          New Plan
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200">
        {filteredPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No Payment Plans Found</h3>
            <p className="text-sm text-gray-500 mb-4">{searchQuery ? "Try adjusting your search" : "Create your first payment plan to get started"}</p>
            {!searchQuery && (
              <button onClick={onCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                <Plus size={18} />
                Create Payment Plan
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan ID</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="py-3 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="py-3 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Installments</th>
                <th className="py-3 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="py-3 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlans.map((plan, index) => {
                const summary = calculatePlanSummary(plan);
                const statusConfig = STATUS_CONFIG[plan.status];

                return (
                  <motion.tr key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} onClick={() => onSelect(plan.id)} className="group hover:bg-emerald-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-6">
                      <p className="font-mono text-sm font-medium text-gray-900">#{plan.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{formatDate(plan.createdAt)}</p>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-xs">{plan.clientName.charAt(0).toUpperCase() || "?"}</div>
                        <p className="font-medium text-gray-900 text-sm">{plan.clientName || "—"}</p>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <p className="font-medium text-gray-700 text-sm">{plan.unitCode || "—"}</p>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <p className="font-semibold text-gray-900 text-sm">{formatCurrency(summary.priceAfterDiscount)}</p>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <p className="font-medium text-gray-700 text-sm">{plan.installments.length}</p>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <p className="font-medium text-gray-700 text-sm">{summary.durationYears >= 1 ? `${summary.durationYears.toFixed(1)}y` : `${summary.durationMonths}m`}</p>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}>{statusConfig.label}</span>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <ActionsDropdown onView={() => onSelect(plan.id)} onDuplicate={() => onDuplicate(plan.id)} onDelete={() => onDelete(plan.id)} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentPlansTable;
