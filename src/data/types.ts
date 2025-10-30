export type NullableNumber = number | null;

export interface Product {
  name: string;
  pricePerKg: NullableNumber;
}

export interface WasteRecord {
  date: string;
  product: string;
  costPerKg: NullableNumber;
  wasteKg: NullableNumber;
  wasteCost: NullableNumber;
  reason: string | null;
}

export interface ClientInfo {
  client: string;
  cmvAtual: number;
  month: string;
  faturamentoMedio: number;
  cmvEmReais: number;
  custoDesperdicio: number;
  percentualDesperdicio: number;
}

export interface WasteDataset {
  clientInfo: ClientInfo;
  products: Product[];
  wasteRecords: WasteRecord[];
}
