"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Puzzle,
  Download,
  Settings,
  Search,
  UserCheck,
  BookOpen,
  Users,
  Calendar,
  Library,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { pluginService, type Plugin } from "@/lib/plugin-system"

const iconMap = {
  UserCheck,
  BookOpen,
  Users,
  Calendar,
  Library,
  DollarSign,
  Puzzle,
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    loadPlugins()
  }, [])

  const loadPlugins = () => {
    setPlugins(pluginService.getPlugins())
  }

  const handleTogglePlugin = (pluginId: string, enabled: boolean) => {
    if (enabled) {
      pluginService.enablePlugin(pluginId)
    } else {
      pluginService.disablePlugin(pluginId)
    }
    loadPlugins()
  }

  const filteredPlugins = plugins.filter((plugin) => {
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || plugin.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      administrative: "bg-green-100 text-green-800",
      technical: "bg-purple-100 text-purple-800",
      reports: "bg-orange-100 text-orange-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getCategoryText = (category: string) => {
    const texts = {
      academic: "Académico",
      administrative: "Administrativo",
      technical: "Técnico",
      reports: "Reportes",
    }
    return texts[category as keyof typeof texts] || category
  }

  const enabledCount = plugins.filter((p) => p.enabled).length
  const categories = [...new Set(plugins.map((p) => p.category))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Puzzle className="w-8 h-8" />
              Gestión de Plugins
            </h1>
            <p className="text-gray-600 mt-1">Administre las funcionalidades adicionales del sistema</p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Instalar Plugin
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Plugins</p>
                  <p className="text-2xl font-bold">{plugins.length}</p>
                </div>
                <Puzzle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activos</p>
                  <p className="text-2xl font-bold">{enabledCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactivos</p>
                  <p className="text-2xl font-bold">{plugins.length - enabledCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorías</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar plugins..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="academic">Académico</TabsTrigger>
                  <TabsTrigger value="administrative">Administrativo</TabsTrigger>
                  <TabsTrigger value="reports">Reportes</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Plugin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlugins.map((plugin) => {
            const IconComponent = iconMap[plugin.icon as keyof typeof iconMap] || Puzzle

            return (
              <Card key={plugin.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${plugin.enabled ? "bg-green-500" : "bg-gray-500"}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryBadgeColor(plugin.category)}>
                            {getCategoryText(plugin.category)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            v{plugin.version}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={plugin.enabled}
                      onCheckedChange={(checked) => handleTogglePlugin(plugin.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4">{plugin.description}</CardDescription>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Por: {plugin.author}</span>
                    <div className="flex items-center gap-1">
                      {plugin.enabled ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span>{plugin.enabled ? "Activo" : "Inactivo"}</span>
                    </div>
                  </div>
                  {plugin.enabled && (
                    <Button size="sm" className="w-full mt-3" onClick={() => (window.location.href = plugin.route)}>
                      Abrir Plugin
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredPlugins.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron plugins</h3>
              <p className="text-gray-600">Intente ajustar sus filtros de búsqueda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
