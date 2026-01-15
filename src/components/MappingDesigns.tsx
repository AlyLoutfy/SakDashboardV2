import { Card, Button, Input, Dropdown, Chip, ComboBox, ListBox } from "@heroui/react";
import { ArrowRight, ArrowRightLeft, Plus, Trash2, Link as LinkIcon, ArrowDown, Code, GripVertical, Search, Check, Shuffle, RefreshCcw, Settings2 } from "lucide-react";

// Mock Data for Mapping
const MOCK_MAPPING = [
  { id: '1', source: 'First Name', target: 'first_name_v2' },
  { id: '2', source: 'Email Address', target: 'email_primary' },
  { id: '3', source: 'Phone Number', target: 'mobile_phone' },
];

const TARGET_FIELDS = [
    {key: "first_name_v2", label: "First Name"},
    {key: "last_name", label: "Last Name"},
    {key: "email_primary", label: "Email"},
    {key: "mobile_phone", label: "Phone"},
    {key: "company", label: "Company"},
    {key: "city", label: "City"},
];

const SOURCE_FIELDS = [
    {key: "First Name", label: "First Name"},
    {key: "Email Address", label: "Email Address"},
    {key: "Phone Number", label: "Phone Number"},
    {key: "Company Name", label: "Company Name"},
    {key: "Job Title", label: "Job Title"},
];

// Helper for ComboBox Item


// Design 1: Classic Card (Current)
const Design1 = () => (
  <Card className="p-6 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
    <div className="flex items-center gap-2 mb-6">
        <ArrowRightLeft className="text-blue-500" />
        <h3 className="text-lg font-semibold">Standard Mapping</h3>
    </div>
    <div className="space-y-4">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex items-center gap-4">
                <Input value={row.source} className="flex-1" placeholder="Source" />
                <ArrowRight className="text-gray-400" size={20} />
                <div className="flex-1">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <Button variant="secondary" className="w-full justify-between">
                            {TARGET_FIELDS.find(f => f.key === row.target)?.label || "Select Field"} <ArrowDown size={14}/>
                        </Button>
                      </Dropdown.Trigger>
                      <Dropdown.Menu aria-label="Target Field" selectionMode="single" selectedKeys={[row.target]}>
                        {TARGET_FIELDS.map((f) => <Dropdown.Item key={f.key} id={f.key}>{f.label}</Dropdown.Item>)}
                      </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Button isIconOnly variant="ghost" className="text-danger"><Trash2 size={18} /></Button>
            </div>
        ))}
    </div>
    <div className="mt-6 flex justify-between">
        <Button variant="secondary"><Plus size={18}/> Add Field</Button>
        <Button variant="primary">Save Changes</Button>
    </div>
  </Card>
);

// Design 2: Table Row Style
const Design2 = () => (
  <Card className="border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
     <div className="bg-gray-50 dark:bg-zinc-800/50 px-6 py-3 border-b border-gray-200 dark:border-zinc-800 flex gap-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">
        <div className="flex-1">Source Field</div>
        <div className="w-8"></div>
        <div className="flex-1">Destination Field</div>
        <div className="w-10"></div>
     </div>
     <div className="divide-y divide-gray-100 dark:divide-zinc-800">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                <div className="flex-1 font-medium bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md text-sm">
                    {row.source}
                </div>
                <ArrowRight className="text-gray-300" size={16} />
                <div className="flex-1">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <Button variant="secondary" size="sm" className="w-full justify-between h-8">
                            {TARGET_FIELDS.find(f => f.key === row.target)?.label || "Select"} <ArrowDown size={12}/>
                        </Button>
                      </Dropdown.Trigger>
                      <Dropdown.Menu aria-label="Target Field" selectionMode="single" selectedKeys={[row.target]}>
                        {TARGET_FIELDS.map((f) => <Dropdown.Item key={f.key} id={f.key}>{f.label}</Dropdown.Item>)}
                      </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Button isIconOnly size="sm" variant="ghost" className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></Button>
            </div>
        ))}
     </div>
      <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
          <Button size="sm" variant="primary"><Plus size={16}/> Add Row</Button>
      </div>
  </Card>
);

// Design 3: Visual Flow / Pipeline
const Design3 = () => (
  <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-none">
     <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">L</div>
            <span className="font-bold">LinkedIn</span>
        </div>
        <div className="border-t-2 border-dashed border-blue-200 flex-1 mx-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                Data Flow
            </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">S</div>
           <span className="font-bold">Sakneen</span>
        </div>
     </div>
     <div className="space-y-3">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex relative items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/30">
               <span className="font-medium text-sm ml-2">{row.source}</span>
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-300">
                  <ArrowRight size={16} />
               </div>
                <Chip size="sm" variant="primary">{TARGET_FIELDS.find(f => f.key === row.target)?.label}</Chip>
            </div>
        ))}
     </div>
  </Card>
);

// Design 4: Split Pane Drag & Drop Sim
const Design4 = () => (
  <Card className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-zinc-800 border overflow-hidden">
     <div className="p-4 bg-gray-50/50 dark:bg-zinc-900/50">
        <h4 className="text-xs font-bold uppercase text-gray-400 mb-4">Incoming Fields</h4>
        <div className="space-y-2">
            {[...MOCK_MAPPING, {id: '4', source: 'Job Title', target: ''}].map(row => (
                <div key={row.id} className="p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm text-sm cursor-grab active:cursor-grabbing flex items-center gap-2">
                    <GripVertical size={14} className="text-gray-300" />
                    {row.source || row.target}
                </div>
            ))}
        </div>
     </div>
     <div className="p-4">
        <h4 className="text-xs font-bold uppercase text-gray-400 mb-4">Mapped Fields</h4>
        <div className="space-y-2">
             {MOCK_MAPPING.map(row => (
                 <div key={row.id} className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                     <span className="text-sm font-medium">{row.source}</span>
                     <ArrowRight size={12} className="text-green-400" />
                     <span className="text-sm font-bold text-green-700 dark:text-green-400">{TARGET_FIELDS.find(f => f.key === row.target)?.label}</span>
                 </div>
             ))}
             <div className="p-3 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg text-center text-xs text-gray-400">
                Drop field here to map
             </div>
        </div>
     </div>
  </Card>
);

// Design 5: Minimal List
const Design5 = () => (
   <Card className="max-w-md mx-auto border-none shadow-none">
       {MOCK_MAPPING.map((row) => (
           <div key={row.id} className="group flex items-center gap-3 py-2 border-b border-gray-100 dark:border-zinc-800">
               <div className="w-1/3 text-right text-sm text-gray-500">{row.source}</div>
               <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                   <LinkIcon size={14} />
               </div>
               <div className="w-1/3 flex-1 font-semibold text-sm">
                   {TARGET_FIELDS.find(f => f.key === row.target)?.label}
               </div>
               <Button size="sm" isIconOnly variant="ghost" className="opacity-0 group-hover:opacity-100"><Trash2 size={14}/></Button>
           </div>
       ))}
       <Button variant="ghost" className="mt-2 text-blue-500" size="sm">+ Map another field</Button>
   </Card>
);

// Design 6: Card per Field (Detached)
const Design6 = () => (
    <div className="space-y-3">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex items-center p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    IN
                </div>
                <div className="mx-3 flex-1">
                    <div className="text-xs text-gray-400 uppercase">Source</div>
                    <div className="font-medium text-sm">{row.source}</div>
                </div>
                <ArrowRight className="text-gray-300" />
                <div className="mx-3 flex-1 text-right">
                    <div className="text-xs text-gray-400 uppercase">Target</div>
                     <span className="font-medium text-sm text-blue-600">{TARGET_FIELDS.find(f => f.key === row.target)?.label}</span>
                </div>
            </div>
        ))}
    </div>
);

// Design 7: Developer / JSON View
const Design7 = () => (
    <Card className="bg-[#1e1e1e] border-none text-gray-300 font-mono text-sm p-4 rounded-lg shadow-xl">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
            <Code size={16} className="text-green-400" />
            <span className="text-xs text-gray-400">mapping_config.json</span>
        </div>
        <div className="pl-2 border-l-2 border-gray-700 space-y-1">
            <div className="text-yellow-400">"fields": [</div>
            {MOCK_MAPPING.map((row) => (
                <div key={row.id} className="pl-4">
                    <span className="text-purple-400">{`{`}</span>
                    <span className="text-blue-300"> "src": </span>
                    <span className="text-orange-300">"{row.source}"</span>,
                    <span className="text-blue-300"> "dest": </span>
                    <span className="text-green-300">"{row.target}"</span>
                    <span className="text-purple-400">{` }`},</span>
                </div>
            ))}
            <div className="text-yellow-400">]</div>
        </div>
    </Card>
);

// Design 8: Floating Glass
const Design8 = () => (
    <div className="relative p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-pink-500/10 to-purple-500/10">
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="relative z-10 space-y-4">
            {MOCK_MAPPING.map((row) => (
                <div key={row.id} className="flex justify-between items-center bg-white/40 dark:bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-sm">
                    <span className="font-medium px-2">{row.source}</span>
                    <div className="w-8 h-[1px] bg-gray-400/50"></div>
                    <select className="bg-transparent border-none font-bold text-right outline-none text-purple-700 dark:text-purple-300 cursor-pointer">
                        <option>{TARGET_FIELDS.find(f => f.key === row.target)?.label}</option>
                    </select>
                </div>
            ))}
             <Button className="w-full bg-white/50 hover:bg-white/70 text-purple-900 border-none backdrop-blur shadow-sm">Save Mapping</Button>
        </div>
    </div>
);

// Design 9: Stepper Focus
const Design9 = () => (
    <Card className="border border-gray-200 dark:border-zinc-800">
        <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-bold">Step 2 of 5: Mapping</h3>
            <div className="h-1 mt-2 bg-blue-500 rounded-full w-[40%]" />
        </div>
        <div className="p-8 flex flex-col items-center">
            <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-1">Mapping Field 2 of {MOCK_MAPPING.length}</p>
                <h2 className="text-2xl font-bold">{MOCK_MAPPING[1].source}</h2>
            </div>
            
            <ArrowDown className="text-gray-300 mb-6" size={32} />
            
            <div className="w-full max-w-xs">
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button variant="secondary" className="w-full justify-between">
                        {TARGET_FIELDS.find(f => f.key === MOCK_MAPPING[1].target)?.label} <ArrowDown size={14}/>
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu aria-label="Target Field" selectionMode="single" selectedKeys={[MOCK_MAPPING[1].target]}>
                    {TARGET_FIELDS.map((f) => <Dropdown.Item key={f.key} id={f.key}>{f.label}</Dropdown.Item>)}
                  </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className="flex gap-3 mt-12 w-full justify-center">
                <Button variant="secondary">Previous</Button>
                <Button variant="primary">Next Field</Button>
            </div>
        </div>
    </Card>
);

// Design 10: Connected Dots (Timeline)
const Design10 = () => (
    <div className="pl-4">
        {MOCK_MAPPING.map((row, i) => (
            <div key={row.id} className="flex gap-4 relative pb-8 last:pb-0">
                {i !== MOCK_MAPPING.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-gray-200 dark:bg-zinc-800" />
                )}
                <div className="mt-1 relative z-10">
                    <div className="w-8 h-8 rounded-full border-4 border-white dark:border-zinc-950 bg-blue-500 shadow-md flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">{i+1}</span>
                    </div>
                </div>
                <div className="flex-1 pt-1">
                    <Card className="p-3 mb-2 flex items-center justify-between border !border-l-4 !border-l-blue-500">
                        <span className="font-medium text-sm">{row.source}</span>
                        <ArrowRight size={14} className="text-gray-300" />
                        <span className="text-sm bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
                             {TARGET_FIELDS.find(f => f.key === row.target)?.label}
                        </span>
                    </Card>
                </div>
            </div>
        ))}
    </div>
);

// Design 11: Dual Internal ComboBox Card
const Design11 = () => (
    <Card className="p-6 border border-gray-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Field Mapping Config</h3>
            <Button size="sm" variant="ghost">Reset</Button>
        </div>
        <div className="space-y-4">
            {MOCK_MAPPING.map((row) => (
                <div key={row.id} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                        <ComboBox.InputGroup>
                            <Input placeholder="Source field" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover>
                            <ListBox>
                                {SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}
                            </ListBox>
                        </ComboBox.Popover>
                    </ComboBox>

                    <div className="text-gray-300"><ArrowRight size={20}/></div>

                    <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                        <ComboBox.InputGroup>
                            <Input placeholder="Target field" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover>
                            <ListBox>
                                {TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}
                            </ListBox>
                        </ComboBox.Popover>
                    </ComboBox>
                </div>
            ))}
        </div>
    </Card>
);

// Design 12: Floating Label Inputs (Minimal)
const Design12 = () => (
    <div className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex gap-6 items-end group">
                <div className="flex-1 relative">
                    <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="border-b-2 border-gray-200 group-hover:border-blue-500 transition-colors">
                            <Input className="bg-transparent px-0 border-none shadow-none text-base" placeholder=" " />
                            <ComboBox.Trigger />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider absolute -bottom-5 left-0">From</span>
                </div>
                <div className="pb-2 text-gray-300">
                    <Shuffle size={16} />
                </div>
                 <div className="flex-1 relative">
                    <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="border-b-2 border-gray-200 group-hover:border-blue-500 transition-colors">
                            <Input className="bg-transparent px-0 border-none shadow-none text-base" placeholder=" " />
                            <ComboBox.Trigger />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider absolute -bottom-5 left-0">To</span>
                </div>
            </div>
        ))}
    </div>
);

// Design 13: Connector Line Visual
const Design13 = () => (
    <Card className="p-4 grid grid-cols-3 gap-0 bg-gray-50 dark:bg-black/20">
        <div className="space-y-6">
             <div className="text-center text-xs font-bold text-gray-400 uppercase mb-4">Source</div>
             {MOCK_MAPPING.map(row => (
                 <div key={row.id} className="h-10">
                     <ComboBox defaultInputValue={row.source} allowsCustomValue>
                        <ComboBox.InputGroup>
                            <Input className="bg-white dark:bg-zinc-900 h-8" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                 </div>
             ))}
        </div>
        <div className="relative flex flex-col items-center justify-center space-y-6">
            <div className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-blue-200 to-transparent dark:via-blue-900/50 left-1/2 -translate-x-1/2" />
            {MOCK_MAPPING.map(row => (
                 <div key={row.id} className="h-10 flex items-center justify-center z-10 bg-gray-50 dark:bg-black">
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center ring-4 ring-gray-50 dark:ring-black">
                         <LinkIcon size={12} className="text-blue-600 dark:text-blue-400"/>
                     </div>
                 </div>
             ))}
        </div>
        <div className="space-y-6">
             <div className="text-center text-xs font-bold text-gray-400 uppercase mb-4">Target</div>
             {MOCK_MAPPING.map(row => (
                 <div key={row.id} className="h-10">
                     <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                         <ComboBox.InputGroup>
                            <Input className="bg-white dark:bg-zinc-900 border-blue-200 h-8" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                 </div>
             ))}
        </div>
    </Card>
);

// Design 14: Stacked Pill (Mobile Friendly)
const Design14 = () => (
    <div className="space-y-3">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="bg-white dark:bg-zinc-900 p-1.5 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center shadow-sm">
                <div className="w-[45%] pl-2">
                     <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                        <ComboBox.InputGroup className="bg-transparent border-none shadow-none">
                            <Input className="bg-transparent border-none px-0 text-sm font-medium h-6 shadow-none" />
                        </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                </div>
                <div className="w-[10%] flex justify-center text-gray-300">
                    <ArrowRight size={14} />
                </div>
                <div className="w-[45%] pr-1">
                     <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                        <ComboBox.InputGroup className="bg-gray-100 dark:bg-zinc-800 rounded-full border-none h-8 pl-3">
                            <Input className="bg-transparent border-none px-0 text-sm h-full shadow-none" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                </div>
            </div>
        ))}
         <Button variant="ghost" className="w-full rounded-full border-dashed border-2 border-gray-300 text-gray-500 h-10">Add Mapping Pair</Button>
    </div>
);

// Design 15: Split Table Row
const Design15 = () => (
    <Card className="overflow-hidden border border-gray-200 dark:border-zinc-800">
        <div className="grid grid-cols-[1fr_40px_1fr_40px] bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-xs font-semibold py-2 px-4 uppercase text-gray-500">
            <div>External Field</div>
            <div></div>
            <div>Internal Field</div>
            <div></div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {MOCK_MAPPING.map(row => (
                 <div key={row.id} className="grid grid-cols-[1fr_40px_1fr_40px] items-center p-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                     <ComboBox defaultInputValue={row.source} allowsCustomValue>
                         <ComboBox.InputGroup>
                            <Input className="border-b border-t-0 border-x-0 rounded-none bg-transparent px-0 shadow-none" />
                         </ComboBox.InputGroup>
                          <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                     <div className="flex justify-center text-gray-300 group-hover:text-blue-400">
                         <ArrowRightLeft size={16} />
                     </div>
                     <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                         <ComboBox.InputGroup>
                            <Input className="border-b border-t-0 border-x-0 rounded-none bg-transparent px-0 shadow-none text-blue-700 dark:text-blue-300 font-medium" />
                            <ComboBox.Trigger />
                         </ComboBox.InputGroup>
                          <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                     <div className="flex justify-center">
                         <Button isIconOnly size="sm" variant="ghost" className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></Button>
                     </div>
                 </div>
            ))}
        </div>
    </Card>
);

// Design 16: Interactive Sentence
const Design16 = () => (
    <div className="space-y-4">
        {MOCK_MAPPING.map(row => (
            <Card key={row.id} className="p-4 flex items-baseline gap-2 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                <span className="text-slate-500">When I receive</span>
                <div className="w-40">
                     <ComboBox defaultInputValue={row.source} allowsCustomValue>
                         <ComboBox.InputGroup className="h-8">
                            <Input className="font-bold text-slate-900 dark:text-white border-b border-t-0 border-x-0 rounded-none bg-transparent px-0 shadow-none" />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                </div>
                <span className="text-slate-500">save it to</span>
                <div className="w-40">
                     <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                         <ComboBox.InputGroup className="h-8">
                            <Input className="font-bold text-blue-600 dark:text-blue-400 border-b border-t-0 border-x-0 rounded-none bg-transparent px-0 shadow-none" />
                            <ComboBox.Trigger />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                </div>
                <span className="text-slate-500">.</span>
            </Card>
        ))}
    </div>
);

// Design 17: Matcher Tags
const Design17 = () => (
     <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-wrap gap-4 justify-center">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-lg p-1 pr-3 border border-gray-200 dark:border-zinc-700 hover:border-purple-300 transition-colors">
                <div className="bg-white dark:bg-zinc-900 rounded shadow-sm">
                     <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-32">
                         <ComboBox.InputGroup className="h-8 border-none">
                            <Input className="bg-transparent text-xs h-8 border-none shadow-none px-2" />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                </div>
                <div className="px-2 text-gray-400">
                    <ArrowRight size={12} />
                </div>
                <div className="font-medium">
                     <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-32">
                         <ComboBox.InputGroup className="h-8 border-none">
                            <Input className="bg-transparent text-xs text-purple-600 dark:text-purple-400 font-bold h-8 border-none shadow-none px-2" />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                </div>
                <button className="ml-2 text-gray-300 hover:text-red-500"><Trash2 size={12}/></button>
            </div>
        ))}
        <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500">
            <Plus size={16} />
        </button>
     </div>
);

// Design 18: Process Flow (With Icon)
const Design18 = () => (
    <Card className="divide-y divide-gray-100 dark:divide-zinc-800">
        {MOCK_MAPPING.map((row) => (
             <div key={row.id} className="p-4 flex items-center gap-4">
                 <div className="flex-1">
                     <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Input</label>
                     <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="flex items-center pl-2">
                             <div className="h-2 w-2 rounded-full bg-orange-400 mr-2 flex-shrink-0"/>
                            <Input className="border-none shadow-none pl-0" />
                            <ComboBox.Trigger />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                 </div>
                 
                 <div className="flex flex-col items-center pt-4">
                     <div className="text-[10px] bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-gray-500 mb-2">TRANSFORM</div>
                     <RefreshCcw size={16} className="text-gray-400" />
                 </div>

                 <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Output</label>
                      <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="flex items-center pl-2">
                             <div className="h-2 w-2 rounded-full bg-green-400 mr-2 flex-shrink-0"/>
                             <Input className="border-none shadow-none pl-0" />
                            <ComboBox.Trigger />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                     </ComboBox>
                 </div>
             </div>
        ))}
    </Card>
);

// Design 19: Grid Matrix
const Design19 = () => (
    <div className="bg-slate-900 text-slate-200 p-6 rounded-xl space-y-4">
         <div className="flex justify-between items-center text-sm text-slate-500 px-2">
             <span>Source Data Column</span>
             <span>System Field</span>
         </div>
         {MOCK_MAPPING.map((row) => (
             <div key={row.id} className="grid grid-cols-[1fr_20px_1fr] gap-4 items-center bg-slate-800/50 p-3 rounded-lg border border-white/5">
                 <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="bg-slate-800 border-slate-700 text-white">
                            <Input className="text-white bg-transparent border-none shadow-none" placeholder="Select source..." />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox className="dark">{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label} className="text-white hover:bg-slate-700">{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                 </ComboBox>
                 
                 <div className="h-[1px] bg-slate-600 w-full" />
                 
                 <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="bg-slate-800 border-slate-700 text-white">
                            <Input className="text-white bg-transparent border-none shadow-none" placeholder="Select target..." />
                            <ComboBox.Trigger />
                         </ComboBox.InputGroup>
                         <ComboBox.Popover><ListBox className="dark">{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label} className="text-white hover:bg-slate-700">{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                 </ComboBox>
             </div>
         ))}
         <Button variant="ghost" className="w-full border-2 border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500">
             + Add Row
         </Button>
    </div>
);

// Design 20: Search Focused (Big Inputs)
const Design20 = () => (
    <div className="space-y-8">
        {MOCK_MAPPING.map((row) => (
             <div key={row.id} className="relative">
                 <div className="flex gap-4">
                     <div className="flex-1">
                         <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full text-lg">
                            <ComboBox.InputGroup className="flex items-center pl-2">
                                <Search size={20} className="text-gray-400 mr-2 flex-shrink-0"/>
                                <Input className="text-lg bg-transparent border-none shadow-none pl-0" placeholder="Find source field..." />
                            </ComboBox.InputGroup>
                             <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                         </ComboBox>
                     </div>
                     <div className="flex-1">
                          <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full text-lg">
                            <ComboBox.InputGroup className="flex items-center pl-2">
                                 <Check size={20} className="text-green-500 mr-2 flex-shrink-0"/>
                                 <Input className="text-lg font-medium text-gray-900 dark:text-gray-100 bg-transparent border-none shadow-none pl-0" placeholder="Map to field..." />
                                 <ComboBox.Trigger />
                            </ComboBox.InputGroup>
                             <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                         </ComboBox>
                     </div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-950 p-1.5 rounded-full border border-gray-100 dark:border-zinc-800 shadow-sm z-10">
                     <ArrowRight size={20} className="text-gray-300" />
                 </div>
             </div>
        ))}
    </div>
);


// Design 21: Data Card Grid
const Design21 = () => (
    <div className="grid grid-cols-1 gap-4">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Source Data</span>
                    <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="bg-gray-50 dark:bg-zinc-800 border-none">
                            <Input className="bg-transparent shadow-none" placeholder="Source..." />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                </div>
                <div className="text-gray-300 rotate-90 md:rotate-0"><ArrowRight size={20} /></div>
                 <div className="flex-1 w-full">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2 block">Destination</span>
                    <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                            <Input className="bg-transparent shadow-none text-blue-700 dark:text-blue-300" placeholder="Target..." />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                </div>
            </div>
        ))}
    </div>
);

// Design 22: Terminal Code
const Design22 = () => (
    <div className="bg-[#1e1e1e] p-6 rounded-lg font-mono text-sm shadow-xl border border-gray-700">
         <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500"/>
            <div className="w-3 h-3 rounded-full bg-yellow-500"/>
            <div className="w-3 h-3 rounded-full bg-green-500"/>
        </div>
        <div className="space-y-4">
            {MOCK_MAPPING.map((row, i) => (
                <div key={row.id} className="flex gap-2 items-center text-gray-300">
                    <span className="text-purple-400 select-none">const</span>
                    <span className="text-blue-400 select-none">mapping_{i}</span>
                    <span className="text-gray-500 select-none">=</span>
                    <span className="text-gray-500 select-none">{`{`}</span>
                    
                    <div className="flex-1 flex gap-2 items-center">
                         <ComboBox defaultInputValue={row.source} allowsCustomValue className="min-w-[120px]">
                            <ComboBox.InputGroup className="bg-[#2d2d2d] h-7 border-none rounded">
                                <Input className="bg-transparent text-[#ce9178] h-full text-sm px-2 border-none shadow-none font-mono" />
                            </ComboBox.InputGroup>
                             <ComboBox.Popover><ListBox className="dark">{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                         </ComboBox>
                         <span className="text-gray-500">:</span>
                         <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="min-w-[120px]">
                            <ComboBox.InputGroup className="bg-[#2d2d2d] h-7 border-none rounded">
                                <Input className="bg-transparent text-[#4ec9b0] h-full text-sm px-2 border-none shadow-none font-mono" />
                            </ComboBox.InputGroup>
                             <ComboBox.Popover><ListBox className="dark">{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                         </ComboBox>
                    </div>

                    <span className="text-gray-500 select-none">{`};`}</span>
                </div>
            ))}
            <div className="text-green-400 opacity-50 text-xs mt-4 pt-4 border-t border-gray-800">
                // System ready. 3 mappings configured.
            </div>
        </div>
    </div>
);

// Design 23: Pastel Tags
const Design23 = () => (
    <div className="flex flex-wrap gap-3">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="group relative bg-[#fdf2f8] dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/30 rounded-2xl p-2 px-4 flex items-center gap-3">
                <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-32">
                     <ComboBox.InputGroup className="h-6 border-none bg-transparent shadow-none">
                        <Input className="text-sm font-medium text-pink-700 dark:text-pink-300 bg-transparent border-none shadow-none px-0" />
                    </ComboBox.InputGroup>
                    <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                </ComboBox>
                
                <ArrowRight size={14} className="text-pink-300" />
                
                 <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-32">
                     <ComboBox.InputGroup className="h-6 border-none bg-transparent shadow-none">
                        <Input className="text-sm font-bold text-pink-900 dark:text-pink-100 bg-transparent border-none shadow-none px-0 text-right" />
                    </ComboBox.InputGroup>
                    <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                </ComboBox>
                
                <button className="absolute -top-1 -right-1 bg-white shadow-sm rounded-full p-0.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                    <Trash2 size={12}/>
                </button>
            </div>
        ))}
         <button className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-2 px-4 text-sm text-gray-400 hover:bg-gray-100">+ Add</button>
    </div>
);

// Design 24: Connected Nodes
const Design24 = () => (
    <div className="relative space-y-8 pl-8">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-zinc-800" />
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 flex gap-4 items-center">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-200 dark:bg-zinc-800" />
                <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                
                 <div className="flex-1">
                    <ComboBox defaultInputValue={row.source} allowsCustomValue>
                         <ComboBox.InputGroup>
                            <Input className="font-mono text-xs" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                 </div>
                 <div className="text-gray-300"><ArrowRight size={16}/></div>
                 <div className="flex-1">
                    <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                         <ComboBox.InputGroup>
                            <Input className="font-mono text-xs text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30" />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                 </div>
            </div>
        ))}
    </div>
);

// Design 25: Focus Underline
const Design25 = () => (
    <div className="space-y-1 bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-xl">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex items-end gap-4 p-2 relative group">
                <div className="flex-1">
                    <label className="text-[10px] text-gray-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">SOURCE</label>
                    <ComboBox defaultInputValue={row.source} allowsCustomValue>
                         <ComboBox.InputGroup className="bg-transparent border-b border-gray-300 dark:border-zinc-700 rounded-none px-0 shadow-none focus-within:border-black dark:focus-within:border-white transition-colors">
                            <Input className="bg-transparent border-none shadow-none px-0 pb-1" />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                </div>
                 <ArrowRight size={16} className="text-gray-300 mb-2.5"/>
                 <div className="flex-1">
                    <label className="text-[10px] text-gray-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">TARGET</label>
                    <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                         <ComboBox.InputGroup className="bg-transparent border-b border-gray-300 dark:border-zinc-700 rounded-none px-0 shadow-none focus-within:border-blue-500 transition-colors">
                            <Input className="bg-transparent border-none shadow-none px-0 pb-1 text-blue-600 dark:text-blue-400" />
                             <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                 </div>
            </div>
        ))}
    </div>
);

// Design 26: Vertical Stacks
const Design26 = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
        {MOCK_MAPPING.map((row, i) => (
             <Card key={row.id} className="min-w-[200px] p-4 flex flex-col items-center gap-2 border-t-4 border-t-purple-500 shadow-sm">
                <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mb-2">{i+1}</div>
                <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                     <ComboBox.InputGroup className="text-center">
                        <Input className="text-center font-medium" />
                    </ComboBox.InputGroup>
                    <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                </ComboBox>
                <div className="text-gray-300 rotate-90 my-1"><ArrowRight size={16}/></div>
                <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                     <ComboBox.InputGroup className="text-center bg-purple-50 dark:bg-purple-900/10">
                        <Input className="text-center font-medium text-purple-700 dark:text-purple-300" />
                    </ComboBox.InputGroup>
                    <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                </ComboBox>
             </Card>
        ))}
        <button className="min-w-[60px] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
            <Plus size={24}/>
        </button>
    </div>
);

// Design 27: Neumorphic Soft
const Design27 = () => (
    <div className="bg-[#e0e5ec] dark:bg-zinc-800 p-6 rounded-2xl gap-6 flex flex-col">
        {MOCK_MAPPING.map((row) => (
            <div key={row.id} className="flex items-center gap-6">
                <div className="flex-1 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#18181b,-5px_-5px_10px_#3f3f46] rounded-xl">
                      <ComboBox defaultInputValue={row.source} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="bg-transparent border-none shadow-none h-12">
                            <Input className="bg-transparent border-none shadow-none px-4 text-gray-600 dark:text-gray-300" />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                </div>
                <div className="text-gray-400 dark:text-gray-500 shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff] dark:shadow-[inset_2px_2px_5px_#18181b,inset_-2px_-2px_5px_#3f3f46] p-2 rounded-full">
                    <ArrowRight size={14}/>
                </div>
                 <div className="flex-1 shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] dark:shadow-[inset_5px_5px_10px_#18181b,inset_-5px_-5px_10px_#3f3f46] rounded-xl bg-[#e0e5ec] dark:bg-zinc-800">
                      <ComboBox defaultSelectedKey={row.target} allowsCustomValue className="w-full">
                         <ComboBox.InputGroup className="bg-transparent border-none shadow-none h-12">
                             <Input className="bg-transparent border-none shadow-none px-4 text-blue-600 dark:text-blue-400 font-semibold" />
                             <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                    </ComboBox>
                </div>
            </div>
        ))}
    </div>
);

// Design 28: High Contrast
const Design28 = () => (
    <div className="border border-black dark:border-white p-1">
        <div className="bg-black dark:bg-white text-white dark:text-black p-2 font-black uppercase text-xs flex justify-between tracking-widest mb-4">
            <span>Input Source</span>
            <span>Mapped To</span>
        </div>
        <div className="space-y-4 px-2 pb-2">
            {MOCK_MAPPING.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                     <div className="flex-1 border-b-2 border-black dark:border-white">
                         <ComboBox defaultInputValue={row.source} allowsCustomValue>
                             <ComboBox.InputGroup className="bg-transparent rounded-none border-none shadow-none">
                                <Input className="bg-transparent border-none shadow-none font-bold" />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                        </ComboBox>
                     </div>
                     <ArrowRight size={24} className="stroke-2"/>
                     <div className="flex-1 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black">
                         <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                             <ComboBox.InputGroup className="bg-transparent rounded-none border-none shadow-none">
                                <Input className="bg-transparent border-none shadow-none font-bold text-white dark:text-black" />
                                <ComboBox.Trigger className="text-white dark:text-black" />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                        </ComboBox>
                     </div>
                </div>
            ))}
        </div>
    </div>
);

// Design 29: Numbered Steps
const Design29 = () => (
    <div className="space-y-6">
        {MOCK_MAPPING.map((row, i) => (
             <div key={row.id} className="flex gap-4 relative">
                 <div className="flex flex-col items-center">
                     <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30 z-10">
                         {i + 1}
                     </div>
                     {i !== MOCK_MAPPING.length - 1 && (
                         <div className="w-0.5 flex-1 bg-gray-200 dark:bg-zinc-800 -mb-6 mt-1" />
                     )}
                 </div>
                 <Card className="flex-1 p-4 mb-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         <span className="text-xs text-gray-500 font-medium mb-1.5 block">Map from</span>
                         <ComboBox defaultInputValue={row.source} allowsCustomValue>
                             <ComboBox.InputGroup>
                                <Input />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                        </ComboBox>
                     </div>
                     <div>
                         <span className="text-xs text-gray-500 font-medium mb-1.5 block">Map to</span>
                         <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                             <ComboBox.InputGroup>
                                <Input className="bg-blue-50 dark:bg-zinc-800 border-blue-200 dark:border-zinc-700" />
                                <ComboBox.Trigger />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                        </ComboBox>
                     </div>
                 </Card>
             </div>
        ))}
    </div>
);

// Design 30: Detailed Accordion
const Design30 = () => (
    <div className="space-y-2">
        {MOCK_MAPPING.map((row) => (
            <Card key={row.id} className="border border-gray-200 dark:border-zinc-800 shadow-none overflow-hidden hover:border-gray-300 transition-colors">
                <div className="p-3 flex items-center gap-4 bg-gray-50/50 dark:bg-black/20">
                     <GripVertical size={16} className="text-gray-300 cursor-move" />
                     <div className="flex-1 grid grid-cols-[1fr_24px_1fr] items-center gap-4">
                        <ComboBox defaultInputValue={row.source} allowsCustomValue>
                             <ComboBox.InputGroup className="h-9">
                                <Input className="text-sm" />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover><ListBox>{SOURCE_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                        </ComboBox>
                        <ArrowRight size={16} className="text-gray-400 mx-auto" />
                        <ComboBox defaultSelectedKey={row.target} allowsCustomValue>
                             <ComboBox.InputGroup className="h-9">
                                <Input className="text-sm font-medium" />
                                <ComboBox.Trigger />
                            </ComboBox.InputGroup>
                            <ComboBox.Popover><ListBox>{TARGET_FIELDS.map(f => <ListBox.Item key={f.key} textValue={f.label}>{f.label}</ListBox.Item>)}</ListBox></ComboBox.Popover>
                        </ComboBox>
                     </div>
                     <Button isIconOnly size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600"><Settings2 size={16}/></Button>
                </div>
            </Card>
        ))}
    </div>
);

export const MAPPING_DESIGNS = [
    { id: 1, name: "Classic Card", Component: Design1 },
    { id: 2, name: "Table Row Style", Component: Design2 },
    { id: 3, name: "Visual Flow", Component: Design3 },
    { id: 4, name: "Split Pane D&D", Component: Design4 },
    { id: 5, name: "Minimal List", Component: Design5 },
    { id: 6, name: "Card per Field", Component: Design6 },
    { id: 7, name: "Developer JSON", Component: Design7 },
    { id: 8, name: "Floating Glass", Component: Design8 },
    { id: 9, name: "Stepper Focus", Component: Design9 },
    { id: 10, name: "Timeline Dots", Component: Design10 },
    { id: 11, name: "Dual ComboBox", Component: Design11 },
    { id: 12, name: "Floating Inputs", Component: Design12 },
    { id: 13, name: "Connector Line", Component: Design13 },
    { id: 14, name: "Stacked Pill", Component: Design14 },
    { id: 15, name: "Split Table", Component: Design15 },
    { id: 16, name: "Interactive Sentence", Component: Design16 },
    { id: 17, name: "Match Tags", Component: Design17 },
    { id: 18, name: "Process Flow", Component: Design18 },
    { id: 19, name: "Grid Matrix", Component: Design19 },
    { id: 20, name: "Search Focused", Component: Design20 },
    { id: 21, name: "Data Card Grid", Component: Design21 },
    { id: 22, name: "Terminal Code", Component: Design22 },
    { id: 23, name: "Pastel Tags", Component: Design23 },
    { id: 24, name: "Connected Nodes", Component: Design24 },
    { id: 25, name: "Focus Underline", Component: Design25 },
    { id: 26, name: "Vertical Stacks", Component: Design26 },
    { id: 27, name: "Neumorphic Soft", Component: Design27 },
    { id: 28, name: "High Contrast", Component: Design28 },
    { id: 29, name: "Numbered Steps", Component: Design29 },
    { id: 30, name: "Detailed Accordion", Component: Design30 },
];
