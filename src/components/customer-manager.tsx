'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Trash2, Users, Phone, Mail, MapPin, FileText } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  dni?: string
  createdAt: string
  updatedAt: string
}

interface CustomerFormData {
  name: string
  email: string
  phone: string
  address: string
  dni: string
}

export default function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dni: ''
  })

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Error al cargar clientes')
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      setError('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      dni: ''
    })
    setEditingCustomer(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers'
      const method = editingCustomer ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.address || null,
          dni: formData.dni || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar cliente')
      }

      await fetchCustomers()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Error al guardar cliente')
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      dni: customer.dni || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error al eliminar cliente')

      await fetchCustomers()
    } catch (error) {
      setError('Error al eliminar cliente')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando clientes...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-gray-600">Administra la información de tus clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingCustomer ? 'Modifica los datos del cliente' : 'Completa los datos para agregar un nuevo cliente'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dni">DNI/Cédula</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingCustomer ? 'Actualizar' : 'Agregar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-xs text-gray-500">
                      Cliente desde {new Date(customer.createdAt).toLocaleDateString('es')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.dni && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>DNI: {customer.dni}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs line-clamp-2">{customer.address}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(customer)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(customer.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
          <p className="text-gray-500 mb-4">Comienza agregando tu primer cliente</p>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Cliente
          </Button>
        </div>
      )}
    </div>
  )
}