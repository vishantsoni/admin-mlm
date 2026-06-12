export interface TdsSummary {
  total_transactions: number;
  total_amount: string;
}

export interface TdsTransaction {
  transaction_id: string | number;
  date: string;
  user_id: string | number;
  amount: string;
  category: string;
  type: string;
  remarks: string;
}

export interface TdsReportData {
  summary: TdsSummary;
  transactions: TdsTransaction[];
}

export interface TdsReportResponse {
  success: boolean;
  message?: string;
  data: TdsReportData;
}

