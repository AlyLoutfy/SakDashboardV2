import { 
  Button, 
  Card,
  Input,
  ComboBox,
  ListBox,
  Switch,
  Label
} from "@heroui/react";
import { Plus, Trash2, ArrowLeft, Save, Activity, RotateCw } from "lucide-react";
import { useState, useEffect } from "react";
import type { FieldMapping, IntegrationData } from "../store/integrationStore";

interface MappingSetupProps {
  integration: IntegrationData;
  integrationName?: string;
  onBack: () => void;
  onUpdate: (data: Partial<IntegrationData>) => void;
  isLoading?: boolean;
}

const SAKNEEN_FIELDS = [
  "Full Name",
  "Email Address",
  "Phone Number",
  "Budget Min",
  "Budget Max",
  "Interest Type",
  "Unit Type",
  "Sales Agent"
];

const SOURCE_FIELDS_MOCK = [
    "Full Name", "Email", "Phone", "Notes", "Company", "Job Title", "City", "Ad Name", "Form ID"
];

const MappingSetup = ({ 
  integration,
  integrationName = "Integration",
  onBack, 
  onUpdate, 
  isLoading
}: MappingSetupProps) => {
  const [rows, setRows] = useState<FieldMapping[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (integration.mappings && integration.mappings.length > 0) {
        setRows(integration.mappings);
    } else {
        setRows([{ id: crypto.randomUUID(), sourceField: "", targetField: "" }]);
    }
  }, [integration.mappings]);

  const addRow = () => {
    setRows([...rows, { id: crypto.randomUUID(), sourceField: "", targetField: "" }]);
    setHasChanges(true);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
    setHasChanges(true);
  };

  const updateRow = (id: string, field: 'sourceField' | 'targetField', value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
    setHasChanges(true);
  };

  const handleSave = () => {
    const validRows = rows.filter(r => r.sourceField && r.targetField);
    onUpdate({ mappings: validRows });
    setHasChanges(false);
  };
  
  const handleToggleEnabled = (val: boolean) => {
      onUpdate({ enabled: val });
  };

  const handleSyncNow = () => {
      setIsSyncing(true);
      setTimeout(() => {
          setIsSyncing(false);
          onUpdate({ lastSync: new Date().toLocaleString() }); // Fake sync update
      }, 2000);
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 pb-10">
      <div className="mb-8 flex items-center justify-between">
         <div>
            <Button 
                variant="ghost" 
                onPress={onBack}
                className="pl-0 gap-2 hover:bg-transparent text-gray-500 hover:text-gray-900 mb-2"
            >
                <ArrowLeft size={20} /> Back to Integrations
            </Button>
            <h2 className="text-3xl font-bold flex items-center gap-3">
                {integrationName}
                {!integration.enabled && <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">Disabled</span>}
            </h2>
            <p className="text-gray-500 mt-1">
                Configure how {integrationName} sends data to your CRM.
            </p>
         </div>
         <div className="flex gap-3">
             <Button variant="secondary" onPress={onBack}>Cancel</Button>
             <Button 
                variant="primary" 
                onPress={handleSave} 
                className={`text-white shadow-lg shadow-blue-500/20 px-6 ${hasChanges ? 'bg-blue-600' : 'bg-blue-500/80'}`}
                isPending={isLoading}
                isDisabled={!hasChanges}
            >
                <Save size={18} className="mr-2" /> Save Changes
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content: Mapping Configuration (Design 29) */}
          <div className="lg:col-span-2 space-y-6">
                 {rows.map((row, i) => (
                     <div key={row.id} className="flex gap-4 relative group">
                         {/* Centered Step Indicator with smart connector lines */}
                         <div className="flex flex-col items-center w-8 shrink-0 relative self-stretch">
                             {/* Continuous Line */}
                             {rows.length > 1 && (
                                <div 
                                    className={`absolute w-0.5 bg-gray-200 dark:bg-zinc-800 left-1/2 -translate-x-1/2
                                        ${i === 0 ? 'top-1/2 bottom-0' : 
                                          i === rows.length - 1 ? '-top-6 bottom-1/2' : 
                                          '-top-6 bottom-0'}
                                    `} 
                                />
                             )}
                             
                             {/* Number Bubble - absolute centered */}
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30 z-10">
                                 {i + 1}
                             </div>
                         </div>
                         
                         <Card className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 dark:border-zinc-800 shadow-sm relative">
                             <div>
                                 <span className="text-xs text-gray-500 font-medium mb-1.5 block">Map from {integrationName}</span>
                                 <ComboBox 
                                    inputValue={row.sourceField}
                                    onInputChange={(value) => updateRow(row.id, 'sourceField', value)}
                                    // @ts-ignore
                                    onSelectionChange={(key) => key && updateRow(row.id, 'sourceField', key.toString())}
                                    allowsCustomValue
                                    className="w-full"
                                >
                                     <ComboBox.InputGroup>
                                        <Input placeholder="Source Field" className="text-sm" />
                                        <ComboBox.Trigger />
                                    </ComboBox.InputGroup>
                                    <ComboBox.Popover>
                                        <ListBox>
                                            {SOURCE_FIELDS_MOCK.map((f) => (
                                                <ListBox.Item key={f} textValue={f}>{f}</ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </ComboBox.Popover>
                                </ComboBox>
                             </div>
                             <div>
                                 <span className="text-xs text-gray-500 font-medium mb-1.5 block">Map to Sakneen</span>
                                 <ComboBox 
                                    inputValue={row.targetField}
                                    // @ts-ignore
                                    onInputChange={(value) => updateRow(row.id, 'targetField', value)}
                                    // @ts-ignore
                                    onSelectionChange={(key) => key && updateRow(row.id, 'targetField', key.toString())}
                                    defaultSelectedKey={SAKNEEN_FIELDS.includes(row.targetField) ? row.targetField : undefined}
                                    allowsCustomValue
                                    className="w-full"
                                >
                                     <ComboBox.InputGroup>
                                        <Input placeholder="Target Field" className="bg-blue-50 dark:bg-zinc-800 border-blue-200 dark:border-zinc-700 text-sm" />
                                        <ComboBox.Trigger />
                                    </ComboBox.InputGroup>
                                    <ComboBox.Popover>
                                        <ListBox>
                                            {SAKNEEN_FIELDS.map((f) => (
                                                <ListBox.Item key={f} textValue={f}>{f}</ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </ComboBox.Popover>
                                </ComboBox>
                             </div>

                             <Button
                                isIconOnly
                                variant="ghost"
                                onPress={() => removeRow(row.id)}
                                className="absolute right-2 top-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 min-w-0"
                                size="sm"
                             >
                                <Trash2 size={14} />
                            </Button>
                         </Card>
                     </div>
                 ))}

                 <div className="flex gap-4 relative">
                     <div className="w-8 shrink-0" />
                     <Button 
                        variant="ghost" 
                        className="flex-1 border border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-all font-medium h-10"
                        onPress={addRow}
                     >
                        <Plus size={16} className="mr-2" /> Add Mapping Step
                    </Button>
                 </div>
          </div>

          {/* Sidebar: Controls & Info */}
          <div className="lg:col-span-1 space-y-6 sticky top-6">
              {/* Status Card */}
              <Card className="border border-gray-200 dark:border-zinc-800 shadow-sm">
                  <div className="p-4 pb-0 flex items-center gap-2">
                     <Activity size={18} className="text-gray-500" />
                     <h3 className="font-semibold text-sm">Status & Control</h3>
                  </div>
                  
                  <div className="mx-5 mt-4 mb-0 h-px bg-gray-100 dark:bg-zinc-800" />

                  <div className="p-5 pt-4 space-y-6">
                      <div className="flex items-center justify-between">
                          <div className="space-y-1">
                              <Label className="font-medium text-sm block">Integration Active</Label>
                              <span className="text-xs text-gray-500 block">Pause or resume data sync.</span>
                          </div>
                          <Switch isSelected={integration.enabled ?? true} onChange={(val) => handleToggleEnabled(val)}>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                          </Switch>
                      </div>

                      <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Sync Frequency</span>
                              <span className="font-medium">Real-time</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Last Successful Sync</span>
                              <span className="font-medium">{integration.lastSync || "Never"}</span>
                          </div>
                           <Button 
                                variant="secondary" 
                                className="w-full justify-between group" 
                                size="sm" 
                                onPress={handleSyncNow}
                                isDisabled={isSyncing}
                            >
                              <span className="flex items-center gap-2">
                                  <RotateCw size={14} className={isSyncing ? "animate-spin" : "group-hover:rotate-180 transition-transform"}/> 
                                  {isSyncing ? "Syncing..." : "Sync Now"}
                              </span>
                          </Button>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};

export default MappingSetup;
