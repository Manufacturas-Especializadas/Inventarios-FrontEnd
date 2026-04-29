import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";

const L12_LINE_ID = 11;

export const useL12ExitForm = () => {
  const [folios, setFolios] = useState<string[]>(Array(8).fill(""));
  const [folioDetails, setFolioDetails] = useState<Record<number, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFolioChange = (index: number, value: string) => {
    const newFolios = [...folios];
    newFolios[index] = value.toUpperCase();
    setFolios(newFolios);

    if (value === "") {
      const newDetails = { ...folioDetails };
      delete newDetails[index];
      setFolioDetails(newDetails);
    }
  };

  const handleKeyDown = async (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter" || e.key === "Tab") {
      const currentFolio = folios[index].trim();

      if (currentFolio !== "") {
        e.preventDefault();

        try {
          const toastId = toast.loading("Buscando folio...");
          const preview = await lService.getFolioPreview(
            L12_LINE_ID,
            currentFolio,
          );
          toast.dismiss(toastId);

          setFolioDetails((prev) => ({ ...prev, [index]: preview }));

          if (index === folios.length - 1) {
            setFolios([...folios, ""]);
            setTimeout(() => inputRefs.current[index + 1]?.focus(), 50);
          } else {
            inputRefs.current[index + 1]?.focus();
          }
        } catch (error: any) {
          toast.dismiss();
          const msg = error.response?.data?.Message || "Folio no encontrado";
          toast.error(msg);

          const newDetails = { ...folioDetails };
          delete newDetails[index];
          setFolioDetails(newDetails);

          inputRefs.current[index]?.select();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
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
      setFolioDetails({});
      return;
    }
    const newFolios = folios.filter((_, i) => i !== index);
    setFolios(newFolios);

    const newDetails: Record<number, any> = {};
    newFolios.forEach((f, i) => {
      const oldIndex = folios.indexOf(f);
      if (oldIndex !== -1 && folioDetails[oldIndex]) {
        newDetails[i] = folioDetails[oldIndex];
      }
    });
    setFolioDetails(newDetails);
  };

  const handleSubmit = async () => {
    const validIndexes = folios
      .map((f, i) => (f.trim() !== "" && folioDetails[i] ? i : -1))
      .filter((i) => i !== -1);

    if (validIndexes.length === 0) {
      toast.error("Por favor escanea y valida al menos un folio.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading(
      `Procesando ${validIndexes.length} salida(s)...`,
    );

    let successCount = 0;
    let errors: string[] = [];

    for (const index of validIndexes) {
      try {
        await lService.createExitByFolio({
          lineId: L12_LINE_ID,
          folio: folios[index].trim(),
        });
        successCount++;
      } catch (error: any) {
        const msg = error.response?.data?.message || "Error desconocido";
        errors.push(`Folio ${folios[index]}: ${msg}`);
      }
    }

    setIsProcessing(false);

    if (errors.length === 0) {
      toast.success(`¡Se procesaron ${successCount} salida(s) correctamente!`, {
        id: toastId,
      });
      setFolios(Array(8).fill(""));
      setFolioDetails({});
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      toast.error(
        `Se guardaron ${successCount}. Hubo ${errors.length} error(s).`,
        { id: toastId, duration: 6000 },
      );
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
    folioDetails,
  };
};
