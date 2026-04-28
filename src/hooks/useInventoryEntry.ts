import { useState } from "react";
import type { EntryHeader } from "../types/Types";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";

export const useInventoryEntry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitEntry = async (
    data: EntryHeader,
    showToast: boolean = true,
  ): Promise<string | false> => {
    if (data.details.length === 0) {
      toast.error("Debe agregar al menos un número de parte");
      return false;
    }

    setIsSubmitting(true);
    let loadingToast: string | undefined;

    if (showToast) {
      loadingToast = toast.loading("Registrando entrada");
    }

    try {
      const response = await lService.create(data);

      if (showToast) {
        toast.success("Entrada registrada correctamente", { id: loadingToast });
      }
      return response;
    } catch (error: any) {
      console.error("Error en registro: ", error);

      if (showToast) {
        toast.error(
          error.response?.data?.message || "Error al conectar con el servidor",
          {
            id: loadingToast,
          },
        );
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitEntry, isSubmitting };
};
