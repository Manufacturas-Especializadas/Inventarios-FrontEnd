import { API_CONFIG } from "../../config/api";
import type {
  Balance,
  EntryHeader,
  EntryUpdate,
  ExitByFolio,
  ExitHeader,
  ExitUpdate,
  HistoryEntry,
  HistoryExits,
  Stock,
} from "../../types/Types";
import { apiClient } from "../client";

class LService {
  private getAllEndpoint = API_CONFIG.endpoints.Lines.getAll;
  private getHistoryEntriesEndpoint = API_CONFIG.endpoints.Lines.historyEntries;
  private getHistoryExitsEndpoint = API_CONFIG.endpoints.Lines.historyExits;
  private exportToExcelEndpoint = API_CONFIG.endpoints.Lines.export;
  private stockEndpoint = API_CONFIG.endpoints.Lines.stock;
  private createEndpoint = API_CONFIG.endpoints.Lines.entries;
  private updateEntriesEndpoint = API_CONFIG.endpoints.Lines.updateEntries;
  private deleteEntriesEndpoint = API_CONFIG.endpoints.Lines.deleteEntries;
  private createExitEndpoint = API_CONFIG.endpoints.Lines.exits;
  private createExitByFolioEndpoint = API_CONFIG.endpoints.Lines.exitByFolio;
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

  async update(data: ExitUpdate, id: number): Promise<void> {
    return apiClient.put(`${this.updateExitEndpoint}${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.deleteExitEndpoint}${id}`);
  }
}

export const lService = new LService();
