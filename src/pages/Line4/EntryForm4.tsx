import { GenericEntryForm } from "../../components/UI/GenericEntryForm";

export const EntryForm4 = () => {
  const resolveClientL4 = (part: string) => {
    if (part.startsWith("50TM") || part.startsWith("48LC")) {
      return "CMX-D";
    } else if (
      part.startsWith("48TC") ||
      part.startsWith("48AN") ||
      part.startsWith("38AU")
    ) {
      return "CMX-C";
    } else if (part.startsWith("34") || part.startsWith("35")) {
      return "CMX-E";
    } else {
      return "";
    }
  };

  const checkManualClientL4 = (part: string) => {
    return part.startsWith("48TM");
  };

  return (
    <GenericEntryForm
      lineId={4}
      lineName="LÍNEA 4"
      exitUrl="/salidas-l4"
      dbUrl="/base-de-datos-l4"
      resolveClient={resolveClientL4}
      isManualClient={checkManualClientL4}
    />
  );
};
