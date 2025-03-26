
export interface ApiKey {
  id: string;
  userId: string;
  keyName: string;
  apiKey: string;
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface ApiKeyCreateParams {
  userId: string;
  keyName: string;
  expiresAt?: Date;
}

export interface ApiKeyUpdateParams {
  keyName?: string;
  expiresAt?: Date;
  isActive?: boolean;
}
