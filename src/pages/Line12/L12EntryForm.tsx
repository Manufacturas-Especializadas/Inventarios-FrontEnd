import { useState } from "react";
import { useInventoryEntry } from "../../hooks/useInventoryEntry";
import type { EntryDetail, EntryHeader } from "../../types/Types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DatabaseIcon, LogIn } from "lucide-react";

const L12_LINE_ID = 11;

interface UIEntryRow extends Omit<EntryDetail, "client" | "boxesQuantity"> {
  shopOrder: string;
  client?: string;
  boxesQuantity?: number;
}

const emptyRow: UIEntryRow = {
  shopOrder: "",
  partNumber: "",
  client: "",
  quantity: 0,
  boxesQuantity: 0,
};

export const L12EntryForm = () => {
  const { submitEntry, isSubmitting } = useInventoryEntry();
  const navigate = useNavigate();

  const [details, setDetails] = useState<UIEntryRow[]>(
    Array.from({ length: 10 }, () => ({ ...emptyRow })),
  );

  const handleAddRow = () => {
    setDetails([...details, { ...emptyRow }]);
  };

  const handleRemoveRow = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleChangeDetail = (
    index: number,
    field: keyof UIEntryRow,
    value: string | number,
  ) => {
    const newDetails = [...details];
    let sanitizedValue = value;

    if (
      typeof value === "string" &&
      (field === "shopOrder" || field === "partNumber")
    ) {
      sanitizedValue = value.replace(/'/g, "-").replace(/\?/g, "_");
    }

    // @ts-ignore
    newDetails[index][field] = sanitizedValue;

    if (field === "shopOrder") {
      const soValue = sanitizedValue as string;

      if (soValue.startsWith("G")) {
        newDetails[index].client = "DAIKIN";
      } else if (soValue.toUpperCase().startsWith("LEN")) {
        newDetails[index].client = "LENNOX";
      } else {
        newDetails[index].client = "";
      }
    }

    setDetails(newDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validDetails = details.filter(
      (d) => d.partNumber.trim() !== "" && d.shopOrder.trim() !== "",
    );

    if (validDetails.length === 0) return;

    const groupedByShopOrder = validDetails.reduce(
      (acc, current) => {
        if (!acc[current.shopOrder]) {
          acc[current.shopOrder] = [];
        }

        acc[current.shopOrder].push({
          partNumber: current.partNumber,
          client: current.client || "",
          quantity: current.quantity,
          boxesQuantity: current.boxesQuantity || 0,
        });

        return acc;
      },
      {} as Record<string, EntryDetail[]>,
    );

    const globalLoadingToast = toast.loading("Registrando entradas...");
    let allSuccess = true;

    for (const [currentShopOrder, groupDetails] of Object.entries(
      groupedByShopOrder,
    )) {
      const payload: EntryHeader = {
        lineId: L12_LINE_ID,
        shopOrder: currentShopOrder,
        details: groupDetails,
      };

      const success = await submitEntry(payload, false);

      if (!success) {
        allSuccess = false;
        break;
      }
    }

    if (allSuccess) {
      toast.success("Entradas registradas correctamente", {
        id: globalLoadingToast,
      });
      setDetails(Array.from({ length: 10 }, () => ({ ...emptyRow })));
    } else {
      toast.error("Ocurrió un error al registrar algunas entradas", {
        id: globalLoadingToast,
      });
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full 
      max-w-6xl mx-auto"
    >
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Registro de Entrada - Línea 12
        </h2>
        <p className="text-sm text-gray-500">
          Ingresa los detalles. Los registros se agruparán automáticamente por
          Shop Order.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600
            rounded-lg font-semibold hover:bg-blue-100 transition-colors shadow-sm
            hover:cursor-pointer"
          >
            <LogIn size={18} />
            SALIDAS
          </button>
          <button
            onClick={() => navigate("/base-de-datos-l12")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white 
            rounded-lg font-semibold hover:bg-slate-900 transition-colors shadow-sm
            hover:cursor-pointer"
          >
            <DatabaseIcon size={18} />
            BASE DE DATOS
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                <th className="py-3 px-3 font-medium w-40">Shop Order</th>
                <th className="py-3 px-3 font-medium w-40">Número de Parte</th>
                <th className="py-3 px-3 font-medium w-40">Cliente</th>
                <th className="py-3 px-3 font-medium w-24">Piezas</th>
                <th className="py-3 px-3 font-medium w-24">Cajas</th>
                <th className="py-3 px-3 font-medium w-24 text-center bg-blue-50/50">
                  Total Pzas
                </th>
                <th className="py-3 px-3 font-medium text-center w-16">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => {
                const total =
                  (detail.quantity || 0) * (detail.boxesQuantity || 0);

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={detail.shopOrder}
                        onChange={(e) =>
                          handleChangeDetail(index, "shopOrder", e.target.value)
                        }
                        placeholder="Ej. SO-123"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 
                        focus:ring-blue-500 outline-none text-sm"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={detail.partNumber}
                        onChange={(e) =>
                          handleChangeDetail(
                            index,
                            "partNumber",
                            e.target.value,
                          )
                        }
                        placeholder="No. de Parte"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 
                        focus:ring-blue-500 outline-none text-sm"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        disabled
                        value={detail.client || ""}
                        onChange={(e) =>
                          handleChangeDetail(index, "client", e.target.value)
                        }
                        placeholder="Opcional"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 
                        focus:ring-blue-500 outline-none text-sm"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={detail.quantity || ""}
                        onChange={(e) =>
                          handleChangeDetail(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 
                        focus:ring-blue-500 outline-none text-sm"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={detail.boxesQuantity || ""}
                        onChange={(e) =>
                          handleChangeDetail(
                            index,
                            "boxesQuantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 
                        focus:ring-blue-500 outline-none text-sm"
                      />
                    </td>
                    <td className="py-2 px-2 text-center bg-blue-50/30">
                      <span className="font-semibold text-blue-700">
                        {total > 0 ? total : "-"}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Eliminar fila"
                      >
                        <svg
                          className="w-5 h-5 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium 
            transition-colors hover:cursor-pointer"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Añadir Fila
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors 
              hover:cursor-pointer ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? "Guardando..." : "Registrar Entrada"}
          </button>
        </div>
      </form>
    </div>
  );
};
