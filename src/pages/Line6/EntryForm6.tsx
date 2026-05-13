import { GenericEntryForm } from "../../components/UI/GenericEntryForm";

export const EntryForm6 = () => {
  const resolveClientL6 = (part: string) => {
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

  const checkManualClientL6 = (part: string) => {
    return part.startsWith("48TM");
  };

  return (
    <GenericEntryForm
      lineId={5}
      lineName="LÍNEA 6"
      exitUrl="/salidas-l6"
      dbUrl="/base-de-datos-l6"
      resolveClient={resolveClientL6}
      isManualClient={checkManualClientL6}
    />
  );
};
