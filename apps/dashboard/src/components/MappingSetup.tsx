import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Plus, Trash2, ArrowLeft, Save, X, Search, ChevronDown, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import type { FieldMapping, IntegrationData } from "../store/integrationStore";

interface MappingSetupProps {
  integration: IntegrationData;
  integrationName?: string;
  onBack: () => void;
  onUpdate: (data: Partial<IntegrationData>) => void;
  isLoading?: boolean;
}

const SAKNEEN_FIELDS = ["Full Name", "Email Address", "Phone Number", "Budget Min", "Budget Max", "Interest Type", "Unit Type", "Sales Agent"];

const SOURCE_FIELDS_MOCK = ["Full Name", "Email", "Phone", "Notes", "Company", "Job Title", "City", "Ad Name", "Form ID"];

const SourceFieldManager = ({ currentFields, onAdd, onRemove }: { currentFields: string[]; onAdd: (val: string) => void; onRemove: (val: string) => void }) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
      {currentFields.map((f) => (
        <Badge key={f} variant="secondary" className="h-7 px-3 bg-gray-100 text-gray-700 rounded-md">
          {f}
          <button type="button" onClick={() => onRemove(f)} className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors" aria-label="Remove source">
            <X size={10} />
          </button>
        </Badge>
      ))}

      {isAdding ? (
        <div className="w-40 relative">
          <select
            autoFocus
            value=""
            onChange={(e) => {
              if (e.target.value) {
                onAdd(e.target.value);
                setIsAdding(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsAdding(false);
              }
            }}
            onBlur={() => {
              setTimeout(() => setIsAdding(false), 200);
            }}
            className="w-full bg-transparent text-xs px-2 h-8 rounded-md shadow-sm border border-emerald-500 outline-none"
          >
            <option value="">Select a field...</option>
            {SOURCE_FIELDS_MOCK.filter((f) => !currentFields.includes(f)).map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-500 transition-colors" aria-label="Add Source">
          <Plus size={12} />
        </button>
      )}
    </div>
  );
};

const TargetFieldSelect = ({ value, onChange, options }: { value: string; onChange: (val: string) => void; options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <div className="relative w-full">
            <input value={value || ""} placeholder="Sakneen Field" readOnly className="w-full text-sm h-8 rounded-md border border-gray-200 px-2 cursor-pointer outline-none bg-white" />
            <ChevronDown size={14} className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={5} className="w-[220px] p-0 shadow-xl border border-gray-200 rounded-xl bg-white overflow-hidden">
        <div className="bg-gray-50 p-2 border-b border-gray-100">
          <div className="relative bg-white rounded-md overflow-hidden border border-gray-200">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={12} />
            </div>
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} placeholder="Search..." className="w-full pl-8 pr-2 py-1.5 text-xs border-none bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-900" />
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto p-1 scrollbar-hide w-full" role="listbox" aria-label="Select Target Field">
          {filteredOptions.map((opt) => (
            <div
              key={opt}
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`${value === opt ? "text-emerald-600 bg-emerald-50" : ""} hover:bg-emerald-50 rounded-md px-2 py-1.5 text-xs transition-colors w-full cursor-pointer`}
            >
              {opt}
            </div>
          ))}
          {filteredOptions.length === 0 && <div className="opacity-50 text-center text-sm py-4">No results found</div>}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const MappingSetup = ({ integration, integrationName = "Integration", onBack, onUpdate, isLoading }: MappingSetupProps) => {
  const [rows, setRows] = useState<FieldMapping[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (integration.mappings && integration.mappings.length > 0) {
      const initRows = integration.mappings.map((m) => ({
        ...m,
        // @ts-ignore
        sourceFields: m.sourceFields || (m.sourceField ? [m.sourceField] : []),
        defaultValue: m.defaultValue ?? "",
      }));
      setRows(initRows);
    } else {
      setRows([{ id: crypto.randomUUID(), sourceFields: [], targetField: "", defaultValue: "" }]);
    }
  }, [integration.mappings]);

  const addRow = () => {
    setRows([...rows, { id: crypto.randomUUID(), sourceFields: [], targetField: "", defaultValue: "" }]);
    setHasChanges(true);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
    setHasChanges(true);
  };

  const updateRow = (id: string, updates: Partial<FieldMapping>) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    setHasChanges(true);
  };

  const addSourceField = (id: string, value: string) => {
    if (!value) return;
    setRows(
      rows.map((r) => {
        if (r.id === id && !r.sourceFields.includes(value)) {
          return { ...r, sourceFields: [...r.sourceFields, value] };
        }
        return r;
      }),
    );
    setHasChanges(true);
  };

  const removeSourceField = (id: string, value: string) => {
    setRows(
      rows.map((r) => {
        if (r.id === id) {
          return { ...r, sourceFields: r.sourceFields.filter((f) => f !== value) };
        }
        return r;
      }),
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    const validRows = rows.filter((r) => r.sourceFields.length > 0 && r.targetField);
    onUpdate({ mappings: validRows });
    setHasChanges(false);
  };

  const handleToggleEnabled = (val: boolean) => {
    onUpdate({ enabled: val });
  };

  return (
    <div className="h-full w-full bg-white text-gray-900 rounded-xl overflow-hidden font-sans border border-gray-200 flex flex-col shadow-sm">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </button>
          <Settings size={18} />
          <span className="text-sm font-bold text-gray-700">Configure</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900">{integrationName}</span>
        </div>
        <div className="flex gap-2 items-center">
          {/* Status Toggle */}
          <div className={`${integration.enabled ? "bg-emerald-50 border-emerald-200" : "bg-gray-100 border-gray-200"} border rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8`}>
            <span className={`w-2 h-2 rounded-full ${integration.enabled ? "bg-emerald-500" : "bg-gray-400"}`} />
            <span className={integration.enabled ? "text-emerald-700" : "text-gray-500"}>{integration.enabled ? "Active" : "Disabled"}</span>
            <Switch size="sm" checked={integration.enabled ?? true} onCheckedChange={handleToggleEnabled} className="scale-75" />
          </div>
          <Button size="sm" className="bg-gray-900 text-white h-8 font-medium rounded-full px-4 shadow-sm hover:bg-gray-800 disabled:opacity-50" onClick={handleSave} disabled={!hasChanges}>
            <Save size={14} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Field Mapping</h1>
          <p className="text-gray-500 mt-1">Configure how {integrationName} sends data to your CRM.</p>
        </div>

        {/* Mapping Rows */}
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-gray-300 transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />

              {/* Target Field */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Target Field</label>
                <TargetFieldSelect value={row.targetField} onChange={(val) => updateRow(row.id, { targetField: val })} options={SAKNEEN_FIELDS} />
              </div>

              <div className="text-gray-300 mt-4 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </div>

              {/* Sources */}
              <div className="flex-[2] min-w-[280px]">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Sources</label>
                <SourceFieldManager currentFields={row.sourceFields} onAdd={(val) => addSourceField(row.id, val)} onRemove={(val) => removeSourceField(row.id, val)} />
              </div>

              <div className="w-px h-8 bg-gray-100 mx-1 shrink-0" />

              {/* Fallback */}
              <div className="flex-1 max-w-[160px] mr-12">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Fallback</label>
                <Input placeholder="null" value={row.defaultValue || ""} onChange={(e) => updateRow(row.id, { defaultValue: e.target.value })} className="font-mono text-sm h-8 rounded-md" />
              </div>

              <Button size="icon" variant="ghost" className="mt-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0" onClick={() => removeRow(row.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}

          <Button variant="ghost" className="w-full h-12 border-2 border-dashed border-gray-200 text-gray-400 font-medium hover:border-emerald-500 hover:text-emerald-600 rounded-xl" onClick={addRow}>
            + Add New Mapping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MappingSetup;
