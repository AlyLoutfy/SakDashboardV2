import { Card, Button } from "@heroui/react";
import { CheckCircle2, History, AlertCircle, Zap } from "lucide-react";
import type { IntegrationData } from "../store/integrationStore";

interface IntegrationCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  data: IntegrationData;
  onConnect: () => void;
  onManage: () => void;
  isPending?: boolean;
  category?: string;
}

const IntegrationCard = ({ name, icon, data, onConnect, onManage, isPending, category }: IntegrationCardProps) => {
  const isConnected = data.status === "connected";
  const isExpired = data.status === "expired";

  let statusColor = "bg-gray-50 border-gray-100";
  let iconBg = "";
  if (isConnected) {
    statusColor = "bg-emerald-50 border-emerald-200";
    iconBg = "bg-emerald-50";
  }
  if (isExpired) {
    statusColor = "bg-amber-50 border-amber-200";
    iconBg = "bg-amber-50";
  }

  return (
    <Card className={`h-full min-h-[140px] flex flex-col bg-white border ${statusColor} p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`${iconBg} ${iconBg ? "p-2" : "p-0"} rounded-lg text-gray-700 flex items-center justify-center`}>{icon}</div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{name}</h3>
            {category && <span className="text-[10px] text-gray-400 font-medium">{category}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && <CheckCircle2 size={16} className="text-emerald-500" />}
          {isExpired && <AlertCircle size={16} className="text-amber-500" />}
          {!isConnected && !isExpired && <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200" />}
        </div>
      </div>

      <div className="mt-4 mb-3 flex-1">
        {/* specific features based on category */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <Zap size={10} className="text-emerald-500" />
          {category === "Marketing" ? (
            <>
              <span>Lead Capture</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span>Ad Insights</span>
            </>
          ) : category === "Communication" ? (
            <>
              <span>Message Sync</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span>Auto-Log</span>
            </>
          ) : category === "CRM" ? (
            <>
              <span>Bi-Directional</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span>Deal Sync</span>
            </>
          ) : (
            <>
              <span>Real-Time</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span>Secure</span>
            </>
          )}
        </div>

        {isConnected && data.lastSync && (
          <div className="flex items-center gap-2 mt-2 text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
            <History size={12} />
            <span>Connected: {data.lastSync}</span>
          </div>
        )}

        {isExpired && (
          <div className="flex items-center gap-2 mt-2 text-[10px] text-amber-600 font-medium uppercase tracking-wider">
            <AlertCircle size={12} />
            <span>Connection Expired • {data.lastSync || "Unknown"}</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-2">
        {isConnected ? (
          <Button fullWidth variant="secondary" className="bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-medium rounded-lg h-9 text-xs" onPress={onManage}>
            Configure Settings
          </Button>
        ) : isExpired ? (
          <div className="flex gap-2">
            <Button className="flex-1 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 h-9 text-xs" onPress={onConnect}>
              Renew Session
            </Button>
            <Button variant="ghost" className="font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 h-9 text-xs" onPress={onManage}>
              Configure
            </Button>
          </div>
        ) : (
          <Button fullWidth className="bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 shadow-sm h-9 text-xs" onPress={onConnect} isPending={isPending}>
            {isPending ? "Connecting..." : "Enable Integration"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default IntegrationCard;
