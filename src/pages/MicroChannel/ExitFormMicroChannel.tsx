import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  DatabaseIcon,
  // LogIn,
  Plus,
  Save,
  Truck,
} from "lucide-react";
import { FormField } from "../../components/FormField/FormField";
import { useMicroChannel } from "../../hooks/usoMicroChannel";
import toast from "react-hot-toast";

const INITIAL_ROWS = 8;
const createEmptyRows = (count: number) =>
  Array.from({ length: count }, () => ({
    code: "",
  }));

export const ExitFormMicroChannel = () => {
  const navigate = useNavigate();
  const { registerScan, isSubmitting } = useMicroChannel();

  const [items, setItems] = useState(createEmptyRows(INITIAL_ROWS));
  const [tripNumber, setTripNumber] = useState("");
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const today = new Date().toLocaleDateString("es-Mx", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleCodeChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].code = value.replace(/'/g, "-").toUpperCase();
    setItems(newItems);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();

      const currentCode = e.currentTarget.value
        .replace(/'/g, "-")
        .toUpperCase()
        .trim();

      if (!currentCode) {
        if (index === items.length - 1) {
          addRow();
        } else if (index < items.length - 1) {
          codeRefs.current[index + 1]?.focus();
        }
        return;
      }

      let isDuplicate = false;
      for (let i = 0; i < codeRefs.current.length; i++) {
        if (i !== index && codeRefs.current[i]) {
          const otherValue = codeRefs.current[i]!.value.replace(/'/g, "-")
            .toUpperCase()
            .trim();
          if (otherValue === currentCode) {
            isDuplicate = true;
            break;
          }
        }
      }

      if (isDuplicate) {
        toast.error(`El código ${currentCode} ya está en la lista.`);

        const newItems = [...items];
        newItems[index].code = "";
        setItems(newItems);

        if (codeRefs.current[index]) {
          codeRefs.current[index]!.value = "";
        }

        setTimeout(() => codeRefs.current[index]?.focus(), 50);
        return;
      }

      if (index === items.length - 1) {
        addRow();
      } else if (index < items.length - 1) {
        codeRefs.current[index + 1]?.focus();
      }
    }
  };

  const addRow = () => {
    setItems([...items, { code: "" }]);
    setTimeout(() => {
      codeRefs.current[items.length]?.focus();
    }, 50);
  };

  const handleSave = async () => {
    setApiErrors([]);

    const validItems = items.filter((i) => i.code.trim() !== "");

    if (validItems.length === 0) {
      return toast.error("No hay códigos válidos para guardar.");
    }

    if (!tripNumber || tripNumber.trim() === "") {
      return toast.error(
        "El número de viaje es obligatorio para registrar la salida",
      );
    }

    const loadingToast = toast.loading(
      `Procesando ${validItems.length} contenedores...`,
    );

    let newItems = [...items];
    const errors: string[] = [];

    try {
      for (let i = 0; i < items.length; i++) {
        if (items[i].code.trim() !== "") {
          const result = await registerScan({
            code: items[i].code,
            typeMovement: "SALIDA",
            tripNumber: Number(tripNumber),
          });

          if (result.success) {
            newItems[i].code = "";
          } else {
            errors.push(result.errorMessage!);
          }
        }
      }

      setItems(newItems);

      if (errors.length === 0) {
        toast.success("Todas las salidas registradas con éxito.", {
          id: loadingToast,
        });
        setTripNumber("");
        setTimeout(() => codeRefs.current[0]?.focus(), 100);
      } else {
        toast.dismiss(loadingToast);

        setApiErrors(errors);

        errors.forEach((err) => {
          toast.error(err, { duration: 6000 });
        });

        const firstErrorIndex = newItems.findIndex((i) => i.code.trim() !== "");
        if (firstErrorIndex !== -1) {
          setTimeout(() => codeRefs.current[firstErrorIndex]?.focus(), 100);
        }
      }
    } catch (error) {
      toast.error("Error crítico al guardar.", { id: loadingToast });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none">
      <div className="flex justify-end gap-3 pb-2 border-b border-slate-200">
        {/* <button
          onClick={() => navigate("/entradas-microchannel")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg 
          font-semibold hover:bg-blue-100 transition-colors shadow-sm cursor-pointer"
        >
          <LogIn size={18} /> Ir a Entradas
        </button> */}
        <button
          onClick={() => navigate("/base-de-datos-microchannel")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg 
          font-semibold hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
        >
          <DatabaseIcon size={18} /> Base de Datos
        </button>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <FormField label="Fecha" value={today} readonly />
          <FormField label="Línea" value="LÍNEA 6 - MICROCHANNEL" readonly />

          <div className="flex flex-col gap-1 w-full">
            <label
              className="text-[10px] font-bold text-orange-500 uppercase ml-1 flex
              items-center gap-1"
            >
              <Truck size={12} /> Número de viaje
            </label>
            <input
              type="number"
              value={tripNumber}
              onChange={(e) => setTripNumber(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-slate-50 p-2.5 rounded-lg text-sm font-bold text-slate-800 
              outline-none transition-all focus:ring-2 focus:ring-orange-500 border border-slate-200
              placeholder:text-slate-300 placeholder:font-medium disabled:opacity-50"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-orange-500 flex items-center 
              justify-center text-white"
            >
              <ArrowLeft size={18} />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-tight">
              Escaneo de Salidas (Microchannel)
            </h3>
          </div>
          <span
            className="text-xs font-medium text-orange-600 bg-orange-100 px-3 py-1 
            rounded-full"
          >
            Modo Scanner Activo
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 p-3 bg-white border border-slate-200 
              rounded-xl shadow-sm items-center hover:border-orange-200 transition-all"
            >
              <div className="flex flex-col gap-1 w-full md:w-1/2">
                <label className="text-[10px] font-bold text-orange-500 uppercase ml-1">
                  Código Microchannel
                </label>
                <input
                  ref={(el) => {
                    codeRefs.current[index] = el;
                  }}
                  className={`w-full bg-orange-50/30 p-3 rounded-lg text-lg font-mono 
                  outline-none transition-all focus:ring-2 focus:ring-orange-500 font-bold 
                    text-slate-800
                  ${isSubmitting ? "opacity-50" : ""}`}
                  value={item.code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder={`Escanear salida ${index + 1}...`}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          type="button"
          disabled={isSubmitting}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl 
          text-slate-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50/50 
          transition-all flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50"
        >
          <Plus size={20} /> Agregar más filas de escaneo
        </button>
      </section>

      <div className="fixed bottom-8 right-8 md:static flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSubmitting || items.every((i) => i.code.trim() === "")}
          className="flex items-center gap-3 bg-orange-600 text-white px-10 py-4 rounded-2xl 
          font-bold shadow-xl shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all 
          disabled:opacity-50 cursor-pointer"
        >
          <Save size={22} />
          {isSubmitting ? "GUARDANDO..." : "CONFIRMAR SALIDAS"}
        </button>
      </div>
    </div>
  );
};
