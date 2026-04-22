import { useState } from "react";
import type { ExitUpdate } from "../types/Types";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";

export const useExitMutations = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const updateExit = async (id: number, data: ExitUpdate) => {
    setIsProcessing(true);

    const loadingToast = toast.loading("Actualizando salida...");

    try {
      await lService.update(data, id);
      toast.success("Salida actualizada correctamente", { id: loadingToast });
      return true;
    } catch (error: any) {
      console.error("Error al actualizar salida:", error);

      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar el registro";

      const cleanMessage = errorMessage.replace(/^Error:\s*/, "");

      toast.error(cleanMessage, { id: loadingToast, duration: 6000 });
      return false;
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteExit = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta salida?")) {
      return false;
    }

    setIsProcessing(true);

    const loadingToast = toast.loading("Eliminando registro...");

    try {
      await lService.delete(id);
      toast.success("Salida eliminada correctamente", { id: loadingToast });

      return true;
    } catch (error) {
      console.error("Error al eliminar: ", error);
      toast.error("Error al eliminar la salida", { id: loadingToast });

      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    updateExit,
    deleteExit,
    isProcessing,
  };
};
