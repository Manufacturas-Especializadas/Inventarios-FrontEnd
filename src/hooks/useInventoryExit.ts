import { useState } from "react";
import type { ExitHeader } from "../types/Types";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";

export const useInventoryExit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitExit = async (data: ExitHeader) => {
    if (!data.shopOrder1 || data.shopOrder1.trim() === "") {
      toast.error("La Shop Order es obligatoria");

      return false;
    }

    if (data.details.length === 0) {
      toast.error("Debe agregar al menos un número de parte válido");
      return false;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Registrando salida...");

    try {
      await lService.createExit(data);
      toast.success("Salida registrada correctamente", { id: loadingToast });

      return true;
    } catch (error: any) {
      console.error("Error en salida: ", error);
      toast.error("Error al registrar la salida: ", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitExit, isSubmitting };
};
