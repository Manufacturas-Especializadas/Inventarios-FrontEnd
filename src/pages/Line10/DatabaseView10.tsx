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
  Trash2,
  Edit2,
  History,
  ListTodo,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInventoryBalance } from "../../hooks/useInventoryBalance";
import { useExportExcel } from "../../hooks/useExportExcel";
import { useEntryHistory } from "../../hooks/useEntryHistory";
import { useExitHistory } from "../../hooks/useExitHistory";
import { useEntryMutations } from "../../hooks/useEntryMutations";
import { useExitMutations } from "../../hooks/useExitMutations";
import { formatDate } from "../../utils/formatDate";

const LINE_ID = 9;
const ITEMS_PER_PAGE = 10;

type TabType = "balance" | "entries" | "exits";

export const DatabaseView10 = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("balance");
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  const {
    balances,
    isLoading: loadingBalance,
    refetch: refetchBalance,
  } = useInventoryBalance(LINE_ID);
  const { exportData, isExporting } = useExportExcel();

  const {
    history: entryHistory,
    isLoading: loadingEntries,
    refetch: refetchEntries,
  } = useEntryHistory(LINE_ID);
  const {
    history: exitHistory,
    isLoading: loadingExits,
    refetch: refetchExits,
  } = useExitHistory(LINE_ID);

  const { deleteEntry, isProcessing: isDeletingEntry } = useEntryMutations();
  const { deleteExit, isProcessing: isDeletingExit } = useExitMutations();

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

  const [historySearch, setHistorySearch] = useState("");

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab, historySearch]);

  const handleGlobalRefetch = () => {
    if (activeTab === "balance") refetchBalance();
    if (activeTab === "entries") refetchEntries();
    if (activeTab === "exits") refetchExits();
  };

  const handleDeleteEntry = async (id: number) => {
    const success = await deleteEntry(id);
    if (success) {
      refetchEntries();
      refetchBalance();
    }
  };

  const handleDeleteExit = async (id: number) => {
    const success = await deleteExit(id);
    if (success) {
      refetchExits();
      refetchBalance();
    }
  };

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

  const filteredEntryHistory = useMemo(() => {
    if (!historySearch) return entryHistory;
    const lowerSearch = historySearch.toLowerCase();
    return entryHistory.filter(
      (ticket) =>
        ticket.id.toString().includes(lowerSearch) ||
        ticket.details.some((d) =>
          d.partNumber.toLowerCase().includes(lowerSearch),
        ),
    );
  }, [entryHistory, historySearch]);

  const filteredExitHistory = useMemo(() => {
    if (!historySearch) return exitHistory;
    const lowerSearch = historySearch.toLowerCase();
    return exitHistory.filter(
      (ticket) =>
        ticket.id.toString().includes(lowerSearch) ||
        ticket.details.some((d) =>
          d.partNumber.toLowerCase().includes(lowerSearch),
        ) ||
        ticket.shopOrder1?.toLowerCase().includes(lowerSearch) ||
        ticket.shopOrder2?.toLowerCase().includes(lowerSearch),
    );
  }, [exitHistory, historySearch]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 
          rounded-lg font-semibold hover:bg-emerald-100 transition-colors shadow-sm 
          hover:cursor-pointer"
        >
          <LogIn size={18} /> Ir a Entradas
        </button>
        <button
          onClick={() => navigate("/salidas-l10")}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 
          rounded-lg font-semibold hover:bg-orange-100 transition-colors shadow-sm 
          hover:cursor-pointer"
        >
          <LogOut size={18} /> Ir a Salidas
        </button>
      </div>

      <div
        className="flex items-center justify-between bg-white p-6 rounded-2xl 
        border border-slate-200 shadow-sm"
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
              Base de Datos L10
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Gestión y control de inventario
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "balance" && (
            <button
              onClick={() => exportData(LINE_ID, "LINEA 10")}
              disabled={loadingBalance || isExporting || balances.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 
              text-emerald-700 rounded-lg font-bold hover:bg-emerald-100 
              transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
              hover:cursor-pointer"
            >
              <Download
                size={18}
                className={isExporting ? "animate-bounce" : ""}
              />
              {isExporting ? "Exportando..." : "Exportar Excel"}
            </button>
          )}
          <button
            onClick={handleGlobalRefetch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 
            text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-all 
            active:scale-95 disabled:opacity-50 hover:cursor-pointer"
          >
            <RefreshCw size={18} /> Actualizar
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab("balance");
            setHistorySearch("");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${
            activeTab === "balance"
              ? "bg-white text-blue-600 border-t border-l border-r border-slate-200 -mb-px"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ListTodo size={18} /> Balance Consolidado
        </button>
        <button
          onClick={() => {
            setActiveTab("entries");
            setHistorySearch("");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${
            activeTab === "entries"
              ? "bg-white text-emerald-600 border-t border-l border-r border-slate-200 -mb-px"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <History size={18} /> Historial de Entradas
        </button>
        <button
          onClick={() => {
            setActiveTab("exits");
            setHistorySearch("");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${
            activeTab === "exits"
              ? "bg-white text-orange-600 border-t border-l border-r border-slate-200 -mb-px"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <History size={18} /> Historial de Salidas
        </button>
      </div>

      {(activeTab === "entries" || activeTab === "exits") && (
        <div
          className="bg-white p-4 border border-slate-200 rounded-2xl 
          shadow-sm flex items-center gap-3"
        >
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por número de parte, ID de ticket o Shop Order..."
            className="w-full outline-none text-sm font-medium text-slate-700 
            placeholder-slate-400"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
          />
        </div>
      )}

      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-sm 
        overflow-hidden flex flex-col rounded-tl-none"
      >
        {activeTab === "balance" && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-250">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">
                      No. Parte
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-emerald-600 uppercase text-center bg-emerald-50/50">
                      Entradas
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-orange-600 uppercase text-center bg-orange-50/50">
                      Salidas
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-blue-600 uppercase text-center bg-blue-50/50">
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
                        className="w-full bg-slate-50 border border-slate-200 
                        text-xs p-1.5 rounded outline-none focus:border-blue-400"
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
                        className="w-full bg-emerald-50 border border-emerald-200 
                        text-xs p-1.5 rounded outline-none focus:border-emerald-400 
                        text-center"
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
                        className="w-full bg-orange-50 border 
                        border-orange-200 text-xs p-1.5 rounded outline-none 
                        focus:border-orange-400 text-center"
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
                        className="w-full bg-blue-50 border border-blue-200 
                        text-xs p-1.5 rounded outline-none focus:border-blue-400 
                        text-center font-bold"
                        value={filters.stock}
                        onChange={(e) =>
                          handleFilterChange("stock", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        className="w-full bg-slate-50 border border-slate-200 
                        text-xs p-1.5 rounded outline-none"
                        value={filters.lastEntryDate}
                        onChange={(e) =>
                          handleFilterChange("lastEntryDate", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        className="w-full bg-slate-50 border border-slate-200 
                        text-xs p-1.5 rounded outline-none"
                        value={filters.lastExitDate}
                        onChange={(e) =>
                          handleFilterChange("lastExitDate", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        className="w-full bg-slate-50 border border-slate-200 
                        text-xs p-1.5 rounded outline-none"
                        value={filters.client}
                        onChange={(e) =>
                          handleFilterChange("client", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingBalance ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-400 font-medium"
                      >
                        Cargando Kárdex...
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
                          <span
                            className="px-2 py-1 bg-slate-100 text-slate-600 
                            rounded text-xs font-bold"
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
              className="flex items-center justify-between px-6 py-4 
              bg-slate-50 border-t border-slate-200"
            >
              <span className="text-sm font-medium text-slate-500">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-slate-300 rounded-lg 
                  hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-slate-300 rounded-lg 
                  hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "entries" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50 border-b border-emerald-100">
                  <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase w-24">
                    Ticket ID
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase w-40">
                    Fecha y Hora
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase">
                    Detalle de Piezas Ingresadas
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase text-right w-28">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingEntries ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400 font-medium"
                    >
                      Cargando Historial...
                    </td>
                  </tr>
                ) : filteredEntryHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400 font-medium"
                    >
                      No se encontraron tickets con esa búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredEntryHistory.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-bold text-slate-700">
                        #{entry.id}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-500">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {entry.details.map((d, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 
                              bg-emerald-100 border border-emerald-200 text-emerald-800 
                              rounded-md text-xs font-bold font-mono"
                            >
                              {d.partNumber}
                              <span
                                className="bg-white px-1.5 rounded text-emerald-600 
                                shadow-sm"
                              >
                                x{d.quantity}
                              </span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setEditingRecord({ type: "entry", data: entry })
                          }
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg 
                          hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={isDeletingEntry}
                          className="p-2 text-red-600 bg-red-50 rounded-lg 
                          hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "exits" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50 border-b border-orange-100">
                  <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase w-24">
                    Ticket ID
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase w-40">
                    Fecha y Hora
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase w-48">
                    Shop Orders
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase">
                    Detalle de Piezas Retiradas
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase text-right w-28">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingExits ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400 font-medium"
                    >
                      Cargando Historial...
                    </td>
                  </tr>
                ) : filteredExitHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400 font-medium"
                    >
                      No se encontraron tickets con esa búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredExitHistory.map((exit) => {
                    const sos = [
                      exit.shopOrder1,
                      exit.shopOrder2,
                      exit.shopOrder3,
                      exit.shopOrder4,
                      exit.shopOrder5,
                      exit.shopOrder6,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <tr
                        key={exit.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm font-bold text-slate-700">
                          #{exit.id}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-500">
                          {formatDate(exit.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600">
                          {sos}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {exit.details.map((d, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 
                                border border-orange-200 text-orange-800 rounded-md text-xs 
                                font-bold font-mono"
                              >
                                {d.partNumber}
                                <span className="bg-white px-1.5 rounded text-orange-600 shadow-sm">
                                  x{d.quantity}
                                </span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 flex justify-end gap-2">
                          <button
                            onClick={() =>
                              setEditingRecord({ type: "exit", data: exit })
                            }
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteExit(exit.id)}
                            disabled={isDeletingExit}
                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 
                            transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
