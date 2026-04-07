import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useChequesStore, getCategoryLabel, type FilterStatus } from "../../store/chequesStore";

interface ChequesFiltersProps {
  showFullFilters?: boolean;
}

const ChequesFilters = ({ showFullFilters = true }: ChequesFiltersProps) => {
  const {
    filterStatus, setFilterStatus,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    filterCompound, setFilterCompound,
    filterSearch, setFilterSearch,
    filterDateRange, setFilterDateRange,
    getCompounds,
    getCategories,
  } = useChequesStore();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const compounds = getCompounds();
  const categories = getCategories();

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "collected", label: "Collected" },
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" },
    { value: "bounced", label: "Bounced" },
    { value: "post_dated", label: "Post-dated" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "down_payment", label: "Down Payment" },
    { value: "installment", label: "Installment" },
    { value: "maintenance", label: "Maintenance" },
    { value: "finishing", label: "Finishing" },
    { value: "parking", label: "Parking" },
    { value: "club_membership", label: "Club" },
    { value: "balloon", label: "Balloon" },
  ];

  const hasDropdownFilters = filterStatus !== "all" || filterType !== "all" || filterCategory !== "all" || filterCompound !== "all" || filterDateRange.from !== null || filterDateRange.to !== null;
  const hasActiveFilters = hasDropdownFilters || filterSearch !== "";
  const activeFilterCount = [
    filterStatus !== "all",
    filterType !== "all",
    filterCategory !== "all",
    filterCompound !== "all",
    filterDateRange.from !== null || filterDateRange.to !== null,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterType("all");
    setFilterCategory("all");
    setFilterCompound("all");
    setFilterSearch("");
    setFilterDateRange({ from: null, to: null });
  };

  const selectClass = "h-8 pl-2.5 pr-8 text-[11px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-gray-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_6px_center] bg-no-repeat";
  const dateClass = "h-8 pl-2.5 pr-2 text-[11px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-gray-700";

  return (
    <div className="space-y-2">
      {/* Top row: Search + optional Compound (clients tab) + Filters toggle */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search client, unit, cheque #..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="h-8 pl-9 pr-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 w-64 placeholder:text-gray-400"
          />
        </div>

        {/* Compound — inline only on clients tab (on cheques tab it's in expanded filters) */}
        {!showFullFilters && (
          <select value={filterCompound} onChange={(e) => setFilterCompound(e.target.value)} className={selectClass}>
            <option value="all">All Compounds</option>
            {compounds.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        {/* Filters toggle — only when full filters available */}
        {showFullFilters && (
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`h-8 px-2.5 text-[11px] font-medium border rounded-lg flex items-center gap-1.5 transition-colors ${
              filtersOpen || hasDropdownFilters
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5 min-w-[18px] h-[18px]">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="h-8 px-2 text-[11px] text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Expanded filters row */}
      <AnimatePresence>
        {showFullFilters && filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap py-1">
              {/* Compound */}
              <select value={filterCompound} onChange={(e) => setFilterCompound(e.target.value)} className={selectClass}>
                <option value="all">All Compounds</option>
                {compounds.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Status */}
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)} className={selectClass}>
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Type */}
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectClass}>
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Category */}
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectClass}>
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{getCategoryLabel(c)}</option>
                ))}
              </select>

              {/* Date range separator */}
              <div className="w-px h-6 bg-gray-200 mx-1" />

              {/* Date from */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-gray-400">From</span>
                <input
                  type="date"
                  value={filterDateRange.from || ""}
                  onChange={(e) => setFilterDateRange({ ...filterDateRange, from: e.target.value || null })}
                  className={dateClass}
                />
              </div>

              {/* Date to */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-gray-400">To</span>
                <input
                  type="date"
                  value={filterDateRange.to || ""}
                  onChange={(e) => setFilterDateRange({ ...filterDateRange, to: e.target.value || null })}
                  className={dateClass}
                />
              </div>

              {/* Quick date presets */}
              {!filterDateRange.from && !filterDateRange.to && (
                <div className="flex items-center gap-1 ml-1">
                  {[
                    { label: "This Month", from: "2026-04-01", to: "2026-04-30" },
                    { label: "This Quarter", from: "2026-04-01", to: "2026-06-30" },
                    { label: "This Year", from: "2026-01-01", to: "2026-12-31" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setFilterDateRange({ from: preset.from, to: preset.to })}
                      className="h-7 px-2 text-[10px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                    >
                      {preset.label}
                    </button>
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

export default ChequesFilters;
