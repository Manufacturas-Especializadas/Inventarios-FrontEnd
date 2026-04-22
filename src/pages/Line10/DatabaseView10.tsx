import { useState, useMemo, useEffect } from "react";
import {
  LogIn,
  LogOut,
  RefreshCw,
  Database,
  Search,
  Download,
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
import { EditTransactionModal } from "../../components/Modals/EditTransactionModal";
import { BalanceTable } from "../../components/L10/BalanceTable";
import { EntryHistoryTable } from "../../components/L10/EntryHistoryTable";
import { ExitHistoryTable } from "../../components/L10/ExitHistoryTable";

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

  const handleFilterChange = (field: string, value: string) => {
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
    if (await deleteEntry(id)) {
      refetchEntries();
      refetchBalance();
    }
  };

  const handleDeleteExit = async (id: number) => {
    if (await deleteExit(id)) {
      refetchExits();
      refetchBalance();
    }
  };

  const filteredData = useMemo(() => {
    return balances.filter((item) => {
      return (
        item.partNumber
          .toLowerCase()
          .includes(filters.partNumber.toLowerCase()) &&
        (item.client || "")
          .toLowerCase()
          .includes(filters.client.toLowerCase()) &&
        item.totalEntries.toString().includes(filters.totalEntries) &&
        item.totalExits.toString().includes(filters.totalExits) &&
        item.stock.toString().includes(filters.stock)
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
          rounded-lg font-semibold hover:bg-emerald-100 transition-colors shadow-sm"
        >
          <LogIn size={18} /> Ir a Entradas
        </button>
        <button
          onClick={() => navigate("/salidas-l10")}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 
          rounded-lg font-semibold hover:bg-orange-100 transition-colors shadow-sm"
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
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 
              rounded-lg font-bold hover:bg-emerald-100 transition-all active:scale-95 
              disabled:opacity-50"
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
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 
            rounded-lg font-bold hover:bg-slate-200 transition-all active:scale-95 
            disabled:opacity-50"
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
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl 
            transition-all ${
              activeTab === "balance"
                ? "bg-white text-blue-600 border-t border-l border-r border-slate-200 -mb-px"
                : "text-slate-500 hover:bg-slate-50"
            }`}
        >
          <ListTodo size={18} /> Balance Consolidado
        </button>
        <button
          onClick={() => {
            setActiveTab("entries");
            setHistorySearch("");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === "entries" ? "bg-white text-emerald-600 border-t border-l border-r border-slate-200 -mb-px" : "text-slate-500 hover:bg-slate-50"}`}
        >
          <History size={18} /> Historial de Entradas
        </button>
        <button
          onClick={() => {
            setActiveTab("exits");
            setHistorySearch("");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === "exits" ? "bg-white text-orange-600 border-t border-l border-r border-slate-200 -mb-px" : "text-slate-500 hover:bg-slate-50"}`}
        >
          <History size={18} /> Historial de Salidas
        </button>
      </div>

      {(activeTab === "entries" || activeTab === "exits") && (
        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por número de parte, ID de ticket o Shop Order..."
            className="w-full outline-none text-sm font-medium text-slate-700"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
          />
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col rounded-tl-none">
        {activeTab === "balance" && (
          <BalanceTable
            data={paginatedData}
            isLoading={loadingBalance}
            filters={filters}
            onFilterChange={handleFilterChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            lineId={9}
          />
        )}
        {activeTab === "entries" && (
          <EntryHistoryTable
            data={filteredEntryHistory}
            isLoading={loadingEntries}
            onEdit={(entry) => setEditingRecord({ type: "entry", data: entry })}
            onDelete={handleDeleteEntry}
            isDeleting={isDeletingEntry}
          />
        )}
        {activeTab === "exits" && (
          <ExitHistoryTable
            data={filteredExitHistory}
            isLoading={loadingExits}
            onEdit={(exit) => setEditingRecord({ type: "exit", data: exit })}
            onDelete={handleDeleteExit}
            isDeleting={isDeletingExit}
          />
        )}
      </div>

      <EditTransactionModal
        isOpen={editingRecord !== null}
        onClose={() => setEditingRecord(null)}
        record={editingRecord}
        onSuccess={() => {
          handleGlobalRefetch();
          setEditingRecord(null);
        }}
      />
    </div>
  );
};
