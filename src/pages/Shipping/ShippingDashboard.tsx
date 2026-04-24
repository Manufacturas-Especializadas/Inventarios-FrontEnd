import { useState, useRef, useEffect } from "react";
import { useShipping } from "../../hooks/useShipping";
import toast from "react-hot-toast";

export const ShippingDashboard = () => {
  const {
    activeRelease,
    isLoading,
    createRelease,
    registerScan,
    resetRelease,
  } = useShipping();

  const shopOrderRef = useRef<HTMLInputElement>(null);
  const partNumberRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const packerRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    shopOrder: "",
    partNumber: "",
    targetQuantity: "",
    packerName: "",
  });

  const [scanValue, setScanValue] = useState("");

  useEffect(() => {
    if (activeRelease && activeRelease.status === 1) {
      scannerRef.current?.focus();
    }
  }, [activeRelease]);

  useEffect(() => {
    if (activeRelease?.status === 2) {
      const timer = setTimeout(() => {
        resetRelease();
        setFormData({
          shopOrder: "",
          partNumber: "",
          targetQuantity: "",
          packerName: "",
        });

        setTimeout(() => shopOrderRef.current?.focus(), 50);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [activeRelease?.status]);

  const handleScreenClick = () => {
    if (activeRelease && activeRelease.status === 1) {
      scannerRef.current?.focus();
    }
  };

  const handleConfigKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "shopOrder" | "partNumber" | "qty" | "packer",
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (field === "shopOrder") partNumberRef.current?.focus();
      if (field === "partNumber") qtyRef.current?.focus();
      if (field === "qty") packerRef.current?.focus();
      if (field === "packer") {
        if (
          !formData.shopOrder ||
          !formData.partNumber ||
          !formData.targetQuantity ||
          !formData.packerName
        ) {
          toast.error("Faltan datos por llenar", {
            style: { fontSize: "24px" },
          });
          return;
        }

        const success = await createRelease({
          shopOrder: formData.shopOrder.toUpperCase(),
          partNumber: formData.partNumber.toUpperCase(),
          targetQuantity: parseInt(formData.targetQuantity),
          packerName: formData.packerName.toUpperCase(),
        });

        if (success) {
          setTimeout(() => scannerRef.current?.focus(), 100);
        }
      }
    }
  };

  const handleScanKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const barcode = scanValue.trim().toUpperCase();
      setScanValue("");

      if (barcode !== activeRelease?.partNumber) {
        toast.error(
          `Error: Escaneó ${barcode}, se esperaba ${activeRelease?.partNumber}`,
          {
            style: {
              background: "#ef4444",
              color: "#fff",
              fontSize: "32px",
              fontWeight: "bold",
            },
          },
        );
        return;
      }

      const success = await registerScan(barcode);

      if (success && activeRelease) {
        const newCount = activeRelease.currentScans + 1;

        if (newCount >= activeRelease.targetQuantity) {
          setTimeout(() => {
            resetRelease();
            setFormData({
              shopOrder: "",
              partNumber: "",
              targetQuantity: "",
              packerName: "",
            });
            shopOrderRef.current?.focus();
          }, 4000);
        }
      }
    }
  };

  const isActive = !!activeRelease;

  return (
    <div
      className="min-w-7xl bg-linear-to-br from-blue-50 to-slate-200 flex flex-col p-8 
      select-none"
      onClick={handleScreenClick}
    >
      <div className="flex-1 grid grid-cols-12 gap-8 relative">
        <div className="col-span-7 flex flex-col gap-8">
          <div className="bg-white/60 p-6 rounded-2xl border-2 border-slate-300 shadow-sm">
            <label className="block text-3xl text-center text-slate-600 mb-4 tracking-widest">
              SHOP ORDER
            </label>
            <input
              ref={shopOrderRef}
              disabled={isActive || isLoading}
              autoFocus
              className="w-full text-5xl p-6 border-4 border-slate-300 bg-white text-center 
              font-bold uppercase outline-none focus:border-blue-500 disabled:bg-slate-200 
              disabled:text-slate-500 transition-colors"
              value={formData.shopOrder}
              onChange={(e) =>
                setFormData({ ...formData, shopOrder: e.target.value })
              }
              onKeyDown={(e) => handleConfigKeyDown(e, "shopOrder")}
            />
          </div>

          <div className="bg-white/60 p-6 rounded-2xl border-2 border-slate-300 shadow-sm">
            <label className="block text-3xl text-center text-slate-600 mb-4 tracking-widest">
              PART NUMBER
            </label>
            <input
              ref={partNumberRef}
              disabled={isActive || isLoading}
              className="w-full text-5xl p-6 border-4 border-slate-300 bg-white text-center 
              font-bold uppercase outline-none focus:border-blue-500 disabled:bg-slate-200 
              disabled:text-slate-500 transition-colors"
              value={formData.partNumber}
              onChange={(e) =>
                setFormData({ ...formData, partNumber: e.target.value })
              }
              onKeyDown={(e) => handleConfigKeyDown(e, "partNumber")}
            />
          </div>

          <div className="bg-white/60 p-6 rounded-2xl border-2 border-slate-300 shadow-sm">
            <label className="block text-3xl text-center text-slate-600 mb-4 tracking-widest">
              EMPACADOR(A)
            </label>
            <input
              ref={packerRef}
              disabled={isActive || isLoading}
              className="w-full text-5xl p-6 border-4 border-slate-300 bg-white text-center font-bold uppercase outline-none focus:border-blue-500 disabled:bg-slate-200 disabled:text-slate-500 transition-colors"
              value={formData.packerName}
              onChange={(e) =>
                setFormData({ ...formData, packerName: e.target.value })
              }
              onKeyDown={(e) => handleConfigKeyDown(e, "packer")}
            />
          </div>
        </div>

        <div className="col-span-5 flex flex-col gap-8">
          <div className="bg-white/60 p-6 rounded-2xl border-2 border-slate-300 shadow-sm">
            <label className="block text-3xl text-center text-slate-600 mb-4 tracking-widest">
              QTY
            </label>
            <input
              ref={qtyRef}
              type="number"
              disabled={isActive || isLoading}
              className="w-full text-6xl p-6 border-4 border-slate-300 bg-white text-center 
              font-black outline-none focus:border-blue-500 disabled:bg-slate-200 
              disabled:text-slate-500 transition-colors"
              value={formData.targetQuantity}
              onChange={(e) =>
                setFormData({ ...formData, targetQuantity: e.target.value })
              }
              onKeyDown={(e) => handleConfigKeyDown(e, "qty")}
            />
          </div>

          <div
            className="flex-1 bg-white/60 p-6 rounded-2xl border-2 border-slate-300 
            shadow-sm flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-8">
              <div
                className={`border-8 px-12 py-8 bg-white text-[8rem] leading-none font-black 
                  transition-colors duration-500 ${isActive ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-400"}`}
              >
                {activeRelease?.currentScans || 0}
              </div>
              <span className="text-6xl text-slate-500 font-black">DE</span>
              <div
                className="border-8 border-slate-300 px-12 py-8 bg-white text-[8rem] 
                leading-none font-black text-slate-700"
              >
                {formData.targetQuantity || 0}
              </div>
            </div>

            <div className="mt-12 bg-blue-100 border-4 border-blue-300 p-6 w-full text-center">
              <h3 className="text-4xl font-bold text-blue-900">
                {isActive
                  ? "2- ESCANEAR NÚMEROS DE PARTE"
                  : "1- LLENAR DATOS DE ORDEN"}
              </h3>
              <p className="text-2xl text-blue-700 font-medium mt-2 tracking-widest">
                PLANTA ALUMINIO
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <input
            ref={scannerRef}
            className="absolute opacity-0 -top-10 left-0"
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            onKeyDown={handleScanKeyDown}
            autoComplete="off"
          />
        )}

        {isLoading && (
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex 
            items-center justify-center rounded-3xl"
          >
            <span className="text-5xl font-black text-white drop-shadow-lg animate-pulse">
              PREPARANDO ORDEN...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
