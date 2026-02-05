import { useState, useMemo } from "react";
import { Shield, Clock, AlertTriangle, RefreshCw, Building2, Timer, ChevronDown, Search, Filter, CheckCircle2, XCircle, Unlock } from "lucide-react";
import { Button } from "@heroui/react";
import { useBlockingRequestsStore } from "../store/blockingRequestsStore";
import type { BlockingRequest, BlockingStatus } from "../store/blockingRequestsStore";
import { motion, AnimatePresence } from "framer-motion";

type FilterStatus = "all" | "pending" | "active" | "expired" | "completed";

const formatTimeRemaining = (expiresAt: Date, status: BlockingStatus): string => {
  // For non-time-sensitive statuses, don't show time
  if (status === "reserved" || status === "rejected" || status === "released") {
    return "";
  }

  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) {
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      return `Expired ${Math.floor(hours / 24)}d ago`;
    }
    return hours > 0 ? `Expired ${hours}h ${minutes}m ago` : `Expired ${minutes}m ago`;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
    return `${Math.floor(hours / 24)}d ${hours % 24}h remaining`;
  }
  return hours > 0 ? `${hours}h ${minutes}m remaining` : `${minutes}m remaining`;
};

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${day} ${month}, ${year}, ${time}`;
};

const getTimeStatus = (expiresAt: Date, status: BlockingStatus): "critical" | "warning" | "safe" | "expired" | "none" => {
  // For completed statuses, time doesn't matter
  if (status === "reserved" || status === "rejected" || status === "released") {
    return "none";
  }

  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  const hoursRemaining = diff / (1000 * 60 * 60);

  if (diff <= 0) return "expired";
  if (hoursRemaining <= 6) return "critical";
  if (hoursRemaining <= 24) return "warning";
  return "safe";
};

interface ExtendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: (hours: number) => void;
  unitCode: string;
}

const ExtendModal = ({ isOpen, onClose, onExtend, unitCode }: ExtendModalProps) => {
  const [hours, setHours] = useState(24);
  const presetHours = [12, 24, 48, 72];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <RefreshCw size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Extend Blocking</h3>
            <p className="text-sm text-gray-500">Unit {unitCode}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Select Extension Duration</label>
          <div className="grid grid-cols-4 gap-2">
            {presetHours.map((preset) => (
              <button key={preset} onClick={() => setHours(preset)} className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${hours === preset ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"}`}>
                {preset}h
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Custom:</span>
            <input type="number" value={hours} onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={168} className="w-full pl-20 pr-16 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">hours</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onPress={onClose} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">
            Cancel
          </Button>
          <Button
            onPress={() => {
              onExtend(hours);
              onClose();
            }}
            className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 font-medium shadow-lg shadow-emerald-200"
          >
            Extend for {hours}h
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

interface BlockingRequestCardProps {
  request: BlockingRequest;
  onApprove: () => void;
  onReject: () => void;
  onExtend: () => void;
  onRelease: () => void;
  onMarkReserved: () => void;
}

const BlockingRequestCard = ({ request, onApprove, onReject, onExtend, onRelease, onMarkReserved }: BlockingRequestCardProps) => {
  const timeStatus = getTimeStatus(request.expiresAt, request.status);

  // Determine effective status (active can become expired if time runs out)
  const isTimeExpired = timeStatus === "expired";
  const effectiveStatus = request.status === "active" && isTimeExpired ? "expired" : request.status;

  // Determine card styling based on status
  const getCardStyles = () => {
    switch (effectiveStatus) {
      case "expired":
        return "border-red-200 ring-1 ring-red-100";
      case "rejected":
      case "released":
        return "border-gray-200 opacity-60 bg-gray-50";
      case "reserved":
        return "border-emerald-200 ring-1 ring-emerald-100";
      case "active":
        return "border-blue-200";
      case "pending":
        return "border-amber-200 ring-1 ring-amber-100";
      default:
        return "border-gray-200 hover:border-gray-300";
    }
  };

  const getUnitBadgeStyles = () => {
    switch (effectiveStatus) {
      case "expired":
        return "bg-red-100 text-red-700";
      case "reserved":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
      case "released":
        return "bg-gray-200 text-gray-600";
      case "active":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  // Calculate progress percentage for time visualization
  const getTimeProgress = () => {
    if (effectiveStatus === "reserved" || effectiveStatus === "rejected" || effectiveStatus === "released") {
      return 0;
    }
    const startTime = request.approvedAt || request.requestedAt;
    const now = new Date();
    const totalDuration = request.expiresAt.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    return isTimeExpired ? 100 : progress;
  };

  const progressColors: Record<string, string> = {
    safe: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
    expired: "bg-red-400",
    none: "bg-gray-300",
  };

  const renderActions = () => {
    switch (effectiveStatus) {
      case "pending":
        return (
          <div className="flex gap-2 w-full">
            <Button onPress={onApprove} className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 font-semibold h-9 rounded-lg shadow-sm transition-all hover:translate-y-[-1px]">
              Approve
            </Button>
            <Button onPress={onReject} className="flex-1 bg-white text-red-600 hover:bg-red-50 border border-gray-200 font-semibold h-9 rounded-lg transition-all hover:border-red-200">
              Reject
            </Button>
          </div>
        );
      case "active":
        return (
          <div className="flex gap-2 w-full">
            <Button onPress={onMarkReserved} className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 font-semibold h-9 rounded-lg shadow-sm transition-all hover:translate-y-[-1px]">
              Reserved
            </Button>
            <Button onPress={onRelease} className="flex-1 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 font-semibold h-9 rounded-lg transition-all hover:border-gray-300">
              Cancel
            </Button>
          </div>
        );
      case "expired":
        return (
          <div className="flex gap-2 w-full">
            <Button onPress={onExtend} className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 font-semibold h-9 rounded-lg shadow-sm transition-all hover:translate-y-[-1px]">
              Extend
            </Button>
            <Button onPress={onRelease} className="flex-1 bg-white text-red-600 hover:bg-red-50 border border-red-200 font-semibold h-9 rounded-lg transition-all hover:border-red-300">
              Release
            </Button>
          </div>
        );
      default:
        // Reserved, Rejected, Released - show status info
        return (
          <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-400 bg-gray-50 rounded-lg border border-gray-100/50">
            {effectiveStatus === "reserved" ? <CheckCircle2 size={14} className="text-emerald-500" /> : effectiveStatus === "rejected" ? <XCircle size={14} className="text-red-400" /> : <Unlock size={14} className="text-gray-400" />}
            <span>
              {effectiveStatus === "reserved" ? "Reserved" : effectiveStatus === "rejected" ? "Rejected" : "Released"} on {formatDate(request.decidedAt || new Date())}
            </span>
          </div>
        );
    }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all h-full flex flex-col ${getCardStyles()}`}>
      {/* Header: Unit Code and Status */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{request.unitCode}</h3>
          <p className="text-[10px] text-gray-500 font-medium">{request.compound}</p>
          <p className="text-[9px] text-gray-400 mt-0.5">Requested {formatDate(request.requestedAt)}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getUnitBadgeStyles()}`}>{effectiveStatus === "active" ? "Active Blocking" : effectiveStatus.replace("_", " ")}</span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        {/* People Section - REFINED (Avatar Row Design) */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[9px] font-bold border border-blue-100 shrink-0">{request.clientName.charAt(0)}</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-900 leading-tight truncate">{request.clientName}</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Client</p>
            </div>
          </div>

          <div className="h-4 w-px bg-gray-100 mx-2 shrink-0" />

          <div className="flex items-center gap-2 text-right justify-end flex-1 min-w-0 ml-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-900 leading-tight truncate">{request.salesperson.split(" ")[0]}</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Agent</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center text-[9px] font-bold border border-gray-100 shrink-0">{request.salesperson.charAt(0)}</div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="relative pl-2.5 mb-2 border-l-2 border-gray-200 ml-1">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
          <p className="text-[11px] text-gray-600 italic leading-relaxed py-0.5 line-clamp-2">"{request.reason}"</p>
        </div>

        {/* Extended Info (if any) */}
        {request.extendedHours && request.extendedHours > 0 && (
          <p className="text-[9px] text-amber-600 font-medium mt-0.5 mb-1 flex items-center gap-1">
            <RefreshCw size={9} /> Extended by {request.extendedHours}h
          </p>
        )}

        {/* Time Bar */}
        <div className="mt-auto pt-1">
          <div className="min-h-[26px]">
            {(effectiveStatus === "active" || effectiveStatus === "expired") && (
              <div className="mt-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${isTimeExpired ? "text-red-600" : "text-blue-600"}`}>
                    {isTimeExpired ? <Clock size={9} /> : <Timer size={9} />}
                    {formatTimeRemaining(request.expiresAt, effectiveStatus)}
                  </span>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${progressColors[timeStatus]}`} style={{ width: `${getTimeProgress()}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 pt-0">{renderActions()}</div>
    </motion.div>
  );
};

const BlockingRequestsPage = () => {
  const { requests, approveRequest, rejectRequest, extendRequest, releaseUnit, markAsReserved } = useBlockingRequestsStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BlockingRequest | null>(null);

  const adminName = "User Admin";

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    // Filter by status
    if (filterStatus === "pending") {
      result = result.filter((r) => r.status === "pending");
    } else if (filterStatus === "active") {
      result = result.filter((r) => r.status === "active" && getTimeStatus(r.expiresAt, r.status) !== "expired");
    } else if (filterStatus === "expired") {
      result = result.filter((r) => r.status === "expired" || (r.status === "active" && getTimeStatus(r.expiresAt, r.status) === "expired"));
    } else if (filterStatus === "completed") {
      result = result.filter((r) => r.status === "reserved" || r.status === "rejected" || r.status === "released");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) => r.unitCode.toLowerCase().includes(query) || r.compound.toLowerCase().includes(query) || r.salesperson.toLowerCase().includes(query) || r.clientName.toLowerCase().includes(query) || r.reason.toLowerCase().includes(query));
    }

    // Sort: Expired first, then pending, then active, then completed
    result.sort((a, b) => {
      const statusOrder: Record<string, number> = { expired: 0, pending: 1, active: 2, reserved: 3, rejected: 4, released: 5 };
      const aStatus = a.status === "active" && getTimeStatus(a.expiresAt, a.status) === "expired" ? "expired" : a.status;
      const bStatus = b.status === "active" && getTimeStatus(b.expiresAt, b.status) === "expired" ? "expired" : b.status;
      if (statusOrder[aStatus] !== statusOrder[bStatus]) {
        return statusOrder[aStatus] - statusOrder[bStatus];
      }
      return a.expiresAt.getTime() - b.expiresAt.getTime();
    });

    return result;
  }, [requests, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const active = requests.filter((r) => r.status === "active" && getTimeStatus(r.expiresAt, r.status) !== "expired").length;
    const expired = requests.filter((r) => r.status === "expired" || (r.status === "active" && getTimeStatus(r.expiresAt, r.status) === "expired")).length;
    const completed = requests.filter((r) => r.status === "reserved" || r.status === "rejected" || r.status === "released").length;
    return { pending, active, expired, completed, total: requests.length };
  }, [requests]);

  const handleExtend = (request: BlockingRequest) => {
    setSelectedRequest(request);
    setExtendModalOpen(true);
  };

  return (
    <div className="h-full w-full bg-white text-gray-900 rounded-xl overflow-hidden font-sans border border-gray-200 flex flex-col shadow-sm">
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <Building2 size={20} />
          <span className="text-base font-bold text-gray-900 leading-none">Unit Blocking</span>
          <span className="text-gray-300 px-1">/</span>
          <span className="text-sm font-medium text-gray-500">All Requests</span>
        </div>
        <div className="flex gap-2">
          {stats.expired > 0 && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8 animate-pulse">
              <AlertTriangle size={12} />
              {stats.expired} Expired
            </div>
          )}
          {stats.active > 0 && (
            <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8">
              <Timer size={12} />
              {stats.active} Active
            </div>
          )}
          <div className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8">
            <Clock size={12} />
            {stats.pending} Pending
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Unit Blocking Requests</h1>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by unit, client, compound, salesperson..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white" />
          </div>

          <div className="relative">
            <Button onPress={() => setShowFilters(!showFilters)} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium h-10 px-4 rounded-xl">
              <Filter size={16} className="mr-2" />
              {filterStatus === "all" ? "All Requests" : filterStatus === "pending" ? "Pending" : filterStatus === "active" ? "Active" : filterStatus === "expired" ? "Expired" : "Completed"}
              <ChevronDown size={16} className="ml-2" />
            </Button>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[180px] z-20">
                  {[
                    { key: "all", label: "All Requests", count: stats.total },
                    { key: "pending", label: "Pending Approval", count: stats.pending },
                    { key: "active", label: "Active Blocking", count: stats.active },
                    { key: "expired", label: "Expired", count: stats.expired },
                    { key: "completed", label: "Completed", count: stats.completed },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setFilterStatus(item.key as FilterStatus);
                        setShowFilters(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 ${filterStatus === item.key ? "text-emerald-600 font-medium bg-emerald-50/50" : "text-gray-700"}`}
                    >
                      {item.label}
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{item.count}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No Requests Found</h3>
            <p className="text-sm text-gray-500">{searchQuery ? "Try adjusting your search query" : "There are no blocking requests matching your filter"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((request) => (
                <BlockingRequestCard key={request.id} request={request} onApprove={() => approveRequest(request.id, adminName)} onReject={() => rejectRequest(request.id, adminName)} onExtend={() => handleExtend(request)} onRelease={() => releaseUnit(request.id, adminName)} onMarkReserved={() => markAsReserved(request.id, adminName)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Extend Modal */}
      <AnimatePresence>
        {extendModalOpen && selectedRequest && (
          <ExtendModal
            isOpen={extendModalOpen}
            onClose={() => {
              setExtendModalOpen(false);
              setSelectedRequest(null);
            }}
            onExtend={(hours) => extendRequest(selectedRequest.id, hours, adminName)}
            unitCode={selectedRequest.unitCode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlockingRequestsPage;
