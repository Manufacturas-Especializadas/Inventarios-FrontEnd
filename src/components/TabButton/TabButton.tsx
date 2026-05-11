import type { ReactNode } from "react";

interface Props {
  isActive: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  activeColorClass: string;
}

export const TabButton = ({
  isActive,
  onClick,
  icon,
  label,
  activeColorClass,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-all 
        print:hidden ${
          isActive
            ? `bg-white ${activeColorClass} border-t border-l border-r
        border-slate-200 -mb-px`
            : "text-slate-500 hover:bg-slate-50"
        }`}
    >
      {icon}
      {label}
    </button>
  );
};
