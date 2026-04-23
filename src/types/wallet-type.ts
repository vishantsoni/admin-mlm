interface WalletType{
    total_balance: string;
    pending_balance: string;
    available_balance: string;
    total_transactions: string;
}

interface TransactionType {
    id: number;
}

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'processing';

export interface CappingType {
  id: number;
  level_id: number;
  level_name: string;
  level_no: number;
  day_limit: string;
  week_limit: string;
  monthly_limit: string;
}

export interface WithdrawalRequest {
  id: number;
  userId: number;
  userName: string;
  email: string;
  phone: string;
  levelName: string;
  levelNo: number;
  uvAmount: number;
  rsAmount: number;
  bankName: string;
  accountNo: string;
  ifsc: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  balance?: number;
  dayUsed: number;
  weekUsed: number;
  monthUsed: number;
}
