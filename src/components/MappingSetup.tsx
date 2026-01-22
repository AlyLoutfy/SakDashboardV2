import { Button, Input, ComboBox, ListBox, Switch, Chip } from "@heroui/react";
import { Plus, Trash2, ArrowLeft, Save, X } from "lucide-react";
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
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 block ml-3">Target Field</label>
              <div className="h-8 flex items-center">
                <ComboBox
                  inputValue={row.targetField}
                  // @ts-ignore
                  onInputChange={(value) => updateRow(row.id, { targetField: value })}
                  // @ts-ignore
                  onSelectionChange={(key) => key && updateRow(row.id, { targetField: key.toString() })}
                  defaultSelectedKey={SAKNEEN_FIELDS.includes(row.targetField) ? row.targetField : undefined}
                  allowsCustomValue
                  className="w-full font-bold text-lg [&>div]:bg-transparent [&>div]:shadow-none [&>div]:border-none [&>div]:p-0"
                  aria-label="Target Field"
                >
                  <ComboBox.InputGroup>
                    <Input placeholder="Select Field" className="bg-transparent border-none text-lg font-bold shadow-none [&>div]:!bg-transparent [&>div]:!shadow-none [&>div]:!px-2" />
                    <ComboBox.Trigger className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </ComboBox.InputGroup>
                  <ComboBox.Popover>
                    <ListBox>
                      {SAKNEEN_FIELDS.map((f) => (
                        <ListBox.Item key={f} textValue={f}>
                          {f}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </ComboBox.Popover>
                </ComboBox>
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
