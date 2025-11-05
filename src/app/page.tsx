'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  Leaf
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import ProductManager from '@/components/product-manager'
import CustomerManager from '@/components/customer-manager'
import EmployeeManager from '@/components/employee-manager'
import SaleManager from '@/components/sale-manager'
import Navigation from '@/components/navigation'
import Link from 'next/link'

// Datos de ejemplo para el dashboard
const salesData = [
  { name: 'Ene', ventas: 4000, productos: 24 },
  { name: 'Feb', ventas: 3000, productos: 18 },
  { name: 'Mar', ventas: 5000, productos: 29 },
  { name: 'Abr', ventas: 4500, productos: 25 },
  { name: 'May', ventas: 6000, productos: 35 },
  { name: 'Jun', ventas: 5500, productos: 32 },
]

const categoryData = [
  { name: 'Vegetales', value: 35, color: '#10b981' },
  { name: 'Frutas', value: 25, color: '#f59e0b' },
  { name: 'Hierbas', value: 20, color: '#8b5cf6' },
  { name: 'Plantas', value: 20, color: '#3b82f6' },
]

const recentProducts = [
  { id: 1, name: 'Tomates Cherry', stock: 45, price: 2.50, category: 'Vegetales', status: 'active' },
  { id: 2, name: 'Lechuga Romana', stock: 32, price: 1.80, category: 'Vegetales', status: 'active' },
  { id: 3, name: 'Fresas Orgánicas', stock: 12, price: 4.20, category: 'Frutas', status: 'low' },
  { id: 4, name: 'Albahaca Fresca', stock: 28, price: 2.00, category: 'Hierbas', status: 'active' },
  { id: 5, name: 'Pimientos Morrones', stock: 8, price: 3.50, category: 'Vegetales', status: 'low' },
]

const recentSales = [
  { id: 1, customer: 'María González', total: 45.50, items: 5, date: '2024-06-15', status: 'completed' },
  { id: 2, customer: 'Juan Pérez', total: 32.80, items: 3, date: '2024-06-15', status: 'completed' },
  { id: 3, customer: 'Ana Martínez', total: 67.20, items: 8, date: '2024-06-14', status: 'pending' },
  { id: 4, customer: 'Carlos López', total: 28.90, items: 4, date: '2024-06-14', status: 'completed' },
]

export default function Home() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('sales')

  // Si está cargando la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay sesión, mostrar página de bienvenida
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Huerta Verde Management
              </CardTitle>
              <CardDescription>
                Sistema integral para la gestión de tu huerta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Leaf className="h-4 w-4" />
                <AlertDescription>
                  Inicia sesión para acceder al dashboard de gestión
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">🌱 Características principales:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Gestión completa de productos e inventario</li>
                    <li>• Control de clientes y ventas</li>
                    <li>• Administración de empleados</li>
                    <li>• Estadísticas y reportes en tiempo real</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">👤 Cuentas de demostración:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Admin:</strong> admin@huerta.com / admin123</p>
                    <p><strong>Empleado:</strong> empleado@huerta.com / emp123</p>
                  </div>
                </div>
              </div>
              
              <Link href="/auth/signin">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Leaf className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const stats = {
    totalProducts: 156,
    activeProducts: 142,
    lowStock: 8,
    totalCustomers: 89,
    newCustomers: 12,
    totalSales: 45,
    totalRevenue: 28450.50,
    monthlyGrowth: 15.3
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text-purple mb-2">🌱 Huerta Verde Management</h1>
              <p className="text-gray-700 text-lg mb-4">Gestión integral de tu huerta orgánica</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-600">Bienvenido,</span>
                <span className="text-sm font-semibold text-gray-900">{session.user?.name}</span>
                <Badge className={session.user?.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                  {session.user?.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos, clientes..."
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64 shadow-sm bg-white/90 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="relative hover-scale bg-white/90 backdrop-blur-sm">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                </Button>
                
                <Button className="bg-gradient-success hover-scale shadow-lg text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Venta
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Hoy</p>
                  <p className="text-lg font-bold text-gray-900">12</p>
                </div>
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Ingresos</p>
                  <p className="text-lg font-bold text-gray-900">$2,450</p>
                </div>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Clientes</p>
                  <p className="text-lg font-bold text-gray-900">8</p>
                </div>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Productos</p>
                  <p className="text-lg font-bold text-gray-900">156</p>
                </div>
                <Package className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="solid-card primary animate-stats-fade-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <Package className="h-8 w-8 text-white/80" />
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
            </div>
            <p className="text-white/80 text-sm">Productos Totales</p>
            <p className="text-white/60 text-xs mt-1">
              <span className="text-white/90">{stats.activeProducts} activos</span> • {stats.lowStock} con stock bajo
            </p>
          </div>

          <div className="solid-card success animate-stats-fade-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-white/80" />
              <div className="text-3xl font-bold">{stats.totalCustomers}</div>
            </div>
            <p className="text-white/80 text-sm">Clientes</p>
            <p className="text-white/60 text-xs mt-1">
              <span className="text-white/90">+{stats.newCustomers} nuevos</span> este mes
            </p>
          </div>

          <div className="solid-card warning animate-stats-fade-in hover-lift" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="h-8 w-8 text-white/80" />
              <div className="text-3xl font-bold">{stats.totalSales}</div>
            </div>
            <p className="text-white/80 text-sm">Ventas del Mes</p>
            <p className="text-white/60 text-xs mt-1">
              <span className="text-white/90">+{stats.monthlyGrowth}%</span> crecimiento
            </p>
          </div>

          <div className="solid-card info animate-stats-fade-in hover-lift" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-white/80" />
              <div className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            </div>
            <p className="text-white/80 text-sm">Ingresos</p>
            <p className="text-white/60 text-xs mt-1">
              <span className="text-white/90">+12.5%</span> vs mes anterior
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex bg-white/90 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="sales" className="flex items-center gap-2 hover-scale">
              <ShoppingCart className="h-4 w-4" />
              Ventas
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 hover-scale">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2 hover-scale">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2 hover-scale">
              <Users className="h-4 w-4" />
              Empleados
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2 hover-scale">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <SaleManager />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManager />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="card-with-border-top primary animate-card-fade-in hover-lift" style={{ animationDelay: '0.1s' }}>
                <div className="p-6">
                  <h3 className="text-xl font-bold gradient-text-primary mb-2 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    Tendencia de Ventas
                  </h3>
                  <p className="text-gray-600 mb-4">Últimos 6 meses</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
                      <Line type="monotone" dataKey="productos" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="card-with-border-top purple animate-card-fade-in hover-lift" style={{ animationDelay: '0.2s' }}>
                <div className="p-6">
                  <h3 className="text-xl font-bold gradient-text-purple mb-2 flex items-center gap-2">
                    <PieChart className="h-6 w-6 text-purple-600" />
                    Distribución por Categoría
                  </h3>
                  <p className="text-gray-600 mb-4">Productos por tipo</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-with-border-top success animate-card-fade-in hover-lift" style={{ animationDelay: '0.3s' }}>
                <div className="p-6">
                  <h3 className="text-xl font-bold gradient-text-success mb-4">Productos Recientes</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {recentProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-scale" style={{ animationDelay: `${0.1 * index}s` }}>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.category} • ${product.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`badge-${product.status === 'low' ? 'cancelada' : 'completada'}`}>
                            Stock: {product.stock}
                          </span>
                          <Button variant="ghost" size="sm" className="hover-scale">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-with-border-top info animate-card-fade-in hover-lift" style={{ animationDelay: '0.4s' }}>
                <div className="p-6">
                  <h3 className="text-xl font-bold gradient-text-info mb-4">Ventas Recientes</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {recentSales.map((sale, index) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-scale" style={{ animationDelay: `${0.1 * index}s` }}>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{sale.customer}</h4>
                          <p className="text-sm text-gray-500">{sale.items} productos • {sale.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">${sale.total}</span>
                          <span className={`badge-${sale.status === 'completed' ? 'completada' : 'pendiente'}`}>
                            {sale.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}