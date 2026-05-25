export type TransactionStatus = 'pending' | 'approved' | 'flagged' | 'rejected';

export interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  merchant: string;
  location: Location;
  timestamp: number;
  status: TransactionStatus;
}

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  userId: string;
  ruleId: string;
  message: string;
  timestamp: number;
  amount: number;
}

export interface SystemMetrics {
  tps: number;
  totalProcessed: number;
  totalFlagged: number;
  totalApproved: number;
  avgLatencyMs: number;
}
