export interface Fair {
  name: string;
  town: string;
  region: string;
  date: string;
  product: string;
  organizerName?: string;
  organizerAddress?: string;
  organizerPhone?: string;
  organizerFax?: string;
  email?: string;
  web?: string;
  periodicityName?: string;
  sectorName?: string;
  location?: string;
  firstYear?: string;
  nexhibitors?: string | null;
  nvisitors?: string | null;
  surface?: string | null;
}