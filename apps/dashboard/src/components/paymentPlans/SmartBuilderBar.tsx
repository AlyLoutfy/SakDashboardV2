import { useState, useEffect } from "react";
import { Plus, Minus, RefreshCw, Percent, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, usePaymentPlansStore, type PaymentType } from "../../store/paymentPlansStore";
import DatePicker from "../common/DatePicker";

const GAP_PATTERNS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
];

const NumberInput = ({ value, onChange, className, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (!isFocused) setLocalValue(value);
  }, [value, isFocused]);

  return (
    <input
      {...props}
      type="text" // Use text to allow commas
      value={isFocused ? localValue : value.toLocaleString()}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, "");
        if (raw === "" || !isNaN(Number(raw))) {
          setLocalValue(raw);
          if (raw !== "") onChange(Number(raw));
        }
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={className}
    />
  );
};

export default function SmartBuilderBar() {
  const { currentPlan, appendSequence, updateCurrentPlan } = usePaymentPlansStore();

  const [type, setType] = useState<PaymentType>("installment");
  const [count, setCount] = useState<number | "">(12); // Allow empty string
  const [amountMode, setAmountMode] = useState<"percentage" | "fixed">("percentage");
  const [amountValue, setAmountValue] = useState<number>(0);

  // Date & Pattern
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [gapPattern, setGapPattern] = useState<string>("quarterly");

  // Reset defaults when type changes
  useEffect(() => {
    if (type === "installment") {
      setCount(12);
      setGapPattern("quarterly");
      setAmountMode("percentage");
    } else if (type === "down_payment") {
      setCount(1);
      setAmountMode("percentage");
      setAmountValue(10); // Standard 10%
    } else {
      setCount(1);
      setAmountMode("fixed");
    }
  }, [type]);

  if (!currentPlan) return null;

  const { basePrice, discount } = currentPlan;
  const discountAmount = discount.type === "percentage" ? (basePrice * discount.value) / 100 : discount.value;
  const priceAfterDiscount = basePrice - discountAmount;

  // Calculate actual amount value for display/logic
  const calculatedAmount = amountMode === "percentage" ? Math.round((priceAfterDiscount * amountValue) / 100) : amountValue;

  const handleAdd = () => {
    if (calculatedAmount <= 0) return;

    const finalCount = count === "" || count <= 0 ? 1 : count;

    appendSequence({
      type,
      count: finalCount,
      amount: calculatedAmount,
      startDate: startDate,
      gapPattern: type === "installment" ? gapPattern : "monthly", // Gap irrelevant for single items
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 relative">
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
      <div className="flex items-end gap-3 mb-2">
        {/* Type Selector */}
        <div className="w-48">
          <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1.5 block">Type</label>
          <div className="relative">
            <select value={type} onChange={(e) => setType(e.target.value as PaymentType)} className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 appearance-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all">
              <option value="down_payment">Down Payment</option>
              <option value="installment">Installments</option>
              <option value="maintenance">Maintenance</option>
              <option value="balloon">Custom / Balloon</option>
            </select>
            <Layers size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1.5 block">Amount / Value</label>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white hover:border-gray-300 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input type="number" value={amountValue === 0 ? "" : amountValue} onChange={(e) => setAmountValue(Number(e.target.value))} placeholder="0" className="flex-1 text-sm font-semibold px-3 py-2.5 outline-none min-w-0" />
            <button onClick={() => setAmountMode(amountMode === "percentage" ? "fixed" : "percentage")} className="px-3 bg-gray-50 border-l border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1 min-w-[40px] justify-center">
              {amountMode === "percentage" ? <Percent size={12} /> : "EGP"}
            </button>
          </div>
          {/* Helper text for calculated amount */}
          {amountMode === "percentage" && amountValue > 0 && <div className="absolute mt-0.5 text-[10px] text-emerald-600 font-medium ml-1">= {formatCurrency(calculatedAmount)}</div>}
        </div>

        {/* Count Only for Installments */}
        {type === "installment" && (
          <div className="w-32">
            <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1.5 block">Count</label>
            <div className="flex items-center border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all overflow-hidden h-[42px]">
              <button onClick={() => setCount((prev) => (prev === "" || prev <= 1 ? 1 : prev - 1))} className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-r border-gray-100 transition-colors active:bg-gray-100">
                <Minus size={14} />
              </button>

              <div className="flex-1 relative h-full">
                <input
                  type="number"
                  value={count}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") setCount("");
                    else setCount(Math.max(0, parseInt(val)));
                  }}
                  className="w-full h-full text-center text-sm font-semibold text-gray-800 outline-none bg-transparent pl-3"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none text-xs font-bold">#</div>
              </div>

              <button onClick={() => setCount((prev) => (prev === "" ? 1 : prev + 1))} className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-l border-gray-100 transition-colors active:bg-gray-100">
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Frequency Only for Installments */}
        {type === "installment" && (
          <div className="w-40">
            <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1.5 block">Frequency</label>
            <div className="relative">
              <select value={gapPattern} onChange={(e) => setGapPattern(e.target.value)} className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 appearance-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all">
                {GAP_PATTERNS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <RefreshCw size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Start Date */}
        <div className="w-40">
          <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1.5 block">Start Date</label>
          <div className="relative">
            <DatePicker value={startDate} onChange={setStartDate} />
          </div>
        </div>

        {/* Add Button */}
        <div className="pb-[1px]">
          <Button onClick={handleAdd} className="h-[42px] bg-gray-900 text-white font-semibold rounded-xl px-6 shadow-lg shadow-gray-200 hover:bg-gray-800 hover:scale-[1.02] transition-all active:scale-95">
            <Plus size={18} className="mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Settings Row: Base Price & Discount */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-6">
        {/* Left Aligned Global Settings */}
        <div className="flex items-center gap-6">
          {/* Base Price */}
          <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
            <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider pl-1">Base Price</label>
            <div className="h-4 w-px bg-gray-200"></div>
            <NumberInput value={basePrice} onChange={(val: number) => updateCurrentPlan({ basePrice: val })} className="bg-transparent text-sm font-bold text-gray-900 w-32 focus:outline-none text-right placeholder-gray-300" placeholder="0" />
            <span className="text-xs font-medium text-gray-400">EGP</span>
          </div>

          {/* Discount Control */}
          <div className="flex items-center gap-3 bg-amber-50/50 p-2 rounded-xl border border-dashed border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-all group-focus-within:ring-2">
            <label className="text-[10px] uppercase text-amber-500 font-bold tracking-wider pl-1">Discount</label>
            <div className="h-4 w-px bg-amber-200"></div>
            <div className="flex items-center gap-2">
              <input type="number" value={discount.value} onChange={(e) => updateCurrentPlan({ discount: { ...discount, value: Number(e.target.value) } })} className="bg-transparent text-sm font-bold text-amber-700 w-20 focus:outline-none text-right" />
              <button onClick={() => updateCurrentPlan({ discount: { ...discount, type: discount.type === "percentage" ? "fixed" : "percentage" } })} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors uppercase">
                {discount.type === "percentage" ? "%" : "EGP"}
              </button>
            </div>
          </div>
        </div>

        {/* Result: Net Price */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-medium">Net Price</p>
            <p className="text-lg font-black text-gray-900">{formatCurrency(priceAfterDiscount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
