import { Button } from "@/components/ui/button";
import { AlertTriangle, WifiOff, RefreshCw, ArrowLeft, XCircle, AlertCircle } from "lucide-react";

const FailedDesignWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 w-full">
    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    <div className="w-full h-[500px] border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">{children}</div>
  </div>
);

// --- Design 1: Centered Simple (Current) ---
const Design1 = () => (
  <FailedDesignWrapper title="1. Clean Centered (Current)">
    <div className="h-full w-full bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={48} className="text-red-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
      <p className="text-gray-500 max-w-md mb-8">
        We could not establish a connection to <span className="font-semibold text-gray-700">Google Ads</span>. Please check your credentials and try again.
      </p>
      <div className="flex gap-3">
        <Button className="bg-transparent border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Back to Integrations</Button>
        <Button className="bg-gray-900 text-white font-medium shadow-lg shadow-gray-200 hover:bg-gray-800">Try Again</Button>
      </div>
    </div>
  </FailedDesignWrapper>
);

// --- Design 2: Modern Card ---
const Design2 = () => (
  <FailedDesignWrapper title="2. Modern Card">
    <div className="h-full w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <WifiOff size={32} className="text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sync Interrupted</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">The connection to Google Ads was lost. This might be due to expired tokens or network issues.</p>
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-red-600 text-white hover:bg-red-700">Retry Connection</Button>
          <Button variant="ghost" className="w-full text-gray-600 hover:bg-gray-100">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  </FailedDesignWrapper>
);

// --- Design 3: Horizontal Split ---
const Design3 = () => (
  <FailedDesignWrapper title="3. Horizontal Split">
    <div className="h-full w-full bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full border border-gray-200 rounded-2xl p-8 flex items-center gap-8 shadow-sm">
        <div className="shrink-0 w-32 h-32 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100">
          <XCircle size={64} className="text-red-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Connect</h2>
          <p className="text-gray-500 mb-6">
            Something went wrong while connecting to <span className="font-semibold text-gray-900">Google Ads</span>. Error code: 502 Bad Gateway.
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-gray-900 text-white px-6">
              <RefreshCw size={16} className="mr-2" /> Retry
            </Button>
            <button className="text-gray-500 font-medium hover:text-gray-800 text-sm">Contact Support</button>
            <div className="flex-1" />
            <button className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </FailedDesignWrapper>
);

// --- Design 4: Dark Mode / High Contrast ---
const Design4 = () => (
  <FailedDesignWrapper title="4. Dark Elegance">
    <div className="h-full w-full bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex relative mb-8">
          <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full" />
          <AlertCircle size={80} className="text-white relative z-10" strokeWidth={1} />
        </div>
        <h2 className="text-3xl font-light text-white mb-4">Connection Failed</h2>
        <p className="text-gray-400 mb-10 text-lg font-light">We encountered an issue connecting your account. Please ensure you have the necessary permissions.</p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-3 rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">Close</button>
          <button className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">Try Again</button>
        </div>
      </div>
    </div>
  </FailedDesignWrapper>
);

// --- Design 5: Status Banner Focus ---
const Design5 = () => (
  <FailedDesignWrapper title="5. Status Focus">
    <div className="h-full w-full bg-white flex flex-col">
      <div className="h-16 border-b border-gray-200 flex items-center px-6">
        <span className="font-bold text-gray-900">Integrations</span>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50/50 p-6">
        <div className="bg-white p-10 rounded-xl border border-gray-200 shadow-sm max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Authorization Required</h3>
          <p className="text-gray-500 text-sm mb-6">Google Ads requires re-authorization to continue syncing leads.</p>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-8 text-left flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
            <div>
              <p className="text-xs font-bold text-orange-800 uppercase mb-1">Error Details</p>
              <p className="text-xs text-orange-700 font-mono">OAuth2 Error: invalid_grant (Token expired)</p>
            </div>
          </div>

          <Button className="w-full bg-orange-600 text-white font-medium shadow-orange-200 shadow-lg hover:bg-orange-700">Re-authorize Google Ads</Button>
          <Button variant="ghost" className="w-full mt-2 text-gray-400 hover:text-gray-600">
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  </FailedDesignWrapper>
);

export const FAILED_CONNECTION_DESIGNS = [
  { id: 1, Component: Design1 },
  { id: 2, Component: Design2 },
  { id: 3, Component: Design3 },
  { id: 4, Component: Design4 },
  { id: 5, Component: Design5 },
];
