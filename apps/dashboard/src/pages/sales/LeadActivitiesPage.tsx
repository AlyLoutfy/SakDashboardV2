import { Zap } from "lucide-react";

const LeadActivitiesPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/25">
          <Zap className="text-white" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Lead Activities</h2>
        <p className="text-sm text-slate-500 max-w-sm">Track all lead interactions, follow-ups, and engagement history in one place.</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">Coming Soon</div>
      </div>
    </div>
  );
};

export default LeadActivitiesPage;
