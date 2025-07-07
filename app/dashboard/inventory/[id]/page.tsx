"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  Hash,
  Ruler,
  Palette,
  Tag,
  Plus,
  Eye,
} from "lucide-react"
import { inventoryService, type InventoryItem, type InventoryGroup } from "@/lib/services/inventory-service"

export default function ItemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [group, setGroup] = useState<InventoryGroup | null>(null)

  useEffect(() => {
    if (params.id) {
      loadItem(params.id as string)
    }
  }, [params.id])

  const loadItem = (id: string) => {
    const items = inventoryService.getItems()
    const foundItem = items.find((item) => item.id === id)

    if (foundItem) {
      setItem(foundItem)

      if (foundItem.groupId) {
        const groups = inventoryService.getGroups()
        const foundGroup = groups.find((g) => g.id === foundItem.groupId)
        setGroup(foundGroup || null)
      }
    }
  }

  const handleDeleteItem = () => {
    if (item && confirm("¿Está seguro de eliminar este item?")) {
      inventoryService.deleteItem(item.id)
      router.push("/dashboard/inventory")
    }
  }

  const handleDeleteState = (stateId: string) => {
    if (item && confirm("¿Está seguro de eliminar este estado?")) {
      inventoryService.deleteItemState(item.id, stateId)
      loadItem(item.id)
    }
  }

  const getConditionBadge = (condition: string) => {
    const variants = {
      Bueno: "bg-green-100 text-green-800",
      Regular: "bg-yellow-100 text-yellow-800",
      Malo: "bg-red-100 text-red-800",
    }
    return variants[condition as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getAcquisitionBadge = (type: string) => {
    const variants = {
      Recibo: "bg-blue-100 text-blue-800",
      Boleta: "bg-purple-100 text-purple-800",
      Donación: "bg-orange-100 text-orange-800",
    }
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  if (!item) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Item no encontrado</p>
        </div>
      </DashboardLayout>
    )
  }

  const totals = inventoryService.getItemTotals(item)
  const displayName = inventoryService.getItemDisplayName(item)
  const variantDescription = inventoryService.getVariantDescription(item)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-8 h-8" />
                {displayName}
              </h1>
              <p className="text-gray-600 mt-1">
                {group && (
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {group.name}
                  </span>
                )}
                {variantDescription && <span className="ml-2 text-sm text-gray-500">{variantDescription}</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/inventory/add?edit=${item.id}`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" onClick={handleDeleteItem}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cantidad Total</p>
                  <p className="text-2xl font-bold">{totals.totalQuantity}</p>
                </div>
                <Hash className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold">S/ {totals.totalValue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estados</p>
                  <p className="text-2xl font-bold">{item.states.length}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Buen Estado</p>
                  <p className="text-2xl font-bold">
                    {item.states.filter((s) => s.condition === "Bueno").reduce((sum, s) => sum + s.quantity, 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Item Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo de Producto</p>
                  <p className="text-sm">{item.productType}</p>
                </div>
                {item.variant.brand && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Marca</p>
                    <p className="text-sm">{item.variant.brand}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {item.variant.model && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Modelo</p>
                    <p className="text-sm">{item.variant.model}</p>
                  </div>
                )}
                {item.variant.color && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Palette className="w-4 h-4" />
                      Color
                    </p>
                    <p className="text-sm">{item.variant.color}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {item.variant.size && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tamaño</p>
                    <p className="text-sm">{item.variant.size}</p>
                  </div>
                )}
                {item.variant.material && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Material</p>
                    <p className="text-sm">{item.variant.material}</p>
                  </div>
                )}
              </div>

              {item.dimensions && (item.dimensions.length || item.dimensions.width || item.dimensions.height) && (
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    Dimensiones
                  </p>
                  <p className="text-sm">
                    {item.dimensions.length && `${item.dimensions.length}m`}
                    {item.dimensions.length && item.dimensions.width && " × "}
                    {item.dimensions.width && `${item.dimensions.width}m`}
                    {(item.dimensions.length || item.dimensions.width) && item.dimensions.height && " × "}
                    {item.dimensions.height && `${item.dimensions.height}m`}
                  </p>
                </div>
              )}

              {item.serialNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Número de Serie</p>
                  <p className="text-sm font-mono">{item.serialNumber}</p>
                </div>
              )}

              {item.variant.specifications && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Especificaciones</p>
                  <p className="text-sm">{item.variant.specifications}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">ID del Item</p>
                <p className="text-sm font-mono">{item.id}</p>
              </div>

              {group && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Grupo</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{group.name}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha de Creación
                </p>
                <p className="text-sm">{new Date(item.createdAt).toLocaleString("es-PE")}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Última Actualización
                </p>
                <p className="text-sm">{new Date(item.updatedAt).toLocaleString("es-PE")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* States Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estados del Item</CardTitle>
                <CardDescription>
                  Diferentes condiciones y propiedades de este item ({item.states.length} estados registrados)
                </CardDescription>
              </div>
              <Button onClick={() => router.push(`/dashboard/inventory/add?edit=${item.id}&addState=true`)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Estado
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Adquisición</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.states.map((state, index) => (
                    <TableRow key={state.id}>
                      <TableCell>
                        <Badge className={getConditionBadge(state.condition)}>{state.condition}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{state.quantity}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getAcquisitionBadge(state.acquisitionType)} variant="outline">
                            {state.acquisitionType}
                          </Badge>
                          <p className="text-xs text-gray-500">{state.acquisitionNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>S/ {state.unitValue.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">S/ {(state.unitValue * state.quantity).toFixed(2)}</TableCell>
                      <TableCell>{state.acquisitionDate}</TableCell>
                      <TableCell>
                        {state.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{state.location}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate" title={state.observations}>
                          {state.observations}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/inventory/add?edit=${item.id}&editState=${state.id}`)
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteState(state.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {item.states.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estados registrados</h3>
                <p className="text-gray-600 mb-4">Agregue el primer estado para este item</p>
                <Button onClick={() => router.push(`/dashboard/inventory/add?edit=${item.id}&addState=true`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Estado
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
