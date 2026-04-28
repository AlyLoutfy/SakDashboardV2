import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, MapPin, Home, Bed, Bath, Maximize, Eye, Calendar, User, DollarSign, Pencil, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventoryStore, formatCurrency, formatDate } from "../../store/inventoryStore";
import { useDrawerDimmer } from "../../hooks/useDrawerDimmer";

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Reserved:  "bg-amber-100 text-amber-800 border-amber-200",
  Sold:      "bg-blue-100 text-blue-700 border-blue-200",
  Blocked:   "bg-rose-100 text-rose-700 border-rose-200",
  Unavailable: "bg-gray-100 text-gray-600 border-gray-200",
  Booked:    "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const UnitQuickPreview = () => {
  const previewUnitId = useInventoryStore((s) => s.previewUnitId);
  const setPreviewUnit = useInventoryStore((s) => s.setPreviewUnit);
  const unit = useInventoryStore((s) => s.units.find((u) => u.id === previewUnitId));

  const open = !!previewUnitId && !!unit;
  useDrawerDimmer(open);

  return (
    <AnimatePresence>
      {open && unit && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewUnit(null)}
            className="fixed inset-0 bg-black/30 z-60"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-70 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div>
                <div className="text-sm font-bold text-gray-900">{unit.unitId}</div>
                <div className="text-[11px] text-gray-500">{unit.compound} · {unit.phase}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" className="h-8 gap-1.5 text-xs px-2.5"><Pencil size={12} />Edit</Button>
                <Button variant="outline" className="h-8 gap-1.5 text-xs px-2.5"><Copy size={12} />Duplicate</Button>
                <button onClick={() => setPreviewUnit(null)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Gallery placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                <div className="flex flex-col items-center gap-1">
                  <ImageIcon size={28} />
                  <span className="text-[11px]">{unit.galleryCount} photos</span>
                </div>
              </div>

              {/* Price + status */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Total Price</div>
                    <div className="text-2xl font-bold text-gray-900 mt-0.5">EGP {formatCurrency(unit.totalPrice)}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{formatCurrency(unit.pricePerMeter)} / m²</div>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-md text-[11px] font-semibold border ${STATUS_STYLES[unit.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {unit.status}
                  </span>
                </div>
              </div>

              {/* Specs grid */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Specifications</div>
                <div className="grid grid-cols-2 gap-2">
                  <SpecItem icon={Home} label="Type" value={unit.type} />
                  <SpecItem icon={Maximize} label="BUA" value={`${unit.bua} m²`} />
                  <SpecItem icon={Bed} label="Bedrooms" value={unit.bedrooms || "—"} />
                  <SpecItem icon={Bath} label="Bathrooms" value={unit.bathrooms} />
                  <SpecItem icon={Eye} label="View" value={unit.view} />
                  <SpecItem icon={MapPin} label="Location" value={unit.location} />
                </div>
              </div>

              {/* IDs */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Identifiers</div>
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                  <KV k="Unit ID" v={unit.unitId} />
                  <KV k="Building ID" v={unit.buildingId} />
                  <KV k="Design" v={unit.design} />
                  <KV k="CRM Unit" v={unit.crmUnitCode ?? "—"} mono />
                  <KV k="Floor" v={unit.floor} />
                  {unit.landArea && <KV k="Land Area" v={`${unit.landArea} m²`} />}
                </div>
              </div>

              {/* Assignment */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Assignment</div>
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                  <KV k="Agent" v={unit.assignedAgent ?? "Unassigned"} icon={User} />
                  <KV k="Last Update" v={formatDate(unit.updatedAt)} icon={Calendar} />
                  <KV k="Status Since" v={formatDate(unit.lastStatusChange)} icon={DollarSign} />
                  <KV k="Created" v={formatDate(unit.createdAt)} icon={Calendar} />
                </div>
              </div>

              {unit.notes && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Notes</div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900">
                    {unit.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="h-14 px-4 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0 bg-gray-50">
              <Button variant="outline" className="h-8 text-xs" onClick={() => setPreviewUnit(null)}>Close</Button>
              <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-xs">Open full details</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SpecItem = ({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string | number }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-2.5">
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
      <Icon size={11} />
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-900 mt-0.5">{value}</div>
  </div>
);

const KV = ({ k, v, mono, icon: Icon }: { k: string; v: string | number; mono?: boolean; icon?: typeof Home }) => (
  <div className="flex items-center justify-between px-3 py-2 text-xs">
    <div className="flex items-center gap-1.5 text-gray-500">
      {Icon && <Icon size={11} />}
      {k}
    </div>
    <div className={`font-semibold text-gray-900 ${mono ? "font-mono text-[11px]" : ""}`}>{v}</div>
  </div>
);

export default UnitQuickPreview;
