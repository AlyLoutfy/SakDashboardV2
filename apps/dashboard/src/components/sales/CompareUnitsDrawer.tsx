import { useMemo, useState, useRef, useEffect } from "react";
import { X, Trophy, ChevronLeft, ChevronRight, Bed, Bath, Car, Maximize2, Layers, Eye, Home, DollarSign, Tag, Building2, Sparkles, FileText, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Unit } from "../../store/compoundsStore";
import { useSalesStore } from "../../store/salesStore";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface CompareUnitsDrawerProps {
  units: Unit[];
  onClose: () => void;
  onRemoveUnit: (unitId: string) => void;
}

interface ComparisonRow {
  label: string;
  icon: React.ReactNode;
  getValue: (u: Unit) => string | number;
  getBestIndex?: (units: Unit[]) => number | null; // index of "best" value
  type?: "highlight" | "badge" | "features";
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Available: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Reserved: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Sold: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  Blocked: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300" },
};

const CompareUnitsDrawer = ({ units, onClose, onRemoveUnit }: CompareUnitsDrawerProps) => {
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { paymentPlans } = useSalesStore();
  const [selectedPlanPerUnit, setSelectedPlanPerUnit] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    units.forEach((u) => {
      if (paymentPlans.length > 0) initial[u.id] = paymentPlans[0].id;
    });
    return initial;
  });
  const [openPlanDropdown, setOpenPlanDropdown] = useState<string | null>(null);

  const handleOpenInNewTab = (unit: Unit) => {
    window.open(`/sales/compounds/${unit.compoundId}?unit=${unit.id}`, "_blank");
  };

  const handleGenerateOffer = (unit: Unit) => {
    alert(`Generate offer for ${unit.id}`);
  };

  const handleViewPaymentPlan = (unit: Unit) => {
    const planId = selectedPlanPerUnit[unit.id];
    const plan = paymentPlans.find((p) => p.id === planId);
    if (plan) alert(`Viewing payment plan "${plan.name}" for ${unit.id}`);
  };

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Auto-close if all units removed
  useEffect(() => {
    if (units.length < 2) {
      onClose();
    }
  }, [units.length, onClose]);

  // Find the "winner" unit (simple scoring: lowest price per meter, most features)
  const winnerIndex = useMemo(() => {
    if (units.length < 2) return null;
    // Simple scoring: lower price/m² is better, more BUA is better, more bedrooms is better
    let bestScore = -Infinity;
    let bestIdx = 0;
    units.forEach((u, i) => {
      const score = u.bua * 0.3 + u.bedrooms * 10 + u.bathrooms * 5 + u.features.length * 3 - u.pricePerMeter * 0.0001;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    });
    return bestIdx;
  }, [units]);

  const rows: ComparisonRow[] = [
    {
      label: "Type",
      icon: <Home size={14} />,
      getValue: (u) => u.type,
    },
    {
      label: "Status",
      icon: <Tag size={14} />,
      getValue: (u) => u.status,
      type: "badge",
    },
    {
      label: "Price",
      icon: <DollarSign size={14} />,
      getValue: (u) => formatCurrency(u.price),
      getBestIndex: (units) => {
        const available = units.filter((u) => u.status === "Available");
        if (available.length === 0) return null;
        const minPrice = Math.min(...available.map((u) => u.price));
        const idx = units.findIndex((u) => u.price === minPrice && u.status === "Available");
        return idx >= 0 ? idx : null;
      },
    },
    {
      label: "Price / m²",
      icon: <DollarSign size={14} />,
      getValue: (u) => formatCurrency(u.pricePerMeter),
      getBestIndex: (units) => {
        const min = Math.min(...units.map((u) => u.pricePerMeter));
        return units.findIndex((u) => u.pricePerMeter === min);
      },
    },
    {
      label: "BUA",
      icon: <Maximize2 size={14} />,
      getValue: (u) => `${u.bua.toLocaleString()} m²`,
      getBestIndex: (units) => {
        const max = Math.max(...units.map((u) => u.bua));
        return units.findIndex((u) => u.bua === max);
      },
    },
    {
      label: "Bedrooms",
      icon: <Bed size={14} />,
      getValue: (u) => (u.bedrooms === 0 ? "Studio" : u.bedrooms.toString()),
      getBestIndex: (units) => {
        const max = Math.max(...units.map((u) => u.bedrooms));
        if (max === 0) return null;
        return units.findIndex((u) => u.bedrooms === max);
      },
    },
    {
      label: "Bathrooms",
      icon: <Bath size={14} />,
      getValue: (u) => u.bathrooms.toString(),
      getBestIndex: (units) => {
        const max = Math.max(...units.map((u) => u.bathrooms));
        return units.findIndex((u) => u.bathrooms === max);
      },
    },
    {
      label: "Parking",
      icon: <Car size={14} />,
      getValue: (u) => (u.parking === 0 ? "—" : u.parking.toString()),
      getBestIndex: (units) => {
        const max = Math.max(...units.map((u) => u.parking));
        if (max === 0) return null;
        return units.findIndex((u) => u.parking === max);
      },
    },
    {
      label: "Floor",
      icon: <Layers size={14} />,
      getValue: (u) => u.floor,
    },
    {
      label: "View",
      icon: <Eye size={14} />,
      getValue: (u) => u.view,
    },
    {
      label: "Features",
      icon: <Sparkles size={14} />,
      getValue: (u) => u.features.join(", "),
      type: "features",
      getBestIndex: (units) => {
        const max = Math.max(...units.map((u) => u.features.length));
        return units.findIndex((u) => u.features.length === max);
      },
    },
  ];

  // Mobile: snap scroll to index
  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[index] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
    setMobileActiveIndex(index);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />

      {/* Drawer */}
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full sm:max-w-3xl lg:max-w-4xl bg-white shadow-2xl z-[61] flex flex-col rounded-l-2xl overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Layers className="text-white" size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Compare Units</h2>
                <p className="text-[11px] text-gray-500">{units.length} Units</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* ─── DESKTOP: Side by Side Table ─── */}
        <div className="flex-1 overflow-auto hidden sm:block">
          <table className="w-full">
            {/* Unit Header Row */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-white border-b border-gray-200">
                {/* Label column */}
                <th className="w-36 lg:w-44 py-3 px-4 text-left bg-gray-50 border-r border-gray-100 sticky left-0 z-20">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Property</span>
                </th>
                {/* Unit columns */}
                {units.map((unit, i) => (
                  <th key={unit.id} className={`py-3 px-4 text-center border-r border-gray-100 last:border-r-0 relative ${winnerIndex === i ? "bg-purple-50/50" : "bg-white"}`}>
                    {/* Winner badge */}
                    {winnerIndex === i && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <Trophy size={9} />
                        Best Value
                      </motion.div>
                    )}

                    {/* Remove button */}
                    {units.length > 2 && (
                      <button onClick={() => onRemoveUnit(unit.id)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors group" title="Remove from comparison">
                        <X size={12} className="text-gray-300 group-hover:text-gray-500" />
                      </button>
                    )}

                    <div className={`${winnerIndex === i ? "mt-5" : "mt-1"}`}>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
                        <Building2 size={16} className="text-white" />
                      </div>
                      <p className="text-xs font-bold text-gray-900 mb-0.5">{unit.id}</p>
                      <p className="text-[10px] text-gray-500 mb-1.5">{unit.title}</p>
                      <button onClick={() => handleOpenInNewTab(unit)} className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        <ExternalLink size={9} />
                        Open in new tab
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIdx) => {
                const bestIdx = row.getBestIndex ? row.getBestIndex(units) : null;
                const allSame = units.every((u) => row.getValue(u) === row.getValue(units[0]));

                return (
                  <tr key={row.label} className={`border-b border-gray-100 ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    {/* Row Label */}
                    <td className={`py-3 px-4 border-r border-gray-100 sticky left-0 z-10 ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 flex-shrink-0">{row.icon}</span>
                        <span className="text-xs font-semibold text-gray-600">{row.label}</span>
                      </div>
                    </td>

                    {/* Value cells */}
                    {units.map((unit, colIdx) => {
                      const value = row.getValue(unit);
                      const isBest = bestIdx === colIdx && !allSame;
                      const isWinnerCol = winnerIndex === colIdx;

                      return (
                        <td key={unit.id} className={`py-3 px-4 text-center border-r border-gray-100 last:border-r-0 transition-colors ${isWinnerCol ? "bg-purple-50/30" : ""}`}>
                          {row.type === "badge" ? (
                            <StatusBadge status={String(value)} />
                          ) : row.type === "features" ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {unit.features.map((f) => (
                                <span key={f} className={`text-[10px] px-2 py-0.5 rounded-full border ${isBest ? "bg-purple-50 text-purple-700 border-purple-200 font-bold" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className={`text-xs ${isBest ? "font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md" : "text-gray-700"}`}>{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Actions row */}
              <tr>
                <td className="py-3 px-4 border-r border-gray-100 sticky left-0 z-10 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 flex-shrink-0">
                      <Sparkles size={14} />
                    </span>
                    <span className="text-xs font-semibold text-gray-600">Actions</span>
                  </div>
                </td>
                {units.map((unit) => (
                  <td key={unit.id} className={`py-3 px-4 border-r border-gray-100 last:border-r-0 ${winnerIndex === units.indexOf(unit) ? "bg-purple-50/30" : ""}`}>
                    <div className="flex flex-col items-center gap-2">
                      {/* View Payment Plan */}
                      <div className="w-full relative">
                        <div className="flex gap-1">
                          {/* Plan selector dropdown */}
                          <div className="relative flex-1">
                            <button onClick={() => setOpenPlanDropdown(openPlanDropdown === unit.id ? null : unit.id)} className="w-full inline-flex items-center justify-between gap-1 px-2 py-1.5 text-[10px] font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors">
                              <span className="truncate">{paymentPlans.find((p) => p.id === selectedPlanPerUnit[unit.id])?.name || "Select plan"}</span>
                              <ChevronDown size={10} className={`flex-shrink-0 transition-transform ${openPlanDropdown === unit.id ? "rotate-180" : ""}`} />
                            </button>
                            {openPlanDropdown === unit.id && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 max-h-36 overflow-y-auto">
                                {paymentPlans.map((plan) => (
                                  <button
                                    key={plan.id}
                                    onClick={() => {
                                      setSelectedPlanPerUnit((prev) => ({ ...prev, [unit.id]: plan.id }));
                                      setOpenPlanDropdown(null);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-[10px] hover:bg-gray-50 transition-colors ${selectedPlanPerUnit[unit.id] === plan.id ? "font-bold text-blue-600 bg-blue-50" : "text-gray-700"}`}
                                  >
                                    {plan.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* View button */}
                          <button onClick={() => handleViewPaymentPlan(unit)} className="px-2.5 py-1.5 text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex-shrink-0">
                            View Plan
                          </button>
                        </div>
                      </div>

                      {/* Generate Offer */}
                      <button onClick={() => handleGenerateOffer(unit)} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm">
                        <FileText size={12} />
                        Generate Offer
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── MOBILE: Swipeable Cards ─── */}
        <div className="flex-1 flex flex-col sm:hidden overflow-hidden">
          {/* Card navigation */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <button onClick={() => scrollToCard(Math.max(0, mobileActiveIndex - 1))} disabled={mobileActiveIndex === 0} className={`p-1.5 rounded-lg transition-colors ${mobileActiveIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100"}`}>
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {units.map((unit, i) => (
                <button key={unit.id} onClick={() => scrollToCard(i)} className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-bold transition-colors ${mobileActiveIndex === i ? "text-gray-900" : "text-gray-400"}`}>{unit.id}</span>
                  <div className={`h-1 rounded-full transition-all ${mobileActiveIndex === i ? "w-6 bg-purple-500" : "w-2 bg-gray-300"}`} />
                </button>
              ))}
            </div>

            <button onClick={() => scrollToCard(Math.min(units.length - 1, mobileActiveIndex + 1))} disabled={mobileActiveIndex === units.length - 1} className={`p-1.5 rounded-lg transition-colors ${mobileActiveIndex === units.length - 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100"}`}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Scrollable card area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto snap-x snap-mandatory flex"
            onScroll={() => {
              if (scrollRef.current) {
                const scrollLeft = scrollRef.current.scrollLeft;
                const cardWidth = scrollRef.current.offsetWidth;
                const newIndex = Math.round(scrollLeft / cardWidth);
                if (newIndex !== mobileActiveIndex && newIndex >= 0 && newIndex < units.length) {
                  setMobileActiveIndex(newIndex);
                }
              }
            }}
          >
            {units.map((unit, i) => (
              <div key={unit.id} className="w-full flex-shrink-0 snap-center overflow-y-auto">
                <div className="p-4 space-y-3">
                  {/* Unit Card Header */}
                  <div className="relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white overflow-hidden">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <Building2 size={18} className="text-white" />
                        </div>
                        {winnerIndex === i && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <Trophy size={9} />
                            Best Value
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleOpenInNewTab(unit)} className="flex items-center gap-1 text-[10px] font-bold text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg">
                        <ExternalLink size={10} />
                        Open
                      </button>
                    </div>
                    <h3 className="text-base font-bold mb-0.5">{unit.id}</h3>
                    <p className="text-xs text-white/60">{unit.title}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-lg font-bold">{formatCurrency(unit.price)}</span>
                    </div>
                    <p className="text-[10px] text-white/50 mt-0.5">{formatCurrency(unit.pricePerMeter)} / m²</p>
                    {/* Decorative circles */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                    <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/5" />
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <QuickStat icon={<Maximize2 size={14} />} label="BUA" value={`${unit.bua} m²`} highlight={rows.find((r) => r.label === "BUA")?.getBestIndex?.(units) === i} />
                    <QuickStat icon={<Bed size={14} />} label="Beds" value={unit.bedrooms === 0 ? "Studio" : String(unit.bedrooms)} highlight={rows.find((r) => r.label === "Bedrooms")?.getBestIndex?.(units) === i} />
                    <QuickStat icon={<Bath size={14} />} label="Baths" value={String(unit.bathrooms)} highlight={rows.find((r) => r.label === "Bathrooms")?.getBestIndex?.(units) === i} />
                  </div>

                  {/* Details List */}
                  <div className="rounded-xl border border-gray-200 divide-y divide-gray-100">
                    <DetailRow icon={<Home size={13} />} label="Type" value={unit.type} />
                    <DetailRow icon={<Layers size={13} />} label="Floor" value={unit.floor} />
                    <DetailRow icon={<Eye size={13} />} label="View" value={unit.view} />
                    <DetailRow icon={<Car size={13} />} label="Parking" value={unit.parking === 0 ? "None" : `${unit.parking} spot${unit.parking > 1 ? "s" : ""}`} />
                    <DetailRow icon={<Tag size={13} />} label="Status" value={<StatusBadge status={unit.status} />} />
                  </div>

                  {/* Features */}
                  {unit.features.length > 0 && (
                    <div className="rounded-xl border border-gray-200 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles size={13} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Features</span>
                        <span className="ml-auto text-[10px] font-bold text-purple-600">{unit.features.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {unit.features.map((f) => (
                          <span key={f} className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* View Payment Plan */}
                    <div className="rounded-xl border border-gray-200 p-3 space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Plan</p>
                      {/* Plan selector */}
                      <div className="relative">
                        <button onClick={() => setOpenPlanDropdown(openPlanDropdown === `m-${unit.id}` ? null : `m-${unit.id}`)} className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors">
                          <span className="truncate">{paymentPlans.find((p) => p.id === selectedPlanPerUnit[unit.id])?.name || "Select plan"}</span>
                          <ChevronDown size={12} className={`flex-shrink-0 transition-transform ${openPlanDropdown === `m-${unit.id}` ? "rotate-180" : ""}`} />
                        </button>
                        {openPlanDropdown === `m-${unit.id}` && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 max-h-36 overflow-y-auto">
                            {paymentPlans.map((plan) => (
                              <button
                                key={plan.id}
                                onClick={() => {
                                  setSelectedPlanPerUnit((prev) => ({ ...prev, [unit.id]: plan.id }));
                                  setOpenPlanDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${selectedPlanPerUnit[unit.id] === plan.id ? "font-bold text-blue-600 bg-blue-50" : "text-gray-700"}`}
                              >
                                {plan.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleViewPaymentPlan(unit)} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors">
                        View Payment Plan
                      </button>
                    </div>

                    {/* Generate Offer */}
                    <button onClick={() => handleGenerateOffer(unit)} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-sm">
                      <FileText size={14} />
                      Generate Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile comparison highlight bar */}
          {units.length > 1 && mobileActiveIndex < units.length && (
            <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3 bg-gray-50/50">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">Vs. Other Unit{units.length > 2 ? "s" : ""}</p>
              <div className="flex gap-4">
                {units
                  .filter((_, i) => i !== mobileActiveIndex)
                  .map((otherUnit) => {
                    const current = units[mobileActiveIndex];
                    const priceDiff = current.price - otherUnit.price;
                    const buaDiff = current.bua - otherUnit.bua;
                    const bedDiff = current.bedrooms - otherUnit.bedrooms;
                    const ppmDiff = current.pricePerMeter - otherUnit.pricePerMeter;

                    const formatDiff = (diff: number, formatter: (v: number) => string, positiveIsGood: boolean) => {
                      if (diff === 0) return { text: "Same", color: "text-gray-400" };
                      const sign = diff > 0 ? "+" : "−";
                      const good = positiveIsGood ? diff > 0 : diff < 0;
                      return {
                        text: `${sign}${formatter(Math.abs(diff))}`,
                        color: good ? "text-emerald-600" : "text-red-500",
                      };
                    };

                    const priceInfo = formatDiff(priceDiff, (v) => formatCurrency(v), false);
                    const buaInfo = formatDiff(buaDiff, (v) => `${v.toLocaleString()} m²`, true);
                    const bedInfo = formatDiff(bedDiff, (v) => `${v} bed${v !== 1 ? "s" : ""}`, true);
                    const ppmInfo = formatDiff(ppmDiff, (v) => formatCurrency(v), false);

                    return (
                      <div key={otherUnit.id} className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-800 mb-1.5">{otherUnit.id}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-medium">Price</span>
                            <span className={`text-[10px] font-bold ${priceInfo.color}`}>{priceInfo.text}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-medium">BUA</span>
                            <span className={`text-[10px] font-bold ${buaInfo.color}`}>{buaInfo.text}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-medium">Beds</span>
                            <span className={`text-[10px] font-bold ${bedInfo.color}`}>{bedInfo.text}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-medium">Price/m²</span>
                            <span className={`text-[10px] font-bold ${ppmInfo.color}`}>{ppmInfo.text}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400">
              💡 <span className="text-purple-600 font-bold">Purple highlights</span> indicate the best value per property
            </p>
            <button onClick={onClose} className="px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─── Sub-components ──────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const style = statusColors[status] || statusColors.Available;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${style.bg} ${style.text} ${style.border}`}>{status}</span>;
};

const QuickStat = ({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) => (
  <div className={`rounded-xl border p-3 text-center ${highlight ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}>
    <div className={`flex items-center justify-center mb-1 ${highlight ? "text-purple-500" : "text-gray-400"}`}>{icon}</div>
    <p className={`text-sm font-bold ${highlight ? "text-purple-700" : "text-gray-900"}`}>{value}</p>
    <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mt-0.5">{label}</p>
  </div>
);

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between px-3 py-2.5">
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    {typeof value === "string" ? <span className="text-xs font-bold text-gray-800">{value}</span> : value}
  </div>
);

export default CompareUnitsDrawer;
