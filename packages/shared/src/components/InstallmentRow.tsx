import { motion } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Installment } from "../../store/paymentPlansStore";
import { formatCurrency } from "../../store/paymentPlansStore";
import DatePicker from "../common/DatePicker";

interface InstallmentRowProps {
  installment: Installment;
  onUpdate: (updates: Partial<Installment>) => void;
  onRemove: () => void;
  currency?: string;
}

const InstallmentRow = ({ installment, onUpdate, onRemove }: InstallmentRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: installment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className={`
        group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
        ${isDragging ? "bg-emerald-50 border-emerald-200 shadow-lg scale-[1.02] z-50" : "bg-white border-gray-100 hover:border-emerald-200 hover:shadow-sm"}
        ${installment.isPaid ? "bg-emerald-50/50" : ""}
      `}
    >
      {/* Drag Handle */}
      <button {...attributes} {...listeners} className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors" aria-label="Drag to reorder">
        <GripVertical size={18} />
      </button>

      {/* Number Badge */}
      <div
        className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
        ${installment.isPaid ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"}
      `}
      >
        {installment.number}
      </div>

      {/* Amount Input */}
      <div className="flex-1 min-w-[140px]">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP</span>
          <input type="number" value={installment.amount} onChange={(e) => onUpdate({ amount: Number(e.target.value) })} className="w-full pl-12 pr-3 py-2 text-right font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" placeholder="0" />
        </div>
      </div>

      {/* Due Date */}
      <div className="flex-1 min-w-[150px]">
        <div className="relative">
          <DatePicker value={installment.dueDate} onChange={(date) => onUpdate({ dueDate: date })} className="w-full" placeholder="Select date" />
        </div>
      </div>

      {/* Description */}
      <div className="flex-[2] min-w-[180px]">
        <input type="text" value={installment.description} onChange={(e) => onUpdate({ description: e.target.value })} className="w-full px-3 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" placeholder="Description..." />
      </div>

      {/* Status Badge */}
      {installment.isPaid && <span className="flex-shrink-0 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">Paid</span>}

      {/* Delete Button */}
      <button onClick={onRemove} className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" aria-label="Remove installment">
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

// Compact display for template preview
export const InstallmentRowCompact = ({ installment }: { installment: Installment }) => (
  <tr className={`border-b border-gray-100 ${installment.isPaid ? "bg-emerald-50/30" : ""}`}>
    <td className="py-3 px-4 text-center text-gray-500 font-medium">{installment.number}</td>
    <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(installment.amount)}</td>
    <td className="py-3 px-4 text-gray-600">{new Date(installment.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
    <td className="py-3 px-4 text-gray-600">{installment.description}</td>
    <td className="py-3 px-4 text-center">{installment.isPaid ? <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">Paid</span> : <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">Pending</span>}</td>
  </tr>
);

export default InstallmentRow;
