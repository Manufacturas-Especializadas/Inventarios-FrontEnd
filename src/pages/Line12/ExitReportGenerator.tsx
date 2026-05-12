import { useMemo, useState, useEffect } from "react";
import { useGenerateReport } from "../../hooks/useGenerateReport";
import type { ExitReportGeneratorProps } from "../../types/Types";
import { ExitReportSearch } from "../../components/Reports/ExitReportSearch";
import { ExitReportTable } from "../../components/Reports/ExitReportTable";
import { ExitReportFloatingButton } from "../../components/Reports/ExitReportFloatingButton";
import { ExitReportPrintLayout } from "../../components/Reports/ExitReportPrintLayout";

export const ExitReportGenerator = ({
  availableExits,
}: ExitReportGeneratorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolios, setSelectedFolios] = useState<string[]>([]);
  const { fetchReportData, reportData, isLoading } = useGenerateReport();

  const filteredExits = useMemo(() => {
    return availableExits.filter((exit) =>
      Object.values(exit).some(
        (val) =>
          val && String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [availableExits, searchTerm]);

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
      window.print();
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
          filteredExists={filteredExits}
          selectedFolios={selectedFolios}
          handleToggleSelect={handleToggleSelect}
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
