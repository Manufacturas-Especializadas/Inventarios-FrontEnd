import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Balance } from "../../types/Types";
import { formatDate } from "../../utils/formatDate";

interface Props {
  data: Balance[];
  isLoading: boolean;
  filters: any;
  onFilterChange: (field: string, value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  lineId: number;
}

export const BalanceTable = ({
  data,
  isLoading,
  filters,
  onFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  lineId,
}: Props) => {
  const isL12 = lineId === 11;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">
                No. Parte
              </th>

              {isL12 && (
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">
                  SO Entrada
                </th>
              )}

              <th
                className="px-4 py-4 text-xs font-bold text-emerald-600 uppercase text-center 
                bg-emerald-50/50"
              >
                Entradas
              </th>

              {isL12 && (
                <th
                  className="px-4 py-4 text-xs font-bold text-emerald-600 uppercase text-center 
                  bg-emerald-50/50"
                >
                  Cajas
                </th>
              )}

              <th
                className="px-4 py-4 text-xs font-bold text-orange-600 uppercase text-center 
                bg-orange-50/50"
              >
                Salidas
              </th>

              {isL12 && (
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">
                  SO Salida
                </th>
              )}

              <th
                className="px-4 py-4 text-xs font-bold text-blue-600 uppercase text-center 
                bg-blue-50/50"
              >
                Restante
              </th>
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">
                Última Entrada
              </th>
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">
                Última Salida
              </th>
              <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">
                Cliente
              </th>
            </tr>

            <tr className="bg-white border-b border-slate-200">
              <td className="p-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 rounded 
                  outline-none focus:border-blue-400"
                  value={filters.partNumber || ""}
                  onChange={(e) => onFilterChange("partNumber", e.target.value)}
                />
              </td>

              {isL12 && (
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 rounded 
                    outline-none focus:border-blue-400 text-center"
                    value={filters.entryShopOrders || ""}
                    onChange={(e) =>
                      onFilterChange("entryShopOrders", e.target.value)
                    }
                  />
                </td>
              )}

              <td className="p-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="w-full bg-emerald-50 border border-emerald-200 text-xs p-1.5 rounded 
                  outline-none focus:border-emerald-400 text-center"
                  value={filters.totalEntries || ""}
                  onChange={(e) =>
                    onFilterChange("totalEntries", e.target.value)
                  }
                />
              </td>

              {isL12 && (
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    className="w-full bg-emerald-50 border border-emerald-200 text-xs p-1.5 
                    rounded outline-none focus:border-emerald-400 text-center"
                    value={filters.totalBoxes || ""}
                    onChange={(e) =>
                      onFilterChange("totalBoxes", e.target.value)
                    }
                  />
                </td>
              )}

              <td className="p-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="w-full bg-orange-50 border border-orange-200 text-xs p-1.5 
                  rounded outline-none focus:border-orange-400 text-center"
                  value={filters.totalExits || ""}
                  onChange={(e) => onFilterChange("totalExits", e.target.value)}
                />
              </td>

              {isL12 && (
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 
                    rounded outline-none focus:border-blue-400 text-center"
                    value={filters.exitShopOrders || ""}
                    onChange={(e) =>
                      onFilterChange("exitShopOrders", e.target.value)
                    }
                  />
                </td>
              )}

              <td className="p-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="w-full bg-blue-50 border border-blue-200 text-xs p-1.5 
                  rounded outline-none focus:border-blue-400 text-center font-bold"
                  value={filters.stock || ""}
                  onChange={(e) => onFilterChange("stock", e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 
                  rounded outline-none"
                  value={filters.lastEntryDate || ""}
                  onChange={(e) =>
                    onFilterChange("lastEntryDate", e.target.value)
                  }
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 
                  rounded outline-none"
                  value={filters.lastExitDate || ""}
                  onChange={(e) =>
                    onFilterChange("lastExitDate", e.target.value)
                  }
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 
                  rounded outline-none"
                  value={filters.client || ""}
                  onChange={(e) => onFilterChange("client", e.target.value)}
                />
              </td>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={isL12 ? 10 : 7}
                  className="px-6 py-12 text-center text-slate-400 font-medium"
                >
                  Cargando Kárdex...
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.partNumber}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono font-bold text-slate-800">
                    {item.partNumber}
                  </td>

                  {isL12 && (
                    <td
                      className="px-4 py-3 text-xs text-slate-600 text-center truncate max-w-30"
                      title={item.entryShopOrders}
                    >
                      {item.entryShopOrders || "---"}
                    </td>
                  )}

                  <td
                    className="px-4 py-3 text-sm font-bold text-emerald-600 text-center 
                    bg-emerald-50/10"
                  >
                    {item.totalEntries}
                  </td>

                  {isL12 && (
                    <td
                      className="px-4 py-3 text-sm font-bold text-emerald-600 text-center 
                      bg-emerald-50/10"
                    >
                      {item.totalBoxes || "---"}
                    </td>
                  )}

                  <td
                    className="px-4 py-3 text-sm font-bold text-orange-600 text-center 
                    bg-orange-50/10"
                  >
                    {item.totalExits}
                  </td>

                  {isL12 && (
                    <td
                      className="px-4 py-3 text-xs text-slate-600 text-center truncate 
                      max-w-30"
                      title={item.exitShopOrders}
                    >
                      {item.exitShopOrders || "---"}
                    </td>
                  )}

                  <td
                    className="px-4 py-3 text-sm font-black text-blue-700 text-center 
                    bg-blue-50/30"
                  >
                    {item.stock}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-500">
                    {formatDate(item.lastEntryDate)}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-500">
                    {formatDate(item.lastExitDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded 
                      text-xs font-bold"
                    >
                      {item.client || "---"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div
        className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t 
        border-slate-200"
      >
        <span className="text-sm font-medium text-slate-500">
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
};
