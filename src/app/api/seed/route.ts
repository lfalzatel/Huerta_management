import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await db.user.upsert({
      where: { email: 'admin@huerta.com' },
      update: {},
      create: {
        email: 'admin@huerta.com',
        password: adminPassword,
        name: 'Administrador',
        role: 'ADMIN',
      }
    })

    // Crear usuario empleado
    const empPassword = await bcrypt.hash('emp123', 10)
    const employee = await db.user.upsert({
      where: { email: 'empleado@huerta.com' },
      update: {},
      create: {
        email: 'empleado@huerta.com',
        password: empPassword,
        name: 'Empleado Ejemplo',
        role: 'EMPLOYEE',
      }
    })

    // Crear empleados de ejemplo
    const employees = [
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@huerta.com',
        phone: '+1234567890',
        position: 'Jardiner',
        salary: 2500.0,
      },
      {
        name: 'María González',
        email: 'maria@huerta.com',
        phone: '+1234567891',
        position: 'Vendedora',
        salary: 2200.0,
      },
      {
        name: 'Juan Martínez',
        email: 'juan@huerta.com',
        phone: '+1234567892',
        position: 'Supervisor',
        salary: 3000.0,
      }
    ]

    for (const emp of employees) {
      await db.employee.upsert({
        where: { email: emp.email },
        update: {},
        create: emp
      })
    }

    // Crear clientes de ejemplo
    const customers = [
      {
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        phone: '+1234567893',
        address: 'Calle Principal 123',
        dni: '12345678A',
      },
      {
        name: 'Roberto Sánchez',
        email: 'roberto.s@email.com',
        phone: '+1234567894',
        address: 'Avenida Central 456',
        dni: '87654321B',
      },
      {
        name: 'Laura Torres',
        email: 'laura.t@email.com',
        phone: '+1234567895',
        address: 'Plaza Mayor 789',
      }
    ]

    for (const customer of customers) {
      await db.customer.upsert({
        where: { email: customer.email },
        update: {},
        create: customer
      })
    }

    return NextResponse.json({
      message: 'Datos de demostración creados exitosamente',
      admin: { email: admin.email, role: admin.role },
      employee: { email: employee.email, role: employee.role },
    })

  } catch (error) {
    console.error('Error creando datos de demostración:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}