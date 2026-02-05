import { useState } from "react";
import { motion } from "framer-motion";
import { Percent, DollarSign, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../store/paymentPlansStore";

interface DownPaymentInputProps {
  totalPrice: number;
  type: "percentage" | "fixed";
  value: number;
  onChange: (type: "percentage" | "fixed", value: number) => void;
}

const DownPaymentInput = ({ totalPrice, type, value, onChange }: DownPaymentInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const calculatedAmount = type === "percentage" ? (totalPrice * value) / 100 : value;

  const calculatedPercent = type === "fixed" && totalPrice > 0 ? (value / totalPrice) * 100 : value;

  const handleValueChange = (newValue: string) => {
    setInputValue(newValue);
    const numValue = parseFloat(newValue) || 0;

    if (type === "percentage") {
      onChange(type, Math.min(100, Math.max(0, numValue)));
    } else {
      onChange(type, Math.max(0, numValue));
    }
  };

  const handleTypeChange = (newType: "percentage" | "fixed") => {
    if (newType === type) return;

    if (newType === "percentage" && type === "fixed") {
      // Convert fixed to percentage
      const percent = totalPrice > 0 ? (value / totalPrice) * 100 : 0;
      setInputValue(percent.toFixed(1));
      onChange("percentage", parseFloat(percent.toFixed(1)));
    } else {
      // Convert percentage to fixed
      const fixed = (totalPrice * value) / 100;
      setInputValue(fixed.toString());
      onChange("fixed", fixed);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Down Payment</label>

      <div className="flex gap-3">
        {/* Type Toggle */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
          <button
            onClick={() => handleTypeChange("percentage")}
            className={`
              flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all
              ${type === "percentage" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}
            `}
          >
            <Percent size={16} />
            Percent
          </button>
          <button
            onClick={() => handleTypeChange("fixed")}
            className={`
              flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all
              ${type === "fixed" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}
            `}
          >
            <DollarSign size={16} />
            Fixed
          </button>
        </div>

        {/* Value Input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{type === "percentage" ? "%" : "EGP"}</span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className={`
              w-full h-full px-3 py-2.5 font-medium text-gray-900 bg-white border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
              ${type === "percentage" ? "pl-8 text-right pr-3" : "pl-12 text-right pr-3"}
            `}
            placeholder="0"
            min={0}
            max={type === "percentage" ? 100 : undefined}
          />
        </div>
      </div>

      {/* Conversion Display */}
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} key={`${type}-${value}`} className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(calculatedAmount)}</p>
        </div>

        <ArrowRight size={18} className="text-emerald-400" />

        <div className="flex-1 text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{type === "percentage" ? "Percentage" : "Of Total"}</p>
          <p className="text-lg font-bold text-emerald-600">{calculatedPercent.toFixed(1)}%</p>
        </div>
      </motion.div>

      {/* Remaining Balance */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Remaining Balance:</span>
        <span className="font-semibold text-gray-900">{formatCurrency(totalPrice - calculatedAmount)}</span>
      </div>
    </div>
  );
};

export default DownPaymentInput;
