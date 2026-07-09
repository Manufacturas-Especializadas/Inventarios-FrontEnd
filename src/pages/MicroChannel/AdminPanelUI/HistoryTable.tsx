import { useState } from "react";
import { Search, History, RefreshCw } from "lucide-react";
import type { MicroChannelList } from "../../../types/Types";

interface HistoryTableProps {
  containers: MicroChannelList[];
  isLoading: boolean;
}

export const HistoryTable = ({ containers, isLoading }: HistoryTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = containers.filter((item) =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const uniqueCodes = Array.from(new Set(filteredData.map((c) => c.code)));

  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col 
      overflow-hidden animate-fade-in min-h-125"
    >
      <div
        className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col 
        md:flex-row md:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center 
            justify-center"
          >
            <History size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-tight text-sm">
              Contenedores Fuera de Servicio
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Registros históricos desactivados lógicamente
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar en el historial por código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 
            rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none 
            placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="border-b border-slate-200">
              <th
                className="w-1/4 px-5 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                Código
              </th>
              <th
                className="w-1/4 px-4 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                Descripción
              </th>
              <th
                className="w-2/4 px-5 py-4 text-xs font-black text-slate-400 uppercase 
                tracking-wider"
              >
                Motivo de la Baja
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-20 text-center text-slate-400"
                >
                  <RefreshCw
                    size={26}
                    className="animate-spin mx-auto mb-3 text-red-500"
                  />
                  <p className="text-sm font-semibold">
                    Cargando historial de bajas...
                  </p>
                </td>
              </tr>
            ) : uniqueCodes.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-20 text-center text-slate-400"
                >
                  <History size={30} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">
                    No hay registros de contenedores desactivados.
                  </p>
                </td>
              </tr>
            ) : (
              uniqueCodes.map((uniqueCode) => {
                const container = filteredData.find(
                  (c) => c.code === uniqueCode,
                );

                let typeColor = "border-l-slate-300";
                if (uniqueCode.startsWith("CONT-"))
                  typeColor = "border-l-slate-400";
                if (uniqueCode.startsWith("CTNA-"))
                  typeColor = "border-l-orange-400";
                if (uniqueCode.startsWith("CTAZ-"))
                  typeColor = "border-l-blue-400";

                return (
                  <tr
                    key={uniqueCode}
                    className={`hover:bg-red-50/30 transition-colors border-l-4 ${typeColor}`}
                  >
                    <td className="px-5 py-4 font-mono font-bold text-slate-800 text-sm">
                      {uniqueCode}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-600 uppercase">
                      {container?.description.replace("CONTENEDOR ", "")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-inner">
                        <p className="text-xs font-bold text-red-700 leading-relaxed uppercase">
                          {container?.reasonForDeactivation ||
                            "SIN MOTIVO ESPECIFICADO EN BD"}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white text-right">
        <p className="text-xs font-medium text-slate-400">
          Total de contenedores únicos fuera de servicio:{" "}
          <strong>{uniqueCodes.length}</strong>
        </p>
      </div>
    </section>
  );
};
