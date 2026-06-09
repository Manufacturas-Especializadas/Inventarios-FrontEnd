import { API_CONFIG } from "../../config/api";
import type { MicroChannel } from "../../types/Types";
import { apiClient } from "../client";

class MicroChannelService {
  private registerEndpoint = API_CONFIG.endpoints.microchannel.register;

  async register(data: MicroChannel): Promise<void> {
    return apiClient.post<void>(this.registerEndpoint, data);
  }
}

export const microChannelService = new MicroChannelService();
