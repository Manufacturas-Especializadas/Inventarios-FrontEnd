import { useNavigate } from "react-router-dom";
import { DatabaseIcon, LogIn, Printer } from "lucide-react";
import { useL12EntryForm } from "../../hooks/useL12EntryForm";
import Logo from "../../assets/logomesa.png";
import Barcode from "react-barcode";

export const L12EntryForm = () => {
  const navigate = useNavigate();

  const {
    details,
    generatedFolios,
    isSubmitting,
    handleAddRow,
    handleRemoveRow,
    handleChangeDetail,
    handleSubmit,
    handlePrintFolios,
  } = useL12EntryForm();

  return (
    <>
      <div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 
        w-full max-w-6xl mx-auto print:hidden"
      >
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Registro de Entrada - Línea 12
          </h2>
          <p className="text-sm text-gray-500">
            DAIKIN bloqueado a 8 cajas (excepto No. Parte 0227A00293)
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <div className="flex justify-start">
              {generatedFolios.length > 0 && (
                <button
                  type="button"
                  onClick={handlePrintFolios}
                  className="px-6 py-2 rounded-lg bg-emerald-100 text-emerald-800 border 
                border-emerald-300 font-bold transition-colors hover:bg-emerald-200
                  hover:cursor-pointer flex items-center gap-2 animate-pulse"
                >
                  <Printer size={20} />
                  Imprimir {generatedFolios.length} Etiqueta(s)
                </button>
              )}
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
              rounded-lg font-semibold hover:bg-blue-100 transition-colors shadow-sm 
              hover:cursor-pointer"
            >
              <LogIn size={18} />
              SALIDAS
            </button>
            <button
              type="button"
              onClick={() => navigate("/base-de-datos-l12")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 
              text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors 
              shadow-sm hover:cursor-pointer"
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
                <tr
                  className="bg-gray-50 text-gray-600 text-sm border-y 
                  border-gray-200"
                >
                  <th className="py-3 px-3 font-medium w-40">Shop Order</th>
                  <th className="py-3 px-3 font-medium w-40">
                    Número de Parte
                  </th>
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
                  const isBoxesLocked =
                    detail.client === "DAIKIN" &&
                    detail.partNumber !== "0227A00293";

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 last:border-0 
                      hover:bg-gray-50/50"
                    >
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={detail.shopOrder}
                          onChange={(e) =>
                            handleChangeDetail(
                              index,
                              "shopOrder",
                              e.target.value,
                            )
                          }
                          placeholder="Ej. SO-123"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded 
                          focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
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
                          className="w-full px-3 py-1.5 border border-gray-300 rounded 
                          focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          disabled
                          tabIndex={-1}
                          value={detail.client || ""}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded 
                          text-sm bg-gray-50 font-semibold"
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
                          className="w-full px-3 py-1.5 border border-gray-300 rounded 
                          focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="1"
                          readOnly={isBoxesLocked}
                          tabIndex={isBoxesLocked ? -1 : 0}
                          value={detail.boxesQuantity || ""}
                          onChange={(e) =>
                            handleChangeDetail(
                              index,
                              "boxesQuantity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className={`w-full px-3 py-1.5 border border-gray-300 rounded 
                            focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                              isBoxesLocked
                                ? "bg-gray-100 cursor-not-allowed font-bold text-blue-600"
                                : ""
                            }`}
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
                          tabIndex={-1}
                          onClick={() => handleRemoveRow(index)}
                          className="text-red-500 hover:text-red-700 transition-colors 
                          p-1 hover:cursor-pointer"
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
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 
              font-medium transition-colors hover:cursor-pointer"
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

      <div
        className="hidden print:flex print:flex-col print:items-center print:gap-10 
        print:absolute print:inset-0 print:bg-white print:z-9999 print:py-8"
      >
        {generatedFolios.map((item, index) => {
          let rawFolio: any = item.folio;

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
              className="relative w-[120mm] h-[65mm] flex items-center justify-between 
              p-8 pt-10 bg-white text-black border-2 border-dashed border-gray-400 
              rounded-xl"
            >
              <div
                className="absolute top-4 left-8 text-sm font-bold text-slate-500 
                uppercase tracking-widest"
              >
                <span className="text-black text-lg">{shopOrder}</span>
              </div>

              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Barcode
                  value={String(folioString)}
                  width={2.2}
                  height={50}
                  fontSize={16}
                  font="monospace"
                  textMargin={6}
                  margin={0}
                  displayValue={true}
                />
                <img
                  src={Logo}
                  alt="Logo MESA"
                  className="h-8 object-contain mt-1 grayscale"
                />
              </div>
              <div className="flex-1 flex justify-end items-center pr-2">
                <span
                  className="text-[4.5rem] font-black leading-none text-black 
                  tracking-tighter"
                >
                  {folioText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
