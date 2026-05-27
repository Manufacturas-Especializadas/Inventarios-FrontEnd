import { ArrowLeft, DatabaseIcon, LogIn, Plus, Save } from "lucide-react";
import { FormField } from "../../components/FormField/FormField";
import { useExitForm } from "../../hooks/useExitForm";
import { useNavigate } from "react-router-dom";

interface GenericExitFormProps {
  lineId: number;
  lineName: string;
  entryUrl: string;
  dbUrl: string;
}

export const GenericExitForm = ({
  lineId,
  lineName,
  entryUrl,
  dbUrl,
}: GenericExitFormProps) => {
  const navigate = useNavigate();

  const {
    shopOrders,
    items,
    quantityRefs,
    partNumberRefs,
    isSubmitting,
    handleShopOrderChange,
    handlePartNumberChange,
    handleQuantityChange,
    handleKeyDownPart,
    handleKeyDownQuantity,
    addRow,
    handleSave,
  } = useExitForm(lineId);

  const today = new Date().toLocaleDateString("es-Mx", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate(entryUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
          rounded-lg font-semibold hover:bg-blue-100 transition-colors shadow-sm 
          hover:cursor-pointer"
        >
          <LogIn size={18} />
          Ir a Entradas
        </button>

        <button
          onClick={() => navigate(dbUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white 
          rounded-lg font-semibold hover:bg-slate-900 transition-colors shadow-sm 
          hover:cursor-pointer"
        >
          <DatabaseIcon size={18} />
          Base de Datos
        </button>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField label="Fecha" value={today} readonly />
          <FormField label="Línea" value={lineName} readonly />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Órdenes de Trabajo (Shop Orders)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shopOrders.map((so, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <label
                  className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${
                    i === 0 ? "text-orange-600" : "text-slate-400"
                  }`}
                >
                  Shop Order {i + 1} {i === 0 ? "(Requerida)" : "(Opcional)"}
                </label>
                <input
                  className={`px-4 py-2.5 rounded-xl border-2 outline-none transition-all font-bold text-sm ${
                    i === 0
                      ? "border-orange-100 bg-orange-50/30 text-slate-700 focus:border-orange-500"
                      : "border-slate-200 bg-slate-50 text-slate-600 focus:border-blue-400 focus:bg-white"
                  }`}
                  placeholder={`Escanear SO ${i + 1}...`}
                  value={so}
                  onChange={(e) => handleShopOrderChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
              <ArrowLeft size={18} />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-tight">
              Salida de numeros de parte
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const remaining = item.currentStock - item.quantity;
            const isOverStock = remaining < 0 && item.quantity > 0;

            return (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-white 
                border rounded-xl shadow-sm items-center transition-all ${
                  isOverStock
                    ? "border-red-300 bg-red-50/30"
                    : "border-slate-200 hover:border-orange-200"
                }`}
              >
                <div className="col-span-12 md:col-span-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    No. Parte
                  </label>
                  <input
                    ref={(el) => {
                      partNumberRefs.current[index] = el;
                    }}
                    className={`w-full bg-slate-50 p-2 rounded-lg text-sm font-mono 
                    outline-none transition-all focus:ring-2 ${
                      item.errorMsg
                        ? "border-red-300 ring-2 ring-red-200 focus:ring-red-500"
                        : "focus:ring-orange-500"
                    }`}
                    value={item.partNumber}
                    onChange={(e) =>
                      handlePartNumberChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDownPart(e, index)}
                    placeholder="Escanear..."
                  />
                  {item.errorMsg && (
                    <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 leading-tight">
                      {item.errorMsg}
                    </p>
                  )}
                </div>

                <div className="col-span-6 md:col-span-3">
                  <label className="text-[10px] font-bold text-orange-600 uppercase ml-1">
                    Salida
                  </label>
                  <input
                    ref={(el) => {
                      quantityRefs.current[index] = el;
                    }}
                    type="number"
                    className="w-full bg-orange-50 p-2 rounded-lg text-sm font-bold 
                    text-orange-700 outline-none focus:ring-2 focus:ring-orange-600 text-right"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                    onKeyDown={(e) => handleKeyDownQuantity(e, index)}
                    placeholder="0"
                  />
                </div>

                <div className="col-span-6 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Stock Actual
                  </label>
                  <div
                    className="w-full bg-slate-100 p-2 rounded-lg text-sm font-bold 
                  text-slate-600 text-center border border-dashed border-slate-300 
                  h-9 flex items-center justify-center"
                  >
                    {item.partNumber ? item.currentStock : "-"}
                  </div>
                </div>

                <div className="col-span-6 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Cliente
                  </label>
                  <div
                    className="w-full bg-slate-100 p-2 rounded-lg text-xs text-slate-600 
                  font-medium h-9 flex items-center"
                  >
                    {item.client || <span className="text-slate-300">---</span>}
                  </div>
                </div>

                <div className="col-span-6 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Restante
                  </label>
                  <div
                    className={`w-full p-2 rounded-lg text-sm font-black text-right h-9 
                  flex items-center justify-end ${
                    isOverStock
                      ? "bg-red-100 text-red-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                  >
                    {item.partNumber ? remaining : "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={addRow}
          type="button"
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl 
          text-slate-400 hover:border-orange-300 hover:text-orange-500 
          hover:bg-orange-50/50 transition-all flex items-center justify-center gap-2 
          font-medium cursor-pointer"
        >
          <Plus size={20} />
          Agregar más filas
        </button>
      </section>

      <div className="fixed bottom-8 right-8 md:static flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSubmitting || shopOrders[0].trim() === ""}
          className="flex items-center gap-3 bg-orange-600 text-white px-10 py-4 
          rounded-2xl font-bold shadow-xl shadow-orange-200 hover:bg-orange-700 
          active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={22} />
          {isSubmitting ? "GUARDANDO..." : "CONFIRMAR SALIDA"}
        </button>
      </div>
    </div>
  );
};
