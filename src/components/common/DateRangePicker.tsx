import { useState } from "react";
import { Popover } from "@heroui/react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export default function DateRangePicker({ value, onChange, className, placeholder = "Select dates" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    onChange(range);
    if (range?.from && range?.to) {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const getDisplayValue = () => {
    if (!value?.from) return "";
    if (!value.to || isSameDay(value.from, value.to)) {
      return format(value.from, "dd MMM, yyyy");
    }
    return `${format(value.from, "dd MMM, yyyy")} - ${format(value.to, "dd MMM, yyyy")}`;
  };

  const clearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <div className={`relative cursor-pointer group ${className}`}>
          {/* Trigger Button - styled to match other filters exactly */}
          <div className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 bg-white transition-colors h-full w-full">
            <CalendarIcon size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className={`flex-1 truncate ${!value?.from ? "text-gray-500" : "text-gray-900 font-medium"}`}>{getDisplayValue() || placeholder}</span>
            {value?.from ? (
              <button onClick={clearRange} className="p-0.5 hover:bg-gray-200 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                <X size={12} />
              </button>
            ) : (
              <div className="w-3" /> /* Spacer to keep alignment */
            )}
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Content placement="bottom start" className="p-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] min-w-[320px]">
        <DayPicker
          mode="range"
          selected={value}
          onSelect={handleSelect}
          showOutsideDays={true}
          weekStartsOn={1}
          className="m-0 font-sans"
          classNames={{
            root: "w-full",
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-between pt-1 relative items-center px-1",
            caption_label: "text-sm font-bold text-gray-900",
            nav: "flex items-center gap-1",
            nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-600",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-400 rounded-md w-9 font-medium text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-gray-100 transition-colors text-gray-900",
            day_range_start: "day-range-start",
            day_range_end: "day-range-end",
            day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white !rounded-full font-semibold shadow-md shadow-blue-200",
            day_today: "bg-gray-100 text-gray-900 font-bold",
            day_outside: "text-gray-300 opacity-50",
            day_disabled: "text-gray-300 opacity-50",
            day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-700 !rounded-none first:rounded-l-full last:rounded-r-full",
            day_hidden: "invisible",
          }}
        />
        {/* Custom refinement specifically for start/end rounding overlap in range mode */}
        <style>{`
          .day-range-start {
             border-top-left-radius: 9999px !important;
             border-bottom-left-radius: 9999px !important;
             border-top-right-radius: 0 !important;
             border-bottom-right-radius: 0 !important;
          }
           .day-range-end {
             border-top-left-radius: 0 !important;
             border-bottom-left-radius: 0 !important;
             border-top-right-radius: 9999px !important;
             border-bottom-right-radius: 9999px !important;
          }
          .rdp-day_selected:not(.rdp-day_outside) {
             background-color: #006FEE; /* HeroUI Blue */
             color: white;
          }
          .rdp-day_range_middle:not(.rdp-day_outside) {
             background-color: #E6F1FE !important; /* Very light blue */
             color: #006FEE !important;
             border-radius: 0 !important;
          }
           /* Full circle for single selection or start/end if they are same */
           .rdp-day_range_start.rdp-day_range_end {
              border-radius: 9999px !important;
           }
        `}</style>
      </Popover.Content>
    </Popover>
  );
}
