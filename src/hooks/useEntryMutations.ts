import { useState } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";
import type { EntryUpdate } from "../types/Types";

export const useEntryMutations = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const updateEntry = async (id: number, data: EntryUpdate) => {
    setIsProcessing(true);
    const loadingToast = toast.loading("Actualizando entrada...");

    try {
      await lService.updateEntries(data, id);
      toast.success("Entrada actualizada correctamente", { id: loadingToast });
      return true;
    } catch (error) {
      console.error("Error al actualizar entrada:", error);
      toast.error("Error al actualizar el registro", { id: loadingToast });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteEntry = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar esta entrada? El stock se recalculará automáticamente.",
      )
    ) {
      return false;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Eliminando registro...");

    try {
      await lService.deleteEntries(id);
      toast.success("Entrada eliminada correctamente", { id: loadingToast });
      return true;
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
      toast.error("Error al eliminar el registro", { id: loadingToast });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { updateEntry, deleteEntry, isProcessing };
};
