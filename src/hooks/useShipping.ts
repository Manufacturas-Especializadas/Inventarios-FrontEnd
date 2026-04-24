import { useState } from "react";
import type { CreateReleasePayload, ShippingRelease } from "../types/Types";
import { shipmentsService } from "../api/services/ShipmentsService";
import toast from "react-hot-toast";

export const useShipping = () => {
  const [activeRelease, setActiveRelease] = useState<ShippingRelease | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const createRelease = async (data: CreateReleasePayload) => {
    setIsLoading(true);

    try {
      const response = await shipmentsService.release(data);

      setActiveRelease(response);

      toast.success("Orden de liberación iniciada");

      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al iniciar la orden");

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerScan = async (scannedLabelId: string) => {
    if (!activeRelease) return false;

    try {
      const response = await shipmentsService.scan({
        shippingReleaseId: activeRelease.id,
        scannedLabelId,
      });

      setActiveRelease(response);

      if (response.status === 2) {
        toast.success("¡EMBARQUE COMPLETADO!", {
          duration: 5000,
          style: { fontSize: "24px", fontWeight: "bold" },
        });
      }

      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error de escaneo", {
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
        },
      });

      return false;
    }
  };

  const resetRelease = () => {
    setActiveRelease(null);
  };

  return {
    activeRelease,
    isLoading,
    createRelease,
    registerScan,
    resetRelease,
  };
};
