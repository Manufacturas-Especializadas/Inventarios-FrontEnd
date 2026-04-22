import { useState } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";

export const useExportExcel = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (lineId: number, lineName: string) => {
    setIsExporting(true);
    const toastId = toast.loading("Generando archivo Excel...");

    try {
      await lService.exportToExcel(lineId, lineName);
      toast.success("Excel descargado correctamente", { id: toastId });
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al generar el documento", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting };
};
