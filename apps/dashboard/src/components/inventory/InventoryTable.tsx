import { useMemo, useState } from "react";
import { MoreVertical, Image as ImageIcon, ArrowUp, ArrowDown, ArrowUpDown, AlertTriangle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useInventoryStore, COLUMN_LABELS, formatCurrency, formatDate, type InventoryUnit, type ColumnKey } from "../../store/inventoryStore";

type SortKey = keyof InventoryUnit | null;

const PAGE_SIZE = 50;

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-700",
  Reserved:  "bg-amber-900 text-white",
  Sold:      "bg-blue-100 text-blue-700",
  Blocked:   "bg-rose-100 text-rose-700",
  Unavailable: "bg-gray-200 text-gray-600",
  Booked:    "bg-blue-500 text-white",
};

const InventoryTable = () => {
  const units = useInventoryStore(useShallow((s) => s.getFilteredUnits()));
  const selectedIds = useInventoryStore((s) => s.selectedIds);
  const toggleSelection = useInventoryStore((s) => s.toggleSelection);
  const selectAll = useInventoryStore((s) => s.selectAll);
  const clearSelection = useInventoryStore((s) => s.clearSelection);
  const visibleColumns = useInventoryStore((s) => s.visibleColumns);
  const columnOrder = useInventoryStore((s) => s.columnOrder);
  const density = useInventoryStore((s) => s.density);
  const setPreviewUnit = useInventoryStore((s) => s.setPreviewUnit);

  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const orderedColumns = useMemo(
    () => columnOrder.filter((c) => visibleColumns.includes(c)),
    [columnOrder, visibleColumns]
  );

  const sorted = useMemo(() => {
    if (!sortKey) return units;
    const key = sortKey;
    return [...units].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [units, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageIds = pageRows.map((u) => u.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const handleSort = (key: keyof InventoryUnit) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const rowPadding = density === "compact" ? "py-1.5" : "py-2.5";
  const textSize = density === "compact" ? "text-[11px]" : "text-xs";

  return (
    <div className="flex-1 flex flex-col min-h-0 border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Selection bar */}
      <div className="h-10 px-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 shrink-0">
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-gray-900">{selectedIds.length} units selected</span>
            <button onClick={clearSelection} className="text-gray-500 hover:text-gray-700 underline underline-offset-2">
              Clear
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <button className="h-6 px-2 text-[11px] font-medium text-gray-700 hover:bg-gray-100 rounded-md">Bulk edit</button>
            <button className="h-6 px-2 text-[11px] font-medium text-gray-700 hover:bg-gray-100 rounded-md">Assign agent</button>
            <button className="h-6 px-2 text-[11px] font-medium text-gray-700 hover:bg-gray-100 rounded-md">Change status</button>
            <button className="h-6 px-2 text-[11px] font-medium text-gray-700 hover:bg-gray-100 rounded-md">Export</button>
            <button className="h-6 px-2 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded-md">Delete</button>
          </div>
        ) : (
          <span className="text-xs font-medium text-gray-500">No Units Selected</span>
        )}
        <span className="text-[11px] text-gray-500">{sorted.length.toLocaleString()} results</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <Checkbox
                  checked={allOnPageSelected}
                  onCheckedChange={() => selectAll(pageIds)}
                />
              </th>
              {orderedColumns.map((col) => (
                <HeaderCell key={col} col={col} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={orderedColumns.length + 1} className="text-center py-16 text-sm text-gray-500">
                  No units match your current filters.
                </td>
              </tr>
            )}
            {pageRows.map((u) => {
              const isSelected = selectedIds.includes(u.id);
              return (
                <tr
                  key={u.id}
                  onClick={() => setPreviewUnit(u.id)}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${isSelected ? "bg-blue-50/40" : ""}`}
                >
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleSelection(u.id)} />
                  </td>
                  {orderedColumns.map((col) => (
                    <Cell key={col} col={col} unit={u} density={density} textSize={textSize} rowPadding={rowPadding} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="h-11 px-4 border-t border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div className="text-[11px] text-gray-500">
          {sorted.length === 0 ? "0" : `${(safePage - 1) * PAGE_SIZE + 1}-${Math.min(safePage * PAGE_SIZE, sorted.length)}`} of {sorted.length.toLocaleString()} Results
        </div>
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
};

const HeaderCell = ({ col, sortKey, sortDir, onSort }: {
  col: ColumnKey; sortKey: SortKey; sortDir: "asc" | "desc"; onSort: (k: keyof InventoryUnit) => void;
}) => {
  const sortable = col !== "actions" && col !== "gallery";
  const isSorted = sortKey === col;
  const Icon = isSorted ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  const alignClass = ["bua", "landArea", "bedrooms", "bathrooms", "totalPrice", "pricePerMeter"].includes(col) ? "text-right" : "text-left";
  const stickyClass = col === "unitId" ? "sticky left-10 z-10 bg-gray-50" : col === "actions" ? "sticky right-0 z-10 bg-gray-50" : "";

  return (
    <th className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-600 ${alignClass} ${stickyClass}`}>
      {sortable ? (
        <button onClick={() => onSort(col as keyof InventoryUnit)} className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
          {COLUMN_LABELS[col]}
          <Icon size={11} className={isSorted ? "text-blue-600" : "text-gray-400"} />
        </button>
      ) : (
        <span>{COLUMN_LABELS[col]}</span>
      )}
    </th>
  );
};

const Cell = ({ col, unit, textSize, rowPadding }: {
  col: ColumnKey; unit: InventoryUnit; density: "compact" | "comfortable"; textSize: string; rowPadding: string;
}) => {
  const base = `${textSize} ${rowPadding} px-3 text-gray-800`;

  switch (col) {
    case "unitId":
      return (
        <td className={`${base} font-semibold text-gray-900 sticky left-10 bg-inherit z-[5]`}>
          <div className="flex items-center gap-1.5">
            {unit.unitId}
            {unit.galleryCount === 0 && <span title="Missing gallery"><AlertTriangle size={10} className="text-amber-500" /></span>}
          </div>
        </td>
      );
    case "gallery":
      return (
        <td className={base}>
          <div className="relative inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md">
            <ImageIcon size={14} className="text-gray-400" />
            {unit.galleryCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unit.galleryCount}
              </span>
            )}
          </div>
        </td>
      );
    case "buildingId":
      return <td className={base}>{unit.buildingId}</td>;
    case "type":
      return <td className={base}>{unit.type}</td>;
    case "design":
      return <td className={`${base} text-gray-600 truncate max-w-[140px]`}>{unit.design}</td>;
    case "crmUnitCode":
      return <td className={`${base} text-gray-500 font-mono`}>{unit.crmUnitCode ?? "N/A"}</td>;
    case "bua":
      return <td className={`${base} text-right tabular-nums`}>{unit.bua}</td>;
    case "landArea":
      return <td className={`${base} text-right tabular-nums text-gray-500`}>{unit.landArea ?? "—"}</td>;
    case "bedrooms":
      return <td className={`${base} text-right tabular-nums`}>{unit.bedrooms || "—"}</td>;
    case "bathrooms":
      return <td className={`${base} text-right tabular-nums`}>{unit.bathrooms}</td>;
    case "floor":
      return <td className={base}>{unit.floor}</td>;
    case "view":
      return <td className={`${base} text-gray-600`}>{unit.view}</td>;
    case "compound":
      return <td className={`${base} truncate max-w-[120px]`}>{unit.compound}</td>;
    case "phase":
      return <td className={`${base} text-gray-600`}>{unit.phase}</td>;
    case "location":
      return <td className={`${base} text-gray-600`}>{unit.location}</td>;
    case "status":
      return (
        <td className={base}>
          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_STYLES[unit.status] ?? "bg-gray-100 text-gray-700"}`}>
            {unit.status}
          </span>
        </td>
      );
    case "totalPrice":
      return <td className={`${base} text-right tabular-nums font-semibold`}>{formatCurrency(unit.totalPrice)}</td>;
    case "pricePerMeter":
      return <td className={`${base} text-right tabular-nums text-gray-600`}>{formatCurrency(unit.pricePerMeter)}</td>;
    case "assignedAgent":
      return <td className={`${base} text-gray-600`}>{unit.assignedAgent ?? "—"}</td>;
    case "updatedAt":
      return <td className={`${base} text-gray-500`}>{formatDate(unit.updatedAt)}</td>;
    case "actions":
      return (
        <td className={`${base} sticky right-0 bg-inherit z-[5]`} onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                <MoreVertical size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="text-xs">View details</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Edit unit</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Change status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-rose-600">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      );
  }
};

const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
  const pages = useMemo(() => {
    const arr: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      arr.push(1, 2, 3, 4, 5);
      arr.push("...");
      arr.push(totalPages);
    }
    return arr;
  }, [totalPages]);

  const btnBase = "min-w-[28px] h-7 px-2 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors";

  return (
    <div className="flex items-center gap-1">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className={`${btnBase} text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed`}>‹</button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-1 text-gray-400 text-xs">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`${btnBase} ${p === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            {p}
          </button>
        )
      )}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)} className={`${btnBase} text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed`}>›</button>
    </div>
  );
};

export default InventoryTable;
