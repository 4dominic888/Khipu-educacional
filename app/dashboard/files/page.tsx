"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FileExplorer } from "@/components/file-explorer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Users, Shield, ImageIcon } from "lucide-react"
import BasicCard from "@/components/basic-card"

export default function FilesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <HardDrive className="w-8 h-8" />
            Gestión de Archivos
          </h1>
          <p className="text-gray-600 mt-1">Administre documentos, imágenes y archivos institucionales</p>
        </div>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BasicCard
          title="Espacio Usado"
          quantity="2.4 GB"
          hint="de 10 GB"
          IconComponent={HardDrive}
          iconColor="text-blue-600"
        />
        <BasicCard
          title="Archivos Publicos"
          quantity="156"
          IconComponent={HardDrive}
          iconColor="text-green-600"
        />
        <BasicCard
          title="Archivos Privados"
          quantity="89"
          IconComponent={HardDrive}
          iconColor="text-orange-600"
        />
        <BasicCard
          title="Imágenes de Productos"
          quantity="24"
          IconComponent={HardDrive}
          iconColor="text-purple-600"
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Archivos Públicos
            </CardTitle>
            <CardDescription>Accesibles para toda la institución</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Los archivos marcados como públicos pueden ser visualizados y descargados por todos los usuarios del
              sistema.
            </p>
            <Badge className="mt-2 bg-green-100 text-green-800">Acceso Completo</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Imágenes de Productos
            </CardTitle>
            <CardDescription>Organización automática por producto</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Las imágenes subidas desde el inventario se organizan automáticamente en la carpeta de productos.
            </p>
            <Badge className="mt-2 bg-purple-100 text-purple-800">Auto-organizado</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              Archivos Privados
            </CardTitle>
            <CardDescription>Solo para administradores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Documentos confidenciales y archivos administrativos con acceso restringido.
            </p>
            <Badge className="mt-2 bg-orange-100 text-orange-800">Acceso Restringido</Badge>
          </CardContent>
        </Card>
      </div>

      {/* File Explorer */}
      <FileExplorer />
    </div>
  )
}
