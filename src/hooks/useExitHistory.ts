import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";
import type { HistoryExits } from "../types/Types";

export const useExitHistory = (lineId: number) => {
  const [history, setHistory] = useState<HistoryExits[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await lService.getHistoryExits(lineId);
      setHistory(data);
    } catch (error) {
      console.error("Error cargando historial de salidas:", error);
      toast.error("Error al obtener el historial de salidas");
    } finally {
      setIsLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, refetch: fetchHistory };
};
