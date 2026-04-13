import type { ReactNode } from "react";
import { Navbar } from "../../components/Navbar/Navbar";

interface Props {
  children?: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div
        className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] 
        background-size-[20px_20px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
      </div>
    </div>
  );
};
