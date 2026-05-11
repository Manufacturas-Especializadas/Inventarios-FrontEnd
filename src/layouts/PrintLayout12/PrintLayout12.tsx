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
        width: 3,
        height: 100,
        displayValue: false,
        margin: 0,
      });
    }
  }, [value]);

  return (
    <div
      style={{
        transform: "scale(3.2, 2.8)",
        transformOrigin: "center",
        overflow: "hidden",
        height: "65mm",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        ref={svgRef}
        style={{ width: "60mm", height: "24mm", display: "block" }}
      />
    </div>
  );
};

export const PrintLayout12 = ({ foliosToPrint }: { foliosToPrint: any[] }) => {
  return (
    <div
      className="hidden print:block print:absolute print:top-0 print:left-0 print:w-full
      print:bg-white print:z-9999 print:m-0 print:p-0"
    >
      <style type="text/css" media="print">
        {`
        @page {
          size: 400mm 250mm landscape;
          margin: 0mm;
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
            className="relative mx-auto bg-white print:break-after-page overflow-hidden"
            style={{
              width: "400mm",
              height: "250mm",
              padding: "12mm 20mm",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "8mm",
              }}
            >
              <div style={{ fontSize: "20mm", fontWeight: 800, color: "#000" }}>
                {shopOrder}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10mm",
              }}
            >
              <div
                style={{
                  fontSize: "125mm",
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: "-4mm",
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
                paddingLeft: "25mm",
                paddingRight: "25mm",
                marginTop: "5mm",
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
              </div>
              <img
                src={Logo}
                alt="logo"
                style={{
                  width: "70mm",
                  objectFit: "contain",
                  marginBottom: "10mm",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
