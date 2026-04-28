import { Database, RefreshCw, Pencil, Eye, Plus, MoreVertical, Download, Upload, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useInventoryStore } from "../store/inventoryStore";
import InventoryKPIs from "../components/inventory/InventoryKPIs";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import UnitQuickPreview from "../components/inventory/UnitQuickPreview";
import ViewSettingsPanel from "../components/inventory/ViewSettingsPanel";

const InventoryDataPage = () => {
  const setViewSettingsOpen = useInventoryStore((s) => s.setViewSettingsOpen);
  return (
    <div className="h-full w-full bg-white text-gray-900 overflow-hidden font-sans flex flex-col">
      <UnitQuickPreview />
      <ViewSettingsPanel />

      {/* Top bar */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <Database size={20} />
          <span className="text-base font-bold text-gray-900 leading-none">Inventory Data</span>
          <span className="text-gray-300 px-1">/</span>
          <span className="text-sm font-medium text-gray-500">Summary & Units</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" className="h-8 gap-1.5 text-xs font-medium px-3 border-gray-200 text-gray-700 hover:bg-gray-50">
            <RefreshCw size={13} />
            Sync All Units
          </Button>
          <Button variant="outline" className="h-8 gap-1.5 text-xs font-medium px-3 border-gray-200 text-gray-700 hover:bg-gray-50">
            <Pencil size={13} />
            Edit All Units
          </Button>
          <Button className="h-8 gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium shadow-sm px-3">
            <Plus size={13} />
            Add Inventory
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button id="inventory-three-dots" variant="outline" className="h-8 w-8 p-0 border-gray-200 text-gray-700 hover:bg-gray-50">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem className="gap-2 text-xs">
                <Eye size={13} />
                Units Review
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-xs"
                onSelect={() => setViewSettingsOpen(true)}
              >
                <Settings2 size={13} />
                View Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-xs">
                <Download size={13} />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs">
                <Download size={13} />
                Export Excel
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs">
                <Upload size={13} />
                Import from CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 px-6 pt-4 pb-4 gap-3">
        <InventoryKPIs />
        <InventoryFilters />
        <InventoryTable />
      </div>
    </div>
  );
};

export default InventoryDataPage;
