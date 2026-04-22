import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";
import type { HistoryEntry } from "../types/Types";

export const useEntryHistory = (lineId: number) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await lService.getHistoryEntries(lineId);
      setHistory(data);
    } catch (error) {
      console.error("Error cargando historial de entradas:", error);
      toast.error("Error al obtener el historial de entradas");
    } finally {
      setIsLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, refetch: fetchHistory };
};
