import { useMemo, useState, useEffect } from "react";
import { useGenerateReport } from "../../hooks/useGenerateReport";
import type { ExitReportGeneratorProps } from "../../types/Types";
import { CheckSquare, Printer, Search } from "lucide-react";
import Barcode from "react-barcode";

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

  const handleToggleSelect = (id: string | number) => {
    const stringId = String(id);
    setSelectedFolios((prev) =>
      prev.includes(stringId)
        ? prev.filter((f) => f !== stringId)
        : [...prev, stringId],
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

        <div
          className="bg-white border border-slate-200 rounded-2xl shadow-sm 
          overflow-hidden"
        >
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
                      checked={selectedFolios.includes(String(exit.id))}
                      onChange={() => handleToggleSelect(exit.id!)}
                      className="w-5 h-5 cursor-pointer rounded border-slate-300 
                      text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {exit.folio}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{exit.shopOrder}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {exit.partNumber}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {exit.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedFolios.length > 0 && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 
            text-white px-6 py-4 rounded-full flex items-center gap-6 z-50 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={20} className="text-emerald-400" />
              <span className="font-medium">
                {selectedFolios.length} seleccionados
              </span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 
              px-5 py-2 rounded-full font-bold transition-colors disabled:opacity-50"
            >
              <Printer size={18} />
              {isLoading ? "Generando..." : "Imprimir"}
            </button>
          </div>
        )}
      </div>

      <div
        className="hidden print:block print:absolute print:top-0 print:left-0 
        print:w-full print:bg-white print:z-9999 print:m-0 print:p-0"
      >
        <style type="text/css" media="print">
          {`
            @page { 
              size: 80mm 130mm;
              margin: 0mm;
            }
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact;
            }
          `}
        </style>

        {reportData &&
          reportData.map((report, index) => {
            let finalFolio = report.folio;
            if (typeof finalFolio === "string" && finalFolio.startsWith("{")) {
              try {
                finalFolio = JSON.parse(finalFolio).folio || report.folio;
              } catch (e) {}
            }

            return (
              <div
                key={index}
                className="relative w-[80mm] h-[130mm] box-border p-4 mx-auto 
                bg-white text-black flex flex-col justify-between 
                print:break-after-page overflow-hidden"
              >
                <div
                  className="border-b-[3px] border-black pb-2 flex justify-between 
                  items-end"
                >
                  <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
                    MESA
                  </h1>
                  <h2 className="text-sm font-bold uppercase text-right leading-none">
                    Salida
                    <br />
                    Línea 12
                  </h2>
                </div>

                <div
                  className="flex-1 flex flex-col justify-center items-center 
                  gap-4 w-full py-2"
                >
                  <div className="w-full text-center">
                    <span
                      className="text-xs font-bold uppercase tracking-widest 
                      block border-b border-black mb-1"
                    >
                      Shop Order
                    </span>
                    <span className="text-3xl font-black tracking-tight block">
                      {report.shopOrder}
                    </span>
                  </div>

                  <div className="w-full flex justify-between items-center gap-2">
                    <div className="flex-1 text-left">
                      <span
                        className="text-xs font-bold uppercase tracking-widest block 
                        border-b border-black mb-1"
                      >
                        No. Parte
                      </span>
                      <span className="text-xl font-bold block">
                        {report.partNumber}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className="text-xs font-bold uppercase tracking-widest 
                        block border-b border-black mb-1"
                      >
                        QTY
                      </span>
                      <span className="text-3xl font-black block">
                        {report.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex justify-center mt-2">
                    <Barcode
                      value={String(finalFolio)}
                      width={2.2} // Ajusta el grosor de las barras
                      height={25} // Ajusta la altura del código de barras
                      fontSize={18}
                      font="monospace"
                      textMargin={4}
                      margin={0}
                      displayValue={true}
                    />
                  </div>
                </div>

                <div
                  className="border-t-[3px] border-black pt-2 flex justify-between 
                  items-center text-xs font-bold"
                >
                  <span>{new Date().toLocaleDateString("es-MX")}</span>
                  <span>
                    {new Date().toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
