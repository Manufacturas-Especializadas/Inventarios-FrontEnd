import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ExitReportPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          border border-slate-200
          bg-white
          shadow-sm
          hover:bg-slate-50
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        <ChevronLeft size={18} />
        Anterior
      </button>

      <div className="px-4 py-2 text-sm font-semibold text-slate-600">
        Página {currentPage} de {totalPages}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          border border-slate-200
          bg-white
          shadow-sm
          hover:bg-slate-50
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        Siguiente
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
