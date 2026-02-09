import { useState } from "react";
import DateRangePicker from "../components/common/DateRangePicker";
import { Button } from "@heroui/react";
import { Copy, Check, Palette, Type, Box, Calendar, ChevronRight, Upload, FileEdit, Download, ClipboardList, Tag } from "lucide-react";
import type { DateRange } from "react-day-picker";

// Design Tokens
const designTokens = {
  colors: {
    // Primary/Accent
    accent: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main accent
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    // Neutral/Gray
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    // Semantic
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
  },
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
};

// Copy to clipboard helper
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Copy to clipboard">
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
    </button>
  );
};

// Color Swatch Component - Compact
const ColorSwatch = ({ name, hex, className }: { name: string; hex: string; className?: string }) => (
  <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-md transition-colors">
    <div className={`w-7 h-7 rounded-md shadow-inner border border-gray-200 ${className}`} style={{ backgroundColor: hex }} />
    <div className="flex-1 min-w-0">
      <div className="text-xs font-medium text-gray-800 truncate">{name}</div>
      <div className="text-[10px] text-gray-500 font-mono">{hex}</div>
    </div>
    <CopyButton text={hex} />
  </div>
);

// Section Component - Compact
const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
        <Icon size={14} className="text-blue-600" />
      </div>
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

// Component Preview - Compact
const ComponentPreview = ({ title, description, children, code }: { title: string; description: string; children: React.ReactNode; code: string }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <p className="text-[10px] text-gray-500">{description}</p>
        </div>
        <button onClick={() => setShowCode(!showCode)} className="px-2 py-1 text-[10px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors flex items-center gap-1">
          {showCode ? "Hide" : "Show"} Code
          <ChevronRight size={12} className={`transition-transform ${showCode ? "rotate-90" : ""}`} />
        </button>
      </div>
      <div className="p-4 bg-white flex items-center justify-center min-h-[80px]">{children}</div>
      {showCode && (
        <div className="border-t border-gray-200 bg-gray-900 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-mono">TSX</span>
            <CopyButton text={code} />
          </div>
          <pre className="text-[10px] text-gray-300 font-mono overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default function ComponentLibraryPage() {
  // State for component demos
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Component Library</h1>
            <p className="text-gray-500 mt-1">Reusable components and design tokens for consistent UI</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">v1.0</span>
        </div>

        {/* Design Tokens Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colors */}
          <Section title="Colors" icon={Palette}>
            <div className="space-y-6">
              {/* Accent Colors */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Accent (Primary)</h3>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(designTokens.colors.accent).map(([key, value]) => (
                    <ColorSwatch key={key} name={`accent-${key}`} hex={value} />
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Semantic</h3>
                <div className="grid grid-cols-2 gap-1">
                  <ColorSwatch name="Success" hex={designTokens.colors.success} />
                  <ColorSwatch name="Warning" hex={designTokens.colors.warning} />
                  <ColorSwatch name="Error" hex={designTokens.colors.error} />
                  <ColorSwatch name="Info" hex={designTokens.colors.info} />
                </div>
              </div>
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography" icon={Type}>
            <div className="space-y-4">
              {/* Font Family */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Font Family</h3>
                <div className="p-2.5 bg-gray-50 rounded-lg flex items-center justify-between">
                  <p className="text-base font-bold text-gray-900">Inter</p>
                  <p className="text-[10px] text-gray-500 font-mono">{designTokens.typography.fontFamily}</p>
                </div>
              </div>

              {/* Font Sizes - Compact Grid */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Font Sizes</h3>
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(designTokens.typography.sizes).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-1.5 bg-gray-50 rounded hover:bg-gray-100">
                      <span className="text-xs font-medium text-gray-800">{key}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Weights - Compact Grid */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Font Weights</h3>
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(designTokens.typography.weights).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-1.5 bg-gray-50 rounded hover:bg-gray-100">
                      <span style={{ fontWeight: value }} className="text-xs text-gray-800">
                        {key}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Spacing & Radius */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spacing */}
          <Section title="Spacing" icon={Box}>
            <div className="space-y-2">
              {Object.entries(designTokens.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 w-8">{key}</span>
                  <div className="h-4 bg-blue-500 rounded" style={{ width: value }} />
                  <span className="text-xs text-gray-400 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Border Radius */}
          <Section title="Border Radius" icon={Box}>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(designTokens.borderRadius).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500" style={{ borderRadius: value }} />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{key}</div>
                    <div className="text-xs text-gray-500 font-mono">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Components Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Components
          </h2>

          {/* Date Range Picker */}
          <ComponentPreview
            title="Date Range Picker"
            description="A date range picker for selecting a start and end date"
            code={`import DateRangePicker from "@/components/common/DateRangePicker";

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  placeholder="Select dates"
  className="min-w-[200px]"
/>`}
          >
            <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="Select dates" className="min-w-[200px]" />
          </ComponentPreview>

          {/* Buttons */}
          <ComponentPreview
            title="Buttons"
            description="Action buttons with icons"
            code={`import { Button } from "@heroui/react";
import { Upload, FileEdit, Download } from "lucide-react";

<Button variant="secondary" className="rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-4 py-1.5 text-sm flex items-center gap-2">
  <Upload size={16} />
  Bulk Add
</Button>`}
          >
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-4 py-1.5 text-sm flex items-center gap-2">
                <Upload size={16} />
                Bulk Add
              </Button>
              <Button variant="secondary" className="rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-4 py-1.5 text-sm flex items-center gap-2">
                <FileEdit size={16} />
                Edit Reservation Template PDF
              </Button>
              <Button variant="secondary" className="rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-4 py-1.5 text-sm flex items-center gap-2">
                <Download size={16} />
                Export
              </Button>
            </div>
          </ComponentPreview>

          {/* Status Labels */}
          <ComponentPreview
            title="Status Labels"
            description="Pill-shaped status badges for different states"
            code={`<span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
  Approved
</span>
<span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-500">
  Rejected
</span>
<span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-600">
  Blocking
</span>`}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-100">Approved</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-500 border border-red-100">Rejected</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-600 border border-amber-100">Blocking</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">Incomplete</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100">Reserving</span>
            </div>
          </ComponentPreview>
        </div>

        {/* Usage Guidelines */}
        <Section title="Usage Guidelines" icon={Type}>
          <div className="prose prose-sm max-w-none">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Color Usage</h3>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>
                <strong>accent-500</strong> - Primary buttons, active states, links
              </li>
              <li>
                <strong>accent-600</strong> - Button hover states
              </li>
              <li>
                <strong>accent-50/100</strong> - Backgrounds for active/selected items
              </li>
              <li>
                <strong>gray-50</strong> - Page backgrounds, subtle containers
              </li>
              <li>
                <strong>gray-200</strong> - Borders, dividers
              </li>
              <li>
                <strong>gray-600/700</strong> - Body text
              </li>
              <li>
                <strong>gray-900</strong> - Headings
              </li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mb-2">Typography Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <strong>Headings:</strong> font-bold (700)
              </li>
              <li>
                <strong>Subheadings:</strong> font-semibold (600)
              </li>
              <li>
                <strong>Body text:</strong> font-normal (400)
              </li>
              <li>
                <strong>Labels:</strong> font-medium (500), text-sm
              </li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
}
