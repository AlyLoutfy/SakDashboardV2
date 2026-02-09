import { create } from "zustand";

// Status flow:
// pending -> (approve) -> active -> (reserve) -> reserved
//         -> (reject) -> rejected
// active -> (time expires) -> expired -> (extend) -> active
//                                     -> (release) -> released

export type BlockingStatus = "pending" | "active" | "expired" | "reserved" | "rejected" | "released";

export interface BlockingRequest {
  id: string;
  unitCode: string;
  compound: string;
  unitType: string;
  clientName: string;
  salesperson: string;
  salespersonEmail: string;
  requestedAt: Date;
  approvedAt?: Date;
  expiresAt: Date;
  status: BlockingStatus;
  reason: string;
  extendedHours?: number;
  decidedBy?: string;
  decidedAt?: Date;
}

interface BlockingRequestsState {
  requests: BlockingRequest[];
  addRequest: (request: Omit<BlockingRequest, "id">) => void;
  updateRequest: (id: string, updates: Partial<BlockingRequest>) => void;
  approveRequest: (id: string, adminName: string) => void;
  rejectRequest: (id: string, adminName: string) => void;
  markAsReserved: (id: string, adminName: string) => void;
  extendRequest: (id: string, hours: number, adminName: string) => void;
  releaseUnit: (id: string, adminName: string) => void;
}

// Helper to add hours to a date
const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

// Generate mock data with various states
const generateMockData = (): BlockingRequest[] => {
  const now = new Date();

  return [
    // Pending requests (awaiting admin approval)
    {
      id: "BR-001",
      unitCode: "A-101",
      compound: "Ramla",
      unitType: "Apartment",
      clientName: "Ahmed Hassan",
      salesperson: "Sarah Mohamed",
      salespersonEmail: "sarah.m@sakneen.com",
      requestedAt: addHours(now, -2),
      expiresAt: addHours(now, 48), // Will start if approved
      status: "pending",
      reason: "Client is preparing payment documents",
    },
    {
      id: "BR-002",
      unitCode: "C-310",
      compound: "Ogami",
      unitType: "Duplex",
      clientName: "Youssef Ibrahim",
      salesperson: "Nour Hassan",
      salespersonEmail: "nour.h@sakneen.com",
      requestedAt: addHours(now, -5),
      expiresAt: addHours(now, 48),
      status: "pending",
      reason: "Client visiting site tomorrow for final decision",
    },
    // Active blocking (approved, timer running)
    {
      id: "BR-003",
      unitCode: "B-205",
      compound: "June",
      unitType: "Villa",
      clientName: "Mona Ali",
      salesperson: "Karim Said",
      salespersonEmail: "karim.s@sakneen.com",
      requestedAt: addHours(now, -30),
      approvedAt: addHours(now, -28),
      expiresAt: addHours(now, 20), // 20 hours remaining
      status: "active",
      reason: "Client finalizing bank loan approval",
      decidedBy: "User Admin",
      decidedAt: addHours(now, -28),
    },
    {
      id: "BR-004",
      unitCode: "E-102",
      compound: "June",
      unitType: "Apartment",
      clientName: "Omar Fathy",
      salesperson: "Mai Khalil",
      salespersonEmail: "mai.k@sakneen.com",
      requestedAt: addHours(now, -40),
      approvedAt: addHours(now, -38),
      expiresAt: addHours(now, 10), // 10 hours remaining
      status: "active",
      reason: "Client comparing with competitor property",
      decidedBy: "User Admin",
      decidedAt: addHours(now, -38),
    },
    // Expired (was active, time ran out - needs admin action)
    {
      id: "BR-005",
      unitCode: "D-401",
      compound: "Ramla",
      unitType: "Chalet",
      clientName: "Layla Mahmoud",
      salesperson: "Ahmed Farid",
      salespersonEmail: "ahmed.f@sakneen.com",
      requestedAt: addHours(now, -72),
      approvedAt: addHours(now, -70),
      expiresAt: addHours(now, -22), // Expired 22 hours ago
      status: "expired",
      reason: "Waiting for client spouse approval",
      decidedBy: "User Admin",
      decidedAt: addHours(now, -70),
    },
    {
      id: "BR-006",
      unitCode: "F-503",
      compound: "Ogami",
      unitType: "Penthouse",
      clientName: "Sherif Nabil",
      salesperson: "Sarah Mohamed",
      salespersonEmail: "sarah.m@sakneen.com",
      requestedAt: addHours(now, -120),
      approvedAt: addHours(now, -118),
      expiresAt: addHours(now, -22), // Expired
      status: "expired",
      reason: "High-value client negotiating terms",
      extendedHours: 48,
      decidedBy: "User Admin",
      decidedAt: addHours(now, -70),
    },
    // Reserved (success - salesperson completed reservation)
    {
      id: "BR-007",
      unitCode: "G-201",
      compound: "Ramla",
      unitType: "Villa",
      clientName: "Tarek Mansour",
      salesperson: "Omar Tarek",
      salespersonEmail: "omar.t@sakneen.com",
      requestedAt: addHours(now, -96),
      approvedAt: addHours(now, -94),
      expiresAt: addHours(now, -46),
      status: "reserved",
      reason: "Client awaiting investment committee approval",
      decidedBy: "User Admin",
      decidedAt: addHours(now, -50),
    },
    // Rejected (admin rejected initial request)
    {
      id: "BR-008",
      unitCode: "H-102",
      compound: "June",
      unitType: "Studio",
      clientName: "Hana Mostafa",
      salesperson: "Karim Said",
      salespersonEmail: "karim.s@sakneen.com",
      requestedAt: addHours(now, -24),
      expiresAt: addHours(now, 48),
      status: "rejected",
      reason: "Client wants to hold unit for 2 weeks",
      decidedBy: "User Admin",
      decidedAt: addHours(now, -22),
    },
    // Released (admin released after expiry)
    {
      id: "BR-009",
      unitCode: "I-305",
      compound: "Ogami",
      unitType: "Apartment",
      clientName: "Marwan Adel",
      salesperson: "Nour Hassan",
      salespersonEmail: "nour.h@sakneen.com",
      requestedAt: addHours(now, -100),
      approvedAt: addHours(now, -98),
      expiresAt: addHours(now, -50),
      status: "released",
      reason: "Client needed more time for financing",
      decidedBy: "User Admin",
      decidedAt: addHours(now, -48),
    },
  ];
};

export const useBlockingRequestsStore = create<BlockingRequestsState>((set) => ({
  requests: generateMockData(),

  addRequest: (request) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          ...request,
          id: `BR-${String(state.requests.length + 1).padStart(3, "0")}`,
        },
      ],
    })),

  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((req) => (req.id === id ? { ...req, ...updates } : req)),
    })),

  // Admin approves pending request -> starts 48h timer
  approveRequest: (id, adminName) =>
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id !== id) return req;
        const now = new Date();
        return {
          ...req,
          status: "active" as const,
          approvedAt: now,
          expiresAt: addHours(now, 48), // Start 48h timer
          decidedBy: adminName,
          decidedAt: now,
        };
      }),
    })),

  // Admin rejects pending request
  rejectRequest: (id, adminName) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected" as const,
              decidedBy: adminName,
              decidedAt: new Date(),
            }
          : req,
      ),
    })),

  // Salesperson completed reservation
  markAsReserved: (id, adminName) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "reserved" as const,
              decidedBy: adminName,
              decidedAt: new Date(),
            }
          : req,
      ),
    })),

  // Admin extends expired blocking
  extendRequest: (id, hours, adminName) =>
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id !== id) return req;
        const now = new Date();
        return {
          ...req,
          status: "active" as const,
          expiresAt: addHours(now, hours),
          extendedHours: (req.extendedHours || 0) + hours,
          decidedBy: adminName,
          decidedAt: now,
        };
      }),
    })),

  // Admin releases unit (makes available again)
  releaseUnit: (id, adminName) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "released" as const,
              decidedBy: adminName,
              decidedAt: new Date(),
            }
          : req,
      ),
    })),
}));
