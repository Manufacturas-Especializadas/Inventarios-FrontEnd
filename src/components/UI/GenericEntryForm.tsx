import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DatabaseIcon, LogIn, Plus, Save } from "lucide-react";
import { FormField } from "../../components/FormField/FormField";
import { useInventoryEntry } from "../../hooks/useInventoryEntry";
import { ScannerRow } from "./ScannerRow";
import toast from "react-hot-toast";

const INITIAL_ROWS = 10;
const createEmptyRows = (count: number) =>
  Array.from({ length: count }, () => ({
    partNumber: "",
    client: "",
    quantity: 0,
  }));

interface GenericEntryFormProps {
  lineId: number;
  lineName: string;
  exitUrl: string;
  dbUrl: string;
  resolveClient: (partNumber: string) => string;
  isManualClient?: (partNumber: string) => boolean;
}

export const GenericEntryForm = ({
  lineId,
  lineName,
  exitUrl,
  dbUrl,
  resolveClient,
  isManualClient,
}: GenericEntryFormProps) => {
  const { submitEntry, isSubmitting } = useInventoryEntry();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("es-Mx", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [shopOrders, setShopOrders] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [items, setItems] = useState(createEmptyRows(INITIAL_ROWS));
  const quantityRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleShopOrderChange = (index: number, value: string) => {
    const newOrders = [...shopOrders];
    newOrders[index] = value;

    setShopOrders(newOrders);
  };

  const handlePartNumberChange = (index: number, value: string) => {
    const newItems = [...items];

    const sanitizedValue = value.replace(/'/g, "-").toUpperCase();

    newItems[index].partNumber = sanitizedValue;

    const isManual = isManualClient ? isManualClient(sanitizedValue) : false;

    newItems[index].client = isManual
      ? ""
      : sanitizedValue
        ? resolveClient(sanitizedValue)
        : "";

    setItems(newItems);
  };

  const handleClientChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].client = value.toUpperCase();
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
  };

  const addRow = () => {
    setItems([...items, { partNumber: "", client: "", quantity: 0 }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      quantityRefs.current[index]?.focus();
    }
  };

  const handleSave = async () => {
    if (lineId === 4 && shopOrders[0].trim() === "") {
      return toast.error("La shop order es obligatoria para la Linea 4");
    }

    const hasErrors = items.some(
      (i) =>
        i.partNumber !== "" &&
        (i.quantity <= 0 ||
          (isManualClient &&
            isManualClient(i.partNumber) &&
            i.client.trim() === "")),
    );

    if (hasErrors) {
      return toast.error(
        "Revisa que no haya cantidades en 0 o clientes sin asignar.",
      );
    }

    const data = {
      lineId: lineId,
      shopOrder: shopOrders[0].trim() || undefined,
      shopOrder2: shopOrders[1].trim() || undefined,
      shopOrder3: shopOrders[2].trim() || undefined,
      shopOrder4: shopOrders[3].trim() || undefined,
      shopOrder5: shopOrders[4].trim() || undefined,
      shopOrder6: shopOrders[5].trim() || undefined,
      details: items.filter((i) => i.partNumber !== "" && i.quantity > 0),
    };

    const success = await submitEntry(data);
    if (success) {
      setItems(createEmptyRows(INITIAL_ROWS));

      setShopOrders(["", "", "", "", "", ""]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate(exitUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg 
          font-semibold hover:bg-blue-100 transition-colors shadow-sm cursor-pointer"
        >
          <LogIn size={18} /> Ir a Salidas
        </button>
        <button
          onClick={() => navigate(dbUrl)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg 
          font-semibold hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
        >
          <DatabaseIcon size={18} /> Base de Datos
        </button>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <FormField label="Fecha" value={today} readonly />
          <FormField label="Línea" value={lineName} readonly />
        </div>

        {[3, 4, 5].includes(lineId) && (
          <div className="border-t border-slate-100 pt-5">
            <h4
              className="text-[11px] font-black text-slate-400 uppercase 
              tracking-widest mb-4"
            >
              Shop Orders
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shopOrders.map((so, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label
                    className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${
                      i === 0 ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    Shop Order {i + 1} {i === 0 ? "(Requerida)" : "(Opcional)"}
                  </label>
                  <input
                    className={`px-4 py-2.5 rounded-xl border-2 outline-none 
                      transition-all font-bold text-sm ${
                        i === 0
                          ? "border-blue-100 bg-blue-50/50 text-slate-700 focus:border-blue-500"
                          : "border-slate-200 bg-slate-50 text-slate-600 focus:border-blue-400 focus:bg-white"
                      }
                    `}
                    placeholder={`Escanear SO ${i + 1}`}
                    value={so}
                    onChange={(e) => handleShopOrderChange(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center 
              text-white"
            >
              <ArrowRight size={18} />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-tight">
              Escaneo de números de partes
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Modo Scanner Activo
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isEditable = isManualClient
              ? isManualClient(item.partNumber)
              : false;

            return (
              <ScannerRow
                key={index}
                index={index}
                partNumber={item.partNumber}
                quantity={item.quantity || ""}
                client={item.client}
                isClientEditable={isEditable}
                onPartChange={(val) => handlePartNumberChange(index, val)}
                onQuantityChange={(val) => handleQuantityChange(index, val)}
                onClientChange={(val) => handleClientChange(index, val)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                quantityRef={(el) => {
                  quantityRefs.current[index] = el;
                }}
              />
            );
          })}
        </div>

        <button
          onClick={addRow}
          type="button"
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl 
          text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 
          transition-all flex items-center justify-center gap-2 font-medium cursor-pointer"
        >
          <Plus size={20} /> Agregar más filas de escaneo
        </button>
      </section>

      <div className="fixed bottom-8 right-8 md:static flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl 
          font-bold shadow-2xl shadow-slate-300 hover:bg-black active:scale-95 transition-all 
          disabled:opacity-50 cursor-pointer"
        >
          <Save size={22} />
          {isSubmitting ? "GUARDANDO..." : "GUARDAR ENTRADA"}
        </button>
      </div>
    </div>
  );
};
