"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  FileText,
  ClipboardList,
  Shield,
  HelpCircle,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [institution, setInstitution] = useState<any>(null)
  const [currentYear, setCurrentYear] = useState<string>("")

  useEffect(() => {
    const institutionData = localStorage.getItem("khipu_institution")
    const year = localStorage.getItem("khipu_current_year")

    if (!institutionData) {
      router.push("/")
      return
    }

    setInstitution(JSON.parse(institutionData))
    setCurrentYear(year || "2024")
  }, [router])

  if (!institution) {
    return <div>Cargando...</div>
  }

  const modules = [
    {
      id: "inventory",
      title: "Inventario de Bienes",
      description: "Gestión de bienes inmuebles y activos",
      icon: Package,
      color: "bg-blue-500",
      href: "/dashboard/inventory",
      stats: "156 items registrados",
    },
    {
      id: "census",
      title: "Censo Institucional",
      description: "Evaluación del estado de la institución",
      icon: ClipboardList,
      color: "bg-green-500",
      href: "/dashboard/census",
      stats: "Último censo: Marzo 2024",
    },
    {
      id: "documents",
      title: "Documentos de Gestión",
      description: "Generación de documentos y actas",
      icon: FileText,
      color: "bg-purple-500",
      href: "/dashboard/documents",
      stats: "12 plantillas disponibles",
    },
    {
      id: "audit",
      title: "Auditoría",
      description: "Seguimiento de acciones del sistema",
      icon: Shield,
      color: "bg-orange-500",
      href: "/dashboard/audit",
      stats: "89 acciones registradas",
    },
    {
      id: "support",
      title: "Soporte",
      description: "Ayuda y contacto técnico",
      icon: HelpCircle,
      color: "bg-pink-500",
      href: "/dashboard/support",
      stats: "Centro de ayuda",
    },
  ]

  const quickStats = [
    {
      title: "Año Académico Actual",
      value: currentYear,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Usuarios Activos",
      value: "24",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Módulos Activos",
      value: "5",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

    const activity = [
    {
      title: "Nuevo item agregado al inventario",
      value: "Hace 2 horas",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Documento generado: Acta de reunión",
      value: "Hace 1 día",
      icon: ClipboardList,
      color: "text-green-600",
    },
    {
      title: "Censo actualizado",
      value: "Hace 3 días",
      icon: FileText,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="mt-1">Bienvenido al sistema de gestión de {institution.name}</p>
        </div>
        {/* change and rearange badge */}
        <Badge variant="outline" className="text-sm">
          Año Académico {currentYear}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm" key={index}>
            <div>
              <p className="text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div className="flex p-6 border rounded-lg shadow-sm cursor-pointer flex-col">
            <div className="flex items-center gap-3 mb-3.5">
              <div className={`p-2 rounded-lg ${module.color}`}>
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-semibold leading-none tracking-tight">{module.title}</h1>
            </div>
            <p className="text-muted-foreground pb-3">{module.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{module.stats}</span>
              <button className="h-9 rounded-md px-3 bg-white text-black text-sm" onClick={() => router.push(module.href)}>
                Abrir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="flex p-6 border rounded-lg shadow-sm cursor-pointer flex-col">
        <div className="flex items-center gap-3 mb-3.5">
          <AlertCircle className="w-5 h-5" />
          <h1 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">Actividad reciente</h1>
        </div>
        {activity.map((activity) => (
        <div className="flex p-3 border rounded-lg shadow-sm cursor-pointer flex-col my-1">
          <div className="flex items-center gap-3">
            <activity.icon className={`w-6 h-6 p-1 ${activity.color}`} />
            <div>
              <h1 className="text-sm font-medium">{activity.title}</h1>
              <p className="text-xs text-muted-foreground ">{activity.value}</p>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}
