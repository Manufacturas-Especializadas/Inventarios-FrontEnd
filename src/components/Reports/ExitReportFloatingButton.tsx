import { CheckSquare, Printer } from "lucide-react";

interface Props {
  selectedFolios: string[];
  isLoading: boolean;
  handleGenerate: () => void;
}

export const ExitReportFloatingButton = ({
  selectedFolios,
  isLoading,
  handleGenerate,
}: Props) => {
  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900
      text-white px-6 py-4 rounded-full flex items-center gap-6 z-50 shadow-xl"
    >
      <div className="flex items-center gap-2">
        <CheckSquare size={20} className="text-emerald-400" />

        <span className="font-medium">
          {selectedFolios.length} seleccionados
        </span>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 
        px-5 py-2 rounded-full font-bold transition-colors disabled:opacity-50"
      >
        <Printer size={18} />

        {isLoading ? "Generando..." : "Imprimir Reporte"}
      </button>
    </div>
  );
};
