import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import type { SyntheticEvent } from "react";

interface DeactivationFormProps {
  code: string;
  onChangeCode: (code: string) => void;
  reason: string;
  onChangeReason: (reason: string) => void;
  onSubmit: (e: SyntheticEvent) => void;
  isSubmitting: boolean;
}

export const DeactivationForm = ({
  code,
  onChangeCode,
  reason,
  onChangeReason,
  onSubmit,
  isSubmitting,
}: DeactivationFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col gap-5 
      sticky top-6"
    >
      <div className="flex items-center gap-2 text-red-600 mb-2">
        <Trash2 size={20} />
        <h3 className="font-bold uppercase tracking-wide text-sm">
          Desactivar Contenedor
        </h3>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
          Código del Contenedor
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => onChangeCode(e.target.value.replace(/'/g, "-"))}
          disabled={isSubmitting}
          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm 
          font-bold text-slate-800 uppercase outline-none focus:ring-2 focus:ring-red-500 
          transition-all placeholder:text-slate-300 placeholder:font-medium"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
          Motivo de Baja (Detallado)
        </label>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => onChangeReason(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm 
          font-medium text-slate-800 outline-none focus:ring-2 focus:ring-red-500 
          transition-all resize-none placeholder:text-slate-300"
        />
      </div>

      <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3 mt-1">
        <AlertTriangle size={24} className="text-red-500 shrink-0" />
        <p className="text-xs font-medium text-red-700 leading-relaxed">
          Al confirmar, el historial completo de este contenedor pasará a estado{" "}
          <strong>inactivo</strong>. Dejará de contabilizarse en los reportes de
          inventario y desaparecerá de los exploradores activos.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !code || !reason.trim()}
        className="w-full py-4 mt-2 bg-red-600 text-white font-bold rounded-xl shadow-lg 
        shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 
        disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <RefreshCw size={20} className="animate-spin" />
        ) : (
          <Trash2 size={20} />
        )}
        {isSubmitting ? "PROCESANDO BAJA..." : "CONFIRMAR BAJA DEFINITIVA"}
      </button>
    </form>
  );
};
