import { useState } from "react";
import { Popover } from "@heroui/react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, className, placeholder = "Select date" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsOpen(false);
    }
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <div className={`relative cursor-pointer ${className}`}>
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input readOnly type="text" value={value ? format(value, "dd/MM/yyyy") : ""} placeholder={placeholder} className="w-full pl-10 pr-3 py-2.5 text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer placeholder-gray-400" />
        </div>
      </Popover.Trigger>
      <Popover.Content placement="bottom start" className="p-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <style>{`
          .rdp {
            --rdp-cell-size: 32px;
            --rdp-accent-color: #10b981;
            --rdp-background-color: #ecfdf5;
            margin: 0;
            padding: 1rem;
          }
          .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
            background-color: #f3f4f6;
          }
          .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
            color: white;
            font-weight: bold;
          }
          .rdp-caption_label {
            font-weight: 700;
            color: #111827;
          }
          .rdp-nav_button {
            color: #6b7280;
          }
        `}</style>
        <DayPicker mode="single" selected={value} onSelect={handleSelect} showOutsideDays className="border-0" />
      </Popover.Content>
    </Popover>
  );
}
