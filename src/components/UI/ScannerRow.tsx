import React from "react";

interface ScannerRowProps {
  index: number;
  partNumber: string;
  quantity: number | "";
  client: string;
  onPartChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  quantityRef: (el: HTMLInputElement | null) => void;
}

export const ScannerRow = ({
  partNumber,
  quantity,
  client,
  onPartChange,
  onQuantityChange,
  onKeyDown,
  quantityRef,
}: ScannerRowProps) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-white border border-slate-200 
      rounded-xl shadow-sm items-center hover:border-blue-200 transition-colors"
    >
      <div className="col-span-12 md:col-span-5">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
          No. Parte
        </label>
        <input
          className="w-full bg-slate-50 p-2 rounded-lg text-sm font-mono outline-none focus:ring-2 
          focus:ring-blue-500 transition-all uppercase"
          value={partNumber}
          onChange={(e) => onPartChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escanear..."
        />
      </div>

      <div className="col-span-6 md:col-span-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
          Cantidad
        </label>
        <input
          ref={quantityRef}
          type="number"
          className="w-full bg-blue-50 p-2 rounded-lg text-sm font-bold text-blue-700 outline-none 
          focus:ring-2 focus:ring-blue-600 transition-all text-right"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          placeholder="0"
        />
      </div>

      <div className="col-span-6 md:col-span-4">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
          Cliente
        </label>
        <div
          className="w-full bg-slate-100 p-2 rounded-lg text-sm text-slate-600 font-medium 
          h-9 flex items-center"
        >
          {client || <span className="text-slate-300">---</span>}
        </div>
      </div>
    </div>
  );
};
