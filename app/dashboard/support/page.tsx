"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Book,
  Video,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react"

interface SupportTicket {
  id: string
  subject: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "in_progress" | "resolved" | "closed"
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

export default function SupportPage() {
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium" as const,
  })
  const [tickets] = useState<SupportTicket[]>([
    {
      id: "1",
      subject: "Error al exportar inventario a Excel",
      description: "Al intentar exportar el inventario completo, el sistema muestra un error y no genera el archivo.",
      category: "Inventario",
      priority: "high",
      status: "in_progress",
      createdAt: "2024-03-10",
      updatedAt: "2024-03-12",
      createdBy: "Director Principal",
    },
    {
      id: "2",
      subject: "Solicitud de nueva plantilla de documento",
      description: "Necesitamos una plantilla para generar certificados de estudios.",
      category: "Documentos",
      priority: "medium",
      status: "open",
      createdAt: "2024-03-08",
      updatedAt: "2024-03-08",
      createdBy: "María González",
    },
    {
      id: "3",
      subject: "Problema con acceso de usuarios",
      description: "Algunos profesores no pueden acceder al sistema con sus credenciales.",
      category: "Sistema",
      priority: "high",
      status: "resolved",
      createdAt: "2024-03-05",
      updatedAt: "2024-03-07",
      createdBy: "Director Principal",
    },
  ])

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "¿Cómo agregar un nuevo item al inventario?",
      answer:
        'Para agregar un nuevo item al inventario: 1) Vaya al módulo de Inventario, 2) Haga clic en "Agregar Item", 3) Complete todos los campos obligatorios (producto, fecha de adquisición, valor, etc.), 4) Haga clic en "Guardar". El item aparecerá inmediatamente en la lista.',
      category: "Inventario",
      helpful: 15,
    },
    {
      id: "2",
      question: "¿Cómo generar un documento usando las plantillas?",
      answer:
        'Para generar un documento: 1) Acceda al módulo de Documentos de Gestión, 2) Seleccione la plantilla deseada, 3) Complete todos los campos del formulario, 4) Haga clic en "Generar Documento". El archivo Word se descargará automáticamente.',
      category: "Documentos",
      helpful: 12,
    },
    {
      id: "3",
      question: "¿Cómo cambiar el año académico activo?",
      answer:
        'Para cambiar el año académico: 1) En la barra lateral, busque la sección "Año Académico", 2) Haga clic en el botón con el año actual, 3) Seleccione el año deseado del menú desplegable. También puede crear un nuevo año desde este menú.',
      category: "Sistema",
      helpful: 8,
    },
    {
      id: "4",
      question: "¿Cómo exportar el inventario completo?",
      answer:
        'Para exportar el inventario: 1) Vaya al módulo de Inventario, 2) Haga clic en el botón "Exportar Excel" en la parte superior derecha, 3) El archivo se descargará con todos los items del año académico actual.',
      category: "Inventario",
      helpful: 10,
    },
    {
      id: "5",
      question: "¿Qué hacer si olvido mi contraseña?",
      answer:
        "Si olvida su contraseña: 1) Contacte al administrador del sistema (Director), 2) Proporcione su nombre completo y DNI para verificación, 3) El administrador podrá restablecer su contraseña. Por seguridad, no hay opción de auto-restablecimiento.",
      category: "Sistema",
      helpful: 6,
    },
  ]

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    // Mock ticket creation
    console.log("Creating ticket:", newTicket)
    alert("Ticket de soporte creado exitosamente. Recibirá una respuesta en las próximas 24 horas.")

    setNewTicket({
      subject: "",
      description: "",
      category: "",
      priority: "medium",
    })
    setIsTicketDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      open: { color: "bg-blue-100 text-blue-800", icon: Clock },
      in_progress: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      resolved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      closed: { color: "bg-gray-100 text-gray-800", icon: CheckCircle },
    }
    return variants[status as keyof typeof variants] || variants.open
  }

  const getStatusText = (status: string) => {
    const texts = {
      open: "Abierto",
      in_progress: "En Progreso",
      resolved: "Resuelto",
      closed: "Cerrado",
    }
    return texts[status as keyof typeof texts] || "Desconocido"
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getPriorityText = (priority: string) => {
    const texts = {
      low: "Baja",
      medium: "Media",
      high: "Alta",
    }
    return texts[priority as keyof typeof texts] || "Desconocida"
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-8 h-8" />
              Centro de Soporte
            </h1>
            <p className="text-gray-600 mt-1">Ayuda, documentación y soporte técnico</p>
          </div>
          <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Crear Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Ticket de Soporte</DialogTitle>
                <DialogDescription>Describa su problema o solicitud para recibir ayuda</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto *</Label>
                  <Input
                    id="subject"
                    placeholder="Resumen breve del problema"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={newTicket.category}
                      onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sistema">Sistema</SelectItem>
                        <SelectItem value="Inventario">Inventario</SelectItem>
                        <SelectItem value="Documentos">Documentos</SelectItem>
                        <SelectItem value="Censo">Censo</SelectItem>
                        <SelectItem value="Auditoría">Auditoría</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describa detalladamente el problema o solicitud"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTicketDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTicket}>
                  <Send className="w-4 h-4 mr-2" />
                  Crear Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Manual de Usuario</h3>
              <p className="text-sm text-gray-600">Guía completa del sistema</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Video className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Video Tutoriales</h3>
              <p className="text-sm text-gray-600">Aprenda paso a paso</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Soporte Telefónico</h3>
              <p className="text-sm text-gray-600">+51 1 234-5678</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Email</h3>
              <p className="text-sm text-gray-600">soporte@khipu.edu.pe</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
            <CardDescription>Encuentre respuestas rápidas a las consultas más comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <span>{faq.question}</span>
                      <Badge variant="outline" className="ml-auto">
                        {faq.category}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-gray-700">{faq.answer}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>¿Fue útil esta respuesta?</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            👍 Sí ({faq.helpful})
                          </Button>
                          <Button variant="ghost" size="sm">
                            👎 No
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Tickets de Soporte</CardTitle>
            <CardDescription>Seguimiento de sus solicitudes de soporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const statusInfo = getStatusBadge(ticket.status)
                const StatusIcon = statusInfo.icon

                return (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <div className="flex gap-2">
                        <Badge className={getPriorityBadge(ticket.priority)}>{getPriorityText(ticket.priority)}</Badge>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusText(ticket.status)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Ticket #{ticket.id}</span>
                        <span>Categoría: {ticket.category}</span>
                        <span>Creado: {ticket.createdAt}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>Canales de comunicación para soporte técnico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-medium">Teléfono</h4>
                  <p className="text-sm text-gray-600">+51 1 234-5678</p>
                  <p className="text-xs text-gray-500">Lun-Vie 8:00-18:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-gray-600">soporte@khipu.edu.pe</p>
                  <p className="text-xs text-gray-500">Respuesta en 24h</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <div>
                  <h4 className="font-medium">Chat en Vivo</h4>
                  <p className="text-sm text-gray-600">Disponible en horario laboral</p>
                  <p className="text-xs text-gray-500">Respuesta inmediata</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
