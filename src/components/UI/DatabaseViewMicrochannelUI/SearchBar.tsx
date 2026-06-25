import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
}

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  resultsCount,
}: SearchBarProps) => {
  return (
    <section
      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex 
      items-center gap-4"
    >
      <div className="flex-1 relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar por prefijo (CONT- o CTNA-), código completo o estatus..."
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
          focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
          transition-all font-medium text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        className="hidden md:flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl 
        border border-slate-200"
      >
        <Search size={18} className="text-slate-400" />
        <span className="font-bold text-slate-600">
          {resultsCount} Resultados
        </span>
      </div>
    </section>
  );
};
