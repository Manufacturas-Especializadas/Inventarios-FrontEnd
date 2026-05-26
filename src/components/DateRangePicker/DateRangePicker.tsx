import { Calendar, X, ArrowRight } from "lucide-react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  disabled = false,
}: DateRangePickerProps) => {
  const hasDates = startDate || endDate;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-2 p-1 bg-slate-50/50 
      border border-slate-200 rounded-xl transition-all
      ${disabled ? "opacity-60 pointer-events-none" : "hover:border-slate-300"}`}
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border 
        border-slate-100 shadow-sm transition-all focus-within:ring-2 
        focus-within:ring-emerald-500/20 focus-within:border-emerald-300 relative"
      >
        <Calendar className="text-slate-400" size={16} />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          disabled={disabled}
          className="bg-transparent text-sm font-medium text-slate-700 outline-none 
          cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 
          [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
          title="Fecha de inicio"
        />
      </div>

      <ArrowRight size={14} className="text-slate-300 hidden sm:block" />

      <div
        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border 
        border-slate-100 shadow-sm transition-all focus-within:ring-2 
        focus-within:ring-emerald-500/20 focus-within:border-emerald-300 relative"
      >
        <Calendar className="text-slate-400" size={16} />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          disabled={disabled}
          min={startDate}
          className="bg-transparent text-sm font-medium text-slate-700 outline-none 
          cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 
          [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
          title="Fecha de fin"
        />
      </div>

      {hasDates && (
        <button
          onClick={onClear}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 
          rounded-md transition-colors ml-1"
          title="Limpiar fechas"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
