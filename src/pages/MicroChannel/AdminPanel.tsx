import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  ArrowLeft,
  Database,
  History,
  ArchiveX,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMicroChannel } from "../../hooks/usoMicroChannel";
import { DeactivationForm } from "./AdminPanelUI/DeactivationForm";
import { ActiveContainersTable } from "./AdminPanelUI/ActiveContainersTable";
import { HistoryTable } from "./AdminPanelUI/HistoryTable";

type AdminTab = "bajas" | "historial";

export const AdminPanel = () => {
  const navigate = useNavigate();
  const {
    deactivateContainer,
    fetchContainers,
    containersList,
    isLoadingList,
    isSubmitting,
  } = useMicroChannel();

  const [activeTab, setActiveTab] = useState<AdminTab>("bajas");
  const [codeToDeactivate, setCodeToDeactivate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  const activeContainers = containersList.filter((item) => item.isActive);
  const inactiveContainers = containersList.filter((item) => !item.isActive);

  const handleDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCode = codeToDeactivate.trim().toUpperCase();
    const finalReason = reason.trim().toUpperCase();

    if (
      !window.confirm(
        `⚠️ ESTÁS A PUNTO DE DAR DE BAJA EL CONTENEDOR:\n\n${finalCode}\n\n¿Estás completamente seguro? Esta acción apagará su historial y dejará de contarse en inventario.`,
      )
    ) {
      return;
    }

    const toastId = toast.loading("Procesando baja del sistema...");

    const result = await deactivateContainer({
      code: finalCode,
      reason: finalReason,
    });

    if (result.success) {
      toast.success(`Contenedor ${finalCode} desactivado correctamente.`, {
        id: toastId,
      });
      setCodeToDeactivate("");
      setReason("");
      fetchContainers();
    } else {
      toast.error(result.errorMessage || "Error al desactivar", {
        id: toastId,
        duration: 5000,
      });
    }
  };

  const renderTabButton = (
    id: AdminTab,
    label: string,
    Icon: React.ElementType,
  ) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2.5 px-5 py-3.5 border-b-2 font-bold text-sm transition-all cursor-pointer outline-none
          ${
            isActive
              ? "border-red-500 text-red-600 bg-red-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
      >
        <Icon
          size={18}
          className={isActive ? "text-red-500" : "text-slate-400"}
        />
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 select-none">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 
        border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center 
            justify-center shadow-sm"
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Panel de Administración
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Gestión y Auditoría de Bajas de Contenedores
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/base-de-datos-microchannel")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg 
            font-semibold hover:bg-slate-900 transition-colors shadow-sm cursor-pointer text-sm"
          >
            <Database size={17} /> Ver Base de Datos
          </button>
          <button
            onClick={() => navigate("/entradas-microchannel")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg 
            font-semibold hover:bg-blue-100 transition-colors shadow-sm cursor-pointer text-sm"
          >
            <ArrowLeft size={17} /> Volver a Entradas
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden 
        flex items-center"
      >
        {renderTabButton("bajas", "REALIZAR BAJAS", ArchiveX)}
        {renderTabButton(
          "historial",
          "HISTORIAL DE CONTENEDORES DESACTIVADOS",
          History,
        )}
      </div>

      {activeTab === "bajas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <section className="lg:col-span-1 space-y-4">
            <DeactivationForm
              code={codeToDeactivate}
              onChangeCode={setCodeToDeactivate}
              reason={reason}
              onChangeReason={setReason}
              onSubmit={handleDeactivate}
              isSubmitting={isSubmitting}
            />
          </section>

          <ActiveContainersTable
            containers={activeContainers}
            isLoading={isLoadingList}
            onSelectContainer={setCodeToDeactivate}
          />
        </div>
      )}

      {activeTab === "historial" && (
        <HistoryTable
          containers={inactiveContainers}
          isLoading={isLoadingList}
        />
      )}
    </div>
  );
};
