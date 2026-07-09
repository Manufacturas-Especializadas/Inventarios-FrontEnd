import { useCallback, useState } from "react";
import { microChannelService } from "../api/services/MicroChannelService";
import type {
  DesactivatePayload,
  MicroChannelList,
  ScanPayload,
} from "../types/Types";

export const useMicroChannel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [containersList, setContainersList] = useState<MicroChannelList[]>([]);

  const fetchContainers = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await microChannelService.getList();
      setContainersList(data);
      return { success: true, data };
    } catch (error: any) {
      console.error("Error cargando la lista:", error);
      return {
        success: false,
        errorMessage: "Error al cargar la base de datos.",
      };
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  const registerScan = async (payload: ScanPayload) => {
    setIsSubmitting(true);
    try {
      await microChannelService.register(payload);
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message ||
        "Error de conexión.";
      return {
        success: false,
        errorMessage: `${payload.code}: ${errorMessage}`,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deactivateContainer = async (payload: DesactivatePayload) => {
    setIsSubmitting(true);
    try {
      await microChannelService.deactivate(payload);
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message ||
        "Error al desactivar el contenedor.";
      return {
        success: false,
        errorMessage: `${errorMessage}`,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    registerScan,
    deactivateContainer,
    fetchContainers,
    containersList,
    isLoadingList,
    isSubmitting,
  };
};
