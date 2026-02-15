import { create } from "zustand";

export interface Installment {
  id: string;
  name: string;
  amount: number | null;
  percentage: number | null;
  dueDate: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  installments: Installment[];
  isCustom: boolean;
}

export interface Client {
  name: string;
  phone: string;
  email: string;
  notes: string;
  nationalId: string;
  idDocumentUrl: string | null;
}

export interface Reservation {
  id: string;
  unitId: string;
  unitTitle: string;
  compound?: string;
  phase?: string;
  client: Client;
  paymentPlan: PaymentPlan | null;
  paymentMethod: string;
  paymentProofUrl: string | null;
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

// Dummy payment plans
const dummyPaymentPlans: PaymentPlan[] = [
  {
    id: "plan-1",
    name: "Standard 4-Year Plan",
    isCustom: false,
    installments: [
      { id: "i1", name: "Down Payment", amount: null, percentage: 10, dueDate: "2026-03-01" },
      { id: "i2", name: "Quarterly 1", amount: null, percentage: 10, dueDate: "2026-06-01" },
      { id: "i3", name: "Quarterly 2", amount: null, percentage: 10, dueDate: "2026-09-01" },
      { id: "i4", name: "Quarterly 3", amount: null, percentage: 10, dueDate: "2026-12-01" },
      { id: "i5", name: "Quarterly 4", amount: null, percentage: 10, dueDate: "2027-03-01" },
      { id: "i6", name: "Quarterly 5", amount: null, percentage: 10, dueDate: "2027-06-01" },
      { id: "i7", name: "Quarterly 6", amount: null, percentage: 10, dueDate: "2027-09-01" },
      { id: "i8", name: "Quarterly 7", amount: null, percentage: 10, dueDate: "2027-12-01" },
      { id: "i9", name: "Delivery", amount: null, percentage: 10, dueDate: "2028-03-01" },
      { id: "i10", name: "Final", amount: null, percentage: 10, dueDate: "2028-06-01" },
    ],
  },
  {
    id: "plan-2",
    name: "Premium 6-Year Plan",
    isCustom: false,
    installments: [
      { id: "i1", name: "Down Payment", amount: null, percentage: 5, dueDate: "2026-03-01" },
      { id: "i2", name: "Year 1", amount: null, percentage: 15, dueDate: "2027-03-01" },
      { id: "i3", name: "Year 2", amount: null, percentage: 15, dueDate: "2028-03-01" },
      { id: "i4", name: "Year 3", amount: null, percentage: 15, dueDate: "2029-03-01" },
      { id: "i5", name: "Year 4", amount: null, percentage: 15, dueDate: "2030-03-01" },
      { id: "i6", name: "Year 5", amount: null, percentage: 15, dueDate: "2031-03-01" },
      { id: "i7", name: "Delivery", amount: null, percentage: 20, dueDate: "2032-03-01" },
    ],
  },
  {
    id: "plan-3",
    name: "Cash Discount Plan",
    isCustom: false,
    installments: [{ id: "i1", name: "Full Payment", amount: null, percentage: 100, dueDate: "2026-03-15" }],
  },
];

// Dummy reservations
const dummyReservations: Reservation[] = [
  {
    id: "RES-001",
    unitId: "UNIT-A101",
    unitTitle: "Villa A-101",
    compound: "Saket",
    phase: "Phase 1",
    client: {
      name: "Ahmed Mohamed",
      phone: "+20 100 123 4567",
      email: "ahmed.m@example.com",
      notes: "Prefers morning calls",
      nationalId: "29501011234567",
      idDocumentUrl: null,
    },
    paymentPlan: dummyPaymentPlans[0],
    paymentMethod: "Bank Transfer",
    paymentProofUrl: "proof-1.jpg",
    createdAt: "2026-02-05T10:30:00Z",
    status: "confirmed",
  },
  {
    id: "RES-002",
    unitId: "UNIT-B205",
    unitTitle: "Apartment B-205",
    compound: "Saket",
    phase: "Phase 2",
    client: {
      name: "Sara Ali",
      phone: "+20 101 987 6543",
      email: "sara.ali@example.com",
      notes: "",
      nationalId: "29805051234567",
      idDocumentUrl: null,
    },
    paymentPlan: null,
    paymentMethod: "Cash",
    paymentProofUrl: null,
    createdAt: "2026-02-07T14:15:00Z",
    status: "pending",
  },
  {
    id: "RES-003",
    unitId: "UNIT-C302",
    unitTitle: "Penthouse C-302",
    compound: "Sakan",
    phase: "Phase 1",
    client: {
      name: "Omar Hassan",
      phone: "+20 102 555 8888",
      email: "omar.h@example.com",
      notes: "VIP client - needs special attention",
      nationalId: "28810101234567",
      idDocumentUrl: "id-doc-3.pdf",
    },
    paymentPlan: dummyPaymentPlans[2],
    paymentMethod: "Check",
    paymentProofUrl: null,
    createdAt: "2026-02-08T09:00:00Z",
    status: "confirmed",
  },
];

interface SalesStore {
  // State
  reservations: Reservation[];
  paymentPlans: PaymentPlan[];
  isReservationDrawerOpen: boolean;
  currentReservation: Reservation | null;
  editingReservationId: string | null;
  openWithCustomPlan: boolean;

  // Actions
  openReservationDrawer: (unitId: string, unitTitle: string) => void;
  closeReservationDrawer: () => void;
  createReservation: (reservation: Omit<Reservation, "id" | "createdAt" | "status">) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  editReservation: (id: string) => void;
  editReservationWithCustomPlan: (id: string) => void;
  setCurrentPaymentPlan: (plan: PaymentPlan | null) => void;
  updateCurrentClient: (client: Partial<Client>) => void;
  updateReservationDetails: (details: Partial<Reservation>) => void;
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  reservations: dummyReservations,
  paymentPlans: dummyPaymentPlans,
  isReservationDrawerOpen: false,
  currentReservation: null,
  editingReservationId: null,
  openWithCustomPlan: false,

  openReservationDrawer: (unitId: string, unitTitle: string) => {
    set({
      isReservationDrawerOpen: true,
      editingReservationId: null,
      currentReservation: {
        id: "",
        unitId,
        unitTitle,
        client: { name: "", phone: "", email: "", notes: "", nationalId: "", idDocumentUrl: null },
        paymentPlan: null,
        paymentMethod: "Bank Transfer",
        paymentProofUrl: null,
        createdAt: "",
        status: "pending",
      },
    });
  },

  closeReservationDrawer: () => {
    set({
      isReservationDrawerOpen: false,
      currentReservation: null,
      editingReservationId: null,
      openWithCustomPlan: false,
    });
  },

  createReservation: (reservation) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `RES-${String(get().reservations.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    set((state) => ({
      reservations: [...state.reservations, newReservation],
      isReservationDrawerOpen: false,
      currentReservation: null,
    }));
  },

  updateReservation: (id, updates) => {
    set((state) => ({
      reservations: state.reservations.map((res) => (res.id === id ? { ...res, ...updates } : res)),
    }));
  },

  editReservation: (id) => {
    const reservation = get().reservations.find((r) => r.id === id);
    if (reservation) {
      set({
        isReservationDrawerOpen: true,
        editingReservationId: id,
        currentReservation: { ...reservation },
        openWithCustomPlan: false,
      });
    }
  },

  editReservationWithCustomPlan: (id) => {
    const reservation = get().reservations.find((r) => r.id === id);
    if (reservation) {
      set({
        isReservationDrawerOpen: true,
        editingReservationId: id,
        currentReservation: { ...reservation },
        openWithCustomPlan: true,
      });
    }
  },

  setCurrentPaymentPlan: (plan) => {
    set((state) => ({
      currentReservation: state.currentReservation ? { ...state.currentReservation, paymentPlan: plan } : null,
    }));
  },

  updateCurrentClient: (client) => {
    set((state) => ({
      currentReservation: state.currentReservation
        ? {
            ...state.currentReservation,
            client: { ...state.currentReservation.client, ...client },
          }
        : null,
    }));
  },

  updateReservationDetails: (details) => {
    set((state) => ({
      currentReservation: state.currentReservation ? { ...state.currentReservation, ...details } : null,
    }));
  },
}));
