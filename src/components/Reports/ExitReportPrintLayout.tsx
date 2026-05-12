import { ReportHeader } from "./ReportHeader";
import Logo from "../../assets/logomesa.png";
import { ReportTable } from "./ReportTable";

export const ExitReportPrintLayout = ({ reportData }: any) => {
  if (!reportData || reportData.length === 0) return null;

  return (
    <>
      <style type="text/css">
        {`
        @page {
          size: A4 portrait !important;
          margin: 12mm 15mm;
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          #print-report,
          #print-report * {
            visibility: visible;
          }

          #print-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-sizing: border-box;
            background: white;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          tr {
            page-break-inside: avoid;
          }
        }
      `}
      </style>

      <div id="print-report" className="hidden print:block text-black">
        <div className="w-full font-sans">
          <ReportHeader total={reportData.length} logo={Logo} />
          <div className="mt-4">
            <ReportTable reportData={reportData} />
          </div>
        </div>
      </div>
    </>
  );
};
