import { useState, type SyntheticEvent } from "react";
import type { EntryDetail, EntryHeader } from "../types/Types";
import { useInventoryEntry } from "./useInventoryEntry";
import toast from "react-hot-toast";

const L12_LINE_ID = 11;

export interface UIEntryRow extends Omit<
  EntryDetail,
  "client" | "boxesQuantity"
> {
  shopOrder: string;
  client?: string;
  boxesQuantity?: number;
}

const emptyRow: UIEntryRow = {
  shopOrder: "",
  partNumber: "",
  client: "",
  quantity: 0,
  boxesQuantity: 0,
};

export const useL12EntryForm = () => {
  const { submitEntry, isSubmitting } = useInventoryEntry();

  const [generatedFolios, setGeneratedFolios] = useState<
    { folio: string; shopOrder: string }[]
  >([]);
  const [details, setDetails] = useState<UIEntryRow[]>(
    Array.from({ length: 10 }, () => ({ ...emptyRow })),
  );

  const handleAddRow = () => {
    setDetails([...details, { ...emptyRow }]);
  };

  const handleRemoveRow = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleChangeDetail = (
    index: number,
    field: keyof UIEntryRow,
    value: string | number,
  ) => {
    const newDetails = [...details];
    let sanitizedValue = value;

    if (
      typeof value === "string" &&
      (field === "shopOrder" || field === "partNumber")
    ) {
      sanitizedValue = value
        .replace(/'/g, "-")
        .replace(/\?/g, "_")
        .toUpperCase();
    }

    // @ts-ignore
    newDetails[index][field] = sanitizedValue;

    if (field === "shopOrder") {
      const soValue = sanitizedValue as string;
      if (soValue.startsWith("G")) {
        newDetails[index].client = "DAIKIN";
      } else if (soValue.startsWith("LEN")) {
        newDetails[index].client = "LENNOX";
      } else {
        newDetails[index].client = "";
      }
    }

    const currentRow = newDetails[index];
    if (
      currentRow.client === "DAIKIN" &&
      currentRow.partNumber !== "0227A00293"
    ) {
      currentRow.boxesQuantity = 8;
    }

    setDetails(newDetails);
  };

  const handlePrintFolios = () => {
    if (generatedFolios.length === 0) return;

    toast.dismiss();

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        setGeneratedFolios([]);
      }, 3000);
    }, 200);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validDetails = details.filter(
      (d) => d.partNumber.trim() !== "" && d.shopOrder.trim() !== "",
    );

    if (validDetails.length === 0) return;

    const globalLoadingToast = toast.loading("Registrando entradas...");
    let allSuccess = true;
    const currentTransactionFolios: { folio: string; shopOrder: string }[] = [];

    for (const detail of validDetails) {
      const payload: EntryHeader = {
        lineId: L12_LINE_ID,
        shopOrder: detail.shopOrder,
        details: [
          {
            partNumber: detail.partNumber,
            client: detail.client || "",
            quantity: detail.quantity,
            boxesQuantity: detail.boxesQuantity || 0,
          },
        ],
      };

      const returnedFolio = await submitEntry(payload, false);

      if (!returnedFolio) {
        allSuccess = false;
        break;
      }
      currentTransactionFolios.push({
        folio: returnedFolio,
        shopOrder: detail.shopOrder,
      });
    }

    if (allSuccess) {
      toast.success("Entradas registradas correctamente", {
        id: globalLoadingToast,
      });
      setGeneratedFolios(currentTransactionFolios);
      setDetails(Array.from({ length: 10 }, () => ({ ...emptyRow })));
    } else {
      toast.error("Ocurrió un error al registrar algunas entradas", {
        id: globalLoadingToast,
      });
    }
  };

  return {
    details,
    generatedFolios,
    isSubmitting,
    handleAddRow,
    handleRemoveRow,
    handleChangeDetail,
    handleSubmit,
    handlePrintFolios,
  };
};
