import { ReportRow } from "./ReportRow";

export const ReportTable = ({ reportData }: any) => {
  return (
    <table className="w-full border border-gray-400 text-sm border-collapse">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="border px-3 py-2 text-left">Folio</th>
          <th className="border px-3 py-2 text-left">Shop Order</th>
          <th className="border px-3 py-2 text-left">No. Parte</th>
          <th className="border px-3 py-2 text-center">Cantidad</th>
          <th className="border px-3 py-2 text-center">Código</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((report: any, index: number) => (
          <ReportRow key={index} report={report} index={index} />
        ))}
      </tbody>
    </table>
  );
};
