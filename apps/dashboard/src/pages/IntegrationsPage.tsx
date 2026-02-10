import { useState } from "react";
import { Linkedin, Facebook, Mail, Workflow } from "lucide-react";
import IntegrationCard from "../components/IntegrationCard";
import MappingSetup from "../components/MappingSetup";
import { useIntegrationStore } from "../store/integrationStore";
import { Button } from "@/components/ui/button";

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.415-18.298A11.715 11.715 0 0012.046 0C5.411 0 .004 5.408.002 12.043a11.715 11.715 0 001.591 5.922L0 24l6.117-1.605a11.68 11.68 0 005.925 1.603h.005c6.632 0 12.038-5.411 12.041-12.046a11.68 11.68 0 00-3.602-8.498z" />
  </svg>
);

const SalesforceIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.28 12.01c0-2.33-1.89-4.22-4.22-4.22-.11 0-.21.01-.32.02a4.93 4.93 0 0 0-9.67-.71c-.17-.14-.38-.21-.61-.21-1.95 0-3.53 1.58-3.53 3.53 0 .76.24 1.48.66 2.06a4.95 4.95 0 0 0-.71 2.51c0 2.74 2.22 4.95 4.95 4.95 1.38 0 2.63-.56 3.53-1.46a4.77 4.77 0 0 0 2.7 0.85c1.54 0 2.91-.71 3.8-1.83a4.1 4.1 0 0 0 6.64-3.21c0-.18-.01-.35-.04-.53.11-.23.16-.49.16-.75z" />
  </svg>
);

const GoogleIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AVAILABLE_INTEGRATIONS = [
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    category: "Marketing",
    icon: <Linkedin size={24} />,
  },
  {
    id: "facebook",
    name: "Facebook / Meta Ads",
    category: "Marketing",
    icon: <Facebook size={24} />,
  },
  {
    id: "google_ads",
    name: "Google Ads",
    category: "Marketing",
    icon: <GoogleIcon size={24} />,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "Communication",
    icon: <WhatsAppIcon size={24} />,
  },
  {
    id: "gmail",
    name: "Gmail / Google Workspace",
    category: "Communication",
    icon: <Mail size={24} />,
  },
  {
    id: "salesforce",
    name: "Salesforce CRM",
    category: "CRM",
    icon: <SalesforceIcon size={24} />,
  },
];

type ViewState = "list" | "setup" | "failed";

const IntegrationsPage = () => {
  const { updateIntegration, getIntegration } = useIntegrationStore();

  const [view, setView] = useState<ViewState>("list");
  const [activeIntegrationId, setActiveIntegrationId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // When user clicks "Connect"
  const handleConnect = async (id: string) => {
    setActiveIntegrationId(id);
    setIsConnecting(true);

    // Simulate external API authorization delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsConnecting(false);

    // Simulate failure for Google Ads
    if (id === "google_ads") {
      setView("failed");
      return;
    }

    setView("setup");
  };

  const handleManage = (id: string) => {
    setActiveIntegrationId(id);
    setView("setup");
  };

  const handleBack = () => {
    setView("list");
    setActiveIntegrationId(null);
  };

  if (view === "failed" && activeIntegrationId) {
    const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === activeIntegrationId);
    if (!integration) return null;

    return (
      <div className="h-full w-full bg-white text-gray-900 rounded-xl overflow-hidden font-sans border border-gray-200 flex flex-col shadow-sm items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
        <p className="text-gray-500 max-w-md mb-8">We could not establish a connection. Please check your permissions and try again.</p>
        <div className="flex gap-3">
          <Button onClick={handleBack} className="bg-transparent border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
            Back to Integrations
          </Button>
          <Button onClick={() => handleConnect(activeIntegrationId)} className="bg-gray-900 text-white font-medium shadow-lg shadow-gray-200 hover:bg-gray-800">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (view === "setup" && activeIntegrationId) {
    const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === activeIntegrationId);
    if (!integration) return null;

    return (
      <MappingSetup
        integration={getIntegration(activeIntegrationId)}
        integrationName={integration.name}
        onBack={handleBack}
        // @ts-ignore
        onUpdate={(data: any) => updateIntegration(activeIntegrationId, data)}
      />
    );
  }

  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <Workflow size={20} />
          <span className="text-base font-bold text-gray-900 leading-none">Integrations</span>
          <span className="text-gray-300 px-1">/</span>
          <span className="text-sm font-medium text-gray-500">All Connections</span>
        </div>
        <div className="flex gap-2">
          {/* Status Indicator */}
          <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {AVAILABLE_INTEGRATIONS.filter((i) => getIntegration(i.id).status === "connected").length} Connected
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Connect Your Tools</h1>
          <p className="text-gray-500 mt-1">Streamline your lead generation workflow by connecting your favorite platforms.</p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {AVAILABLE_INTEGRATIONS.map((tool) => {
            let data = getIntegration(tool.id);
            // Mock expired state for Facebook for demo
            if (tool.id === "facebook") {
              data = { ...data, status: "expired", lastSync: "Jan 20, 2026 at 3:30 PM" };
            }
            return <IntegrationCard key={tool.id} id={tool.id} name={tool.name} category={tool.category} icon={tool.icon} data={data} onConnect={() => handleConnect(tool.id)} onManage={() => handleManage(tool.id)} isPending={isConnecting && activeIntegrationId === tool.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
