import { API_CONFIG } from "../../config/api";
import type {
  Balance,
  EntryHeader,
  EntryUpdate,
  ExitByFolio,
  ExitHeader,
  ExitReportData,
  ExitUpdate,
  FtnBalanceItem,
  HistoryEntry,
  HistoryExits,
  ReportLog,
  Stock,
} from "../../types/Types";
import { apiClient } from "../client";

class LService {
  private getAllEndpoint = API_CONFIG.endpoints.Lines.getAll;
  private getHistoryEntriesEndpoint = API_CONFIG.endpoints.Lines.historyEntries;
  private getHistoryExitsEndpoint = API_CONFIG.endpoints.Lines.historyExits;
  private getFtnBalanceEndpoint = API_CONFIG.endpoints.Lines.ftnBalance;
  private exportToExcelEndpoint = API_CONFIG.endpoints.Lines.export;
  private stockEndpoint = API_CONFIG.endpoints.Lines.stock;
  private previewFolioEndpoint = API_CONFIG.endpoints.Lines.previewExits;
  private reconcileEndpoint = API_CONFIG.endpoints.Lines.reconcile;
  private createEndpoint = API_CONFIG.endpoints.Lines.entries;
  private updateEntriesEndpoint = API_CONFIG.endpoints.Lines.updateEntries;
  private deleteEntriesEndpoint = API_CONFIG.endpoints.Lines.deleteEntries;
  private createExitEndpoint = API_CONFIG.endpoints.Lines.exits;
  private createExitByFolioEndpoint = API_CONFIG.endpoints.Lines.exitByFolio;
  private generateReportEndpoint = API_CONFIG.endpoints.Lines.generateReport;
  private reportLogsEndpoint = API_CONFIG.endpoints.Lines.reportLogs;
  private updateExitEndpoint = API_CONFIG.endpoints.Lines.update;
  private deleteExitEndpoint = API_CONFIG.endpoints.Lines.delete;

  async getAll(lineId: number): Promise<Balance[]> {
    return apiClient.get<Balance[]>(`${this.getAllEndpoint}${lineId}`);
  }

  async exportToExcel(lineId: number, lineName: string): Promise<void> {
    const response: any = await apiClient.get(
      `${this.exportToExcelEndpoint}${lineId}?lineName=${encodeURIComponent(lineName)}`,
      { responseType: "blob" },
    );

    const blob = response.data
      ? new Blob([response.data])
      : new Blob([response]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    link.setAttribute(
      "download",
      `Reporte_${lineName.replace(" ", "_")}_${dateStr}.xlsx`,
    );

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }

  async reconcileFtn(lineId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<any>(`${this.reconcileEndpoint}${lineId}`, formData);
  }

  async getHistoryEntries(lineId: number): Promise<HistoryEntry[]> {
    return apiClient.get<HistoryEntry[]>(
      `${this.getHistoryEntriesEndpoint}${lineId}`,
    );
  }

  async getHistoryExits(lineId: number): Promise<HistoryExits[]> {
    return apiClient.get<HistoryExits[]>(
      `${this.getHistoryExitsEndpoint}${lineId}`,
    );
  }

  async getStock(lineId: number, partNumber: string): Promise<Stock> {
    return apiClient.get<Stock>(`${this.stockEndpoint}${lineId}/${partNumber}`);
  }

  async getFolioPreview(lineId: number, folio: string): Promise<any> {
    return apiClient.get<any>(`${this.previewFolioEndpoint}${lineId}/${folio}`);
  }

  async getReportLogs(lineId: number): Promise<ReportLog[]> {
    return apiClient.get<ReportLog[]>(`${this.reportLogsEndpoint}${lineId}`);
  }

  async getFtnBalance(lineId: number): Promise<FtnBalanceItem[]> {
    return apiClient.get<FtnBalanceItem[]>(
      `${this.getFtnBalanceEndpoint}${lineId}`,
    );
  }

  async create(data: EntryHeader) {
    return apiClient.post<string>(this.createEndpoint, data);
  }

  async updateEntries(data: EntryUpdate, id: number): Promise<void> {
    return apiClient.put<void>(`${this.updateEntriesEndpoint}${id}`, data);
  }

  async deleteEntries(id: number): Promise<void> {
    return apiClient.delete(`${this.deleteEntriesEndpoint}${id}`);
  }

  async createExit(data: ExitHeader): Promise<void> {
    return apiClient.post(this.createExitEndpoint, data);
  }

  async createExitByFolio(data: ExitByFolio): Promise<void> {
    return apiClient.post(this.createExitByFolioEndpoint, data);
  }

  async generateReport(folios: string[]): Promise<ExitReportData[]> {
    return apiClient.post<ExitReportData[]>(
      this.generateReportEndpoint,
      folios,
    );
  }

  async update(data: ExitUpdate, id: number): Promise<void> {
    return apiClient.put(`${this.updateExitEndpoint}${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.deleteExitEndpoint}${id}`);
  }
}

export const lService = new LService();
