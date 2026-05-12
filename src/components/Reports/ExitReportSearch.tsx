import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const ExitReportSearch = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <div
      className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm
      flex items-center gap-3"
    >
      <Search size={20} className="text-slate-400" />

      <input
        type="text"
        className="w-full outline-none text-sm font-medium text-slate-700"
        placeholder="Buscar por folio, Shop Order o Número de parte..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
