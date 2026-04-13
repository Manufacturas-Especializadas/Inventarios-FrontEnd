import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Balance } from "../types/Types";
import { l10Service } from "../api/services/L10Service";

export const useInventoryBalance = (lineId: number) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalances = async () => {
    setIsLoading(true);
    try {
      const data = await l10Service.getAll(lineId);
      setBalances(data);
    } catch (error) {
      console.error("Error cargando balance:", error);
      toast.error("Error al obtener los datos de la base de datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [lineId]);

  return { balances, isLoading, refetch: fetchBalances };
};
