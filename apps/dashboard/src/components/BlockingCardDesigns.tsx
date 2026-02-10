import { Building2, Clock, Timer, User, Briefcase, FileText, Quote, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlockingRequest } from "../store/blockingRequestsStore";

// --- Mock Data ---

const now = new Date();
const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 60 * 60 * 1000);

const MOCK_REQUEST_BASE: Omit<BlockingRequest, "id" | "status" | "expiresAt" | "requestedAt"> = {
  unitCode: "A-101",
  compound: "Ramla",
  unitType: "Apartment",
  clientName: "Ahmed Hassan",
  salesperson: "Sarah Mohamed",
  salespersonEmail: "sarah.m@sakneen.com",
  reason: "Client is preparing payment documents and finalizing bank approval",
};

const MOCK_PENDING: BlockingRequest = {
  ...MOCK_REQUEST_BASE,
  id: "BR-001",
  status: "pending",
  requestedAt: addHours(now, -2),
  expiresAt: addHours(now, 46),
};

const MOCK_ACTIVE: BlockingRequest = {
  ...MOCK_REQUEST_BASE,
  id: "BR-002",
  status: "active",
  requestedAt: addHours(now, -10),
  approvedAt: addHours(now, -8),
  expiresAt: addHours(now, 38), // 38h remaining
  decidedBy: "User Admin",
  decidedAt: addHours(now, -8),
};

const MOCK_EXPIRED: BlockingRequest = {
  ...MOCK_REQUEST_BASE,
  id: "BR-003",
  status: "expired",
  requestedAt: addHours(now, -50),
  approvedAt: addHours(now, -48),
  expiresAt: addHours(now, -2), // Expired 2h ago
  decidedBy: "User Admin",
  decidedAt: addHours(now, -48),
};

// --- Shared Components ---

const ActionButtons = ({ status, design = "solid" }: { status: "pending" | "active" | "expired"; design?: "solid" | "outline" | "ghost" }) => {
  if (status === "pending") {
    return (
      <div className="flex gap-2 w-full">
        <Button size="sm" className="flex-1 bg-emerald-500 text-white font-medium shadow-sm hover:bg-emerald-600 h-9 rounded-lg">
          Approve
        </Button>
        <Button size="sm" className="flex-1 font-medium h-9 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-gray-50 bg-gray-50/50">
          Reject
        </Button>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="flex gap-2 w-full">
        <Button size="sm" className="flex-1 bg-emerald-500 text-white font-medium shadow-sm hover:bg-emerald-600 h-9 rounded-lg">
          Reserved
        </Button>
        <Button size="sm" className="flex-1 font-medium h-9 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 bg-gray-50/50">
          Cancel
        </Button>
      </div>
    );
  }
  if (status === "expired") {
    return (
      <div className="flex gap-2 w-full">
        <Button size="sm" className="flex-1 bg-emerald-500 text-white font-medium shadow-sm hover:bg-emerald-600 h-9 rounded-lg">
          Extend
        </Button>
        <Button size="sm" className="flex-1 font-medium h-9 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 bg-red-50/50">
          Release
        </Button>
      </div>
    );
  }
  return null;
};

const TimeBar = ({ status }: { status: "pending" | "active" | "expired" }) => {
  if (status === "pending") return null;
  const percentage = status === "active" ? 60 : 100;
  const color = status === "active" ? "bg-blue-500" : "bg-red-500";
  const label = status === "active" ? "38h remaining" : "Expired 2d ago";
  const labelColor = status === "active" ? "text-blue-600" : "text-red-600";
  const icon = status === "active" ? <Timer size={10} /> : <Clock size={10} />;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${labelColor}`}>
          {icon} {label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

// Base Card Wrapper
const BaseCard = ({ status, children }: { status: "pending" | "active" | "expired"; children: React.ReactNode }) => {
  const request = status === "pending" ? MOCK_PENDING : status === "active" ? MOCK_ACTIVE : MOCK_EXPIRED;
  const statusColor = status === "pending" ? "bg-amber-100 text-amber-700" : status === "active" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700";
  const borderColor = status === "active" ? "border-blue-200" : status === "expired" ? "border-red-200" : "border-gray-200 hover:border-gray-300";

  return (
    <div className={`bg-white rounded-xl border ${borderColor} p-5 shadow-sm hover:shadow-md transition-all h-full flex flex-col min-h-[340px]`}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{request.unitCode}</h3>
          <p className="text-xs text-gray-500 font-medium">{request.compound}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${statusColor}`}>{status}</span>
      </div>

      <div className="flex-1 flex flex-col">
        {children}
        <div className="mt-auto">
          <TimeBar status={status} />
        </div>
      </div>

      <div className="mt-5 pt-0">
        <ActionButtons status={status} />
      </div>
    </div>
  );
};

// --- Variations ---

// 1. Grid & Tint
const Design1Card = ({ status }: { status: "pending" | "active" | "expired" }) => {
  const request = status === "pending" ? MOCK_PENDING : status === "active" ? MOCK_ACTIVE : MOCK_EXPIRED;
  return (
    <BaseCard status={status}>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Client</span>
          <span className="text-xs font-bold text-gray-900 truncate block" title={request.clientName}>
            {request.clientName}
          </span>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Agent</span>
          <span className="text-xs font-bold text-gray-900 truncate block" title={request.salesperson}>
            {request.salesperson.split(" ")[0]}
          </span>
        </div>
      </div>
      <div className="px-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Reason</span>
        <p className="text-xs text-gray-600 leading-relaxed">{request.reason}</p>
      </div>
    </BaseCard>
  );
};

// 2. Linear List (Clean)
const Design2Card = ({ status }: { status: "pending" | "active" | "expired" }) => {
  const request = status === "pending" ? MOCK_PENDING : status === "active" ? MOCK_ACTIVE : MOCK_EXPIRED;
  return (
    <BaseCard status={status}>
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <User size={14} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{request.clientName}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Client</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Briefcase size={14} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{request.salesperson}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Salesperson</p>
          </div>
        </div>
      </div>
      <div className="pl-3 border-l-2 border-gray-200 py-1">
        <p className="text-xs text-gray-600 italic">"{request.reason}"</p>
      </div>
    </BaseCard>
  );
};

// 3. Integrated Flow
const Design3Card = ({ status }: { status: "pending" | "active" | "expired" }) => {
  const request = status === "pending" ? MOCK_PENDING : status === "active" ? MOCK_ACTIVE : MOCK_EXPIRED;
  return (
    <BaseCard status={status}>
      <div className="space-y-4 mb-2">
        <div>
          <span className="text-xs font-medium text-gray-500">Blocking requested for </span>
          <span className="text-sm font-bold text-gray-900">{request.clientName}</span>
          <span className="text-xs font-medium text-gray-500"> by </span>
          <span className="text-sm font-bold text-gray-900">{request.salesperson}</span>
        </div>
        <div className="flex gap-2 items-start">
          <MessageSquare size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600 leading-relaxed font-medium">{request.reason}</p>
        </div>
      </div>
    </BaseCard>
  );
};

// 4. Inner Cards (Boxed)
const Design4Card = ({ status }: { status: "pending" | "active" | "expired" }) => {
  const request = status === "pending" ? MOCK_PENDING : status === "active" ? MOCK_ACTIVE : MOCK_EXPIRED;
  return (
    <BaseCard status={status}>
      <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 mb-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Client</span>
          <span className="font-semibold text-gray-900">{request.clientName}</span>
        </div>
        <div className="w-full h-px bg-gray-200" />
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Agent</span>
          <span className="font-semibold text-gray-900">{request.salesperson.split(" ")[0]}</span>
        </div>
      </div>
      <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Reason</span>
        <p className="text-xs text-gray-600">{request.reason}</p>
      </div>
    </BaseCard>
  );
};

// 5. Minimal Compact (Avatars)
const Design5Card = ({ status }: { status: "pending" | "active" | "expired" }) => {
  const request = status === "pending" ? MOCK_PENDING : status === "active" ? MOCK_ACTIVE : MOCK_EXPIRED;
  return (
    <BaseCard status={status}>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">AH</div>
          <div>
            <p className="text-xs font-bold text-gray-900">{request.clientName}</p>
            <p className="text-[10px] text-gray-400">Client</p>
          </div>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-xs font-bold text-gray-900">{request.salesperson.split(" ")[0]}</p>
            <p className="text-[10px] text-gray-400">Agent</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">SM</div>
        </div>
      </div>
      <div className="relative pl-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
        <p className="text-xs text-gray-600 italic leading-relaxed py-0.5">"{request.reason}"</p>
      </div>
    </BaseCard>
  );
};

export const BLOCKING_CARD_DESIGNS = [
  { id: 1, name: "Grid & Tint", Component: Design1Card },
  { id: 2, name: "Linear List", Component: Design2Card },
  { id: 3, name: "Integrated Flow", Component: Design3Card },
  { id: 4, name: "Inner Cards", Component: Design4Card },
  { id: 5, name: "Avatar Row", Component: Design5Card },
];
