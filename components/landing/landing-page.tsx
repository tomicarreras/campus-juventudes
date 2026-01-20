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
      description: 'Registrá la asistencia de tus estudiantes de manera rápida y eficiente',
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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="campusjuventudes"
                width={150}
                height={150}
                className=""
              />
            </div>
            <Button
              onClick={() => router.push('/auth/login')}
              className="bg-slate-700 hover:bg-slate-800 text-white"
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Logo grande */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="campusjuventudes"
                width={400}
                height={400}
                className=""
              />
            </div>

            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Controlá la asistencia, organizá tus grupos y accedé a reportes detallados de forma sencilla
            </p>

            {/* CTA Button */}
            <Button
              onClick={() => router.push('/auth/login')}
              size="lg"
              className="bg-slate-700 hover:bg-slate-800 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">Características principales</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Conocé un poco la plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-all hover:border-slate-400 group"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center group-hover:bg-slate-300 transition-all">
                        <Icon className="w-6 h-6 text-slate-700" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - REMOVED */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">
            Comenzá ahora
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            ¡Registrate y empezá a gestionar la asistencia de tus grupos!
          </p>
          <Button
            onClick={() => router.push('/auth/registro')}
            size="lg"
            className="bg-slate-700 hover:bg-slate-800 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Registrate
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-slate-50/50 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Desarrollado por{' '}
                <a 
                  href="https://speaktoday.com.ar/tomi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:text-slate-600 transition font-semibold"
                >
                  tomi
                </a>
              </p>
              <p className="text-slate-600">
                ¿Preguntas? Contactanos en{' '}
                <a 
                  href="mailto:contacto@campusjuventudes.com.ar"
                  className="text-slate-800 hover:text-slate-600 transition font-semibold"
                >
                  contacto@campusjuventudes.com.ar
                </a>
              </p>
            </div>

            <div className="border-t border-slate-200/50 pt-8">
              <p className="text-slate-500 text-sm">&copy; 2026 campusjuventudes.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
