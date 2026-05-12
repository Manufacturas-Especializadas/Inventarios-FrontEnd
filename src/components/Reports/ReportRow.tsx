import Barcode from "react-barcode";

export const ReportRow = ({ report, index }: any) => {
  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="border px-3 py-4 font-bold">{report.folio}</td>

      <td className="border px-3 py-4">{report.shopOrder}</td>

      <td className="border px-3 py-4">{report.partNumber}</td>

      <td className="border px-3 py-4 text-center font-bold">
        {report.quantity}
      </td>

      <td className="border px-3 py-4 text-center font-bold">
        <div className="flex justify-center">
          <Barcode
            value={String(report.folio)}
            width={2}
            height={50}
            displayValue={false}
            margin={0}
          />
        </div>
      </td>
    </tr>
  );
};
