import { Card, Button } from "@heroui/react";
import { CheckCircle2, History, AlertCircle } from "lucide-react";
import type { IntegrationData } from "../store/integrationStore";

interface IntegrationCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  data: IntegrationData;
  onConnect: () => void;
  onManage: () => void;

  isPending?: boolean;
}

const IntegrationCard = ({ name, description, icon, data, onConnect, onManage, isPending }: IntegrationCardProps) => {
  const isConnected = data.status === "connected";
  const isExpired = data.status === "expired";

  let borderClass = "border-t-gray-300 dark:border-t-zinc-700";
  if (isConnected) borderClass = "border-t-green-500";
  if (isExpired) borderClass = "border-t-orange-500";

  return (
    <Card className={`h-full flex flex-col border-t-4 ${borderClass} p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 dark:text-blue-400">{icon}</div>
          <h3 className="font-bold text-lg">{name}</h3>
        </div>
        {isConnected && <CheckCircle2 size={20} className="text-green-500" />}
        {isExpired && (
          <div className="text-orange-500 flex items-center gap-1">
            <AlertCircle size={20} />
          </div>
        )}
        {!isConnected && !isExpired && <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-zinc-700" />}
      </div>

      <div className="mt-4 mb-6 flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[40px]">{description}</p>

        {isConnected && data.lastSync && (
          <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            <History size={12} />
            <span>Connected: {data.lastSync}</span>
          </div>
        )}

        {isExpired && (
          <div className="flex items-center gap-2 mt-3 text-[10px] text-orange-500 font-medium uppercase tracking-wider">
            <AlertCircle size={12} />
            <span>Connection Expired • {data.lastSync || "Unknown"}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mt-auto">
        {isConnected ? (
          <Button fullWidth variant="secondary" className="bg-gray-100 dark:bg-zinc-800 font-medium" onPress={onManage}>
            Configure
          </Button>
        ) : isExpired ? (
          <div className="flex gap-2">
            <Button className="flex-1 bg-black text-white dark:bg-white dark:text-black font-medium shadow-lg shadow-orange-500/20" onPress={onConnect}>
              Renew
            </Button>
            <Button variant="ghost" className="font-medium border border-gray-200 dark:border-zinc-700" onPress={onManage}>
              Configure
            </Button>
          </div>
        ) : (
          <Button fullWidth className="bg-black text-white dark:bg-white dark:text-black font-medium shadow-lg shadow-gray-200 dark:shadow-none" onPress={onConnect} isPending={isPending}>
            {isPending ? "Connecting..." : "Enable Integration"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default IntegrationCard;
