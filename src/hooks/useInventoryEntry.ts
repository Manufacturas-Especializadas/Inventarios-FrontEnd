import { useState } from "react";
import type { EntryHeader } from "../types/Types";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";

export const useInventoryEntry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitEntry = async (data: EntryHeader) => {
    if (data.details.length === 0) {
      return toast.error("Debe agregar al menos un número de parte");
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Registrando entrada");

    try {
      await lService.create(data);

      toast.success("Entrada registrada correctamente", { id: loadingToast });

      return true;
    } catch (error: any) {
      console.error("Error en registro: ", error);
      toast.error(
        error.response?.data.message || "Error al conectar con el servidor",
        {
          id: loadingToast,
        },
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitEntry, isSubmitting };
};
