"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash2, Save, X, Edit } from "lucide-react"
import {
  inventoryService,
  type InventoryItem,
  type InventoryItemState,
  type InventoryGroup,
} from "@/lib/services/inventory-service"

interface FormData {
  productType: string
  variant: {
    color?: string
    size?: string
    material?: string
    brand?: string
    model?: string
    specifications?: string
  }
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  serialNumber?: string
  groupId?: string
  states: Omit<InventoryItemState, "id">[]
}

export default function AddInventoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [groups, setGroups] = useState<InventoryGroup[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isAddingState, setIsAddingState] = useState(false)
  const [editingStateId, setEditingStateId] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    productType: "",
    variant: {},
    dimensions: {},
    serialNumber: "",
    groupId: "",
    states: [],
  })

  const [currentState, setCurrentState] = useState<Omit<InventoryItemState, "id">>({
    condition: "Bueno",
    acquisitionType: "Recibo",
    acquisitionNumber: "",
    acquisitionDate: "",
    unitValue: 0,
    quantity: 1,
    observations: "",
    location: "",
  })

  useEffect(() => {
    setGroups(inventoryService.getGroups())

    // Handle URL parameters
    const editId = searchParams.get("edit")
    const groupId = searchParams.get("group")
    const addState = searchParams.get("addState")
    const editStateId = searchParams.get("editState")

    if (editId) {
      const item = inventoryService.getItems().find((i) => i.id === editId)
      if (item) {
        setIsEditing(true)
        setEditingItem(item)
        setFormData({
          productType: item.productType,
          variant: item.variant,
          dimensions: item.dimensions,
          serialNumber: item.serialNumber,
          groupId: item.groupId || "",
          states: item.states.map(({ id, ...state }) => state),
        })

        if (addState === "true") {
          setIsAddingState(true)
        }

        if (editStateId) {
          const state = item.states.find((s) => s.id === editStateId)
          if (state) {
            setEditingStateId(editStateId)
            const { id, ...stateData } = state
            setCurrentState(stateData)
          }
        }
      }
    } else if (groupId) {
      setFormData((prev) => ({ ...prev, groupId }))
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      // setFormData((prev) => ({
      //   ...prev,
      //   [parent]: {
      //     ...prev[parent as keyof FormData],
      //     [child]: value,
      //   },
      // }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleStateChange = (field: keyof typeof currentState, value: any) => {
    setCurrentState((prev) => ({ ...prev, [field]: value }))
  }

  const addState = () => {
    if (!currentState.acquisitionNumber || !currentState.acquisitionDate) {
      alert("Por favor complete los campos requeridos del estado")
      return
    }

    if (editingStateId) {
      // Update existing state
      setFormData((prev) => ({
        ...prev,
        states: prev.states.map((state, index) => {
          const stateId = editingItem?.states[index]?.id
          return stateId === editingStateId ? currentState : state
        }),
      }))
      setEditingStateId(null)
    } else {
      // Add new state
      setFormData((prev) => ({
        ...prev,
        states: [...prev.states, currentState],
      }))
    }

    // Reset current state
    setCurrentState({
      condition: "Bueno",
      acquisitionType: "Recibo",
      acquisitionNumber: "",
      acquisitionDate: "",
      unitValue: 0,
      quantity: 1,
      observations: "",
      location: "",
    })
    setIsAddingState(false)
  }

  const removeState = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      states: prev.states.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    if (!formData.productType) {
      alert("Por favor ingrese el tipo de producto")
      return
    }

    if (formData.states.length === 0) {
      alert("Por favor agregue al menos un estado")
      return
    }

    try {
      // if (isEditing && editingItem) {
      //   inventoryService.updateItem(editingItem.id, formData)
      // } else {
      //   inventoryService.addItem(formData)
      // }
      router.push("/dashboard/inventory")
    } catch (error) {
      console.error("Error saving item:", error)
      alert("Error al guardar el item")
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

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Editar Item" : "Agregar Item"}</h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? "Modifica la información del item" : "Registra un nuevo item en el inventario"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/inventory")}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Datos principales del item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productType">Tipo de Producto *</Label>
                  <Input
                    id="productType"
                    value={formData.productType}
                    onChange={(e) => handleInputChange("productType", e.target.value)}
                    placeholder="ej. Sillas, Mesas, Computadoras"
                  />
                </div>
                <div>
                  <Label htmlFor="groupId">Grupo</Label>
                  <Select value={formData.groupId} onValueChange={(value) => handleInputChange("groupId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Sin grupo</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.variant.color || ""}
                    onChange={(e) => handleInputChange("variant.color", e.target.value)}
                    placeholder="ej. Azul, Rojo, Blanco"
                  />
                </div>
                <div>
                  <Label htmlFor="size">Tamaño</Label>
                  <Input
                    id="size"
                    value={formData.variant.size || ""}
                    onChange={(e) => handleInputChange("variant.size", e.target.value)}
                    placeholder="ej. Grande, Mediano, Pequeño"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.variant.material || ""}
                    onChange={(e) => handleInputChange("variant.material", e.target.value)}
                    placeholder="ej. Madera, Metal, Plástico"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={formData.variant.brand || ""}
                    onChange={(e) => handleInputChange("variant.brand", e.target.value)}
                    placeholder="ej. HP, Dell, Samsung"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    value={formData.variant.model || ""}
                    onChange={(e) => handleInputChange("variant.model", e.target.value)}
                    placeholder="ej. ProDesk 400, Inspiron 15"
                  />
                </div>
                <div>
                  <Label htmlFor="serialNumber">Número de Serie</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber || ""}
                    onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                    placeholder="ej. ABC123456789"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specifications">Especificaciones</Label>
                <Textarea
                  id="specifications"
                  value={formData.variant.specifications || ""}
                  onChange={(e) => handleInputChange("variant.specifications", e.target.value)}
                  placeholder="Descripción detallada del item"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle>Dimensiones</CardTitle>
              <CardDescription>Medidas físicas del item (opcional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="length">Largo (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.01"
                    value={formData.dimensions?.length || ""}
                    onChange={(e) =>
                      handleInputChange("dimensions.length", Number.parseFloat(e.target.value) || undefined)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Ancho (m)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.01"
                    value={formData.dimensions?.width || ""}
                    onChange={(e) =>
                      handleInputChange("dimensions.width", Number.parseFloat(e.target.value) || undefined)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Alto (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    value={formData.dimensions?.height || ""}
                    onChange={(e) =>
                      handleInputChange("dimensions.height", Number.parseFloat(e.target.value) || undefined)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* States Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estados del Item</CardTitle>
                <CardDescription>
                  Diferentes lotes o condiciones del item ({formData.states.length} estados)
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddingState(true)} disabled={isAddingState}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Estado
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add/Edit State Form */}
            {(isAddingState || editingStateId) && (
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">{editingStateId ? "Editar Estado" : "Nuevo Estado"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition">Condición *</Label>
                      <Select
                        value={currentState.condition}
                        onValueChange={(value) => handleStateChange("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bueno">Bueno</SelectItem>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Malo">Malo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="acquisitionType">Tipo de Adquisición *</Label>
                      <Select
                        value={currentState.acquisitionType}
                        onValueChange={(value) => handleStateChange("acquisitionType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Recibo">Recibo</SelectItem>
                          <SelectItem value="Boleta">Boleta</SelectItem>
                          <SelectItem value="Donación">Donación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="acquisitionNumber">Número de Documento *</Label>
                      <Input
                        id="acquisitionNumber"
                        value={currentState.acquisitionNumber}
                        onChange={(e) => handleStateChange("acquisitionNumber", e.target.value)}
                        placeholder="ej. R-2024-001, B001-00123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="acquisitionDate">Fecha de Adquisición *</Label>
                      <Input
                        id="acquisitionDate"
                        type="date"
                        value={currentState.acquisitionDate}
                        onChange={(e) => handleStateChange("acquisitionDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quantity">Cantidad *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={currentState.quantity}
                        onChange={(e) => handleStateChange("quantity", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unitValue">Valor Unitario (S/)</Label>
                      <Input
                        id="unitValue"
                        type="number"
                        step="0.01"
                        min="0"
                        value={currentState.unitValue}
                        onChange={(e) => handleStateChange("unitValue", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={currentState.location}
                        onChange={(e) => handleStateChange("location", e.target.value)}
                        placeholder="ej. Aula 101, Oficina"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea
                      id="observations"
                      value={currentState.observations}
                      onChange={(e) => handleStateChange("observations", e.target.value)}
                      placeholder="Notas adicionales sobre este estado"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addState}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingStateId ? "Actualizar Estado" : "Agregar Estado"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingState(false)
                        setEditingStateId(null)
                        setCurrentState({
                          condition: "Bueno",
                          acquisitionType: "Recibo",
                          acquisitionNumber: "",
                          acquisitionDate: "",
                          unitValue: 0,
                          quantity: 1,
                          observations: "",
                          location: "",
                        })
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* States Table */}
            {formData.states.length > 0 && (
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
                    {formData.states.map((state, index) => (
                      <TableRow key={index}>
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
                        <TableCell className="font-medium">
                          S/ {(state.unitValue * state.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>{state.acquisitionDate}</TableCell>
                        <TableCell>{state.location && <span className="text-sm">{state.location}</span>}</TableCell>
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
                              onClick={() => {
                                if (editingItem) {
                                  const stateId = editingItem.states[index]?.id
                                  if (stateId) {
                                    setEditingStateId(stateId)
                                    setCurrentState(state)
                                  }
                                }
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => removeState(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {formData.states.length === 0 && !isAddingState && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estados registrados</h3>
                <p className="text-gray-600 mb-4">Agregue al menos un estado para este item</p>
                <Button onClick={() => setIsAddingState(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Estado
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
