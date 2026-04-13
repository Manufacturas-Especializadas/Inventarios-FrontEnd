import { API_CONFIG } from "../../config/api";
import type {
  Balance,
  EntryHeader,
  ExitHeader,
  Stock,
} from "../../types/Types";
import { apiClient } from "../client";

class L10Service {
  private getAllEndpoint = API_CONFIG.endpoints.L10.getAll;
  private exportToExcelEndpoint = API_CONFIG.endpoints.L10.export;
  private stockEndpoint = API_CONFIG.endpoints.L10.stock;
  private createEndpoint = API_CONFIG.endpoints.L10.entries;
  private createExitEndpoint = API_CONFIG.endpoints.L10.exits;

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

  async getStock(lineId: number, partNumber: string): Promise<Stock> {
    return apiClient.get<Stock>(`${this.stockEndpoint}${lineId}/${partNumber}`);
  }

  async create(data: EntryHeader): Promise<void> {
    return apiClient.post(this.createEndpoint, data);
  }

  async createExit(data: ExitHeader): Promise<void> {
    return apiClient.post(this.createExitEndpoint, data);
  }
}

export const l10Service = new L10Service();
