import { useEffect, useRef, useState } from "react";
import { X, Rows2, Rows3, BookmarkPlus, Trash2, Check, Bookmark, Columns3, LayoutGrid, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventoryStore, COLUMN_LABELS, ALL_COLUMNS, type ColumnKey } from "../../store/inventoryStore";

const COLUMN_GROUPS: { label: string; cols: ColumnKey[] }[] = [
  { label: "Identity", cols: ["gallery", "unitId", "buildingId", "crmUnitCode"] },
  { label: "Specs", cols: ["type", "design", "bua", "landArea", "bedrooms", "bathrooms", "floor", "view"] },
  { label: "Location", cols: ["compound", "phase", "location"] },
  { label: "Status & Price", cols: ["status", "totalPrice", "pricePerMeter"] },
  { label: "Meta", cols: ["assignedAgent", "updatedAt"] },
];

const ViewSettingsPanel = () => {
  const open = useInventoryStore((s) => s.viewSettingsOpen);
  const setOpen = useInventoryStore((s) => s.setViewSettingsOpen);
  const density = useInventoryStore((s) => s.density);
  const setDensity = useInventoryStore((s) => s.setDensity);
  const visibleColumns = useInventoryStore((s) => s.visibleColumns);
  const toggleColumn = useInventoryStore((s) => s.toggleColumn);
  const savedViews = useInventoryStore((s) => s.savedViews);
  const activeViewId = useInventoryStore((s) => s.activeViewId);
  const loadView = useInventoryStore((s) => s.loadView);
  const saveView = useInventoryStore((s) => s.saveView);
  const deleteView = useInventoryStore((s) => s.deleteView);
  const resetFilters = useInventoryStore((s) => s.resetFilters);

  const [newViewName, setNewViewName] = useState("");
  const [savingView, setSavingView] = useState(false);
  const [tab, setTab] = useState<"columns" | "views">("columns");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        const trigger = document.getElementById("inventory-three-dots");
        if (trigger && trigger.contains(target)) return;
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const handleSaveView = () => {
    if (!newViewName.trim()) return;
    saveView(newViewName.trim());
    setNewViewName("");
    setSavingView(false);
  };

  const totalCols = ALL_COLUMNS.length - 1;
  const allVisible = visibleColumns.length === totalCols;

  const toggleAll = () => {
    const cols = ALL_COLUMNS.filter((c) => c !== "actions") as ColumnKey[];
    if (allVisible) {
      cols.forEach((c) => visibleColumns.includes(c) && toggleColumn(c));
    } else {
      cols.forEach((c) => !visibleColumns.includes(c) && toggleColumn(c));
    }
  };

  const currentView = savedViews.find((v) => v.id === activeViewId);

  return (
    <div
      ref={panelRef}
      className="fixed top-[52px] right-4 w-[340px] max-h-[calc(100vh-70px)] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100 shrink-0">
        <h2 className="text-xs font-bold text-gray-900">View Settings</h2>
        <button
          onClick={() => setOpen(false)}
          className="h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Density */}
      <div className="px-3.5 py-2.5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <LayoutGrid size={10} className="text-gray-500" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Density</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setDensity("compact")}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border text-xs font-medium transition-all ${density === "compact" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            <Rows3 size={12} />
            Compact
          </button>
          <button
            onClick={() => setDensity("comfortable")}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border text-xs font-medium transition-all ${density === "comfortable" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            <Rows2 size={12} />
            Comfortable
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 shrink-0 px-1.5 pt-1">
        <button
          onClick={() => setTab("columns")}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium border-b-2 -mb-px transition-colors ${tab === "columns" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <Columns3 size={11} />
          Columns
          <span className="text-[9px] text-gray-400 ml-0.5">{visibleColumns.length}/{totalCols}</span>
        </button>
        <button
          onClick={() => setTab("views")}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium border-b-2 -mb-px transition-colors ${tab === "views" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <Bookmark size={11} />
          Views
          {savedViews.length > 0 && <span className="text-[9px] text-gray-400 ml-0.5">{savedViews.length}</span>}
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "columns" && (
          <div className="p-2.5">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] text-gray-500">Toggles apply live</span>
              <button
                onClick={toggleAll}
                className="text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {allVisible ? "Hide all" : "Show all"}
              </button>
            </div>
            <div className="space-y-2">
              {COLUMN_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5 px-1">{group.label}</div>
                  <div className="grid grid-cols-2 gap-0.5">
                    {group.cols.map((col) => {
                      const checked = visibleColumns.includes(col);
                      return (
                        <button
                          key={col}
                          onClick={() => toggleColumn(col)}
                          className={`flex items-center gap-1.5 px-1.5 py-1 rounded-md text-[11px] transition-colors text-left ${checked ? "text-gray-800 hover:bg-gray-50" : "text-gray-400 hover:bg-gray-50"}`}
                        >
                          <div className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                            {checked && <Check size={8} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className="truncate">{COLUMN_LABELS[col]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "views" && (
          <div className="p-2.5">
            {currentView && (
              <div className="mb-2 px-2.5 py-1.5 bg-blue-50 rounded-md border border-blue-100">
                <div className="text-[9px] text-blue-600 font-semibold uppercase tracking-wide">Active</div>
                <div className="text-[11px] font-semibold text-blue-800 mt-0.5 truncate">{currentView.name}</div>
              </div>
            )}
            <div className="space-y-0.5">
              {savedViews.length === 0 && !savingView && (
                <div className="px-2 py-6 text-center">
                  <Bookmark size={16} className="mx-auto text-gray-300 mb-1" />
                  <div className="text-[10px] text-gray-400">No saved views yet</div>
                </div>
              )}
              {savedViews.map((v) => (
                <div
                  key={v.id}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md group cursor-pointer transition-colors ${activeViewId === v.id ? "bg-blue-50 ring-1 ring-inset ring-blue-200" : "hover:bg-gray-50"}`}
                  onClick={() => loadView(v.id)}
                >
                  <span className={`text-[11px] flex-1 truncate ${activeViewId === v.id ? "font-semibold text-blue-700" : "text-gray-700"}`}>
                    {v.name}
                  </span>
                  {activeViewId === v.id && <Check size={11} className="text-blue-600 shrink-0" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteView(v.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-rose-600 transition-opacity"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-2 shrink-0 bg-gray-50/50">
        {savingView ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveView(); if (e.key === "Escape") setSavingView(false); }}
              placeholder="View name..."
              className="flex-1 h-7 px-2 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            />
            <Button size="sm" className="h-7 text-[11px] px-2" onClick={handleSaveView}>Save</Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSavingView(true)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
            >
              <BookmarkPlus size={11} />
              Save view
            </button>
            <button
              onClick={() => { resetFilters(); }}
              title="Reset all filters"
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] text-gray-500 hover:bg-white hover:text-gray-700 border border-gray-200 transition-colors"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSettingsPanel;
