import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, stock, category, image, sku, minStock } = await req.json()

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        category,
        image,
        sku,
        minStock: parseInt(minStock) || 5,
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creando producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}