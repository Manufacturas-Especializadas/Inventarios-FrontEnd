import { ArrowLeft, DatabaseIcon, LogIn, Plus, Save } from "lucide-react";
import { FormField } from "../../components/FormField/FormField";
import { useInventoryExit } from "../../hooks/useInventoryExit";
import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { l10Service } from "../../api/services/L10Service";
import { useNavigate } from "react-router-dom";
import type { ExitHeader } from "../../types/Types";

const INITIAL_ROWS = 10;
const createEmptyRows = (count: number) =>
  Array.from({ length: count }, () => ({
    partNumber: "",
    client: "",
    currentStock: 0,
    quantity: 0,
    errorMsg: "",
  }));

export const ExitForm10 = () => {
  const { submitExit, isSubmitting } = useInventoryExit();
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
  const partNumberRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getClientByPart = (part: string): string => {
    if (!part) return "";
    const upperPart = part.toUpperCase();
    if (upperPart.startsWith("50HE") || upperPart.startsWith("38AU")) {
      return "CMX-D";
    }
    return "CMX-B";
  };

  const handleShopOrderChange = (index: number, value: string) => {
    const newOrders = [...shopOrders];
    newOrders[index] = value;
    setShopOrders(newOrders);
  };

  const handlePartNumberChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].partNumber = value;
    newItems[index].client = value ? getClientByPart(value) : "";
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        partNumber: "",
        client: "",
        currentStock: 0,
        quantity: 0,
        errorMsg: "",
      },
    ]);
  };

  useEffect(() => {
    const lastIndex = items.length - 1;
    if (items[lastIndex].partNumber === "" && items.length > INITIAL_ROWS) {
      partNumberRefs.current[lastIndex]?.focus();
    }
  }, [items.length]);

  const handleKeyDownPart = async (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const partNumber = items[index].partNumber.trim();

      const newItems = [...items];
      newItems[index].errorMsg = "";
      setItems(newItems);

      if (!partNumber) return;

      const duplicateIndex = items.findIndex(
        (item, i) =>
          i !== index &&
          item.partNumber.toUpperCase() === partNumber.toUpperCase(),
      );

      if (duplicateIndex !== -1) {
        toast.error(`El número ${partNumber} ya fue escaneado arriba.`);

        const errorItems = [...items];
        errorItems[index].partNumber = "";
        errorItems[index].client = "";
        errorItems[index].currentStock = 0;
        setItems(errorItems);

        quantityRefs.current[duplicateIndex]?.focus();
        return;
      }

      try {
        const stockData = await l10Service.getStock(9, partNumber);

        const successItems = [...items];
        successItems[index].currentStock = stockData.stock;
        successItems[index].errorMsg = "";
        setItems(successItems);

        if (stockData.stock === 0) {
          toast.error(`Atención: ${partNumber} no tiene stock disponible (0)`);
        }

        quantityRefs.current[index]?.focus();
      } catch (error: any) {
        console.error("Error al consultar API:", error);
        const errorText = error.message || String(error);
        const isNotFound =
          errorText.includes("no tiene registros") ||
          error.response?.status === 404;

        if (isNotFound) {
          const errorMessage = `Este número de parte nunca ha ingresado a la línea.`;
          toast.error(errorMessage);

          const errorItems = [...items];
          errorItems[index].partNumber = "";
          errorItems[index].errorMsg = errorMessage;
          errorItems[index].currentStock = 0;
          setItems(errorItems);
        } else {
          toast.error("Error de conexión al verificar stock");
        }
      }
    }
  };

  const handleKeyDownQuantity = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === items.length - 1 && items[index].partNumber !== "") {
        addRow();
      } else if (index < items.length - 1) {
        partNumberRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSave = async () => {
    const hasInvalidQuantities = items.some(
      (i) =>
        i.partNumber !== "" && (i.quantity > i.currentStock || i.quantity <= 0),
    );

    if (hasInvalidQuantities) {
      return toast.error(
        "Hay filas con cantidades inválidas o superiores al stock disponible.",
      );
    }

    const data: ExitHeader = {
      lineId: 9,
      shopOrder1: shopOrders[0].trim(),
      shopOrder2: shopOrders[1].trim() || undefined,
      shopOrder3: shopOrders[2].trim() || undefined,
      shopOrder4: shopOrders[3].trim() || undefined,
      shopOrder5: shopOrders[4].trim() || undefined,
      shopOrder6: shopOrders[5].trim() || undefined,
      details: items
        .filter((i) => i.partNumber !== "" && i.quantity > 0)
        .map(({ partNumber, client, quantity }) => ({
          partNumber,
          client,
          quantity,
        })),
    };

    const success = await submitExit(data);
    if (success) {
      setItems(createEmptyRows(INITIAL_ROWS));
      setShopOrders(["", "", "", "", "", ""]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
          rounded-lg font-semibold hover:bg-blue-100 transition-colors shadow-sm 
          hover:cursor-pointer"
        >
          <LogIn size={18} />
          Ir a Entradas
        </button>

        <button
          onClick={() => navigate("/base-de-datos-l10")}
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
          <FormField label="Línea" value="LINEA 10" readonly />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Órdenes de Trabajo (Shop Orders)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shopOrders.map((so, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <label
                  className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${i === 0 ? "text-orange-600" : "text-slate-400"}`}
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
            <div
              className="w-8 h-8 rounded-full bg-orange-500 flex items-center 
              justify-center text-white"
            >
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
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].errorMsg = "";
                      setItems(newItems);
                      handlePartNumberChange(index, e.target.value);
                    }}
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
