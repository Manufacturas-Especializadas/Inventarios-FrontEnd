import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { lService } from "../api/services/LService";
import type { ExitHeader } from "../types/Types";
import { useInventoryExit } from "./useInventoryExit";

const INITIAL_ROWS = 10;
const createEmptyRows = (count: number) =>
  Array.from({ length: count }, () => ({
    partNumber: "",
    client: "",
    currentStock: 0,
    quantity: 0,
    errorMsg: "",
  }));

export const useExitForm = (lineId: number) => {
  const { submitExit, isSubmitting } = useInventoryExit();

  const [shopOrders, setShopOrders] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [items, setItems] = useState(createEmptyRows(INITIAL_ROWS));

  const quantityRefs = useRef<(HTMLInputElement | null)[]>([]);
  const partNumberRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getClientByPart = (part: string): string => {
    if (!part) return "";
    const upperPart = part.toUpperCase();
    if (upperPart.startsWith("50HE") || upperPart.startsWith("38AU")) {
      return "CMX-D";
    }
    return "CMX-B";
  };

  const handleShopOrderChange = (index: number, value: string) => {
    const newOrders = [...shopOrders];
    newOrders[index] = value;
    setShopOrders(newOrders);
  };

  const handlePartNumberChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].partNumber = value;
    newItems[index].client = value ? getClientByPart(value) : "";
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        partNumber: "",
        client: "",
        currentStock: 0,
        quantity: 0,
        errorMsg: "",
      },
    ]);
  };

  useEffect(() => {
    const lastIndex = items.length - 1;
    if (items[lastIndex].partNumber === "" && items.length > INITIAL_ROWS) {
      partNumberRefs.current[lastIndex]?.focus();
    }
  }, [items.length]);

  const handleKeyDownPart = async (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const partNumber = items[index].partNumber.trim();

      if (!partNumber) return;

      setItems((prev) => {
        const newItems = [...prev];
        newItems[index].errorMsg = "";
        return newItems;
      });

      const duplicateIndex = items.findIndex(
        (item, i) =>
          i !== index &&
          item.partNumber.toUpperCase() === partNumber.toUpperCase(),
      );

      if (duplicateIndex !== -1) {
        toast.error(`El número ${partNumber} ya fue escaneado arriba.`);
        setItems((prev) => {
          const errorItems = [...prev];
          errorItems[index].partNumber = "";
          errorItems[index].client = "";
          errorItems[index].currentStock = 0;
          return errorItems;
        });
        quantityRefs.current[duplicateIndex]?.focus();
        return;
      }

      try {
        const stockData = await lService.getStock(lineId, partNumber);
        const actualStock =
          stockData.stock ?? (stockData as any).data?.stock ?? 0;

        setItems((prev) => {
          const successItems = [...prev];
          successItems[index].currentStock = actualStock;
          successItems[index].errorMsg = "";
          return successItems;
        });

        if (actualStock === 0) {
          toast.error(`Atención: ${partNumber} no tiene stock disponible (0)`);
        }

        quantityRefs.current[index]?.focus();
      } catch (error: any) {
        console.error("Error al consultar API:", error);
        const errorText = error.message || String(error);
        const isNotFound =
          errorText.includes("no tiene registros") ||
          error.response?.status === 404;

        if (isNotFound) {
          const errorMessage = `Este número de parte nunca ha ingresado a la línea.`;
          toast.error(errorMessage);

          setItems((prev) => {
            const errorItems = [...prev];
            errorItems[index].partNumber = "";
            errorItems[index].errorMsg = errorMessage;
            errorItems[index].currentStock = 0;
            return errorItems;
          });
        } else {
          toast.error("Error de conexión al verificar stock");
        }
      }
    }
  };

  const handleKeyDownQuantity = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === items.length - 1 && items[index].partNumber !== "") {
        addRow();
      } else if (index < items.length - 1) {
        partNumberRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSave = async () => {
    const hasInvalidQuantities = items.some(
      (i) =>
        i.partNumber !== "" && (i.quantity > i.currentStock || i.quantity <= 0),
    );

    if (hasInvalidQuantities) {
      return toast.error(
        "Hay filas con cantidades inválidas o superiores al stock disponible.",
      );
    }

    const data: ExitHeader = {
      lineId: lineId,
      shopOrder1: shopOrders[0].trim(),
      shopOrder2: shopOrders[1].trim() || undefined,
      shopOrder3: shopOrders[2].trim() || undefined,
      shopOrder4: shopOrders[3].trim() || undefined,
      shopOrder5: shopOrders[4].trim() || undefined,
      shopOrder6: shopOrders[5].trim() || undefined,
      details: items
        .filter((i) => i.partNumber !== "" && i.quantity > 0)
        .map(({ partNumber, client, quantity }) => ({
          partNumber,
          client,
          quantity,
        })),
    };

    const success = await submitExit(data);
    if (success) {
      setItems(createEmptyRows(INITIAL_ROWS));
      setShopOrders(["", "", "", "", "", ""]);
    }
  };

  return {
    shopOrders,
    items,
    quantityRefs,
    partNumberRefs,
    isSubmitting,
    handleShopOrderChange,
    handlePartNumberChange,
    handleQuantityChange,
    handleKeyDownPart,
    handleKeyDownQuantity,
    addRow,
    handleSave,
  };
};
