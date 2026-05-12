import { ReportRow } from "./ReportRow";

export const ReportTable = ({ reportData }: any) => {
  return (
    <table className="w-full max-w-none table-fixed border-collapse text-[14px]">
      <colgroup>
        <col style={{ width: "12%" }} />
        <col style={{ width: "22%" }} />
        <col style={{ width: "22%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "30%" }} />
      </colgroup>
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
