import { API_CONFIG } from "../../config/api";
import type {
  CreateReleasePayload,
  RegisterScanPayload,
  ShippingRelease,
} from "../../types/Types";
import { apiClient } from "../client";

class ShipmentsService {
  private releaseIdEndpoint = API_CONFIG.endpoints.shipments.releaseId;
  private releaseEndpoint = API_CONFIG.endpoints.shipments.release;
  private scanEndpoint = API_CONFIG.endpoints.shipments.scan;

  async releaseId(id: number): Promise<ShippingRelease> {
    return apiClient.get<ShippingRelease>(`${this.releaseIdEndpoint}${id}`);
  }

  async release(data: CreateReleasePayload) {
    return apiClient.post<ShippingRelease>(this.releaseEndpoint, data);
  }

  async scan(data: RegisterScanPayload) {
    return apiClient.post<ShippingRelease>(this.scanEndpoint, data);
  }
}

export const shipmentsService = new ShipmentsService();
