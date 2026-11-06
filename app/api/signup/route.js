import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req) {
  const { email, password } = await req.json()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return Response.json({ error: 'Email mövcuddur' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: { email, password: hashed }
  })

  return Response.json({ message: 'Qeydiyyat uğurludur' })
}
