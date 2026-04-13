import { Toaster } from "react-hot-toast";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { BrowserRouter } from "react-router-dom";
import { MyRoutes } from "./routes/Routes";

export const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            background: "#363636",
            color: "#fff",
            zIndex: 9999,
          },
          success: {
            duration: 10000,
            position: "top-right",
            style: {
              background: "#10B981",
              color: "#fff",
            },
          },
          error: {
            duration: 5000,
            position: "top-right",
            style: {
              background: "#EF4444",
              color: "#fff",
            },
          },
          loading: {
            duration: Infinity,
            position: "top-right",
            style: {
              background: "#3B82F6",
              color: "#fff",
            },
          },
        }}
      />
      <MainLayout>
        <MyRoutes />
      </MainLayout>
    </BrowserRouter>
  );
};
