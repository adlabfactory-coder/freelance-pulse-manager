
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
    }
  }
  commission_rules: {
    Row: {
      id: string
      tier: string
      minContracts: number
      percentage: number
    }
    Insert: {
      id?: string
      tier: string
      minContracts: number
      percentage: number
    }
    Update: {
      id?: string
      tier?: string
      minContracts?: number
      percentage?: number
    }
  }
}
