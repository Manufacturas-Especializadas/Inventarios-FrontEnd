import { Box, Package, ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { MicroChannelList } from "../../../types/Types";

interface SummaryCardsProps {
  data: MicroChannelList[];
  isLoading: boolean;
}

export const SummaryCards = ({ data, isLoading }: SummaryCardsProps) => {
  const totalCount = data.length;

  const grisesEnMesa = data.filter(
    (d) =>
      d.code.startsWith("CONT-") &&
      (d.status === "EN MESA" || d.status === "ADENTRO"),
  ).length;
  const grisesFuera = data.filter(
    (d) =>
      d.code.startsWith("CONT-") &&
      (d.status === "FUERA DE MESA" || d.status === "AFUERA"),
  ).length;

  const naranjasEnMesa = data.filter(
    (d) =>
      d.code.startsWith("CTNA-") &&
      (d.status === "EN MESA" || d.status === "ADENTRO"),
  ).length;
  const naranjasFuera = data.filter(
    (d) =>
      d.code.startsWith("CTNA-") &&
      (d.status === "FUERA DE MESA" || d.status === "AFUERA"),
  ).length;

  const azulesEnMesa = data.filter(
    (d) =>
      d.code.startsWith("CTAZ-") &&
      (d.status === "EN MESA" || d.status === "ADENTRO"),
  ).length;
  const azulesFuera = data.filter(
    (d) =>
      d.code.startsWith("CTAZ-") &&
      (d.status === "FUERA DE MESA" || d.status === "AFUERA"),
  ).length;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex 
        flex-col justify-center gap-2"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center 
            justify-center border border-slate-100"
          >
            <Box size={20} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Total (Todos)
          </p>
        </div>
        <p className="text-4xl font-black text-slate-800 leading-none pl-1 mt-2">
          {isLoading ? "-" : totalCount}
        </p>
      </div>

      <div
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex 
        flex-col justify-between"
      >
        <div className="flex items-center gap-2 mb-2">
          <Package size={16} className="text-slate-400" />
          <p className="text-xs font-black text-slate-600 uppercase tracking-widest">
            Grises Microchannel
          </p>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <ArrowDownRight size={12} /> EN MESA
            </span>
            <span className="text-2xl font-black text-slate-800">
              {isLoading ? "-" : grisesEnMesa}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
              <ArrowUpRight size={12} /> FUERA
            </span>
            <span className="text-2xl font-black text-slate-800">
              {isLoading ? "-" : grisesFuera}
            </span>
          </div>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex 
        flex-col justify-between"
      >
        <div className="flex items-center gap-2 mb-2">
          <Package size={16} className="text-orange-400" />
          <p className="text-xs font-black text-orange-600 uppercase tracking-widest">
            Contenedores Naranjas
          </p>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <ArrowDownRight size={12} /> EN MESA
            </span>
            <span className="text-2xl font-black text-slate-800">
              {isLoading ? "-" : naranjasEnMesa}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
              <ArrowUpRight size={12} /> FUERA
            </span>
            <span className="text-2xl font-black text-slate-800">
              {isLoading ? "-" : naranjasFuera}
            </span>
          </div>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex 
        flex-col justify-between"
      >
        <div className="flex items-center gap-2 mb-2">
          <Package size={16} className="text-blue-500" />
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
            Contenedores Azules
          </p>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <ArrowDownRight size={12} /> EN MESA
            </span>
            <span className="text-2xl font-black text-slate-800">
              {isLoading ? "-" : azulesEnMesa}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
              <ArrowUpRight size={12} /> FUERA
            </span>
            <span className="text-2xl font-black text-slate-800">
              {isLoading ? "-" : azulesFuera}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
