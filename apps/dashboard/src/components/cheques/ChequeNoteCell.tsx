import { useEffect, useId, useRef, useState } from "react";
import { MessageSquareText, MessageSquarePlus, Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Cheque } from "../../store/chequesStore";

interface Props {
  cheque: Cheque;
  onEdit: (cheque: Cheque) => void;
  /** Keep icon visible when there's no note. Default: only visible on parent row hover. */
  alwaysVisible?: boolean;
  size?: "sm" | "md";
}

const OPEN_DELAY = 120;
const CLOSE_DELAY = 180;

// Module-level registry: only one note popover open at a time across the page.
type CloseFn = () => void;
const activeClosers = new Map<string, CloseFn>();
function claimActive(id: string, close: CloseFn) {
  activeClosers.forEach((fn, key) => {
    if (key !== id) fn();
  });
  activeClosers.set(id, close);
}
function releaseActive(id: string) {
  activeClosers.delete(id);
}

const ChequeNoteCell = ({ cheque, onEdit, alwaysVisible = false, size = "md" }: Props) => {
  const hasNote = cheque.notes.trim().length > 0;
  const iconSize = size === "sm" ? 12 : 13;
  const buttonSize = size === "sm" ? "w-6 h-6" : "w-7 h-7";

  const cellId = useId();
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const closeNow = () => {
    clearTimers();
    setOpen(false);
    releaseActive(cellId);
  };

  const scheduleOpen = () => {
    clearTimers();
    openTimer.current = setTimeout(() => {
      claimActive(cellId, closeNow);
      setOpen(true);
    }, OPEN_DELAY);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      releaseActive(cellId);
    }, CLOSE_DELAY);
  };

  useEffect(() => {
    return () => releaseActive(cellId);
  }, [cellId]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeNow();
    onEdit(cheque);
  };

  const visibilityClass = hasNote || alwaysVisible
    ? "opacity-100"
    : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleEdit}
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onFocus={scheduleOpen}
          onBlur={scheduleClose}
          aria-label={hasNote ? "View or edit note" : "Add note"}
          className={`relative ${buttonSize} rounded-lg flex items-center justify-center transition-all ${visibilityClass} ${
            hasNote
              ? "bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
              : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          }`}
        >
          {hasNote ? <MessageSquareText size={iconSize} /> : <MessageSquarePlus size={iconSize} />}
          {hasNote && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-72 p-0 text-left"
        onMouseEnter={clearTimers}
        onMouseLeave={scheduleClose}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {hasNote ? (
          <div className="flex flex-col">
            <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700">
                <MessageSquareText size={11} />
                Note
              </div>
              <span className="text-[10px] text-gray-400 font-mono">#{cheque.chequeNumber}</span>
            </div>
            <div className="px-3 py-2.5 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-auto">
              {cheque.notes}
            </div>
            <div className="px-2 py-1.5 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={handleEdit}
                className="h-7 px-2.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md flex items-center gap-1.5 transition-colors"
              >
                <Pencil size={11} />
                Edit note
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="w-full px-3 py-3 flex items-center gap-2.5 hover:bg-gray-50 transition-colors text-left rounded-lg"
          >
            <div className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
              <MessageSquarePlus size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-700">No note yet</div>
              <div className="text-[10px] text-gray-400">Click to add a note for this cheque.</div>
            </div>
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ChequeNoteCell;
