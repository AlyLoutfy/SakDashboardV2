import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreVertical, FileText, Upload, Users, Eye, FileCheck, Download, User, Building2, Check, X, Clock, AlertCircle, UserCheck, Image as LucideImage, RotateCw, Maximize2, Edit } from "lucide-react";
import { useSalesStore } from "../store/salesStore";
import ReservationDrawer from "../components/sales/ReservationDrawer";
import { useReservationRequestsStore, type ReservationRequest, type ReservationStatus, type ApprovalStep, type Approver } from "../store/reservationRequestsStore";
import DateRangePicker from "../components/common/DateRangePicker";
import { type DateRange } from "react-day-picker";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

// =============================================================================
// TYPES
// =============================================================================

type FilterStatus = "all" | "my_approvals" | "pending" | "blocked" | "approved" | "rejected" | "canceled" | "incomplete";

// Current user ID - in real app would come from auth context
const CURRENT_USER_ID = "O001"; // Sara Mostafa from Operations

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const formatDateTime = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${day} ${month}, ${year} at ${time}`;
};

const getTimeAgo = (date: Date): { text: string; hours: number } => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return { text: `${diffMins}m ago`, hours: diffHours };
  } else if (diffHours < 24) {
    return { text: `${Math.floor(diffHours)}h ago`, hours: diffHours };
  } else if (diffDays === 1) {
    return { text: "1 day ago", hours: diffHours };
  } else {
    return { text: `${diffDays} days ago`, hours: diffHours };
  }
};

const OVERDUE_THRESHOLD_HOURS = 48; // Items pending > 48 hours are considered overdue

const getStatusColor = (status: ReservationStatus): { bg: string; text: string; border: string } => {
  switch (status) {
    case "approved":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    case "blocked":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    case "pending":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    case "rejected":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
    case "canceled":
      return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
    case "incomplete":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  }
};

const getApproverTypeLabel = (type: ApprovalStep["type"]) => {
  switch (type) {
    case "individual":
      return "Specific Person";
    case "team":
      return "Any Team Member";
    case "either_or":
      return "Either Person";
    default:
      return type;
  }
};

const getApproverTypeIcon = (type: ApprovalStep["type"]) => {
  switch (type) {
    case "individual":
      return <User size={12} />;
    case "team":
      return <Users size={12} />;
    case "either_or":
      return <UserCheck size={12} />;
    default:
      return <User size={12} />;
  }
};

// =============================================================================
// STATUS BADGE
// =============================================================================

const StatusBadge = ({ status }: { status: ReservationStatus }) => {
  const colors = getStatusColor(status);
  const getStatusLabel = (s: ReservationStatus) => {
    switch (s) {
      case "pending":
        return "Blocking";
      case "blocked":
        return "Reserving";
      default:
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>{getStatusLabel(status)}</span>;
};

// =============================================================================
// APPROVAL FLOW MODAL
// =============================================================================

interface ApprovalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ReservationRequest | null;
  onApprove: (requestId: string, approver: Approver) => void;
  onReject: (requestId: string, approver: Approver, reason: string) => void;
  onCreateContract: (requestId: string, createdBy: Approver) => void;
}

// Helper Component for File Viewing (Accordion Style)
const AccordionFileViewer = ({ label, filename }: { label: string; filename: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isImage = filename.match(/\.(jpg|jpeg|png)$/i);

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullScreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <div className="border-b border-gray-100 last:border-0 bg-white group hover:bg-gray-50/50 transition-colors">
        <div className="flex justify-between items-center px-4 py-3 cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
          {/* Left: Label */}
          <span className="text-[11px] font-medium text-gray-500 w-1/3 group-hover:text-gray-700 transition-colors truncate" title={label}>
            {label}
          </span>

          {/* Right: Generic View + Chevron */}
          <div className="flex items-center justify-end gap-3 flex-1">
            <div className="flex items-center gap-2 text-right">
              {isImage ? <LucideImage size={14} className="text-blue-500" /> : <FileText size={14} className="text-red-500" />}
              <span className={`text-xs font-semibold text-gray-900 ${isOpen ? "text-blue-600" : ""}`}>View File</span>
            </div>

            <div className={`p-1 rounded-full text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${isOpen ? "rotate-180 text-blue-500 bg-blue-50" : ""}`}>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div key="accordion-content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
              {/* Content Area */}
              <div className="px-4 pb-4 pt-0">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center relative shadow-inner">
                  {isImage ? (
                    <>
                      <div className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm rounded-lg border border-gray-100 p-1 cursor-zoom-in group/image" onClick={() => setIsFullScreen(true)}>
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-colors z-10 flex items-center justify-center">
                          <Maximize2 size={24} className="text-white opacity-0 group-hover/image:opacity-100 drop-shadow-md transition-opacity" />
                        </div>
                        <img src="https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?q=80&w=800&auto=format&fit=crop" alt={label} className="max-h-[300px] object-contain transition-transform duration-300 rounded" style={{ transform: `rotate(${rotation}deg)` }} />
                      </div>

                      <div className="flex gap-2 mt-4 w-full justify-center">
                        <button onClick={handleRotate} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95">
                          <RotateCw size={14} /> Rotate
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95">
                          <Download size={14} /> Download
                        </button>
                        <button onClick={toggleFullScreen} className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all shadow-sm active:scale-95">
                          <Maximize2 size={14} /> Full Screen
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center py-4">
                      <FileText size={32} className="text-gray-300 mb-2" />
                      <span className="text-xs font-medium text-gray-500 mb-3">Preview not available for PDF</span>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={12} /> Download Document
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFullScreen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsFullScreen(false)}>
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
              <div className="text-white/80 text-sm font-medium px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">{label}</div>
              <div className="flex gap-2">
                <button onClick={handleRotate} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors" title="Rotate">
                  <RotateCw size={20} />
                </button>
                <button onClick={() => setIsFullScreen(false)} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors hover:bg-red-500/20 hover:text-red-200" title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full h-full flex items-center justify-center pointer-events-none">
              <img src="https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?q=80&w=800&auto=format&fit=crop" alt={label} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-auto cursor-default" style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.3s ease" }} onClick={(e) => e.stopPropagation()} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const ApprovalFlowModal = ({ isOpen, onClose, request, onApprove, onReject, onCreateContract }: ApprovalFlowModalProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "flow" | "history">("details");

  if (!isOpen || !request) return null;

  const currentUser: Approver = { id: "U001", name: "User Admin", email: "admin@sakneen.com" };
  const currentStep = request.approvalFlow[request.currentStepIndex];
  const canApprove = request.status === "pending" && currentStep?.status === "pending";
  const canCreateContract = request.status === "approved" && !request.contractRequestCreated;

  const handleApprove = () => {
    onApprove(request.id, currentUser);
    onClose();
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(request.id, currentUser, rejectionReason);
      setRejectionReason("");
      setShowRejectInput(false);
      onClose();
    }
  };

  const handleCreateContract = () => {
    onCreateContract(request.id, currentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/25 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col rounded-l-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Reservation #{request.reservationId}</h2>
                <StatusBadge status={request.status} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {request.client.name} • Unit {request.unit.unitId}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 py-1.5 bg-gray-50/50 border-b border-gray-100">
          <div className="flex gap-1">
            {[
              { key: "details", label: "Details" },
              { key: "flow", label: "Approval Flow" },
              { key: "history", label: "History" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab.key ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Summary Card */}
          {activeTab === "details" && (
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-3 mb-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Unit</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{request.unit.unitId}</p>
                  <p className="text-[10px] text-gray-400">{request.unit.compound}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Client</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{request.client.name}</p>
                  <p className="text-[10px] text-gray-400">{request.client.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Salesperson</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{request.salesperson.name}</p>
                  <p className="text-[10px] text-gray-400">{request.salesperson.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Lead ID</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{request.leadId || "—"}</p>
                  <p className="text-[10px] text-gray-400">Created {formatDate(request.createdAt)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-5">
              {/* Reservation Form Details */}
              {request.formResponse && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-200 flex items-center gap-2">
                    <FileText size={14} className="text-gray-500" />
                    <h3 className="text-xs font-bold text-gray-900">Reservation Form Response</h3>
                  </div>
                  <div>
                    {Object.entries(request.formResponse).map(([key, value]) => {
                      const isFile = String(value).match(/\.(jpg|jpeg|png|pdf)$/i) || key.toLowerCase().includes("upload");

                      if (isFile) {
                        return <AccordionFileViewer key={key} label={key} filename={String(value)} />;
                      }

                      return (
                        <div key={key} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors group">
                          <span className="text-[11px] font-medium text-gray-500 w-1/3 group-hover:text-gray-700 transition-colors truncate" title={key}>
                            {key}
                          </span>
                          <span className="text-xs font-semibold text-gray-900 flex-1 text-right truncate" title={String(value)}>
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "flow" && (
            <div className="space-y-6">
              {/* Phase 1: Unit Blocking Flow */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${request.blockingFlow.every((s) => s.status === "approved") ? "bg-emerald-100 text-emerald-700" : request.blockingFlow.some((s) => s.status === "rejected") ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>1</div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Unit Blocking</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${request.blockingFlow.every((s) => s.status === "approved") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : request.blockingFlow.some((s) => s.status === "rejected") ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{request.blockingFlow.every((s) => s.status === "approved") ? "Completed" : request.blockingFlow.some((s) => s.status === "rejected") ? "Rejected" : "In Progress"}</span>
                </div>
                <div>
                  {request.blockingFlow.map((step, index) => {
                    const isLast = index === request.blockingFlow.length - 1;
                    const isCurrent = request.currentPhase === "blocking" && index === request.blockingStepIndex && step.status === "pending";

                    return (
                      <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                        {!isLast && <div className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${step.status === "approved" ? "bg-emerald-200" : "bg-gray-100"}`} />}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${step.status === "approved" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : step.status === "rejected" ? "bg-red-50 border-red-500 text-red-600" : isCurrent ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-gray-50 border-gray-200 text-gray-300"}`}>{step.status === "approved" ? <Check size={16} strokeWidth={3} /> : step.status === "rejected" ? <X size={16} strokeWidth={3} /> : step.status === "pending" ? <Clock size={16} /> : <User size={16} />}</div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-bold ${step.status === "waiting" ? "text-gray-400" : "text-gray-900"}`}>{step.name}</h4>
                            {(step.approvedAt || step.rejectedAt) && <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${step.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>{step.approvedAt ? formatDateTime(step.approvedAt) : step.rejectedAt ? formatDateTime(step.rejectedAt) : ""}</span>}
                          </div>
                          <div className="mt-2 pl-1">
                            <div className="flex flex-wrap gap-2">
                              {step.requiredApprovers.map((approver) => {
                                const isTheApprover = step.approvedBy?.some((u) => u.id === approver.id);
                                const isTheRejecter = step.rejectedBy?.id === approver.id;
                                return (
                                  <div key={approver.id} className={`flex items-center gap-2 pr-2.5 pl-2 py-1 rounded-full border ${isTheApprover ? "bg-emerald-50 border-emerald-100" : isTheRejecter ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                                    <User size={12} className={isTheApprover ? "text-emerald-600 fill-current" : isTheRejecter ? "text-red-600 fill-current" : "text-gray-400 fill-current"} />
                                    <span className={`text-[10px] font-bold ${isTheApprover ? "text-emerald-700" : isTheRejecter ? "text-red-700" : "text-gray-600"}`}>{approver.name}</span>
                                    {isTheApprover && <Check size={10} className="text-emerald-600" strokeWidth={3} />}
                                    {isTheRejecter && <X size={10} className="text-red-600" strokeWidth={3} />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {step.rejectionReason && (
                            <div className="mt-2 pl-1">
                              <p className="text-xs text-red-500 italic">"{step.rejectionReason}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phase 2: Reservation Flow */}
              <div className={`bg-white p-4 rounded-xl border shadow-sm ${request.blockingFlow.every((s) => s.status === "approved") ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${request.reservationFlow.every((s) => s.status === "approved") ? "bg-emerald-100 text-emerald-700" : request.reservationFlow.some((s) => s.status === "rejected") ? "bg-red-100 text-red-700" : request.blockingFlow.every((s) => s.status === "approved") ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}>2</div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Reservation Approval</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${request.reservationFlow.every((s) => s.status === "approved") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : request.reservationFlow.some((s) => s.status === "rejected") ? "bg-red-50 text-red-700 border border-red-200" : !request.blockingFlow.every((s) => s.status === "approved") ? "bg-gray-50 text-gray-500 border border-gray-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{request.reservationFlow.every((s) => s.status === "approved") ? "Completed" : request.reservationFlow.some((s) => s.status === "rejected") ? "Rejected" : !request.blockingFlow.every((s) => s.status === "approved") ? "Waiting for Blocking" : "In Progress"}</span>
                </div>
                <div>
                  {request.reservationFlow.map((step, index) => {
                    const isLast = index === request.reservationFlow.length - 1;
                    const isCurrent = request.currentPhase === "reservation" && index === request.reservationStepIndex && step.status === "pending";

                    return (
                      <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                        {!isLast && <div className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${step.status === "approved" ? "bg-emerald-200" : "bg-gray-100"}`} />}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${step.status === "approved" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : step.status === "rejected" ? "bg-red-50 border-red-500 text-red-600" : isCurrent ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-gray-50 border-gray-200 text-gray-300"}`}>{step.status === "approved" ? <Check size={16} strokeWidth={3} /> : step.status === "rejected" ? <X size={16} strokeWidth={3} /> : step.status === "pending" ? <Clock size={16} /> : <User size={16} />}</div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-bold ${step.status === "waiting" ? "text-gray-400" : "text-gray-900"}`}>{step.name}</h4>
                            {(step.approvedAt || step.rejectedAt) && <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${step.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>{step.approvedAt ? formatDateTime(step.approvedAt) : step.rejectedAt ? formatDateTime(step.rejectedAt) : ""}</span>}
                          </div>
                          <div className="mt-2 pl-1">
                            <div className="flex flex-wrap gap-2">
                              {step.requiredApprovers.map((approver) => {
                                const isTheApprover = step.approvedBy?.some((u) => u.id === approver.id);
                                const isTheRejecter = step.rejectedBy?.id === approver.id;
                                return (
                                  <div key={approver.id} className={`flex items-center gap-2 pr-2.5 pl-2 py-1 rounded-full border ${isTheApprover ? "bg-emerald-50 border-emerald-100" : isTheRejecter ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                                    <User size={12} className={isTheApprover ? "text-emerald-600 fill-current" : isTheRejecter ? "text-red-600 fill-current" : "text-gray-400 fill-current"} />
                                    <span className={`text-[10px] font-bold ${isTheApprover ? "text-emerald-700" : isTheRejecter ? "text-red-700" : "text-gray-600"}`}>{approver.name}</span>
                                    {isTheApprover && <Check size={10} className="text-emerald-600" strokeWidth={3} />}
                                    {isTheRejecter && <X size={10} className="text-red-600" strokeWidth={3} />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {step.rejectionReason && (
                            <div className="mt-2 pl-1">
                              <p className="text-xs text-red-500 italic">"{step.rejectionReason}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {activeTab === "history" && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    user: { name: "Lina Mousa", initials: "LM", color: "bg-purple-100 text-purple-600" },
                    action: "Create Unit-Reservation",
                    date: "04-02-2026",
                    time: "02:30 PM",
                    changes: [
                      { field: "Lead Client Name", from: "", to: "galal fathy" },
                      { field: "Sales Person Full Name", from: "", to: "Raheem Mousa" },
                      { field: "Serial Number", from: "", to: "4867" },
                      { field: "Unit Name", from: "", to: "F-341-M" },
                      { field: "Phone Number", from: "", to: "+201555500798" },
                      { field: "Email", from: "", to: "N/A" },
                    ],
                  },
                  {
                    id: 2,
                    user: { name: "System Admin", initials: "SA", color: "bg-gray-100 text-gray-600" },
                    action: "Status Update",
                    date: "03-02-2026",
                    time: "09:15 AM",
                    changes: [{ field: "Status", from: "Draft", to: "Pending Approval" }],
                  },
                ].map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="pr-4">
                        <h4 className="font-bold text-gray-900 text-sm">{item.action}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-medium text-gray-500 mb-0.5">by {item.user.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold">
                          {item.date} • {item.time}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <table className="w-full text-xs table-fixed">
                        <thead>
                          <tr className="text-gray-400 text-left">
                            <th className="pb-2 font-medium w-1/3">Field</th>
                            <th className="pb-2 font-medium w-1/3">Old</th>
                            <th className="pb-2 font-medium w-1/3">New</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50">
                          {item.changes.map((change, i) => (
                            <tr key={i}>
                              <td className="py-2 font-medium text-gray-600 align-top break-words">{change.field}</td>
                              <td className="py-2 text-gray-400 align-top break-words">{change.from || "-"}</td>
                              <td className="py-2 font-bold text-gray-900 align-top break-words">{change.to}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {(canApprove || canCreateContract) && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            {showRejectInput ? (
              <div className="flex gap-3">
                <input type="text" placeholder="Enter rejection reason..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" autoFocus />
                <Button onClick={handleReject} disabled={!rejectionReason.trim()} className="bg-red-500 text-white hover:bg-red-600 font-bold rounded-lg px-4 h-9 text-xs">
                  Confirm Reject
                </Button>
                <Button onClick={() => setShowRejectInput(false)} className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-lg px-3 h-9 text-xs">
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 justify-end">
                {canApprove && (
                  <>
                    <Button onClick={() => setShowRejectInput(true)} className="bg-white text-red-600 hover:bg-red-50 border border-gray-200 font-bold rounded-lg px-4 h-9 text-xs">
                      Reject
                    </Button>
                    <Button onClick={handleApprove} className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold rounded-lg px-4 h-9 text-xs shadow-lg shadow-emerald-200">
                      <Check size={14} className="mr-1" />
                      Approve {currentStep?.name}
                    </Button>
                  </>
                )}
                {canCreateContract && (
                  <Button onClick={handleCreateContract} className="bg-blue-500 text-white hover:bg-blue-600 font-bold rounded-lg px-4 h-9 text-xs shadow-lg shadow-blue-200">
                    <FileCheck size={14} className="mr-1" />
                    Create Contract Request
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// =============================================================================
// LEAD DETAILS MODAL
// =============================================================================

const LeadDetailsModal = ({ isOpen, onClose, request }: { isOpen: boolean; onClose: () => void; request: ReservationRequest | null }) => {
  if (!isOpen || !request || !request.leadDetails) return null;
  const { leadDetails } = request;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <div className="fixed inset-0 bg-black/25 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col rounded-l-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header - Minimal */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-900">Lead Details</h2>
              <p className="text-[10px] text-gray-500">ID: {request.leadId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white border-t border-gray-100">
          <div className="divide-y divide-gray-100">
            {[
              { label: "Full Name", value: leadDetails.name },
              { label: "Mobile Number", value: leadDetails.phoneNumber },
              { label: "Secondary Number", value: leadDetails.phoneNumber2 },
              { label: "Email Address", value: "client@example.com" },
              { label: "Status", value: leadDetails.status },
              { label: "Project", value: leadDetails.project },
              { label: "Unit Interest", value: leadDetails.unitType },
              { label: "Job Title", value: leadDetails.jobTitle },
              { label: "Lead Source", value: leadDetails.leadSource },
              { label: "Sales Person", value: leadDetails.salesPerson },
              { label: "Direct / Indirect", value: leadDetails.directIndirect },
              { label: "Tag", value: leadDetails.tag },
              { label: "Notes", value: leadDetails.leadNotes },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center px-5 py-2.5 hover:bg-gray-50 transition-colors">
                <span className="text-[11px] font-medium text-gray-500 min-w-[140px]">{item.label}</span>
                <span className="text-[11px] font-bold text-gray-900 text-right truncate flex-1">{item.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// =============================================================================
// UNIT DETAILS MODAL
// =============================================================================

const UnitDetailsModal = ({ isOpen, onClose, request }: { isOpen: boolean; onClose: () => void; request: ReservationRequest | null }) => {
  const [activeTab, setActiveTab] = useState<"summary" | "approval" | "history">("summary");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !request) return null;
  const { unit } = request;

  // Reusable Item Component for cleaner code
  const Item = ({ label, value }: { label: string; value: string | number }) => (
    <div>
      <span className="text-gray-400 text-[9px] uppercase font-bold tracking-wider block mb-0.5">{label}</span>
      <span className="text-xs font-bold text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/25 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col rounded-l-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Unit Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {unit.compound} • {unit.unitId}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 bg-gray-50/50 border-b border-gray-100">
          <div className="flex gap-1">
            {[
              { key: "summary", label: "Summary" },
              { key: "approval", label: "Approval Progress" },
              { key: "history", label: "History" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab.key ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === "summary" && (
            <div className="animate-in fade-in duration-300 space-y-8">
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Unit Information</h2>
                <div className="bg-white rounded-xl p-5 grid grid-cols-4 gap-y-6 gap-x-4 border border-gray-200 shadow-sm">
                  <Item label="Unit ID" value={unit.unitId} />
                  <Item label="Price" value={(unit.price?.toLocaleString() || "0") + " EGP"} />
                  <Item label="Compound" value={unit.compound} />
                  <Item label="Type" value={unit.type} />

                  <Item label="Phase" value={unit.phaseName || "Phase 1"} />
                  <Item label="BUA" value={(unit.bua || 135) + " m²"} />
                  <Item label="Floor" value={unit.floor || "First"} />
                  <Item label="Garden" value={unit.gardenArea ? unit.gardenArea + " m²" : "—"} />
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Methods</h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3">Payment Plan</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Min DP</th>
                        <th className="px-4 py-3">Years</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {unit.paymentMethods?.map((pm, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{pm.name}</td>
                          <td className="px-4 py-3 text-gray-600">{pm.type}</td>
                          <td className="px-4 py-3 text-gray-600">{pm.minDownPayment}</td>
                          <td className="px-4 py-3 text-gray-600">{pm.years}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                            No payment methods
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-4">Active Reservation</h2>
                <div className="bg-gray-50/50 rounded-xl p-6 text-xs border border-gray-200 shadow-sm">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-6 text-center border-b border-gray-200 pb-3 w-fit mx-auto px-6">{formatDateTime(request.createdAt)}</div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-2xl mx-auto">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-500">Salesperson</span>
                        <span className="font-bold text-gray-900 text-right">{request.salesperson.name}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-500">Client Name</span>
                        <span className="font-bold text-gray-900 text-right">{request.client.name}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-500">Broker</span>
                        <span className="font-bold text-gray-900 text-right">—</span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-500">Sales Director</span>
                        <span className="font-bold text-gray-900 text-right">Mostafa Gamal</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-500">Client Number</span>
                        <span className="font-bold text-gray-900 text-right">{request.client.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-2 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 font-medium">Reservation Amount</span>
                      <span className="font-bold text-xl text-emerald-700">31,160 EGP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Contract Price</span>
                      <span className="font-bold text-gray-900 text-base">3,116,000 EGP</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "approval" && (
            <div className="animate-in fade-in duration-300 max-w-2xl mx-auto pt-4 space-y-6">
              {/* Phase 1: Unit Blocking Flow */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${request.blockingFlow.every((s) => s.status === "approved") ? "bg-emerald-100 text-emerald-700" : request.blockingFlow.some((s) => s.status === "rejected") ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>1</div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Unit Blocking</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${request.blockingFlow.every((s) => s.status === "approved") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : request.blockingFlow.some((s) => s.status === "rejected") ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{request.blockingFlow.every((s) => s.status === "approved") ? "Completed" : request.blockingFlow.some((s) => s.status === "rejected") ? "Rejected" : "In Progress"}</span>
                </div>
                {request.blockingFlow.map((step, idx) => {
                  const isLast = idx === request.blockingFlow.length - 1;
                  const isCompleted = step.status === "approved" || step.status === "rejected";
                  const isCurrent = request.currentPhase === "blocking" && idx === request.blockingStepIndex && step.status === "pending";

                  return (
                    <div key={step.id} className="relative flex gap-6 pb-8 last:pb-0">
                      {!isLast && <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${isCompleted ? "bg-emerald-200" : "bg-gray-100"}`}></div>}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${step.status === "approved" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : step.status === "rejected" ? "bg-red-50 border-red-500 text-red-600" : isCurrent ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-white border-gray-200 text-gray-300"}`}>{step.status === "approved" ? <Check size={20} strokeWidth={3} /> : step.status === "rejected" ? <X size={20} strokeWidth={3} /> : isCurrent ? <Clock size={20} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />}</div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-base font-bold ${step.status === "waiting" ? "text-gray-400" : "text-gray-900"}`}>{step.name}</h4>
                          {step.approvedAt && <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">{formatDateTime(step.approvedAt)}</span>}
                          {step.rejectedAt && <span className="text-xs text-red-400 font-medium bg-red-50 px-2 py-1 rounded">{formatDateTime(step.rejectedAt)}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          {getApproverTypeIcon(step.type)}
                          <span>{getApproverTypeLabel(step.type)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {step.requiredApprovers.map((approver) => {
                            const isTheApprover = step.approvedBy?.some((u) => u.id === approver.id);
                            const isTheRejecter = step.rejectedBy?.id === approver.id;
                            return (
                              <div key={approver.id} className={`flex items-center gap-2 pr-3 pl-2.5 py-1.5 rounded-full border transition-colors ${isTheApprover ? "bg-emerald-50 border-emerald-100" : isTheRejecter ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                                <User size={14} className={isTheApprover ? "text-emerald-600 fill-current" : isTheRejecter ? "text-red-600 fill-current" : "text-gray-400 fill-current"} />
                                <span className={`text-xs font-bold ${isTheApprover ? "text-emerald-700" : isTheRejecter ? "text-red-700" : "text-gray-600"}`}>{approver.name}</span>
                                {isTheApprover && <Check size={12} className="text-emerald-600" strokeWidth={3} />}
                                {isTheRejecter && <X size={12} className="text-red-600" strokeWidth={3} />}
                              </div>
                            );
                          })}
                        </div>
                        {step.rejectionReason && (
                          <div className="mt-3">
                            <p className="text-xs text-red-500 italic bg-red-50 px-3 py-2 rounded-lg">"{step.rejectionReason}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Phase 2: Reservation Flow */}
              <div className={`bg-white p-6 rounded-2xl border shadow-sm ${request.blockingFlow.every((s) => s.status === "approved") ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${request.reservationFlow.every((s) => s.status === "approved") ? "bg-emerald-100 text-emerald-700" : request.reservationFlow.some((s) => s.status === "rejected") ? "bg-red-100 text-red-700" : request.blockingFlow.every((s) => s.status === "approved") ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}>2</div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Reservation Approval</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${request.reservationFlow.every((s) => s.status === "approved") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : request.reservationFlow.some((s) => s.status === "rejected") ? "bg-red-50 text-red-700 border border-red-200" : !request.blockingFlow.every((s) => s.status === "approved") ? "bg-gray-50 text-gray-500 border border-gray-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{request.reservationFlow.every((s) => s.status === "approved") ? "Completed" : request.reservationFlow.some((s) => s.status === "rejected") ? "Rejected" : !request.blockingFlow.every((s) => s.status === "approved") ? "Waiting for Blocking" : "In Progress"}</span>
                </div>
                {request.reservationFlow.map((step, idx) => {
                  const isLast = idx === request.reservationFlow.length - 1;
                  const isCompleted = step.status === "approved" || step.status === "rejected";
                  const isCurrent = request.currentPhase === "reservation" && idx === request.reservationStepIndex && step.status === "pending";

                  return (
                    <div key={step.id} className="relative flex gap-6 pb-8 last:pb-0">
                      {!isLast && <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${isCompleted ? "bg-emerald-200" : "bg-gray-100"}`}></div>}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${step.status === "approved" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : step.status === "rejected" ? "bg-red-50 border-red-500 text-red-600" : isCurrent ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-white border-gray-200 text-gray-300"}`}>{step.status === "approved" ? <Check size={20} strokeWidth={3} /> : step.status === "rejected" ? <X size={20} strokeWidth={3} /> : isCurrent ? <Clock size={20} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />}</div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-base font-bold ${step.status === "waiting" ? "text-gray-400" : "text-gray-900"}`}>{step.name}</h4>
                          {step.approvedAt && <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">{formatDateTime(step.approvedAt)}</span>}
                          {step.rejectedAt && <span className="text-xs text-red-400 font-medium bg-red-50 px-2 py-1 rounded">{formatDateTime(step.rejectedAt)}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          {getApproverTypeIcon(step.type)}
                          <span>{getApproverTypeLabel(step.type)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {step.requiredApprovers.map((approver) => {
                            const isTheApprover = step.approvedBy?.some((u) => u.id === approver.id);
                            const isTheRejecter = step.rejectedBy?.id === approver.id;
                            return (
                              <div key={approver.id} className={`flex items-center gap-2 pr-3 pl-2.5 py-1.5 rounded-full border transition-colors ${isTheApprover ? "bg-emerald-50 border-emerald-100" : isTheRejecter ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                                <User size={14} className={isTheApprover ? "text-emerald-600 fill-current" : isTheRejecter ? "text-red-600 fill-current" : "text-gray-400 fill-current"} />
                                <span className={`text-xs font-bold ${isTheApprover ? "text-emerald-700" : isTheRejecter ? "text-red-700" : "text-gray-600"}`}>{approver.name}</span>
                                {isTheApprover && <Check size={12} className="text-emerald-600" strokeWidth={3} />}
                                {isTheRejecter && <X size={12} className="text-red-600" strokeWidth={3} />}
                              </div>
                            );
                          })}
                        </div>
                        {step.rejectionReason && (
                          <div className="mt-3">
                            <p className="text-xs text-red-500 italic bg-red-50 px-3 py-2 rounded-lg">"{step.rejectionReason}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="animate-in fade-in duration-300 max-w-3xl mx-auto pt-2">
              {unit.history && unit.history.length > 0 ? (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="space-y-4">
                    {unit.history.map((h) => (
                      <div key={h.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="pr-4">
                            <h4 className="font-bold text-gray-900 text-sm">{h.action}</h4>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-medium text-gray-500 mb-0.5">by {h.user.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold">{formatDateTime(h.date)}</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <table className="w-full text-xs table-fixed">
                            <thead>
                              <tr className="text-gray-400 text-left">
                                <th className="pb-2 font-medium w-1/3">Field</th>
                                <th className="pb-2 font-medium w-1/3">Old</th>
                                <th className="pb-2 font-medium w-1/3">New</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/50">
                              {h.details?.map((d, idx) => (
                                <tr key={idx}>
                                  <td className="py-2.5 font-medium text-gray-600 align-top break-words pr-2">{d.label}</td>
                                  <td className="py-2.5 text-gray-400 align-top break-words pr-2">{d.from || "-"}</td>
                                  <td className="py-2.5 font-bold text-gray-900 align-top break-words">{d.to}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 text-sm py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No history records found for this unit.</div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface TableRowProps {
  request: ReservationRequest;
  onViewFlow: (request: ReservationRequest) => void;
  onQuickReject?: (request: ReservationRequest, reason: string) => void;
  isPendingMyApproval?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
  onViewLead: (request: ReservationRequest) => void;
  onViewUnit: (request: ReservationRequest) => void;
  onQuickApprove?: (request: ReservationRequest) => void;
  onEdit: (request: ReservationRequest) => void;
}

const TableRow = ({ request, onViewFlow, onQuickApprove, onQuickReject, isPendingMyApproval, selected, onToggle, onViewLead, onViewUnit, onEdit }: TableRowProps) => {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const currentStep = request.approvalFlow[request.currentStepIndex];
  const completedSteps = request.approvalFlow.filter((s) => s.status === "approved").length;
  const totalSteps = request.approvalFlow.length;
  const progress = (completedSteps / totalSteps) * 100;

  // Calculate aging
  const aging = getTimeAgo(request.updatedAt);
  const isOverdue = request.status === "pending" && aging.hours >= OVERDUE_THRESHOLD_HOURS;

  const handleQuickReject = () => {
    if (rejectReason.trim() && onQuickReject) {
      onQuickReject(request, rejectReason.trim());
      setShowRejectInput(false);
      setShowRejectConfirm(false);
      setRejectReason("");
    }
  };

  const handleConfirmApprove = () => {
    onQuickApprove?.(request);
    setShowApproveConfirm(false);
  };

  return (
    <>
      {/* Confirmation Modal Overlay */}
      <AnimatePresence>
        {(showApproveConfirm || showRejectConfirm) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => {
              setShowApproveConfirm(false);
              setShowRejectConfirm(false);
              setRejectReason("");
            }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-100">
              {showApproveConfirm && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Approve Request</h3>
                      <p className="text-sm text-gray-500">Reservation #{request.reservationId}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">Are you sure you want to approve this reservation request? This will move it to the next approval step.</p>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Client</span>
                        <p className="font-medium text-gray-900">{request.client.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Unit</span>
                        <p className="font-medium text-gray-900">{request.unit.unitId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Step</span>
                        <p className="font-medium text-gray-900">{currentStep?.name || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Compound</span>
                        <p className="font-medium text-gray-900">{request.unit.compound}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowApproveConfirm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleConfirmApprove} className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                      <Check size={16} />
                      Approve
                    </button>
                  </div>
                </>
              )}

              {showRejectConfirm && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <X size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Reject Request</h3>
                      <p className="text-sm text-gray-500">Reservation #{request.reservationId}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">Please provide a reason for rejecting this reservation request.</p>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Client</span>
                        <p className="font-medium text-gray-900">{request.client.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Unit</span>
                        <p className="font-medium text-gray-900">{request.unit.unitId}</p>
                      </div>
                    </div>
                  </div>
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter rejection reason..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 mb-6 resize-none" rows={3} autoFocus />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRejectConfirm(false);
                        setRejectReason("");
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button onClick={handleQuickReject} disabled={!rejectReason.trim()} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <tr className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors group hover:relative hover:z-20 ${isOverdue ? "bg-red-50/30" : ""} ${selected ? "bg-blue-50/30" : ""}`}>
        {/* Checkbox */}
        <td className="py-2 px-2 pl-4 whitespace-nowrap w-10 text-left align-middle">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onToggle?.(request.id);
              }}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer w-4 h-4"
            />
          </div>
        </td>

        {/* Reservation ID */}
        {/* Reservation ID */}
        <td className="py-2 px-2 whitespace-nowrap">
          <button onClick={() => onViewFlow(request)} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200">
            {request.reservationId}
          </button>
        </td>

        {/* Unit ID - Clickable */}
        <td className="py-2 px-2 whitespace-nowrap">
          <button onClick={() => onViewUnit(request)} className="px-2 py-0.5 rounded-md bg-white text-gray-700 text-[11px] font-bold hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200 transition-all border border-gray-200 shadow-sm">
            {request.unit.unitId}
          </button>
        </td>

        {/* Client Name with Avatar */}
        <td className="py-2 px-2 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${request.client.name.length % 2 === 0 ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
              {request.client.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-900 leading-none">{request.client.name}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{request.client.phone}</span>
            </div>
          </div>
        </td>

        {/* Compound */}
        <td className="py-2 px-2 whitespace-nowrap">
          <span className="text-xs text-gray-600">{request.unit.compound}</span>
        </td>

        {/* Reservation Status */}
        <td className="py-2 px-2 whitespace-nowrap text-center">
          <StatusBadge status={request.status} />
        </td>

        {/* Approval Steps */}
        <td className="py-2 px-2 whitespace-nowrap">
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[9px] text-gray-500 font-medium">
              <span>
                {completedSteps}/{totalSteps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${request.status === "approved" ? "bg-emerald-500" : request.status === "rejected" ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[9px] text-gray-400 truncate max-w-[120px]">{request.status === "approved" ? "Completed" : request.status === "rejected" ? "Stopped" : currentStep?.name || "Pending"}</span>
          </div>
        </td>

        {/* Amount */}
        <td className="py-2 px-2 pl-8 whitespace-nowrap text-right">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-900">{request.unit.price ? request.unit.price.toLocaleString("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }) : "—"}</span>
          </div>
        </td>

        <td className="py-2 px-2 whitespace-nowrap">
          <span className="text-xs text-gray-700">{request.salesperson.name}</span>
        </td>

        {/* Lead ID */}
        <td className="py-2 px-2 whitespace-nowrap">
          {request.leadId && (
            <button onClick={() => onViewLead(request)} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200">
              {request.leadId}
            </button>
          )}
        </td>

        {/* Last Update */}
        <td className="py-2 px-2 whitespace-nowrap">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${isOverdue ? "bg-red-50 text-red-700 border-red-200" : request.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {isOverdue ? <AlertCircle size={10} className="stroke-[2.5]" /> : <Clock size={10} className="opacity-70" />}
            {aging.text}
          </div>
        </td>

        {/* Decision Column */}
        <td className="py-2 px-2 whitespace-nowrap text-center">
          {/* Quick Approve/Reject */}
          {isPendingMyApproval && request.status === "pending" && !showRejectInput && (
            <div className="flex items-center justify-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setShowApproveConfirm(true)} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                      <Check size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white px-2.5 py-1.5 rounded-lg border-none shadow-xl">
                    <p className="text-xs font-medium">Approve this step</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setShowRejectConfirm(true)} className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                      <X size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white px-2.5 py-1.5 rounded-lg border-none shadow-xl">
                    <p className="text-xs font-medium">Reject this request</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </td>

        {/* Actions (Menu Only) */}
        <td className="py-2 px-2 whitespace-nowrap text-right">
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors outline-none opacity-100">
                  <MoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-1 min-w-[160px]">
                <DropdownMenuItem onClick={() => onEdit(request)}>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Edit size={14} />
                    <span className="text-sm">Edit</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewFlow(request)}>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Eye size={14} />
                    <span className="text-sm">View Details</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Download size={14} />
                    <span className="text-sm">Export PDF</span>
                  </div>
                </DropdownMenuItem>
                {request.status === "approved" && !request.contractRequestCreated ? (
                  <DropdownMenuItem onClick={() => onViewFlow(request)} className="focus:bg-blue-50 focus:text-blue-600">
                    <div className="flex items-center gap-2 text-blue-600">
                      <FileCheck size={14} />
                      <span className="text-sm font-medium">Create Contract</span>
                    </div>
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    </>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

const ReservationRequestsPage = () => {
  const { requests, approveStep, rejectStep, createContractRequest, updateRequest } = useReservationRequestsStore();
  const { openReservationDrawer, isReservationDrawerOpen, updateReservationDetails, currentReservation, editingReservationId } = useSalesStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({ key: null, direction: null });

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    let newKey: string | null = key;

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") direction = "desc";
      else if (sortConfig.direction === "desc") {
        direction = null;
        newKey = null;
      }
    }
    setSortConfig({ key: newKey, direction });
  };

  const handleEditRequest = (request: ReservationRequest) => {
    setEditingRequestId(request.id);
    openReservationDrawer(request.unit.unitId, `${request.unit.compound} - ${request.unit.unitId}`);

    // Map request to reservation format
    updateReservationDetails({
      id: request.id,
      unitId: request.unit.unitId,
      unitTitle: `${request.unit.compound} - ${request.unit.unitId}`,
      client: {
        name: request.client.name,
        phone: request.client.phone || "",
        email: request.client.email || "",
        notes: "",
        nationalId: request.client.nationalId || "",
        idDocumentUrl: null,
      },
      paymentPlan: null, // Start with null to allow picking/creating
      paymentMethod: (request.formResponse?.["Payment Plan"] as string) || "Bank Transfer",
      paymentProofUrl: null,
      status: "pending",
    });
  };

  const handleReservationSubmit = (data: any) => {
    if (editingRequestId) {
      const formResponseUpdates: Record<string, any> = {};
      if (data.paymentPlan) {
        formResponseUpdates["Payment Plan"] = data.paymentPlan.name;
        // If custom plan, we could store more details if needed
      }
      if (data.paymentMethod) {
        formResponseUpdates["Payment Method"] = data.paymentMethod;
      }

      updateRequest(editingRequestId, {
        formResponse: {
          ...requests.find((r) => r.id === editingRequestId)?.formResponse,
          ...formResponseUpdates,
        },
        // Update client info if changed
        client: {
          ...requests.find((r) => r.id === editingRequestId)?.client!,
          ...data.client,
        },
      });
      setEditingRequestId(null);
    }
  };
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReservationRequest | null>(null);
  const [selectedLead, setSelectedLead] = useState<ReservationRequest | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ReservationRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  // Location filter states
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Salesperson filter
  const [showSalespersonDropdown, setShowSalespersonDropdown] = useState(false);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(null);

  // Date filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Get unique locations and salespersons
  const locations = useMemo(() => [...new Set(requests.map((r) => r.unit.compound))], [requests]);
  const salespersons = useMemo(() => [...new Set(requests.map((r) => r.salesperson.name))], [requests]);

  // Helper to check if request is pending current user's approval
  const isPendingMyApproval = (req: ReservationRequest) => {
    if (req.status !== "pending") return false;
    const currentStep = req.approvalFlow[req.currentStepIndex];
    if (!currentStep || currentStep.status !== "pending") return false;
    return currentStep.requiredApprovers.some((approver) => approver.id === CURRENT_USER_ID);
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    let result = [...requests];

    // Status filter
    if (filterStatus === "my_approvals") {
      result = result.filter(isPendingMyApproval);
    } else if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) => r.reservationId.toLowerCase().includes(query) || r.unit.unitId.toLowerCase().includes(query) || r.client.name.toLowerCase().includes(query) || r.salesperson.name.toLowerCase().includes(query));
    }

    // Location filter
    if (selectedLocation) {
      result = result.filter((r) => r.unit.compound === selectedLocation);
    }

    // Salesperson filter
    if (selectedSalesperson) {
      result = result.filter((r) => r.salesperson.name === selectedSalesperson);
    }

    // Date range filter
    if (dateRange?.from) {
      const start = startOfDay(dateRange.from);
      const end = endOfDay(dateRange.to || dateRange.from);
      result = result.filter((r) => {
        const date = r.createdAt;
        return isWithinInterval(date, { start, end });
      });
    }

    // Sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const getSortValue = (item: any, key: string) => {
          switch (key) {
            case "reservationId":
              return item.reservationId;
            case "unitId":
              return item.unit.unitId;
            case "client":
              return item.client.name;
            case "compound":
              return item.unit.compound;
            case "status":
              return item.status;
            case "amount":
              return item.totalPrice || 0;
            case "salesperson":
              return item.salesperson.name;
            default:
              return "";
          }
        };

        const aValue = getSortValue(a, sortConfig.key!);
        const bValue = getSortValue(b, sortConfig.key!);

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      // Default Sort by creation date (newest first)
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return result;
  }, [requests, filterStatus, searchQuery, selectedLocation, selectedSalesperson, dateRange, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedRequests.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Stats
  const stats = useMemo(() => {
    const myApprovals = requests.filter(isPendingMyApproval).length;
    return {
      all: requests.length,
      my_approvals: myApprovals,
      pending: requests.filter((r) => r.status === "pending").length,
      blocked: requests.filter((r) => r.status === "blocked").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
      canceled: requests.filter((r) => r.status === "canceled").length,
      incomplete: requests.filter((r) => r.status === "incomplete").length,
    };
  }, [requests]);

  const statusFilters: { key: FilterStatus; label: string; highlight?: boolean }[] = [
    { key: "my_approvals", label: "PENDING YOUR APPROVAL", highlight: true },
    { key: "all", label: "ALL" },
    { key: "pending", label: "BLOCKING" },
    { key: "blocked", label: "RESERVING" },
    { key: "approved", label: "APPROVED" },
    { key: "rejected", label: "REJECTED" },
    { key: "canceled", label: "CANCELED" },
    { key: "incomplete", label: "INCOMPLETE" },
  ];

  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <Building2 size={20} />
          <span className="text-base font-bold text-gray-900 leading-none">Reservation Requests</span>
        </div>
        <div className="flex gap-2 items-center">
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9, width: 0 }} animate={{ opacity: 1, scale: 1, width: "auto" }} exit={{ opacity: 0, scale: 0.9, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <Button className="bg-amber-600 text-white hover:bg-amber-700 font-medium h-8 px-3 rounded-lg text-xs whitespace-nowrap">Bulk Edit ({selectedIds.size})</Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-medium h-8 px-3 rounded-lg text-xs">
            <Upload size={14} className="mr-1.5" />
            Bulk Add
          </Button>
          <Button className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-medium h-8 px-3 rounded-lg text-xs">
            <FileText size={14} className="mr-1.5" />
            Edit Reservation Template PDF
          </Button>
          <Button className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-medium h-8 px-3 rounded-lg text-xs">
            <Download size={14} className="mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="flex gap-6 mb-2 border-b border-gray-100 overflow-x-auto shrink-0 px-4 pt-4">
          {statusFilters.map((filter) => {
            const isActive = filterStatus === filter.key;
            // Highlight "Pending Your Approval" specifically
            const isPendingYourApproval = filter.key === "my_approvals";
            const count = stats[filter.key];

            return (
              <motion.button
                key={filter.key}
                onClick={() => {
                  setFilterStatus(filter.key);
                  setCurrentPage(1);
                }}
                initial={false}
                animate={isPendingYourApproval ? (!isActive ? { color: ["#d97706", "#9ca3af", "#d97706"] } : { color: "#d97706" }) : undefined}
                transition={isActive ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={`relative pb-2 text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${isActive ? "text-amber-600" : isPendingYourApproval ? "text-amber-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                {filter.label}
                <motion.span
                  initial={false}
                  animate={
                    isPendingYourApproval
                      ? !isActive
                        ? {
                            backgroundColor: ["#fffbeb", "#f3f4f6", "#fffbeb"],
                            color: ["#92400e", "#6b7280", "#92400e"],
                            borderColor: ["#fcd34d", "#e5e7eb", "#fcd34d"],
                          }
                        : {
                            backgroundColor: "#fef3c7",
                            color: "#b45309",
                            borderColor: "transparent",
                          }
                      : undefined
                  }
                  transition={isActive ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-amber-100 text-amber-700" : isPendingYourApproval ? "bg-amber-50 text-amber-800 font-bold border border-amber-200" : "bg-gray-100 text-gray-500"}`}
                >
                  {count}
                </motion.span>
                {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t-full" transition={{ type: "spring", stiffness: 800, damping: 40 }} />}
              </motion.button>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap gap-3 mb-3 items-center shrink-0 px-4">
          {/* Search by Unit ID */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for unit ID"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <button onClick={() => setShowLocationDropdown(!showLocationDropdown)} className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 min-w-[120px]">
              <span>{selectedLocation || "Location"}</span>
              <ChevronDown size={14} className="ml-auto text-gray-400" />
            </button>
            <AnimatePresence>
              {showLocationDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLocationDropdown(false)} />
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 min-w-[160px] z-20 max-h-[200px] overflow-auto">
                    <button
                      onClick={() => {
                        setSelectedLocation(null);
                        setShowLocationDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${!selectedLocation ? "text-emerald-600 font-medium" : "text-gray-700"}`}
                    >
                      All Locations
                    </button>
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedLocation === loc ? "text-emerald-600 font-medium bg-emerald-50/50" : "text-gray-700"}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Status Dropdown (for secondary filter) */}
          <div className="relative">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
              <span>Status</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>

          {/* Date Range */}
          <DateRangePicker
            value={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setCurrentPage(1);
            }}
            className="min-w-[200px]"
          />

          {/* Salesperson Dropdown */}
          <div className="relative">
            <button onClick={() => setShowSalespersonDropdown(!showSalespersonDropdown)} className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 min-w-[120px]">
              <span>{selectedSalesperson || "Sales Persons"}</span>
              <ChevronDown size={14} className="ml-auto text-gray-400" />
            </button>
            <AnimatePresence>
              {showSalespersonDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSalespersonDropdown(false)} />
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 min-w-[180px] z-20 max-h-[200px] overflow-auto">
                    <button
                      onClick={() => {
                        setSelectedSalesperson(null);
                        setShowSalespersonDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${!selectedSalesperson ? "text-emerald-600 font-medium" : "text-gray-700"}`}
                    >
                      All Salespersons
                    </button>
                    {salespersons.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => {
                          setSelectedSalesperson(sp);
                          setShowSalespersonDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedSalesperson === sp ? "text-emerald-600 font-medium bg-emerald-50/50" : "text-gray-700"}`}
                      >
                        {sp}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* More Filters */}
          <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
            More
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden px-4 pb-2">
          <div className="flex-1 overflow-auto border border-gray-200 rounded-2xl">
            <table className="w-full min-w-[1500px] table-fixed">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-200 h-9">
                  <th className="py-1 px-2 pl-4 w-12 text-left align-middle">
                    <div className="flex items-center">
                      <input type="checkbox" onChange={handleSelectAll} checked={paginatedRequests.length > 0 && selectedIds.size === paginatedRequests.length} className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer w-4 h-4" />
                    </div>
                  </th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap pl-4 cursor-pointer hover:text-gray-700 transition-colors w-36" onClick={() => handleSort("reservationId")}>
                    <div className="flex items-center gap-1 group">
                      Reservation ID
                      <div className="w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {sortConfig.key === "reservationId" && (
                            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortConfig.direction === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                              <ChevronUp size={12} strokeWidth={2.5} className="text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors w-28" onClick={() => handleSort("unitId")}>
                    <div className="flex items-center gap-1 group">
                      Unit ID
                      <div className="w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {sortConfig.key === "unitId" && (
                            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortConfig.direction === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                              <ChevronUp size={12} strokeWidth={2.5} className="text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors w-64" onClick={() => handleSort("client")}>
                    <div className="flex items-center gap-1 group">
                      Client
                      <div className="w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {sortConfig.key === "client" && (
                            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortConfig.direction === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                              <ChevronUp size={12} strokeWidth={2.5} className="text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors w-40" onClick={() => handleSort("compound")}>
                    <div className="flex items-center gap-1 group">
                      Compound
                      <div className="w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {sortConfig.key === "compound" && (
                            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortConfig.direction === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                              <ChevronUp size={12} strokeWidth={2.5} className="text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors w-32" onClick={() => handleSort("status")}>
                    <div className="flex items-center justify-center gap-1 group">
                      Status
                      <div className="w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {sortConfig.key === "status" && (
                            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortConfig.direction === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                              <ChevronUp size={12} strokeWidth={2.5} className="text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-40">Approval Steps</th>
                  <th className="py-1 px-2 pl-8 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors w-36" onClick={() => handleSort("amount")}>
                    <div className="flex items-center justify-end gap-1 group">
                      Amount
                      <div className="w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {sortConfig.key === "amount" && (
                            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortConfig.direction === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                              <ChevronUp size={12} strokeWidth={2.5} className="text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 transition-colors w-40" onClick={() => handleSort("salesperson")}>
                    <div className="flex items-center gap-1 group">
                      Salesperson
                      <div className="w-4 h-4 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {sortConfig.key === "salesperson" && (
                            <motion.div key="icon" initial={{ opacity: 0, scale: 0.5, rotate: 0 }} animate={{ opacity: 1, scale: 1, rotate: sortConfig.direction === "asc" ? 0 : 180 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                              <ChevronUp size={12} strokeWidth={2.5} className="text-emerald-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap pl-4 w-24">Lead ID</th>
                  <th className="py-1 px-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-28">Last Update</th>
                  <th className="py-1 px-2 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap w-24 text-emerald-600">Decision</th>
                  <th className="py-1 px-2 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap pr-4 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <AlertCircle size={32} className="text-gray-300 mb-2" />
                        <p className="text-gray-500 text-sm">No reservation requests found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request) => {
                    // Check if this request is pending current user's approval
                    const pendingMyApproval = isPendingMyApproval(request);

                    return (
                      <TableRow
                        key={request.id}
                        request={request}
                        selected={selectedIds.has(request.id)}
                        onToggle={handleToggleRow}
                        onViewFlow={setSelectedRequest}
                        onViewLead={setSelectedLead}
                        onViewUnit={setSelectedUnit}
                        onEdit={handleEditRequest}
                        isPendingMyApproval={pendingMyApproval}
                        onQuickApprove={(req) => {
                          const currentStep = req.approvalFlow[req.currentStepIndex];
                          if (currentStep) {
                            const approver = currentStep.requiredApprovers.find((a) => a.id === CURRENT_USER_ID) || currentStep.requiredApprovers[0];
                            approveStep(req.id, approver);
                          }
                        }}
                        onQuickReject={(req, reason) => {
                          const currentStep = req.approvalFlow[req.currentStepIndex];
                          if (currentStep) {
                            const rejector = currentStep.requiredApprovers.find((a) => a.id === CURRENT_USER_ID) || currentStep.requiredApprovers[0];
                            rejectStep(req.id, rejector, reason);
                          }
                        }}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Fixed at bottom */}
          <div className="flex items-center justify-between px-4 py-2 mt-3 bg-gray-50/50 shrink-0 border-t border-gray-100">
            {/* Left: Items per page */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Rows per page:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 py-1 pl-2 pr-8 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Center: Page Controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none disabled:border-transparent">
                <ChevronLeft size={16} className="text-gray-600" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                    }
                    if (currentPage > totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    }
                  }
                  if (pageNum > totalPages) return null;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "text-gray-600 hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent"}`}>
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-gray-400 px-1 font-bold">...</span>
                    <button onClick={() => setCurrentPage(totalPages)} className="w-8 h-8 rounded-lg text-xs font-bold text-gray-600 hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent">
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none disabled:border-transparent">
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Right: Total Results */}
            <div className="text-xs text-gray-500 font-medium w-[140px] text-right">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} Results
            </div>
          </div>
        </div>
      </div>

      {/* Approval Flow Modal */}
      <AnimatePresence>{selectedRequest && <ApprovalFlowModal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} request={selectedRequest} onApprove={approveStep} onReject={rejectStep} onCreateContract={createContractRequest} />}</AnimatePresence>
      <AnimatePresence>{selectedLead && <LeadDetailsModal isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} request={selectedLead} />}</AnimatePresence>
      <AnimatePresence>{selectedUnit && <UnitDetailsModal isOpen={!!selectedUnit} onClose={() => setSelectedUnit(null)} request={selectedUnit} />}</AnimatePresence>

      <ReservationDrawer isOpen={isReservationDrawerOpen} unitPrice={editingRequestId ? requests.find((r) => r.id === editingRequestId)?.unit.price || 0 : 0} onSubmit={handleReservationSubmit} isEditing={!!editingRequestId} />
    </div>
  );
};

export default ReservationRequestsPage;
