import { GenericDatabaseView } from "../../components/UI/GenericDatabaseView";

export const DatabaseView3 = () => {
  return (
    <GenericDatabaseView
      lineId={3}
      lineName="LÍNEA 3"
      entryUrl="/entradas-linea-3"
      exitUrl="/salidas-l3"
    />
  );
};
