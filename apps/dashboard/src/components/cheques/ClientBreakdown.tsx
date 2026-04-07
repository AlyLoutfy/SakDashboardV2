import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, AlertTriangle } from "lucide-react";
import {
  useChequesStore,
  formatDate,
  applyAutoOverdue,
  type ClientSummary,
  type Cheque,
} from "../../store/chequesStore";

function chequeMatchesSearch(cheque: Cheque, q: string): boolean {
  return (
    cheque.chequeNumber.toLowerCase().includes(q) ||
    cheque.unitCode.toLowerCase().includes(q) ||
    cheque.clientName.toLowerCase().includes(q)
  );
}

function clientMatchesSearch(clientCheques: Cheque[], clientName: string, unitCode: string, q: string): boolean {
  if (!q) return true;
  if (clientName.toLowerCase().includes(q)) return true;
  if (unitCode.toLowerCase().includes(q)) return true;
  return clientCheques.some((c) => chequeMatchesSearch(c, q));
}

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-200/70 text-inherit rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

const ClientCard = ({ client, searchQuery }: { client: ClientSummary; searchQuery: string }) => {
  const navigate = useNavigate();
  const hasIssues = client.overdueCheques > 0 || client.bouncedCheques > 0;

  return (
    <button
      onClick={() => navigate(`/cheques/client/${client.clientId}`)}
      className={`w-full border rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors text-left ${
        hasIssues ? "border-red-200 bg-red-50/30" : "border-gray-200 bg-white"
      }`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${hasIssues ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"}`}>
        {client.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-gray-900 truncate">
            <HighlightText text={client.clientName} query={searchQuery} />
          </span>
          {hasIssues && <AlertTriangle size={12} className="text-red-500 shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
          {client.units.map((u, idx) => (
            <span key={u.unitCode} className="flex items-center gap-1">
              {idx > 0 && <span className="text-gray-300">·</span>}
              <span className="font-medium text-gray-500">
                <HighlightText text={u.unitCode} query={searchQuery} />
              </span>
              <span>{u.compound}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="text-[10px] text-gray-400">Collected</div>
          <div className="text-xs font-bold text-emerald-600">{client.collectedCheques}/{client.totalCheques}</div>
        </div>
        {client.nextDueDate && (
          <div className="text-right">
            <div className="text-[10px] text-gray-400">Next Due</div>
            <div className="text-xs font-semibold text-gray-700">{formatDate(client.nextDueDate)}</div>
          </div>
        )}
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </button>
  );
};

const ClientBreakdown = () => {
  const getClientSummaries = useChequesStore((s) => s.getClientSummaries);
  const filterSearch = useChequesStore((s) => s.filterSearch);
  const filterCompound = useChequesStore((s) => s.filterCompound);
  const cheques = useChequesStore((s) => s.cheques).map(applyAutoOverdue);
  const allSummaries = getClientSummaries();

  const q = filterSearch.toLowerCase().trim();

  // Filter clients by search + compound
  const summaries = useMemo(() => {
    let results = allSummaries;

    if (filterCompound !== "all") {
      results = results.filter((client) => client.compound === filterCompound);
    }

    if (q) {
      results = results.filter((client) => {
        const clientCheques = cheques.filter((c) => c.clientId === client.clientId);
        return clientMatchesSearch(clientCheques, client.clientName, client.unitCode, q);
      });
    }

    return results;
  }, [q, filterCompound, allSummaries, cheques]);

  const hasFilters = q || filterCompound !== "all";

  if (summaries.length === 0 && hasFilters) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400">No clients match your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {summaries.map((client, i) => (
        <motion.div
          key={client.clientId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ClientCard client={client} searchQuery={q} />
        </motion.div>
      ))}
    </div>
  );
};

export default ClientBreakdown;
