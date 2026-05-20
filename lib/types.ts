export type AccountType = 'AF' | 'ASK'
export type HoldingType = 'stock' | 'fund'
export type HoldingStatus = 'active' | 'pending' | 'sold'
export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdrawal'

export interface Account {
  id: number
  name: string
  type: AccountType
  cash_nok: string
  created_at: string
  updated_at: string
}

export interface Holding {
  id: number
  account_id: number
  name: string
  ticker: string | null
  exchange: string | null
  currency: string
  type: HoldingType
  shares: string
  gav_per_share: string
  status: HoldingStatus
  bought_at: string | null
  created_at: string
  updated_at: string
}

export interface FundPrice {
  id: number
  holding_id: number
  price_nok: string
  price_date: string
  note: string | null
  created_at: string
}

export interface Transaction {
  id: number
  account_id: number
  holding_id: number | null
  type: TransactionType
  ticker: string | null
  holding_name: string
  shares: string | null
  price_per_share: string | null
  currency: string
  total_nok: string | null
  executed_at: string
  note: string | null
  created_at: string
}

export interface LivePrice {
  ticker: string
  price: number
  change: number
  changePercent: number
  currency: string
}

export interface HoldingWithPrice extends Holding {
  account: Account
  livePrice?: number
  livePriceNok?: number
  fundPriceNok?: number
  valueNok: number
  costNok: number
  plNok: number
  plPercent: number
}

export interface PortfolioSummary {
  totalValueNok: number
  totalCostNok: number
  totalPlNok: number
  totalPlPercent: number
  cashNok: number
  accounts: AccountSummary[]
}

export interface AccountSummary {
  account: Account
  holdings: HoldingWithPrice[]
  totalValueNok: number
  totalCostNok: number
  totalPlNok: number
  cashNok: number
}
