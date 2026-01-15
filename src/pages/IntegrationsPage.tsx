import { useState } from "react";
import { Linkedin, Facebook, MessageSquare, Mail } from "lucide-react";
import IntegrationCard from "../components/IntegrationCard";
import MappingSetup from "../components/MappingSetup";
import { useIntegrationStore } from "../store/integrationStore";

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    description: 'Sync lead gen forms from LinkedIn Ads directly to your CRM.',
    icon: <Linkedin size={24} />
  },
  {
    id: 'facebook',
    name: 'Facebook / Meta Ads',
    description: 'Connect Facebook Lead Ads to automatically import new prospects.',
    icon: <Facebook size={24} />
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Automate messages and capture leads from WhatsApp conversations.',
    icon: <MessageSquare size={24} />
  },
  {
    id: 'gmail',
    name: 'Gmail / Google Workspace',
    description: 'Sync emails and calendar events with your sales team.',
    icon: <Mail size={24} />
  }
];

type ViewState = 'list' | 'setup';

const IntegrationsPage = () => {
  const { updateIntegration, getIntegration } = useIntegrationStore();
  
  const [view, setView] = useState<ViewState>('list');
  const [activeIntegrationId, setActiveIntegrationId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // When user clicks "Connect"
  const handleConnect = async (id: string) => {
    setActiveIntegrationId(id);
    setIsConnecting(true);

    // Simulate external API authorization delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsConnecting(false);
    setView('setup');
  };

  const handleManage = (id: string) => {
    setActiveIntegrationId(id);
    setView('setup');
  };

  const handleBack = () => {
    setView('list');
    setActiveIntegrationId(null);
  };

  if (view === 'setup' && activeIntegrationId) {
    const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === activeIntegrationId);
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Integrations
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Connect your favorite tools to streamline your lead generation workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {AVAILABLE_INTEGRATIONS.map((tool) => {
            const data = getIntegration(tool.id);
            return (
              <IntegrationCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                data={data}
                onConnect={() => handleConnect(tool.id)}
                onManage={() => handleManage(tool.id)}

                isPending={isConnecting && activeIntegrationId === tool.id}
              />
            );
         })}
      </div>
    </div>
  );
};

export default IntegrationsPage;
