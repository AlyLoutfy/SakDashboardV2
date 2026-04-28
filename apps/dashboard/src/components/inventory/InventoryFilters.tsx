import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Check, ChevronDown, ListPlus } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useInventoryStore, formatCurrency, type InventoryFilters as Filters } from "../../store/inventoryStore";

const SEARCH_FIELDS: { value: Filters["searchField"]; label: string }[] = [
  { value: "unitId", label: "Unit ID" },
  { value: "buildingId", label: "Building ID" },
  { value: "crmUnitCode", label: "CRM Unit" },
  { value: "all", label: "Any field" },
];

type MultiKey = "compound" | "phase" | "buildingId" | "type" | "design" | "status" | "view" | "location" | "assignedAgent";

const MultiSelect = ({ label, filterKey, options }: { label: string; filterKey: MultiKey; options: string[] }) => {
  const selected = useInventoryStore((s) => s.filters[filterKey]);
  const toggle = useInventoryStore((s) => s.toggleFilterArrayValue);
  const [q, setQ] = useState("");
  const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`h-8 px-2.5 pr-2 text-xs font-medium border rounded-lg flex items-center gap-1.5 transition-colors ${selected.length > 0 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
          <span>{label}</span>
          {selected.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">{selected.length}</span>
          )}
          <ChevronDown size={12} className="text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <div className="relative mb-2">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="w-full h-7 pl-7 pr-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="max-h-60 overflow-y-auto space-y-0.5">
          {filtered.length === 0 && <div className="text-center text-[11px] text-gray-400 py-3">No options</div>}
          {filtered.map((opt) => {
            const on = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(filterKey, opt)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs text-gray-700 hover:bg-gray-50 text-left"
              >
                <span className="truncate">{opt}</span>
                {on && <Check size={12} className="text-blue-600" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const InventoryFilters = () => {
  const filters = useInventoryStore((s) => s.filters);
  const setFilter = useInventoryStore((s) => s.setFilter);
  const toggle = useInventoryStore((s) => s.toggleFilterArrayValue);
  const resetFilters = useInventoryStore((s) => s.resetFilters);
  const activeCount = useInventoryStore((s) => s.activeFiltersCount());
  const getUnique = useInventoryStore((s) => s.getUniqueValues);
  const advancedOpen = useInventoryStore((s) => s.advancedFiltersOpen);
  const setAdvancedOpen = useInventoryStore((s) => s.setAdvancedFiltersOpen);

  const [bulkPasteOpen, setBulkPasteOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState("");

  const compounds = useMemo(() => getUnique("compound"), [getUnique]);
  const phases = useMemo(() => getUnique("phase"), [getUnique]);
  const buildings = useMemo(() => getUnique("buildingId"), [getUnique]);
  const types = useMemo(() => getUnique("type"), [getUnique]);
  const designs = useMemo(() => getUnique("design"), [getUnique]);
  const statuses = useMemo(() => getUnique("status"), [getUnique]);
  const views = useMemo(() => getUnique("view"), [getUnique]);
  const locations = useMemo(() => getUnique("location"), [getUnique]);
  const agents = useMemo(() => getUnique("assignedAgent"), [getUnique]);

  const applyBulkIds = () => {
    const ids = bulkInput.split(/[\n,\s]+/).map((x) => x.trim()).filter(Boolean);
    setFilter("bulkIds", ids);
    setBulkPasteOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Top row: search + quick filters + advanced */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden h-8">
          <select
            value={filters.searchField}
            onChange={(e) => setFilter("searchField", e.target.value as Filters["searchField"])}
            className="h-full pl-2 pr-1 text-xs border-r border-gray-200 bg-gray-50 text-gray-600 focus:outline-none cursor-pointer"
          >
            {SEARCH_FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <div className="relative flex-1">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder={`Search by ${SEARCH_FIELDS.find((f) => f.value === filters.searchField)?.label.toLowerCase()}...`}
              className="w-64 h-full pl-6 pr-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        <Popover open={bulkPasteOpen} onOpenChange={setBulkPasteOpen}>
          <PopoverTrigger asChild>
            <button
              title="Bulk-filter by Unit IDs (paste list)"
              className={`h-8 px-2.5 text-xs font-medium border rounded-lg flex items-center gap-1.5 transition-colors ${filters.bulkIds.length > 0 ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              <ListPlus size={12} />
              Bulk IDs
              {filters.bulkIds.length > 0 && <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-[9px] font-bold">{filters.bulkIds.length}</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-2">
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Paste Unit IDs</div>
            <div className="text-[10px] text-gray-500 mb-2">Comma, space, or newline separated. Filters table to exactly those IDs.</div>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={5}
              placeholder="PE-41D&#10;R1-83&#10;Test1, Test2, Test3"
              className="w-full p-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
            />
            <div className="flex justify-between items-center mt-2">
              <button onClick={() => { setFilter("bulkIds", []); setBulkInput(""); setBulkPasteOpen(false); }} className="text-[11px] text-gray-500 hover:text-gray-700">Clear</button>
              <Button size="sm" className="h-7 text-xs" onClick={applyBulkIds}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        <MultiSelect label="Compound" filterKey="compound" options={compounds} />
        <MultiSelect label="Status" filterKey="status" options={statuses} />
        <MultiSelect label="Unit Type" filterKey="type" options={types} />
        <MultiSelect label="Phase" filterKey="phase" options={phases} />

        <Button
          variant="outline"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className={`h-8 gap-1.5 text-xs font-medium px-2.5 border-gray-200 ${advancedOpen ? "bg-gray-100" : "bg-white"}`}
        >
          <SlidersHorizontal size={12} />
          More filters
          {activeCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">{activeCount}</span>}
        </Button>

        {activeCount > 0 && (
          <button onClick={resetFilters} className="h-8 px-2 text-[11px] text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <X size={12} />
            Clear all
          </button>
        )}

      </div>

      {/* Advanced panel */}
      <AnimatePresence initial={false}>
        {advancedOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <MultiSelect label="Building" filterKey="buildingId" options={buildings} />
                <MultiSelect label="Design" filterKey="design" options={designs} />
                <MultiSelect label="View" filterKey="view" options={views} />
                <MultiSelect label="Location" filterKey="location" options={locations} />
                <MultiSelect label="Agent" filterKey="assignedAgent" options={agents} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <RangeInput
                  label="Total Price (EGP)"
                  min={filters.priceMin}
                  max={filters.priceMax}
                  onMinChange={(v) => setFilter("priceMin", v)}
                  onMaxChange={(v) => setFilter("priceMax", v)}
                  formatValue={(v) => formatCurrency(v, true)}
                />
                <RangeInput
                  label="BUA (m²)"
                  min={filters.buaMin}
                  max={filters.buaMax}
                  onMinChange={(v) => setFilter("buaMin", v)}
                  onMaxChange={(v) => setFilter("buaMax", v)}
                />
                <RangeInput
                  label="Bedrooms"
                  min={filters.bedroomsMin}
                  max={filters.bedroomsMax}
                  onMinChange={(v) => setFilter("bedroomsMin", v)}
                  onMaxChange={(v) => setFilter("bedroomsMax", v)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chip row */}
      {activeCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["compound", "phase", "buildingId", "type", "design", "status", "view", "location", "assignedAgent"] as MultiKey[]).flatMap((k) =>
            filters[k].map((v) => (
              <Chip key={`${k}-${v}`} label={`${labelFor(k)}: ${v}`} onRemove={() => toggle(k, v)} />
            ))
          )}
          {(filters.priceMin !== null || filters.priceMax !== null) && (
            <Chip label={`Price: ${filters.priceMin ? formatCurrency(filters.priceMin, true) : "—"} → ${filters.priceMax ? formatCurrency(filters.priceMax, true) : "—"}`} onRemove={() => { setFilter("priceMin", null); setFilter("priceMax", null); }} />
          )}
          {(filters.buaMin !== null || filters.buaMax !== null) && (
            <Chip label={`BUA: ${filters.buaMin ?? "—"} → ${filters.buaMax ?? "—"} m²`} onRemove={() => { setFilter("buaMin", null); setFilter("buaMax", null); }} />
          )}
          {(filters.bedroomsMin !== null || filters.bedroomsMax !== null) && (
            <Chip label={`Beds: ${filters.bedroomsMin ?? "—"} → ${filters.bedroomsMax ?? "—"}`} onRemove={() => { setFilter("bedroomsMin", null); setFilter("bedroomsMax", null); }} />
          )}
          {filters.bulkIds.length > 0 && (
            <Chip label={`Bulk IDs: ${filters.bulkIds.length}`} onRemove={() => setFilter("bulkIds", [])} />
          )}
        </div>
      )}
    </div>
  );
};

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <div className="inline-flex items-center gap-1 h-6 pl-2 pr-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] text-blue-700">
    <span className="font-medium">{label}</span>
    <button onClick={onRemove} className="p-0.5 hover:bg-blue-100 rounded-full">
      <X size={10} />
    </button>
  </div>
);

const RangeInput = ({ label, min, max, onMinChange, onMaxChange, formatValue }: {
  label: string; min: number | null; max: number | null;
  onMinChange: (v: number | null) => void; onMaxChange: (v: number | null) => void;
  formatValue?: (v: number) => string;
}) => {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={min ?? ""}
          onChange={(e) => onMinChange(e.target.value === "" ? null : Number(e.target.value))}
          placeholder="Min"
          className="flex-1 h-8 px-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <span className="text-gray-400 text-xs">→</span>
        <input
          type="number"
          value={max ?? ""}
          onChange={(e) => onMaxChange(e.target.value === "" ? null : Number(e.target.value))}
          placeholder="Max"
          className="flex-1 h-8 px-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      {formatValue && (min !== null || max !== null) && (
        <div className="text-[10px] text-gray-500 mt-1">
          {min !== null ? formatValue(min) : "—"} to {max !== null ? formatValue(max) : "—"}
        </div>
      )}
    </div>
  );
};

function labelFor(k: MultiKey): string {
  const map: Record<MultiKey, string> = {
    compound: "Compound", phase: "Phase", buildingId: "Building", type: "Type",
    design: "Design", status: "Status", view: "View", location: "Location", assignedAgent: "Agent",
  };
  return map[k];
}

export default InventoryFilters;
