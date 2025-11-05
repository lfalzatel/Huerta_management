'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Trash2, Package, Image as ImageIcon } from 'lucide-react'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  category: string
  image?: string
  sku?: string
  minStock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProductFormData {
  name: string
  description: string
  price: string
  stock: string
  category: string
  minStock: string
  image: string
}

const categories = ['Vegetales', 'Frutas', 'Hierbas', 'Plantas']

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    minStock: '',
    image: ''
  })

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Error al cargar productos')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      minStock: '',
      image: ''
    })
    setEditingProduct(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock),
        }),
      })

      if (!response.ok) throw new Error('Error al guardar producto')

      await fetchProducts()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      setError('Error al guardar producto')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      minStock: product.minStock.toString(),
      image: product.image || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error al eliminar producto')

      await fetchProducts()
    } catch (error) {
      setError('Error al eliminar producto')
    }
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Agotado', variant: 'destructive' as const }
    if (stock <= minStock) return { label: 'Stock Bajo', variant: 'destructive' as const }
    return { label: 'Disponible', variant: 'secondary' as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
          <p className="text-gray-600">Administra tu inventario de productos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Modifica los datos del producto' : 'Completa los datos para agregar un nuevo producto'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.minStock)
          
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-green-600" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  
                  {product.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <Badge variant={stockStatus.variant} className="text-xs">
                      {stockStatus.label}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Stock: {product.stock} unidades
                    {product.sku && <span> • SKU: {product.sku}</span>}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
          <p className="text-gray-500 mb-4">Comienza agregando tu primer producto</p>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>
      )}
    </div>
  )
}