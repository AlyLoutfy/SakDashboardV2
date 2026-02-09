import { Button, Checkbox, Chip } from "@heroui/react";
import { FileText, Filter, Download, Columns, Search, Plus, MoreHorizontal, ChevronDown, ArrowRight, LayoutGrid, Table as TableIcon, PieChart, Settings2, Share2, RefreshCw, X } from "lucide-react";

// --- Shared Mock Data ---
const MOCK_TABLE_DATA = [
  { id: "1", unit: "A-101", price: "3,500,000", status: "Available", type: "Apartment" },
  { id: "2", unit: "B-205", price: "8,200,000", status: "Sold", type: "Villa" },
  { id: "3", unit: "C-310", price: "5,100,000", status: "Reserved", type: "Duplex" },
  { id: "4", unit: "D-401", price: "2,800,000", status: "Available", type: "Chalet" },
  { id: "5", unit: "E-505", price: "4,200,000", status: "Available", type: "Apartment" },
];

const MockTable = ({ minimal = false, density = "normal" }: { minimal?: boolean; density?: "compact" | "normal" | "spacious" }) => (
  <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 font-medium">
        <tr>
          <th className={`px-4 ${density === "compact" ? "py-2" : "py-3"}`}>Unit Code</th>
          <th className={`px-4 ${density === "compact" ? "py-2" : "py-3"}`}>Type</th>
          <th className={`px-4 ${density === "compact" ? "py-2" : "py-3"}`}>Price (EGP)</th>
          <th className={`px-4 ${density === "compact" ? "py-2" : "py-3"}`}>Status</th>
          {!minimal && <th className="px-4 py-3 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
        {MOCK_TABLE_DATA.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
            <td className={`px-4 ${density === "compact" ? "py-2" : "py-3"} font-medium`}>{row.unit}</td>
            <td className={`px-4 ${density === "compact" ? "py-2" : "py-3"} text-gray-500`}>{row.type}</td>
            <td className={`px-4 ${density === "compact" ? "py-2" : "py-3"}`}>{row.price}</td>
            <td className={`px-4 ${density === "compact" ? "py-2" : "py-3"}`}>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.status === "Available" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : row.status === "Sold" ? "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>{row.status}</span>
            </td>
            {!minimal && (
              <td className="px-4 py-3 text-right">
                <Button size="sm" isIconOnly variant="ghost">
                  <MoreHorizontal size={16} />
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- DESIGN 1: Classic Sidebar ---
const Design1 = () => (
  <div className="flex h-[600px] w-full border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-black font-sans">
    <div className="w-72 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter size={18} /> Filters
        </h3>
      </div>
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Data Source</label>
          <div className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg flex items-center justify-between">
            <span>Units Inventory</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-9 border border-gray-200 dark:border-zinc-800 rounded-md px-2 flex items-center text-sm text-gray-500">Dec 1</div>
            <div className="h-9 border border-gray-200 dark:border-zinc-800 rounded-md px-2 flex items-center text-sm text-gray-500">Jan 1</div>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase">Status</label>
          <div className="space-y-2">
            {["Available", "Reserved", "Sold", "Blocked"].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <Checkbox /> <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
        <Button className="w-full bg-blue-600 text-white shadow-md">Apply Filters</Button>
      </div>
    </div>
    <div className="flex-1 flex flex-col min-w-0">
      <div className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
        <h2 className="font-bold text-lg">Inventory Report</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Columns size={16} className="mr-2" /> Columns
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={16} className="mr-2" /> Export
          </Button>
        </div>
      </div>
      <div className="p-6 overflow-auto bg-gray-50 dark:bg-black">
        <MockTable />
      </div>
    </div>
  </div>
);

// --- DESIGN 2: Floating Glass ---
const Design2 = () => (
  <div className="h-[600px] w-full rounded-xl overflow-hidden relative bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-800 font-sans p-6">
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-6">
      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 dark:border-white/10 p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <PieChart size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white leading-tight">Sales Performance</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Viewing last 30 days</p>
          </div>
        </div>
        <div className="flex bg-gray-100/50 dark:bg-zinc-800/50 p-1 rounded-xl">
          {["Units", "Sales", "Leads"].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${i === 0 ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              {tab}
            </button>
          ))}
        </div>
        <Button className="bg-black text-white dark:bg-white dark:text-black rounded-xl px-6">
          <Download size={16} className="mr-2" /> Export
        </Button>
      </div>
      <div className="flex-1 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/5 overflow-hidden shadow-xl flex flex-col">
        <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100/50 dark:border-zinc-800/50">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full bg-white/50 dark:bg-zinc-800/50 rounded-full pl-9 pr-4 py-2 text-sm border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400" placeholder="Search data..." />
          </div>
          <div className="flex-1" />
          {/* Columns Dropdown */}
          <div className="relative group">
            <Button size="sm" variant="ghost" className="rounded-full gap-2">
              <Columns size={16} /> Columns <ChevronDown size={14} />
            </Button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Toggle Columns</div>
              {["Unit Code", "Type", "Price", "Status"].map((col) => (
                <div key={col} className="flex items-center gap-2 py-1.5">
                  <Checkbox defaultSelected />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{col}</span>
                </div>
              ))}
            </div>
          </div>
          <Button isIconOnly size="sm" variant="ghost" className="rounded-full">
            <Filter size={18} />
          </Button>
          <Button isIconOnly size="sm" variant="ghost" className="rounded-full">
            <Settings2 size={18} />
          </Button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <MockTable />
        </div>
      </div>
    </div>
  </div>
);

// --- DESIGN 3: Dense Spreadsheet ---
const Design3 = () => (
  <div className="h-[600px] w-full border border-gray-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-black font-mono flex flex-col">
    <div className="h-10 bg-[#107c41] text-white flex items-center px-4 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <TableIcon size={18} />
        <span className="font-semibold text-sm">Reports.xlsx</span>
      </div>
      <div className="flex gap-2 text-white/80">
        <Share2 size={16} />
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">LM</div>
      </div>
    </div>
    <div className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-2 flex items-center gap-1 overflow-x-auto shrink-0">
      <div className="flex flex-col items-center px-3 border-r border-gray-200 dark:border-zinc-800 gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
        <Filter size={16} className="text-gray-600 dark:text-gray-400" />
        <span className="text-[10px] text-gray-500">Filter</span>
      </div>
      <div className="flex flex-col items-center px-3 border-r border-gray-200 dark:border-zinc-800 gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
        <Columns size={16} className="text-gray-600 dark:text-gray-400" />
        <span className="text-[10px] text-gray-500">Columns</span>
      </div>
      <div className="flex flex-col items-center px-3 border-r border-gray-200 dark:border-zinc-800 gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
        <RefreshCw size={16} className="text-gray-600 dark:text-gray-400" />
        <span className="text-[10px] text-gray-500">Refresh</span>
      </div>
      <div className="px-4 flex items-center gap-2">
        <span className="text-xs text-gray-500">Source:</span>
        <Chip size="sm" className="bg-white border border-gray-200">
          Units
        </Chip>
      </div>
    </div>
    <div className="h-8 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-black flex items-center px-2 shrink-0">
      <div className="text-xs text-gray-400 w-8 border-r border-gray-200 dark:border-zinc-800 mr-2">fx</div>
      <div className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">=QUERY(Units, "SELECT * WHERE Status = 'Available'")</div>
    </div>
    <div className="flex-1 overflow-auto bg-white dark:bg-black relative">
      <MockTable minimal density="compact" />
    </div>
    <div className="h-6 bg-gray-100 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between px-3 text-[10px] text-gray-500 shrink-0">
      <span>Ready</span>
      <div className="flex gap-4">
        <span>Count: 5</span>
        <span>Sum: 23,800,000</span>
      </div>
    </div>
  </div>
);

// --- DESIGN 4: Stepper Wizard ---
const Design4 = () => (
  <div className="h-[600px] w-full border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 flex font-sans">
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-8 flex flex-col">
      <div className="mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
          <FileText size={20} />
        </div>
        <h2 className="font-bold text-xl">New Report</h2>
        <p className="text-sm text-gray-500 mt-1">Create a custom export in 3 steps.</p>
      </div>
      <div className="space-y-6 relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-zinc-800 -z-10" />
        {[
          { s: "01", t: "Select Source", a: true },
          { s: "02", t: "Filter Data", a: true },
          { s: "03", t: "Customize", a: true },
          { s: "04", t: "Preview & Export", a: false },
        ].map((step) => (
          <div key={step.s} className="flex gap-4 items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-zinc-900 ${step.a ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-400"}`}>{step.s}</div>
            <span className={`text-sm font-medium ${step.a ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{step.t}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col p-8 sm:p-12 overflow-y-auto">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Review & Export</h1>
          <p className="text-gray-500">Preview your query results before exporting.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-1 mb-8">
          <MockTable minimal density="spacious" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            <span className="text-sm text-gray-500 block mb-1">Total Records</span>
            <span className="text-2xl font-bold">142</span>
          </div>
          <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            <span className="text-sm text-gray-500 block mb-1">Estimated Size</span>
            <span className="text-2xl font-bold">2.4 MB</span>
          </div>
        </div>
      </div>
      <div className="h-20 border-t border-gray-200 dark:border-zinc-800 -mx-12 -mb-12 mt-8 px-12 flex items-center justify-between bg-white dark:bg-zinc-900">
        <Button variant="ghost">Back</Button>
        <Button className="bg-indigo-600 text-white">
          Export Now <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  </div>
);

// --- DESIGN 5: Command Center ---
const Design5 = () => (
  <div className="h-[600px] w-full bg-[#09090b] text-white rounded-xl overflow-hidden font-sans border border-zinc-800 flex flex-col">
    <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-950">
      <div className="flex items-center gap-2 text-zinc-400">
        <LayoutGrid size={18} />
        <span className="text-sm font-medium text-white">Reports</span>
        <span className="text-zinc-600">/</span>
        <span className="text-sm">Q4 Sales Analysis</span>
      </div>
      <div className="flex gap-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Live Data
        </div>
        <Button size="sm" className="bg-white text-black h-8">
          <Download size={14} className="mr-2" /> Export
        </Button>
      </div>
    </div>
    <div className="flex-1 flex overflow-hidden">
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-4 overflow-y-auto">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Active Filters</div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-3 relative group">
          <div className="text-[10px] text-zinc-500 uppercase mb-1">Status</div>
          <div className="text-sm font-medium text-emerald-400">Available OR Reserved</div>
          <X size={14} className="absolute top-2 right-2 text-zinc-600 opacity-0 group-hover:opacity-100 cursor-pointer" />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-3 relative group">
          <div className="text-[10px] text-zinc-500 uppercase mb-1">Price Range</div>
          <div className="text-sm font-medium text-blue-400">&gt; 3,000,000 EGP</div>
          <X size={14} className="absolute top-2 right-2 text-zinc-600 opacity-0 group-hover:opacity-100 cursor-pointer" />
        </div>
        <Button variant="ghost" className="w-full text-zinc-400 border border-dashed border-zinc-800 hover:border-zinc-700 h-10">
          <Plus size={16} className="mr-2" /> Add Filter
        </Button>
      </div>
      <div className="flex-1 bg-[#09090b] flex flex-col">
        <div className="flex-1 p-4 overflow-auto">
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {MOCK_TABLE_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-900/50">
                    <td className="px-4 py-3 font-mono text-emerald-500">{row.unit}</td>
                    <td className="px-4 py-3 opacity-70">{row.type}</td>
                    <td className="px-4 py-3">{row.price}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${row.status === "Available" ? "bg-emerald-500" : "bg-red-500"}`} />
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- DESIGN 6: Split Analytics (Glass + Chart) ---
const Design6 = () => (
  <div className="h-[600px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-zinc-900 dark:via-purple-950/20 dark:to-zinc-900 font-sans p-6">
    <div className="h-full flex gap-6">
      <div className="w-1/3 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/5 p-6 flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white">Analytics</h3>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Live</div>
        </div>
        <div className="flex-1 flex items-end gap-2 pb-4">
          {[45, 72, 38, 85, 52, 90, 68, 78, 55, 95, 42, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div style={{ height: `${h}%` }} className={`w-full rounded-t-lg transition-all ${i === 9 ? "bg-gradient-to-t from-purple-500 to-fuchsia-500 shadow-lg shadow-purple-500/30" : "bg-purple-200/50 dark:bg-purple-900/30"}`} />
              <span className="text-[8px] text-gray-400">{i + 1}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Value</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">23.8M EGP</span>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/5 overflow-hidden shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-100/50 dark:border-zinc-800/50 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl text-gray-800 dark:text-white">Units Overview</h2>
            <p className="text-sm text-gray-500 mt-1">5 records matching filters</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl px-6 shadow-lg shadow-purple-500/20">
            <Download size={16} className="mr-2" /> Export
          </Button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <MockTable />
        </div>
      </div>
    </div>
  </div>
);

// --- DESIGN 7: Neon Dashboard ---
const Design7 = () => (
  <div className="h-[600px] w-full bg-[#0a0a0f] text-white rounded-xl overflow-hidden font-sans border border-cyan-500/20 flex flex-col relative">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
    </div>
    <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/30 backdrop-blur-sm relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <LayoutGrid size={20} />
        </div>
        <div>
          <h1 className="font-bold text-lg">Data Console</h1>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Real-time sync active
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
          <Filter size={14} className="inline mr-2" /> Filters
        </button>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium shadow-lg shadow-cyan-500/20">Export Report</button>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-4 p-6 relative z-10">
      {[
        { label: "Total Units", value: "2,847", cls: "text-cyan-400" },
        { label: "Available", value: "1,234", cls: "text-emerald-400" },
        { label: "Reserved", value: "456", cls: "text-amber-400" },
        { label: "Total Value", value: "847M", cls: "text-purple-400" },
      ].map((stat) => (
        <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</div>
          <div className={`text-2xl font-bold ${stat.cls}`}>{stat.value}</div>
        </div>
      ))}
    </div>
    <div className="flex-1 px-6 pb-6 overflow-auto relative z-10">
      <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_TABLE_DATA.map((row) => (
              <tr key={row.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-cyan-400">{row.unit}</td>
                <td className="px-4 py-3 text-zinc-400">{row.type}</td>
                <td className="px-4 py-3">{row.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${row.status === "Available" ? "bg-emerald-500/20 text-emerald-400" : row.status === "Sold" ? "bg-zinc-500/20 text-zinc-400" : "bg-amber-500/20 text-amber-400"}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- DESIGN 8: Gradient Cards ---
const Design8 = () => (
  <div className="h-[600px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-800 font-sans p-6">
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Report Builder</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure your export settings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="rounded-xl">
            <Settings2 size={18} className="mr-2" /> Settings
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
            <Download size={18} className="mr-2" /> Generate
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Data Source", value: "Units", icon: "📊", bg: "from-blue-500 to-indigo-600" },
          { label: "Records", value: "2,847", icon: "📝", bg: "from-emerald-500 to-teal-600" },
          { label: "Filters", value: "3 Active", icon: "🔍", bg: "from-orange-500 to-rose-600" },
          { label: "Est. Size", value: "4.2 MB", icon: "📦", bg: "from-purple-500 to-pink-600" },
        ].map((card) => (
          <div key={card.label} className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm border border-white/50 dark:border-white/5 p-4">
            <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${card.bg} opacity-20 blur-xl`} />
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.label}</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white mt-1">{card.value}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/5 overflow-hidden shadow-xl">
        <div className="h-12 px-6 flex items-center border-b border-gray-100/50 dark:border-zinc-800/50">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Preview Data</span>
        </div>
        <div className="p-4 overflow-auto h-[calc(100%-3rem)]">
          <MockTable minimal />
        </div>
      </div>
    </div>
  </div>
);

// --- DESIGN 9: Matrix Terminal ---
const Design9 = () => (
  <div className="h-[600px] w-full bg-black text-green-400 rounded-xl overflow-hidden font-mono border border-green-900/50 flex flex-col">
    <div className="h-10 bg-green-950/30 border-b border-green-900/50 flex items-center px-4 gap-2">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
      <span className="text-xs text-green-600 ml-4">sak@reports:~/exports $</span>
    </div>
    <div className="flex-1 p-4 overflow-auto text-sm">
      <div className="text-green-600 mb-2">$ report --source units --format table</div>
      <div className="text-green-500 mb-4">
        Connecting to database...
        <br />
        [████████████████████████] 100%
        <br />
        Fetching records...
        <br />
        <span className="text-green-400">✓ Found 5 records matching query</span>
      </div>
      <div className="text-green-400 text-xs leading-relaxed">
        <div className="border border-green-800 rounded">
          <div className="grid grid-cols-4 gap-px bg-green-800">
            <div className="bg-green-950 px-3 py-2 font-bold">UNIT</div>
            <div className="bg-green-950 px-3 py-2 font-bold">TYPE</div>
            <div className="bg-green-950 px-3 py-2 font-bold">PRICE</div>
            <div className="bg-green-950 px-3 py-2 font-bold">STATUS</div>
          </div>
          {MOCK_TABLE_DATA.map((row) => (
            <div key={row.id} className="grid grid-cols-4 gap-px bg-green-800">
              <div className="bg-black px-3 py-2">{row.unit}</div>
              <div className="bg-black px-3 py-2">{row.type}</div>
              <div className="bg-black px-3 py-2">{row.price}</div>
              <div className="bg-black px-3 py-2">{row.status}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-green-600">
        $ _<span className="animate-pulse">█</span>
      </div>
    </div>
    <div className="h-12 bg-green-950/20 border-t border-green-900/50 flex items-center px-4 gap-4">
      <button className="px-3 py-1 rounded bg-green-900/30 text-green-400 text-xs border border-green-800/50 hover:bg-green-900/50">[F1] Export CSV</button>
      <button className="px-3 py-1 rounded bg-green-900/30 text-green-400 text-xs border border-green-800/50 hover:bg-green-900/50">[F2] Export JSON</button>
      <button className="px-3 py-1 rounded bg-green-900/30 text-green-400 text-xs border border-green-800/50 hover:bg-green-900/50">[F3] Add Filter</button>
      <div className="flex-1" />
      <span className="text-[10px] text-green-700">v2.4.1 | connected</span>
    </div>
  </div>
);

// --- DESIGN 10: Minimal Zen ---
const Design10 = () => (
  <div className="h-[600px] w-full rounded-xl overflow-hidden bg-[#fafafa] dark:bg-zinc-950 font-sans flex flex-col">
    <div className="h-20 flex items-center justify-between px-10 border-b border-gray-100 dark:border-zinc-900">
      <div className="flex items-center gap-6">
        <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
          <FileText size={16} className="text-white dark:text-black" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Reports</h1>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <button className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Filters</button>
        <button className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Columns</button>
        <button className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Schedule</button>
        <button className="h-9 px-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium">Export</button>
      </div>
    </div>
    <div className="flex-1 flex">
      <div className="w-64 border-r border-gray-100 dark:border-zinc-900 p-8 space-y-8">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Records</div>
          <div className="text-4xl font-light text-gray-900 dark:text-white">2,847</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Source</div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">Units</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Last Updated</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Just now</div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-[#fafafa] dark:bg-zinc-950">
            <tr className="border-b border-gray-100 dark:border-zinc-900">
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TABLE_DATA.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 dark:border-zinc-900 hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-5 text-sm font-medium text-gray-900 dark:text-white">{row.unit}</td>
                <td className="px-6 py-5 text-sm text-gray-500">{row.type}</td>
                <td className="px-6 py-5 text-sm text-gray-900 dark:text-white">{row.price}</td>
                <td className="px-6 py-5 text-sm text-gray-500">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const REPORT_DESIGNS = [
  { id: 1, name: "Classic Sidebar", Component: Design1 },
  { id: 2, name: "Floating Glass", Component: Design2 },
  { id: 3, name: "Dense Spreadsheet", Component: Design3 },
  { id: 4, name: "Stepper Wizard", Component: Design4 },
  { id: 5, name: "Command Center", Component: Design5 },
  { id: 6, name: "Split Analytics", Component: Design6 },
  { id: 7, name: "Neon Dashboard", Component: Design7 },
  { id: 8, name: "Gradient Cards", Component: Design8 },
  { id: 9, name: "Matrix Terminal", Component: Design9 },
  { id: 10, name: "Minimal Zen", Component: Design10 },
];
