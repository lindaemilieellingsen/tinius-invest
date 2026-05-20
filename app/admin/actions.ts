'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addFundPriceAction(formData: FormData) {
  const holdingId = parseInt(formData.get('holding_id') as string)
  const priceNok = parseFloat(formData.get('price_nok') as string)
  const priceDate = formData.get('price_date') as string
  const note = formData.get('note') as string

  if (!holdingId || isNaN(priceNok) || !priceDate) {
    throw new Error('Mangler påkrevde felt')
  }

  await sql`
    INSERT INTO fund_prices (holding_id, price_nok, price_date, note)
    VALUES (${holdingId}, ${priceNok}, ${priceDate}, ${note || null})
  `

  // Update holding status to active if it was pending
  await sql`
    UPDATE holdings
    SET status = 'active', updated_at = NOW()
    WHERE id = ${holdingId} AND status = 'pending'
  `

  revalidatePath('/dashboard')
  revalidatePath('/admin')
}

export async function addTransactionAction(formData: FormData) {
  const accountId = parseInt(formData.get('account_id') as string)
  const type = formData.get('type') as string
  const holdingName = formData.get('holding_name') as string
  const ticker = formData.get('ticker') as string
  const shares = formData.get('shares') as string
  const pricePerShare = formData.get('price_per_share') as string
  const currency = formData.get('currency') as string
  const totalNok = formData.get('total_nok') as string
  const executedAt = formData.get('executed_at') as string
  const note = formData.get('note') as string

  await sql`
    INSERT INTO transactions (
      account_id, type, holding_name, ticker, shares,
      price_per_share, currency, total_nok, executed_at, note
    ) VALUES (
      ${accountId}, ${type}, ${holdingName},
      ${ticker || null}, ${shares ? parseFloat(shares) : null},
      ${pricePerShare ? parseFloat(pricePerShare) : null},
      ${currency || 'NOK'},
      ${totalNok ? parseFloat(totalNok) : null},
      ${executedAt}, ${note || null}
    )
  `

  revalidatePath('/transactions')
  revalidatePath('/admin')
}

export async function updateCashAction(formData: FormData) {
  const accountId = parseInt(formData.get('account_id') as string)
  const cashNok = parseFloat(formData.get('cash_nok') as string)

  if (!accountId || isNaN(cashNok)) {
    throw new Error('Mangler påkrevde felt')
  }

  await sql`
    UPDATE accounts
    SET cash_nok = ${cashNok}, updated_at = NOW()
    WHERE id = ${accountId}
  `

  revalidatePath('/dashboard')
  revalidatePath('/admin')
}
