import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";
import type { ReportLog } from "../types/Types";

export const useTransitReports = (lineId: number) => {
  const [logs, setLogs] = useState<ReportLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await lService.getReportLogs(lineId);
      setLogs(data);
    } catch (error: any) {
      console.error("Error al cargar folios en tránsito", error);
      toast.error("No se pudieron cargar los reportes en tránsito.");
    } finally {
      setIsLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    fetchLogs,
  };
};
