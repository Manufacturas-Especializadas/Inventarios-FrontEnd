import type { ReactNode } from "react";

interface ActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: "emerald" | "orange" | "slate" | "indigo";
  disabled?: boolean;
  className?: string;
}

export const ActionButton = ({
  onClick,
  icon,
  label,
  variant = "slate",
  disabled = false,
  className = "",
}: ActionButtonProps) => {
  const baseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm active:scale-95 disabled:opacity-50 hover:cursor-pointer print:hidden";

  const variants = {
    emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    slate: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {icon} {label}
    </button>
  );
};
