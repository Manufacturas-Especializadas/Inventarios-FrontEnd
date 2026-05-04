import { useState } from "react";
import type { ExitReportData } from "../types/Types";
import { lService } from "../api/services/LService";
import toast from "react-hot-toast";

export const useGenerateReport = () => {
  const [reportData, setReportData] = useState<ExitReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportData = async (folios: string[]) => {
    if (folios.length === 0) {
      toast.error("Por favor, selecciona al menos un folio");

      return;
    }

    setReportData([]);
    setIsLoading(true);

    try {
      const data = await lService.generateReport(folios);

      setReportData(data);
      toast.success("Reportes generados exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Ocurrio un error al generar los reportes");
      console.error("Error fetching report data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reportData,
    isLoading,
    fetchReportData,
  };
};
