import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sales = await db.sale.findMany({
      include: {
        customer: true,
        employee: true,
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error obteniendo ventas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customerId, employeeId, userId, items, paymentMethod, notes } = await req.json()

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Generar número de venta
    const saleCount = await db.sale.count()
    const saleNumber = `VTA-${String(saleCount + 1).padStart(6, '0')}`

    // Calcular total
    let totalAmount = 0
    const saleItems = []

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Producto con ID ${item.productId} no encontrado` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}` },
          { status: 400 }
        )
      }

      const subtotal = product.price * item.quantity
      totalAmount += subtotal

      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      })
    }

    // Crear la venta y los items en una transacción
    const sale = await db.$transaction(async (tx) => {
      // Crear venta
      const newSale = await tx.sale.create({
        data: {
          saleNumber,
          customerId,
          employeeId,
          userId,
          totalAmount,
          paymentMethod,
          notes,
          status: 'COMPLETED',
        }
      })

      // Crear items de la venta
      for (const item of saleItems) {
        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            ...item,
          }
        })

        // Actualizar stock del producto
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return newSale
    })

    // Obtener la venta completa con sus relaciones
    const completeSale = await db.sale.findUnique({
      where: { id: sale.id },
      include: {
        customer: true,
        employee: true,
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(completeSale, { status: 201 })
  } catch (error) {
    console.error('Error creando venta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}