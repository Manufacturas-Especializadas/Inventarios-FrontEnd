import { User, Hash, Box } from "lucide-react";

interface InventoryRowProps {
  index: number;
}

export const InventoryRow = ({ index }: InventoryRowProps) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-white border 
      border-slate-200 rounded-xl hover:border-blue-300 transition-all shadow-sm group"
    >
      <div
        className="col-span-12 md:col-span-5 flex items-center gap-2 bg-slate-50 px-3 
        py-1 rounded-lg border border-transparent focus-within:border-blue-500 
        focus-within:bg-white transition-all"
      >
        <Hash size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Escanear No. Parte"
          className="w-full bg-transparent py-1.5 text-sm font-mono focus:outline-none"
          autoFocus={index === 0}
        />
      </div>

      <div
        className="col-span-12 md:col-span-3 flex items-center gap-2 bg-blue-50/30 px-3 
        py-1 rounded-lg border border-blue-100 focus-within:border-blue-500 
        focus-within:bg-white transition-all"
      >
        <Box size={16} className="text-blue-500" />
        <input
          type="number"
          placeholder="Cant."
          className="w-full bg-transparent py-1.5 text-sm font-bold text-blue-700 
          text-right focus:outline-none"
        />
      </div>

      <div
        className="col-span-12 md:col-span-4 flex items-center gap-2 bg-slate-50/50 
        px-3 py-1 rounded-lg border border-slate-100 italic"
      >
        <User size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Cliente..."
          className="w-full bg-transparent py-1.5 text-sm text-slate-500 focus:outline-none"
          readOnly
        />
      </div>
    </div>
  );
};
