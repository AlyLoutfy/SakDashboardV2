import { create } from "zustand";

// Types
export type PaymentType = "down_payment" | "installment" | "maintenance" | "balloon";

export interface Installment {
  id: string;
  type: PaymentType;
  label?: string;
  number: number;
  amount: number;
  dueDate: Date;
  description: string;
  isPaid: boolean;
}

export interface PaymentStage {
  id: string;
  type: PaymentType;
  name: string;
  mode: "percentage" | "fixed";
  value: number;
  count?: number; // For recurring installments
  gapPattern?: "monthly" | "quarterly" | "semi-annual" | "annual" | "custom";
  customGap?: number;
  date?: Date; // For single payments
  startDate?: Date; // For recurring sequence
}

export interface PaymentPlan {
  id: string;
  clientName: string;
  unitCode: string;
  basePrice: number; // Original unit price
  discount: {
    type: "percentage" | "fixed";
    value: number;
  };
  downPayment: {
    type: "percentage" | "fixed";
    value: number;
  };
  installments: Installment[];
  gapPattern: "monthly" | "quarterly" | "semi-annual" | "annual" | "custom";
  customGapMonths: number;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "sent" | "active" | "completed";
  notes: string;
}

export interface AdminRestrictions {
  maxYears: number;
  maxDiscountPercent: number;
  minDownPaymentPercent: number;
  maxInstallments: number;
}

export interface PlanValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface PaymentPlansState {
  // Data
  plans: PaymentPlan[];
  currentPlan: PaymentPlan | null;
  restrictions: AdminRestrictions;

  // UI State
  isCreating: boolean;
  isEditing: boolean;
  selectedPlanId: string | null;

  // Actions - Plans
  createPlan: () => void;
  updateCurrentPlan: (updates: Partial<PaymentPlan>) => void;
  savePlan: () => void;
  deletePlan: (id: string) => void;
  selectPlan: (id: string) => void;
  duplicatePlan: (id: string) => void;
  cancelEdit: () => void;

  // Actions - Installments
  addInstallment: (installment: Omit<Installment, "id">) => void;
  appendSequence: (sequence: { type: PaymentType; count: number; amount: number; startDate: Date; gapPattern: string; startNumber?: number }) => void;
  updateInstallment: (id: string, updates: Partial<Installment>) => void;
  removeInstallment: (id: string) => void;
  reorderInstallments: (activeId: string, overId: string) => void;
  generateInstallments: (stages: PaymentStage[]) => void;
  clearInstallments: () => void;

  // Actions - Validation
  validatePlan: () => PlanValidation;

  // Actions - Restrictions
  setRestrictions: (restrictions: Partial<AdminRestrictions>) => void;
}

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 11);

const getMonthsForPattern = (pattern: string, customMonths: number = 1): number => {
  switch (pattern) {
    case "monthly":
      return 1;
    case "quarterly":
      return 3;
    case "semi-annual":
      return 6;
    case "annual":
      return 12;
    case "custom":
      return customMonths;
    default:
      return 1;
  }
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Default restrictions (can be updated by admins)
const DEFAULT_RESTRICTIONS: AdminRestrictions = {
  maxYears: 10,
  maxDiscountPercent: 20,
  minDownPaymentPercent: 10,
  maxInstallments: 120,
};

// Empty plan template
const createEmptyPlan = (): PaymentPlan => ({
  id: generateId(),
  clientName: "",
  unitCode: "",
  basePrice: 5000000,
  discount: { type: "percentage", value: 0 },
  downPayment: { type: "percentage", value: 10 },
  installments: [],
  gapPattern: "quarterly",
  customGapMonths: 2,
  startDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "draft",
  notes: "",
});

// Mock data for testing
const MOCK_PLANS: PaymentPlan[] = [
  {
    id: "plan-001",
    clientName: "Ahmed Hassan",
    unitCode: "A-101",
    basePrice: 5000000,
    discount: { type: "percentage", value: 0 },
    downPayment: { type: "percentage", value: 15 },
    installments: [
      { id: "inst-1", type: "down_payment", number: 1, amount: 750000, dueDate: new Date("2026-03-15"), description: "Down Payment", isPaid: true },
      { id: "inst-2", type: "installment", number: 1, amount: 212500, dueDate: new Date("2026-06-15"), description: "Quarterly Installment", isPaid: false },
      { id: "inst-3", type: "installment", number: 2, amount: 212500, dueDate: new Date("2026-09-15"), description: "Quarterly Installment", isPaid: false },
      { id: "inst-4", type: "installment", number: 3, amount: 212500, dueDate: new Date("2026-12-15"), description: "Quarterly Installment", isPaid: false },
    ],
    gapPattern: "quarterly",
    customGapMonths: 3,
    startDate: new Date("2026-03-15"),
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-20"),
    status: "active",
    notes: "Premium client - flexible terms",
  },
  {
    id: "plan-002",
    clientName: "Sara Mohamed",
    unitCode: "B-205",
    basePrice: 3500000,
    discount: { type: "fixed", value: 100000 },
    downPayment: { type: "fixed", value: 500000 },
    installments: [
      { id: "inst-5", type: "down_payment", number: 1, amount: 500000, dueDate: new Date("2026-04-01"), description: "Down Payment", isPaid: false },
      { id: "inst-6", type: "installment", number: 1, amount: 250000, dueDate: new Date("2026-05-01"), description: "Monthly Installment", isPaid: false },
      { id: "inst-7", type: "installment", number: 2, amount: 250000, dueDate: new Date("2026-06-01"), description: "Monthly Installment", isPaid: false },
    ],
    gapPattern: "monthly",
    customGapMonths: 1,
    startDate: new Date("2026-04-01"),
    createdAt: new Date("2026-01-28"),
    updatedAt: new Date("2026-01-28"),
    status: "draft",
    notes: "",
  },
];

// @ts-ignore
export const usePaymentPlansStore = create<PaymentPlansState>((set, get) => ({
  // Initial state
  plans: MOCK_PLANS,
  currentPlan: null,
  restrictions: DEFAULT_RESTRICTIONS,
  isCreating: false,
  isEditing: false,
  selectedPlanId: null,

  // Plan actions
  createPlan: () => {
    const newPlan = createEmptyPlan();
    set({
      currentPlan: newPlan,
      isCreating: true,
      isEditing: true,
      selectedPlanId: null,
    });
  },

  updateCurrentPlan: (updates) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    set({
      currentPlan: {
        ...currentPlan,
        ...updates,
        updatedAt: new Date(),
      },
    });
  },

  savePlan: () => {
    const { currentPlan, plans, isCreating } = get();
    if (!currentPlan) return;

    const updatedPlan = { ...currentPlan, updatedAt: new Date() };

    if (isCreating) {
      set({
        plans: [...plans, updatedPlan],
        currentPlan: null,
        isCreating: false,
        isEditing: false,
      });
    } else {
      set({
        plans: plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)),
        currentPlan: null,
        isEditing: false,
      });
    }
  },

  deletePlan: (id) => {
    const { plans, currentPlan } = get();
    set({
      plans: plans.filter((p) => p.id !== id),
      currentPlan: currentPlan?.id === id ? null : currentPlan,
      selectedPlanId: null,
    });
  },

  selectPlan: (id) => {
    const { plans } = get();
    const plan = plans.find((p) => p.id === id);
    if (plan) {
      set({
        currentPlan: { ...plan },
        isEditing: true,
        isCreating: false,
        selectedPlanId: id,
      });
    }
  },

  duplicatePlan: (id) => {
    const { plans } = get();
    const plan = plans.find((p) => p.id === id);
    if (plan) {
      const duplicated: PaymentPlan = {
        ...plan,
        id: generateId(),
        clientName: `${plan.clientName} (Copy)`,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        installments: plan.installments.map((inst) => ({
          ...inst,
          id: generateId(),
          isPaid: false,
        })),
      };
      set({
        currentPlan: duplicated,
        isCreating: true,
        isEditing: true,
        selectedPlanId: null,
      });
    }
  },

  cancelEdit: () => {
    set({
      currentPlan: null,
      isCreating: false,
      isEditing: false,
      selectedPlanId: null,
    });
  },

  // Installment actions
  addInstallment: (installment) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    const newInstallment: Installment = {
      ...installment,
      id: generateId(),
    };

    set({
      currentPlan: {
        ...currentPlan,
        installments: [...currentPlan.installments, newInstallment],
        updatedAt: new Date(),
      },
    });
  },

  appendSequence: (sequence) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    const { type, count, amount, startDate, gapPattern, startNumber } = sequence;
    const newInstallments: Installment[] = [];
    let iterDate = new Date(startDate);
    const gapMonths = getMonthsForPattern(gapPattern, 1);

    // Determine the starting number if not provided
    // For installments, continue the sequence
    // For others, maybe start at 1?

    let currentNum = startNumber;
    if (currentNum === undefined) {
      if (type === "installment") {
        const existingInstallments = currentPlan.installments.filter((i) => i.type === "installment");
        const maxNum = existingInstallments.length > 0 ? Math.max(...existingInstallments.map((i) => i.number)) : 0;
        currentNum = maxNum + 1;
      } else {
        currentNum = 1;
      }
    }

    for (let i = 0; i < count; i++) {
      const label = type === "installment" ? `Installment ${currentNum}` : type === "down_payment" ? "Down Payment" : type === "maintenance" ? "Maintenance" : "Payment";

      newInstallments.push({
        id: generateId(),
        type,
        label,
        number: currentNum!,
        amount,
        dueDate: new Date(iterDate),
        description: label,
        isPaid: false,
      });

      if (type === "installment" || type === "maintenance") {
        currentNum!++;
      }

      iterDate = addMonths(iterDate, gapMonths);
    }

    set({
      currentPlan: {
        ...currentPlan,
        installments: [...currentPlan.installments, ...newInstallments],
        updatedAt: new Date(),
      },
    });
  },

  updateInstallment: (id, updates) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    set({
      currentPlan: {
        ...currentPlan,
        installments: currentPlan.installments.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst)),
        updatedAt: new Date(),
      },
    });
  },

  removeInstallment: (id) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    const filtered = currentPlan.installments.filter((inst) => inst.id !== id);

    // Renumber logic remains same
    let instCount = 0;
    const renumbered = filtered.map((inst) => {
      if (inst.type === "installment") {
        instCount++;
        return { ...inst, number: instCount };
      }
      return inst;
    });

    set({
      currentPlan: {
        ...currentPlan,
        installments: renumbered,
        updatedAt: new Date(),
      },
    });
  },

  reorderInstallments: (activeId, overId) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    const { installments } = currentPlan;
    const oldIndex = installments.findIndex((i) => i.id === activeId);
    const newIndex = installments.findIndex((i) => i.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...installments];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);

    // Renumber after reorder
    let instCount = 0;
    const renumbered = reordered.map((inst) => {
      if (inst.type === "installment") {
        instCount++;
        return { ...inst, number: instCount };
      }
      return inst;
    });

    set({
      currentPlan: {
        ...currentPlan,
        installments: renumbered,
        updatedAt: new Date(),
      },
    });
  },

  generateInstallments: (stages) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    const { basePrice, discount } = currentPlan;

    // Calculate discount amount
    const discountAmount = discount.type === "percentage" ? (basePrice * discount.value) / 100 : discount.value;
    const priceAfterDiscount = basePrice - discountAmount;

    // Calculate totals for non-distributing stages
    const nonInstallmentTotal = stages.filter((s) => s.type !== "installment").reduce((sum, s) => sum + (s.mode === "percentage" ? (priceAfterDiscount * s.value) / 100 : s.value), 0);

    const netRemaining = priceAfterDiscount - nonInstallmentTotal;
    const totalInstallmentCount = stages.filter((s) => s.type === "installment").reduce((sum, s) => sum + (s.count || 0), 0);

    const amountPerInstallment = totalInstallmentCount > 0 ? Math.round(netRemaining / totalInstallmentCount) : 0;

    const finalInstallments: Installment[] = [];
    let currentInstNum = 1;

    stages.forEach((stage) => {
      if (stage.type !== "installment") {
        const amount = stage.mode === "percentage" ? (priceAfterDiscount * stage.value) / 100 : stage.value;

        finalInstallments.push({
          id: generateId(),
          type: stage.type,
          label: stage.name,
          number: 1,
          amount: amount,
          dueDate: stage.date ? new Date(stage.date) : new Date(),
          description: stage.name,
          isPaid: false,
        });
      } else {
        const count = stage.count || 12;
        const gapMonths = getMonthsForPattern(stage.gapPattern || "monthly", stage.customGap || 1);
        let iterDate = stage.startDate ? new Date(stage.startDate) : new Date();

        for (let i = 0; i < count; i++) {
          finalInstallments.push({
            id: generateId(),
            type: "installment",
            label: stage.name ? `${stage.name} ${i + 1}` : `Installment ${currentInstNum}`,
            number: currentInstNum++,
            amount: amountPerInstallment,
            dueDate: new Date(iterDate),
            description: stage.name || "Installment",
            isPaid: false,
          });

          iterDate = addMonths(iterDate, gapMonths);
        }
      }
    });

    // Fix rounding on the VERY LAST installment if exists
    const currentTotal = finalInstallments.reduce((sum, i) => sum + i.amount, 0);
    const diff = priceAfterDiscount - currentTotal;

    if (diff !== 0 && finalInstallments.length > 0) {
      // Find last installment (preferably of type installment)
      const lastInst = finalInstallments[finalInstallments.length - 1];
      lastInst.amount += diff;
    }

    // Update plan - update summary field
    const totalDownPayment = finalInstallments.filter((i) => i.type === "down_payment").reduce((sum, i) => sum + i.amount, 0);

    set({
      currentPlan: {
        ...currentPlan,
        installments: finalInstallments,
        downPayment: { type: "fixed", value: totalDownPayment },
        updatedAt: new Date(),
      },
    });
  },

  clearInstallments: () => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    set({
      currentPlan: {
        ...currentPlan,
        installments: [],
        updatedAt: new Date(),
      },
    });
  },

  // Validation
  validatePlan: () => {
    const { currentPlan, restrictions } = get();
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!currentPlan) {
      return { isValid: false, errors: ["No plan to validate"], warnings: [] };
    }

    if (currentPlan.basePrice <= 0) {
      errors.push("Base price must be greater than 0");
    }

    const discountAmount = currentPlan.discount.type === "percentage" ? (currentPlan.basePrice * currentPlan.discount.value) / 100 : currentPlan.discount.value;
    const priceAfterDiscount = currentPlan.basePrice - discountAmount;

    // Recalculate down payment from actual installments
    const totalDownPayment = currentPlan.installments.filter((i) => i.type === "down_payment").reduce((sum, i) => sum + i.amount, 0);

    const downPaymentPercent = priceAfterDiscount > 0 ? (totalDownPayment / priceAfterDiscount) * 100 : 0;

    if (downPaymentPercent < restrictions.minDownPaymentPercent) {
      errors.push(`Down payment must be at least ${restrictions.minDownPaymentPercent}%`);
    }

    if (currentPlan.installments.length === 0) {
      errors.push("At least one installment is required");
    }

    if (currentPlan.installments.length > restrictions.maxInstallments) {
      errors.push(`Maximum ${restrictions.maxInstallments} installments allowed`);
    }

    // Amount validation
    const totalInstallments = currentPlan.installments.reduce((sum, i) => sum + i.amount, 0);
    const expectedRemaining = priceAfterDiscount; // Logic changed: total payments should equal Price After Discount

    if (Math.abs(totalInstallments - expectedRemaining) > 1) {
      warnings.push(`Total payments (${formatCurrency(totalInstallments)}) doesn't match Price (${formatCurrency(expectedRemaining)})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  // Restrictions
  setRestrictions: (updates) => {
    const { restrictions } = get();
    set({
      restrictions: { ...restrictions, ...updates },
    });
  },
}));

// Utility functions for components
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const calculatePlanSummary = (plan: PaymentPlan) => {
  const discountAmount = plan.discount.type === "percentage" ? (plan.basePrice * plan.discount.value) / 100 : plan.discount.value;
  const priceAfterDiscount = plan.basePrice - discountAmount;

  // Calculate down payment from installments
  const downPaymentAmount = plan.installments.filter((i) => i.type === "down_payment").reduce((sum, i) => sum + i.amount, 0);

  const totalInstallments = plan.installments.reduce((sum, i) => sum + i.amount, 0);
  const remainingToFinance = priceAfterDiscount - downPaymentAmount;

  let durationMonths = 0;
  if (plan.installments.length > 0) {
    const firstDate = new Date(plan.installments[0].dueDate);
    const lastDate = new Date(plan.installments[plan.installments.length - 1].dueDate);
    durationMonths = Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  }

  const monthlyAverage = durationMonths > 0 ? remainingToFinance / durationMonths : 0;

  return {
    basePrice: plan.basePrice,
    discountAmount,
    priceAfterDiscount,
    downPaymentAmount,
    downPaymentPercent: priceAfterDiscount > 0 ? (downPaymentAmount / priceAfterDiscount) * 100 : 0,
    remainingToFinance,
    totalInstallmentsCreated: totalInstallments, // This is basically total paid
    installmentCount: plan.installments.length,
    durationMonths,
    durationYears: durationMonths / 12,
    monthlyAverage,
  };
};
