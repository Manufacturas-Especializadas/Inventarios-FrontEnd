export const ReportHeader = ({ total, logo }: any) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="MESA" className="h-12 object-contain" />

          <div>
            <h1 className="text-2xl font-black tracking-tight">
              REPORTE DE SALIDAS
            </h1>

            <p className="text-sm text-gray-500">
              Línea 12 - Control de Inventario
            </p>
          </div>
        </div>

        <div className="text-right text-gray-500">
          <p>{new Date().toLocaleDateString()}</p>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>Sistema: Inventarios MESA</span>
        <span>Total registros: {total}</span>
      </div>
    </>
  );
};
