import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Search, Filter, X, ChevronDown, ChevronUp, RotateCcw, Check, Building2, MapPin, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useCompoundsStore } from "../../store/compoundsStore";
import { motion, AnimatePresence } from "framer-motion";
import BulkActionsBar from "../../components/sales/BulkActionsBar";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const statusColors: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Available: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  Reserved: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  Sold: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" },
  Blocked: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", border: "border-slate-300" },
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const CompoundUnitsPage = () => {
  const { compoundId } = useParams<{ compoundId: string }>();
  const navigate = useNavigate();
  const { getCompoundById, getFilteredUnits, getUnitsByCompound, filters, setFilter, resetFilters, toggleFilterArrayValue, selectedUnitIds, toggleUnitSelection, selectAllUnits, clearSelection } = useCompoundsStore();

  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true,
    status: true,
    bedrooms: true,
    price: false,
    bua: false,
    floor: false,
    view: false,
  });

  // Sorting
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const compound = compoundId ? getCompoundById(compoundId) : undefined;
  const filteredUnits = compoundId ? getFilteredUnits(compoundId) : [];
  const allUnits = compoundId ? getUnitsByCompound(compoundId) : [];

  // Derive unique filter options from the compound's units
  const filterOptions = useMemo(() => {
    const types = [...new Set(allUnits.map((u) => u.type))].sort();
    const statuses = [...new Set(allUnits.map((u) => u.status))].sort();
    const floors = [...new Set(allUnits.map((u) => u.floor))].sort();
    const views = [...new Set(allUnits.map((u) => u.view))].sort();
    return { types, statuses, floors, views };
  }, [allUnits]);

  // Sorted units
  const sortedUnits = useMemo(() => {
    const sorted = [...filteredUnits];
    sorted.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";
      switch (sortKey) {
        case "id":
          valA = a.id;
          valB = b.id;
          break;
        case "type":
          valA = a.type;
          valB = b.type;
          break;
        case "bua":
          valA = a.bua;
          valB = b.bua;
          break;
        case "price":
          valA = a.price;
          valB = b.price;
          break;
        case "floor":
          valA = a.floor;
          valB = b.floor;
          break;
        case "status":
          valA = a.status;
          valB = b.status;
          break;
        case "bedrooms":
          valA = a.bedrooms;
          valB = b.bedrooms;
          break;
        default:
          valA = a.id;
          valB = b.id;
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDir === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
    return sorted;
  }, [filteredUnits, sortKey, sortDir]);

  // Paginated units
  const totalPages = Math.max(1, Math.ceil(sortedUnits.length / pageSize));
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUnits.slice(start, start + pageSize);
  }, [sortedUnits, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUnits.length, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.floor.length > 0) count++;
    if (filters.view.length > 0) count++;
    if (filters.bedroomsMin !== null || filters.bedroomsMax !== null) count++;
    if (filters.priceMin !== null || filters.priceMax !== null) count++;
    if (filters.buaMin !== null || filters.buaMax !== null) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const allPageIds = paginatedUnits.map((u) => u.id);
  const allSelected = paginatedUnits.length > 0 && paginatedUnits.every((u) => selectedUnitIds.includes(u.id));

  // Pagination range display
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedUnits.length);

  if (!compound) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Compound not found</h2>
          <button onClick={() => navigate("/sales/compounds")} className="text-blue-500 hover:text-blue-600 font-medium text-sm">
            ← Back to Compounds
          </button>
        </div>
      </div>
    );
  }

  const renderFilterSidebar = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Filter Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Filters</span>
          {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
        </div>
        <div className="flex items-center gap-1">
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50">
              <RotateCcw size={12} />
              Clear
            </button>
          )}
          {isMobile && (
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
              <X size={18} className="text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-20">
        {/* Type Filter */}
        <FilterSection title="Unit Type" isExpanded={expandedSections.type} onToggle={() => toggleSection("type")} activeCount={filters.type.length}>
          <div className="space-y-1">
            {filterOptions.types.map((type) => (
              <FilterCheckbox key={type} label={type} checked={filters.type.includes(type)} onChange={() => toggleFilterArrayValue("type", type)} />
            ))}
          </div>
        </FilterSection>

        {/* Status Filter */}
        <FilterSection title="Status" isExpanded={expandedSections.status} onToggle={() => toggleSection("status")} activeCount={filters.status.length}>
          <div className="space-y-1">
            {filterOptions.statuses.map((status) => (
              <FilterCheckbox key={status} label={status} checked={filters.status.includes(status)} onChange={() => toggleFilterArrayValue("status", status)} dotColor={statusColors[status]?.dot} />
            ))}
          </div>
        </FilterSection>

        {/* Bedrooms Filter */}
        <FilterSection title="Bedrooms" isExpanded={expandedSections.bedrooms} onToggle={() => toggleSection("bedrooms")} activeCount={filters.bedroomsMin !== null || filters.bedroomsMax !== null ? 1 : 0}>
          <div className="flex items-center gap-2">
            <input type="number" min={0} placeholder="Min" value={filters.bedroomsMin ?? ""} onChange={(e) => setFilter("bedroomsMin", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            <span className="text-slate-400 text-xs">to</span>
            <input type="number" min={0} placeholder="Max" value={filters.bedroomsMax ?? ""} onChange={(e) => setFilter("bedroomsMax", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title="Price Range" isExpanded={expandedSections.price} onToggle={() => toggleSection("price")} activeCount={filters.priceMin !== null || filters.priceMax !== null ? 1 : 0}>
          <div className="space-y-2">
            <input type="number" placeholder="Min Price (EGP)" value={filters.priceMin ?? ""} onChange={(e) => setFilter("priceMin", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            <input type="number" placeholder="Max Price (EGP)" value={filters.priceMax ?? ""} onChange={(e) => setFilter("priceMax", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
        </FilterSection>

        {/* BUA Filter */}
        <FilterSection title="BUA (m²)" isExpanded={expandedSections.bua} onToggle={() => toggleSection("bua")} activeCount={filters.buaMin !== null || filters.buaMax !== null ? 1 : 0}>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={filters.buaMin ?? ""} onChange={(e) => setFilter("buaMin", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            <span className="text-slate-400 text-xs">to</span>
            <input type="number" placeholder="Max" value={filters.buaMax ?? ""} onChange={(e) => setFilter("buaMax", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
        </FilterSection>

        {/* Floor Filter */}
        <FilterSection title="Floor" isExpanded={expandedSections.floor} onToggle={() => toggleSection("floor")} activeCount={filters.floor.length}>
          <div className="space-y-1">
            {filterOptions.floors.map((floor) => (
              <FilterCheckbox key={floor} label={floor} checked={filters.floor.includes(floor)} onChange={() => toggleFilterArrayValue("floor", floor)} />
            ))}
          </div>
        </FilterSection>

        {/* View Filter */}
        <FilterSection title="View" isExpanded={expandedSections.view} onToggle={() => toggleSection("view")} activeCount={filters.view.length}>
          <div className="space-y-1">
            {filterOptions.views.map((view) => (
              <FilterCheckbox key={view} label={view} checked={filters.view.includes(view)} onChange={() => toggleFilterArrayValue("view", view)} />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header Bar */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200/60 px-4 sm:px-6">
        <div className="flex items-center gap-3 py-3">
          {/* Back button */}
          <button onClick={() => navigate("/sales/compounds")} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
            <ArrowLeft size={18} />
          </button>

          {/* Compound info */}
          <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Building2 size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 truncate leading-tight">{compound.name}</h1>
              <div className="flex items-center gap-1 text-slate-400 text-[11px] leading-tight">
                <MapPin size={10} />
                <span className="truncate">{compound.location}</span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-7 bg-slate-200 flex-shrink-0 hidden sm:block" />

          {/* Search input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search for unit ID" value={filters.search} onChange={(e) => setFilter("search", e.target.value)} className="w-full pl-8 pr-7 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            {filters.search && (
              <button onClick={() => setFilter("search", "")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggles */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile filter toggle */}
            <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter size={14} />
              Filters
              {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
            </button>

            {/* Desktop filter toggle */}
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter size={14} />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Filter Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="hidden lg:block flex-shrink-0 bg-white border-r border-slate-200 overflow-hidden h-full">
              <div className="w-[280px] h-full">{renderFilterSidebar()}</div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setIsMobileFilterOpen(false)} />
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="lg:hidden fixed left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl z-50 overflow-y-auto">
                {renderFilterSidebar(true)}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Table area with border treatment */}
        <div className="flex-1 overflow-auto p-4 sm:p-5">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    {/* Select All Checkbox */}
                    <th className="w-12 py-2.5 px-3 pl-4 text-left align-middle">
                      <div className="flex items-center">
                        <button onClick={() => selectAllUnits(allPageIds)} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${allSelected ? "bg-blue-500 border-blue-500" : "border-slate-300 hover:border-blue-400"}`}>
                          {allSelected && <Check size={10} className="text-white" />}
                        </button>
                      </div>
                    </th>
                    <SortableHeader column="id" label="Unit ID" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader column="type" label="Type" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader column="bua" label="BUA (m²)" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader column="bedrooms" label="Beds" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader column="floor" label="Floor" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader column="price" label="Price" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader column="status" label="Status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUnits.map((unit) => {
                    const isSelected = selectedUnitIds.includes(unit.id);
                    const statusStyle = statusColors[unit.status] || statusColors.Available;

                    return (
                      <tr key={unit.id} className={`transition-colors cursor-pointer ${isSelected ? "bg-blue-50/60 hover:bg-blue-50" : "bg-white hover:bg-slate-50/80"}`} onClick={() => navigate(`/sales/compounds/${compoundId}/unit/${unit.id}`)}>
                        {/* Selection Checkbox */}
                        <td className="w-12 py-2.5 px-3 pl-4" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleUnitSelection(unit.id)} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isSelected ? "bg-blue-500 border-blue-500" : "border-slate-300 hover:border-blue-400"}`}>
                            {isSelected && <Check size={10} className="text-white" />}
                          </button>
                        </td>

                        {/* Unit ID */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs font-bold text-slate-900">{unit.id}</span>
                        </td>

                        {/* Type */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs text-slate-700">{unit.type}</span>
                        </td>

                        {/* BUA */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs text-slate-700">{unit.bua.toLocaleString()} m²</span>
                        </td>

                        {/* Bedrooms */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs text-slate-700">{unit.bedrooms === 0 ? "—" : unit.bedrooms}</span>
                        </td>

                        {/* Floor */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs text-slate-600">{unit.floor}</span>
                        </td>

                        {/* Price */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs font-bold text-slate-900">{formatCurrency(unit.price)}</span>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>{unit.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {sortedUnits.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="text-slate-400" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">No units found</h3>
                <p className="text-sm text-slate-500 mb-4">Try adjusting your filters to see more results</p>
                <button onClick={resetFilters} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <RotateCcw size={14} />
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination Footer */}
            {sortedUnits.length > 0 && (
              <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-2.5 flex items-center justify-between">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Rows per page:</span>
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-2.5 py-1 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                    >
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-2">
                  {/* Page numbers */}
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft size={14} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first, last, current, and adjacent pages
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - currentPage) <= 1) return true;
                        return false;
                      })
                      .map((page, idx, arr) => (
                        <span key={page} className="contents">
                          {/* Ellipsis if gap */}
                          {idx > 0 && page - arr[idx - 1] > 1 && <span className="w-7 h-7 flex items-center justify-center text-xs text-slate-400">…</span>}
                          <button onClick={() => setCurrentPage(page)} className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium transition-all ${page === currentPage ? "bg-blue-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}>
                            {page}
                          </button>
                        </span>
                      ))}

                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Results count */}
                <div className="text-xs text-slate-500">
                  {startItem}-{endItem} of {sortedUnits.length} Results
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {compoundId && <BulkActionsBar compoundId={compoundId} />}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────

const FilterSection = ({ title, isExpanded, onToggle, activeCount, children }: { title: string; isExpanded: boolean; onToggle: () => void; activeCount: number; children: React.ReactNode }) => (
  <div className="border-b border-slate-100 last:border-b-0">
    <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        {activeCount > 0 && <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">{activeCount}</span>}
      </div>
      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>
      {isExpanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
          <div className="px-5 pb-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FilterCheckbox = ({ label, checked, onChange, dotColor }: { label: string; checked: boolean; onChange: () => void; dotColor?: string }) => (
  <label className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
    <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${checked ? "bg-blue-500 border-blue-500" : "border-slate-300 group-hover:border-blue-400"}`}>{checked && <Check size={10} className="text-white" />}</div>
    {dotColor && <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />}
    <span className="text-sm text-slate-600">{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
  </label>
);

const SortableHeader = ({ column, label, sortKey, sortDir, onSort }: { column: string; label: string; sortKey: string; sortDir: "asc" | "desc"; onSort: (key: string) => void }) => (
  <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-slate-700 transition-colors" onClick={() => onSort(column)}>
    <div className="flex items-center gap-1 group">
      {label}
      <div className="w-4 h-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {sortKey === column && (
            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortDir === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
              <ChevronUp size={12} strokeWidth={2.5} className="text-blue-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </th>
);

export default CompoundUnitsPage;
