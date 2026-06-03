import { GenericEntryForm } from "../../components/UI/GenericEntryForm";

export const EntryForm9 = () => {
  const resolveClientL9 = (part: string) => {
    if (part.startsWith("63") || part.startsWith("64")) {
      return "BOSH";
    } else {
      return "";
    }
  };

  return (
    <GenericEntryForm
      lineId={8}
      lineName="LÍNEA 9"
      exitUrl="/salidas-l9"
      dbUrl="/base-de-datos-l9"
      resolveClient={resolveClientL9}
    />
  );
};
