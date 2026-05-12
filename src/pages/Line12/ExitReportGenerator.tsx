import { useMemo, useState, useEffect } from "react";
import { useGenerateReport } from "../../hooks/useGenerateReport";
import type { ExitReportGeneratorProps } from "../../types/Types";
import { ExitReportSearch } from "../../components/Reports/ExitReportSearch";
import { ExitReportTable } from "../../components/Reports/ExitReportTable";
import { ExitReportFloatingButton } from "../../components/Reports/ExitReportFloatingButton";
import { ExitReportPrintLayout } from "../../components/Reports/ExitReportPrintLayout";
import { ExitReportPagination } from "../../components/Reports/ExitReportPagination";

export const ExitReportGenerator = ({
  availableExits,
}: ExitReportGeneratorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolios, setSelectedFolios] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const { fetchReportData, reportData, isLoading } = useGenerateReport();

  const filteredExits = useMemo(() => {
    return availableExits.filter((exit) =>
      Object.values(exit).some(
        (val) =>
          val && String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [availableExits, searchTerm]);

  const totalPages = Math.ceil(filteredExits.length / ITEMS_PER_PAGE);

  const paginatedExits = filteredExits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleToggleSelect = (id: string | number) => {
    const stringId = String(id);
    setSelectedFolios((prev) =>
      prev.includes(stringId)
        ? prev.filter((f) => f !== stringId)
        : [...prev, stringId],
    );
  };

  const handleGenerate = async () => {
    await fetchReportData(selectedFolios);
  };

  useEffect(() => {
    if (reportData && reportData.length > 0) {
      const style = document.createElement("style");
      style.id = "force-portrait";
      style.innerHTML = `@page { size: A4 portrait !important; margin: 10mm !important; }`;
      document.head.appendChild(style);

      window.print();

      setTimeout(() => {
        document.getElementById("force-portrait")?.remove();
      }, 1000);
    }
  }, [reportData]);

  return (
    <div className="space-y-4">
      <div className="print:hidden space-y-4">
        <ExitReportSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <ExitReportTable
          filteredExists={paginatedExits}
          selectedFolios={selectedFolios}
          handleToggleSelect={handleToggleSelect}
        />

        <ExitReportPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ExitReportFloatingButton
          selectedFolios={selectedFolios}
          isLoading={isLoading}
          handleGenerate={handleGenerate}
        />
      </div>

      <ExitReportPrintLayout reportData={reportData} />
    </div>
  );
};
