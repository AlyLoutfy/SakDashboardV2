import { Button, Input, ComboBox, ListBox, Switch, Chip, Popover } from "@heroui/react";
import { Plus, Trash2, ArrowLeft, Save, X, Search, ChevronDown } from "lucide-react";
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
  const [inputValue, setInputValue] = useState("");

  const handleSelection = (key: React.Key | null) => {
    if (key) {
      onAdd(key.toString());
      setIsAdding(false);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) {
      onAdd(inputValue);
      setIsAdding(false);
      setInputValue("");
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
      {currentFields.map((f) => (
        <Chip key={f} size="sm" variant="soft" className="h-7 px-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-md">
          {f}
          <button type="button" onClick={() => onRemove(f)} className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors" aria-label="Remove source">
            <X size={10} />
          </button>
        </Chip>
      ))}

      {isAdding ? (
        <div className="w-40 relative">
          <ComboBox
            autoFocus
            aria-label="Add Source"
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSelectionChange={handleSelection}
            onKeyDown={handleKeyDown}
            allowsCustomValue
            className="w-full"
            onBlur={() => {
              setTimeout(() => {
                if (!inputValue) setIsAdding(false);
              }, 200);
            }}
          >
            <ComboBox.InputGroup>
              <Input placeholder="Type or select..." className="bg-transparent text-xs px-2 [&>div]:min-h-0 [&>div]:h-8 [&>div]:rounded-md [&>div]:shadow-sm border-blue-500" />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
              <ListBox>
                {SOURCE_FIELDS_MOCK.filter((f) => !currentFields.includes(f)).map((f) => (
                  <ListBox.Item key={f} id={f} textValue={f}>
                    {f}
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors" aria-label="Add Source">
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

  const items = filteredOptions.map((opt) => ({ key: opt, label: opt }));

  return (
    // @ts-ignore
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start" offset={5}>
      <Popover.Trigger>
        <div className="w-full">
          <div className="relative w-full">
            {/* @ts-ignore */}
            <Input value={value || ""} placeholder="Sakneen Field" readOnly className="w-full text-sm h-8 [&>div]:rounded-sm [&>div]:min-h-0 cursor-pointer caret-transparent [&>div]:!outline-none [&>div]:!ring-0 [&>div]:focus-within:!ring-0 [&_input]:pr-8" />
            <ChevronDown size={14} className={`absolute right-2 top-1/2 -translate-y-1/2 text-default-400 pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>{" "}
        </div>
      </Popover.Trigger>
      <Popover.Content className="w-[220px] p-0 shadow-2xl border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden ring-1 ring-black/5">
        <div className="bg-gray-100 p-2 border-b border-gray-200">
          <div className="relative shadow-sm bg-white dark:bg-zinc-800 rounded-md overflow-hidden border border-gray-200 dark:border-zinc-700">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={12} />
            </div>
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} placeholder="Search..." className="w-full pl-8 pr-2 py-1.5 text-xs border-none bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100" />
          </div>
        </div>
        <ListBox
          aria-label="Select Target Field"
          selectionMode="single"
          selectedKeys={value ? new Set([value]) : new Set()}
          onSelectionChange={(keys) => {
            if (keys === "all") return;
            const selected = Array.from(keys)[0];
            if (selected) {
              onChange(selected.toString());
              setIsOpen(false);
            }
          }}
          className="max-h-[200px] overflow-y-auto p-1 gap-0.5 scrollbar-hide w-full focus:outline-none"
          items={items}
        >
          {(item) => (
            <ListBox.Item key={item.key} textValue={item.label} className="data-[hover=true]:bg-blue-50 dark:data-[hover=true]:bg-blue-900/20 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400 rounded-md px-2 py-1.5 text-xs transition-colors w-full cursor-pointer outline-none">
              {item.label}
            </ListBox.Item>
          )}
        </ListBox>
        {items.length === 0 && <div className="opacity-50 text-center text-sm py-4">No results found</div>}
      </Popover.Content>
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
    <div className="animate-in slide-in-from-right-4 duration-300 pb-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" onPress={onBack} className="pl-0 gap-2 hover:bg-transparent text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft size={20} /> Back to Integrations
          </Button>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">{integrationName}</h2>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 rounded-full px-3 py-1">
              <span className={`w-2 h-2 rounded-full ${integration.enabled ? "bg-green-500" : "bg-gray-400"}`}></span>
              <span className="text-xs font-semibold uppercase text-gray-500">{integration.enabled ? "Active" : "Disabled"}</span>
              <Switch size="sm" isSelected={integration.enabled ?? true} onChange={handleToggleEnabled} className="ml-2 scale-75">
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
            </div>
          </div>
          <p className="text-gray-500 mt-1">Configure how {integrationName} sends data to your CRM.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onPress={onBack}>
            Cancel
          </Button>
          <Button variant="primary" onPress={handleSave} className={`text-white shadow-lg shadow-blue-500/20 px-6 ${hasChanges ? "bg-blue-600" : "bg-blue-500/80"}`} isPending={isLoading} isDisabled={!hasChanges}>
            <Save size={18} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-6 bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-visible group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />

            {/* Target Field */}
            <div className="flex-1 min-w-[240px]">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 block ml-1">Target Field</label>
              <div className="flex items-center">
                <TargetFieldSelect value={row.targetField} onChange={(val) => updateRow(row.id, { targetField: val })} options={SAKNEEN_FIELDS} />
              </div>
            </div>

            <div className="text-gray-300 mt-4 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </div>

            {/* Sources */}
            <div className="flex-[2] min-w-[300px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 block">Sources</label>
              <SourceFieldManager currentFields={row.sourceFields} onAdd={(val) => addSourceField(row.id, val)} onRemove={(val) => removeSourceField(row.id, val)} />
            </div>

            <div className="w-px h-10 bg-gray-100 dark:bg-zinc-800 mx-2 shrink-0" />

            {/* Fallback */}
            <div className="flex-1 max-w-[200px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 block">Fallback</label>
              <Input placeholder="null" value={row.defaultValue || ""} onChange={(e) => updateRow(row.id, { defaultValue: e.target.value })} className="font-mono text-sm h-8 [&>div]:rounded-sm" />
            </div>

            <Button isIconOnly size="sm" variant="ghost" className="mt-4 text-gray-300 hover:text-red-500" onPress={() => removeRow(row.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}

        <Button variant="ghost" className="w-full h-12 border-2 border-dashed border-gray-200 text-gray-400 font-medium hover:border-blue-500 hover:text-blue-500" onPress={addRow}>
          + Add New Mapping
        </Button>
      </div>
    </div>
  );
};

export default MappingSetup;
