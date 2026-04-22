import { Route, Routes } from "react-router-dom";
import { EntryForm10 } from "../pages/Line10/EntryForm10";
import { ExitForm10 } from "../pages/Line10/ExitForm10";
import { DatabaseView10 } from "../pages/Line10/DatabaseView10";
import { L12EntryForm } from "../pages/Line12/L12EntryForm";

export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EntryForm10 />} />
      <Route path="/salidas-l10" element={<ExitForm10 />} />
      <Route path="/base-de-datos-l10" element={<DatabaseView10 />} />

      <Route path="/entradas-linea-12" element={<L12EntryForm />} />
    </Routes>
  );
};
