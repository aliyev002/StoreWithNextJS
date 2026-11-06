import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'magaza_super_secret_jwt_key_2025_xK9mP3qR'

export async function POST(req) {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return Response.json({ error: 'Email və ya şifrə yanlışdır' }, { status: 401 })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'customer' },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return Response.json({
    message: 'Daxil olundu',
    role: user.role || 'customer'
  })
}
