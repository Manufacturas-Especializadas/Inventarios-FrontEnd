import JsBarcode from "jsbarcode";
import { useRef, useEffect } from "react";
import Logo from "../../assets/logomesa.png";

const PrintBarcode = ({ value }: { value: string }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        lineColor: "#000",
        width: 1.5,
        height: 24,
        displayValue: false,
        margin: 0,
      });
    }
  }, [value]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: "32mm",
        height: "8mm",
        display: "block",
      }}
    />
  );
};

export const PrintLayout12 = ({ foliosToPrint }: { foliosToPrint: any[] }) => {
  return (
    <div
      className="hidden print:block print:absolute print:top-0 print:left-0
      print:w-full print:bg-white print:z-9999 print:m-0 print:p-0"
    >
      <style type="text/css" media="print">
        {`
          @page {
            size: landscape;
            margin: 0;
          }

          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
        `}
      </style>

      {foliosToPrint.map((item, index) => {
        let rawFolio: any = item.folio || item;

        if (typeof rawFolio === "string" && rawFolio.startsWith("{")) {
          try {
            rawFolio = JSON.parse(rawFolio);
          } catch (e) {}
        }

        const folioString =
          typeof rawFolio === "object" && rawFolio !== null
            ? rawFolio.id || rawFolio.folio
            : rawFolio;

        const shopOrder = item.shopOrder || "";
        const folioText = String(folioString).split("-").pop();

        return (
          <div
            key={index}
            className="relative mx-auto bg-white overflow-hidden"
            style={{
              width: "100vw",
              height: "100vh",
              padding: "5mm 10mm 2mm 10mm",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              gap: "2mm",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-center",
              }}
            >
              <div
                style={{
                  fontSize: "4mm",
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                {shopOrder}
              </div>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "20mm",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-1mm",
                  color: "#000",
                }}
              >
                {folioText}
              </div>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingLeft: "5mm",
                paddingRight: "5mm",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PrintBarcode value={String(folioString)} />

                {/* <div
                  style={{
                    fontSize: "3.5mm",
                    fontWeight: 700,
                    marginTop: "0.5mm",
                    letterSpacing: "0.5mm",
                  }}
                >
                  {folioText}
                </div> */}
              </div>

              <img
                src={Logo}
                alt="logo"
                style={{
                  width: "18mm",
                  objectFit: "contain",
                  marginBottom: "1mm",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
