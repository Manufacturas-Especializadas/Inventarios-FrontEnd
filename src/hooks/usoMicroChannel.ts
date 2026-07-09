import { useState } from "react";
import { microChannelService } from "../api/services/MicroChannelService";
import type { ScanPayload } from "../types/Types";

export const useMicroChannel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return { registerScan, isSubmitting };
};
