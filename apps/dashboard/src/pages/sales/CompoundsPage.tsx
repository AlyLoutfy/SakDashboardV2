import { useNavigate } from "react-router-dom";
import { MapPin, Building2, ArrowRight, Home, Search, SlidersHorizontal, X, Check, RotateCcw, ChevronDown, Filter } from "lucide-react";
import { useCompoundsStore } from "../../store/compoundsStore";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

const CompoundsPage = () => {
  const navigate = useNavigate();
  const { compounds, units, getFilteredCompounds, filters, setFilter, resetFilters, toggleFilterArrayValue, compoundFilters, setCompoundFilter, toggleCompoundFilterArrayValue, resetCompoundFilters, activeFiltersCount } = useCompoundsStore();

  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    location: true,
    developer: true,
    propertyType: true,
    bedrooms: true,
  });

  const filteredCompounds = getFilteredCompounds();
  const filterCount = activeFiltersCount();

  // Derive filter options
  const filterOptions = useMemo(() => {
    const locations = [
      ...new Set(
        compounds.map((c) => {
          const parts = c.location.split(", ");
          return parts[parts.length - 1];
        }),
      ),
    ].sort();

    const developers = [...new Set(compounds.map((c) => c.developer))].sort();
    const unitTypes = [...new Set(units.map((u) => u.type))].sort();
    const maxBedrooms = Math.max(...units.map((u) => u.bedrooms));
    const bedroomOptions = Array.from({ length: maxBedrooms + 1 }, (_, i) => i);

    return { locations, developers, unitTypes, bedroomOptions };
  }, [compounds, units]);

  const getMatchingUnitsCount = (compoundId: string) => {
    let compoundUnits = units.filter((u) => u.compoundId === compoundId);
    if (filters.type.length > 0) {
      compoundUnits = compoundUnits.filter((u) => filters.type.includes(u.type));
    }
    if (filters.bedroomsMin !== null) {
      compoundUnits = compoundUnits.filter((u) => u.bedrooms >= filters.bedroomsMin!);
    }
    if (filters.bedroomsMax !== null) {
      compoundUnits = compoundUnits.filter((u) => u.bedrooms <= filters.bedroomsMax!);
    }
    return compoundUnits.length;
  };

  const handleResetAll = () => {
    resetFilters();
    resetCompoundFilters();
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ─── Filter Sidebar (shared desktop / mobile) ───
  const renderFilterSidebar = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Filter Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Filters</span>
          {filterCount > 0 && <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">{filterCount}</span>}
        </div>
        <div className="flex items-center gap-1">
          {filterCount > 0 && (
            <button onClick={handleResetAll} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50">
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
        {/* Location */}
        <FilterSection title="Location" isExpanded={expandedSections.location} onToggle={() => toggleSection("location")} activeCount={compoundFilters.location.length}>
          <div className="space-y-1">
            {filterOptions.locations.map((loc) => (
              <FilterCheckbox key={loc} label={loc} checked={compoundFilters.location.includes(loc)} onChange={() => toggleCompoundFilterArrayValue("location", loc)} />
            ))}
          </div>
        </FilterSection>

        {/* Developer */}
        <FilterSection title="Developer" isExpanded={expandedSections.developer} onToggle={() => toggleSection("developer")} activeCount={compoundFilters.developer.length}>
          <div className="space-y-1">
            {filterOptions.developers.map((dev) => (
              <FilterCheckbox key={dev} label={dev} checked={compoundFilters.developer.includes(dev)} onChange={() => toggleCompoundFilterArrayValue("developer", dev)} />
            ))}
          </div>
        </FilterSection>

        {/* Property Type */}
        <FilterSection title="Property Type" isExpanded={expandedSections.propertyType} onToggle={() => toggleSection("propertyType")} activeCount={filters.type.length}>
          <div className="space-y-1">
            {filterOptions.unitTypes.map((type) => (
              <FilterCheckbox key={type} label={type} checked={filters.type.includes(type)} onChange={() => toggleFilterArrayValue("type", type)} />
            ))}
          </div>
        </FilterSection>

        {/* Bedrooms */}
        <FilterSection title="Bedrooms" isExpanded={expandedSections.bedrooms} onToggle={() => toggleSection("bedrooms")} activeCount={filters.bedroomsMin !== null || filters.bedroomsMax !== null ? 1 : 0}>
          <div className="flex items-center gap-2">
            <input type="number" min={0} placeholder="Min" value={filters.bedroomsMin ?? ""} onChange={(e) => setFilter("bedroomsMin", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            <span className="text-slate-400 text-xs">to</span>
            <input type="number" min={0} placeholder="Max" value={filters.bedroomsMax ?? ""} onChange={(e) => setFilter("bedroomsMax", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
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
          {/* Title */}
          <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Building2 className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-slate-800 truncate">Compounds</h1>
              <p className="text-[11px] text-slate-500">
                {filteredCompounds.length} of {compounds.length} compound{compounds.length !== 1 ? "s" : ""} shown
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-7 bg-slate-200 flex-shrink-0 hidden sm:block" />

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search compounds..." value={compoundFilters.search} onChange={(e) => setCompoundFilter("search", e.target.value)} className="w-full pl-8 pr-7 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            {compoundFilters.search && (
              <button onClick={() => setCompoundFilter("search", "")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
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
              {filterCount > 0 && <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">{filterCount}</span>}
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

        {/* Cards grid */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {filteredCompounds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Building2 className="text-slate-400" size={28} />
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">No compounds match your filters</h3>
                <p className="text-xs text-slate-500 mb-4">Try adjusting your filter criteria</p>
                <button onClick={handleResetAll} className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredCompounds.map((compound, index) => {
                  const matchingCount = getMatchingUnitsCount(compound.id);
                  const hasActiveUnitFilters = filters.type.length > 0 || filters.bedroomsMin !== null || filters.bedroomsMax !== null;

                  return (
                    <motion.div key={compound.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}>
                      <button onClick={() => navigate(`/sales/compounds/${compound.id}`)} className="group relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left" id={`compound-card-${compound.id}`}>
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img src={compound.image} alt={compound.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/85 group-hover:via-black/35 transition-all duration-500" />

                        {/* Top Badges */}
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                          <div className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
                            <Home size={11} />
                            {compound.availableUnits} Available
                          </div>
                          {hasActiveUnitFilters && (
                            <div className="px-2.5 py-1 rounded-full bg-blue-500/80 backdrop-blur-md border border-blue-400/30 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg">
                              <SlidersHorizontal size={10} />
                              {matchingCount} matching
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                          {/* Developer Tag */}
                          <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/20 backdrop-blur-md border border-blue-400/20 text-blue-200 text-[10px] font-medium uppercase tracking-wide">{compound.developer}</span>
                          </div>

                          {/* Name */}
                          <h2 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-blue-100 transition-colors">{compound.name}</h2>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-slate-300 text-xs mb-3">
                            <MapPin size={12} className="flex-shrink-0" />
                            <span>{compound.location}</span>
                          </div>

                          {/* Bottom row */}
                          <div className="flex items-center justify-between">
                            <div className="text-slate-400 text-[11px]">
                              <span className="text-white font-semibold text-sm">{compound.totalUnits}</span> total units
                            </div>

                            {/* Explore Arrow */}
                            <div className="flex items-center gap-1.5 text-blue-300 text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                              <span>Explore</span>
                              <ArrowRight size={14} />
                            </div>
                          </div>
                        </div>

                        {/* Hover border glow */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-500 pointer-events-none" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
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

const FilterCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <label className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
    <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${checked ? "bg-blue-500 border-blue-500" : "border-slate-300 group-hover:border-blue-400"}`}>{checked && <Check size={10} className="text-white" />}</div>
    <span className="text-sm text-slate-600">{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
  </label>
);

export default CompoundsPage;
