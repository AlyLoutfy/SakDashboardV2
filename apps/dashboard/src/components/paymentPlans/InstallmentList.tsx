import { AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, ListX } from "lucide-react";
import { Button } from "@/components/ui/button";
import InstallmentRow from "./InstallmentRow";
import type { Installment } from "../../store/paymentPlansStore";

interface InstallmentListProps {
  installments: Installment[];
  onUpdate: (id: string, updates: Partial<Installment>) => void;
  onRemove: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onAdd: () => void;
}

const InstallmentList = ({ installments, onUpdate, onRemove, onReorder, onAdd }: InstallmentListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  if (installments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <ListX size={28} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-1">No Installments Yet</h3>
        <p className="text-sm text-gray-500 text-center mb-4 max-w-xs">Use the calculator above to generate installments, or add them manually.</p>
        <Button onClick={onAdd} variant="secondary" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
          <Plus size={18} />
          Add Installment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="w-[30px]"></div>
        <div className="w-8 text-center">#</div>
        <div className="flex-1 min-w-[140px]">Amount</div>
        <div className="flex-1 min-w-[150px]">Due Date</div>
        <div className="flex-[2] min-w-[180px]">Description</div>
        <div className="w-16"></div>
      </div>

      {/* Sortable List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={installments.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {installments.map((installment) => (
              <InstallmentRow key={installment.id} installment={installment} onUpdate={(updates) => onUpdate(installment.id, updates)} onRemove={() => onRemove(installment.id)} />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {/* Add Button */}
      <Button onClick={onAdd} variant="ghost" className="w-full gap-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 border-2 border-dashed border-gray-200 hover:border-emerald-200 rounded-xl py-3">
        <Plus size={18} />
        Add Installment
      </Button>
    </div>
  );
};

export default InstallmentList;
