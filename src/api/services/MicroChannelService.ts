import { API_CONFIG } from "../../config/api";
import type { MicroChannel, MicroChannelList } from "../../types/Types";
import { apiClient } from "../client";

class MicroChannelService {
  private getListEndpoint = API_CONFIG.endpoints.microchannel.recent;
  private registerEndpoint = API_CONFIG.endpoints.microchannel.register;

  async getList(): Promise<MicroChannelList[]> {
    return apiClient.get<MicroChannelList[]>(this.getListEndpoint);
  }

  async register(data: MicroChannel): Promise<void> {
    return apiClient.post<void>(this.registerEndpoint, data);
  }
}

export const microChannelService = new MicroChannelService();
