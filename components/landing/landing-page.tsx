'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Users, 
  Calendar, 
  BarChart3, 
  Zap,
  ArrowRight
} from 'lucide-react'

export function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: Users,
      title: 'Gestión de Estudiantes',
      description: 'Organiza y administra tus grupos de estudiantes de forma sencilla',
    },
    {
      icon: Calendar,
      title: 'Control de Asistencia',
      description: 'Registra la asistencia de tus estudiantes en tiempo real',
    },
    {
      icon: BarChart3,
      title: 'Reportes y Estadísticas',
      description: 'Visualiza datos detallados sobre asistencia y desempeño',
    },
    {
      icon: Zap,
      title: 'Interfaz Intuitiva',
      description: 'Diseño moderno y fácil de usar para toda la comunidad educativa',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                CJ
              </div>
              <span className="font-bold text-lg hidden sm:inline">campusjuventudes</span>
            </div>
            <Button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Logo grande */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-5xl font-bold">CJ</span>
              </div>
            </div>

            {/* Título y descripción */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              campusjuventudes
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto">
              Plataforma moderna para la gestión de asistencia escolar
            </p>
            <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Simplifica el control de asistencia, organiza tus grupos y obtén reportes detallados en un solo lugar
            </p>

            {/* CTA Button */}
            <Button
              onClick={() => router.push('/auth/login')}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Comenzar ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Características Principales</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para una gestión educativa eficiente y moderna
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/80 transition-all hover:border-blue-500/50 group"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/40 transition-all">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8">¿Por qué elegir campusjuventudes?</h2>
                <ul className="space-y-4">
                  {[
                    'Interfaz intuitiva y fácil de usar',
                    'Control de asistencia en tiempo real',
                    'Reportes detallados y exportables',
                    'Gestión completa de grupos',
                    'Seguridad y privacidad garantizada',
                    'Soporte profesional'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-8 border border-slate-700/50">
                  <div className="space-y-4">
                    <div className="h-32 bg-slate-700/50 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-slate-700/50 rounded-lg"></div>
                      <div className="h-20 bg-slate-700/50 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Únete a cientos de instituciones educativas que ya confían en campusjuventudes
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Iniciar sesión
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold">
                  CJ
                </div>
                <span className="font-bold">campusjuventudes</span>
              </div>
              <p className="text-slate-400 text-sm">
                Gestión de asistencia para la comunidad educativa
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Características</a></li>
                <li><a href="#" className="hover:text-white transition">Precios</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
              <p>&copy; 2026 campusjuventudes. Todos los derechos reservados.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition">Twitter</a>
                <a href="#" className="hover:text-white transition">LinkedIn</a>
                <a href="#" className="hover:text-white transition">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
