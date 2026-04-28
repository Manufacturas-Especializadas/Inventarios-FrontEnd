export interface Balance {
  partNumber: string;
  client: string;
  totalEntries: number;
  totalBoxes: number;
  totalExits: number;
  stock: number;
  lastEntryDate: string;
  lastExitDate: any;
  exitShopOrders: string;
  entryShopOrders: string;
}

export interface Stock {
  partNumber: string;
  stock: number;
}

export interface EntryHeader {
  lineId: number;
  shopOrder?: string;
  details: EntryDetail[];
}

export interface EntryDetail {
  partNumber: string;
  client?: string;
  quantity: number;
  boxesQuantity?: number;
}

export interface HistoryEntry {
  id: number;
  lineId: number;
  createdAt: string;
  shopOrder: string;
  folio: string;
  details: HistoryDetailsEntry[];
}

export interface HistoryDetailsEntry {
  partNumber: string;
  client: string;
  quantity: number;
  boxesQuantity: number;
}

export interface EntryUpdate {
  id: number;
  lineId: number;
  details: EntryUpdateDetail[];
}

export interface EntryUpdateDetail {
  partNumber: string;
  client: string;
  quantity: number;
  boxesQuantity: number;
}

export interface ExitHeader {
  lineId: number;
  shopOrder1: string;
  shopOrder2?: string;
  shopOrder3?: string;
  shopOrder4?: string;
  shopOrder5?: string;
  shopOrder6?: string;
  details: ExitDetail[];
}

export interface ExitDetail {
  partNumber: string;
  client: string;
  quantity: number;
}

export interface HistoryExits {
  id: number;
  lineId: number;
  shopOrder1: string;
  shopOrder2: string;
  shopOrder3: string;
  shopOrder4: string;
  shopOrder5: string;
  shopOrder6: string;
  createdAt: string;
  details: HistoryDetailExits[];
}

export interface HistoryDetailExits {
  partNumber: string;
  client: string;
  quantity: number;
}

export interface ExitUpdate {
  id: number;
  lineId: number;
  shopOrder1: string;
  shopOrder2: string;
  shopOrder3: string;
  shopOrder4: string;
  shopOrder5: string;
  shopOrder6: string;
  details: UpdateDetail[];
}

export interface UpdateDetail {
  partNumber: string;
  client: string;
  quantity: number;
}

export interface ShippingRelease {
  id: number;
  shopOrder: string;
  partNumber: string;
  targetQuantity: number;
  currentScans: number;
  packerName: string;
  status: number;
  createdAt: string;
}

export interface CreateReleasePayload {
  shopOrder: string;
  partNumber: string;
  targetQuantity: number;
  packerName: string;
}

export interface RegisterScanPayload {
  shippingReleaseId: number;
  scannedLabelId: string;
}
