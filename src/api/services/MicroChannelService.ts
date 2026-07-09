import { API_CONFIG } from "../../config/api";
import type {
  DesactivatePayload,
  MicroChannel,
  MicroChannelList,
} from "../../types/Types";
import { apiClient } from "../client";

class MicroChannelService {
  private getListEndpoint = API_CONFIG.endpoints.microchannel.recent;
  private registerEndpoint = API_CONFIG.endpoints.microchannel.register;
  private desactivateEndpoint = API_CONFIG.endpoints.microchannel.desactivate;

  async getList(): Promise<MicroChannelList[]> {
    return apiClient.get<MicroChannelList[]>(this.getListEndpoint);
  }

  async register(data: MicroChannel): Promise<void> {
    return apiClient.post<void>(this.registerEndpoint, data);
  }

  async desactivate(data: DesactivatePayload): Promise<void> {
    return apiClient.post<void>(this.desactivateEndpoint, data);
  }
}

export const microChannelService = new MicroChannelService();
