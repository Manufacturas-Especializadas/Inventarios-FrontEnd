import { Edit2, Trash2 } from "lucide-react";
import type { HistoryExits } from "../../types/Types";
import { formatDate } from "../../utils/formatDate";

interface Props {
  data: HistoryExits[];
  isLoading: boolean;
  onEdit: (exit: HistoryExits) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export const ExitHistoryTable = ({
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
          <tr className="bg-orange-50 border-b border-orange-100">
            <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase w-24">
              Ticket ID
            </th>
            <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase w-40">
              Fecha y Hora
            </th>
            <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase w-48">
              Shop Orders
            </th>
            <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase">
              Detalle de Piezas Retiradas
            </th>
            <th className="px-4 py-4 text-xs font-bold text-orange-700 uppercase text-right w-28">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-12 text-center text-slate-400 font-medium"
              >
                Cargando Historial...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-12 text-center text-slate-400 font-medium"
              >
                No se encontraron tickets con esa búsqueda.
              </td>
            </tr>
          ) : (
            data.map((exit) => {
              const sos = [
                exit.shopOrder1,
                exit.shopOrder2,
                exit.shopOrder3,
                exit.shopOrder4,
                exit.shopOrder5,
                exit.shopOrder6,
              ]
                .filter(Boolean)
                .join(", ");
              return (
                <tr
                  key={exit.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-bold text-slate-700">
                    #{exit.id}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-500">
                    {formatDate(exit.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-600">
                    {sos}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {exit.details.map((d, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 
                          bg-orange-100 border border-orange-200 text-orange-800 
                          rounded-md text-xs font-bold font-mono"
                        >
                          {d.partNumber}
                          <span className="bg-white px-1.5 rounded text-orange-600 shadow-sm">
                            x{d.quantity}
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(exit)}
                      className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 
                      transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(exit.id)}
                      disabled={isDeleting}
                      className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
