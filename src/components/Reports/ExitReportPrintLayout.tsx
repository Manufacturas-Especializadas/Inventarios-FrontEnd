import { ReportHeader } from "./ReportHeader";
import Logo from "../../assets/logomesa.png";
import { ReportTable } from "./ReportTable";
import { paginateReport } from "../../utils/paginateReport";

export const ExitReportPrintLayout = ({ reportData }: any) => {
  if (!reportData || reportData.length === 0) return null;

  const pages = paginateReport(reportData, 12);

  return (
    <>
      <style type="text/css" media="print">
        {`
          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {
            html, body {
              margin: 0;
              padding: 0;
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
              right: 0;
              width: auto;
            }

            .print-page {
              width: 100%;
              min-height: 297mm;
              padding: 10mm;
              box-sizing: border-box;
              page-break-after: always;
              background: white;
            }

            .print-page:last-child {
              page-break-after: auto;
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
        {pages.map((pageData, pageIndex) => (
          <div key={pageIndex} className="print-page font-sans">
            <div className="w-full">
              <ReportHeader total={reportData.length} logo={Logo} />

              <div className="mt-5">
                <ReportTable reportData={pageData} />
              </div>

              <div className="mt-8 flex justify-end text-sm text-slate-500 font-medium">
                Página {pageIndex + 1} de {pages.length}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
