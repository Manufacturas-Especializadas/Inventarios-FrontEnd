import { useEffect, useState } from "react";
import { useEntryMutations } from "../../hooks/useEntryMutations";
import { useExitMutations } from "../../hooks/useExitMutations";
import { X, AlertCircle, Plus, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: { type: "entry" | "exit"; data: any } | null;
  onSuccess: () => void;
}

export const EditTransactionModal = ({
  isOpen,
  onClose,
  record,
  onSuccess,
}: Props) => {
  const { updateEntry, isProcessing: isUpdatingEntry } = useEntryMutations();
  const { updateExit, isProcessing: isUpdatingExit } = useExitMutations();

  const isProcessing = isUpdatingEntry || isUpdatingExit;

  const [items, setItems] = useState<any[]>([]);
  const [shopOrders, setShopOrders] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    if (record && isOpen) {
      setItems([...record.data.details]);
      if (record.type === "exit") {
        setShopOrders([
          record.data.shopOrder1 || "",
          record.data.shopOrder2 || "",
          record.data.shopOrder3 || "",
          record.data.shopOrder4 || "",
          record.data.shopOrder5 || "",
          record.data.shopOrder6 || "",
        ]);
      }
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const isEntry = record.type === "entry";

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleShopOrderChange = (index: number, value: string) => {
    const newOrders = [...shopOrders];
    newOrders[index] = value;
    setShopOrders(newOrders);
  };

  const addRow = () => {
    setItems((prev) => [...prev, { partNumber: "", client: "", quantity: 0 }]);
  };

  const removeRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validItems = items.filter(
      (i) => i.partNumber.trim() !== "" && i.quantity > 0,
    );

    if (validItems.length === 0) {
      alert("Debes tener al menos un número de parte con cantidad válida.");
      return;
    }

    let success = false;

    if (isEntry) {
      const data = {
        id: record.data.id,
        lineId: record.data.lineId,
        details: validItems,
      };
      success = await updateEntry(record.data.id, data);
    } else {
      if (!shopOrders[0].trim()) {
        alert("La Shop Order 1 es obligatoria para las salidas.");
        return;
      }
      const data = {
        id: record.data.id,
        lineId: record.data.lineId,
        shopOrder1: shopOrders[0].trim(),
        shopOrder2: shopOrders[1].trim(),
        shopOrder3: shopOrders[2].trim(),
        shopOrder4: shopOrders[3].trim(),
        shopOrder5: shopOrders[4].trim(),
        shopOrder6: shopOrders[5].trim(),
        details: validItems,
      };

      success = await updateExit(record.data.id, data);
    }

    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 
      bg-slate-900/40 backdrop-blur-sm"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] 
        flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${isEntry ? "bg-emerald-50 border-emerald-100" : "bg-orange-50 border-orange-100"}`}
        >
          <div>
            <h3
              className={`text-lg font-black ${isEntry ? "text-emerald-800" : "text-orange-800"}`}
            >
              Editar {isEntry ? "Entrada" : "Salida"} #{record.data.id}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Modifica las cantidades, números de parte o Shop Orders.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 
            rounded-full transition-colors hover:cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {!isEntry && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4
                className="text-[11px] font-black text-slate-400 uppercase tracking-widest 
                mb-4 flex items-center gap-2"
              >
                <AlertCircle size={14} /> Shop Orders
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {shopOrders.map((so, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <label
                      className={`text-[10px] font-bold uppercase ml-1 ${i === 0 ? "text-orange-600" : "text-slate-400"}`}
                    >
                      SO {i + 1} {i === 0 && "*"}
                    </label>
                    <input
                      className={`px-3 py-2 rounded-lg border text-sm font-bold outline-none focus:ring-2 ${
                        i === 0
                          ? "border-orange-200 bg-orange-50 focus:ring-orange-500"
                          : "border-slate-200 bg-slate-50 focus:ring-blue-500"
                      }`}
                      value={so}
                      onChange={(e) => handleShopOrderChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Detalle de Piezas
              </h4>
              <button
                onClick={addRow}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 
                flex items-center gap-1"
              >
                <Plus size={14} /> Añadir Fila
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-slate-50 
                  border border-slate-200 rounded-xl group relative"
                >
                  <button
                    onClick={() => removeRow(index)}
                    className="absolute -top-2 -right-2 bg-white border border-slate-200 
                    text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 
                    transition-opacity hover:bg-red-50 hover:cursor-pointer"
                  >
                    <X size={12} />
                  </button>

                  <div className="flex-1 min-w-37.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      No. Parte
                    </label>
                    <input
                      className="w-full bg-white p-2 rounded-lg text-sm font-mono border border-slate-200 outline-none focus:border-blue-400"
                      value={item.partNumber}
                      onChange={(e) =>
                        handleItemChange(index, "partNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white p-2 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-blue-400 text-right"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Cliente
                    </label>
                    <input
                      className="w-full bg-white p-2 rounded-lg text-xs border border-slate-200 outline-none focus:border-blue-400 text-center uppercase"
                      value={item.client || ""}
                      onChange={(e) =>
                        handleItemChange(index, "client", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 
            transition-colors disabled:opacity-50 hover:cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white 
              shadow-lg transition-all active:scale-95 disabled:opacity-50 hover:cursor-pointer ${
                isEntry
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                  : "bg-orange-600 hover:bg-orange-700 shadow-orange-200"
              }`}
          >
            <Save size={18} />
            {isProcessing ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};
