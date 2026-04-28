import { useEffect, useMemo, useState } from "react";
import { useInventoryBalance } from "./useInventoryBalance";
import { useExportExcel } from "./useExportExcel";
import { useEntryHistory } from "./useEntryHistory";
import { useExitHistory } from "./useExitHistory";
import { useEntryMutations } from "./useEntryMutations";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;
export type TabType = "balance" | "entries" | "exits";

export const useL12Database = (lineId: number) => {
  const [activeTab, setActiveTab] = useState<TabType>("balance");
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  const [foliosToPrint, setFoliosToPrint] = useState<any[]>([]);

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

  const { refetch: refetchExits } = useExitHistory(lineId);

  const { deleteEntry, isProcessing: isDeletingEntry } = useEntryMutations();

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

  const handleReprint = (folio: string, shopOrder: string) => {
    if (!folio) {
      toast.error("Este registro no tiene un folio asignado.");
      return;
    }

    toast.dismiss();

    setFoliosToPrint([{ folio: folio, shopOrder: shopOrder }]);

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setFoliosToPrint([]);
      }, 3000);
    }, 200);
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
        ticket.folio?.toLowerCase().includes(lowerSearch) ||
        ticket.details.some((d) =>
          d.partNumber.toLowerCase().includes(lowerSearch),
        ),
    );
  }, [entryHistory, historySearch]);

  return {
    activeTab,
    setActiveTab,
    editingRecord,
    setEditingRecord,
    currentPage,
    setCurrentPage,
    filters,
    handleFilterChange,
    historySearch,
    setHistorySearch,
    loadingBalance,
    exportData,
    isExporting,
    loadingEntries,
    isDeletingEntry,
    handleGlobalRefetch,
    handleDeleteEntry,
    totalPages,
    paginatedData,
    filteredEntryHistory,
    foliosToPrint,
    handleReprint,
  };
};
