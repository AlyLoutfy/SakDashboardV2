import { create } from "zustand";

// =============================================================================
// TYPES
// =============================================================================

export type ReservationStatus = "pending" | "blocked" | "approved" | "rejected" | "canceled" | "incomplete";

// Phase of the approval process
export type ApprovalPhase = "blocking" | "reservation";

export type ApproverType = "individual" | "team" | "either_or";

export interface Approver {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
}

export interface ApprovalStep {
  id: string;
  name: string;
  order: number;
  type: ApproverType;
  requiredApprovers: Approver[]; // Who can approve this step
  approvedBy?: Approver[]; // Who actually approved
  approvedAt?: Date;
  rejectedBy?: Approver;
  rejectedAt?: Date;
  rejectionReason?: string;
  status: "pending" | "approved" | "rejected" | "skipped" | "waiting";
}

export interface ReservationHistory {
  id: string;
  action: string;
  description: string;
  performedBy: Approver;
  performedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface ClientData {
  name: string;
  phone?: string;
  email?: string;
  nationalId?: string;
}

export interface UnitHistoryItem {
  id: string;
  user: { name: string; avatar?: string };
  date: Date;
  action: string;
  details?: { label: string; from: string; to: string }[];
}

export interface UnitDetails {
  unitId: string;
  location: string;
  type: string;
  area?: number;
  price?: number;
  compound: string;
  phaseName?: string;
  bua?: number;
  floor?: string;
  gardenArea?: number;
  paymentMethods?: {
    name: string;
    type: string;
    minDownPayment: string;
    years: number;
  }[];
  history?: UnitHistoryItem[];
}

export interface ReservationRequest {
  id: string;
  reservationId: string;
  client: ClientData;
  unit: UnitDetails;
  salesperson: Approver;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;

  // Two-layer approval flow
  currentPhase: ApprovalPhase; // "blocking" or "reservation"

  // Blocking Flow (Phase 1) - Request to block the unit
  blockingFlow: ApprovalStep[];
  blockingStepIndex: number;

  // Reservation Flow (Phase 2) - Request to reserve the unit (after blocking is approved)
  reservationFlow: ApprovalStep[];
  reservationStepIndex: number;

  // Legacy field for backward compatibility (combines both flows for display)
  approvalFlow: ApprovalStep[];
  currentStepIndex: number;

  history: ReservationHistory[];
  pdfUploaded: boolean;
  contractRequestCreated: boolean;
  leadId?: string;
  leadDetails?: {
    id: string;
    phoneNumber: string;
    phoneNumber2?: string;
    name: string;
    project: string;
    unitType: string;
    jobTitle?: string;
    salesPerson: string;
    leadSource: string;
    tag?: string;
    directIndirect: string;
    status: string;
    leadNotes?: string;
  };
  notes?: string;
  formResponse?: Record<string, string | number>;
}

interface ReservationRequestsState {
  requests: ReservationRequest[];
  contractRequests: ReservationRequest[];

  // Actions
  addRequest: (request: Omit<ReservationRequest, "id" | "history" | "createdAt" | "updatedAt">) => void;
  approveStep: (requestId: string, approver: Approver, notes?: string) => void;
  rejectStep: (requestId: string, approver: Approver, reason: string) => void;
  cancelRequest: (requestId: string, canceledBy: Approver, reason?: string) => void;
  createContractRequest: (requestId: string, createdBy: Approver) => void;
  uploadPdf: (requestId: string, uploadedBy: Approver) => void;

  // Selectors
  getPendingForUser: (userId: string) => ReservationRequest[];
  getPendingCountForUser: (userId: string) => number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

// Team members
const teamMembers = {
  sales: [
    { id: "S001", name: "Raheem Moussa", email: "raheem.m@sakneen.com", department: "Sales" },
    { id: "S002", name: "Mohamed Darwesh", email: "m.darwesh@sakneen.com", department: "Sales" },
    { id: "S003", name: "Ahmed Essam", email: "a.essam@sakneen.com", department: "Sales" },
    { id: "S004", name: "Sondos Ahmed", email: "sondos@sakneen.com", department: "Sales" },
    { id: "S005", name: "Mohamed Gamal", email: "m.gamal@sakneen.com", department: "Sales" },
  ],
  ops: [
    { id: "O001", name: "Sara Mostafa", email: "sara.m@sakneen.com", department: "Operations" },
    { id: "O002", name: "Hany Lotfy", email: "hany.l@sakneen.com", department: "Operations" },
  ],
  finance: [
    { id: "F001", name: "Amr Khaled", email: "amr.k@sakneen.com", department: "Finance" },
    { id: "F002", name: "Dina Hassan", email: "dina.h@sakneen.com", department: "Finance" },
    { id: "F003", name: "Karim Salem", email: "karim.s@sakneen.com", department: "Finance" },
  ],
  management: [
    { id: "M001", name: "Tarek El-Masry", email: "tarek.m@sakneen.com", department: "Management" },
    { id: "M002", name: "Layla Nabil", email: "layla.n@sakneen.com", department: "Management" },
  ],
  execs: [
    { id: "E001", name: "Ali Loutfy", email: "ali.l@sakneen.com", department: "Executive" },
    { id: "E002", name: "Omar Fathy", email: "omar.f@sakneen.com", department: "Executive" },
  ],
};

// Blocking Flow Template (Phase 1 - 2 steps)
const createBlockingFlow = (): ApprovalStep[] => [
  {
    id: "block-1",
    name: "Sales Verification",
    order: 1,
    type: "either_or",
    requiredApprovers: teamMembers.sales.slice(0, 2), // First 2 sales members
    status: "waiting",
  },
  {
    id: "block-2",
    name: "Operations Approval",
    order: 2,
    type: "either_or",
    requiredApprovers: teamMembers.ops,
    status: "waiting",
  },
];

// Reservation Flow Template (Phase 2 - 4 steps)
const createReservationFlow = (): ApprovalStep[] => [
  {
    id: "res-1",
    name: "Finance Verification",
    order: 1,
    type: "team",
    requiredApprovers: teamMembers.finance,
    status: "waiting",
  },
  {
    id: "res-2",
    name: "Legal Review",
    order: 2,
    type: "either_or",
    requiredApprovers: teamMembers.ops,
    status: "waiting",
  },
  {
    id: "res-3",
    name: "Management Approval",
    order: 3,
    type: "either_or",
    requiredApprovers: teamMembers.management,
    status: "waiting",
  },
  {
    id: "res-4",
    name: "Executive Sign-off",
    order: 4,
    type: "individual",
    requiredApprovers: [teamMembers.execs[0]],
    status: "waiting",
  },
];

// Helper to subtract days from current date
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Mock reservations
const generateMockReservations = (): ReservationRequest[] => {
  const count = 124;
  const requests: ReservationRequest[] = [];
  const clientNames = ["Ahmed Soliman", "Walid Saber", "Ashraf Mongy", "Sarah Miller", "John Doe", "Mostafa Kamel", "Mona Zaki", "Khaled Said", "Youssef Nabil", "Hanaa El-Zahid", "Karim Benzema", "Mo Salah", "Neymar Jr", "Lionel Messi", "Cristiano Ronaldo", "Omar Sherif", "Dina El-Sherbiny", "Amr Diab", "Tamer Hosny", "Sherine Abdel-Wahab"];
  const compounds = ["Nine West", "Zayed Dunes", "Palm Hills", "Swan Lake", "Mivida", "Cairo Festival City", "Madinaty", "Mountain View", "Hyde Park"];
  const unitTypes = ["Apartment", "Duplex", "Villa", "Penthouse", "Townhouse", "Chalet"];

  for (let i = 0; i < count; i++) {
    // Generate Status Distribution for two-layer flow
    // 40% Approved (both flows complete), 15% Blocked (blocking done, reservation in progress)
    // 15% Pending (blocking in progress), 10% Rejected, 10% Canceled, 10% Incomplete
    const rand = Math.random();
    let status: ReservationStatus = "approved";
    let currentPhase: ApprovalPhase = "reservation";

    if (rand > 0.9) {
      status = "incomplete";
      currentPhase = "blocking";
    } else if (rand > 0.8) {
      status = "canceled";
      currentPhase = "blocking";
    } else if (rand > 0.7) {
      status = "rejected";
      // Randomly reject in either phase
      currentPhase = Math.random() > 0.5 ? "blocking" : "reservation";
    } else if (rand > 0.55) {
      status = "blocked"; // Blocking complete, reservation in progress
      currentPhase = "reservation";
    } else if (rand > 0.4) {
      status = "pending"; // Blocking in progress
      currentPhase = "blocking";
    }

    // Create both flows
    const blockingFlow = createBlockingFlow();
    const reservationFlow = createReservationFlow();
    let blockingStepIndex = 0;
    let reservationStepIndex = 0;

    // Configure flow states based on status and phase
    if (status === "approved") {
      // Both flows fully approved
      currentPhase = "reservation";
      blockingStepIndex = 2;
      reservationStepIndex = 4;

      blockingFlow.forEach((step) => {
        step.status = "approved";
        step.approvedBy = [step.requiredApprovers[0]];
        step.approvedAt = daysAgo(Math.floor(Math.random() * 10) + 5);
      });

      reservationFlow.forEach((step) => {
        step.status = "approved";
        step.approvedBy = [step.requiredApprovers[0]];
        step.approvedAt = daysAgo(Math.floor(Math.random() * 5) + 1);
      });
    } else if (status === "blocked") {
      // Blocking complete, reservation in progress
      blockingStepIndex = 2;
      reservationStepIndex = Math.floor(Math.random() * 4); // 0 to 3

      // All blocking steps approved
      blockingFlow.forEach((step) => {
        step.status = "approved";
        step.approvedBy = [step.requiredApprovers[0]];
        step.approvedAt = daysAgo(Math.floor(Math.random() * 5) + 3);
      });

      // Reservation flow in progress
      reservationFlow.forEach((step, idx) => {
        if (idx < reservationStepIndex) {
          step.status = "approved";
          step.approvedBy = [step.requiredApprovers[0]];
          step.approvedAt = daysAgo(Math.floor(Math.random() * 3) + 1);
        } else if (idx === reservationStepIndex) {
          step.status = "pending";
        } else {
          step.status = "waiting";
        }
      });
    } else if (status === "pending") {
      // Blocking in progress
      blockingStepIndex = Math.floor(Math.random() * 2); // 0 or 1
      reservationStepIndex = 0;

      blockingFlow.forEach((step, idx) => {
        if (idx < blockingStepIndex) {
          step.status = "approved";
          step.approvedBy = [step.requiredApprovers[0]];
          step.approvedAt = daysAgo(Math.floor(Math.random() * 3) + 1);
        } else if (idx === blockingStepIndex) {
          step.status = "pending";
        } else {
          step.status = "waiting";
        }
      });

      // Reservation flow all waiting
      reservationFlow.forEach((step) => {
        step.status = "waiting";
      });
    } else if (status === "rejected") {
      if (currentPhase === "blocking") {
        // Rejected during blocking phase
        blockingStepIndex = Math.floor(Math.random() * 2);
        reservationStepIndex = 0;

        blockingFlow.forEach((step, idx) => {
          if (idx < blockingStepIndex) {
            step.status = "approved";
            step.approvedBy = [step.requiredApprovers[0]];
            step.approvedAt = daysAgo(Math.floor(Math.random() * 3) + 2);
          } else if (idx === blockingStepIndex) {
            step.status = "rejected";
            step.rejectedBy = step.requiredApprovers[0];
            step.rejectedAt = daysAgo(1);
            step.rejectionReason = "Unit not available for blocking";
          } else {
            step.status = "skipped";
          }
        });

        // All reservation steps skipped
        reservationFlow.forEach((step) => {
          step.status = "skipped";
        });
      } else {
        // Rejected during reservation phase (blocking was approved)
        blockingStepIndex = 2;
        reservationStepIndex = Math.floor(Math.random() * 4);

        // All blocking approved
        blockingFlow.forEach((step) => {
          step.status = "approved";
          step.approvedBy = [step.requiredApprovers[0]];
          step.approvedAt = daysAgo(Math.floor(Math.random() * 5) + 3);
        });

        // Reservation rejected at some step
        reservationFlow.forEach((step, idx) => {
          if (idx < reservationStepIndex) {
            step.status = "approved";
            step.approvedBy = [step.requiredApprovers[0]];
            step.approvedAt = daysAgo(Math.floor(Math.random() * 3) + 2);
          } else if (idx === reservationStepIndex) {
            step.status = "rejected";
            step.rejectedBy = step.requiredApprovers[0];
            step.rejectedAt = daysAgo(1);
            step.rejectionReason = "Client credit check failed or incomplete documentation";
          } else {
            step.status = "skipped";
          }
        });
      }
    } else {
      // Canceled / Incomplete - all steps waiting/skipped
      blockingStepIndex = 0;
      reservationStepIndex = 0;
      blockingFlow.forEach((step) => {
        step.status = status === "canceled" ? "skipped" : "waiting";
      });
      reservationFlow.forEach((step) => {
        step.status = status === "canceled" ? "skipped" : "waiting";
      });
    }

    // Combine flows for legacy approvalFlow field
    const combinedFlow = [...blockingFlow, ...reservationFlow];
    const currentStepIndex = currentPhase === "blocking" ? blockingStepIndex : blockingFlow.length + reservationStepIndex;

    requests.push({
      id: `RR-${(100 + i).toString().padStart(3, "0")}`,
      reservationId: `${4858 - i}`,
      client: {
        name: clientNames[i % clientNames.length] + (Math.floor(i / clientNames.length) > 0 ? ` ${Math.floor(i / clientNames.length) + 1}` : ""),
        phone: `01${Math.floor(Math.random() * 3)}${Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, "0")}`,
        email: `client${i}@example.com`,
      },
      unit: {
        unitId: `U-${1000 + i}`,
        location: `Zone ${String.fromCharCode(65 + (i % 6))}, Building ${Math.floor(i / 10) + 1}`,
        type: unitTypes[i % unitTypes.length],
        area: 100 + Math.floor(Math.random() * 300),
        price: 2500000 + Math.floor(Math.random() * 15000000),
        compound: compounds[i % compounds.length],
        phaseName: Math.random() > 0.5 ? "Phase 1" : "-",
        bua: 100 + Math.floor(Math.random() * 200),
        floor: ["Ground", "First", "Second", "Third"][Math.floor(Math.random() * 4)],
        gardenArea: Math.random() > 0.7 ? 50 + Math.floor(Math.random() * 100) : undefined,
        paymentMethods: [
          {
            name: "1% monthly 8 years",
            type: "Custom Installments",
            minDownPayment: "1%",
            years: 8,
          },
        ],
        history: [
          {
            id: "h1",
            user: { name: "Alaa Samir" },
            date: daysAgo(3),
            action: "Update Unit Status After Reservation Update",
            details: [{ label: "Status", from: "Hold", to: "Reserved" }],
          },
          {
            id: "h2",
            user: { name: "Mariam Hossam" },
            date: daysAgo(5),
            action: "Update Unit Statuses",
            details: [{ label: "Status", from: "Available", to: "Hold" }],
          },
        ],
      },
      salesperson: teamMembers.sales[i % teamMembers.sales.length],
      status: status,
      createdAt: daysAgo(Math.floor(Math.random() * 30)),
      updatedAt: daysAgo(Math.floor(Math.random() * 5)),

      // Two-layer flow fields
      currentPhase: currentPhase,
      blockingFlow: blockingFlow,
      blockingStepIndex: blockingStepIndex,
      reservationFlow: reservationFlow,
      reservationStepIndex: reservationStepIndex,

      // Legacy combined flow
      approvalFlow: combinedFlow,
      currentStepIndex: currentStepIndex,

      history: [],
      pdfUploaded: Math.random() > 0.3,
      contractRequestCreated: status === "approved" && Math.random() > 0.4,
      leadId: `${9000 + i}`,
      leadDetails: {
        id: `${9000 + i}`,
        phoneNumber: `+201${Math.floor(Math.random() * 10)}0${Math.floor(Math.random() * 10000000)}`,
        phoneNumber2: `+2011${Math.floor(Math.random() * 10000000)}`,
        name: clientNames[i % clientNames.length],
        project: compounds[i % compounds.length],
        unitType: unitTypes[i % unitTypes.length],
        jobTitle: Math.random() > 0.5 ? "Engineer" : "Doctor",
        salesPerson: teamMembers.sales[i % teamMembers.sales.length].name,
        leadSource: ["Walk In", "Facebook", "Referral", "Cold Call"][Math.floor(Math.random() * 4)],
        tag: Math.random() > 0.7 ? "VIP" : "",
        directIndirect: Math.random() > 0.5 ? "Direct" : "Indirect",
        status: "done-deal",
        leadNotes: "",
      },
      formResponse: {
        "Mobile Number": `+201${Math.floor(Math.random() * 10)}0${Math.floor(Math.random() * 10000000)}`,
        "Email Address": i % 3 === 0 ? "N/A" : `client${i}@example.com`,
        Name: clientNames[i % clientNames.length],
        "Nationality الجنسية": i % 5 === 0 ? "Saudi Arabia" : "Egypt",
        "National ID Number Passport Number": `${2 + Math.floor(Math.random() * 1000000000000)}`,
        "Personal Fixed Address In Arabic": i % 2 === 0 ? "Giza-Egypt" : "Cairo-Egypt",
        "Current Address In Arabic": i % 2 === 0 ? "Giza-Egypt" : "New Cairo-Egypt",
        "Reservation Amount In EGP": 25000 + Math.floor(Math.random() * 10000),
        "Contract Price In EGP": 2500000 + Math.floor(Math.random() * 5000000),
        "Direct Indirect": Math.random() > 0.5 ? "Direct" : "Indirect",
        "Payment Plan": "1% monthly 8 years",
        "Sales Person": teamMembers.sales[i % teamMembers.sales.length].name,
      },
    });
  }
  return requests;
};

// =============================================================================
// STORE
// =============================================================================

export const useReservationRequestsStore = create<ReservationRequestsState>((set, get) => ({
  requests: generateMockReservations(),
  contractRequests: [],

  addRequest: (request) =>
    set((state) => {
      const newId = `RR-${String(state.requests.length + 1).padStart(3, "0")}`;
      const now = new Date();
      return {
        requests: [
          ...state.requests,
          {
            ...request,
            id: newId,
            createdAt: now,
            updatedAt: now,
            history: [
              {
                id: `h-${Date.now()}`,
                action: "created",
                description: "Reservation request created",
                performedBy: request.salesperson,
                performedAt: now,
              },
            ],
          },
        ],
      };
    }),

  approveStep: (requestId, approver, notes) =>
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id !== requestId) return req;

        const now = new Date();
        const updatedFlow = [...req.approvalFlow];
        const currentStep = updatedFlow[req.currentStepIndex];

        if (currentStep) {
          currentStep.status = "approved";
          currentStep.approvedBy = [approver];
          currentStep.approvedAt = now;
        }

        // Move to next step or complete
        const nextStepIndex = req.currentStepIndex + 1;
        if (nextStepIndex < updatedFlow.length) {
          updatedFlow[nextStepIndex].status = "pending";
        }

        const isFullyApproved = nextStepIndex >= updatedFlow.length;

        return {
          ...req,
          approvalFlow: updatedFlow,
          currentStepIndex: nextStepIndex,
          status: isFullyApproved ? "approved" : req.status,
          updatedAt: now,
          history: [
            ...req.history,
            {
              id: `h-${Date.now()}`,
              action: "approved",
              description: `${currentStep?.name || "Step"} approved${notes ? `: ${notes}` : ""}`,
              performedBy: approver,
              performedAt: now,
            },
          ],
        };
      }),
    })),

  rejectStep: (requestId, approver, reason) =>
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id !== requestId) return req;

        const now = new Date();
        const updatedFlow = [...req.approvalFlow];
        const currentStep = updatedFlow[req.currentStepIndex];

        if (currentStep) {
          currentStep.status = "rejected";
          currentStep.rejectedBy = approver;
          currentStep.rejectedAt = now;
          currentStep.rejectionReason = reason;
        }

        // Skip remaining steps
        for (let i = req.currentStepIndex + 1; i < updatedFlow.length; i++) {
          updatedFlow[i].status = "skipped";
        }

        return {
          ...req,
          approvalFlow: updatedFlow,
          status: "rejected",
          updatedAt: now,
          history: [
            ...req.history,
            {
              id: `h-${Date.now()}`,
              action: "rejected",
              description: `${currentStep?.name || "Step"} rejected: ${reason}`,
              performedBy: approver,
              performedAt: now,
            },
          ],
        };
      }),
    })),

  cancelRequest: (requestId, canceledBy, reason) =>
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id !== requestId) return req;

        const now = new Date();
        const updatedFlow = req.approvalFlow.map((step) => (step.status === "waiting" || step.status === "pending" ? { ...step, status: "skipped" as const } : step));

        return {
          ...req,
          approvalFlow: updatedFlow,
          status: "canceled",
          updatedAt: now,
          history: [
            ...req.history,
            {
              id: `h-${Date.now()}`,
              action: "canceled",
              description: `Request canceled${reason ? `: ${reason}` : ""}`,
              performedBy: canceledBy,
              performedAt: now,
            },
          ],
        };
      }),
    })),

  createContractRequest: (requestId, createdBy) =>
    set((state) => {
      const request = state.requests.find((r) => r.id === requestId);
      if (!request || request.status !== "approved") return state;

      const now = new Date();

      return {
        requests: state.requests.map((req) =>
          req.id === requestId
            ? {
                ...req,
                contractRequestCreated: true,
                updatedAt: now,
                history: [
                  ...req.history,
                  {
                    id: `h-${Date.now()}`,
                    action: "contract_created",
                    description: "Contract request created",
                    performedBy: createdBy,
                    performedAt: now,
                  },
                ],
              }
            : req,
        ),
        contractRequests: [
          ...state.contractRequests,
          {
            ...request,
            contractRequestCreated: true,
            updatedAt: now,
            history: [
              ...request.history,
              {
                id: `h-${Date.now()}`,
                action: "contract_created",
                description: "Contract request created from approved reservation",
                performedBy: createdBy,
                performedAt: now,
              },
            ],
          },
        ],
      };
    }),

  uploadPdf: (requestId, uploadedBy) =>
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id !== requestId) return req;
        const now = new Date();
        return {
          ...req,
          pdfUploaded: true,
          updatedAt: now,
          history: [
            ...req.history,
            {
              id: `h-${Date.now()}`,
              action: "pdf_uploaded",
              description: "PDF document uploaded",
              performedBy: uploadedBy,
              performedAt: now,
            },
          ],
        };
      }),
    })),

  // Selectors - get requests pending for a specific user
  getPendingForUser: (userId: string) => {
    const { requests } = get();
    return requests.filter((req) => {
      // Only pending requests
      if (req.status !== "pending") return false;

      // Get current step
      const currentStep = req.approvalFlow[req.currentStepIndex];
      if (!currentStep || currentStep.status !== "pending") return false;

      // Check if user is in the required approvers for current step
      return currentStep.requiredApprovers.some((approver) => approver.id === userId);
    });
  },

  getPendingCountForUser: (userId: string) => {
    const { requests } = get();
    return requests.filter((req) => {
      if (req.status !== "pending") return false;
      const currentStep = req.approvalFlow[req.currentStepIndex];
      if (!currentStep || currentStep.status !== "pending") return false;
      return currentStep.requiredApprovers.some((approver) => approver.id === userId);
    }).length;
  },
}));
