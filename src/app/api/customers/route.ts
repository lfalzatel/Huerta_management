import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error obteniendo clientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, address, dni } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el cliente ya existe (por email o DNI)
    if (email) {
      const existingCustomer = await db.customer.findUnique({
        where: { email }
      })

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Ya existe un cliente con este email' },
          { status: 400 }
        )
      }
    }

    if (dni) {
      const existingCustomer = await db.customer.findUnique({
        where: { dni }
      })

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Ya existe un cliente con este DNI' },
          { status: 400 }
        )
      }
    }

    const customer = await db.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        dni,
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creando cliente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}