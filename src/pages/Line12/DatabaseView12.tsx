import {
  Database,
  Download,
  History,
  ListTodo,
  LogIn,
  LogOut,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BalanceTable } from "../../components/L10/BalanceTable";
import { EntryHistoryTable } from "../../components/L10/EntryHistoryTable";
import { EditTransactionModal } from "../../components/Modals/EditTransactionModal";
import { useL12Database } from "../../hooks/useL12Database";
import Barcode from "react-barcode";
import Logo from "../../assets/logomesa.png";

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
  } = useL12Database(LINE_ID);

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6 pb-20 print:hidden">
        <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
          <button
            onClick={() => navigate("/entradas-linea-12")}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600
          rounded-lg font-semibold hover:bg-emerald-100 transition-colors shadow-sm
          hover:cursor-pointer"
          >
            <LogIn size={18} />
            Ir a Entradas
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600
          rounded-lg font-semibold hover:bg-olive-100 transition-colors shadow-sm
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
                Base de Datos L12
              </h2>
              <p className="text-sm font-black text-slate-500">
                Gestión y control de inventario
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700
            rounded-lg font-bold hover:bg-slate-200 transition-all active:scale-95
            disabled:opacity-50 hover:cursor-pointer"
            >
              <RefreshCcw size={18} /> Actualizar
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab("balance");
              setHistorySearch("");
            }}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-2xl
              transition-all ${
                activeTab === "balance"
                  ? "bg-white text-blue-600 border-t border-r border-slate-200 -mb-px"
                  : "text-slate-500 hover:bg-slate-50"
              }
            `}
          >
            <ListTodo size={18} /> Balance Consolidado
          </button>
          <button
            onClick={() => {
              setActiveTab("entries");
              setHistorySearch("");
            }}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all
              ${
                activeTab === "entries"
                  ? "bg-white text-emerald-600 border-t border-l border-r border-slate-200 -mb-px"
                  : "text-slate-500 hover:bg-slate-50"
              }
            `}
          >
            <History size={18} /> Historial de Entradas
          </button>
          <button
            onClick={() => {
              setActiveTab("exits");
              setHistorySearch("");
            }}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all
              ${
                activeTab === "exits"
                  ? "bg-white text-orange-600 border-t border-l border-r border-slate-200 -mb-px"
                  : "text-slate-500 hover:bg-slate-50"
              }
            `}
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
              placeholder="Buscar por número de parte, ID de ticket o Shop Order"
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

      <div
        className="hidden print:block print:absolute print:top-0 print:left-0 
        print:w-full print:bg-white print:z-9999 print:py-8"
      >
        {foliosToPrint.map((item: any, index) => {
          let rawFolio: any = item.folio || item;
          if (typeof rawFolio === "string" && rawFolio.startsWith("{")) {
            try {
              rawFolio = JSON.parse(rawFolio);
            } catch (e) {}
          }
          const folioString =
            typeof rawFolio === "object" && rawFolio !== null
              ? rawFolio.id || rawFolio.folio
              : rawFolio;
          const shopOrder = item.shopOrder || "";
          const folioText = String(folioString).split("-").pop();

          return (
            <div
              key={index}
              className="relative w-[120mm] h-[65mm] mx-auto mb-12 flex items-center justify-between 
              p-8 pt-10 bg-white text-black border-2 border-dashed border-gray-400 rounded-xl 
              print:break-inside-avoid"
            >
              <div
                className="absolute top-4 left-8 text-sm font-bold text-slate-500 
                uppercase tracking-widest"
              >
                <span className="text-black text-lg">{shopOrder}</span>
              </div>

              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Barcode
                  value={String(folioString)}
                  width={2.2}
                  height={50}
                  fontSize={16}
                  font="monospace"
                  textMargin={6}
                  margin={0}
                  displayValue={true}
                />
                <img
                  src={Logo}
                  alt="Logo MESA"
                  className="h-8 object-contain mt-1 grayscale"
                />
              </div>
              <div className="flex-1 flex justify-end items-center pr-2">
                <span
                  className="text-[4.5rem] font-black leading-none text-black 
                  tracking-tighter"
                >
                  {folioText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
