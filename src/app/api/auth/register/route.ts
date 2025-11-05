import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role = 'EMPLOYEE' } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      }
    })

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}