"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ClipboardList, Plus, Eye, FileText, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface CensusReport {
  id: string
  title: string
  description: string
  status: "draft" | "in_progress" | "completed"
  createdAt: string
  completedAt?: string
  progress: number
  sections: {
    name: string
    completed: boolean
  }[]
}

export default function CensusPage() {
  const router = useRouter()
  const [reports] = useState<CensusReport[]>([
    {
      id: "1",
      title: "Censo Institucional 2024",
      description: "Evaluación integral del estado de la institución educativa",
      status: "completed",
      createdAt: "2024-03-01",
      completedAt: "2024-03-15",
      progress: 100,
      sections: [
        { name: "Infraestructura", completed: true },
        { name: "Recursos Humanos", completed: true },
        { name: "Equipamiento", completed: true },
        { name: "Servicios Básicos", completed: true },
        { name: "Seguridad", completed: true },
      ],
    },
    {
      id: "2",
      title: "Evaluación de Aulas - Primer Trimestre",
      description: "Revisión del estado de las aulas y mobiliario estudiantil",
      status: "in_progress",
      createdAt: "2024-04-01",
      progress: 65,
      sections: [
        { name: "Estado de Aulas", completed: true },
        { name: "Mobiliario Estudiantil", completed: true },
        { name: "Equipos Audiovisuales", completed: false },
        { name: "Iluminación y Ventilación", completed: false },
        { name: "Limpieza y Mantenimiento", completed: true },
      ],
    },
    {
      id: "3",
      title: "Censo de Recursos Tecnológicos",
      description: "Inventario y evaluación de equipos tecnológicos disponibles",
      status: "draft",
      createdAt: "2024-04-10",
      progress: 0,
      sections: [
        { name: "Computadoras", completed: false },
        { name: "Proyectores", completed: false },
        { name: "Equipos de Audio", completed: false },
        { name: "Conectividad", completed: false },
        { name: "Software Educativo", completed: false },
      ],
    },
  ])

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { color: "bg-gray-100 text-gray-800", icon: Clock },
      in_progress: { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    }
    return variants[status as keyof typeof variants] || variants.draft
  }

  const getStatusText = (status: string) => {
    const texts = {
      draft: "Borrador",
      in_progress: "En Progreso",
      completed: "Completado",
    }
    return texts[status as keyof typeof texts] || "Desconocido"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-8 h-8" />
              Censo Institucional
            </h1>
            <p className="text-gray-600 mt-1">Evaluación y seguimiento del estado de la institución</p>
          </div>
          <Button onClick={() => router.push("/dashboard/census/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Censo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Censos</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completados</p>
                  <p className="text-2xl font-bold">{reports.filter((r) => r.status === "completed").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold">{reports.filter((r) => r.status === "in_progress").length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Borradores</p>
                  <p className="text-2xl font-bold">{reports.filter((r) => r.status === "draft").length}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="grid gap-6">
          {reports.map((report) => {
            const statusInfo = getStatusBadge(report.status)
            const StatusIcon = statusInfo.icon

            return (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {report.title}
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusText(report.status)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">{report.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      {report.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Reporte
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{report.progress}%</span>
                      </div>
                      <Progress value={report.progress} className="h-2" />
                    </div>

                    {/* Sections */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Secciones</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {report.sections.map((section, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                              section.completed ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {section.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                            <span>{section.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Creado: {report.createdAt}</span>
                      </div>
                      {report.completedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completado: {report.completedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {reports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay censos registrados</h3>
              <p className="text-gray-600 mb-4">Comience creando su primer censo institucional</p>
              <Button onClick={() => router.push("/dashboard/census/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Censo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
