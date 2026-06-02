import { GenericEntryForm } from "../../components/UI/GenericEntryForm";

export const EntryForm3 = () => {
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
      lineId={3}
      lineName="LÍNEA 3"
      exitUrl="/salidas-l3"
      dbUrl="/base-de-datos-l3"
      resolveClient={resolveClientL4}
      isManualClient={checkManualClientL4}
    />
  );
};
