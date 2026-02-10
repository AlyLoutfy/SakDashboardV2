import { useState, useMemo, useEffect } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Calculator, Sparkles, Calendar, Trash2, GripVertical, Percent, DollarSign, Tag, Play, PlusCircle } from "lucide-react";
import type { PaymentStage, PaymentType } from "../../store/paymentPlansStore";
import { formatCurrency } from "../../store/paymentPlansStore";

interface SmartCalculatorProps {
  basePrice: number;
  discount: { type: "percentage" | "fixed"; value: number };
  onDiscountChange: (type: "percentage" | "fixed", value: number) => void;
  onGenerate: (stages: PaymentStage[]) => void;
}

const DiscountInput = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
  const [localValue, setLocalValue] = useState(value === 0 ? "" : value.toString());

  useEffect(() => {
    const parsedLocal = localValue === "" ? 0 : Number(localValue);
    if (value !== parsedLocal) {
      setLocalValue(value === 0 ? "" : value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange(val === "" ? 0 : Number(val));
  };

  return <input type="number" value={localValue} onChange={handleChange} placeholder="0" className="w-full bg-transparent font-bold text-amber-900 focus:outline-none placeholder-amber-900/30" />;
};

const STAGE_TYPES: { type: PaymentType; label: string; icon: any; defaultName: string; color: string }[] = [
  { type: "down_payment", label: "Down Payment", icon: Sparkles, defaultName: "Down Payment", color: "bg-emerald-500" },
  { type: "installment", label: "Installments", icon: Calendar, defaultName: "Quarterly Installments", color: "bg-blue-500" },
  { type: "maintenance", label: "Maintenance", icon: Calculator, defaultName: "Maintenance Fee", color: "bg-orange-500" },
  { type: "balloon", label: "Custom Installment", icon: Tag, defaultName: "Custom Payment", color: "bg-purple-500" },
];

const GAP_PATTERNS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
];

export default function SmartCalculator({ basePrice, discount, onDiscountChange, onGenerate }: SmartCalculatorProps) {
  const [stages, setStages] = useState<PaymentStage[]>([]);

  // Derived calculations
  const discountAmount = discount.type === "percentage" ? (basePrice * discount.value) / 100 : discount.value;
  const priceAfterDiscount = basePrice - discountAmount;

  const allocatedAmount = useMemo(() => {
    return stages
      .filter((s) => s.type !== "installment")
      .reduce((sum, stage) => {
        return sum + (stage.mode === "percentage" ? (priceAfterDiscount * stage.value) / 100 : stage.value);
      }, 0);
  }, [stages, priceAfterDiscount]);

  const remainingToDistribute = Math.max(0, priceAfterDiscount - allocatedAmount);

  const addStage = (type: PaymentType) => {
    const template = STAGE_TYPES.find((t) => t.type === type)!;
    const newStage: PaymentStage = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: template.defaultName,
      mode: "percentage",
      value: type === "installment" ? 0 : 5, // Default 5% for payments
      count: type === "installment" ? 12 : undefined,
      gapPattern: "quarterly",
      date: new Date(),
      startDate: new Date(),
    };
    setStages([...stages, newStage]);
  };

  const updateStage = (id: string, updates: Partial<PaymentStage>) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Calculator size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Plan Builder</h3>
          <p className="text-xs text-gray-500">Construct your payment schedule</p>
        </div>
      </div>

      {/* Global Settings (Price & Discount) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</label>
          <div className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(basePrice)}</div>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
          <label className="text-xs font-medium text-amber-600 uppercase tracking-wider flex items-center justify-between">
            Discount
            <div className="flex bg-white rounded-md border border-amber-200 overflow-hidden">
              <button onClick={() => onDiscountChange("percentage", discount.value)} className={`px-1.5 py-0.5 ${discount.type === "percentage" ? "bg-amber-500 text-white" : "text-amber-500"}`}>
                <Percent size={10} />
              </button>
              <div className="w-px bg-amber-200"></div>
              <button onClick={() => onDiscountChange("fixed", discount.value)} className={`px-1.5 py-0.5 ${discount.type === "fixed" ? "bg-amber-500 text-white" : "text-amber-500"}`}>
                <DollarSign size={10} />
              </button>
            </div>
          </label>
          <div className="flex items-center gap-2 mt-1">
            <DiscountInput value={discount.value} onChange={(val) => onDiscountChange(discount.type, val)} />
          </div>
          <div className="text-xs text-amber-600 mt-1">Final: {formatCurrency(priceAfterDiscount)}</div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Add Components</h4>
        </div>

        {/* Action Buttons - Moved to Top */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {STAGE_TYPES.map((type) => (
            <button key={type.type} onClick={() => addStage(type.type)} className="flex items-center justify-start gap-3 py-2.5 px-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 hover:bg-white hover:border-emerald-200 hover:shadow-sm hover:text-emerald-700 transition-all group">
              <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <type.icon size={14} />
              </div>
              <span className="text-xs font-semibold">{type.label}</span>
              <PlusCircle size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-emerald-500" />
            </button>
          ))}
        </div>

        {/* Stages List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timeline Sequence</h4>
            <span className="text-xs text-gray-500">
              Rem: <span className="font-medium text-emerald-600">{formatCurrency(remainingToDistribute)}</span>
            </span>
          </div>

          <Reorder.Group axis="y" values={stages} onReorder={setStages} className="space-y-3 min-h-[100px]">
            {stages.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <p className="text-sm text-gray-400">Select components above to build your plan</p>
              </div>
            )}

            <AnimatePresence>
              {stages.map((stage) => {
                const template = STAGE_TYPES.find((t) => t.type === stage.type);

                return (
                  <Reorder.Item key={stage.id} value={stage} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative group hover:border-emerald-200 transition-colors">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-2">
                      <GripVertical size={16} />
                    </div>

                    <div className="pl-8">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs ${template?.color || "bg-gray-500"}`}>{stage.type === "installment" ? <Calendar size={12} /> : <DollarSign size={12} />}</div>
                          <input type="text" value={stage.name} onChange={(e) => updateStage(stage.id, { name: e.target.value })} className="font-medium text-gray-900 border-b border-transparent hover:border-gray-200 focus:border-emerald-500 focus:outline-none text-sm w-full bg-transparent" />
                        </div>
                        <button onClick={() => removeStage(stage.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {stage.type === "installment" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase text-gray-400 font-semibold">Count</label>
                            <input type="number" value={stage.count} onChange={(e) => updateStage(stage.id, { count: Number(e.target.value) })} className="w-full text-sm font-medium border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase text-gray-400 font-semibold">Pattern</label>
                            <select value={stage.gapPattern} onChange={(e) => updateStage(stage.id, { gapPattern: e.target.value as any })} className="w-full text-sm font-medium border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none bg-white">
                              {GAP_PATTERNS.map((p) => (
                                <option key={p.value} value={p.value}>
                                  {p.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] uppercase text-gray-400 font-semibold">Start Date</label>
                            <input type="date" value={stage.startDate ? new Date(stage.startDate).toISOString().split("T")[0] : ""} onChange={(e) => updateStage(stage.id, { startDate: new Date(e.target.value) })} className="w-full text-sm font-medium border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase text-gray-400 font-semibold">Amount</label>
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                              <input type="number" value={stage.value} onChange={(e) => updateStage(stage.id, { value: Number(e.target.value) })} className="w-full text-sm font-medium px-2 py-1.5 outline-none" />
                              <button onClick={() => updateStage(stage.id, { mode: stage.mode === "percentage" ? "fixed" : "percentage" })} className="bg-gray-50 px-2 text-xs font-medium text-gray-500 hover:bg-gray-100 border-l border-gray-200">
                                {stage.mode === "percentage" ? "%" : "EGP"}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase text-gray-400 font-semibold">Date</label>
                            <input type="date" value={stage.date ? new Date(stage.date).toISOString().split("T")[0] : ""} onChange={(e) => updateStage(stage.id, { date: new Date(e.target.value) })} className="w-full text-sm font-medium border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500" />
                          </div>
                          {/* Helper text showing calculated amount if % */}
                          {stage.mode === "percentage" && <div className="col-span-2 text-xs text-gray-400 text-right">= {formatCurrency((priceAfterDiscount * stage.value) / 100)}</div>}
                        </div>
                      )}
                    </div>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100">
        <button onClick={() => onGenerate(stages)} className="w-full flex items-center justify-center py-3 rounded-xl bg-gray-900 text-white font-medium shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={stages.length === 0}>
          <Play size={16} className="mr-2" />
          Generate Plan
        </button>
      </div>
    </motion.div>
  );
}
