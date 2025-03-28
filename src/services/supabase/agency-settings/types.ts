
export interface AgencySettings {
  id?: string;
  name: string;
  rc: string;
  if_number: string;
  capital: string;
  rib: string;
  bank_name: string;
  updated_at?: Date;
}

export interface AgencySettingsResponse {
  success: boolean;
  data?: AgencySettings;
  error?: string;
}
