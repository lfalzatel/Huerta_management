import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sale = await db.sale.findUnique({
      where: { id: params.id },
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

    if (!sale) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error obteniendo venta:', error)
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
    const { status, notes, paymentMethod } = await req.json()

    const sale = await db.sale.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(paymentMethod && { paymentMethod }),
      }
    })

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error actualizando venta:', error)
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
    const sale = await db.sale.findUnique({
      where: { id: params.id },
      include: {
        items: true
      }
    })

    if (!sale) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      )
    }

    if (sale.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'No se puede eliminar una venta completada' },
        { status: 400 }
      )
    }

    // Eliminar la venta y restaurar stock en una transacción
    await db.$transaction(async (tx) => {
      // Restaurar stock de los productos
      for (const item of sale.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      }

      // Eliminar items de la venta
      await tx.saleItem.deleteMany({
        where: { saleId: params.id }
      })

      // Eliminar la venta
      await tx.sale.delete({
        where: { id: params.id }
      })
    })

    return NextResponse.json({ message: 'Venta eliminada exitosamente' })
  } catch (error) {
    console.error('Error eliminando venta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}