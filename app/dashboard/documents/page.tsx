"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Download, Eye, Calendar, Users, FileDown } from "lucide-react"

interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: {
    name: string
    label: string
    type: "text" | "textarea" | "date" | "select"
    required: boolean
    options?: string[]
  }[]
}

interface GeneratedDocument {
  id: string
  templateId: string
  templateName: string
  title: string
  createdAt: string
  createdBy: string
  data: Record<string, any>
}

export default function DocumentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([
    {
      id: "1",
      templateId: "1",
      templateName: "Acta de Reunión",
      title: "Acta de Reunión - Consejo Académico",
      createdAt: "2024-03-15",
      createdBy: "Director",
      data: {
        meetingDate: "2024-03-15",
        meetingTime: "14:00",
        attendees: "Director, Subdirector, Coordinadores",
        agenda: "Planificación académica segundo trimestre",
      },
    },
    {
      id: "2",
      templateId: "2",
      templateName: "Oficio",
      title: "Oficio N° 001-2024",
      createdAt: "2024-03-10",
      createdBy: "Director",
      data: {
        recipient: "UGEL Lima Norte",
        subject: "Solicitud de materiales educativos",
        content: "Solicitud formal de materiales para el año académico 2024",
      },
    },
  ])

  const templates: DocumentTemplate[] = [
    {
      id: "1",
      name: "Acta de Reunión",
      description: "Plantilla para generar actas de reuniones institucionales",
      category: "Administrativo",
      fields: [
        { name: "meetingDate", label: "Fecha de Reunión", type: "date", required: true },
        { name: "meetingTime", label: "Hora de Reunión", type: "text", required: true },
        { name: "location", label: "Lugar", type: "text", required: false },
        { name: "attendees", label: "Asistentes", type: "textarea", required: true },
        { name: "agenda", label: "Agenda", type: "textarea", required: true },
        { name: "agreements", label: "Acuerdos", type: "textarea", required: false },
        { name: "nextMeeting", label: "Próxima Reunión", type: "date", required: false },
      ],
    },
    {
      id: "2",
      name: "Oficio",
      description: "Plantilla para oficios y comunicaciones formales",
      category: "Comunicación",
      fields: [
        { name: "number", label: "Número de Oficio", type: "text", required: true },
        { name: "date", label: "Fecha", type: "date", required: true },
        { name: "recipient", label: "Destinatario", type: "text", required: true },
        { name: "subject", label: "Asunto", type: "text", required: true },
        { name: "content", label: "Contenido", type: "textarea", required: true },
        { name: "attachments", label: "Anexos", type: "textarea", required: false },
      ],
    },
    {
      id: "3",
      name: "Solicitud de Permiso",
      description: "Plantilla para solicitudes de permisos del personal",
      category: "Recursos Humanos",
      fields: [
        { name: "employeeName", label: "Nombre del Empleado", type: "text", required: true },
        { name: "employeeId", label: "DNI", type: "text", required: true },
        { name: "position", label: "Cargo", type: "text", required: true },
        { name: "requestDate", label: "Fecha de Solicitud", type: "date", required: true },
        {
          name: "leaveType",
          label: "Tipo de Permiso",
          type: "select",
          required: true,
          options: ["Vacaciones", "Enfermedad", "Personal", "Capacitación", "Otro"],
        },
        { name: "startDate", label: "Fecha de Inicio", type: "date", required: true },
        { name: "endDate", label: "Fecha de Fin", type: "date", required: true },
        { name: "reason", label: "Motivo", type: "textarea", required: true },
      ],
    },
    {
      id: "4",
      name: "Informe de Actividades",
      description: "Plantilla para informes de actividades realizadas",
      category: "Académico",
      fields: [
        { name: "reportTitle", label: "Título del Informe", type: "text", required: true },
        { name: "reportDate", label: "Fecha del Informe", type: "date", required: true },
        { name: "period", label: "Período", type: "text", required: true },
        { name: "responsible", label: "Responsable", type: "text", required: true },
        { name: "activities", label: "Actividades Realizadas", type: "textarea", required: true },
        { name: "results", label: "Resultados Obtenidos", type: "textarea", required: true },
        { name: "observations", label: "Observaciones", type: "textarea", required: false },
        { name: "recommendations", label: "Recomendaciones", type: "textarea", required: false },
      ],
    },
  ]

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setFormData({})
    setIsCreateDialogOpen(true)
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleGenerateDocument = () => {
    if (!selectedTemplate) return

    const newDoc: GeneratedDocument = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      title: formData.title || `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Director", // This would come from auth context
      data: formData,
    }

    setGeneratedDocs((prev) => [newDoc, ...prev])
    setIsCreateDialogOpen(false)
    setSelectedTemplate(null)
    setFormData({})

    // Mock document generation
    alert("Documento generado exitosamente. En una implementación real, se descargaría el archivo Word.")
  }

  const handleDownloadDocument = (doc: GeneratedDocument) => {
    // Mock download functionality
    alert(`Descargando: ${doc.title}.docx`)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Administrativo: "bg-blue-100 text-blue-800",
      Comunicación: "bg-green-100 text-green-800",
      "Recursos Humanos": "bg-purple-100 text-purple-800",
      Académico: "bg-orange-100 text-orange-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Documentos de Gestión
            </h1>
            <p className="text-gray-600 mt-1">Generación de documentos y plantillas institucionales</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Plantillas</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Generados</p>
                  <p className="text-2xl font-bold">{generatedDocs.length}</p>
                </div>
                <FileDown className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Este Mes</p>
                  <p className="text-2xl font-bold">
                    {generatedDocs.filter((doc) => new Date(doc.createdAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorías</p>
                  <p className="text-2xl font-bold">{new Set(templates.map((t) => t.category)).size}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Plantillas Disponibles</CardTitle>
            <CardDescription>Seleccione una plantilla para generar un nuevo documento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                    </div>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{template.fields.length} campos</span>
                      <Button size="sm" onClick={() => handleTemplateSelect(template)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Usar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generated Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Generados</CardTitle>
            <CardDescription>Historial de documentos creados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{doc.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Plantilla: {doc.templateName}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {doc.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {doc.createdBy}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Document Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generar Documento: {selectedTemplate?.name}</DialogTitle>
              <DialogDescription>Complete los campos para generar el documento</DialogDescription>
            </DialogHeader>

            {selectedTemplate && (
              <div className="grid gap-4 py-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>

                    {field.type === "text" && (
                      <Input
                        id={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "textarea" && (
                      <Textarea
                        id={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                        rows={3}
                      />
                    )}

                    {field.type === "date" && (
                      <Input
                        id={field.name}
                        type="date"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "select" && field.options && (
                      <Select
                        value={formData[field.name] || ""}
                        onValueChange={(value) => handleFieldChange(field.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGenerateDocument}>
                <FileDown className="w-4 h-4 mr-2" />
                Generar Documento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
