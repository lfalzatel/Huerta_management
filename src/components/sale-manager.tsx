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
import { Plus, Edit, Trash2, ShoppingCart, DollarSign, Calendar, User, Package } from 'lucide-react'

interface SaleItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
  product: {
    id: string
    name: string
    price: number
    stock: number
  }
}

interface Sale {
  id: string
  saleNumber: string
  customerId: string
  employeeId?: string
  userId?: string
  totalAmount: number
  paymentMethod?: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    email?: string
  }
  employee?: {
    id: string
    name: string
  }
  items: SaleItem[]
}

interface Customer {
  id: string
  name: string
  email?: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

interface SaleFormData {
  customerId: string
  employeeId?: string
  paymentMethod: string
  notes: string
  items: Array<{
    productId: string
    quantity: number
  }>
}

const paymentMethods = [
  'Efectivo',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Transferencia Bancaria',
  'Mercado Pago',
  'Otro'
]

export default function SaleManager() {
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [formData, setFormData] = useState<SaleFormData>({
    customerId: '',
    employeeId: '',
    paymentMethod: '',
    notes: '',
    items: []
  })

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales')
      if (!response.ok) throw new Error('Error al cargar ventas')
      const data = await response.json()
      setSales(data)
    } catch (error) {
      setError('Error al cargar ventas')
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Error al cargar clientes')
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error cargando clientes:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Error al cargar productos')
      const data = await response.json()
      setProducts(data.filter((p: Product) => p.stock > 0))
    } catch (error) {
      console.error('Error cargando productos:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (!response.ok) throw new Error('Error al cargar empleados')
      const data = await response.json()
      setEmployees(data.filter((e: any) => e.isActive))
    } catch (error) {
      console.error('Error cargando empleados:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSales(),
        fetchCustomers(),
        fetchProducts(),
        fetchEmployees()
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      customerId: '',
      employeeId: '',
      paymentMethod: '',
      notes: '',
      items: []
    })
    setEditingSale(null)
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }]
    })
  }

  const updateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      if (product) {
        return total + (product.price * item.quantity)
      }
      return total
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingSale ? `/api/sales/${editingSale.id}` : '/api/sales'
      const method = editingSale ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalAmount: calculateTotal(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar venta')
      }

      await fetchSales()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Error al guardar venta')
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Error al actualizar estado')

      await fetchSales()
    } catch (error) {
      setError('Error al actualizar estado de la venta')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default'
      case 'PENDING': return 'secondary'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Completada'
      case 'PENDING': return 'Pendiente'
      case 'CANCELLED': return 'Cancelada'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando ventas...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h2>
          <p className="text-gray-600">Administra el registro de ventas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Venta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSale ? 'Editar Venta' : 'Nueva Venta'}
              </DialogTitle>
              <DialogDescription>
                {editingSale ? 'Modifica los datos de la venta' : 'Completa los datos para registrar una nueva venta'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Cliente *</Label>
                  <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Empleado</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Productos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Producto
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Select 
                        value={item.productId} 
                        onValueChange={(value) => updateItem(index, 'productId', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price} (Stock: {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={!formData.customerId || formData.items.length === 0}>
                  {editingSale ? 'Actualizar' : 'Crear Venta'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sales.map((sale) => (
          <Card key={sale.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Venta #{sale.saleNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString('es')} • {sale.customer.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(sale.status)}>
                    {getStatusText(sale.status)}
                  </Badge>
                  <span className="text-lg font-bold text-gray-900">${sale.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-sm">
                  <span className="text-gray-500">Cliente:</span>
                  <p className="font-medium">{sale.customer.name}</p>
                  {sale.customer.email && <p className="text-gray-600">{sale.customer.email}</p>}
                </div>
                {sale.employee && (
                  <div className="text-sm">
                    <span className="text-gray-500">Empleado:</span>
                    <p className="font-medium">{sale.employee.name}</p>
                  </div>
                )}
                {sale.paymentMethod && (
                  <div className="text-sm">
                    <span className="text-gray-500">Método de Pago:</span>
                    <p className="font-medium">{sale.paymentMethod}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Productos ({sale.items.length})</h4>
                <div className="space-y-1">
                  {sale.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {sale.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{sale.notes}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus(sale.id, 'COMPLETED')}
                  disabled={sale.status === 'COMPLETED'}
                >
                  Completar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus(sale.id, 'CANCELLED')}
                  disabled={sale.status === 'CANCELLED'}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sales.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas</h3>
          <p className="text-gray-500 mb-4">Comienza registrando tu primera venta</p>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        </div>
      )}
    </div>
  )
}