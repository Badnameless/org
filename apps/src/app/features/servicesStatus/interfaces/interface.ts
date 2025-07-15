export interface ServiceStatus {
  Id: number;
  TenantId: number;
  IP: string;
  Hostname: string;
  LastConnection: Date;
  Status: string;
  OsfInfo: string;
}

