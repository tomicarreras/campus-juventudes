'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Calendar, 
  Download,
  Gift,
  ArrowRight
} from 'lucide-react'

export function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: Users,
      title: 'Gestión de Estudiantes',
      description: 'Organizá y administrá tus grupos de estudiantes de forma sencilla',
    },
    {
      icon: Calendar,
      title: 'Control de Asistencia',
      description: 'Registra la asistencia de tus estudiantes de manera rápida y eficiente',
    },
    {
      icon: Gift,
      title: 'Seguimiento de Cumpleaños',
      description: 'Visualiza los cumpleaños de tus alumnos para que nunca los olvides',
    },
    {
      icon: Download,
      title: 'Exportar Planillas',
      description: 'Descargá y exportá las planillas de asistencia en cualquier momento',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="campusjuventudes"
                width={40}
                height={40}
                className="rounded-lg"
              />
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
              <Image
                src="/logo.png"
                alt="campusjuventudes"
                width={120}
                height={120}
                className="rounded-2xl shadow-2xl"
              />
            </div>

            {/* Título y descripción */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              campusjuventudes
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto">
              Plataforma para profesores
            </p>
            <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Controla la asistencia, organiza tus grupos y accede a reportes detallados de forma sencilla
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Características principales</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Conocé un poco la plataforma
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

            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">¿Qué puedes hacer?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Todas las herramientas que necesitas para una gestión educativa completa
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-4">
                  {[
                    'Controlar la asistencia en tiempo real',
                    'Visualizar los cumpleaños de tus alumnos',
                    'Exportar planillas de asistencia',
                    'Gestionar múltiples grupos de estudiantes',
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center text-slate-200">
                      <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      </div>
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
            Comenzá ahora
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            ¡Registrate y empezá a gestionar la asistencia de tus grupos!
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
          <div className="text-center">
            <div className="mb-6">
              <p className="text-slate-400 mb-4">
                Hecho con ❤️ por{' '}
                <a 
                  href="www.campusjuventudes.com.ar/tomi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition font-semibold"
                >
                  tomi
                </a>
              </p>
              <p className="text-slate-400">
                ¿Preguntas? Contactanos en{' '}
                <a 
                  href="mailto:contacto@campusjuventudes.com.ar"
                  className="text-blue-400 hover:text-blue-300 transition font-semibold"
                >
                  contacto@campusjuventudes.com.ar
                </a>
              </p>
            </div>

            <div className="border-t border-slate-700/50 pt-8">
              <p className="text-slate-500 text-sm">&copy; 2026 campusjuventudes.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
