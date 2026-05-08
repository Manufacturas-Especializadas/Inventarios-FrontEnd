import { useMemo, useState, useEffect } from "react";
import { useGenerateReport } from "../../hooks/useGenerateReport";
import type { ExitReportGeneratorProps } from "../../types/Types";
import { CheckSquare, Printer, Search } from "lucide-react";
import Barcode from "react-barcode";
import Logo from "../../assets/logomesa.png";

export const ExitReportGenerator = ({
  availableExits,
}: ExitReportGeneratorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolios, setSelectedFolios] = useState<string[]>([]);
  const { fetchReportData, reportData, isLoading } = useGenerateReport();

  const filteredExits = useMemo(() => {
    return availableExits.filter((exit) =>
      Object.values(exit).some(
        (val) =>
          val && String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [availableExits, searchTerm]);

  const handleToggleSelect = (folio: string) => {
    setSelectedFolios((prev) =>
      prev.includes(folio) ? prev.filter((f) => f !== folio) : [...prev, folio],
    );
  };

  const handleGenerate = async () => {
    await fetchReportData(selectedFolios);
  };

  useEffect(() => {
    if (reportData && reportData.length > 0) {
      window.print();
    }
  }, [reportData]);

  return (
    <div className="space-y-4">
      <div className="print:hidden space-y-4">
        <div
          className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm 
          flex items-center gap-3"
        >
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            className="w-full outline-none text-sm font-medium text-slate-700"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
              {filteredExits.map((exit, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedFolios.includes(exit.folio)}
                      onChange={() => handleToggleSelect(exit.folio)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{exit.folio}</td>
                  <td className="px-6 py-4">{exit.shopOrder}</td>
                  <td className="px-6 py-4">{exit.partNumber}</td>
                  <td className="px-6 py-4 font-bold">{exit.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedFolios.length > 0 && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 
            text-white px-6 py-4 rounded-full flex items-center gap-6 z-50"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={20} className="text-emerald-400" />
              <span>{selectedFolios.length} seleccionados</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 bg-indigo-500 px-5 py-2 rounded-full font-bold"
            >
              <Printer size={18} />
              {isLoading ? "Generando..." : "Imprimir"}
            </button>
          </div>
        )}
      </div>

      <div className="hidden print:block print:w-full print:bg-white print:z-50 p-8 text-black">
        <div className="w-full max-w-[210mm] mx-auto font-sans">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={Logo} alt="MESA" className="h-12 object-contain" />

              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  REPORTE DE SALIDAS
                </h1>
                <p className="text-sm text-gray-500">
                  Línea 12 - Control de Inventario
                </p>
              </div>
            </div>

            <div className="text-right text-sm text-gray-500">
              <p>{new Date().toLocaleDateString()}</p>
              <p>{new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>Sistema: Inventarios MESA</span>
            <span>Total registros: {reportData?.length || 0}</span>
          </div>

          <table className="w-full border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-3 py-2 text-left font-bold">Folio</th>
                <th className="border px-3 py-2 text-left font-bold">
                  Shop Order
                </th>
                <th className="border px-3 py-2 text-left font-bold">
                  No. Parte
                </th>
                <th className="border px-3 py-2 text-center font-bold">
                  Cantidad
                </th>
                <th className="border px-3 py-2 text-center font-bold">
                  Código
                </th>
              </tr>
            </thead>

            <tbody>
              {reportData &&
                reportData.map((report, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border px-3 py-4 font-bold text-gray-900">
                      {report.folio}
                    </td>

                    <td className="border px-3 py-4 text-gray-700">
                      {report.shopOrder}
                    </td>

                    <td className="border px-3 py-4 text-gray-700">
                      {report.partNumber}
                    </td>

                    <td className="border px-3 py-4 text-center font-bold">
                      {report.quantity}
                    </td>

                    <td className="border px-3 py-4 text-center">
                      <Barcode
                        value={report.folio}
                        width={2}
                        height={50}
                        displayValue={false}
                        margin={0}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between text-xs text-gray-500">
            <span>Página 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
