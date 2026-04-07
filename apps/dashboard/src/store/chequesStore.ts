import { create } from "zustand";

// Types
export type ChequeStatus = "collected" | "pending" | "overdue" | "bounced" | "post_dated";
export type ChequeType = "down_payment" | "installment" | "maintenance" | "balloon" | "booking" | "finishing" | "parking" | "club_membership" | "other";
// Category is a free string so new collection types can be added dynamically
export type PaymentCategory = string;

export interface StatusChange {
  from: ChequeStatus;
  to: ChequeStatus;
  date: string;
  note: string;
}

export interface Cheque {
  id: string;
  chequeNumber: string;
  clientId: string;
  clientName: string;
  unitCode: string;
  compound: string;
  amount: number;
  dueDate: string;
  collectedDate: string | null;
  status: ChequeStatus;
  type: ChequeType;
  category: PaymentCategory;
  bank: string;
  notes: string;
  paymentPlanId: string | null;
  statusHistory: StatusChange[];
}

export interface CategoryBreakdown {
  category: string;
  label: string;
  total: number;
  paid: number;
  remaining: number;
}

export interface UnitInfo {
  unitCode: string;
  compound: string;
}

export interface ClientSummary {
  clientId: string;
  clientName: string;
  unitCode: string;   // primary unit (first)
  compound: string;    // primary compound
  units: UnitInfo[];   // all units this client has
  categories: CategoryBreakdown[];
  totalCheques: number;
  collectedCheques: number;
  pendingCheques: number;
  overdueCheques: number;
  bouncedCheques: number;
  nextDueDate: string | null;
  nextDueAmount: number;
}

// --- Pending Confirmation (post-contract, pre-cheque-entry) ---

export interface DraftInstallment {
  id: string;
  chequeNumber: string;       // must be filled before confirm
  amount: number;
  dueDate: string;
  type: ChequeType;
  category: string;
  bank: string;
  notes: string;
}

export interface PendingConfirmation {
  id: string;
  clientName: string;
  clientId: string;
  unitCode: string;
  compound: string;
  contractDate: string;
  paymentPlanName: string;
  unitPrice: number;
  installments: DraftInstallment[];
  createdAt: string;
}

export type FilterStatus = "all" | ChequeStatus;
export type FilterType = string; // "all" or any ChequeType
export type FilterCategory = string; // "all" or any category string

interface ChequesState {
  cheques: Cheque[];
  filterStatus: FilterStatus;
  filterType: FilterType;
  filterCategory: FilterCategory;
  filterCompound: string;
  filterSearch: string;
  filterDateRange: { from: string | null; to: string | null };
  selectedChequeId: string | null;
  expandedClientId: string | null;

  // Drawer state
  isDrawerOpen: boolean;

  // Pending confirmations
  pendingConfirmations: PendingConfirmation[];

  // Actions
  setFilterStatus: (status: FilterStatus) => void;
  setFilterType: (type: FilterType) => void;
  setFilterCategory: (category: FilterCategory) => void;
  setFilterCompound: (compound: string) => void;
  setFilterSearch: (search: string) => void;
  setFilterDateRange: (range: { from: string | null; to: string | null }) => void;
  setSelectedCheque: (id: string | null) => void;
  setExpandedClient: (id: string | null) => void;
  markAsCollected: (id: string) => void;
  markAsBounced: (id: string) => void;
  addNote: (id: string, note: string) => void;
  bulkMarkAsCollected: (ids: string[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  addCheques: (cheques: Omit<Cheque, "id">[]) => void;
  addPendingConfirmation: (pending: PendingConfirmation) => void;
  updatePendingInstallments: (pendingId: string, installments: DraftInstallment[]) => void;
  confirmPending: (pendingId: string) => void;
  removePending: (pendingId: string) => void;

  // Derived
  getFilteredCheques: () => Cheque[];
  getClientSummaries: () => ClientSummary[];
  getUpcomingDue: (days: number) => Cheque[];
  getOverdueAging: () => { bucket: string; days: [number, number | null]; cheques: Cheque[] }[];
  getOverallStats: () => {
    totalCheques: number;
    totalValue: number;
    collectedCount: number;
    collectedValue: number;
    pendingCount: number;
    pendingValue: number;
    overdueCount: number;
    overdueValue: number;
    bouncedCount: number;
    bouncedValue: number;
    postDatedCount: number;
    postDatedValue: number;
    collectionRate: number;
    categoryBreakdowns: CategoryBreakdown[];
    dueNext7Days: number;
    dueNext7DaysValue: number;
    dueNext30Days: number;
    dueNext30DaysValue: number;
  };
  getCompounds: () => string[];
  getCategories: () => string[];
  getMonthlyCashFlow: () => { month: string; key: string; expected: number; collected: number; collectedByDate: number }[];
}

const TODAY = "2026-04-06";

// --- Mock data generator for realistic 6-10 year quarterly plans ---

interface ExtraCollection {
  category: string;        // e.g. "finishing", "parking", "club_membership"
  type: ChequeType;        // matching ChequeType
  label: string;           // display label
  totalAmount: number;     // total due
  installments: number;    // how many cheques to split into
  startDate: string;       // when first cheque is due
  gapMonths: number;       // months between cheques (3 = quarterly)
}

interface ClientDef {
  clientId: string;
  clientName: string;
  unitCode: string;
  compound: string;
  bank: string;
  unitPrice: number;
  downPaymentPct: number;    // % of unit price
  years: number;             // plan duration in years
  startDate: string;         // YYYY-MM-DD when plan started
  annualMaintenance: number;
  extraCollections?: ExtraCollection[];
  // overrides for special cases
  bouncedQuarters?: number[];   // 1-based quarter index that bounced
  overdueQuarters?: number[];   // 1-based quarter index currently overdue
  notes?: Record<number, string>; // index -> note
}

const CLIENT_DEFS: ClientDef[] = [
  {
    clientId: "cli-001", clientName: "Ahmed Hassan", unitCode: "A-101",
    compound: "Nile View Residences", bank: "CIB",
    unitPrice: 5_000_000, downPaymentPct: 15, years: 8,
    startDate: "2024-01-15", annualMaintenance: 25_000,
    extraCollections: [
      { category: "finishing", type: "finishing", label: "Finishing", totalAmount: 350_000, installments: 4, startDate: "2025-01-01", gapMonths: 3 },
      { category: "parking", type: "parking", label: "Parking", totalAmount: 120_000, installments: 2, startDate: "2025-06-01", gapMonths: 6 },
    ],
  },
  {
    clientId: "cli-001", clientName: "Ahmed Hassan", unitCode: "A-204",
    compound: "Nile View Residences", bank: "CIB",
    unitPrice: 3_200_000, downPaymentPct: 10, years: 6,
    startDate: "2025-03-01", annualMaintenance: 18_000,
  },
  {
    clientId: "cli-002", clientName: "Sara Mohamed", unitCode: "B-205",
    compound: "Nile View Residences", bank: "NBE",
    unitPrice: 3_400_000, downPaymentPct: 10, years: 7,
    startDate: "2024-07-10", annualMaintenance: 18_000,
  },
  {
    clientId: "cli-003", clientName: "Khaled Mostafa", unitCode: "C-310",
    compound: "Palm Hills Gardens", bank: "Banque Misr",
    unitPrice: 8_200_000, downPaymentPct: 20, years: 10,
    startDate: "2023-04-01", annualMaintenance: 35_000,
    extraCollections: [
      { category: "finishing", type: "finishing", label: "Finishing", totalAmount: 520_000, installments: 4, startDate: "2024-07-01", gapMonths: 3 },
      { category: "club_membership", type: "club_membership", label: "Club Membership", totalAmount: 180_000, installments: 3, startDate: "2024-01-01", gapMonths: 6 },
      { category: "parking", type: "parking", label: "Parking", totalAmount: 200_000, installments: 2, startDate: "2024-04-01", gapMonths: 6 },
    ],
    bouncedQuarters: [10], // Q10 bounced
    notes: { 10: "Insufficient funds - replacement cheque pending" },
  },
  {
    clientId: "cli-003", clientName: "Khaled Mostafa", unitCode: "C-415",
    compound: "Palm Hills Gardens", bank: "Banque Misr",
    unitPrice: 2_800_000, downPaymentPct: 15, years: 6,
    startDate: "2025-01-01", annualMaintenance: 15_000,
  },
  {
    clientId: "cli-004", clientName: "Nadia El-Sayed", unitCode: "D-102",
    compound: "Palm Hills Gardens", bank: "QNB",
    unitPrice: 4_500_000, downPaymentPct: 12, years: 6,
    startDate: "2025-01-01", annualMaintenance: 20_000,
    extraCollections: [
      { category: "finishing", type: "finishing", label: "Finishing", totalAmount: 280_000, installments: 4, startDate: "2025-07-01", gapMonths: 3 },
    ],
    overdueQuarters: [5], // Q5 overdue (due 2026-04-01)
    notes: { 5: "Client requested 2-week extension" },
  },
  {
    clientId: "cli-005", clientName: "Omar Farouk", unitCode: "E-501",
    compound: "Sunset Bay", bank: "HSBC",
    unitPrice: 6_800_000, downPaymentPct: 15, years: 8,
    startDate: "2022-10-01", annualMaintenance: 30_000,
    extraCollections: [
      { category: "finishing", type: "finishing", label: "Finishing", totalAmount: 400_000, installments: 4, startDate: "2023-10-01", gapMonths: 3 },
      { category: "parking", type: "parking", label: "Parking", totalAmount: 150_000, installments: 2, startDate: "2024-01-01", gapMonths: 6 },
    ],
  },
  {
    clientId: "cli-006", clientName: "Fatma Ali", unitCode: "F-203",
    compound: "Sunset Bay", bank: "Alex Bank",
    unitPrice: 2_900_000, downPaymentPct: 10, years: 6,
    startDate: "2025-04-12", annualMaintenance: 15_000,
  },
  {
    clientId: "cli-007", clientName: "Hassan El-Din", unitCode: "G-107",
    compound: "Nile View Residences", bank: "CIB",
    unitPrice: 3_600_000, downPaymentPct: 12, years: 7,
    startDate: "2025-01-18", annualMaintenance: 19_000,
  },
];

function addMonthsToDate(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function generateClientCheques(def: ClientDef): Cheque[] {
  const cheques: Cheque[] = [];
  let idCounter = 0;
  const unitSlug = def.unitCode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const prefix = `CHQ-${def.clientId.replace("cli-", "")}-${unitSlug}`;

  const downPayment = Math.round(def.unitPrice * def.downPaymentPct / 100);
  const remaining = def.unitPrice - downPayment;
  const totalQuarters = def.years * 4;
  const quarterlyAmount = Math.round(remaining / totalQuarters);
  // Fix rounding on last installment
  const lastQuarterlyAmount = remaining - quarterlyAmount * (totalQuarters - 1);

  // 1) Down payment cheque
  const dpStatus: ChequeStatus = new Date(def.startDate) < new Date(TODAY) ? "collected" : "post_dated";
  cheques.push({
    id: `${def.clientId}-${unitSlug}-dp`,
    chequeNumber: `${prefix}-${String(++idCounter).padStart(3, "0")}`,
    clientId: def.clientId,
    clientName: def.clientName,
    unitCode: def.unitCode,
    compound: def.compound,
    amount: downPayment,
    dueDate: def.startDate,
    collectedDate: dpStatus === "collected" ? def.startDate : null,
    status: dpStatus,
    type: "down_payment",
    category: "property",
    bank: def.bank,
    notes: "",
    paymentPlanId: null,
    statusHistory: [],
  });

  // 2) Quarterly installments (starting 3 months after start)
  for (let q = 1; q <= totalQuarters; q++) {
    const dueDate = addMonthsToDate(def.startDate, q * 3);
    const amount = q === totalQuarters ? lastQuarterlyAmount : quarterlyAmount;
    const dueDateObj = new Date(dueDate);
    const todayObj = new Date(TODAY);

    let status: ChequeStatus;
    let collectedDate: string | null = null;
    let note = "";

    if (def.bouncedQuarters?.includes(q)) {
      status = "bounced";
      note = def.notes?.[q] || "Bounced - insufficient funds";
    } else if (def.overdueQuarters?.includes(q)) {
      status = "overdue";
      note = def.notes?.[q] || "";
    } else if (dueDateObj < todayObj) {
      // Past due date — collected
      status = "collected";
      // Collected ~1-3 days after due date
      const cd = new Date(dueDateObj);
      cd.setDate(cd.getDate() + Math.floor(Math.random() * 3));
      collectedDate = cd.toISOString().slice(0, 10);
    } else if (dueDateObj.getTime() - todayObj.getTime() < 14 * 24 * 60 * 60 * 1000) {
      // Due within 14 days — pending
      status = "pending";
    } else {
      status = "post_dated";
    }

    cheques.push({
      id: `${def.clientId}-${unitSlug}-q${String(q).padStart(2, "0")}`,
      chequeNumber: `${prefix}-${String(++idCounter).padStart(3, "0")}`,
      clientId: def.clientId,
      clientName: def.clientName,
      unitCode: def.unitCode,
      compound: def.compound,
      amount,
      dueDate,
      collectedDate,
      status,
      type: "installment",
      category: "property",
      bank: def.bank,
      notes: note,
      paymentPlanId: null,
      statusHistory: [],
    });
  }

  // 3) Annual maintenance cheques (one per year from the start year)
  const startYear = new Date(def.startDate).getFullYear();
  const endYear = startYear + def.years;

  for (let year = startYear; year <= endYear; year++) {
    const maintDate = `${year}-01-01`;
    const maintDateObj = new Date(maintDate);
    const todayObj = new Date(TODAY);

    let status: ChequeStatus;
    let collectedDate: string | null = null;

    if (maintDateObj < todayObj) {
      status = "collected";
      const cd = new Date(maintDateObj);
      cd.setDate(cd.getDate() + Math.floor(Math.random() * 5));
      collectedDate = cd.toISOString().slice(0, 10);
    } else {
      status = "post_dated";
    }

    cheques.push({
      id: `${def.clientId}-${unitSlug}-m${year}`,
      chequeNumber: `${prefix}-M${String(year).slice(-2)}`,
      clientId: def.clientId,
      clientName: def.clientName,
      unitCode: def.unitCode,
      compound: def.compound,
      amount: def.annualMaintenance,
      dueDate: maintDate,
      collectedDate,
      status,
      type: "maintenance",
      category: "maintenance",
      bank: def.bank,
      notes: `Maintenance ${year}`,
      paymentPlanId: null,
      statusHistory: [],
    });
  }

  // 4) Extra collections (finishing, parking, club membership, etc.)
  if (def.extraCollections) {
    for (const extra of def.extraCollections) {
      const perCheque = Math.round(extra.totalAmount / extra.installments);
      const lastChequeAmount = extra.totalAmount - perCheque * (extra.installments - 1);
      const shortCode = extra.category.charAt(0).toUpperCase();

      for (let i = 0; i < extra.installments; i++) {
        const dueDate = addMonthsToDate(extra.startDate, i * extra.gapMonths);
        const amount = i === extra.installments - 1 ? lastChequeAmount : perCheque;
        const dueDateObj = new Date(dueDate);
        const todayObj = new Date(TODAY);

        let status: ChequeStatus;
        let collectedDate: string | null = null;

        if (dueDateObj < todayObj) {
          status = "collected";
          const cd = new Date(dueDateObj);
          cd.setDate(cd.getDate() + Math.floor(Math.random() * 3));
          collectedDate = cd.toISOString().slice(0, 10);
        } else if (dueDateObj.getTime() - todayObj.getTime() < 14 * 24 * 60 * 60 * 1000) {
          status = "pending";
        } else {
          status = "post_dated";
        }

        cheques.push({
          id: `${def.clientId}-${unitSlug}-${extra.category}-${i + 1}`,
          chequeNumber: `${prefix}-${shortCode}${String(i + 1).padStart(2, "0")}`,
          clientId: def.clientId,
          clientName: def.clientName,
          unitCode: def.unitCode,
          compound: def.compound,
          amount,
          dueDate,
          collectedDate,
          status,
          type: extra.type,
          category: extra.category,
          bank: def.bank,
          notes: "",
          paymentPlanId: null,
          statusHistory: [],
        });
      }
    }
  }

  return cheques;
}

const MOCK_CHEQUES: Cheque[] = CLIENT_DEFS.flatMap(generateClientCheques);

// --- Mock pending confirmations (clients who just signed contracts) ---

function generateDraftId() {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateDraftInstallments(
  unitPrice: number,
  downPaymentPct: number,
  years: number,
  startDate: string,
  annualMaintenance: number,
): DraftInstallment[] {
  const installments: DraftInstallment[] = [];
  const dp = Math.round(unitPrice * downPaymentPct / 100);
  const remaining = unitPrice - dp;
  const totalQ = years * 4;
  const qAmount = Math.round(remaining / totalQ);
  const lastQ = remaining - qAmount * (totalQ - 1);

  // Down payment
  installments.push({
    id: generateDraftId(),
    chequeNumber: "",
    amount: dp,
    dueDate: startDate,
    type: "down_payment",
    category: "property",
    bank: "",
    notes: "",
  });

  // Quarterly installments
  for (let i = 1; i <= totalQ; i++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i * 3);
    installments.push({
      id: generateDraftId(),
      chequeNumber: "",
      amount: i === totalQ ? lastQ : qAmount,
      dueDate: d.toISOString().slice(0, 10),
      type: "installment",
      category: "property",
      bank: "",
      notes: "",
    });
  }

  // Annual maintenance
  const startYear = new Date(startDate).getFullYear();
  for (let y = 0; y <= years; y++) {
    installments.push({
      id: generateDraftId(),
      chequeNumber: "",
      amount: annualMaintenance,
      dueDate: `${startYear + y}-01-01`,
      type: "maintenance",
      category: "maintenance",
      bank: "",
      notes: "",
    });
  }

  return installments;
}

const MOCK_PENDING: PendingConfirmation[] = [
  {
    id: "pend-001",
    clientName: "Youssef Kamal",
    clientId: "cli-pending-001",
    unitCode: "G-401",
    compound: "Nile View Residences",
    contractDate: "2026-04-03",
    paymentPlanName: "Standard 8-Year Plan",
    unitPrice: 4_200_000,
    installments: generateDraftInstallments(4_200_000, 15, 8, "2026-04-15", 22_000),
    createdAt: "2026-04-03",
  },
  {
    id: "pend-002",
    clientName: "Mona Rashid",
    clientId: "cli-pending-002",
    unitCode: "H-108",
    compound: "Palm Hills Gardens",
    contractDate: "2026-04-05",
    paymentPlanName: "Premium 10-Year Plan",
    unitPrice: 7_500_000,
    installments: generateDraftInstallments(7_500_000, 20, 10, "2026-05-01", 32_000),
    createdAt: "2026-04-05",
  },
  {
    id: "pend-003",
    clientName: "Tarek Ibrahim",
    clientId: "cli-pending-003",
    unitCode: "J-305",
    compound: "Sunset Bay",
    contractDate: "2026-04-06",
    paymentPlanName: "Standard 6-Year Plan",
    unitPrice: 3_100_000,
    installments: generateDraftInstallments(3_100_000, 10, 6, "2026-04-20", 16_000),
    createdAt: "2026-04-06",
  },
  {
    id: "pend-004",
    clientName: "Layla Mansour",
    clientId: "cli-pending-004",
    unitCode: "A-512",
    compound: "Nile View Residences",
    contractDate: "2026-04-04",
    paymentPlanName: "Standard 8-Year Plan",
    unitPrice: 5_800_000,
    installments: generateDraftInstallments(5_800_000, 15, 8, "2026-05-10", 28_000),
    createdAt: "2026-04-04",
  },
  {
    id: "pend-005",
    clientName: "Hassan El-Naggar",
    clientId: "cli-pending-005",
    unitCode: "B-310",
    compound: "Palm Hills Gardens",
    contractDate: "2026-04-02",
    paymentPlanName: "Premium 10-Year Plan",
    unitPrice: 9_200_000,
    installments: generateDraftInstallments(9_200_000, 20, 10, "2026-04-25", 40_000),
    createdAt: "2026-04-02",
  },
  {
    id: "pend-006",
    clientName: "Dina Soliman",
    clientId: "cli-pending-006",
    unitCode: "F-107",
    compound: "Sunset Bay",
    contractDate: "2026-04-05",
    paymentPlanName: "Standard 6-Year Plan",
    unitPrice: 2_750_000,
    installments: generateDraftInstallments(2_750_000, 10, 6, "2026-05-01", 14_000),
    createdAt: "2026-04-05",
  },
  {
    id: "pend-007",
    clientName: "Amr Abdel-Fattah",
    clientId: "cli-pending-007",
    unitCode: "C-220",
    compound: "Palm Hills Gardens",
    contractDate: "2026-04-07",
    paymentPlanName: "Standard 8-Year Plan",
    unitPrice: 6_400_000,
    installments: generateDraftInstallments(6_400_000, 15, 8, "2026-05-15", 30_000),
    createdAt: "2026-04-07",
  },
  {
    id: "pend-008",
    clientName: "Rania Helmy",
    clientId: "cli-pending-008",
    unitCode: "E-603",
    compound: "Nile View Residences",
    contractDate: "2026-04-01",
    paymentPlanName: "Premium 10-Year Plan",
    unitPrice: 8_100_000,
    installments: generateDraftInstallments(8_100_000, 20, 10, "2026-04-20", 35_000),
    createdAt: "2026-04-01",
  },
];

// Helper
const daysBetween = (a: string, b: string) => {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const getStatusColor = (status: ChequeStatus) => {
  switch (status) {
    case "collected":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" };
    case "pending":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
    case "overdue":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" };
    case "bounced":
      return { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200", dot: "bg-rose-600" };
    case "post_dated":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" };
  }
};

export const getTypeLabel = (type: ChequeType) => {
  const labels: Record<string, string> = {
    down_payment: "Down Payment",
    installment: "Installment",
    maintenance: "Maintenance",
    balloon: "Balloon",
    booking: "Booking",
    finishing: "Finishing",
    parking: "Parking",
    club_membership: "Club",
    other: "Other",
  };
  return labels[type] || type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    property: "Property",
    maintenance: "Maintenance",
    finishing: "Finishing",
    parking: "Parking",
    club_membership: "Club Membership",
  };
  return labels[category] || category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getCategoryColor = (category: string) => {
  const colors: Record<string, { bg: string; text: string; bar: string }> = {
    property: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
    maintenance: { bg: "bg-purple-50", text: "text-purple-600", bar: "bg-purple-500" },
    finishing: { bg: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500" },
    parking: { bg: "bg-cyan-50", text: "text-cyan-600", bar: "bg-cyan-500" },
    club_membership: { bg: "bg-indigo-50", text: "text-indigo-600", bar: "bg-indigo-500" },
  };
  return colors[category] || { bg: "bg-gray-50", text: "text-gray-600", bar: "bg-gray-500" };
};

export const getStatusLabel = (status: ChequeStatus) => {
  switch (status) {
    case "collected": return "Collected";
    case "pending": return "Pending";
    case "overdue": return "Overdue";
    case "bounced": return "Bounced";
    case "post_dated": return "Post-dated";
  }
};

// Auto-detect overdue: any pending cheque past its due date is overdue
export function applyAutoOverdue(cheque: Cheque): Cheque {
  if (cheque.status === "pending" || cheque.status === "post_dated") {
    const dueMs = new Date(cheque.dueDate).getTime();
    const todayMs = new Date(TODAY).getTime();
    if (dueMs < todayMs) {
      return { ...cheque, status: "overdue" };
    }
  }
  return cheque;
}

export const useChequesStore = create<ChequesState>((set, get) => ({
  cheques: MOCK_CHEQUES,
  filterStatus: "all",
  filterType: "all",
  filterCategory: "all",
  filterCompound: "all",
  filterSearch: "",
  filterDateRange: { from: null, to: null },
  selectedChequeId: null,
  expandedClientId: null,
  isDrawerOpen: false,
  pendingConfirmations: MOCK_PENDING,

  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterCompound: (compound) => set({ filterCompound: compound }),
  setFilterSearch: (search) => set({ filterSearch: search }),
  setFilterDateRange: (range) => set({ filterDateRange: range }),
  setSelectedCheque: (id) => set({ selectedChequeId: id }),
  setExpandedClient: (id) => set((state) => ({ expandedClientId: state.expandedClientId === id ? null : id })),

  markAsCollected: (id) => {
    set((state) => ({
      cheques: state.cheques.map((c) =>
        c.id === id ? {
          ...c,
          status: "collected" as ChequeStatus,
          collectedDate: TODAY,
          statusHistory: [...c.statusHistory, { from: c.status, to: "collected", date: TODAY, note: "" }],
        } : c
      ),
    }));
  },

  markAsBounced: (id) => {
    set((state) => ({
      cheques: state.cheques.map((c) =>
        c.id === id ? {
          ...c,
          status: "bounced" as ChequeStatus,
          collectedDate: null,
          statusHistory: [...c.statusHistory, { from: c.status, to: "bounced", date: TODAY, note: "" }],
        } : c
      ),
    }));
  },

  addNote: (id, note) => {
    set((state) => ({
      cheques: state.cheques.map((c) =>
        c.id === id ? { ...c, notes: note } : c
      ),
    }));
  },

  bulkMarkAsCollected: (ids) => {
    const idSet = new Set(ids);
    set((state) => ({
      cheques: state.cheques.map((c) =>
        idSet.has(c.id) ? {
          ...c,
          status: "collected" as ChequeStatus,
          collectedDate: TODAY,
          statusHistory: [...c.statusHistory, { from: c.status, to: "collected", date: TODAY, note: "Bulk collection" }],
        } : c
      ),
    }));
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  addCheques: (newCheques) => {
    set((state) => ({
      cheques: [
        ...state.cheques,
        ...newCheques.map((c, i) => ({
          ...c,
          id: `chq-new-${Date.now()}-${i}`,
        })),
      ],
      isDrawerOpen: false,
    }));
  },

  addPendingConfirmation: (pending) => {
    set((state) => ({
      pendingConfirmations: [...state.pendingConfirmations, pending],
      isDrawerOpen: false,
    }));
  },

  updatePendingInstallments: (pendingId, installments) => {
    set((state) => ({
      pendingConfirmations: state.pendingConfirmations.map((p) =>
        p.id === pendingId ? { ...p, installments } : p
      ),
    }));
  },

  confirmPending: (pendingId) => {
    const { pendingConfirmations, cheques } = get();
    const pending = pendingConfirmations.find((p) => p.id === pendingId);
    if (!pending) return;

    const today = new Date(TODAY);
    const newCheques: Cheque[] = pending.installments.map((inst, i) => {
      const dueDate = new Date(inst.dueDate);
      let status: ChequeStatus;
      if (dueDate < today) status = "overdue";
      else if (dueDate.getTime() - today.getTime() < 14 * 24 * 60 * 60 * 1000) status = "pending";
      else status = "post_dated";

      return {
        id: `chq-confirmed-${Date.now()}-${i}`,
        chequeNumber: inst.chequeNumber,
        clientId: pending.clientId,
        clientName: pending.clientName,
        unitCode: pending.unitCode,
        compound: pending.compound,
        amount: inst.amount,
        dueDate: inst.dueDate,
        collectedDate: null,
        status,
        type: inst.type,
        category: inst.category,
        bank: inst.bank,
        notes: inst.notes,
        paymentPlanId: null,
        statusHistory: [],
      };
    });

    set({
      cheques: [...cheques, ...newCheques],
      pendingConfirmations: pendingConfirmations.filter((p) => p.id !== pendingId),
    });
  },

  removePending: (pendingId) => {
    set((state) => ({
      pendingConfirmations: state.pendingConfirmations.filter((p) => p.id !== pendingId),
    }));
  },

  getUpcomingDue: (days: number) => {
    const { cheques: raw } = get();
    const cheques = raw.map(applyAutoOverdue);
    const todayMs = new Date(TODAY).getTime();
    const limitMs = todayMs + days * 24 * 60 * 60 * 1000;
    return cheques
      .filter((c) => {
        if (c.status === "collected" || c.status === "bounced") return false;
        const dueMs = new Date(c.dueDate).getTime();
        return dueMs >= todayMs && dueMs <= limitMs;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  getOverdueAging: () => {
    const { cheques: raw } = get();
    const cheques = raw.map(applyAutoOverdue);
    const todayMs = new Date(TODAY).getTime();
    const overdue = cheques.filter((c) => c.status === "overdue" || c.status === "bounced");

    const buckets: { bucket: string; days: [number, number | null]; cheques: Cheque[] }[] = [
      { bucket: "0–30 days", days: [0, 30], cheques: [] },
      { bucket: "31–60 days", days: [31, 60], cheques: [] },
      { bucket: "61–90 days", days: [61, 90], cheques: [] },
      { bucket: "90+ days", days: [91, null], cheques: [] },
    ];

    overdue.forEach((c) => {
      const daysOverdue = Math.floor((todayMs - new Date(c.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      for (const b of buckets) {
        const [min, max] = b.days;
        if (daysOverdue >= min && (max === null || daysOverdue <= max)) {
          b.cheques.push(c);
          break;
        }
      }
    });

    return buckets;
  },

  getFilteredCheques: () => {
    const { cheques, filterStatus, filterType, filterCategory, filterCompound, filterSearch, filterDateRange } = get();
    return cheques.map(applyAutoOverdue).filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterType !== "all" && c.type !== filterType) return false;
      if (filterCategory !== "all" && c.category !== filterCategory) return false;
      if (filterCompound !== "all" && c.compound !== filterCompound) return false;
      if (filterSearch) {
        const q = filterSearch.toLowerCase();
        if (!c.clientName.toLowerCase().includes(q) && !c.chequeNumber.toLowerCase().includes(q) && !c.unitCode.toLowerCase().includes(q)) return false;
      }
      if (filterDateRange.from && c.dueDate < filterDateRange.from) return false;
      if (filterDateRange.to && c.dueDate > filterDateRange.to) return false;
      return true;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  getClientSummaries: () => {
    const { cheques: raw } = get();
    const cheques = raw.map(applyAutoOverdue);
    const clientMap = new Map<string, Cheque[]>();
    cheques.forEach((c) => {
      const arr = clientMap.get(c.clientId) || [];
      arr.push(c);
      clientMap.set(c.clientId, arr);
    });

    const summaries: ClientSummary[] = [];
    clientMap.forEach((clientCheques, clientId) => {
      const first = clientCheques[0];

      // Collect unique units
      const unitMap = new Map<string, UnitInfo>();
      clientCheques.forEach((c) => {
        const key = `${c.unitCode}-${c.compound}`;
        if (!unitMap.has(key)) unitMap.set(key, { unitCode: c.unitCode, compound: c.compound });
      });
      const units = [...unitMap.values()];

      // Build dynamic category breakdowns
      const catMap = new Map<string, { total: number; paid: number }>();
      clientCheques.forEach((c) => {
        const entry = catMap.get(c.category) || { total: 0, paid: 0 };
        entry.total += c.amount;
        if (c.status === "collected") entry.paid += c.amount;
        catMap.set(c.category, entry);
      });

      // Order: property first, then alphabetical
      const categoryOrder = ["property", "maintenance", "finishing", "parking", "club_membership"];
      const categories: CategoryBreakdown[] = [...catMap.entries()]
        .sort(([a], [b]) => {
          const ai = categoryOrder.indexOf(a);
          const bi = categoryOrder.indexOf(b);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        })
        .map(([cat, data]) => ({
          category: cat,
          label: getCategoryLabel(cat),
          total: data.total,
          paid: data.paid,
          remaining: data.total - data.paid,
        }));

      const pendingOrFuture = clientCheques.filter((c) => c.status !== "collected" && c.status !== "bounced");
      const nextDue = pendingOrFuture.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

      summaries.push({
        clientId,
        clientName: first.clientName,
        unitCode: first.unitCode,
        compound: first.compound,
        units,
        categories,
        totalCheques: clientCheques.length,
        collectedCheques: clientCheques.filter((c) => c.status === "collected").length,
        pendingCheques: clientCheques.filter((c) => c.status === "pending" || c.status === "post_dated").length,
        overdueCheques: clientCheques.filter((c) => c.status === "overdue").length,
        bouncedCheques: clientCheques.filter((c) => c.status === "bounced").length,
        nextDueDate: nextDue?.dueDate || null,
        nextDueAmount: nextDue?.amount || 0,
      });
    });

    return summaries.sort((a, b) => a.clientName.localeCompare(b.clientName));
  },

  getOverallStats: () => {
    const { cheques: raw } = get();
    const cheques = raw.map(applyAutoOverdue);
    const collected = cheques.filter((c) => c.status === "collected");
    const pending = cheques.filter((c) => c.status === "pending");
    const overdue = cheques.filter((c) => c.status === "overdue");
    const bounced = cheques.filter((c) => c.status === "bounced");
    const postDated = cheques.filter((c) => c.status === "post_dated");

    const sum = (arr: Cheque[]) => arr.reduce((s, c) => s + c.amount, 0);

    const totalNonPostDated = cheques.filter((c) => c.status !== "post_dated").length;
    const collectionRate = totalNonPostDated > 0 ? (collected.length / totalNonPostDated) * 100 : 0;

    // Build dynamic category breakdowns
    const catMap = new Map<string, { total: number; paid: number }>();
    cheques.forEach((c) => {
      const entry = catMap.get(c.category) || { total: 0, paid: 0 };
      entry.total += c.amount;
      if (c.status === "collected") entry.paid += c.amount;
      catMap.set(c.category, entry);
    });
    const categoryOrder = ["property", "maintenance", "finishing", "parking", "club_membership"];
    const categoryBreakdowns: CategoryBreakdown[] = [...catMap.entries()]
      .sort(([a], [b]) => {
        const ai = categoryOrder.indexOf(a);
        const bi = categoryOrder.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
      .map(([cat, data]) => ({
        category: cat,
        label: getCategoryLabel(cat),
        total: data.total,
        paid: data.paid,
        remaining: data.total - data.paid,
      }));

    const next7 = cheques.filter((c) => c.status !== "collected" && c.status !== "bounced" && daysBetween(TODAY, c.dueDate) >= 0 && daysBetween(TODAY, c.dueDate) <= 7);
    const next30 = cheques.filter((c) => c.status !== "collected" && c.status !== "bounced" && daysBetween(TODAY, c.dueDate) >= 0 && daysBetween(TODAY, c.dueDate) <= 30);

    return {
      totalCheques: cheques.length,
      totalValue: sum(cheques),
      collectedCount: collected.length,
      collectedValue: sum(collected),
      pendingCount: pending.length,
      pendingValue: sum(pending),
      overdueCount: overdue.length,
      overdueValue: sum(overdue),
      bouncedCount: bounced.length,
      bouncedValue: sum(bounced),
      postDatedCount: postDated.length,
      postDatedValue: sum(postDated),
      collectionRate,
      categoryBreakdowns,
      dueNext7Days: next7.length,
      dueNext7DaysValue: sum(next7),
      dueNext30Days: next30.length,
      dueNext30DaysValue: sum(next30),
    };
  },

  getCompounds: () => {
    const { cheques } = get();
    return [...new Set(cheques.map((c) => c.compound))].sort();
  },

  getCategories: () => {
    const { cheques } = get();
    return [...new Set(cheques.map((c) => c.category))];
  },

  getMonthlyCashFlow: () => {
    const { cheques: raw } = get();
    const cheques = raw.map(applyAutoOverdue);
    const months: Record<string, { expected: number; collected: number; collectedByDate: number }> = {};

    // Helper to ensure a month entry exists
    const ensure = (key: string) => {
      if (!months[key]) months[key] = { expected: 0, collected: 0, collectedByDate: 0 };
    };

    cheques.forEach((c) => {
      const dueMonth = c.dueDate.substring(0, 7); // YYYY-MM
      ensure(dueMonth);
      months[dueMonth].expected += c.amount;

      if (c.status === "collected") {
        // collected by due date — counts under the month it was originally due
        months[dueMonth].collected += c.amount;

        // collected by collection date — counts under the month the money actually came in
        if (c.collectedDate) {
          const collMonth = c.collectedDate.substring(0, 7);
          ensure(collMonth);
          months[collMonth].collectedByDate += c.amount;
        } else {
          // fallback: if no collectedDate, attribute to due month
          months[dueMonth].collectedByDate += c.amount;
        }
      }
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        key: month,
        month: new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(month + "-01")),
        ...data,
      }));
  },
}));
