import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'magaza_super_secret_jwt_key_2025_xK9mP3qR'

export async function getUserFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const user = jwt.verify(token, JWT_SECRET)
    return user
  } catch (err) {
    const cs = await cookies()
    cs.set('token', '', { maxAge: 0 })
    return null
  }
}
