import { Bell } from "lucide-react";

const dummyNotifications = [
  { id: "1", title: "New reservation request", description: "Client Ahmed Soliman submitted a reservation for Unit PH-A101 in Palm Hills", time: "5 min ago", read: false, type: "reservation" as const },
  { id: "2", title: "EOI approved", description: "Your EOI for Mountain View compound has been approved by management", time: "1 hour ago", read: false, type: "eoi" as const },
  { id: "3", title: "Lead assigned", description: "New lead Neymar Jr has been assigned to you by the team manager", time: "2 hours ago", read: true, type: "lead" as const },
  { id: "4", title: "Unit price update", description: "Price for Unit MV-C301 in Mountain View has been updated to EGP 6,200,000", time: "3 hours ago", read: true, type: "update" as const },
  { id: "5", title: "Blocking request approved", description: "Your blocking request for Unit HP-B201 in Hyde Park has been approved", time: "Yesterday", read: true, type: "reservation" as const },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  reservation: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  eoi: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  lead: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  update: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
};

const NotificationsPage = () => {
  const unreadCount = dummyNotifications.filter((n) => !n.read).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Bell className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">Notifications</h1>
                <p className="text-xs text-slate-500">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}</p>
              </div>
            </div>
            {unreadCount > 0 && <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">Mark all as read</button>}
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {dummyNotifications.map((notification) => {
              const colors = typeColors[notification.type] || typeColors.update;
              return (
                <div key={notification.id} className={`flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer hover:bg-slate-50 ${!notification.read ? "bg-blue-50/30" : "bg-white"}`}>
                  {/* Unread indicator */}
                  <div className="pt-1.5 flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${!notification.read ? "bg-blue-500" : "bg-transparent"}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>{notification.type}</span>
                      <span className="text-[11px] text-slate-400">{notification.time}</span>
                    </div>
                    <p className={`text-sm ${!notification.read ? "font-bold text-slate-800" : "font-medium text-slate-700"}`}>{notification.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
