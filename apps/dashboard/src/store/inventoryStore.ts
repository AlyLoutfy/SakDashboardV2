import { create } from "zustand";

export type InventoryStatus = "Available" | "Reserved" | "Sold" | "Blocked" | "Unavailable" | "Booked";
export type InventoryUnitType = "Villa" | "Apartment" | "Townhouse" | "Duplex" | "Penthouse" | "Studio" | "Chalet" | "Twinhouse";

export interface InventoryUnit {
  id: string;
  unitId: string; // display code
  compound: string;
  phase: string;
  buildingId: string;
  type: InventoryUnitType;
  design: string;
  crmUnitCode: string | null;
  bua: number;
  landArea: number | null;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  view: string;
  location: string;
  status: InventoryStatus;
  totalPrice: number;
  pricePerMeter: number;
  galleryCount: number;
  assignedAgent: string | null;
  createdAt: string;
  updatedAt: string;
  lastStatusChange: string;
  notes: string;
}

export const ALL_COLUMNS = [
  "gallery",
  "unitId",
  "buildingId",
  "type",
  "design",
  "crmUnitCode",
  "bua",
  "landArea",
  "bedrooms",
  "bathrooms",
  "floor",
  "view",
  "compound",
  "phase",
  "location",
  "status",
  "totalPrice",
  "pricePerMeter",
  "assignedAgent",
  "updatedAt",
  "actions",
] as const;
export type ColumnKey = typeof ALL_COLUMNS[number];

export const COLUMN_LABELS: Record<ColumnKey, string> = {
  gallery: "Gallery",
  unitId: "Unit ID",
  buildingId: "Building ID",
  type: "Unit Type",
  design: "Unit Design",
  crmUnitCode: "CRM Unit",
  bua: "BUA",
  landArea: "Land Area",
  bedrooms: "Beds",
  bathrooms: "Baths",
  floor: "Floor",
  view: "View",
  compound: "Compound",
  phase: "Phase",
  location: "Location",
  status: "Status",
  totalPrice: "Total Price",
  pricePerMeter: "Price / m²",
  assignedAgent: "Agent",
  updatedAt: "Last Update",
  actions: "Actions",
};

const DEFAULT_VISIBLE: ColumnKey[] = [
  "unitId", "gallery", "buildingId", "type", "design", "crmUnitCode",
  "bua", "compound", "phase", "status", "totalPrice", "actions",
];

export interface InventoryFilters {
  search: string;
  searchField: "unitId" | "buildingId" | "crmUnitCode" | "all";
  compound: string[];
  phase: string[];
  buildingId: string[];
  type: string[];
  design: string[];
  status: string[];
  view: string[];
  location: string[];
  assignedAgent: string[];
  priceMin: number | null;
  priceMax: number | null;
  buaMin: number | null;
  buaMax: number | null;
  bedroomsMin: number | null;
  bedroomsMax: number | null;
  quickPreset: QuickPreset | null;
  bulkIds: string[]; // paste-to-filter
}

export type QuickPreset = "available" | "soldThisMonth" | "staleOver90" | "missingGallery" | "needsAttention";

const defaultFilters: InventoryFilters = {
  search: "",
  searchField: "unitId",
  compound: [],
  phase: [],
  buildingId: [],
  type: [],
  design: [],
  status: [],
  view: [],
  location: [],
  assignedAgent: [],
  priceMin: null,
  priceMax: null,
  buaMin: null,
  buaMax: null,
  bedroomsMin: null,
  bedroomsMax: null,
  quickPreset: null,
  bulkIds: [],
};

export interface SavedView {
  id: string;
  name: string;
  filters: InventoryFilters;
  visibleColumns: ColumnKey[];
}

// ----- Mock data generator -----
const COMPOUNDS = [
  { name: "Marakez North", location: "New Cairo", phases: ["Phase 1", "Phase 2", "Phase 3"] },
  { name: "Ramla", location: "North Coast", phases: ["Phase 1", "Phase 2"] },
  { name: "New Compound", location: "6th October", phases: ["Phase 1", "Phase 2"] },
  { name: "Palm Hills", location: "Sheikh Zayed", phases: ["Phase 1", "Phase 2", "Phase 3"] },
  { name: "Zed Park", location: "Sheikh Zayed", phases: ["Phase 1", "Phase 2"] },
];

const TYPES: InventoryUnitType[] = ["Villa", "Apartment", "Townhouse", "Duplex", "Penthouse", "Studio", "Chalet", "Twinhouse"];
const DESIGNS = ["THC", "Standard", "Premium", "Loft", "Garden", "Test Release", "Corner", "Duplex A", "Duplex B"];
const VIEWS = ["Garden View", "Pool View", "Sea View", "Lake View", "Park View", "Street View", "Panoramic View", "Golf View"];
const STATUSES: InventoryStatus[] = ["Available", "Reserved", "Sold", "Blocked", "Unavailable", "Booked"];
const AGENTS = ["Ahmed Salah", "Sara Ibrahim", "Omar Hassan", "Nour El-Din", "Yasmin Ali", null];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateUnits(): InventoryUnit[] {
  const rnd = seededRand(42);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rnd() * arr.length)];
  const out: InventoryUnit[] = [];
  let n = 1;

  // seeded "Test" rows to mirror screenshot
  for (let i = 8; i >= 1; i--) {
    out.push({
      id: `unit-test-${i}`,
      unitId: `Test${i}`,
      compound: "New Compound",
      phase: "Phase 2",
      buildingId: "Building1",
      type: "Apartment",
      design: "Test Release",
      crmUnitCode: null,
      bua: 200,
      landArea: null,
      bedrooms: 3,
      bathrooms: 2,
      floor: "2nd",
      view: "Street View",
      location: "6th October",
      status: "Unavailable",
      totalPrice: 10_000_000,
      pricePerMeter: 50_000,
      galleryCount: 0,
      assignedAgent: null,
      createdAt: "2026-01-15T10:00:00Z",
      updatedAt: "2026-03-10T14:20:00Z",
      lastStatusChange: "2026-03-10T14:20:00Z",
      notes: "",
    });
  }

  // PE-41D, R1-83 fixed rows from screenshot
  out.push({
    id: "unit-pe-41d", unitId: "PE-41D", compound: "Marakez North", phase: "Phase 1",
    buildingId: "41D", type: "Townhouse", design: "THC", crmUnitCode: null,
    bua: 236, landArea: 180, bedrooms: 4, bathrooms: 3, floor: "Ground + 1",
    view: "Garden View", location: "New Cairo", status: "Reserved",
    totalPrice: 32_950_000, pricePerMeter: 139_618, galleryCount: 0,
    assignedAgent: "Ahmed Salah", createdAt: "2025-11-20T10:00:00Z",
    updatedAt: "2026-04-05T09:00:00Z", lastStatusChange: "2026-04-05T09:00:00Z", notes: "",
  });
  out.push({
    id: "unit-r1-83", unitId: "R1-83", compound: "Ramla", phase: "Phase 1",
    buildingId: "R1-83", type: "Chalet", design: "Testing Em...", crmUnitCode: null,
    bua: 21, landArea: null, bedrooms: 1, bathrooms: 1, floor: "Ground",
    view: "Sea View", location: "North Coast", status: "Booked",
    totalPrice: 105_400_000, pricePerMeter: 5_019_047, galleryCount: 1,
    assignedAgent: "Sara Ibrahim", createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2026-04-12T11:00:00Z", lastStatusChange: "2026-04-12T11:00:00Z", notes: "Test unit",
  });

  // Bulk generation
  for (const comp of COMPOUNDS) {
    for (const phase of comp.phases) {
      const count = 20 + Math.floor(rnd() * 80);
      for (let i = 1; i <= count; i++) {
        const type = pick(TYPES) as InventoryUnitType;
        const bua = 60 + Math.floor(rnd() * 440);
        const pricePerMeter = 25_000 + Math.floor(rnd() * 75_000);
        const bedrooms = Math.min(6, Math.max(0, Math.floor(rnd() * 6)));
        const status = pick(STATUSES) as InventoryStatus;
        const prefix = comp.name.split(" ").map(w => w[0]).join("").toUpperCase();
        const phaseNum = phase.replace(/\D/g, "");
        const buildingId = `${prefix}${phaseNum}-${String(Math.floor(rnd() * 30) + 1).padStart(2, "0")}`;
        const unitNum = String(n++).padStart(3, "0");
        out.push({
          id: `unit-${prefix}-${phaseNum}-${unitNum}`,
          unitId: `${prefix}-${phaseNum}-${unitNum}`,
          compound: comp.name,
          phase,
          buildingId,
          type,
          design: pick(DESIGNS),
          crmUnitCode: rnd() > 0.5 ? `CRM-${Math.floor(rnd() * 99999)}` : null,
          bua,
          landArea: type === "Villa" || type === "Townhouse" ? bua + Math.floor(rnd() * 200) : null,
          bedrooms,
          bathrooms: Math.max(1, Math.floor(bedrooms * 0.7) || 1),
          floor: type === "Villa" || type === "Townhouse" ? "Ground + 1" : `${Math.floor(rnd() * 10)}`,
          view: pick(VIEWS),
          location: comp.location,
          status,
          totalPrice: bua * pricePerMeter,
          pricePerMeter,
          galleryCount: Math.floor(rnd() * 12),
          assignedAgent: pick(AGENTS),
          createdAt: `2025-${String(1 + Math.floor(rnd() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}T10:00:00Z`,
          updatedAt: `2026-${String(1 + Math.floor(rnd() * 4)).padStart(2, "0")}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}T10:00:00Z`,
          lastStatusChange: `2025-${String(1 + Math.floor(rnd() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}T10:00:00Z`,
          notes: "",
        });
      }
    }
  }

  return out;
}

const DUMMY_UNITS = generateUnits();

// ----- Store -----
interface InventoryStore {
  units: InventoryUnit[];
  selectedIds: string[];
  filters: InventoryFilters;
  visibleColumns: ColumnKey[];
  columnOrder: ColumnKey[];
  density: "compact" | "comfortable";
  savedViews: SavedView[];
  activeViewId: string | null;
  previewUnitId: string | null;
  advancedFiltersOpen: boolean;
  columnManagerOpen: boolean;
  viewSettingsOpen: boolean;

  // Derived
  getFilteredUnits: () => InventoryUnit[];
  getOverallStats: () => {
    total: number; available: number; reserved: number; sold: number; blocked: number;
    unavailable: number; booked: number; totalValue: number; avgPricePerMeter: number;
    staleCount: number; missingGalleryCount: number;
  };
  getUniqueValues: (key: keyof InventoryUnit) => string[];
  activeFiltersCount: () => number;

  // Filters
  setFilter: <K extends keyof InventoryFilters>(key: K, value: InventoryFilters[K]) => void;
  toggleFilterArrayValue: (key: "compound" | "phase" | "buildingId" | "type" | "design" | "status" | "view" | "location" | "assignedAgent", value: string) => void;
  resetFilters: () => void;
  applyPreset: (preset: QuickPreset | null) => void;

  // Selection
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Columns
  toggleColumn: (col: ColumnKey) => void;
  reorderColumns: (order: ColumnKey[]) => void;
  setDensity: (d: "compact" | "comfortable") => void;
  setColumnManagerOpen: (v: boolean) => void;

  // Saved views
  saveView: (name: string) => void;
  deleteView: (id: string) => void;
  loadView: (id: string) => void;

  // Preview
  setPreviewUnit: (id: string | null) => void;
  setAdvancedFiltersOpen: (v: boolean) => void;
  setViewSettingsOpen: (v: boolean) => void;
}

function daysBetween(a: string, b: Date = new Date()) {
  const aDate = new Date(a);
  return Math.floor((b.getTime() - aDate.getTime()) / (1000 * 60 * 60 * 24));
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  units: DUMMY_UNITS,
  selectedIds: [],
  filters: { ...defaultFilters },
  visibleColumns: [...DEFAULT_VISIBLE],
  columnOrder: [...ALL_COLUMNS],
  density: "comfortable",
  savedViews: [],
  activeViewId: null,
  previewUnitId: null,
  advancedFiltersOpen: false,
  columnManagerOpen: false,
  viewSettingsOpen: false,

  getFilteredUnits: () => {
    const { units, filters } = get();
    let result = units;

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((u) => {
        if (filters.searchField === "unitId") return u.unitId.toLowerCase().includes(s);
        if (filters.searchField === "buildingId") return u.buildingId.toLowerCase().includes(s);
        if (filters.searchField === "crmUnitCode") return (u.crmUnitCode ?? "").toLowerCase().includes(s);
        return [u.unitId, u.buildingId, u.crmUnitCode ?? "", u.compound, u.design, u.type].join(" ").toLowerCase().includes(s);
      });
    }
    if (filters.bulkIds.length > 0) {
      const set = new Set(filters.bulkIds.map((x) => x.toLowerCase()));
      result = result.filter((u) => set.has(u.unitId.toLowerCase()));
    }
    for (const k of ["compound", "phase", "buildingId", "type", "design", "status", "view", "location", "assignedAgent"] as const) {
      const arr = filters[k];
      if (arr.length > 0) {
        result = result.filter((u) => {
          const v = (u as unknown as Record<string, unknown>)[k];
          return arr.includes(String(v));
        });
      }
    }
    if (filters.priceMin !== null) result = result.filter((u) => u.totalPrice >= filters.priceMin!);
    if (filters.priceMax !== null) result = result.filter((u) => u.totalPrice <= filters.priceMax!);
    if (filters.buaMin !== null) result = result.filter((u) => u.bua >= filters.buaMin!);
    if (filters.buaMax !== null) result = result.filter((u) => u.bua <= filters.buaMax!);
    if (filters.bedroomsMin !== null) result = result.filter((u) => u.bedrooms >= filters.bedroomsMin!);
    if (filters.bedroomsMax !== null) result = result.filter((u) => u.bedrooms <= filters.bedroomsMax!);

    if (filters.quickPreset === "available") {
      result = result.filter((u) => u.status === "Available");
    } else if (filters.quickPreset === "soldThisMonth") {
      const now = new Date();
      result = result.filter((u) => {
        if (u.status !== "Sold") return false;
        const d = new Date(u.lastStatusChange);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
    } else if (filters.quickPreset === "staleOver90") {
      result = result.filter((u) => u.status === "Available" && daysBetween(u.createdAt) > 90);
    } else if (filters.quickPreset === "missingGallery") {
      result = result.filter((u) => u.galleryCount === 0);
    } else if (filters.quickPreset === "needsAttention") {
      result = result.filter((u) => u.galleryCount === 0 || (u.status === "Available" && daysBetween(u.createdAt) > 90));
    }

    return result;
  },

  getOverallStats: () => {
    const units = get().getFilteredUnits();
    const total = units.length;
    const byStatus = (s: InventoryStatus) => units.filter((u) => u.status === s).length;
    const totalValue = units.reduce((sum, u) => sum + u.totalPrice, 0);
    const avgPricePerMeter = units.length ? Math.round(units.reduce((s, u) => s + u.pricePerMeter, 0) / units.length) : 0;
    const staleCount = units.filter((u) => u.status === "Available" && daysBetween(u.createdAt) > 90).length;
    const missingGalleryCount = units.filter((u) => u.galleryCount === 0).length;
    return {
      total,
      available: byStatus("Available"),
      reserved: byStatus("Reserved"),
      sold: byStatus("Sold"),
      blocked: byStatus("Blocked"),
      unavailable: byStatus("Unavailable"),
      booked: byStatus("Booked"),
      totalValue, avgPricePerMeter, staleCount, missingGalleryCount,
    };
  },

  getUniqueValues: (key) => {
    const set = new Set<string>();
    for (const u of get().units) {
      const v = u[key];
      if (v !== null && v !== undefined && v !== "") set.add(String(v));
    }
    return [...set].sort();
  },

  activeFiltersCount: () => {
    const f = get().filters;
    let n = 0;
    if (f.search) n++;
    if (f.bulkIds.length) n++;
    for (const k of ["compound", "phase", "buildingId", "type", "design", "status", "view", "location", "assignedAgent"] as const) {
      if (f[k].length) n++;
    }
    if (f.priceMin !== null || f.priceMax !== null) n++;
    if (f.buaMin !== null || f.buaMax !== null) n++;
    if (f.bedroomsMin !== null || f.bedroomsMax !== null) n++;
    if (f.quickPreset) n++;
    return n;
  },

  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value }, activeViewId: null })),

  toggleFilterArrayValue: (key, value) => set((s) => {
    const arr = s.filters[key];
    return {
      filters: {
        ...s.filters,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      },
      activeViewId: null,
    };
  }),

  resetFilters: () => set({ filters: { ...defaultFilters }, activeViewId: null }),

  applyPreset: (preset) => set((s) => ({ filters: { ...s.filters, quickPreset: preset }, activeViewId: null })),

  toggleSelection: (id) => set((s) => ({
    selectedIds: s.selectedIds.includes(id) ? s.selectedIds.filter((x) => x !== id) : [...s.selectedIds, id],
  })),

  selectAll: (ids) => set((s) => {
    const allIn = ids.every((id) => s.selectedIds.includes(id));
    return {
      selectedIds: allIn ? s.selectedIds.filter((id) => !ids.includes(id)) : [...new Set([...s.selectedIds, ...ids])],
    };
  }),

  clearSelection: () => set({ selectedIds: [] }),

  toggleColumn: (col) => set((s) => ({
    visibleColumns: s.visibleColumns.includes(col) ? s.visibleColumns.filter((c) => c !== col) : [...s.visibleColumns, col],
  })),

  reorderColumns: (order) => set({ columnOrder: order }),

  setDensity: (d) => set({ density: d }),

  setColumnManagerOpen: (v) => set({ columnManagerOpen: v }),

  saveView: (name) => set((s) => {
    const view: SavedView = {
      id: `view-${Date.now()}`,
      name,
      filters: { ...s.filters },
      visibleColumns: [...s.visibleColumns],
    };
    return { savedViews: [...s.savedViews, view], activeViewId: view.id };
  }),

  deleteView: (id) => set((s) => ({
    savedViews: s.savedViews.filter((v) => v.id !== id),
    activeViewId: s.activeViewId === id ? null : s.activeViewId,
  })),

  loadView: (id) => set((s) => {
    const view = s.savedViews.find((v) => v.id === id);
    if (!view) return {};
    return {
      filters: { ...view.filters },
      visibleColumns: [...view.visibleColumns],
      activeViewId: id,
    };
  }),

  setPreviewUnit: (id) => set({ previewUnitId: id }),
  setAdvancedFiltersOpen: (v) => set({ advancedFiltersOpen: v }),
  setViewSettingsOpen: (v) => set({ viewSettingsOpen: v }),
}));

export function formatCurrency(n: number, compact = false): string {
  if (compact) {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  }
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
