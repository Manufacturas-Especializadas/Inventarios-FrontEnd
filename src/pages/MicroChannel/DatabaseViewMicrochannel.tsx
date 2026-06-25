import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { microChannelService } from "../../api/services/MicroChannelService";
import type { MicroChannelList } from "../../types/Types";
import { DataTable } from "../../components/UI/DatabaseViewMicrochannelUI/DataTable";
import { SearchBar } from "../../components/UI/DatabaseViewMicrochannelUI/SearchBar";
import { SummaryCards } from "../../components/UI/DatabaseViewMicrochannelUI/SummaryCards";

export const DatabaseViewMicrochannel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MicroChannelList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await microChannelService.getList();
      setData(result);
    } catch (error: any) {
      toast.error("Error al cargar la base de datos.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredData = data.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 select-none">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 
        border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center 
            justify-center shadow-sm"
          >
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Base de Datos
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Línea 6 - Control de Contenedores Retornables
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 
            rounded-lg font-semibold hover:bg-slate-200 transition-colors shadow-sm 
            active:scale-95"
            title="Actualizar datos"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => navigate("/entradas-microchannel")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
            rounded-lg font-semibold hover:bg-blue-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Volver a Entradas
          </button>
        </div>
      </div>

      <SummaryCards data={data} isLoading={isLoading} />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredData.length}
      />

      <DataTable
        currentItems={currentItems}
        isLoading={isLoading}
        searchTerm={searchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        totalFilteredCount={filteredData.length}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
