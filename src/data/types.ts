export type NullableNumber = number | null;

export interface Product {
  name: string;
  pricePerKg: NullableNumber;
}

export interface WasteRecord {
  date: string;
  product: string;
  category?: string | null;
  costPerKg: NullableNumber;
  wasteKg: NullableNumber;
  wasteCost: NullableNumber;
  wastePrice: NullableNumber;
  reason: string | null;
}

export interface ClientInfo {
  client: string;
  cmvAtual: number;
  month: string;
  monthStart?: string;
  monthEnd?: string;
  faturamentoMedio: number;
  cmvEmReais: number;
  custoDesperdicio: number;
  percentualDesperdicio: number;
  vendaDesperdicada: number;
  percentualVendaDesperdicada: number;
}

export interface WasteDataset {
  clientInfo: ClientInfo;
  products: Product[];
  wasteRecords: WasteRecord[];
}
