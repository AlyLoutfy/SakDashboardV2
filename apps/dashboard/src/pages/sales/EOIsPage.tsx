import { FilePlus } from "lucide-react";

const EOIsPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
          <FilePlus className="text-white" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Expressions of Interest</h2>
        <p className="text-sm text-slate-500 max-w-sm">View and manage all EOIs across your team. Track interest levels and follow up on potential deals.</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-600 text-xs font-bold border border-violet-200">Coming Soon</div>
      </div>
    </div>
  );
};

export default EOIsPage;
