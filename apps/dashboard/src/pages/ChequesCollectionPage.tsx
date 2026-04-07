import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Landmark, LayoutList, Users, BarChart3, Plus, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChequesStore, formatCurrency, formatDate } from "../store/chequesStore";

import StatCards from "../components/cheques/StatCards";
import ChequesFilters from "../components/cheques/ChequesFilters";
import ChequesTable from "../components/cheques/ChequesTable";
import ClientBreakdown from "../components/cheques/ClientBreakdown";
import CashFlowChart from "../components/cheques/CashFlowChart";
import AddChequesDrawer from "../components/cheques/AddChequesDrawer";

type ViewTab = "cheques" | "clients" | "cashflow";

const ChequesCollectionPage = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>("clients");
  const [filterPending, setFilterPending] = useState(false);
  const navigate = useNavigate();
  const getFilteredCheques = useChequesStore((s) => s.getFilteredCheques);
  const getOverallStats = useChequesStore((s) => s.getOverallStats);
  const openDrawer = useChequesStore((s) => s.openDrawer);
  const pendingConfirmations = useChequesStore((s) => s.pendingConfirmations);

  const filteredCount = getFilteredCheques().length;
  const stats = getOverallStats();

  const tabs: { id: ViewTab; label: string; icon: typeof LayoutList; count?: number }[] = [
    { id: "clients", label: "By Client", icon: Users },
    { id: "cheques", label: "All Cheques", icon: LayoutList, count: filteredCount },
    { id: "cashflow", label: "Cash Flow", icon: BarChart3 },
  ];

  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
      {/* Add Cheques Drawer */}
      <AddChequesDrawer />

      {/* Top Bar */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <Landmark size={20} />
          <span className="text-base font-bold text-gray-900 leading-none">Cheques Collection</span>
          <span className="text-gray-300 px-1">/</span>
          <span className="text-sm font-medium text-gray-500">Overview</span>
        </div>
        <div className="flex items-center gap-2">
          {stats.overdueCount > 0 && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {stats.overdueCount} Overdue
            </div>
          )}
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {stats.totalCheques} Total
          </div>
          <Button variant="outline" className="h-8 gap-1.5 text-xs font-medium px-3 border-gray-200 text-gray-700 hover:bg-gray-50">
            <Download size={14} />
            Export
          </Button>
          <Button onClick={openDrawer} className="h-8 gap-1.5 bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium shadow-sm px-3">
            <Plus size={14} />
            Add Cheques
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-5 pb-3 space-y-4 shrink-0">
          {/* Pending Confirmations Bar */}
          {pendingConfirmations.length > 0 && (
            <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-orange-500" />
                  <span className="text-xs font-bold text-orange-800">{pendingConfirmations.length} pending</span>
                </div>
                <div className="w-px h-4 bg-orange-200" />
                <div className="flex items-center">
                  {pendingConfirmations.slice(0, 5).map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/cheques/confirm/${p.id}`)}
                      title={`${p.clientName} — ${p.unitCode}`}
                      className={`w-7 h-7 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 flex items-center justify-center text-[10px] font-bold border-2 border-orange-50 transition-colors ${i > 0 ? "-ml-1.5" : ""}`}
                    >
                      {p.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </button>
                  ))}
                  {pendingConfirmations.length > 5 && (
                    <span className="text-[10px] font-semibold text-orange-600 ml-2">+{pendingConfirmations.length - 5} more</span>
                  )}
                </div>
                <span className="text-[10px] text-orange-500">Contracts signed, awaiting cheque confirmation</span>
              </div>
              <button
                onClick={() => {
                  setFilterPending(!filterPending);
                  setActiveTab("clients");
                }}
                className={`text-xs font-semibold transition-colors ${
                  filterPending
                    ? "text-orange-800 bg-orange-200 px-3 py-1 rounded-lg"
                    : "text-orange-700 hover:text-orange-900"
                }`}
              >
                {filterPending ? "Show all clients" : "Review all →"}
              </button>
            </div>
          )}

          {/* Filters + Tabs */}
          <div className="flex items-start justify-between gap-4">
            {/* Filters */}
            <div className="flex-1 min-w-0">
              {(activeTab === "cheques" || activeTab === "clients") && (
                <ChequesFilters showFullFilters={activeTab === "cheques"} />
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-gray-100 text-gray-600" : "bg-gray-200/60 text-gray-400"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content — fills remaining height */}
        <div className="flex-1 flex flex-col min-h-0 px-6 pb-4">
          {activeTab === "cheques" && (
            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <ChequesTable />
            </div>
          )}

          {activeTab === "clients" && !filterPending && (
            <div className="flex-1 overflow-auto">
              <ClientBreakdown />
            </div>
          )}

          {activeTab === "clients" && filterPending && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-2">
                {pendingConfirmations.map((p, i) => (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/cheques/confirm/${p.id}`)}
                    className="w-full border border-orange-200 bg-orange-50/30 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {p.clientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-gray-900">{p.clientName}</span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                        <span className="font-medium text-gray-500">{p.unitCode}</span>
                        <span>·</span>
                        <span>{p.compound}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400">Unit Price</div>
                        <div className="text-xs font-bold text-gray-700">{formatCurrency(p.unitPrice)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400">Plan</div>
                        <div className="text-xs font-semibold text-gray-600">{p.paymentPlanName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400">Contract</div>
                        <div className="text-xs font-semibold text-gray-600">{formatDate(p.contractDate)}</div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Clock size={14} className="text-orange-500" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "cashflow" && (
            <div className="flex-1 overflow-auto">
              <CashFlowChart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChequesCollectionPage;
