import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await db.customer.findUnique({
      where: { id: params.id }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error obteniendo cliente:', error)
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
    const { name, email, phone, address, dni } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el email o DNI ya existen en otros clientes
    if (email) {
      const existingCustomer = await db.customer.findFirst({
        where: { 
          email,
          id: { not: params.id }
        }
      })

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Ya existe otro cliente con este email' },
          { status: 400 }
        )
      }
    }

    if (dni) {
      const existingCustomer = await db.customer.findFirst({
        where: { 
          dni,
          id: { not: params.id }
        }
      })

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Ya existe otro cliente con este DNI' },
          { status: 400 }
        )
      }
    }

    const customer = await db.customer.update({
      where: { id: params.id },
      data: {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        dni: dni || null,
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error actualizando cliente:', error)
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
    // Verificar si el cliente tiene ventas asociadas
    const salesCount = await db.sale.count({
      where: { customerId: params.id }
    })

    if (salesCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar el cliente porque tiene ventas asociadas' },
        { status: 400 }
      )
    }

    await db.customer.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Cliente eliminado exitosamente' })
  } catch (error) {
    console.error('Error eliminando cliente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}