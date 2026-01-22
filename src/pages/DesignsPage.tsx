import React from "react";
import { Card, Button, Chip, Separator } from "@heroui/react";
import { CheckCircle2, Linkedin, Settings2, MoreHorizontal } from "lucide-react";

// Mock Data
const MOCK_DATA = {
  name: "LinkedIn Ads",
  description: "Sync lead gen forms directly to CRM.",
  icon: <Linkedin size={24} />,
  connected: { status: "connected", lastSync: "10m ago" },
  disconnected: { status: "disconnected" },
};

// Design 1: Classic Simple
const Design1 = ({ connected }: { connected: boolean }) => (
  <Card className="p-4 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg h-fit">{MOCK_DATA.icon}</div>
      {connected && (
        <Chip color="success" variant="soft" size="sm">
          Active
        </Chip>
      )}
    </div>
    <div className="mt-4">
      <h3 className="font-semibold text-lg">{MOCK_DATA.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{MOCK_DATA.description}</p>
    </div>
    <div className="mt-6 flex justify-end gap-2">
      {connected ? (
        <Button size="sm" variant="secondary">
          Manage
        </Button>
      ) : (
        <Button size="sm" variant="primary">
          Connect
        </Button>
      )}
    </div>
  </Card>
);

// Design 2: Horizontal Compact
const Design2 = ({ connected }: { connected: boolean }) => (
  <Card className="p-4 border border-gray-100 dark:border-zinc-800 shadow-none bg-gray-50 dark:bg-zinc-900/50">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm text-blue-600">{MOCK_DATA.icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{MOCK_DATA.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-1">{MOCK_DATA.description}</p>
      </div>
      <div className="flex flex-col gap-1 items-end">
        {connected ? (
          <Button size="sm" isIconOnly variant="ghost">
            <Settings2 size={16} />
          </Button>
        ) : (
          <Button size="sm" variant="secondary" className="h-8 text-xs">
            Connect
          </Button>
        )}
      </div>
    </div>
  </Card>
);

// Design 3: Border Accent
const Design3 = ({ connected }: { connected: boolean }) => (
  <Card className={`border-t-4 ${connected ? "border-t-green-500" : "border-t-gray-300 dark:border-t-zinc-700"} p-5 shadow-sm`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {MOCK_DATA.icon}
        <h3 className="font-bold">{MOCK_DATA.name}</h3>
      </div>
      {connected ? <CheckCircle2 size={18} className="text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
    </div>
    <p className="text-sm text-gray-500 mt-4 mb-6">{MOCK_DATA.description}</p>
    <Button fullWidth variant={connected ? "secondary" : "primary"} className={connected ? "bg-gray-100 dark:bg-zinc-800" : "bg-black text-white dark:bg-white dark:text-black"}>
      {connected ? "Configure" : "Enable Integration"}
    </Button>
  </Card>
);

// Design 4: Centered Minimal
const Design4 = ({ connected }: { connected: boolean }) => (
  <Card className="p-6 flex flex-col items-center text-center border-none shadow-lg shadow-gray-100/50 dark:shadow-none bg-white dark:bg-zinc-900">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-blue-200 dark:shadow-none shadow-xl">
      <Linkedin size={32} />
    </div>
    <h3 className="font-bold text-xl">{MOCK_DATA.name}</h3>
    <p className="text-sm text-gray-400 mt-2 mb-6">{MOCK_DATA.description}</p>
    {connected ? (
      <div className="flex gap-2 w-full">
        <Button fullWidth variant="danger-soft">
          Disconnect
        </Button>
        <Button fullWidth variant="secondary">
          Settings
        </Button>
      </div>
    ) : (
      <Button fullWidth variant="primary" className="shadow-blue-500/30">
        Connect Now
      </Button>
    )}
  </Card>
);

// Design 5: Glassmorphism / Gradient
const Design5 = ({ connected }: { connected: boolean }) => (
  <Card className={`p-0 overflow-hidden border-none ${connected ? "bg-gradient-to-br from-indigo-900 to-blue-900 text-white" : "bg-white dark:bg-zinc-900 border border-gray-200"}`}>
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${connected ? "bg-white/20" : "bg-gray-100 dark:bg-zinc-800 text-gray-600"}`}>{MOCK_DATA.icon}</div>
        {connected && <span className="text-xs font-mono bg-green-400/20 text-green-300 px-2 py-1 rounded">CONNECTED</span>}
      </div>
      <div className="mt-8">
        <h3 className={`text-lg font-bold ${connected ? "text-white" : "text-gray-900 dark:text-white"}`}>{MOCK_DATA.name}</h3>
        <p className={`text-sm mt-1 ${connected ? "text-blue-100" : "text-gray-500"}`}>{MOCK_DATA.description}</p>
      </div>
    </div>
    {connected && <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />}
  </Card>
);

// Design 6: List Row Item
const Design6 = ({ connected }: { connected: boolean }) => (
  <Card className="p-3 border border-gray-200 dark:border-zinc-800 flex items-center gap-4 hover:border-gray-300 transition-colors">
    <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-md">{MOCK_DATA.icon}</div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium truncate">{MOCK_DATA.name}</h3>
      <p className="text-xs text-gray-500 truncate">{MOCK_DATA.description}</p>
    </div>
    {connected ? (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        <Button isIconOnly size="sm" variant="ghost">
          <MoreHorizontal size={16} />
        </Button>
      </div>
    ) : (
      <Button size="sm" variant="secondary" className="h-8">
        Connect
      </Button>
    )}
  </Card>
);

// Design 7: Image Heavy / Banner
const Design7 = ({ connected }: { connected: boolean }) => (
  <Card className="overflow-hidden border-none shadow-md">
    <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative flex items-center justify-center">
      <div className="bg-white p-3 rounded-full shadow-lg absolute -bottom-6">
        <span className="text-blue-600">{MOCK_DATA.icon}</span>
      </div>
    </div>
    <div className="pt-10 pb-6 px-6 text-center">
      <h3 className="font-bold text-lg">{MOCK_DATA.name}</h3>
      <p className="text-xs text-gray-500 mt-2">v2.4.0 • Official Integration</p>
      <div className="mt-6">
        {connected ? (
          <Button className="w-full" variant="secondary">
            Active
          </Button>
        ) : (
          <Button className="w-full" variant="primary">
            Install
          </Button>
        )}
      </div>
    </div>
  </Card>
);

// Design 8: Developer / Technical
const Design8 = ({ connected }: { connected: boolean }) => (
  <Card className="p-0 border border-gray-300 dark:border-zinc-700 font-mono text-sm bg-gray-50 dark:bg-zinc-950">
    <div className="border-b border-gray-200 dark:border-zinc-800 p-3 flex justify-between items-center bg-white dark:bg-zinc-900">
      <span className="font-bold">{MOCK_DATA.name}</span>
      <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
    </div>
    <div className="p-4 space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-500">status:</span>
        <span className={connected ? "text-green-600" : "text-gray-600"}>{connected ? "ready" : "idle"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">type:</span>
        <span>oauth2</span>
      </div>
    </div>
    <div className="p-2 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <Button size="sm" variant="ghost" fullWidth className="font-mono text-xs">
        {connected ? "> manage_config" : "> init_connection"}
      </Button>
    </div>
  </Card>
);

// Design 9: Soft UI / Neumorphic-ish
const Design9 = ({ connected }: { connected: boolean }) => (
  <Card className="p-5 bg-[#f0f4f8] dark:bg-zinc-900 border-none shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] dark:shadow-none">
    <div className="flex justify-between items-start">
      <div className="bg-[#f0f4f8] dark:bg-zinc-800 p-3 rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] dark:shadow-none">{MOCK_DATA.icon}</div>
    </div>
    <div className="mt-4">
      <h3 className="font-bold text-gray-700 dark:text-gray-200">{MOCK_DATA.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{MOCK_DATA.description}</p>
    </div>
    <div className="mt-6">
      <Button className="w-full shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] dark:shadow-none bg-[#f0f4f8] dark:bg-zinc-800 text-blue-600 font-semibold" variant="ghost">
        {connected ? "Settings" : "Connect"}
      </Button>
    </div>
  </Card>
);

// Design 10: Status Heavy
const Design10 = ({ connected }: { connected: boolean }) => (
  <Card className="p-0 border-l-4 border-l-blue-600">
    <div className="p-5">
      <div className="flex items-center gap-3 mb-3">
        {MOCK_DATA.icon}
        <h3 className="font-bold">{MOCK_DATA.name}</h3>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Sync Frequency</span>
        <span className="font-medium">Daily</span>
      </div>
      <div className="flex items-center justify-between text-sm mt-2">
        <span className="text-gray-500">Last Sync</span>
        <span className="font-medium">{connected ? "Today, 10:00 AM" : "-"}</span>
      </div>
      <div className="mt-5 pt-3 border-t border-dashed border-gray-200 dark:border-zinc-800">
        {connected ? (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium justify-center">
            <CheckCircle2 size={16} /> Operational
          </div>
        ) : (
          <Button size="sm" fullWidth variant="secondary">
            Activate
          </Button>
        )}
      </div>
    </div>
  </Card>
);

const DESIGNS = [
  { id: 1, name: "Classic Simple", Component: Design1 },
  { id: 2, name: "Horizontal Compact", Component: Design2 },
  { id: 3, name: "Border Accent", Component: Design3 },
  { id: 4, name: "Centered Minimal", Component: Design4 },
  { id: 5, name: "Glassmorphism / Gradient", Component: Design5 },
  { id: 6, name: "List Row Item", Component: Design6 },
  { id: 7, name: "Image Heavy / Banner", Component: Design7 },
  { id: 8, name: "Developer / Technical", Component: Design8 },
  { id: 9, name: "Soft UI", Component: Design9 },
  { id: 10, name: "Status Heavy", Component: Design10 },
];

const DesignsPage = () => {
  const [activeTab, setActiveTab] = React.useState("cards");
  const topRef = React.useRef<HTMLDivElement>(null);

  // Synchronous scroll reset before browser paints
  React.useLayoutEffect(() => {
    const mainContainer = document.querySelector("main");
    if (mainContainer) {
      mainContainer.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeTab]); // Run on every tab change

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-12 pb-20" ref={topRef}>
      <div className="max-w-3xl">
        <h1 id="designs-title" className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Card Design Studio
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Exploration of designs for various UI components.</p>
      </div>

      <div className="w-full">
        <div className="mb-8 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex gap-6 relative">
            <button onClick={() => handleTabChange("cards")} className={`px-4 py-3 font-medium cursor-pointer outline-none transition-colors relative ${activeTab === "cards" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
              Integration Cards
              {activeTab === "cards" && <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-t-full w-full" />}
            </button>
          </div>
        </div>

        {activeTab === "cards" && (
          <div key={`cards-${Date.now()}`} className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {DESIGNS.map(({ id, name, Component }) => (
              <div key={id} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-400">
                  Design {id}: {name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800/50">
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1">Disconnected</span>
                    <Component connected={false} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-medium ml-1">Connected</span>
                    <Component connected={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignsPage;
