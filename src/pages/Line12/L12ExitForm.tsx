import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  LogIn,
  DatabaseIcon,
} from "lucide-react";
import { useL12ExitForm } from "../../hooks/useL12ExitForm";

export const L12ExitForm = () => {
  const navigate = useNavigate();
  const {
    folios,
    folioDetails,
    isProcessing,
    handleFolioChange,
    handleKeyDown,
    handleAddRow,
    handleRemoveRow,
    handleSubmit,
    inputRefs,
  } = useL12ExitForm();

  const currentDate = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [inputRefs]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate("/entradas-linea-12")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg 
          font-semibold hover:bg-blue-100 transition-colors shadow-sm
          hover:cursor-pointer"
        >
          <LogIn size={18} /> Ir a Entradas
        </button>
        <button
          onClick={() => navigate("/base-de-datos-l12")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg 
          font-semibold hover:bg-slate-900 transition-colors shadow-sm
          hover:cursor-pointer"
        >
          <DatabaseIcon size={18} /> Base de Datos
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              FECHA
            </label>
            <input
              type="text"
              readOnly
              value={currentDate}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg 
              text-slate-700 font-medium outline-none cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              LÍNEA
            </label>
            <input
              type="text"
              readOnly
              value="LINEA 12"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg 
              text-slate-700 font-medium outline-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 pb-2">
        <button
          onClick={() => navigate("/entradas-linea-12")}
          className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center 
          text-white hover:bg-orange-600 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={3} />
        </button>
        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
          SALIDA DE FOLIOS
        </h2>
      </div>

      <div className="space-y-4">
        {folios.map((folio, index) => {
          const info = folioDetails[index];

          return (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex 
              flex-col md:flex-row md:items-end gap-4 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="w-full md:w-64 space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  FOLIO ESCANEADO
                </label>
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  autoComplete="off"
                  disabled={isProcessing}
                  value={folio}
                  onChange={(e) => handleFolioChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="Escanear folio..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 
                  rounded-lg text-slate-700 font-mono font-bold outline-none 
                  focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 
                  transition-all uppercase"
                />
              </div>

              <div
                className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 opacity-80 
                pointer-events-none"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Shop Order
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={info?.shopOrder || "-"}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-100 
                    rounded-lg text-sm font-bold text-slate-500 truncate"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    No. Parte
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={info?.partNumber || "-"}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-100 
                    rounded-lg text-sm font-bold text-slate-500 truncate"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Cajas
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={info?.boxes || "-"}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-100 
                    rounded-lg text-sm font-bold text-slate-500 text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Piezas
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={info?.pieces || "-"}
                    className={`w-full px-3 py-3 border rounded-lg text-sm font-bold 
                      text-center ${info ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-100 text-slate-500"}`}
                  />
                </div>
              </div>

              <button
                type="button"
                tabIndex={-1}
                onClick={() => handleRemoveRow(index)}
                className="p-3 mb-1 text-slate-400 hover:text-red-500 hover:bg-red-50 
                rounded-lg transition-colors self-end md:self-auto"
                title="Eliminar fila"
              >
                <Trash2 size={24} />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleAddRow}
          disabled={isProcessing}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl 
          text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-400 
          hover:text-slate-700 transition-colors flex items-center justify-center gap-2 
          disabled:opacity-50"
        >
          <Plus size={20} /> Agregar más filas
        </button>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isProcessing || Object.keys(folioDetails).length === 0}
          className="px-8 py-4 bg-[#F89C76] text-white rounded-xl font-bold text-lg 
          hover:bg-[#f2855a] transition-all active:scale-95 shadow-md shadow-orange-500/20 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={20} />{" "}
          {isProcessing ? "PROCESANDO..." : "CONFIRMAR SALIDA"}
        </button>
      </div>
    </div>
  );
};
