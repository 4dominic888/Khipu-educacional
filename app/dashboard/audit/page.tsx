"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Search, Download, Eye, Calendar, User, Activity, AlertTriangle } from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  module: string
  details: string
  ipAddress: string
  userAgent: string
  severity: "low" | "medium" | "high"
}

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  useEffect(() => {
    // Load mock audit data
    const mockLogs: AuditLog[] = [
      {
        id: "1",
        timestamp: "2024-03-15T14:30:00Z",
        userId: "dir001",
        userName: "Director Principal",
        action: "LOGIN",
        module: "Sistema",
        details: "Inicio de sesión exitoso",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "low",
      },
      {
        id: "2",
        timestamp: "2024-03-15T14:35:00Z",
        userId: "dir001",
        userName: "Director Principal",
        action: "CREATE",
        module: "Inventario",
        details: "Agregó nuevo item: Escritorio de Madera",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "medium",
      },
      {
        id: "3",
        timestamp: "2024-03-15T14:40:00Z",
        userId: "dir001",
        userName: "Director Principal",
        action: "UPDATE",
        module: "Inventario",
        details: 'Modificó estado del item ID: 12345 de "Bueno" a "Regular"',
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "medium",
      },
      {
        id: "4",
        timestamp: "2024-03-15T15:00:00Z",
        userId: "prof001",
        userName: "María González",
        action: "LOGIN",
        module: "Sistema",
        details: "Inicio de sesión exitoso",
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "low",
      },
      {
        id: "5",
        timestamp: "2024-03-15T15:15:00Z",
        userId: "prof001",
        userName: "María González",
        action: "VIEW",
        module: "Documentos",
        details: "Accedió a plantillas de documentos",
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "low",
      },
      {
        id: "6",
        timestamp: "2024-03-15T15:30:00Z",
        userId: "dir001",
        userName: "Director Principal",
        action: "DELETE",
        module: "Inventario",
        details: "Eliminó item: Silla Rota (ID: 67890)",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "high",
      },
      {
        id: "7",
        timestamp: "2024-03-15T16:00:00Z",
        userId: "admin001",
        userName: "Administrador Sistema",
        action: "EXPORT",
        module: "Inventario",
        details: "Exportó inventario completo a Excel",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "medium",
      },
      {
        id: "8",
        timestamp: "2024-03-15T16:30:00Z",
        userId: "prof002",
        userName: "Carlos Mendoza",
        action: "CREATE",
        module: "Documentos",
        details: "Generó documento: Acta de Reunión - Consejo Académico",
        ipAddress: "192.168.1.110",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "medium",
      },
    ]

    setAuditLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [])

  useEffect(() => {
    let filtered = auditLogs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by module
    if (moduleFilter !== "all") {
      filtered = filtered.filter((log) => log.module === moduleFilter)
    }

    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter((log) => log.severity === severityFilter)
    }

    setFilteredLogs(filtered)
  }, [auditLogs, searchTerm, moduleFilter, severityFilter])

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return variants[severity as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getSeverityText = (severity: string) => {
    const texts = {
      low: "Bajo",
      medium: "Medio",
      high: "Alto",
    }
    return texts[severity as keyof typeof texts] || "Desconocido"
  }

  const getActionColor = (action: string) => {
    const colors = {
      LOGIN: "text-blue-600",
      LOGOUT: "text-gray-600",
      CREATE: "text-green-600",
      UPDATE: "text-yellow-600",
      DELETE: "text-red-600",
      VIEW: "text-purple-600",
      EXPORT: "text-indigo-600",
    }
    return colors[action as keyof typeof colors] || "text-gray-600"
  }

  const exportAuditLog = () => {
    // Mock export functionality
    alert("Exportando log de auditoría a Excel...")
  }

  const modules = [...new Set(auditLogs.map((log) => log.module))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-8 h-8" />
              Auditoría del Sistema
            </h1>
            <p className="text-gray-600 mt-1">Seguimiento y registro de actividades del sistema</p>
          </div>
          <Button onClick={exportAuditLog}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Log
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Eventos</p>
                  <p className="text-2xl font-bold">{filteredLogs.length}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold">{new Set(filteredLogs.map((log) => log.userId)).size}</p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Eventos Críticos</p>
                  <p className="text-2xl font-bold">{filteredLogs.filter((log) => log.severity === "high").length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoy</p>
                  <p className="text-2xl font-bold">
                    {
                      filteredLogs.filter((log) => new Date(log.timestamp).toDateString() === new Date().toDateString())
                        .length
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por usuario, acción o detalles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los módulos</SelectItem>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las severidades</SelectItem>
                  <SelectItem value="low">Bajo</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Auditoría</CardTitle>
            <CardDescription>{filteredLogs.length} eventos encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString("es-PE")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.userName}</p>
                          <p className="text-sm text-gray-500">{log.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getActionColor(log.action)}`}>{log.action}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate" title={log.details}>
                          {log.details}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityBadge(log.severity)}>{getSeverityText(log.severity)}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
