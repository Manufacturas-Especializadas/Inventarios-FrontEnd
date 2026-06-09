import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Database,
  RefreshCw,
  Box,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { microChannelService } from "../../api/services/MicroChannelService";
import type { MicroChannelList } from "../../types/Types";

export const DatabaseViewMicrochannel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MicroChannelList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await microChannelService.getList();
      setData(result);
    } catch (error: any) {
      toast.error("Error al cargar la base de datos.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredData = data.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    <div className="max-w-7xl mx-auto space-y-6 pb-20 select-none">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between 
        gap-4 pb-4 border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-slate-800 text-white flex 
            items-center justify-center shadow-sm"
          >
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Base de Datos
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Línea 6 - Historial de Separadores Microchannel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg 
            font-semibold hover:bg-slate-200 transition-colors shadow-sm active:scale-95"
            title="Actualizar datos"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => navigate("/entradas-microchannel")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg 
            font-semibold hover:bg-blue-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Volver a Entradas
          </button>
        </div>
      </div>

      <section
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm 
        flex items-center gap-4"
      >
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por código de contenedor (Ej. CONT-2026) o estatus..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
            focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
            transition-all font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
          <Box size={18} className="text-slate-400" />
          <span className="font-bold text-slate-600">
            {filteredData.length} Registros totales
          </span>
        </div>
      </section>

      <section
        className="bg-white rounded-2xl border border-slate-200 shadow-sm 
        overflow-hidden flex flex-col"
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th
                  className="px-6 py-4 text-xs font-black text-slate-400 
                  uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  className="px-6 py-4 text-xs font-black text-slate-400 
                  uppercase tracking-wider"
                >
                  Contenedor
                </th>
                <th
                  className="px-6 py-4 text-xs font-black text-slate-400 
                  uppercase tracking-wider"
                >
                  Estatus
                </th>
                <th
                  className="px-6 py-4 text-xs font-black text-slate-400 
                  uppercase tracking-wider"
                >
                  Fecha Entrada
                </th>
                <th
                  className="px-6 py-4 text-xs font-black text-slate-400 
                  uppercase tracking-wider"
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                          text-xs font-black tracking-wide ${
                            row.status === "ADENTRO"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {row.status === "ADENTRO" ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-2 text-sm font-medium 
                        text-slate-600"
                      >
                        <ArrowDownRight
                          size={16}
                          className="text-emerald-500"
                        />
                        {formatDate(row.entryDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-2 text-sm font-medium 
                        text-slate-600"
                      >
                        {row.exitDate ? (
                          <>
                            <ArrowUpRight
                              size={16}
                              className="text-orange-500"
                            />
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

        {!isLoading && filteredData.length > 0 && (
          <div
            className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex 
            items-center justify-between"
          >
            <span className="text-sm font-medium text-slate-500">
              Mostrando{" "}
              <span className="font-bold text-slate-700">
                {indexOfFirstItem + 1}
              </span>{" "}
              al{" "}
              <span className="font-bold text-slate-700">
                {Math.min(indexOfLastItem, filteredData.length)}
              </span>{" "}
              de{" "}
              <span className="font-bold text-slate-700">
                {filteredData.length}
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
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg 
                text-sm font-bold text-slate-700"
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
    </div>
  );
};
