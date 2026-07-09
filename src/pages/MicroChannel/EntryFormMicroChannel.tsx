import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  ArrowRight,
  DatabaseIcon,
  LogOut,
  PersonStanding,
  Plus,
  Save,
} from "lucide-react";
import { FormField } from "../../components/FormField/FormField";
import toast from "react-hot-toast";
import { useMicroChannel } from "../../hooks/usoMicroChannel";

const INITIAL_ROWS = 8;
const createEmptyRows = (count: number) =>
  Array.from({ length: count }, () => ({
    code: "",
  }));

export const EntryFormMicroChannel = () => {
  const navigate = useNavigate();
  const { registerScan, isSubmitting } = useMicroChannel();

  const [items, setItems] = useState(createEmptyRows(INITIAL_ROWS));
  const [payRollNumber, setPayRollNumber] = useState("");
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
    const validItems = items.filter((i) => i.code.trim() !== "");

    if (validItems.length === 0) {
      return toast.error("No hay códigos válidos para guardar.");
    }

    if (!payRollNumber || payRollNumber.trim() === "") {
      return toast.error(
        "El número de nómina es requerido para registar entradas",
      );
    }

    const loadingToast = toast.loading(
      `Procesando entrada de ${validItems.length} contenedores...`,
    );

    let hasErrors = false;
    const newItems = [...items];

    try {
      for (let i = 0; i < items.length; i++) {
        if (items[i].code.trim() !== "") {
          const result = await registerScan(
            items[i].code,
            "ENTRADA",
            Number(payRollNumber),
          );

          if (result.success) {
            newItems[i].code = "";
          } else {
            hasErrors = true;
          }
        }
      }

      setItems(newItems);

      if (!hasErrors) {
        toast.success("Todas las entradas registradas con éxito.", {
          id: loadingToast,
        });
        setPayRollNumber("");
        setTimeout(() => codeRefs.current[0]?.focus(), 100);
      } else {
        toast.error(
          "Atención: Los códigos que quedaron en pantalla tienen problemas.",
          {
            id: loadingToast,
            duration: 5000,
          },
        );

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
        <button
          onClick={() => navigate("/salidas-microchannel")}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg 
          font-semibold hover:bg-orange-100 transition-colors shadow-sm cursor-pointer"
        >
          <LogOut size={18} /> Ir a Salidas
        </button>
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
              className="text-[10px] font-bold text-blue-500 uppercase ml-1 flex
              items-center gap-1"
            >
              <PersonStanding size={12} /> Número de nómina
            </label>
            <input
              type="number"
              value={payRollNumber}
              onChange={(e) => setPayRollNumber(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-slate-50 p-2.5 rounded-lg text-sm font-bold text-slate-800 
              outline-none transition-all focus:ring-2 focus:ring-blue-500 border border-slate-200
              placeholder:text-slate-300 placeholder:font-medium disabled:opacity-50"
              min={1}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center 
              justify-center text-white"
            >
              <ArrowRight size={18} />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-tight">
              Escaneo de Números de Partes
            </h3>
          </div>
          <span
            className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 
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
              rounded-xl shadow-sm items-center hover:border-blue-200 transition-all"
            >
              <div className="flex flex-col gap-1 w-full md:w-1/2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Código Microchannel
                </label>
                <input
                  ref={(el) => {
                    codeRefs.current[index] = el;
                  }}
                  className={`w-full bg-slate-50 p-3 rounded-lg text-lg font-mono 
                  outline-none transition-all focus:ring-2 focus:ring-blue-500 font-bold 
                    text-slate-800
                  ${isSubmitting ? "opacity-50" : ""}`}
                  value={item.code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder={`Escanear código ${index + 1}...`}
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
          text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 
          transition-all flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50"
        >
          <Plus size={20} /> Agregar más filas de escaneo
        </button>
      </section>

      <div className="fixed bottom-8 right-8 md:static flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSubmitting || items.every((i) => i.code.trim() === "")}
          className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl 
          font-bold shadow-2xl shadow-slate-300 hover:bg-black active:scale-95 transition-all 
          disabled:opacity-50 cursor-pointer"
        >
          <Save size={22} />
          {isSubmitting ? "GUARDANDO..." : "GUARDAR ENTRADAS"}
        </button>
      </div>
    </div>
  );
};
