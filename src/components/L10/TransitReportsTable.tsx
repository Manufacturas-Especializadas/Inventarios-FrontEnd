import { CheckCircle2, Clock, FileText, RefreshCcw } from "lucide-react";
import { useTransitReports } from "../../hooks/useTransitReports";

export const TransitReportsTable = ({ lineId }: { lineId: number }) => {
  const { logs, isLoading, fetchLogs } = useTransitReports(lineId);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium animate-pulse">
        Cargando folios en tránsito...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        className="p-12 text-center text-slate-500 bg-white border 
        border-slate-200 rounded-2xl shadow-sm"
      >
        <FileText
          size={48}
          className="mx-auto text-slate-300 mb-4 opacity-50"
        />
        <h3 className="text-lg font-bold text-slate-700">
          No hay reportes en tránsito
        </h3>
        <p className="text-sm mt-1">
          Los folios que imprimas aparecerán aquí hasta que sean surtidos.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl shadow-sm 
      overflow-hidden flex flex-col print:hidden animate-fade-in-up"
    >
      <div
        className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between 
        items-center"
      >
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          Seguimiento de Reportes Impresos
        </h3>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border 
          border-slate-200 text-slate-600 rounded-lg text-sm font-semibold 
          hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
        >
          <RefreshCcw size={16} /> Actualizar
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {logs.map((log) => {
          const totalFolios = log.details.length;
          const processedFolios = log.details.filter(
            (d) => d.isProcessed,
          ).length;
          const progressPercentage = Math.round(
            (processedFolios / totalFolios) * 100,
          );
          const isFullyProcessed = processedFolios === totalFolios;

          return (
            <div
              key={log.id}
              className={`p-6 transition-colors ${isFullyProcessed ? "bg-emerald-50/30" : "hover:bg-slate-50"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">
                    Reporte #{log.id}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">
                    Impreso: {new Date(log.printedAt).toLocaleString("es-MX")}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-slate-700">
                      {processedFolios} de {totalFolios} surtidos
                    </span>
                    {isFullyProcessed ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <Clock size={20} className="text-amber-500" />
                    )}
                  </div>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isFullyProcessed ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {log.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm 
                      font-bold border shadow-sm transition-colors
                      ${
                        detail.isProcessed
                          ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-600"
                      }
                    `}
                  >
                    {detail.isProcessed ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock size={14} className="text-slate-400" />
                    )}
                    Folio: {detail.folio}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
