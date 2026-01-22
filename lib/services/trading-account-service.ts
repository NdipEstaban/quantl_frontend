// lib/services/trading-account-service.ts
import { apiClient } from "@/lib/api-client";
import { ConnectedAccount, Platform } from "../types/trading-account-types";

export interface ConnectAccountData {
  platformId?: string;
  apiKey?: string;
  apiSecret?: string;
  nickname?: string;
  server?: string;
  readOnly?: boolean;
  accountNumber?: string;
  password?: string;
}

export interface UpdateAccountData {
  accountId: string;
  updates: Partial<ConnectedAccount>;
}

const TRADE_SERVICE_BASE_URL = "/trade-accounts";

export const tradingAccountService = {
  /**
   * Get all connected accounts
   */
  async getConnectedAccounts(
    userId: string,
  ): Promise<BackendResponse<ConnectedAccount[]>> {
    const response = await apiClient.get<BackendResponse<ConnectedAccount[]>>(
      TRADE_SERVICE_BASE_URL + `/connected?userId=${userId}`,
    );
    return response.data;
  },

  /**
   * Connect a new account
   */
  async connectAccount(data: ConnectAccountData): Promise<ConnectedAccount> {
    const response = await apiClient.post<ConnectedAccount>(
      TRADE_SERVICE_BASE_URL + "/connect/mt5",
      data,
    );
    return response.data;
  },

  /**
   * Disconnect an account
   */
  async disconnectAccount(accountId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      TRADE_SERVICE_BASE_URL + `/${accountId}/disconnect`,
    );
    return response.data;
  },

  /**
   * Sync a single account
   */
  async syncAccount(accountId: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      TRADE_SERVICE_BASE_URL + `/${accountId}/sync`,
    );
    return response.data;
  },

  /**
   * Sync all accounts
   */
  async syncAllAccounts(userId: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      TRADE_SERVICE_BASE_URL + "/sync-all?userId=" + userId,
    );
    return response.data;
  },

  /**
   * Update account settings
   */
  async updateAccount(data: UpdateAccountData): Promise<ConnectedAccount> {
    const { accountId, updates } = data;
    const response = await apiClient.patch<ConnectedAccount>(
      TRADE_SERVICE_BASE_URL + `/${accountId}`,
      updates,
    );
    return response.data;
  },
};
