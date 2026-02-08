import { User } from "@/lib/types/auth-types";
import { apiClient } from "../api-client";

export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<BackendResponse<User>> {
    const response = await apiClient.get<BackendResponse<User>>(
      `/user/profile/${userId}`,
    );
    return response.data;
  },
};
