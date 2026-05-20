'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createToken, COOKIE_NAME } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const pin = formData.get('pin') as string

  if (!pin || pin !== process.env.PORTFOLIO_PIN) {
    redirect('/login?error=1')
  }

  const token = await createToken()
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/login')
}
