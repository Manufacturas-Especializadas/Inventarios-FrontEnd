import {
  RefreshCw,
  Box,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { MicroChannelList } from "../../../types/Types";

interface DataTableProps {
  currentItems: MicroChannelList[];
  isLoading: boolean;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  totalFilteredCount: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export const DataTable = ({
  currentItems,
  isLoading,
  searchTerm,
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  totalFilteredCount,
  setCurrentPage,
}: DataTableProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 shadow-sm 
      overflow-hidden flex flex-col"
    >
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th
                className="px-6 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                ID
              </th>
              <th
                className="px-6 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                Contenedor
              </th>
              <th
                className="px-6 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                Estatus
              </th>
              <th
                className="px-6 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                Fecha Entrada
              </th>
              <th
                className="px-6 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                Fecha Salida
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <RefreshCw
                    size={32}
                    className="animate-spin mx-auto mb-3 text-blue-500"
                  />
                  <p className="font-medium">Cargando registros...</p>
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <Box size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">
                    No se encontraron registros para "{searchTerm}"
                  </p>
                </td>
              </tr>
            ) : (
              currentItems.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">
                    #{row.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-black text-slate-800 text-base">
                        {row.code}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {row.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                        row.status === "EN MESA" || row.status === "ADENTRO"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {row.status === "EN MESA" || row.status === "ADENTRO" ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      )}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <ArrowDownRight size={16} className="text-emerald-500" />
                      {formatDate(row.entryDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      {row.exitDate ? (
                        <>
                          <ArrowUpRight size={16} className="text-orange-500" />
                          {formatDate(row.exitDate)}
                        </>
                      ) : (
                        <span className="text-slate-300 italic px-6">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalFilteredCount > 0 && (
        <div
          className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center 
          justify-between"
        >
          <span className="text-sm font-medium text-slate-500">
            Mostrando{" "}
            <span className="font-bold text-slate-700">
              {indexOfFirstItem + 1}
            </span>{" "}
            al{" "}
            <span className="font-bold text-slate-700">
              {Math.min(indexOfLastItem, totalFilteredCount)}
            </span>{" "}
            de{" "}
            <span className="font-bold text-slate-700">
              {totalFilteredCount}
            </span>{" "}
            resultados
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 
              hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm 
              font-bold text-slate-700"
            >
              Página {currentPage} de {totalPages}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 
              hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
