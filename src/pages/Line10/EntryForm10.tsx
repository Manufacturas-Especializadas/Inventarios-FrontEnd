import { GenericEntryForm } from "../../components/UI/GenericEntryForm";

export const EntryForm10 = () => {
  const resolveClientL10 = (part: string) => {
    if (part.startsWith("50HE") || part.startsWith("38AU")) return "CMX-D";
    return "CMX-B";
  };

  return (
    <GenericEntryForm
      lineId={10}
      lineName="LÍNEA 10"
      exitUrl="/salidas-l10"
      dbUrl="/base-de-datos-l10"
      resolveClient={resolveClientL10}
    />
  );
};
