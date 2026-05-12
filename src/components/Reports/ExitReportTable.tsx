interface Props {
  filteredExists: any[];
  selectedFolios: string[];
  handleToggleSelect: (id: string | number) => void;
}

export const ExitReportTable = ({
  filteredExists,
  selectedFolios,
  handleToggleSelect,
}: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-indigo-50 border-b border-indigo-200 text-indigo-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Selección</th>
            <th className="px-6 py-4 font-semibold">Folio</th>
            <th className="px-6 py-4 font-semibold">Shop Order</th>
            <th className="px-6 py-4 font-semibold">No. Parte</th>
            <th className="px-6 py-4 font-semibold">Cantidad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredExists.map((exit, index) => (
            <tr key={index} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedFolios.includes(String(exit.folio))}
                  onChange={() => handleToggleSelect(exit.folio!)}
                  className="w-5 h-5 cursor-pointer rounded border-slate-300
                  text-indigo-600 focus:ring-indigo-500"
                />
              </td>

              <td className="px-6 py-4 font-medium text-slate-900">
                {exit.folio}
              </td>

              <td className="px-6 py-4 text-slate-600">{exit.shopOrder}</td>

              <td className="px-6 py-4 font-bold text-slate-900">
                {exit.partNumber}
              </td>
            </tr>
          ))}

          {filteredExists.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500">
                No hay folios dispoinibles para dar salida o no coinciden con la
                búsqueda
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
