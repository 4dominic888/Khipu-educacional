"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-gray-600 mt-1">Bienvenido al sistema de gestión de {institution.name}</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Año Académico {currentYear}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${module.color}`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{module.stats}</span>
                  <Button size="sm" onClick={() => router.push(module.href)}>
                    Abrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo item agregado al inventario</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FileText className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Documento generado: Acta de reunión</p>
                  <p className="text-xs text-gray-500">Hace 1 día</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <ClipboardList className="w-4 h-4 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Censo actualizado</p>
                  <p className="text-xs text-gray-500">Hace 3 días</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
