import { create } from "zustand";

export interface Compound {
  id: string;
  name: string;
  location: string;
  image: string;
  totalUnits: number;
  availableUnits: number;
  developer: string;
}

export interface Unit {
  id: string;
  compoundId: string;
  title: string;
  type: "Villa" | "Apartment" | "Townhouse" | "Duplex" | "Penthouse" | "Studio";
  bua: number; // Built-Up Area in m²
  floor: string;
  price: number;
  pricePerMeter: number;
  status: "Available" | "Reserved" | "Sold" | "Blocked";
  bedrooms: number;
  bathrooms: number;
  parking: number;
  view: string;
  features: string[];
  description: string;
}

// Dummy compounds
const dummyCompounds: Compound[] = [
  {
    id: "compound-1",
    name: "Palm Hills",
    location: "6th of October City, Giza",
    image: "./compounds/palm-hills.png",
    totalUnits: 48,
    availableUnits: 15,
    developer: "Palm Hills Developments",
  },
  {
    id: "compound-2",
    name: "Mountain View",
    location: "New Cairo, Cairo",
    image: "./compounds/mountain-view.png",
    totalUnits: 62,
    availableUnits: 23,
    developer: "Mountain View",
  },
  {
    id: "compound-3",
    name: "Hyde Park",
    location: "New Cairo, Cairo",
    image: "./compounds/hyde-park.png",
    totalUnits: 35,
    availableUnits: 8,
    developer: "Hyde Park Developments",
  },
  {
    id: "compound-4",
    name: "Marassi",
    location: "North Coast, Matrouh",
    image: "./compounds/marassi.png",
    totalUnits: 54,
    availableUnits: 19,
    developer: "Emaar Misr",
  },
  {
    id: "compound-5",
    name: "SODIC East",
    location: "Heliopolis, Cairo",
    image: "./compounds/sodic-east.png",
    totalUnits: 40,
    availableUnits: 11,
    developer: "SODIC",
  },
  {
    id: "compound-6",
    name: "Zed Park",
    location: "Sheikh Zayed, Giza",
    image: "./compounds/zed-park.png",
    totalUnits: 56,
    availableUnits: 20,
    developer: "Ora Developers",
  },
];

// Dummy units for each compound
const dummyUnits: Unit[] = [
  // Palm Hills units
  { id: "PH-A101", compoundId: "compound-1", title: "Villa A-101", type: "Villa", bua: 357, floor: "Ground + 1", price: 12500000, pricePerMeter: 35000, status: "Available", bedrooms: 4, bathrooms: 3, parking: 2, view: "Garden View", features: ["Private Garden", "Smart Home System", "Central A/C"], description: "Luxurious 4-bedroom villa with private garden." },
  { id: "PH-A102", compoundId: "compound-1", title: "Villa A-102", type: "Villa", bua: 320, floor: "Ground + 1", price: 11200000, pricePerMeter: 35000, status: "Reserved", bedrooms: 4, bathrooms: 3, parking: 2, view: "Pool View", features: ["Private Garden", "Central A/C"], description: "Spacious villa overlooking the community pool." },
  { id: "PH-B201", compoundId: "compound-1", title: "Apartment B-201", type: "Apartment", bua: 185, floor: "2nd", price: 5550000, pricePerMeter: 30000, status: "Available", bedrooms: 3, bathrooms: 2, parking: 1, view: "Garden View", features: ["Central A/C", "Built-in Kitchen"], description: "Modern 3-bedroom apartment with garden view." },
  { id: "PH-B302", compoundId: "compound-1", title: "Apartment B-302", type: "Apartment", bua: 150, floor: "3rd", price: 4500000, pricePerMeter: 30000, status: "Available", bedrooms: 2, bathrooms: 2, parking: 1, view: "Street View", features: ["Central A/C"], description: "Cozy 2-bedroom apartment." },
  { id: "PH-C101", compoundId: "compound-1", title: "Townhouse C-101", type: "Townhouse", bua: 250, floor: "Ground + 1", price: 8750000, pricePerMeter: 35000, status: "Sold", bedrooms: 3, bathrooms: 3, parking: 2, view: "Park View", features: ["Private Garden", "Smart Home System"], description: "Corner townhouse with park view." },
  { id: "PH-C102", compoundId: "compound-1", title: "Townhouse C-102", type: "Townhouse", bua: 230, floor: "Ground + 1", price: 8050000, pricePerMeter: 35000, status: "Available", bedrooms: 3, bathrooms: 2, parking: 1, view: "Garden View", features: ["Private Garden"], description: "Mid-row townhouse with garden." },
  { id: "PH-D401", compoundId: "compound-1", title: "Penthouse D-401", type: "Penthouse", bua: 280, floor: "4th", price: 11200000, pricePerMeter: 40000, status: "Blocked", bedrooms: 3, bathrooms: 3, parking: 2, view: "Panoramic View", features: ["Rooftop Terrace", "Smart Home System", "Central A/C"], description: "Stunning penthouse with panoramic views." },
  { id: "PH-B103", compoundId: "compound-1", title: "Apartment B-103", type: "Apartment", bua: 120, floor: "1st", price: 3600000, pricePerMeter: 30000, status: "Available", bedrooms: 2, bathrooms: 1, parking: 1, view: "Garden View", features: ["Central A/C"], description: "Compact 2-bedroom apartment." },
  { id: "PH-E101", compoundId: "compound-1", title: "Duplex E-101", type: "Duplex", bua: 310, floor: "Ground + 1", price: 10850000, pricePerMeter: 35000, status: "Available", bedrooms: 4, bathrooms: 3, parking: 2, view: "Lake View", features: ["Private Garden", "Smart Home System", "Central A/C", "Built-in Kitchen"], description: "Lakefront duplex with premium finishes." },
  { id: "PH-F001", compoundId: "compound-1", title: "Studio F-001", type: "Studio", bua: 55, floor: "Ground", price: 1925000, pricePerMeter: 35000, status: "Available", bedrooms: 0, bathrooms: 1, parking: 0, view: "Street View", features: ["Central A/C"], description: "Compact studio ideal for investment." },

  // Mountain View units
  { id: "MV-A101", compoundId: "compound-2", title: "Apartment A-101", type: "Apartment", bua: 160, floor: "1st", price: 5600000, pricePerMeter: 35000, status: "Available", bedrooms: 3, bathrooms: 2, parking: 1, view: "Pool View", features: ["Central A/C", "Built-in Kitchen"], description: "Modern apartment with pool view." },
  { id: "MV-A205", compoundId: "compound-2", title: "Apartment A-205", type: "Apartment", bua: 130, floor: "2nd", price: 4550000, pricePerMeter: 35000, status: "Available", bedrooms: 2, bathrooms: 2, parking: 1, view: "Garden View", features: ["Central A/C"], description: "Bright 2-bedroom apartment." },
  { id: "MV-B301", compoundId: "compound-2", title: "Duplex B-301", type: "Duplex", bua: 290, floor: "3rd + 4th", price: 10150000, pricePerMeter: 35000, status: "Reserved", bedrooms: 4, bathrooms: 3, parking: 2, view: "City View", features: ["Smart Home System", "Central A/C", "Marble Flooring"], description: "Spacious duplex spanning two floors." },
  { id: "MV-C101", compoundId: "compound-2", title: "Villa C-101", type: "Villa", bua: 400, floor: "Ground + 1", price: 16000000, pricePerMeter: 40000, status: "Available", bedrooms: 5, bathrooms: 4, parking: 3, view: "Golf View", features: ["Private Pool", "Smart Home System", "Central A/C", "Marble Flooring"], description: "Premium villa overlooking the golf course." },
  { id: "MV-A310", compoundId: "compound-2", title: "Apartment A-310", type: "Apartment", bua: 95, floor: "3rd", price: 3325000, pricePerMeter: 35000, status: "Sold", bedrooms: 1, bathrooms: 1, parking: 1, view: "Street View", features: ["Central A/C"], description: "Compact 1-bedroom apartment." },
  { id: "MV-D101", compoundId: "compound-2", title: "Townhouse D-101", type: "Townhouse", bua: 240, floor: "Ground + 1", price: 8400000, pricePerMeter: 35000, status: "Available", bedrooms: 3, bathrooms: 3, parking: 2, view: "Park View", features: ["Private Garden", "Central A/C"], description: "Corner townhouse with lush garden." },
  { id: "MV-E501", compoundId: "compound-2", title: "Penthouse E-501", type: "Penthouse", bua: 310, floor: "5th", price: 13950000, pricePerMeter: 45000, status: "Available", bedrooms: 3, bathrooms: 3, parking: 2, view: "Panoramic View", features: ["Rooftop Terrace", "Private Jacuzzi", "Smart Home System"], description: "Exclusive penthouse with rooftop jacuzzi." },
  { id: "MV-F001", compoundId: "compound-2", title: "Studio F-001", type: "Studio", bua: 60, floor: "Ground", price: 2100000, pricePerMeter: 35000, status: "Available", bedrooms: 0, bathrooms: 1, parking: 0, view: "Courtyard View", features: ["Central A/C"], description: "Modern studio in the heart of the compound." },

  // Hyde Park units
  { id: "HP-A101", compoundId: "compound-3", title: "Villa A-101", type: "Villa", bua: 380, floor: "Ground + 1", price: 15200000, pricePerMeter: 40000, status: "Available", bedrooms: 5, bathrooms: 4, parking: 2, view: "Park View", features: ["Private Garden", "Smart Home System", "Central A/C", "Marble Flooring", "High Ceilings"], description: "Premium villa in the heart of Hyde Park." },
  { id: "HP-B201", compoundId: "compound-3", title: "Apartment B-201", type: "Apartment", bua: 170, floor: "2nd", price: 5950000, pricePerMeter: 35000, status: "Reserved", bedrooms: 3, bathrooms: 2, parking: 1, view: "Garden View", features: ["Central A/C", "Built-in Kitchen"], description: "Well-designed 3-bedroom apartment." },
  { id: "HP-B305", compoundId: "compound-3", title: "Apartment B-305", type: "Apartment", bua: 140, floor: "3rd", price: 4900000, pricePerMeter: 35000, status: "Available", bedrooms: 2, bathrooms: 2, parking: 1, view: "Pool View", features: ["Central A/C"], description: "Pool-facing apartment with balcony." },
  { id: "HP-C101", compoundId: "compound-3", title: "Townhouse C-101", type: "Townhouse", bua: 260, floor: "Ground + 1", price: 9100000, pricePerMeter: 35000, status: "Sold", bedrooms: 4, bathrooms: 3, parking: 2, view: "Street View", features: ["Private Garden", "Central A/C"], description: "Spacious townhouse near the clubhouse." },
  { id: "HP-D401", compoundId: "compound-3", title: "Penthouse D-401", type: "Penthouse", bua: 250, floor: "4th", price: 10000000, pricePerMeter: 40000, status: "Available", bedrooms: 3, bathrooms: 2, parking: 2, view: "City View", features: ["Rooftop Terrace", "Smart Home System", "Central A/C"], description: "City-view penthouse with rooftop access." },
  { id: "HP-E101", compoundId: "compound-3", title: "Duplex E-101", type: "Duplex", bua: 275, floor: "1st + 2nd", price: 9625000, pricePerMeter: 35000, status: "Available", bedrooms: 3, bathrooms: 3, parking: 1, view: "Garden View", features: ["Smart Home System", "Central A/C", "High Ceilings"], description: "Elegant duplex with double-height ceiling." },

  // Marassi units
  { id: "MA-A101", compoundId: "compound-4", title: "Villa A-101", type: "Villa", bua: 450, floor: "Ground + 1", price: 22500000, pricePerMeter: 50000, status: "Available", bedrooms: 5, bathrooms: 5, parking: 3, view: "Sea View", features: ["Private Pool", "Private Beach Access", "Smart Home System", "Central A/C", "Marble Flooring"], description: "Beachfront villa with private pool and sea view." },
  { id: "MA-B201", compoundId: "compound-4", title: "Chalet B-201", type: "Apartment", bua: 120, floor: "2nd", price: 4800000, pricePerMeter: 40000, status: "Available", bedrooms: 2, bathrooms: 1, parking: 1, view: "Sea View", features: ["Central A/C", "Furnished"], description: "Cozy sea-view chalet." },
  { id: "MA-B305", compoundId: "compound-4", title: "Chalet B-305", type: "Apartment", bua: 150, floor: "3rd", price: 6000000, pricePerMeter: 40000, status: "Reserved", bedrooms: 3, bathrooms: 2, parking: 1, view: "Pool View", features: ["Central A/C", "Furnished"], description: "Spacious chalet overlooking the lagoon." },
  { id: "MA-C101", compoundId: "compound-4", title: "Townhouse C-101", type: "Townhouse", bua: 280, floor: "Ground + 1", price: 14000000, pricePerMeter: 50000, status: "Available", bedrooms: 4, bathrooms: 3, parking: 2, view: "Sea View", features: ["Private Garden", "Sea View", "Central A/C"], description: "Seaside townhouse with garden." },
  { id: "MA-D501", compoundId: "compound-4", title: "Penthouse D-501", type: "Penthouse", bua: 200, floor: "5th", price: 10000000, pricePerMeter: 50000, status: "Available", bedrooms: 2, bathrooms: 2, parking: 1, view: "Panoramic Sea View", features: ["Rooftop Terrace", "Smart Home System", "Central A/C"], description: "Top-floor penthouse with panoramic sea view." },
  { id: "MA-E001", compoundId: "compound-4", title: "Studio E-001", type: "Studio", bua: 65, floor: "Ground", price: 2925000, pricePerMeter: 45000, status: "Sold", bedrooms: 0, bathrooms: 1, parking: 0, view: "Garden View", features: ["Central A/C", "Furnished"], description: "Fully furnished ground floor studio." },

  // SODIC East units
  { id: "SE-A101", compoundId: "compound-5", title: "Villa A-101", type: "Villa", bua: 330, floor: "Ground + 1", price: 14850000, pricePerMeter: 45000, status: "Available", bedrooms: 4, bathrooms: 4, parking: 2, view: "Garden View", features: ["Private Garden", "Smart Home System", "Central A/C", "High Ceilings"], description: "Modern villa with smart home features." },
  { id: "SE-B201", compoundId: "compound-5", title: "Apartment B-201", type: "Apartment", bua: 165, floor: "2nd", price: 5775000, pricePerMeter: 35000, status: "Available", bedrooms: 3, bathrooms: 2, parking: 1, view: "Pool View", features: ["Central A/C", "Built-in Kitchen"], description: "Contemporary apartment facing the pool." },
  { id: "SE-B305", compoundId: "compound-5", title: "Apartment B-305", type: "Apartment", bua: 110, floor: "3rd", price: 3850000, pricePerMeter: 35000, status: "Reserved", bedrooms: 2, bathrooms: 1, parking: 1, view: "Street View", features: ["Central A/C"], description: "Compact 2-bedroom in prime location." },
  { id: "SE-C101", compoundId: "compound-5", title: "Duplex C-101", type: "Duplex", bua: 300, floor: "Ground + 1", price: 13500000, pricePerMeter: 45000, status: "Available", bedrooms: 4, bathrooms: 3, parking: 2, view: "Park View", features: ["Private Garden", "Smart Home System", "Central A/C", "Marble Flooring"], description: "Park-facing duplex with private garden." },
  { id: "SE-D401", compoundId: "compound-5", title: "Penthouse D-401", type: "Penthouse", bua: 220, floor: "4th", price: 9900000, pricePerMeter: 45000, status: "Blocked", bedrooms: 3, bathrooms: 2, parking: 2, view: "Panoramic View", features: ["Rooftop Terrace", "Central A/C"], description: "Penthouse with 360-degree views." },
  { id: "SE-E101", compoundId: "compound-5", title: "Townhouse E-101", type: "Townhouse", bua: 210, floor: "Ground + 1", price: 7350000, pricePerMeter: 35000, status: "Available", bedrooms: 3, bathrooms: 2, parking: 1, view: "Garden View", features: ["Private Garden", "Central A/C"], description: "Charming townhouse with green surroundings." },

  // Zed Park units
  { id: "ZP-A101", compoundId: "compound-6", title: "Villa A-101", type: "Villa", bua: 420, floor: "Ground + 1", price: 18900000, pricePerMeter: 45000, status: "Available", bedrooms: 5, bathrooms: 4, parking: 3, view: "Lake View", features: ["Private Pool", "Smart Home System", "Central A/C", "Marble Flooring", "High Ceilings"], description: "Stunning lakeside villa with private pool." },
  { id: "ZP-B201", compoundId: "compound-6", title: "Apartment B-201", type: "Apartment", bua: 175, floor: "2nd", price: 6125000, pricePerMeter: 35000, status: "Available", bedrooms: 3, bathrooms: 2, parking: 1, view: "Lake View", features: ["Central A/C", "Built-in Kitchen", "Balcony"], description: "Lakeside apartment with spacious balcony." },
  { id: "ZP-B304", compoundId: "compound-6", title: "Apartment B-304", type: "Apartment", bua: 135, floor: "3rd", price: 4725000, pricePerMeter: 35000, status: "Sold", bedrooms: 2, bathrooms: 2, parking: 1, view: "Park View", features: ["Central A/C"], description: "Park-facing apartment on the 3rd floor." },
  { id: "ZP-C101", compoundId: "compound-6", title: "Townhouse C-101", type: "Townhouse", bua: 270, floor: "Ground + 1", price: 10800000, pricePerMeter: 40000, status: "Available", bedrooms: 4, bathrooms: 3, parking: 2, view: "Garden View", features: ["Private Garden", "Central A/C", "Smart Home System"], description: "Premium townhouse with private garden." },
  { id: "ZP-D501", compoundId: "compound-6", title: "Penthouse D-501", type: "Penthouse", bua: 340, floor: "5th", price: 17000000, pricePerMeter: 50000, status: "Available", bedrooms: 4, bathrooms: 3, parking: 2, view: "Panoramic Lake View", features: ["Rooftop Terrace", "Private Jacuzzi", "Smart Home System", "Central A/C"], description: "Ultra-luxury penthouse with private jacuzzi." },
  { id: "ZP-E101", compoundId: "compound-6", title: "Duplex E-101", type: "Duplex", bua: 285, floor: "1st + 2nd", price: 11400000, pricePerMeter: 40000, status: "Reserved", bedrooms: 3, bathrooms: 3, parking: 2, view: "Lake View", features: ["Smart Home System", "Central A/C", "High Ceilings"], description: "Lakeside duplex with high ceilings." },
  { id: "ZP-F001", compoundId: "compound-6", title: "Studio F-001", type: "Studio", bua: 50, floor: "Ground", price: 2000000, pricePerMeter: 40000, status: "Available", bedrooms: 0, bathrooms: 1, parking: 0, view: "Courtyard View", features: ["Central A/C", "Furnished"], description: "Furnished studio in a prime spot." },
];

export interface UnitFilters {
  type: string[];
  status: string[];
  floor: string[];
  view: string[];
  bedroomsMin: number | null;
  bedroomsMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  buaMin: number | null;
  buaMax: number | null;
  search: string;
}

const defaultFilters: UnitFilters = {
  type: [],
  status: [],
  floor: [],
  view: [],
  bedroomsMin: null,
  bedroomsMax: null,
  priceMin: null,
  priceMax: null,
  buaMin: null,
  buaMax: null,
  search: "",
};

export interface CompoundFilters {
  search: string;
  location: string[];
  developer: string[];
}

const defaultCompoundFilters: CompoundFilters = {
  search: "",
  location: [],
  developer: [],
};

interface CompoundsStore {
  compounds: Compound[];
  units: Unit[];
  selectedUnitIds: string[];
  filters: UnitFilters;
  compoundFilters: CompoundFilters;

  getCompoundById: (id: string) => Compound | undefined;
  getUnitById: (id: string) => Unit | undefined;
  getUnitsByCompound: (compoundId: string) => Unit[];
  getFilteredUnits: (compoundId: string) => Unit[];
  getFilteredCompounds: () => Compound[];
  activeFiltersCount: () => number;

  toggleUnitSelection: (unitId: string) => void;
  selectAllUnits: (unitIds: string[]) => void;
  clearSelection: () => void;

  setFilter: (key: keyof UnitFilters, value: unknown) => void;
  resetFilters: () => void;
  toggleFilterArrayValue: (key: "type" | "status" | "floor" | "view", value: string) => void;

  setCompoundFilter: (key: keyof CompoundFilters, value: unknown) => void;
  resetCompoundFilters: () => void;
  toggleCompoundFilterArrayValue: (key: "location" | "developer", value: string) => void;
}

export const useCompoundsStore = create<CompoundsStore>((set, get) => ({
  compounds: dummyCompounds,
  units: dummyUnits,
  selectedUnitIds: [],
  filters: { ...defaultFilters },
  compoundFilters: { ...defaultCompoundFilters },

  getCompoundById: (id) => get().compounds.find((c) => c.id === id),

  getUnitById: (id) => get().units.find((u) => u.id === id),

  getUnitsByCompound: (compoundId) => get().units.filter((u) => u.compoundId === compoundId),

  getFilteredUnits: (compoundId) => {
    const { units, filters } = get();
    let result = units.filter((u) => u.compoundId === compoundId);

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((u) => u.id.toLowerCase().includes(s) || u.title.toLowerCase().includes(s) || u.type.toLowerCase().includes(s));
    }
    if (filters.type.length > 0) {
      result = result.filter((u) => filters.type.includes(u.type));
    }
    if (filters.status.length > 0) {
      result = result.filter((u) => filters.status.includes(u.status));
    }
    if (filters.floor.length > 0) {
      result = result.filter((u) => filters.floor.includes(u.floor));
    }
    if (filters.view.length > 0) {
      result = result.filter((u) => filters.view.includes(u.view));
    }
    if (filters.bedroomsMin !== null) {
      result = result.filter((u) => u.bedrooms >= filters.bedroomsMin!);
    }
    if (filters.bedroomsMax !== null) {
      result = result.filter((u) => u.bedrooms <= filters.bedroomsMax!);
    }
    if (filters.priceMin !== null) {
      result = result.filter((u) => u.price >= filters.priceMin!);
    }
    if (filters.priceMax !== null) {
      result = result.filter((u) => u.price <= filters.priceMax!);
    }
    if (filters.buaMin !== null) {
      result = result.filter((u) => u.bua >= filters.buaMin!);
    }
    if (filters.buaMax !== null) {
      result = result.filter((u) => u.bua <= filters.buaMax!);
    }

    return result;
  },

  getFilteredCompounds: () => {
    const { compounds, units, compoundFilters, filters } = get();
    let result = [...compounds];

    // Search by compound name
    if (compoundFilters.search) {
      const s = compoundFilters.search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(s) || c.developer.toLowerCase().includes(s));
    }

    // Filter by location
    if (compoundFilters.location.length > 0) {
      result = result.filter((c) => compoundFilters.location.some((loc) => c.location.includes(loc)));
    }

    // Filter by developer
    if (compoundFilters.developer.length > 0) {
      result = result.filter((c) => compoundFilters.developer.includes(c.developer));
    }

    // Filter compounds by unit-level filters (property type, bedrooms)
    // Show only compounds that have at least one unit matching these criteria
    if (filters.type.length > 0) {
      result = result.filter((c) => units.some((u) => u.compoundId === c.id && filters.type.includes(u.type)));
    }
    if (filters.bedroomsMin !== null) {
      result = result.filter((c) => units.some((u) => u.compoundId === c.id && u.bedrooms >= filters.bedroomsMin!));
    }
    if (filters.bedroomsMax !== null) {
      result = result.filter((c) => units.some((u) => u.compoundId === c.id && u.bedrooms <= filters.bedroomsMax!));
    }

    return result;
  },

  activeFiltersCount: () => {
    const { filters, compoundFilters } = get();
    let count = 0;
    if (compoundFilters.search) count++;
    count += compoundFilters.location.length;
    count += compoundFilters.developer.length;
    count += filters.type.length;
    if (filters.bedroomsMin !== null) count++;
    if (filters.bedroomsMax !== null) count++;
    if (filters.priceMin !== null) count++;
    if (filters.priceMax !== null) count++;
    return count;
  },

  toggleUnitSelection: (unitId) => {
    set((state) => ({
      selectedUnitIds: state.selectedUnitIds.includes(unitId) ? state.selectedUnitIds.filter((id) => id !== unitId) : [...state.selectedUnitIds, unitId],
    }));
  },

  selectAllUnits: (unitIds) => {
    set((state) => {
      const allSelected = unitIds.every((id) => state.selectedUnitIds.includes(id));
      return {
        selectedUnitIds: allSelected ? state.selectedUnitIds.filter((id) => !unitIds.includes(id)) : [...new Set([...state.selectedUnitIds, ...unitIds])],
      };
    });
  },

  clearSelection: () => set({ selectedUnitIds: [] }),

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  toggleFilterArrayValue: (key, value) => {
    set((state) => {
      const arr = state.filters[key] as string[];
      return {
        filters: {
          ...state.filters,
          [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
        },
      };
    });
  },

  setCompoundFilter: (key, value) => {
    set((state) => ({
      compoundFilters: { ...state.compoundFilters, [key]: value },
    }));
  },

  resetCompoundFilters: () => set({ compoundFilters: { ...defaultCompoundFilters } }),

  toggleCompoundFilterArrayValue: (key, value) => {
    set((state) => {
      const arr = state.compoundFilters[key] as string[];
      return {
        compoundFilters: {
          ...state.compoundFilters,
          [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
        },
      };
    });
  },
}));
