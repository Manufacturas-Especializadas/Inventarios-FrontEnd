import { useState } from "react";
import { Search, PackageSearch, ArchiveX, RefreshCw } from "lucide-react";
import type { MicroChannelList } from "../../../types/Types";

interface ActiveContainersTableProps {
  containers: MicroChannelList[];
  isLoading: boolean;
  onSelectContainer: (code: string) => void;
}

export const ActiveContainersTable = ({
  containers,
  isLoading,
  onSelectContainer,
}: ActiveContainersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = containers.filter((item) =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const uniqueCodes = Array.from(new Set(filteredData.map((c) => c.code)));

  return (
    <section
      className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 
      shadow-sm flex flex-col overflow-hidden h-155"
    >
      <div
        className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col 
        md:flex-row md:items-center justify-between gap-3"
      >
        <h3
          className="font-bold text-slate-700 uppercase tracking-tight flex 
          items-center gap-2 text-sm"
        >
          <PackageSearch size={18} className="text-slate-400" /> Explorador de
          Contenedores Activos
        </h3>

        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar código activo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 
            rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none 
            placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Código
              </th>
              <th className="px-4 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Estatus Actual
              </th>
              <th className="px-4 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-16 text-center text-slate-400"
                >
                  <RefreshCw
                    size={26}
                    className="animate-spin mx-auto mb-3 text-blue-500"
                  />
                  <p className="text-sm font-semibold">
                    Cargando inventario activo...
                  </p>
                </td>
              </tr>
            ) : uniqueCodes.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-16 text-center text-slate-400"
                >
                  <ArchiveX size={30} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">
                    No hay contenedores activos que coincidan.
                  </p>
                </td>
              </tr>
            ) : (
              uniqueCodes.map((uniqueCode) => {
                const container = filteredData.find(
                  (c) => c.code === uniqueCode,
                );
                return (
                  <tr
                    key={uniqueCode}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800 text-sm">
                      {uniqueCode}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                        text-[10px] font-black tracking-wide bg-emerald-50 text-emerald-700 
                        border border-emerald-100"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        {container?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          onSelectContainer(uniqueCode);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700 
                        bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-lg transition-colors 
                        cursor-pointer"
                      >
                        Seleccionar para Baja
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
