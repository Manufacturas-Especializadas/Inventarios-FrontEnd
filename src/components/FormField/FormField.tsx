interface Props {
  label: string;
  value?: string | number;
  type?: string;
  placeholder?: string;
  readonly?: boolean;
}

export const FormField = ({
  label,
  value,
  type = "Text",
  placeholder,
  readonly,
}: Props) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readonly}
        className={`px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 
        text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 
        focus:border-blue-500 transition-all ${readonly ? "bg-slate-100 cursor-not-allowed" : "hover:border-slate-300"}`}
      />
    </div>
  );
};
