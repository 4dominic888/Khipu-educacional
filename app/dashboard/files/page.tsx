"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FileExplorer } from "@/components/file-explorer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Users, Shield, ImageIcon } from "lucide-react"

export default function FilesPage() {
  return (
    <DashboardLayout>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Espacio Usado</p>
                  <p className="text-2xl font-bold">2.4 GB</p>
                  <p className="text-xs text-gray-500">de 10 GB</p>
                </div>
                <HardDrive className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Archivos Públicos</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Archivos Privados</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Imágenes de Productos</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <ImageIcon className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
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
    </DashboardLayout>
  )
}
