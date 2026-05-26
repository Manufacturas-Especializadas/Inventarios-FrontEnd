import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useEntryHistory } from "../../hooks/useEntryHistory";
import { useEntryMutations } from "../../hooks/useEntryMutations";
import { useExitHistory } from "../../hooks/useExitHistory";
import { useExitMutations } from "../../hooks/useExitMutations";
import { useExportExcel } from "../../hooks/useExportExcel";
import { useInventoryBalance } from "../../hooks/useInventoryBalance";
import {
  LogIn,
  LogOut,
  Database,
  Download,
  RefreshCw,
  ListTodo,
  Search,
  History,
} from "lucide-react";
import { ActionButton } from "../ActionButton/ActionButton";
import { BalanceTable } from "../L10/BalanceTable";
import { EntryHistoryTable } from "../L10/EntryHistoryTable";
import { ExitHistoryTable } from "../L10/ExitHistoryTable";
import { EditTransactionModal } from "../Modals/EditTransactionModal";
import { TabButton } from "../TabButton/TabButton";
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import { formatDate } from "../../utils/formatDate";

const ITEMS_PER_PAGE = 10;
type TabType = "balance" | "entries" | "exits";

interface Props {
  lineId: number;
  lineName: string;
  entryUrl: string;
  exitUrl: string;
}

export const GenericDatabaseView = ({
  lineId,
  lineName,
  entryUrl,
  exitUrl,
}: Props) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("balance");
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  const {
    balances,
    isLoading: loadingBalance,
    refetch: refetchBalance,
  } = useInventoryBalance(lineId);
  const { exportData, isExporting } = useExportExcel();

  const {
    history: entryHistory,
    isLoading: loadingEntries,
    refetch: refetchEntries,
  } = useEntryHistory(lineId);
  const {
    history: exitHistory,
    isLoading: loadingExits,
    refetch: refetchExits,
  } = useExitHistory(lineId);

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

  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");

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
      const formattedEntryDate = item.lastEntryDate
        ? formatDate(item.lastEntryDate).toLowerCase()
        : "";

      const formattedExitDate = item.lastExitDate
        ? formatDate(item.lastExitDate).toLowerCase()
        : "";

      return (
        item.partNumber
          .toLowerCase()
          .includes(filters.partNumber.toLowerCase()) &&
        (item.client || "")
          .toLowerCase()
          .includes(filters.client.toLowerCase()) &&
        item.totalEntries.toString().includes(filters.totalEntries) &&
        item.totalExits.toString().includes(filters.totalExits) &&
        item.stock.toString().includes(filters.stock) &&
        formattedEntryDate.includes(filters.lastEntryDate.toLowerCase()) &&
        formattedExitDate.includes(filters.lastExitDate.toLowerCase())
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setHistorySearch("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        <ActionButton
          onClick={() => navigate(entryUrl)}
          icon={<LogIn size={18} />}
          label="Ir a Entradas"
          variant="emerald"
        />
        <ActionButton
          onClick={() => navigate(exitUrl)}
          icon={<LogOut size={18} />}
          label="Ir a Salidas"
          variant="orange"
        />
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
              Base de Datos {lineName}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Gestión y control de inventario
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === "balance" && (
            <div className="flex flex-col sm:flex-row items-center gap-3 mr-2">
              <DateRangePicker
                startDate={reportStartDate}
                endDate={reportEndDate}
                onStartDateChange={setReportStartDate}
                onEndDateChange={setReportEndDate}
                onClear={() => {
                  setReportStartDate("");
                  setReportEndDate("");
                }}
                disabled={loadingBalance || isExporting}
              />

              <ActionButton
                onClick={() =>
                  exportData(lineId, lineName, reportStartDate, reportEndDate)
                }
                disabled={
                  loadingBalance || isExporting || balances.length === 0
                }
                icon={
                  <Download
                    size={18}
                    className={isExporting ? "animate-bounce" : ""}
                  />
                }
                label={isExporting ? "Exportando..." : "Exportar Excel"}
                variant="emerald"
              />
            </div>
          )}
          <ActionButton
            onClick={handleGlobalRefetch}
            icon={<RefreshCw size={18} />}
            label="Actualizar"
            variant="slate"
          />
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <TabButton
          isActive={activeTab === "balance"}
          onClick={() => handleTabChange("balance")}
          icon={<ListTodo size={18} />}
          label="Balance Consolidado"
          activeColorClass="text-blue-600"
        />
        <TabButton
          isActive={activeTab === "entries"}
          onClick={() => handleTabChange("entries")}
          icon={<History size={18} />}
          label="Historial de Entradas"
          activeColorClass="text-emerald-600"
        />
        <TabButton
          isActive={activeTab === "exits"}
          onClick={() => handleTabChange("exits")}
          icon={<History size={18} />}
          label="Historial de Salidas"
          activeColorClass="text-orange-600"
        />
      </div>

      {(activeTab === "entries" || activeTab === "exits") && (
        <div
          className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm flex 
          items-center gap-3"
        >
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

      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden 
        flex flex-col rounded-tl-none"
      >
        {activeTab === "balance" && (
          <BalanceTable
            data={paginatedData}
            isLoading={loadingBalance}
            filters={filters}
            onFilterChange={handleFilterChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            lineId={lineId}
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
