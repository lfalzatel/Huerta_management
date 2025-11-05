# 🌱 Huerta Verde Management

Sistema integral de gestión para huertas orgánicas con control completo de inventario, ventas, clientes y empleados.

## 🚀 Características Principales

### 📊 Dashboard Moderno
- **Estadísticas en tiempo real** con gráficos interactivos
- **Diseño responsive** con gradientes verdes naturales
- **Animaciones suaves** y efectos hover modernos
- **Quick stats bar** con métricas del día

### 🥬 Gestión de Productos
- **30+ productos** pre-cargados con imágenes generadas por IA
- **Control de stock** con alertas automáticas
- **Categorías** (Vegetales, Frutas, Hierbas, Plantas)
- **CRUD completo** con validaciones
- **Imágenes de productos** con placeholder automático

### 👥 Gestión de Clientes
- **Registro completo** con datos de contacto
- **Historial de compras** asociado
- **Validaciones** de email y DNI únicos
- **Búsqueda y filtrado** avanzado

### 💰 Sistema de Ventas
- **Registro completo** de transacciones
- **Múltiples métodos de pago**
- **Control automático** de inventario
- **Estados de venta** (Pendiente, Completada, Cancelada)
- **Cálculo automático** de totales

### 👨‍🌾 Gestión de Empleados
- **Perfiles completos** con posición y salario
- **Control de estado** (activo/inactivo)
- **Asociación con ventas**
- **Múltiples roles** disponibles

### 🔐 Autenticación y Seguridad
- **Sistema de login** seguro con NextAuth.js
- **Roles de usuario** (Administrador/Empleado)
- **Sesiones persistentes**
- **Cuentas de demostración** pre-configuradas

## 🎨 Diseño y Estilos

### 🌈 Gradientes y Colores
- **Fondo principal**: Gradiente de verde claro natural
- **Tarjetas sólidas** con gradientes vibrantes
- **Texto con gradientes** para títulos importantes
- **Badges de estado** con colores intuitivos

### ✨ Animaciones y Efectos
- **Animaciones de entrada** escalonadas
- **Efectos hover** suaves y modernos
- **Transiciones fluidas** entre componentes
- **Animaciones de carga** elegantes

### 📱 Responsive Design
- **Mobile-first** approach
- **Diseño adaptable** a todos los dispositivos
- **Menú hamburguesa** para móviles
- **Optimización táctil** para touch devices

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **Base de datos**: Prisma ORM con SQLite
- **Autenticación**: NextAuth.js v4
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Imágenes**: z-ai-web-dev-sdk

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación Local
```bash
# Clonar el repositorio
git clone <repository-url>
cd huerta-verde-management

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Inicializar base de datos
npm run db:push

# Cargar datos de demostración
npm run db:seed
npm run db:seed:products

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno
```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui"
```

## 🔑 Credenciales de Demostración

### Administrador
- **Email**: admin@huerta.com
- **Contraseña**: admin123

### Empleado
- **Email**: empleado@huerta.com
- **Contraseña**: emp123

## 📱 Uso de la Aplicación

### 1. Acceso al Sistema
1. Abre `http://localhost:3000` en tu navegador
2. Usa las credenciales de demostración para iniciar sesión
3. Explora las diferentes secciones disponibles

### 2. Navegación Principal
- **Ventas**: Gestiona todas las transacciones
- **Productos**: Administra el inventario
- **Clientes**: Gestiona la base de clientes
- **Empleados**: Administra el personal
- **Resumen**: Visualiza estadísticas y reportes

### 3. Funcionalidades Clave
- **Búsqueda avanzada** en header principal
- **Notificaciones** con indicadores visuales
- **Botón de Nueva Venta** siempre accesible
- **Estadísticas rápidas** en el header

## 🌐 Despliegue en Vercel

### Preparación para Producción
```bash
# Construir para producción
npm run build

# Verificar construcción exitosa
npm run start
```

### Configuración Vercel
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Despliega automáticamente

### Variables de Entorno en Vercel
- `NEXTAUTH_URL`: URL de tu aplicación Vercel
- `NEXTAUTH_SECRET`: Secreto para NextAuth
- `DATABASE_URL`: URL de tu base de datos (para producción usa PostgreSQL)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/              # APIs RESTful
│   │   ├── auth/         # Autenticación
│   │   ├── products/     # Gestión de productos
│   │   ├── customers/    # Gestión de clientes
│   │   ├── employees/    # Gestión de empleados
│   │   ├── sales/        # Gestión de ventas
│   │   └── seed/         # Datos iniciales
│   ├── auth/             # Páginas de autenticación
│   └── page.tsx          # Dashboard principal
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   ├── product-manager.tsx # Gestión de productos
│   ├── customer-manager.tsx # Gestión de clientes
│   ├── employee-manager.tsx # Gestión de empleados
│   ├── sale-manager.tsx # Gestión de ventas
│   └── navigation.tsx    # Navegación principal
├── lib/
│   ├── auth.ts           # Configuración NextAuth
│   └── db.ts             # Cliente Prisma
└── types/
    └── next-auth.d.ts    # Tipos extendidos
```

## 🎯 Características Técnicas

### ✅ Implementado
- ✅ **Next.js 15** con App Router
- ✅ **TypeScript** para tipado seguro
- ✅ **Tailwind CSS 4** con estilos personalizados
- ✅ **Prisma ORM** con SQLite
- ✅ **NextAuth.js** para autenticación
- ✅ **APIs RESTful** completas
- ✅ **Diseño responsive** moderno
- ✅ **Animaciones** y transiciones
- ✅ **30+ productos** con datos reales
- ✅ **Gestión completa** CRUD
- ✅ **Ready para Vercel**

### 🔧 Optimizaciones
- **Code splitting** automático
- **Lazy loading** de componentes
- **Optimización de imágenes** con Next.js Image
- **Bundle analysis** optimizado
- **SEO-friendly** con metadatos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎉 Agradecimientos

- **Next.js** - Framework React moderno
- **Tailwind CSS** - Framework CSS utilitario
- **shadcn/ui** - Componentes UI modernos
- **Prisma** - ORM moderno para TypeScript
- **NextAuth.js** - Autenticación para Next.js
- **Vercel** - Plataforma de despliegue

---

**🌱 Huerta Verde Management** - La solución completa para la gestión de tu huerta orgánica