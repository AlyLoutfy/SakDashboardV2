import { Building2, AlertTriangle, ImageOff } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useInventoryStore } from "../../store/inventoryStore";

const InventoryKPIs = () => {
  const stats = useInventoryStore(useShallow((s) => s.getOverallStats()));
  const applyPreset = useInventoryStore((s) => s.applyPreset);
  const currentPreset = useInventoryStore((s) => s.filters.quickPreset);

  const statusSegments = stats.total
    ? [
        { label: "Available", value: stats.available, color: "bg-emerald-500" },
        { label: "Reserved", value: stats.reserved, color: "bg-amber-500" },
        { label: "Sold", value: stats.sold, color: "bg-blue-500" },
        { label: "Booked", value: stats.booked, color: "bg-indigo-500" },
        { label: "Blocked", value: stats.blocked, color: "bg-rose-500" },
        { label: "Unavailable", value: stats.unavailable, color: "bg-gray-400" },
      ]
    : [];

  return (
    <div>
      {/* Status distribution bar + alerts */}
      <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Status Distribution</span>
            <span className="text-[10px] text-gray-400">{stats.total} units</span>
          </div>
          <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100">
            {statusSegments.map((seg) => (
              <div
                key={seg.label}
                className={seg.color}
                style={{ width: `${(seg.value / stats.total) * 100}%` }}
                title={`${seg.label}: ${seg.value}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            {statusSegments.filter((s) => s.value > 0).map((seg) => (
              <div key={seg.label} className="flex items-center gap-1 text-[10px] text-gray-600">
                <span className={`w-1.5 h-1.5 rounded-full ${seg.color}`} />
                <span className="font-medium">{seg.label}</span>
                <span className="text-gray-400">{seg.value}</span>
              </div>
            ))}
          </div>
        </div>

        {(stats.staleCount > 0 || stats.missingGalleryCount > 0) && (
          <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
            {stats.staleCount > 0 && (
              <button
                onClick={() => applyPreset(currentPreset === "staleOver90" ? null : "staleOver90")}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${currentPreset === "staleOver90" ? "bg-amber-100 border-amber-300 text-amber-900" : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"}`}
              >
                <AlertTriangle size={12} />
                <span>{stats.staleCount} stale</span>
              </button>
            )}
            {stats.missingGalleryCount > 0 && (
              <button
                onClick={() => applyPreset(currentPreset === "missingGallery" ? null : "missingGallery")}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${currentPreset === "missingGallery" ? "bg-gray-200 border-gray-300 text-gray-900" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"}`}
              >
                <ImageOff size={12} />
                <span>{stats.missingGalleryCount} no images</span>
              </button>
            )}
          </div>
        )}

        <Building2 size={14} className="text-gray-300" />
      </div>
    </div>
  );
};

export default InventoryKPIs;
