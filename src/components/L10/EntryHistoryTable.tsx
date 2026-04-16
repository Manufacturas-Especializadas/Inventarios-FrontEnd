import { Edit2, Trash2 } from "lucide-react";
import type { HistoryEntry } from "../../types/Types";
import { formatDate } from "../../utils/formatDate";

interface Props {
  data: HistoryEntry[];
  isLoading: boolean;
  onEdit: (entry: HistoryEntry) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export const EntryHistoryTable = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-emerald-50 border-b border-emerald-100">
            <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase w-24">
              Ticket ID
            </th>
            <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase w-40">
              Fecha y Hora
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
                colSpan={4}
                className="px-6 py-12 text-center text-slate-400 font-medium"
              >
                Cargando Historial...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-12 text-center text-slate-400 font-medium"
              >
                No se encontraron tickets con esa búsqueda.
              </td>
            </tr>
          ) : (
            data.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-4 text-sm font-bold text-slate-700">
                  #{entry.id}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-slate-500">
                  {formatDate(entry.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {entry.details.map((d, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border 
                          border-emerald-200 text-emerald-800 rounded-md text-xs font-bold font-mono"
                      >
                        {d.partNumber}
                        <span className="bg-white px-1.5 rounded text-emerald-600 shadow-sm">
                          x{d.quantity}
                        </span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(entry)}
                    className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 
                    transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    disabled={isDeleting}
                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 
                    transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
