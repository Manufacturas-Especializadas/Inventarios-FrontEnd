import {
  Database,
  Download,
  History,
  ListTodo,
  LogIn,
  LogOut,
  RefreshCcw,
  Search,
  ClipboardList,
  Package,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BalanceTable } from "../../components/L10/BalanceTable";
import { EntryHistoryTable } from "../../components/L10/EntryHistoryTable";
import { EditTransactionModal } from "../../components/Modals/EditTransactionModal";
import { useL12Database, type TabType } from "../../hooks/useL12Database";
import { ExitHistoryTable } from "../../components/L10/ExitHistoryTable";
import { ExitReportGenerator } from "./ExitReportGenerator";
import { TransitReportsTable } from "../../components/L10/TransitReportsTable";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { TabButton } from "../../components/TabButton/TabButton";
import { PrintLayout12 } from "../../layouts/PrintLayout12/PrintLayout12";
import { FtnInventortTable } from "../../components/L10/FtnInventortTable";
import { useRef, type ChangeEvent } from "react";

const LINE_ID = 11;

export const DatabaseView12 = () => {
  const navigate = useNavigate();

  const {
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
    handleReprint,
    foliosToPrint,
    selectedEntries,
    handleToggleSelect,
    handleToggleSelectAll,
    handleBulkReprint,
    filteredExitHistory,
    isDeletingExit,
    handleDeleteExit,
    ftnBalance,
    loadingFtn,
    isReconciling,
    handleReconcileFtn,
  } = useL12Database(LINE_ID);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setHistorySearch("");
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleReconcileFtn(file);
      e.target.value = "";
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
          <ActionButton
            onClick={() => navigate("/entradas-linea-12")}
            icon={<LogIn size={18} />}
            label="Ir a entradas"
            variant="emerald"
          />
          <ActionButton
            onClick={() => navigate("/salidas-l12")}
            icon={<LogOut size={18} />}
            label="Ir a salidas"
            variant="orange"
          />
        </div>

        <div
          className="flex items-center justify-between bg-white p-6 rounded-2xl
        border border-slate-200 shadow-sm print:hidden"
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
                Base de Datos L12
              </h2>
              <p className="text-sm font-black text-slate-500">
                Gestión y control de inventario
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={onFileChange}
            />
            {activeTab === "ftn" && (
              <ActionButton
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingFtn || isReconciling}
                icon={
                  <Upload
                    size={18}
                    className={isReconciling ? "animate-bounce" : ""}
                  />
                }
                label={isReconciling ? "Procesando..." : "Subir archivo"}
                variant="emerald"
              />
            )}

            {activeTab === "balance" && (
              <button
                onClick={() => exportData(LINE_ID, "LINEA 12")}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700
              rounded-lg font-bold hover:bg-emerald-100 transition-all active:scale-95
              disabled:opacity-50 hover:cursor-pointer"
              >
                <Download
                  size={18}
                  className={isExporting ? "animate-bounce" : ""}
                />
                {isExporting ? "Exportando..." : "Exportar Excel"}
              </button>
            )}

            <ActionButton
              onClick={() => {}}
              icon={<RefreshCcw size={18} />}
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
          <TabButton
            isActive={activeTab === "ftn"}
            onClick={() => handleTabChange("ftn")}
            icon={<Package size={18} />}
            label="Inventario FTN"
            activeColorClass="text-purple-600"
          />
          <TabButton
            isActive={activeTab === "reports"}
            onClick={() => handleTabChange("reports")}
            icon={<ListTodo size={18} />}
            label="Generar Reportes"
            activeColorClass="text-indigo-600"
          />
          <TabButton
            isActive={activeTab === "transit"}
            onClick={() => handleTabChange("transit")}
            icon={<ClipboardList size={18} />}
            label="Folios en Tránsito"
            activeColorClass="text-cyan-600"
          />
        </div>

        {(activeTab === "entries" || activeTab === "exits") && (
          <div
            className="bg-white p-4 border border-slate-200 rounded-2xl 
            shadow-sm flex items-center gap-3 print:hidden"
          >
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por número de parte, ID de ticket o Shop Order"
              className="w-full outline-none text-sm font-medium text-slate-700"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
            />
          </div>
        )}

        <div
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden 
          print:overflow-visible print:border-none print:shadow-none flex flex-col rounded-tl-none"
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
              lineId={11}
            />
          )}

          {activeTab === "entries" && (
            <EntryHistoryTable
              data={filteredEntryHistory}
              isLoading={loadingEntries}
              onEdit={(entry) =>
                setEditingRecord({ type: "entry", data: entry })
              }
              onDelete={handleDeleteEntry}
              isDeleting={isDeletingEntry}
              onReprint={handleReprint}
              showCheckboxes={true}
              selectedEntries={selectedEntries}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onBulkPrint={handleBulkReprint}
              showShopOrder={true}
              folio={true}
            />
          )}

          {activeTab === "exits" && (
            <ExitHistoryTable
              data={filteredExitHistory}
              isDeleting={isDeletingExit}
              onEdit={(exit) => setEditingRecord({ type: "exit", data: exit })}
              onDelete={handleDeleteExit}
              isLoading={isDeletingExit}
            />
          )}

          {activeTab === "ftn" && (
            <FtnInventortTable data={ftnBalance} isLoading={loadingFtn} />
          )}

          {activeTab === "reports" && (
            <ExitReportGenerator
              availableExits={filteredEntryHistory
                .filter((entry: any) => {
                  const qty =
                    entry.currentQuantity ||
                    entry.CurrentQuantity ||
                    entry.quantity ||
                    entry.Quantity ||
                    entry.details?.[0]?.currentQuantity ||
                    entry.Details?.[0]?.CurrentQuantity ||
                    entry.details?.[0]?.quantity ||
                    entry.Details?.[0]?.Quantity ||
                    0;

                  return Number(qty) > 0;
                })
                .map((entry: any) => ({
                  id: String(entry.id || entry.Id || ""),
                  folio: String(entry.folio || entry.Folio || ""),
                  shopOrder:
                    entry.shopOrder ||
                    entry.ShopOrder ||
                    entry.shopOrder1 ||
                    entry.ShopOrder1 ||
                    "",
                  partNumber:
                    entry.partNumber ||
                    entry.PartNumber ||
                    entry.details?.[0]?.partNumber ||
                    entry.Details?.[0]?.PartNumber ||
                    "",
                  quantity:
                    entry.currentQuantity ||
                    entry.CurrentQuantity ||
                    entry.quantity ||
                    entry.Quantity ||
                    entry.details?.[0]?.currentQuantity ||
                    entry.Details?.[0]?.CurrentQuantity ||
                    entry.details?.[0]?.quantity ||
                    entry.Details?.[0]?.Quantity ||
                    0,
                }))}
            />
          )}

          {activeTab === "transit" && <TransitReportsTable lineId={LINE_ID} />}
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
      <PrintLayout12 foliosToPrint={foliosToPrint} />
    </>
  );
};
