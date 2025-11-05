import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const employees = await db.employee.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error obteniendo empleados:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, position, salary } = await req.json()

    if (!name || !email || !position) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el empleado ya existe
    const existingEmployee = await db.employee.findUnique({
      where: { email }
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Ya existe un empleado con este email' },
        { status: 400 }
      )
    }

    const employee = await db.employee.create({
      data: {
        name,
        email,
        phone,
        position,
        salary: salary ? parseFloat(salary) : null,
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creando empleado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}