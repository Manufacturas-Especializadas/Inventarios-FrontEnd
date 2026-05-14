import { CheckCircle, Package } from "lucide-react";

export const FtnInventortTable = ({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) => {
  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500 font-bold">
        Cargando inventario FTN...
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-purple-50 border-b border-purple-200 text-purple-500">
          <tr>
            <th>Folio</th>
            <th>Shop Order</th>
            <th>No. Parte</th>
            <th>Cantidad</th>
            <th>Fecha Salida</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-black text-slate-900">
                {item.folio}
              </td>
              <td className="px-6 py-4 font-medium text-slate-600">
                {item.shopOrder || "N/A"}
              </td>
              <td className="px-6 py-4 font-mono text-slate-600">
                {item.partNumber}
              </td>
              <td className="px-6 py-4 font-black text-xl text-slate-900">
                {item.currentQuantity}
              </td>
              <td className="px-6 py-4 text-slate-500">
                {new Date(item.createdAt).toLocaleDateString("es-MX")}
              </td>
              <td className="px-6 py-4">
                {item.status === "LIQUIDADO" ? (
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                    <CheckCircle size={14} /> COMPLETADO
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                    <Package size={14} /> EN TRÁNSITO
                  </span>
                )}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                No hay folios en tránsito actualmente
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
