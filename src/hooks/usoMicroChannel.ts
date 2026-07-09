import { useState } from "react";
import { microChannelService } from "../api/services/MicroChannelService";

export const useMicroChannel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerScan = async (
    code: string,
    typeMovement: "ENTRADA" | "SALIDA",
    tripNumber?: number,
    payRollNumber?: number,
  ) => {
    setIsSubmitting(true);

    try {
      await microChannelService.register({
        code,
        typeMovement,
        tripNumber,
        payRollNumber,
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message ||
        "Error de conexión con la base de datos.";

      console.error("Detalle del error:", errorMessage);

      return { success: false, errorMessage: `${code}: ${errorMessage}` };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { registerScan, isSubmitting };
};
