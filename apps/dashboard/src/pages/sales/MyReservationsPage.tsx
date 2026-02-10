import { ClipboardList, Check, X, Clock, Edit3, ChevronRight, Calendar, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSalesStore } from "../../store/salesStore";
import ReservationDrawer from "../../components/sales/ReservationDrawer";
import { format } from "date-fns";

const MyReservationsPage = () => {
  const { reservations, editReservation, isReservationDrawerOpen } = useSalesStore();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          icon: Check,
          label: "Confirmed",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          iconColor: "text-emerald-600",
        };
      case "cancelled":
        return {
          icon: X,
          label: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          iconColor: "text-red-600",
        };
      default:
        return {
          icon: Clock,
          label: "Pending",
          bgColor: "bg-amber-100",
          textColor: "text-amber-700",
          iconColor: "text-amber-600",
        };
    }
  };

  const currentUnitPrice = 12500000;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ClipboardList className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Reservations</h1>
            <p className="text-sm text-slate-500">
              {reservations.length} total reservation{reservations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reservation ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Plan</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => {
                const statusConfig = getStatusConfig(reservation.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={reservation.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${index === reservations.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-slate-800">{reservation.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{reservation.client.name}</p>
                        <p className="text-sm text-slate-500">{reservation.client.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{reservation.unitTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      {reservation.paymentPlan ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check size={12} className="text-emerald-600" />
                          </div>
                          <span className="text-sm text-slate-700">{reservation.paymentPlan.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                            <X size={12} className="text-slate-400" />
                          </div>
                          <span className="text-sm text-slate-400">No plan</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        <StatusIcon size={12} className={statusConfig.iconColor} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{format(new Date(reservation.createdAt), "MMM d, yyyy")}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => editReservation(reservation.id)} className="min-w-0 px-3">
                        <Edit3 size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {reservations.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No reservations yet</h3>
            <p className="text-slate-500 mb-6">Create your first reservation from the Unit Details page</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {reservations.map((reservation) => {
          const statusConfig = getStatusConfig(reservation.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={reservation.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" onClick={() => editReservation(reservation.id)}>
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        <StatusIcon size={10} className={statusConfig.iconColor} />
                        {statusConfig.label}
                      </span>
                      {reservation.paymentPlan && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                          <Check size={10} />
                          Plan
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-slate-800 truncate">{reservation.client.name}</p>
                    <p className="text-sm text-slate-500 truncate">{reservation.unitTitle}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 flex-shrink-0 mt-1" />
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
        {reservations.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <ClipboardList className="text-slate-400" size={28} />
            </div>
            <h3 className="text-base font-medium text-slate-800 mb-1">No reservations yet</h3>
            <p className="text-sm text-slate-500">Create your first reservation from the Unit Details page</p>
          </div>
        )}
      </div>

      {/* Reservation Drawer */}
      <ReservationDrawer isOpen={isReservationDrawerOpen} unitPrice={currentUnitPrice} />
    </div>
  );
};

export default MyReservationsPage;
