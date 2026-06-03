import { GenericEntryForm } from "../../components/UI/GenericEntryForm";

export const EntryForm8 = () => {
  const resolveClientL9 = (part: string) => {
    if (
      part.startsWith("138") ||
      part.startsWith("618") ||
      part.startsWith("619") ||
      part.startsWith("621") ||
      part.startsWith("800") ||
      part.startsWith("801") ||
      part.startsWith("138") ||
      part.startsWith("608") ||
      part.startsWith("250") ||
      part.startsWith("601")
    ) {
      return "FRIEDRICH";
    } else {
      return "";
    }
  };

  return (
    <GenericEntryForm
      lineId={7}
      lineName="LÍNEA 8"
      exitUrl="/salidas-l8"
      dbUrl="/base-de-datos-l8"
      resolveClient={resolveClientL9}
    />
  );
};
