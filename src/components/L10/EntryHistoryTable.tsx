import { Edit2, Printer, Trash2 } from "lucide-react";
import type { HistoryEntry } from "../../types/Types";
import { formatDate } from "../../utils/formatDate";

interface Props {
  data: HistoryEntry[];
  isLoading: boolean;
  onEdit: (entry: HistoryEntry) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  onReprint?: (folio: string, shopOrder: string) => void;
  showCheckboxes?: boolean;
  selectedEntries?: { folio: string; shopOrder: string }[];
  onToggleSelect?: (folio: string, shopOrder: string) => void;
  onToggleSelectAll?: (entries: HistoryEntry[], isSelected: boolean) => void;
  onBulkPrint?: () => void;
}

export const EntryHistoryTable = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  onReprint,
  showCheckboxes = false,
  selectedEntries = [],
  onToggleSelectAll,
  onToggleSelect,
  onBulkPrint,
}: Props) => {
  const isAllSelected =
    data.length > 0 &&
    selectedEntries.length === data.filter((e) => e.folio).length;
  return (
    <div className="flex flex-col">
      {showCheckboxes && selectedEntries.length > 0 && (
        <div
          className="bg-emerald-100 px-4 py-3 border-b border-emerald-200 flex
          justify-between items-center animate-in fade-in slide-in from-top-2"
        >
          <span className="text-sm font-bold text-emerald-800">
            {selectedEntries.length} etiqueta(s) seleccionada(s)
          </span>

          <button
            onClick={onBulkPrint}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-1.5
            rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Printer size={16} />
            Imprimir selección
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50 border-b border-emerald-100">
              {showCheckboxes && (
                <th className="px-4 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) =>
                      onToggleSelectAll &&
                      onToggleSelectAll(data, e.target.checked)
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-emerald-300
                    focus:ring-emerald-500 hover:cursor-pointer"
                  />
                </th>
              )}
              <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase w-24">
                Ticket ID
              </th>
              <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase w-40">
                Fecha y Hora
              </th>
              <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase w-40">
                ShopOrder
              </th>
              <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase">
                Detalle de Piezas Ingresadas
              </th>
              <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase text-right w-28">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={showCheckboxes ? 5 : 4}
                  className="px-6 py-12 text-center text-slate-400 font-medium"
                >
                  Cargando Historial...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={showCheckboxes ? 5 : 4}
                  className="px-6 py-12 text-center text-slate-400 font-medium"
                >
                  No se encontraron tickets.
                </td>
              </tr>
            ) : (
              data.map((entry) => {
                const isSelected = selectedEntries.some(
                  (e) => e.folio === entry.folio,
                );

                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-50 transition-colors ${isSelected ? "bg-emerald-50/50" : ""}`}
                  >
                    {showCheckboxes && (
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!entry.folio}
                          onChange={() =>
                            onToggleSelect &&
                            onToggleSelect(
                              entry.folio,
                              entry.shopOrder || "N/A",
                            )
                          }
                          className="w-4 h-4 text-emerald-600 rounded border-gray-300 
                          focus:ring-emerald-500 hover:cursor-pointer disabled:opacity-50"
                        />
                      </td>
                    )}

                    <td className="px-4 py-4 text-sm font-bold text-slate-700">
                      #{entry.id}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-500">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-500">
                      {entry.shopOrder}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {entry.details.map((d, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 
                            bg-emerald-100 border border-emerald-200 text-emerald-800 
                            rounded-md text-xs font-bold font-mono"
                          >
                            {d.partNumber}
                            <span
                              className="bg-white px-1.5 rounded text-emerald-600 
                              shadow-sm"
                            >
                              x{d.quantity}
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(entry)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg 
                        hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(entry.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 bg-red-50 rounded-lg 
                        hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                      {onReprint && (
                        <button
                          onClick={() =>
                            onReprint(entry.folio, entry.shopOrder || "N/A")
                          }
                          className="p-2 text-emerald-600 bg-emerald-50 rounded-lg 
                          hover:bg-emerald-100 transition-colors"
                          title="Reimprimir Etiqueta"
                        >
                          <Printer size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
