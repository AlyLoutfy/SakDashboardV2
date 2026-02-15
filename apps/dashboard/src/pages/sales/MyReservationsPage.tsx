import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ClipboardList, Check, X, Clock, Edit3, ChevronDown, Calendar, User as UserIcon, ChevronRight, Plus, Sparkles, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSalesStore, type PaymentPlan } from "../../store/salesStore";
import ReservationDrawer from "../../components/sales/ReservationDrawer";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

// ─── Payment Plan Dropdown (w/ Portal) ────────────────────────────
const PaymentPlanDropdown = ({ reservationId, plans, onSelect, onCustom }: { reservationId: string; plans: PaymentPlan[]; onSelect: (reservationId: string, plan: PaymentPlan) => void; onCustom: (reservationId: string) => void }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Update coordinates when opening
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Default to opening downwards
      let top = rect.bottom + 4;
      let left = rect.left;

      // Check vertical fit (dropdown height approx 200px)
      if (top + 200 > window.innerHeight) {
        // Flip upwards if not enough space below
        top = rect.top - 4 - 200;
      }

      // Check horizontal fit (dropdown width approx 256px)
      if (left + 256 > window.innerWidth) {
        left = window.innerWidth - 256 - 16; // 16px padding from edge
      }

      setCoords({ top, left });
    }
  }, [open]);

  // Handle outside click & scroll to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // If clicking inside the dropdown content (handled by portal), don't close immediately
      // But since the portal is in body, we need to check if target is inside the dropdown or the button
      const target = e.target as HTMLElement;
      if (buttonRef.current?.contains(target) || target.closest("[data-portal-dropdown]")) {
        return;
      }
      setOpen(false);
    };

    const handleScroll = () => {
      if (open) setOpen(false); // Close on scroll to avoid detached floating menu
    };

    if (open) {
      window.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll, { capture: true }); // Capture scroll on any element
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  return (
    <>
      <button ref={buttonRef} onClick={() => setOpen(!open)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-dashed border-blue-300 text-blue-600 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-400 transition-all whitespace-nowrap">
        <Plus size={12} />
        Add Plan
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Render Dropdown Content via Portal to escape table overflow clipping */}
      {open &&
        createPortal(
          <div
            data-portal-dropdown
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
            }}
          >
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }} className="w-64 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Payment Plan</p>
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => {
                        onSelect(reservationId, plan);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{plan.name}</p>
                        <p className="text-[10px] text-slate-400">{plan.installments.length} installments</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 p-1.5">
                  <button
                    onClick={() => {
                      onCustom(reservationId);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-violet-50 transition-colors text-left group"
                  >
                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={10} className="text-violet-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-violet-700 group-hover:text-violet-800">Custom Payment Plan</p>
                      <p className="text-[10px] text-slate-400">Build a custom plan</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────
const MyReservationsPage = () => {
  const { reservations, paymentPlans, editReservation, editReservationWithCustomPlan, updateReservation, isReservationDrawerOpen } = useSalesStore();

  // local filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");

  const currentUnitPrice = 12500000;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return { icon: Check, label: "Confirmed", bgColor: "bg-emerald-50", textColor: "text-emerald-700", dotColor: "bg-emerald-500" };
      case "cancelled":
        return { icon: X, label: "Cancelled", bgColor: "bg-red-50", textColor: "text-red-700", dotColor: "bg-red-500" };
      default:
        return { icon: Clock, label: "Pending", bgColor: "bg-amber-50", textColor: "text-amber-700", dotColor: "bg-amber-500" };
    }
  };

  const handleSelectPlan = (reservationId: string, plan: PaymentPlan) => {
    updateReservation(reservationId, { paymentPlan: plan });
  };

  const handleOpenCustomPlan = (reservationId: string) => {
    editReservationWithCustomPlan(reservationId);
  };

  // Filter Logic
  const filteredReservations = reservations.filter((res) => {
    // Search
    const query = searchQuery.toLowerCase();
    const searchMatch = res.client.name.toLowerCase().includes(query) || res.unitTitle.toLowerCase().includes(query) || res.client.phone.includes(query) || (res.compound || "").toLowerCase().includes(query) || (res.phase || "").toLowerCase().includes(query);

    // Status
    const statusMatch = statusFilter === "all" || res.status === statusFilter;

    // Payment Method
    const methodMatch = paymentMethodFilter === "all" || (res.paymentMethod || "Pending").toLowerCase() === paymentMethodFilter.toLowerCase(); // "Pending" if null

    return searchMatch && statusMatch && methodMatch;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200/60 px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col gap-4">
            {/* Title Row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                <ClipboardList className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">My Reservations</h1>
                <p className="text-xs text-slate-500">
                  {filteredReservations.length} result{filteredReservations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
              {/* Search */}
              <div className="relative flex-1 w-full sm:w-auto min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search client, unit, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" />
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-40">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors">
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>

              {/* Payment Method Filter */}
              <div className="relative w-full sm:w-48">
                <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)} className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors">
                  <option value="all">All Payment Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-auto p-4 sm:p-5">
        {/* Desktop Table */}
        <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  {/* First Column: Unit (ID/Title) */}
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-5">Unit</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Compound</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Phase</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Client</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Payment Plan</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Payment Method</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Created</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((reservation) => {
                  const statusConfig = getStatusConfig(reservation.status);

                  return (
                    <tr key={reservation.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Unit (First Column) */}
                      <td className="px-4 py-2.5 whitespace-nowrap pl-5">
                        <span className="text-sm font-semibold text-slate-800">{reservation.unitTitle}</span>
                      </td>

                      {/* Compound */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{reservation.compound || "—"}</span>
                      </td>

                      {/* Phase */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{reservation.phase || "—"}</span>
                      </td>

                      {/* Client Name */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{reservation.client.name}</span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-slate-500 font-mono tracking-tight">{reservation.client.phone}</span>
                      </td>

                      {/* Payment Plan */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {reservation.paymentPlan ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check size={8} className="text-white" />
                            </div>
                            <span className="text-xs font-medium text-emerald-700">{reservation.paymentPlan.name}</span>
                          </div>
                        ) : (
                          <PaymentPlanDropdown reservationId={reservation.id} plans={paymentPlans} onSelect={handleSelectPlan} onCustom={handleOpenCustomPlan} />
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-slate-600">{reservation.paymentMethod || "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-xs text-slate-500">{format(new Date(reservation.createdAt), "MMM d, yyyy")}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2.5 whitespace-nowrap text-right pr-5">
                        <Button variant="ghost" size="sm" onClick={() => editReservation(reservation.id)} className="min-w-0 px-2.5 h-7 hover:bg-white hover:border-slate-200 border border-transparent shadow-sm hover:shadow active:scale-95 transition-all">
                          <Edit3 size={13} className="text-slate-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredReservations.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">No reservations found</h3>
              <p className="text-sm text-slate-500">{searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your filters"}</p>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredReservations.map((reservation) => {
            const statusConfig = getStatusConfig(reservation.status);

            return (
              <div key={reservation.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" onClick={() => editReservation(reservation.id)}>
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                          {statusConfig.label}
                        </span>
                        {reservation.paymentPlan && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                            <Check size={10} />
                            Plan
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 truncate">{reservation.unitTitle}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">{reservation.compound || "No Compound"}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">{reservation.phase || "No Phase"}</span>
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-1">{reservation.client.name}</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 flex-shrink-0 mt-2" />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <UserIcon size={12} />
                      {reservation.client.phone}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {format(new Date(reservation.createdAt), "MMM d")}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Mobile Empty State */}
          {filteredReservations.length === 0 && (
            <div className="py-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Search className="text-slate-300" size={28} />
              </div>
              <h3 className="text-base font-medium text-slate-800 mb-1">No reservations found</h3>
              <p className="text-sm text-slate-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Reservation Drawer (already has full payment plan builder) */}
      <ReservationDrawer isOpen={isReservationDrawerOpen} unitPrice={currentUnitPrice} />
    </div>
  );
};

export default MyReservationsPage;
