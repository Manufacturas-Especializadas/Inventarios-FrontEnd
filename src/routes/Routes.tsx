import { Route, Routes } from "react-router-dom";
import { EntryForm10 } from "../pages/Line10/EntryForm10";
import { ExitForm10 } from "../pages/Line10/ExitForm10";
import { DatabaseView10 } from "../pages/Line10/DatabaseView10";
import { L12EntryForm } from "../pages/Line12/L12EntryForm";
import { DatabaseView12 } from "../pages/Line12/DatabaseView12";
import { ShippingDashboard } from "../pages/Shipping/ShippingDashboard";
import { L12ExitForm } from "../pages/Line12/L12ExitForm";
import { EntryForm6 } from "../pages/Line6/EntryForm6";
import { DatabaseView6 } from "../pages/Line6/DatabaseView6";
import { EntryForm4 } from "../pages/Line4/EntryForm4";
import { DatabaseView4 } from "../pages/Line4/DatabaseView4";

export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EntryForm10 />} />
      <Route path="/salidas-l10" element={<ExitForm10 />} />
      <Route path="/base-de-datos-l10" element={<DatabaseView10 />} />

      <Route path="/entradas-linea-4" element={<EntryForm4 />} />
      <Route path="/base-de-datos-l4" element={<DatabaseView4 />} />

      <Route path="/entradas-linea-6" element={<EntryForm6 />} />
      <Route path="/base-de-datos-l6" element={<DatabaseView6 />} />

      <Route path="/entradas-linea-12" element={<L12EntryForm />} />
      <Route path="/salidas-l12" element={<L12ExitForm />} />
      <Route path="/base-de-datos-l12" element={<DatabaseView12 />} />

      <Route path="/embarques" element={<ShippingDashboard />} />
    </Routes>
  );
};
