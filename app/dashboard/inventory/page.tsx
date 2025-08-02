"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapse, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Search,
  Plus,
  Package,
  DollarSign,
  Hash,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Building2,
  Layers,
} from "lucide-react"
import { inventoryService, type InventoryItem, type InventoryGroup } from "@/lib/services/inventory-service"

export default function InventoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [groups, setGroups] = useState<InventoryGroup[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [expandedProductTypes, setExpandedProductTypes] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setItems(inventoryService.getItems())
    setGroups(inventoryService.getGroups())
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("¿Está seguro de eliminar este item?")) {
      inventoryService.deleteItem(id)
      loadData()
    }
  }

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const toggleProductTypeExpansion = (key: string) => {
    const newExpanded = new Set(expandedProductTypes)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedProductTypes(newExpanded)
  }

  const getConditionBadge = (condition: string) => {
    const variants = {
      Bueno: "bg-green-100 text-green-800",
      Regular: "bg-yellow-100 text-yellow-800",
      Malo: "bg-red-100 text-red-800",
    }
    return variants[condition as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  // Filter items based on search term
  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    const displayName = inventoryService.getItemDisplayName(item).toLowerCase()
    const variantDescription = inventoryService.getVariantDescription(item).toLowerCase()

    return (
      displayName.includes(searchLower) ||
      variantDescription.includes(searchLower) ||
      item.productType.toLowerCase().includes(searchLower) ||
      (item.variant.brand && item.variant.brand.toLowerCase().includes(searchLower)) ||
      (item.variant.model && item.variant.model.toLowerCase().includes(searchLower))
    )
  })

  // Group items by group, then by product type
  const groupedItems = groups.map((group) => {
    const groupItems = filteredItems.filter((item) => item.groupId === group.id)

    // Group by product type within each group
    const productTypes = groupItems.reduce(
      (acc, item) => {
        if (!acc[item.productType]) {
          acc[item.productType] = []
        }
        acc[item.productType].push(item)
        return acc
      },
      {} as Record<string, InventoryItem[]>,
    )

    return {
      group,
      productTypes,
      totalItems: groupItems.length,
      totalQuantity: groupItems.reduce((sum, item) => sum + inventoryService.getItemTotals(item).totalQuantity, 0),
      totalValue: groupItems.reduce((sum, item) => sum + inventoryService.getItemTotals(item).totalValue, 0),
    }
  })

  // Ungrouped items
  const ungroupedItems = filteredItems.filter((item) => !item.groupId)
  const ungroupedProductTypes = ungroupedItems.reduce(
    (acc, item) => {
      if (!acc[item.productType]) {
        acc[item.productType] = []
      }
      acc[item.productType].push(item)
      return acc
    },
    {} as Record<string, InventoryItem[]>,
  )

  // Calculate totals
  const totalItems = filteredItems.length
  const totalQuantity = filteredItems.reduce((sum, item) => sum + inventoryService.getItemTotals(item).totalQuantity, 0)
  const totalValue = filteredItems.reduce((sum, item) => sum + inventoryService.getItemTotals(item).totalValue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="w-8 h-8" />
            Inventario
          </h1>
          <p className="mt-1">Gestión de bienes y equipos de la institución</p>
        </div>
        <button
          className="btn-normal"
          onClick={() => router.push("/dashboard/inventory/add")}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
          <div>
            <p className="text-sm">Total Items</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
          <Package className={`w-8 h-8 text-blue-600`} />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
          <div>
            <p className="text-sm">Cantidad Total</p>
            <p className="text-2xl font-bold">{totalQuantity}</p>
          </div>
          <Hash className={`w-8 h-8 text-green-600`} />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
          <div>
            <p className="text-sm">Valor Total</p>
            <p className="text-2xl font-bold">S/ {totalValue.toFixed(2)}</p>
          </div>
          <DollarSign className={`w-8 h-8 text-purple-600`} />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
          <div>
            <p className="text-sm">Grupos</p>
            <p className="text-2xl font-bold">{groups.length}</p>
          </div>
          <Building2 className={`w-8 h-8 text-orange-600`} />
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Buscar items por nombre, marca, modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Grouped Items */}
      <div className="space-y-4">
        {groupedItems.map(({ group, productTypes, totalItems, totalQuantity, totalValue }) => (
          <div className="flex p-7 border rounded-lg shadow-sm cursor-pointer flex-col my-1 hover:bg-[var(--input)]">
            <Collapse
              open={expandedGroups.has(group.id)}
              onToggle={() => toggleGroupExpansion(group.id)}
              header={
                <div className="flex justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {expandedGroups.has(group.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <div>
                      <h1 className="text-xl font-semibold">
                        {group.name}
                      </h1>
                      <p className="text-xs text-muted-foreground ">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="text-center">
                      <p className="font-semibold">
                        {Object.keys(productTypes).length}
                      </p>
                      <p className="text-xs">Tipos</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{totalItems}</p>
                      <p className="text-xs">Variantes</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{totalQuantity}</p>
                      <p className="text-xs">Unidades</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">S/ {totalValue.toFixed(2)}</p>
                      <p className="text-xs">Valor</p>
                    </div>
                    <button
                      className="btn-normal"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/inventory/add?group=${group.id}`)
                      }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>
              }>

              <div className="space-y-4 mt-4">
                {Object.entries(productTypes).map(([productType, items]) => {
                  const productTypeKey = `${group.id}-${productType}`
                  return (
                    <div className="cursor-pointer border rounded-lg shadow-sm hover:bg-[var(--input)]transition-colors py-3 space-y-1.5 p-6 border-l-4 border-l-[var(--foreground)]">
                      <Collapse
                        open={expandedProductTypes.has(productTypeKey)}
                        onToggle={() => toggleProductTypeExpansion(productTypeKey)}
                        header={
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {expandedProductTypes.has(productTypeKey) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <Layers className="w-5 h-5 text-green-600" />
                              <div>
                                <h1 className="text-lg">{productType}</h1>
                                <p>{items.length} variantes</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="text-center">
                                <p className="font-semibold">
                                  {items.reduce(
                                    (sum, item) => sum + inventoryService.getItemTotals(item).totalQuantity,
                                    0
                                  )}
                                </p>
                                <p className="text-xs">Unidades</p>
                              </div>
                              <div className="text-center">
                                <p className="font-semibold">
                                  S/{" "}
                                  {items
                                    .reduce(
                                      (sum, item) => sum + inventoryService.getItemTotals(item).totalValue,
                                      0
                                    ).toFixed(2)}
                                </p>
                                <p className="text-xs">Valor</p>
                              </div>
                            </div>
                          </div>
                        }>
                        <div className="space-y-4 mt-4">
                          <div className="pt-0">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Variante</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Estados</TableHead>
                                    <TableHead>Cantidad</TableHead>
                                    <TableHead>Valor Total</TableHead>
                                    <TableHead>Acciones</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {items.map((item) => {
                                    const totals = inventoryService.getItemTotals(item)
                                    const displayName = inventoryService.getItemDisplayName(item)
                                    const variantDescription = inventoryService.getVariantDescription(item)

                                    return (
                                      <TableRow key={item.id}>
                                        <TableCell>
                                          <div>
                                            <p className="font-medium">{displayName}</p>
                                            <p className="text-xs text-gray-500">ID: {item.id}</p>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <p className="text-sm">{variantDescription}</p>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex flex-wrap gap-1">
                                            {item.states.map((state) => (
                                              <Badge
                                                key={state.id}
                                                className={getConditionBadge(state.condition)}
                                                variant="outline"
                                              >
                                                {state.condition} ({state.quantity})
                                              </Badge>
                                            ))}
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{totals.totalQuantity}</TableCell>
                                        <TableCell className="font-medium">
                                          S/ {totals.totalValue.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex gap-1">
                                            <button className="btn-ghost btn-small"
                                              onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
                                            >
                                              <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="btn-ghost btn-small"
                                              onClick={() =>
                                                router.push(`/dashboard/inventory/add?edit=${item.id}`)
                                              }
                                            >
                                              <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="btn-ghost btn-small"
                                              onClick={() => handleDeleteItem(item.id)}
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  )
                })}
              </div>
            </Collapse>
          </div>
        ))
        }
        <p>este es el compoenente eoriginal</p>
        {/* AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA */}
        {
          groupedItems.map(({ group, productTypes, totalItems, totalQuantity, totalValue }) => (
            <Card key={group.id}>
              <Collapsible open={expandedGroups.has(group.id)} onOpenChange={() => toggleGroupExpansion(group.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedGroups.has(group.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <Building2 className="w-6 h-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl">{group.name}</CardTitle>
                          <CardDescription>{group.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="text-center">
                          <p className="font-semibold">{Object.keys(productTypes).length}</p>
                          <p className="text-xs">Tipos</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{totalItems}</p>
                          <p className="text-xs">Variantes</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{totalQuantity}</p>
                          <p className="text-xs">Unidades</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">S/ {totalValue.toFixed(2)}</p>
                          <p className="text-xs">Valor</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/inventory/add?group=${group.id}`)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {Object.entries(productTypes).map(([productType, items]) => {
                        const productTypeKey = `${group.id}-${productType}`
                        return (
                          <Card key={productType} className="border-l-4 border-l-blue-200">
                            <Collapsible
                              open={expandedProductTypes.has(productTypeKey)}
                              onOpenChange={() => toggleProductTypeExpansion(productTypeKey)}
                            >
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {expandedProductTypes.has(productTypeKey) ? (
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                      )}
                                      <Layers className="w-5 h-5 text-green-600" />
                                      <div>
                                        <CardTitle className="text-lg">{productType}</CardTitle>
                                        <CardDescription>{items.length} variantes</CardDescription>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <div className="text-center">
                                        <p className="font-semibold">
                                          {items.reduce(
                                            (sum, item) => sum + inventoryService.getItemTotals(item).totalQuantity,
                                            0,
                                          )}
                                        </p>
                                        <p className="text-xs">Unidades</p>
                                      </div>
                                      <div className="text-center">
                                        <p className="font-semibold">
                                          S/{" "}
                                          {items
                                            .reduce(
                                              (sum, item) => sum + inventoryService.getItemTotals(item).totalValue,
                                              0,
                                            )
                                            .toFixed(2)}
                                        </p>
                                        <p className="text-xs">Valor</p>
                                      </div>
                                    </div>
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="pt-0">
                                  <div className="overflow-x-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Variante</TableHead>
                                          <TableHead>Descripción</TableHead>
                                          <TableHead>Estados</TableHead>
                                          <TableHead>Cantidad</TableHead>
                                          <TableHead>Valor Total</TableHead>
                                          <TableHead>Acciones</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {items.map((item) => {
                                          const totals = inventoryService.getItemTotals(item)
                                          const displayName = inventoryService.getItemDisplayName(item)
                                          const variantDescription = inventoryService.getVariantDescription(item)

                                          return (
                                            <TableRow key={item.id}>
                                              <TableCell>
                                                <div>
                                                  <p className="font-medium">{displayName}</p>
                                                  <p className="text-xs text-gray-500">ID: {item.id}</p>
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                <p className="text-sm">{variantDescription}</p>
                                              </TableCell>
                                              <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                  {item.states.map((state) => (
                                                    <Badge
                                                      key={state.id}
                                                      className={getConditionBadge(state.condition)}
                                                      variant="outline"
                                                    >
                                                      {state.condition} ({state.quantity})
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </TableCell>
                                              <TableCell className="font-medium">{totals.totalQuantity}</TableCell>
                                              <TableCell className="font-medium">
                                                S/ {totals.totalValue.toFixed(2)}
                                              </TableCell>
                                              <TableCell>
                                                <div className="flex gap-1">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
                                                  >
                                                    <Eye className="w-4 h-4" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      router.push(`/dashboard/inventory/add?edit=${item.id}`)
                                                    }
                                                  >
                                                    <Edit className="w-4 h-4" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          )
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </CardContent>
                              </CollapsibleContent>
                            </Collapsible>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        }

        {/* Ungrouped Items */}
        {
          Object.keys(ungroupedProductTypes).length > 0 && (
            <Card>
              <Collapsible
                open={expandedGroups.has("ungrouped")}
                onOpenChange={() => toggleGroupExpansion("ungrouped")}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedGroups.has("ungrouped") ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <Package className="w-6 h-6 text-gray-600" />
                        <div>
                          <CardTitle className="text-xl">Sin Grupo</CardTitle>
                          <CardDescription>Items que no han sido asignados a ningún grupo</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="text-center">
                          <p className="font-semibold">{Object.keys(ungroupedProductTypes).length}</p>
                          <p className="text-xs">Tipos</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{ungroupedItems.length}</p>
                          <p className="text-xs">Variantes</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {Object.entries(ungroupedProductTypes).map(([productType, items]) => {
                        const productTypeKey = `ungrouped-${productType}`
                        return (
                          <Card key={productType} className="border-l-4 border-l-gray-200">
                            <Collapsible
                              open={expandedProductTypes.has(productTypeKey)}
                              onOpenChange={() => toggleProductTypeExpansion(productTypeKey)}
                            >
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {expandedProductTypes.has(productTypeKey) ? (
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                      )}
                                      <Layers className="w-5 h-5 text-gray-600" />
                                      <div>
                                        <CardTitle className="text-lg">{productType}</CardTitle>
                                        <CardDescription>{items.length} variantes</CardDescription>
                                      </div>
                                    </div>
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="pt-0">
                                  <div className="overflow-x-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Variante</TableHead>
                                          <TableHead>Descripción</TableHead>
                                          <TableHead>Estados</TableHead>
                                          <TableHead>Cantidad</TableHead>
                                          <TableHead>Valor Total</TableHead>
                                          <TableHead>Acciones</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {items.map((item) => {
                                          const totals = inventoryService.getItemTotals(item)
                                          const displayName = inventoryService.getItemDisplayName(item)
                                          const variantDescription = inventoryService.getVariantDescription(item)

                                          return (
                                            <TableRow key={item.id}>
                                              <TableCell>
                                                <div>
                                                  <p className="font-medium">{displayName}</p>
                                                  <p className="text-xs text-gray-500">ID: {item.id}</p>
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                <p className="text-sm">{variantDescription}</p>
                                              </TableCell>
                                              <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                  {item.states.map((state) => (
                                                    <Badge
                                                      key={state.id}
                                                      className={getConditionBadge(state.condition)}
                                                      variant="outline"
                                                    >
                                                      {state.condition} ({state.quantity})
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </TableCell>
                                              <TableCell className="font-medium">{totals.totalQuantity}</TableCell>
                                              <TableCell className="font-medium">
                                                S/ {totals.totalValue.toFixed(2)}
                                              </TableCell>
                                              <TableCell>
                                                <div className="flex gap-1">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
                                                  >
                                                    <Eye className="w-4 h-4" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      router.push(`/dashboard/inventory/add?edit=${item.id}`)
                                                    }
                                                  >
                                                    <Edit className="w-4 h-4" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          )
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </CardContent>
                              </CollapsibleContent>
                            </Collapsible>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        }
      </div >

      {/* Empty State */}
      {
        filteredItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No se encontraron items" : "No hay items registrados"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando el primer item al inventario"}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push("/dashboard/inventory/add")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Item
                </Button>
              )}
            </CardContent>
          </Card>
        )
      }
    </div >
  )
}
