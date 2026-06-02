import { GenericExitForm } from "../../components/UI/GenericExitForm";

export const ExitForm3 = () => {
  return (
    <GenericExitForm
      lineId={3}
      lineName="LÍNEA 3"
      entryUrl="/entradas-linea-3"
      dbUrl="/base-de-datos-l3"
    />
  );
};
