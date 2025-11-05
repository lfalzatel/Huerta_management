import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

const productsData = [
  // Vegetales
  { name: 'Tomates Cherry', category: 'Vegetales', price: 2.50, stock: 45, minStock: 10, description: 'Tomates cherry dulces y jugosos, perfectos para ensaladas' },
  { name: 'Lechuga Romana', category: 'Vegetales', price: 1.80, stock: 32, minStock: 8, description: 'Lechuga romana fresca y crujiente' },
  { name: 'Pimientos Morrones', category: 'Vegetales', price: 3.50, stock: 28, minStock: 6, description: 'Pimientos morrones rojos y verdes' },
  { name: 'Zanahorias Orgánicas', category: 'Vegetales', price: 2.20, stock: 55, minStock: 12, description: 'Zanahorias orgánicas cultivadas sin pesticidas' },
  { name: 'Brócoli Fresco', category: 'Vegetales', price: 3.80, stock: 22, minStock: 5, description: 'Brócoli fresco de alta calidad' },
  { name: 'Espinacas Baby', category: 'Vegetales', price: 4.20, stock: 18, minStock: 4, description: 'Espinacas baby tiernas y nutritivas' },
  { name: 'Calabacín', category: 'Vegetales', price: 2.80, stock: 35, minStock: 8, description: 'Calabacín fresco y versátil' },
  { name: 'Berengenas', category: 'Vegetales', price: 3.20, stock: 20, minStock: 5, description: 'Berengenas moradas brillantes' },
  { name: 'Cebollas Rojas', category: 'Vegetales', price: 2.00, stock: 60, minStock: 15, description: 'Cebollas rojas dulces y crujientes' },
  { name: 'Pepinos', category: 'Vegetales', price: 1.50, stock: 40, minStock: 10, description: 'Pepinos frescos y hidratantes' },
  
  // Frutas
  { name: 'Fresas Orgánicas', category: 'Frutas', price: 4.20, stock: 12, minStock: 3, description: 'Fresas orgánicas dulces y aromáticas' },
  { name: 'Manzanas Gala', category: 'Frutas', price: 3.50, stock: 48, minStock: 12, description: 'Manzanas gala crujientes y dulces' },
  { name: 'Naranjas Valencia', category: 'Frutas', price: 2.80, stock: 38, minStock: 10, description: 'Naranjas valencia jugosas' },
  { name: 'Limones', category: 'Frutas', price: 1.80, stock: 25, minStock: 6, description: 'Limones frescos y ácidos' },
  { name: 'Plátanos', category: 'Frutas', price: 2.20, stock: 42, minStock: 10, description: 'Plátanos maduros y dulces' },
  { name: 'Uvas Rojas', category: 'Frutas', price: 5.50, stock: 15, minStock: 4, description: 'Uvas rojas sin semillas' },
  { name: 'Melocotones', category: 'Frutas', price: 4.80, stock: 18, minStock: 4, description: 'Melocotones jugosos y maduros' },
  { name: 'Kiwis', category: 'Frutas', price: 3.20, stock: 30, minStock: 8, description: 'Kiwis verdes y nutritivos' },
  
  // Hierbas
  { name: 'Albahaca Fresca', category: 'Hierbas', price: 2.00, stock: 28, minStock: 5, description: 'Albahaca fresca aromática' },
  { name: 'Cilantro', category: 'Hierbas', price: 1.80, stock: 32, minStock: 6, description: 'Cilantro fresco para platillos' },
  { name: 'Perejil', category: 'Hierbas', price: 1.50, stock: 35, minStock: 7, description: 'Perejil fresco y verde' },
  { name: 'Menta', category: 'Hierbas', price: 2.20, stock: 22, minStock: 4, description: 'Menta fresca aromática' },
  { name: 'Romero', category: 'Hierbas', price: 2.80, stock: 18, minStock: 3, description: 'Romero fresco para cocinar' },
  { name: 'Tomillo', category: 'Hierbas', price: 2.50, stock: 20, minStock: 4, description: 'Tomillo fresco aromático' },
  { name: 'Orégano', category: 'Hierbas', price: 2.30, stock: 25, minStock: 5, description: 'Orégano fresco mediterráneo' },
  
  // Plantas
  { name: 'Planta de Tomate', category: 'Plantas', price: 8.50, stock: 12, minStock: 3, description: 'Planta de tomate para huerto casero' },
  { name: 'Planta de Chile', category: 'Plantas', price: 7.80, stock: 15, minStock: 3, description: 'Planta de Chile picante' },
  { name: 'Hierbabuena', category: 'Plantas', price: 6.50, stock: 18, minStock: 4, description: 'Planta de hierbabuena medicinal' },
  { name: 'Lavanda', category: 'Plantas', price: 9.20, stock: 8, minStock: 2, description: 'Planta de lavanda aromática' }
]

async function generateProductImage(productName: string): Promise<string> {
  try {
    const zai = await ZAI.create()
    const response = await zai.images.generations.create({
      prompt: `Fresh organic ${productName} on a clean white background, professional product photography, high quality, natural lighting`,
      size: '512x512'
    })
    
    return response.data[0].base64
  } catch (error) {
    console.error(`Error generating image for ${productName}:`, error)
    // Return a placeholder image URL if generation fails
    return `https://via.placeholder.com/512x512/10b981/ffffff?text=${encodeURIComponent(productName)}`
  }
}

export async function POST() {
  try {
    const createdProducts = []
    
    for (const productData of productsData) {
      // Generate SKU
      const sku = productData.category.substring(0, 3).toUpperCase() + 
                  productData.name.substring(0, 3).toUpperCase() + 
                  Math.floor(Math.random() * 1000)
      
      // Generate image for some products (to avoid too many API calls)
      let image = null
      if (Math.random() > 0.7) { // Generate image for 30% of products
        image = await generateProductImage(productData.name)
      }
      
      const product = await db.product.upsert({
        where: { sku },
        update: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category: productData.category,
          minStock: productData.minStock,
          image,
        },
        create: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category: productData.category,
          sku,
          minStock: productData.minStock,
          image,
        }
      })
      
      createdProducts.push(product)
    }

    return NextResponse.json({
      message: 'Productos iniciales creados exitosamente',
      count: createdProducts.length,
      products: createdProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        sku: p.sku,
        hasImage: !!p.image
      }))
    })

  } catch (error) {
    console.error('Error creando productos iniciales:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}