import { Activity } from "lucide-react";

const SalesMonitorPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
          <Activity className="text-white" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sales Monitor</h2>
        <p className="text-sm text-slate-500 max-w-sm">Real-time sales tracking, pipeline overview, and team performance monitoring.</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">Coming Soon</div>
      </div>
    </div>
  );
};

export default SalesMonitorPage;
