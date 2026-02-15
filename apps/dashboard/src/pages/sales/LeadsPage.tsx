import { Users } from "lucide-react";

const LeadsPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
          <Users className="text-white" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Leads</h2>
        <p className="text-sm text-slate-500 max-w-sm">Manage your leads, track interactions, and convert prospects into clients.</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-200">Coming Soon</div>
      </div>
    </div>
  );
};

export default LeadsPage;
