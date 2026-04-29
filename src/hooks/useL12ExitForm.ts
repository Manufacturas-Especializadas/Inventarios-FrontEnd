import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";

const L12_LINE_ID = 11;

export const useL12ExitForm = () => {
  const [folios, setFolios] = useState<string[]>(Array(8).fill(""));
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFolioChange = (index: number, value: string) => {
    const newFolios = [...folios];
    newFolios[index] = value.toUpperCase();
    setFolios(newFolios);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (folios[index].trim() !== "") {
        if (index === folios.length - 1) {
          setFolios([...folios, ""]);
          setTimeout(() => inputRefs.current[index + 1]?.focus(), 50);
        } else {
          inputRefs.current[index + 1]?.focus();
        }
      }
    }
  };

  const handleAddRow = () => {
    setFolios([...folios, ""]);
    setTimeout(() => inputRefs.current[folios.length]?.focus(), 50);
  };

  const handleRemoveRow = (index: number) => {
    if (folios.length === 1) {
      setFolios([""]);
      return;
    }
    const newFolios = folios.filter((_, i) => i !== index);
    setFolios(newFolios);
  };

  const handleSubmit = async () => {
    const validFolios = folios.map((f) => f.trim()).filter((f) => f !== "");

    if (validFolios.length === 0) {
      toast.error("Agrega al menos un folio para procesar.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading(
      `Procesando ${validFolios.length} salida(s)...`,
    );

    let successCount = 0;
    let errors: string[] = [];

    for (const folio of validFolios) {
      try {
        await lService.createExitByFolio({
          lineId: L12_LINE_ID,
          folio: folio,
        });
        successCount++;
      } catch (error: any) {
        const msg = error.response?.data?.Message || "Error desconocido";
        errors.push(`Folio ${folio}: ${msg}`);
      }
    }

    setIsProcessing(false);

    if (errors.length === 0) {
      toast.success(`¡Se procesaron ${successCount} salida(s) correctamente!`, {
        id: toastId,
      });
      setFolios([""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      toast.error(
        `Se guardaron ${successCount}. Hubo ${errors.length} error(s).`,
        {
          id: toastId,
          duration: 6000,
        },
      );

      const failedFolios = validFolios.filter((f) =>
        errors.some((e) => e.includes(`Folio ${f}`)),
      );
      setFolios(failedFolios.length > 0 ? failedFolios : [""]);
    }
  };

  return {
    folios,
    isProcessing,
    handleFolioChange,
    handleKeyDown,
    handleAddRow,
    handleRemoveRow,
    handleSubmit,
    inputRefs,
  };
};
