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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BalanceTable } from "../../components/L10/BalanceTable";
import { EntryHistoryTable } from "../../components/L10/EntryHistoryTable";
import { EditTransactionModal } from "../../components/Modals/EditTransactionModal";
import { useL12Database, type TabType } from "../../hooks/useL12Database";
import Logo from "../../assets/logomesa.png";
import { ExitHistoryTable } from "../../components/L10/ExitHistoryTable";
import { ExitReportGenerator } from "./ExitReportGenerator";
import { TransitReportsTable } from "../../components/L10/TransitReportsTable";
import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { TabButton } from "../../components/TabButton/TabButton";

const LINE_ID = 11;

const PrintBarcode = ({ value }: { value: string }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        lineColor: "#000",
        width: 3,
        height: 100,
        displayValue: false,
        margin: 0,
      });
    }
  }, [value]);

  return (
    <div
      style={{
        transform: "scale(3.2, 2.8)",
        transformOrigin: "center",
        overflow: "hidden",
        height: "65mm",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        ref={svgRef}
        style={{
          width: "60mm",
          height: "24mm",
          display: "block",
        }}
      />
    </div>
  );
};

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
  } = useL12Database(LINE_ID);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setHistorySearch("");
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

      <div
        className="hidden print:block print:absolute print:top-0 print:left-0 
        print:w-full print:bg-white print:z-9999 print:m-0 print:p-0"
      >
        <style type="text/css" media="print">
          {`
            @page { 
              size: 400mm 300mm; 
              margin: 0mm;
            }

            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact;
            }
          `}
        </style>

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
              className="relative mx-auto bg-white print:break-after-page overflow-hidden"
              style={{
                width: "400mm",
                height: "250mm",
                padding: "12mm 20mm",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "8mm",
                }}
              >
                <div
                  style={{
                    fontSize: "20mm",
                    fontWeight: 800,
                    color: "#000",
                  }}
                >
                  {shopOrder}
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10mm",
                }}
              >
                <div
                  style={{
                    fontSize: "125mm",
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: "-4mm",
                    color: "#000",
                  }}
                >
                  {folioText}
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  paddingLeft: "25mm",
                  paddingRight: "25mm",
                  marginTop: "5mm",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <PrintBarcode value={String(folioString)} />
                </div>

                <img
                  src={Logo}
                  alt="logo"
                  style={{
                    width: "70mm",
                    objectFit: "contain",
                    marginBottom: "10mm",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
