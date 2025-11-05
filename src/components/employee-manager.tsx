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
import { Plus, Edit, Trash2, Users, DollarSign, Calendar, Briefcase } from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  position: string
  salary?: number
  hireDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface EmployeeFormData {
  name: string
  email: string
  phone: string
  position: string
  salary: string
}

const positions = [
  'Jardiner',
  'Vendedor/a',
  'Supervisor',
  'Gerente',
  'Administrativo',
  'Técnico',
  'Ayudante',
  'Encargado de Inventario'
]

export default function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    salary: ''
  })

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (!response.ok) throw new Error('Error al cargar empleados')
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      setError('Error al cargar empleados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      salary: ''
    })
    setEditingEmployee(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : '/api/employees'
      const method = editingEmployee ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || null,
          salary: formData.salary ? parseFloat(formData.salary) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar empleado')
      }

      await fetchEmployees()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Error al guardar empleado')
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position,
      salary: employee.salary?.toString() || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) return

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error al eliminar empleado')

      await fetchEmployees()
    } catch (error) {
      setError('Error al eliminar empleado')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) throw new Error('Error al actualizar estado')

      await fetchEmployees()
    } catch (error) {
      setError('Error al actualizar estado del empleado')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando empleados...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h2>
          <p className="text-gray-600">Administra la información de tus empleados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
              </DialogTitle>
              <DialogDescription>
                {editingEmployee ? 'Modifica los datos del empleado' : 'Completa los datos para agregar un nuevo empleado'}
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

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posición *</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salario</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingEmployee ? 'Actualizar' : 'Agregar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id} className={`hover:shadow-md transition-shadow ${!employee.isActive ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${employee.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Users className={`h-5 w-5 ${employee.isActive ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-xs text-gray-500">{employee.position}</p>
                  </div>
                </div>
                <Badge variant={employee.isActive ? 'default' : 'secondary'}>
                  {employee.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{employee.position}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Desde {new Date(employee.hireDate).toLocaleDateString('es')}</span>
                </div>
                {employee.salary && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>${employee.salary.toLocaleString()}/mes</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="text-sm text-gray-600">
                    <span>Tel: {employee.phone}</span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <span>{employee.email}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(employee)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleToggleActive(employee.id, employee.isActive)}
                >
                  {employee.isActive ? 'Pausar' : 'Activar'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(employee.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empleados</h3>
          <p className="text-gray-500 mb-4">Comienza agregando tu primer empleado</p>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Empleado
          </Button>
        </div>
      )}
    </div>
  )
}