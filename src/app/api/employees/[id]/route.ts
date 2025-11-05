import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await db.employee.findUnique({
      where: { id: params.id },
      include: {
        sales: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Empleado no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Error obteniendo empleado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, phone, position, salary, isActive } = await req.json()

    const employee = await db.employee.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(position && { position }),
        ...(salary !== undefined && { salary: parseFloat(salary) }),
        ...(isActive !== undefined && { isActive }),
      }
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Error actualizando empleado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete - marcar como inactivo
    const employee = await db.employee.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'Empleado eliminado exitosamente' })
  } catch (error) {
    console.error('Error eliminando empleado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}