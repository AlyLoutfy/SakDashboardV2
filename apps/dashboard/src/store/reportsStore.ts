import { create } from "zustand";

export type DataSource = "units" | "reservations" | "leads" | "sales";

export interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string | number | string[];
}

export interface Column {
  id: string;
  label: string;
  visible: boolean;
}

export interface ReportState {
  selectedDataSource: DataSource;
  filters: Filter[];
  columns: Column[];
  isLoading: boolean;

  // Actions
  setDataSource: (source: DataSource) => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (id: string) => void;
  updateFilter: (id: string, updates: Partial<Filter>) => void;
  toggleColumn: (id: string) => void;
  renameColumn: (id: string, newLabel: string) => void;
  setColumns: (columns: Column[]) => void;
  reset: () => void;
}

// Initial columns config per data source
export const DEFAULT_COLUMNS: Record<DataSource, Column[]> = {
  units: [
    { id: "unit_code", label: "Unit Code", visible: true },
    { id: "compound", label: "Compound", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "area", label: "Area (m²)", visible: true },
    { id: "price", label: "Price", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "floor", label: "Floor", visible: false },
    { id: "view", label: "View", visible: false },
  ],
  reservations: [
    { id: "id", label: "Reservation ID", visible: true },
    { id: "client_name", label: "Client Name", visible: true },
    { id: "unit_code", label: "Unit", visible: true },
    { id: "date", label: "Date", visible: true },
    { id: "amount", label: "Amount", visible: true },
    { id: "salesperson", label: "Salesperson", visible: true },
    { id: "status", label: "Status", visible: true },
  ],
  leads: [
    { id: "name", label: "Name", visible: true },
    { id: "phone", label: "Phone", visible: true },
    { id: "email", label: "Email", visible: true },
    { id: "source", label: "Source", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "assigned_to", label: "Assigned To", visible: true },
    { id: "created_at", label: "Created At", visible: false },
  ],
  sales: [
    { id: "contract_id", label: "Contract ID", visible: true },
    { id: "client", label: "Client", visible: true },
    { id: "unit", label: "Unit", visible: true },
    { id: "total_value", label: "Total Value", visible: true },
    { id: "paid_amount", label: "Paid Amount", visible: true },
    { id: "contract_date", label: "Contract Date", visible: true },
  ],
};

// @ts-ignore
export const useReportsStore = create<ReportState>((set) => ({
  selectedDataSource: "units",
  filters: [],
  columns: DEFAULT_COLUMNS.units,
  isLoading: false,

  setDataSource: (source: DataSource) =>
    set({
      selectedDataSource: source,
      columns: DEFAULT_COLUMNS[source],
      filters: [], // Reset filters when changing source
    }),

  addFilter: (filter: Filter) =>
    set((state: ReportState) => ({
      filters: [...state.filters, filter],
    })),

  removeFilter: (id: string) =>
    set((state: ReportState) => ({
      filters: state.filters.filter((f: Filter) => f.id !== id),
    })),

  updateFilter: (id: string, updates: Partial<Filter>) =>
    set((state: ReportState) => ({
      filters: state.filters.map((f: Filter) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  toggleColumn: (id: string) =>
    set((state: ReportState) => ({
      columns: state.columns.map((col: Column) => (col.id === id ? { ...col, visible: !col.visible } : col)),
    })),

  renameColumn: (id: string, newLabel: string) =>
    set((state: ReportState) => ({
      columns: state.columns.map((col: Column) => (col.id === id ? { ...col, label: newLabel } : col)),
    })),

  setColumns: (columns: Column[]) => set({ columns }),

  reset: () =>
    set({
      selectedDataSource: "units",
      filters: [],
      columns: DEFAULT_COLUMNS.units,
    }),
}));
