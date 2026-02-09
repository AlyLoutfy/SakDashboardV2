import { useState, useEffect } from "react";
import { Popover } from "@heroui/react";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export default function DateRangePicker({ value, onChange, className, placeholder = "Select dates" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Sync current month with value when popover opens
  useEffect(() => {
    if (isOpen) {
      if (value?.from) {
        setCurrentMonth(value.from);
      } else {
        setCurrentMonth(new Date());
      }
    }
  }, [isOpen, value]);

  const handleSelect = (range: DateRange | undefined) => {
    onChange(range);
    // User requested to NOT close the datepicker automatically
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

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

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

      {/* Popover Content */}
      <Popover.Content placement="bottom start" className="p-0 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-[100] w-auto">
        <div className="p-4 space-y-3">
          {/* Custom Header */}
          <div className="flex items-center justify-between px-2 mb-1">
            <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ChevronLeft size={16} />
            </button>
            <span className="font-bold text-sm text-gray-800">{format(currentMonth, "MMMM yyyy")}</span>
            <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ChevronRight size={16} />
            </button>
          </div>

          <DayPicker
            mode="range"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={value}
            onSelect={handleSelect}
            showOutsideDays={true}
            weekStartsOn={1}
            className="m-0 font-sans compact-pills-calendar"
            classNames={{
              root: "w-full",
              months: "flex flex-col",
              month: "space-y-3 w-full",
              caption: "hidden", // Hide default caption/nav
              caption_label: "hidden", // Also hide specific label
              table: "w-full border-collapse",
              head_row: "flex gap-0.5 bg-gray-50 rounded-xl p-2 mb-2",
              head_cell: "text-center text-[10px] font-semibold text-gray-400 flex-1 py-1", // Reduced weight
              row: "flex gap-0.5 w-full",
              cell: "text-center text-sm p-0.5 relative flex-1",
              day: "h-8 w-8 mx-auto rounded-full text-xs font-normal transition-all hover:bg-gray-100 text-gray-700", // Normal weight, circle
              day_range_start: "day-range-start",
              day_range_end: "day-range-end",
              day_selected: "day-selected", // Custom class for blue circle
              day_today: "bg-transparent text-indigo-600 font-bold border border-indigo-200", // Just text and border? Or bg?
              day_outside: "text-gray-300 opacity-50",
              day_disabled: "text-gray-300 opacity-50",
              day_range_middle: "day-range-middle", // Custom class for grey circle
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Compact Pills Design Styles for react-day-picker v9 */}
        <style>{`
          /* Base calendar reset */
          .compact-pills-calendar {
            margin: 0;
            font-family: inherit;
          }

          /* Hide default header elements as we use a custom one */
          .compact-pills-calendar .rdp-caption, 
          .compact-pills-calendar .rdp-nav,
          .compact-pills-calendar .rdp-caption_label,
          .compact-pills-calendar .rdp-month_caption,
          .compact-pills-calendar .rdp-button_previous,
          .compact-pills-calendar .rdp-button_next {
            display: none !important;
          }
          
          /* Weekdays Header */
          .compact-pills-calendar .rdp-weekdays,
          .compact-pills-calendar .rdp-head_row {
            display: flex;
            background-color: #f9fafb;
            border-radius: 0.75rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            gap: 2px;
          }
          
          .compact-pills-calendar .rdp-weekday,
          .compact-pills-calendar .rdp-head_cell {
            flex: 1;
            text-align: center;
            font-size: 10px;
            font-weight: 500;
            color: #9ca3af;
            text-transform: uppercase;
            padding: 0.25rem 0;
          }
          
          /* Table Layout */
          .compact-pills-calendar .rdp-month,
          .compact-pills-calendar .rdp-months {
            width: 100%;
          }
          
          .compact-pills-calendar .rdp-weeks,
          .compact-pills-calendar .rdp-tbody {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .compact-pills-calendar .rdp-week,
          .compact-pills-calendar .rdp-row {
            display: flex;
            gap: 4px;
          }
          
          /* Day Cell - v9 uses .rdp-day for the cell */
          .compact-pills-calendar .rdp-day,
          .compact-pills-calendar .rdp-cell {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }
          
          /* Day Button - v9 uses .rdp-day_button for the button */
          .compact-pills-calendar .rdp-day_button,
          .compact-pills-calendar .rdp-button {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            min-height: 32px !important;
            max-width: 32px !important;
            max-height: 32px !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 50% !important;
            font-size: 13px !important;
            font-weight: 400 !important;
            color: #374151;
            background: transparent;
            border: none !important;
            cursor: pointer;
            transition: background-color 0.15s, color 0.15s;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            text-align: center !important;
            box-sizing: border-box !important;
          }
          
          .compact-pills-calendar .rdp-day_button:hover {
            background-color: #f3f4f6;
          }
          
          /* Today */
          .compact-pills-calendar .rdp-today .rdp-day_button,
          .compact-pills-calendar .rdp-day_today .rdp-day_button {
            color: #4f46e5 !important;
            font-weight: 400 !important;
            background-color: #e0e7ff;
          }
          
          /* Selected Days (Start & End) - Blue Circle */
          .compact-pills-calendar .rdp-selected .rdp-day_button,
          .compact-pills-calendar .rdp-range_start .rdp-day_button,
          .compact-pills-calendar .rdp-range_end .rdp-day_button,
          .compact-pills-calendar .day-range-start .rdp-day_button,
          .compact-pills-calendar .day-range-end .rdp-day_button {
            background-color: #3b82f6 !important;
            color: white !important;
            font-weight: 400 !important;
            font-size: 13px !important;
          }
          
          /* Range Middle - Light Grey Circle */
          .compact-pills-calendar .rdp-range_middle .rdp-day_button,
          .compact-pills-calendar .day-range-middle .rdp-day_button {
            background-color: #e5e7eb !important;
            color: #1f2937 !important;
            font-weight: 400 !important;
            font-size: 13px !important;
            border-radius: 50% !important;
          }
          
          /* Override hover for selected states */
          .compact-pills-calendar .rdp-selected .rdp-day_button:hover,
          .compact-pills-calendar .rdp-range_start .rdp-day_button:hover,
          .compact-pills-calendar .rdp-range_end .rdp-day_button:hover {
            background-color: #2563eb !important;
          }
          
          .compact-pills-calendar .rdp-range_middle .rdp-day_button:hover {
            background-color: #d1d5db !important;
          }
          
          /* Outside Days */
          .compact-pills-calendar .rdp-outside .rdp-day_button,
          .compact-pills-calendar .rdp-day_outside .rdp-day_button {
            color: #d1d5db;
            opacity: 0.5;
          }
          
          /* Hidden Days */
          .compact-pills-calendar .rdp-hidden,
          .compact-pills-calendar .rdp-day_hidden {
            visibility: hidden;
          }
          
          /* Focus States */
          .compact-pills-calendar .rdp-day_button:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
          }
        `}</style>
      </Popover.Content>
    </Popover>
  );
}
