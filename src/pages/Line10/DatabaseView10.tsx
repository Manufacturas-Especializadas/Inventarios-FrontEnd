import { useState, useMemo, useEffect } from "react";
import {
  LogIn,
  LogOut,
  RefreshCw,
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInventoryBalance } from "../../hooks/useInventoryBalance";
import { formatDate } from "../../utils/formatDate";
import { useExportExcel } from "../../hooks/useExportExcel";

const LINE_ID = 9;
const ITEMS_PER_PAGE = 10;

export const DatabaseView10 = () => {
  const navigate = useNavigate();
  const { balances, isLoading, refetch } = useInventoryBalance(LINE_ID);
  const { exportData, isExporting } = useExportExcel();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    partNumber: "",
    client: "",
    totalEntries: "",
    totalExits: "",
    stock: "",
    lastEntryDate: "",
    lastExitDate: "",
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredData = useMemo(() => {
    return balances.filter((item) => {
      const matchPart = item.partNumber
        .toLowerCase()
        .includes(filters.partNumber.toLowerCase());
      const matchClient = (item.client || "")
        .toLowerCase()
        .includes(filters.client.toLowerCase());
      const matchEntries = item.totalEntries
        .toString()
        .includes(filters.totalEntries);
      const matchExits = item.totalExits
        .toString()
        .includes(filters.totalExits);
      const matchStock = item.stock.toString().includes(filters.stock);
      const matchLastEntry = formatDate(item.lastEntryDate).includes(
        filters.lastEntryDate,
      );
      const matchLastExit = formatDate(item.lastExitDate).includes(
        filters.lastExitDate,
      );

      return (
        matchPart &&
        matchClient &&
        matchEntries &&
        matchExits &&
        matchStock &&
        matchLastEntry &&
        matchLastExit
      );
    });
  }, [balances, filters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg 
          font-semibold hover:bg-blue-100 transition-colors shadow-sm hover:cursor-pointer"
        >
          <LogIn size={18} /> Ir a Entradas
        </button>
        <button
          onClick={() => navigate("/salidas-l10")}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 
          rounded-lg font-semibold hover:bg-orange-100 transition-colors shadow-sm hover:cursor-pointer"
        >
          <LogOut size={18} /> Ir a Salidas
        </button>
      </div>

      <div
        className="flex items-center justify-between bg-white p-6 rounded-2xl border 
        border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center 
            text-white"
          >
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Base de Datos
            </h2>
            <p className="text-sm font-medium text-slate-500">
              LÍNEA 10 - Balance de Inventario
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportData(LINE_ID, "LINEA 10")}
            disabled={isLoading || isExporting || balances.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 
            rounded-lg font-bold hover:bg-emerald-100 transition-all active:scale-95 
            disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            <Download
              size={18}
              className={isExporting ? "animate-bounce" : ""}
            />
            {isExporting ? "Exportando..." : "Exportar Excel"}
          </button>

          <button
            onClick={refetch}
            disabled={isLoading || isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 
            rounded-lg font-bold hover:bg-slate-200 transition-all active:scale-95 
            disabled:opacity-50 hover:cursor-pointer"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>
      </div>

      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden 
        flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  No. Parte
                </th>
                <th
                  className="px-4 py-4 text-xs font-bold text-emerald-600 uppercase tracking-wider 
                  text-center bg-emerald-50/50"
                >
                  Entradas
                </th>
                <th
                  className="px-4 py-4 text-xs font-bold text-orange-600 uppercase tracking-wider 
                  text-center bg-orange-50/50"
                >
                  Salidas
                </th>
                <th
                  className="px-4 py-4 text-xs font-bold text-blue-600 uppercase tracking-wider 
                  text-center bg-blue-50/50"
                >
                  Restante
                </th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Última Entrada
                </th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Última Salida
                </th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                    value={filters.partNumber}
                    onChange={(e) =>
                      handleFilterChange("partNumber", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    className="w-full bg-emerald-50 border border-emerald-200 text-xs p-1.5 rounded 
                    outline-none focus:border-emerald-400 text-center"
                    value={filters.totalEntries}
                    onChange={(e) =>
                      handleFilterChange("totalEntries", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    className="w-full bg-orange-50 border border-orange-200 text-xs p-1.5 rounded 
                    outline-none focus:border-orange-400 text-center"
                    value={filters.totalExits}
                    onChange={(e) =>
                      handleFilterChange("totalExits", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    className="w-full bg-blue-50 border border-blue-200 text-xs p-1.5 rounded 
                    outline-none focus:border-blue-400 text-center font-bold"
                    value={filters.stock}
                    onChange={(e) =>
                      handleFilterChange("stock", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar fecha..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 rounded 
                    outline-none focus:border-blue-400"
                    value={filters.lastEntryDate}
                    onChange={(e) =>
                      handleFilterChange("lastEntryDate", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar fecha..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 rounded 
                    outline-none focus:border-blue-400"
                    value={filters.lastExitDate}
                    onChange={(e) =>
                      handleFilterChange("lastExitDate", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Filtrar cliente..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-1.5 rounded 
                    outline-none focus:border-blue-400"
                    value={filters.client}
                    onChange={(e) =>
                      handleFilterChange("client", e.target.value)
                    }
                  />
                </td>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    Cargando base de datos...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400 font-medium flex flex-col 
                    items-center gap-2 mx-auto"
                  >
                    <Search size={32} className="text-slate-300" />
                    No se encontraron resultados con los filtros actuales.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.partNumber}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono font-bold text-slate-800">
                      {item.partNumber}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-600 text-center bg-emerald-50/10">
                      {item.totalEntries}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-orange-600 text-center bg-orange-50/10">
                      {item.totalExits}
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-blue-700 text-center bg-blue-50/30">
                      {item.stock}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                      {formatDate(item.lastEntryDate)}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                      {formatDate(item.lastExitDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                        {item.client || "---"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredData.length > 0 && (
          <div
            className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t 
            border-slate-200"
          >
            <span className="text-sm font-medium text-slate-500">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} de{" "}
              {filteredData.length} registros
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 
                hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm font-bold text-slate-700 px-4">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 
                hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
