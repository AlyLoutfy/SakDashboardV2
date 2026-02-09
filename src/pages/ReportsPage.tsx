import { useState, useRef, useEffect } from "react";
import { LayoutGrid, Download, Plus, X, Search } from "lucide-react";
import { Button } from "@heroui/react";
import { useReportsStore } from "../store/reportsStore";
import type { DataSource } from "../store/reportsStore";

// Mock data
// @ts-ignore
const MOCK_DATA = {
  units: [
    { unit_code: "A-101", compound: "The Heights", type: "Apartment", area: 150, price: "3,500,000", status: "Available" },
    { unit_code: "B-205", compound: "Palm Valley", type: "Villa", area: 320, price: "8,200,000", status: "Sold" },
    { unit_code: "C-310", compound: "The Heights", type: "Duplex", area: 210, price: "5,100,000", status: "Reserved" },
    { unit_code: "A-102", compound: "The Heights", type: "Apartment", area: 155, price: "3,650,000", status: "Available" },
    { unit_code: "D-401", compound: "Seaview", type: "Chalet", area: 95, price: "2,800,000", status: "Available" },
  ],
  reservations: [
    { id: "RES-001", client_name: "Ahmed Hassan", unit_code: "B-205", date: "2025-12-15", amount: "50,000", salesperson: "Sarah M.", status: "Confirmed" },
    { id: "RES-002", client_name: "Mona Ali", unit_code: "C-310", date: "2026-01-05", amount: "50,000", salesperson: "Karim S.", status: "Pending" },
  ],
  leads: [
    { name: "John Doe", phone: "+201xxxxxxxxx", email: "john@example.com", source: "Facebook", status: "New", assigned_to: "Sarah M." },
    { name: "Jane Smith", phone: "+201xxxxxxxxx", email: "jane@example.com", source: "Website", status: "Contacted", assigned_to: "Karim S." },
  ],
  sales: [{ contract_id: "CTR-2025-089", client: "Ahmed Hassan", unit: "B-205", total_value: "8,200,000", paid_amount: "2,460,000", contract_date: "2025-12-20" }],
};

const DATA_SOURCES: { key: DataSource; label: string }[] = [
  { key: "units", label: "Units Inventory" },
  { key: "reservations", label: "Reservations" },
  { key: "leads", label: "Leads & CRM" },
  { key: "sales", label: "Sales Contracts" },
];

const ColumnHeader = ({ column, onRename }: { column: any; onRename: (id: string, newLabel: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(column.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (label.trim()) {
      onRename(column.id, label);
    } else {
      setLabel(column.label); // Revert if empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setLabel(column.label);
    }
  };

  return (
    <th className="px-4 py-3 font-medium border-b border-gray-200 bg-gray-50 text-left min-w-[150px]" onDoubleClick={() => setIsEditing(true)}>
      {isEditing ? (
        <input ref={inputRef} type="text" value={label} onChange={(e) => setLabel(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="w-full bg-white border border-blue-500 rounded px-2 py-1 text-xs outline-none text-gray-900" />
      ) : (
        <div className="flex items-center gap-2 cursor-pointer group" title="Double click to rename">
          {column.label}
          <span className="opacity-0 group-hover:opacity-100 text-gray-400 text-[10px]">✎</span>
        </div>
      )}
    </th>
  );
};

const ReportsPage = () => {
  const { selectedDataSource, setDataSource, columns, toggleColumn, filters, addFilter, removeFilter, updateFilter, renameColumn } = useReportsStore();

  const newId = () => Math.random().toString(36).substr(2, 9);

  const handleAddFilter = () => {
    addFilter({
      id: newId(),
      field: columns[0]?.id || "",
      operator: "equals",
      value: "",
    });
  };

  // @ts-ignore
  const currentData = MOCK_DATA[selectedDataSource] || [];
  const activeColumns = columns.filter((c) => c.visible);

  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <LayoutGrid size={20} />
          <span className="text-base font-bold text-gray-900 leading-none">Reports</span>
          <span className="text-gray-300 px-1">/</span>
          <span className="text-sm font-medium text-gray-500">{DATA_SOURCES.find((ds) => ds.key === selectedDataSource)?.label || "Select Source"}</span>
        </div>
        <div className="flex gap-2">
          {/* Live Data Indicator */}
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium h-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </div>
          <Button size="sm" className="bg-gray-900 text-white h-8 font-medium rounded-full px-4 shadow-sm hover:bg-gray-800">
            <Download size={14} className="mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters */}
        <div className="w-72 bg-white border-r border-gray-200 p-4 space-y-6 overflow-y-auto shrink-0 flex flex-col">
          {/* Data Source Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data Source</label>
            <div className="space-y-1">
              {DATA_SOURCES.map((source) => (
                <button key={source.key} onClick={() => setDataSource(source.key)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedDataSource === source.key ? "bg-gray-100 text-gray-900 font-medium border border-gray-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                  {source.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Active Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Filters</label>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{filters.length}</span>
            </div>

            <div className="space-y-3">
              {filters.length === 0 ? (
                <div className="text-center py-4 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-400">No filters applied</p>
                </div>
              ) : (
                filters.map((filter) => (
                  <div key={filter.id} className="bg-white border border-gray-200 rounded-lg p-3 relative group hover:border-gray-300 transition-colors shadow-sm">
                    <div className="flex flex-col gap-2">
                      {/* Filter Field Selection */}
                      <div className="flex gap-2">
                        <select className="bg-transparent text-[10px] text-gray-500 uppercase font-bold outline-none cursor-pointer hover:text-gray-700 w-1/2" value={filter.field} onChange={(e) => updateFilter(filter.id, { field: e.target.value })}>
                          {columns.map((col) => (
                            <option key={col.id} value={col.id}>
                              {col.label}
                            </option>
                          ))}
                        </select>
                        <select className="bg-transparent text-[10px] text-gray-500 uppercase font-bold outline-none cursor-pointer hover:text-gray-700 w-1/2 text-right" value={filter.operator} onChange={(e) => updateFilter(filter.id, { operator: e.target.value as any })}>
                          <option value="equals">Equals</option>
                          <option value="contains">Contains</option>
                          <option value="gt">&gt;</option>
                          <option value="lt">&lt;</option>
                        </select>
                      </div>

                      {/* Filter Value */}
                      <input type="text" value={filter.value as string} onChange={(e) => updateFilter(filter.id, { value: e.target.value })} placeholder="Value..." className="bg-transparent text-sm font-medium text-emerald-600 placeholder:text-gray-400 outline-none w-full" />
                    </div>
                    <X size={14} className="absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500 transition-opacity" onClick={() => removeFilter(filter.id)} />
                  </div>
                ))
              )}

              <Button variant="ghost" className="w-full text-gray-500 border border-dashed border-gray-200 hover:border-gray-300 hover:text-gray-700 h-10 group" onPress={handleAddFilter}>
                <Plus size={16} className="mr-2 group-hover:text-emerald-500 transition-colors" /> Add Filter
              </Button>
            </div>
          </div>

          <div className="flex-1" />

          {/* Columns Toggle */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visible Columns</label>
            <div className="flex flex-wrap gap-1.5">
              {columns.map((col) => (
                <button key={col.id} onClick={() => toggleColumn(col.id)} className={`px-2 py-1 rounded text-[10px] border transition-colors ${col.visible ? "bg-gray-100 border-gray-200 text-gray-700" : "bg-transparent border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Data Grid */}
        <div className="flex-1 bg-white flex flex-col min-w-0">
          <div className="flex-1 p-4 overflow-auto custom-scrollbar">
            <div className="border border-gray-200 rounded-lg overflow-hidden min-w-[600px] shadow-sm bg-white">
              <table className="w-full text-left text-xs bg-white">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    {activeColumns.map((col) => (
                      <ColumnHeader key={col.id} column={col} onRename={renameColumn} />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 bg-white">
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={activeColumns.length} className="px-4 py-12 text-center text-gray-400 bg-white">
                        <Search className="mx-auto mb-2 opacity-20" size={32} />
                        No data found
                      </td>
                    </tr>
                  ) : (
                    currentData.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors group bg-white">
                        {activeColumns.map((col) => (
                          <td key={col.id} className="px-4 py-3 whitespace-nowrap bg-white">
                            {col.id === "status" ? (
                              <>
                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${row[col.id] === "Available" || row[col.id] === "New" || row[col.id] === "Confirmed" ? "bg-emerald-500" : row[col.id] === "Sold" || row[col.id] === "Contacted" ? "bg-gray-400" : "bg-amber-500"}`} />
                                {row[col.id]}
                              </>
                            ) : col.id === "price" || col.id === "total_value" || col.id === "amount" ? (
                              <span className="font-mono text-gray-900 font-medium">{row[col.id]}</span>
                            ) : col.id === "unit_code" ? (
                              <span className="font-mono text-emerald-600 font-medium group-hover:underline cursor-pointer">{row[col.id]}</span>
                            ) : (
                              <span className="opacity-80">{row[col.id]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
