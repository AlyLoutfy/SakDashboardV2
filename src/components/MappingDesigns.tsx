import { Button, Input, Chip, ComboBox, ListBox } from "@heroui/react";
import { ArrowRight, Plus, Trash2, Settings2, X, MoreVertical, Edit2, ArrowRightCircle } from "lucide-react";

// Mock Data
const MOCK_MAPPING = [
  { id: "1", sourceFields: ["First Name", "Given Name"], target: "first_name_v2", defaultValue: "" },
  { id: "2", sourceFields: ["Email", "Email Address"], target: "email_primary", defaultValue: "no-email@example.com" },
  { id: "3", sourceFields: ["Phone"], target: "mobile_phone", defaultValue: "" },
];

const TARGET_FIELDS = [
  { key: "first_name_v2", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email_primary", label: "Email" },
  { key: "mobile_phone", label: "Phone" },
];

// Helper for consistency
const AddButton = () => (
  <button className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors">
    <Plus size={12} />
  </button>
);

// ----------------------------------------------------------------------
// VAR 1: ORIGINAL (Refined)
// ----------------------------------------------------------------------
const Design1 = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="absolute top-0 right-0 p-4 opacity-50 text-[100px] leading-none font-black text-gray-100 dark:text-zinc-800 -z-10 select-none">{row.id}</div>
        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Map To</label>
          <div className="text-xl font-bold text-gray-900 dark:text-white pb-2 border-b-2 border-blue-500 inline-block">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
              From Sources <span className="bg-gray-200 text-gray-600 px-1.5 rounded-full text-[9px]">{row.sourceFields.length}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {row.sourceFields.map((f) => (
                <Chip key={f} size="sm" className="bg-white border shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                  {f}
                </Chip>
              ))}
              <AddButton />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Default Value</label>
            <div className="text-sm font-mono text-gray-600 dark:text-gray-400">{row.defaultValue ? `"${row.defaultValue}"` : <span className="text-gray-300 italic">undefined</span>}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ----------------------------------------------------------------------
// VAR 2: WIDE / HORIZONTAL
// ----------------------------------------------------------------------
const Design2 = () => (
  <div className="flex flex-col gap-4">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="flex items-center gap-6 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

        <div className="flex-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 block">Target Field</label>
          <div className="text-lg font-bold text-gray-900 dark:text-white h-8 flex items-center">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</div>
        </div>

        <div className="text-gray-300 mt-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </div>

        <div className="flex-[2]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 block">Sources</label>
          <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
            {row.sourceFields.map((f) => (
              <Chip key={f} size="sm" variant="flat" className="px-3">
                {f}
              </Chip>
            ))}
            <AddButton />
          </div>
        </div>

        <div className="w-px h-10 bg-gray-100 dark:bg-zinc-800 mx-2" />

        <div className="flex-1 max-w-[200px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 block">Fallback</label>
          <Input
            size="sm"
            variant="flat"
            placeholder="null"
            defaultValue={row.defaultValue}
            classNames={{
              input: "font-mono text-sm",
              inputWrapper: "h-8 bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 shadow-none px-0",
            }}
          />
        </div>

        <Button isIconOnly size="sm" variant="ghost" className="mt-4">
          <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
        </Button>
      </div>
    ))}
    <Button variant="ghost" className="w-full h-12 border-2 border-dashed border-gray-200 text-gray-400 font-medium">
      + Add New Mapping
    </Button>
  </div>
);

// ----------------------------------------------------------------------
// VAR 3: MINIMALIST (Clean White)
// ----------------------------------------------------------------------
const Design3 = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-100 dark:border-zinc-800 hover:border-blue-300 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Target</div>
            <div className="text-lg font-bold">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</div>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="text-xs font-semibold text-gray-500 mb-2">Sources</div>
            <div className="flex flex-wrap gap-1.5">
              {row.sourceFields.map((f) => (
                <span key={f} className="text-xs bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 px-1.5 py-0.5 rounded">
                  {f}
                </span>
              ))}
              <span className="text-xs text-gray-400 px-1 cursor-pointer">+</span>
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-gray-400">Default:</span>
            <code className="text-xs bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{row.defaultValue || "null"}</code>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ----------------------------------------------------------------------
// VAR 4: SOLID HEADER
// ----------------------------------------------------------------------
const Design4 = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <span className="font-bold">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</span>
          <Settings2 size={16} className="text-blue-200 hover:text-white cursor-pointer" />
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="text-xs text-gray-400 uppercase font-bold mb-2">Mapped Sources</div>
            <div className="flex flex-wrap gap-2">
              {row.sourceFields.map((f) => (
                <Chip key={f} size="sm" variant="soft" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {f}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
            <span className="text-xs text-gray-400 uppercase font-bold">Fallback:</span>
            <span className="text-sm">{row.defaultValue || <span className="text-gray-300">None</span>}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ----------------------------------------------------------------------
// VAR 5: INTERACTIVE HOVER
// ----------------------------------------------------------------------
const Design5 = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="group relative bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button size="sm" isIconOnly variant="ghost" className="h-8 w-8">
            <Edit2 size={14} />
          </Button>
        </div>

        <div className="mb-4">
          <div className="text-xs text-blue-500 font-bold tracking-wide mb-1">TARGET FIELD</div>
          <div className="text-2xl font-bold">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl space-y-3 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <ArrowRightCircle size={16} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 mb-1">Sources</div>
              <div className="flex flex-wrap gap-1">
                {row.sourceFields.map((f) => (
                  <span key={f} className="text-sm font-medium">
                    {f},
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <AlertCircleIcon size={16} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 mb-1">Default</div>
              <div className="text-sm font-mono">{row.defaultValue || "null"}</div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
const AlertCircleIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ----------------------------------------------------------------------
// VAR 6: STEP PROCESS
// ----------------------------------------------------------------------
const Design6 = () => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {MOCK_MAPPING.map((row, i) => (
      <div key={row.id} className="min-w-[300px] bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 flex flex-col relative">
        <div className="absolute top-0 right-0 p-2 text-gray-200 font-black text-4xl -z-10">{i + 1}</div>

        <div className="flex-1 space-y-4">
          <div className="relative pl-4 border-l-2 border-gray-200 dark:border-zinc-800">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Incoming</div>
            <div className="flex flex-wrap gap-1">
              {row.sourceFields.map((f) => (
                <Chip key={f} size="sm" variant="soft">
                  {f}
                </Chip>
              ))}
            </div>
          </div>

          <div className="relative pl-4 border-l-2 border-gray-200 dark:border-zinc-800">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Fallback</div>
            <div className="text-sm">{row.defaultValue || <span className="text-gray-300">Same as source</span>}</div>
          </div>

          <div className="relative pl-4 border-l-2 border-blue-500">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-zinc-900" />
            <div className="text-xs font-bold text-blue-500 uppercase mb-1">Target</div>
            <div className="text-lg font-bold">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ----------------------------------------------------------------------
// VAR 7: COMPACT GRID
// ----------------------------------------------------------------------
const Design7 = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 flex flex-col justify-between h-48">
        <div>
          <div className="flex justify-between items-start">
            <div className="font-bold text-lg leading-tight mb-4">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</div>
            <button className="text-gray-300 hover:text-gray-600">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-500 mb-2">Sources:</div>
          <div className="flex flex-wrap gap-1">
            {row.sourceFields.map((f) => (
              <span key={f} className="text-xs bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-400">Default</span>
          <span className="text-xs font-mono bg-gray-50 dark:bg-zinc-800 px-1">{row.defaultValue || "-"}</span>
        </div>
      </div>
    ))}
    <button className="h-48 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
      <Plus size={24} />
      <span className="text-sm font-medium mt-2">Add Field</span>
    </button>
  </div>
);

// ----------------------------------------------------------------------
// VAR 8: STATUS BORDER
// ----------------------------------------------------------------------
const Design8 = () => (
  <div className="flex flex-col gap-4">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="flex bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="w-1.5 bg-green-500" />
        <div className="p-4 flex-1 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Target Field</div>
            <div className="text-lg font-bold">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400 font-medium mb-1">{row.sourceFields.length} Sources</div>
              <div className="flex -space-x-1 justify-end">
                {row.sourceFields.map((f) => (
                  <div key={f} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 border border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold" title={f}>
                    {f[0]}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-8 w-px bg-gray-100 dark:bg-zinc-800" />
            <Button isIconOnly variant="ghost" size="sm">
              <Settings2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ----------------------------------------------------------------------
// VAR 9: GLASSY GRADIENT (Refined)
// ----------------------------------------------------------------------
const Design9 = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-3xl">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 dark:border-white/10 shadow-lg shadow-indigo-100/50 dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase">String</span>
          <Button isIconOnly size="sm" variant="ghost" className="h-6 w-6 rounded-full">
            <X size={12} />
          </Button>
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{TARGET_FIELDS.find((f) => f.key === row.target)?.label}</h3>

        <div className="space-y-3">
          <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-indigo-50 dark:border-indigo-900/20">
            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Mapped From</div>
            <div className="flex flex-wrap gap-1">
              {row.sourceFields.map((f) => (
                <span key={f} className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {f},
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-indigo-50 dark:border-indigo-900/20">
            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Default</div>
            <div className="text-xs font-mono">{row.defaultValue || "null"}</div>
          </div>
        </div>
      </div>
    ))}
    <button className="flex items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 text-indigo-400 font-bold hover:bg-white/50 transition-colors">+ Add Card</button>
  </div>
);

// ----------------------------------------------------------------------
// VAR 10: TECH / WIREFRAME
// ----------------------------------------------------------------------
const Design10 = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
    {MOCK_MAPPING.map((row) => (
      <div key={row.id} className="bg-gray-50 dark:bg-zinc-950 p-0 border border-gray-300 dark:border-zinc-700 relative">
        <div className="absolute top-0 right-0 p-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>

        <div className="p-4 border-b border-gray-300 dark:border-zinc-700">
          <label className="text-xs text-gray-500 block mb-1">Target_Field:</label>
          <div className="font-bold">{row.target}</div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Sources[]:</label>
            <ul className="list-disc list-inside text-xs text-gray-700 dark:text-gray-300">
              {row.sourceFields.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Def_Val:</label>
            <div className="text-xs text-gray-700 dark:text-gray-300">{row.defaultValue || "null"}</div>
          </div>
        </div>

        <div className="p-2 border-t border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900 flex justify-end">
          <button className="text-xs hover:underline">[EDIT CONFIG]</button>
        </div>
      </div>
    ))}
  </div>
);

export const MAPPING_DESIGNS = [
  { id: 1, name: "Original Gallery", Component: Design1 },
  { id: 2, name: "Wide Gallery", Component: Design2 },
  { id: 3, name: "Minimalist", Component: Design3 },
  { id: 4, name: "Solid Header", Component: Design4 },
  { id: 5, name: "Interactive Hover", Component: Design5 },
  { id: 6, name: "Step Process", Component: Design6 },
  { id: 7, name: "Compact Grid", Component: Design7 },
  { id: 8, name: "Status Border", Component: Design8 },
  { id: 9, name: "Glassy Gradient", Component: Design9 },
  { id: 10, name: "Tech Wireframe", Component: Design10 },
];
