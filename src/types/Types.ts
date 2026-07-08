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

export interface ExitByFolio {
  lineId: number;
  folio: string;
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

export interface ExitReportData {
  folio: string;
  shopOrder: string;
  partNumber: string;
  quantity: number;
}

export interface ExitRecord {
  id?: string | number;
  folio: string;
  shopOrder: string;
  partNumber: string;
  quantity: number;
  [key: string]: any;
}

export interface ExitReportGeneratorProps {
  availableExits: ExitRecord[];
}

export interface UpdateDetail {
  partNumber: string;
  client: string;
  quantity: number;
}

export interface ReportLogDetail {
  folio: string;
  isProcessed: boolean;
}

export interface ReportLog {
  id: number;
  printedAt: string;
  details: ReportLogDetail[];
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

export interface FtnBalanceItem {
  id: number;
  exitHeaderId: number | null;
  lineId: number | null;
  folio: string;
  shopOrder: string | null;
  partNumber: string;
  originalQuantity: number;
  currentQuantity: number;
  status: string;
  createdAt: string;
  clearedAt: string | null;
}

export interface MicroChannel {
  code: string;
  typeMovement: string;
  tripNumber: number;
}

export interface MicroChannelList {
  id: number;
  company: string;
  area: string;
  description: string;
  line: string;
  code: string;
  status: string;
  createdAt: string;
  entryDate: string;
  exitDate: string;
}
