
import { Json } from './base';

export interface CommissionsTable {
  commissions: {
    Row: {
      id: string
      freelancerId: string
      amount: number
      tier: string
      subscriptionId: string | null
      quoteId: string | null
      periodStart: string
      periodEnd: string
      status: string
      paidDate: string | null
      createdAt: string
      contracts_count: number | null
      unit_amount: number | null
    }
    Insert: {
      id?: string
      freelancerId: string
      amount: number
      tier: string
      subscriptionId?: string | null
      quoteId?: string | null
      periodStart: string
      periodEnd: string
      status: string
      paidDate?: string | null
      createdAt?: string
      contracts_count?: number | null
      unit_amount?: number | null
    }
    Update: {
      id?: string
      freelancerId?: string
      amount?: number
      tier?: string
      subscriptionId?: string | null
      quoteId?: string | null
      periodStart?: string
      periodEnd?: string
      status?: string
      paidDate?: string | null
      createdAt?: string
      contracts_count?: number | null
      unit_amount?: number | null
    }
  }
  commission_rules: {
    Row: {
      id: string
      tier: string
      minContracts: number
      percentage: number
      unit_amount: number | null
      maxContracts: number | null
    }
    Insert: {
      id?: string
      tier: string
      minContracts: number
      percentage: number
      unit_amount?: number | null
      maxContracts?: number | null
    }
    Update: {
      id?: string
      tier?: string
      minContracts?: number
      percentage?: number
      unit_amount?: number | null
      maxContracts?: number | null
    }
  }
}
