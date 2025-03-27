
import { Json } from './base';

export interface QuotesTable {
  quotes: {
    Row: {
      id: string
      contactId: string
      freelancerId: string
      totalAmount: number
      status: string
      validUntil: string
      notes: string | null
      createdAt: string
      updatedAt: string
      folder: string
    }
    Insert: {
      id?: string
      contactId: string
      freelancerId: string
      totalAmount: number
      status: string
      validUntil: string
      notes?: string | null
      createdAt?: string
      updatedAt?: string
      folder?: string
    }
    Update: {
      id?: string
      contactId?: string
      freelancerId?: string
      totalAmount?: number
      status?: string
      validUntil?: string
      notes?: string | null
      createdAt?: string
      updatedAt?: string
      folder?: string
    }
  }
  quote_items: {
    Row: {
      id: string
      quoteId: string
      description: string
      quantity: number
      unitPrice: number
      discount: number | null
      tax: number | null
      serviceId?: string | null
    }
    Insert: {
      id?: string
      quoteId: string
      description: string
      quantity: number
      unitPrice: number
      discount?: number | null
      tax?: number | null
      serviceId?: string | null
    }
    Update: {
      id?: string
      quoteId?: string
      description?: string
      quantity?: number
      unitPrice?: number
      discount?: number | null
      tax?: number | null
      serviceId?: string | null
    }
  }
}
