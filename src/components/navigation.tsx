'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  LogOut, 
  LogIn, 
  Leaf,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  const handleSignIn = () => {
    signIn()
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'EMPLOYEE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador'
      case 'EMPLOYEE':
        return 'Empleado'
      default:
        return 'Usuario'
    }
  }

  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Huerta Verde</span>
            </div>
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover-scale">
              <div className="p-2 bg-gradient-primary rounded-lg mr-3">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-primary">Huerta Verde</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-3 mr-4">
                  <span className="text-sm text-gray-600">
                    Bienvenido, {session.user?.name}
                  </span>
                  <Badge className={getRoleColor(session.user?.role)}>
                    {getRoleText(session.user?.role)}
                  </Badge>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-scale hover-glow">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                          {getUserInitials(session.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-gray-600">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover-scale">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover-scale">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="hover-scale text-red-600 hover:text-red-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={handleSignIn} className="bg-gradient-primary hover-scale shadow-lg">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover-scale"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 bg-white/95 backdrop-blur-sm">
            <div className="px-4 space-y-4">
              {session ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-sm text-gray-600">{session.user?.email}</p>
                      <Badge className={`mt-2 ${getRoleColor(session.user?.role)}`}>
                        {getRoleText(session.user?.role)}
                      </Badge>
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                        {getUserInitials(session.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <Button variant="ghost" className="w-full justify-start hover-scale">
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover-scale">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover-scale"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Inicia sesión para acceder al sistema</p>
                    <Button onClick={handleSignIn} className="w-full bg-gradient-primary hover-scale shadow-lg">
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}