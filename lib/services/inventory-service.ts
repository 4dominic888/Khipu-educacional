export interface InventoryItemState {
  id: string
  condition: "Bueno" | "Regular" | "Malo"
  acquisitionType: "Recibo" | "Boleta" | "Donación"
  acquisitionNumber: string
  acquisitionDate: string
  unitValue: number // Value per individual unit
  quantity: number // How many units in this state
  observations?: string
  location?: string // Where these specific units are located
}

export interface InventoryItem {
  id: string

  // Core product information
  productType: string // e.g., "Sillas", "Escritorios", "Computadoras"

  // Variant-specific attributes (what makes this item unique)
  variant: {
    color?: string
    size?: string // e.g., "Grande", "Mediano", "Pequeño"
    material?: string // e.g., "Madera", "Metal", "Plástico"
    brand?: string
    model?: string
    specifications?: string // Technical specs or additional details
  }

  // Physical attributes
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }

  // Identification
  serialNumber?: string

  // Group assignment
  groupId?: string

  // States - different acquisition batches or conditions of this specific variant
  states: InventoryItemState[]

  // Media
  imageUrl?: string

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface InventoryGroup {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Helper interface for creating similar items
export interface ItemTemplate {
  productType: string
  baseVariant: InventoryItem["variant"]
  baseDimensions?: InventoryItem["dimensions"]
  groupId?: string
}

class InventoryService {
  private storageKey = "khipu_inventory"
  private groupsStorageKey = "khipu_inventory_groups"

  private getStorageKey(): string {
    const currentYear = localStorage.getItem("khipu_current_year") || "2024"
    return `${this.storageKey}_${currentYear}`
  }

  private getGroupsStorageKey(): string {
    const currentYear = localStorage.getItem("khipu_current_year") || "2024"
    return `${this.groupsStorageKey}_${currentYear}`
  }

  // Group management methods
  getGroups(): InventoryGroup[] {
    try {
      const groups = localStorage.getItem(this.getGroupsStorageKey())
      return groups ? JSON.parse(groups) : this.getDefaultGroups()
    } catch (error) {
      console.error("Error loading inventory groups:", error)
      return this.getDefaultGroups()
    }
  }

  addGroup(groupData: Omit<InventoryGroup, "id" | "createdAt" | "updatedAt">): InventoryGroup {
    const groups = this.getGroups()
    const newGroup: InventoryGroup = {
      ...groupData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    groups.push(newGroup)
    this.saveGroups(groups)
    return newGroup
  }

  updateGroup(id: string, updates: Partial<InventoryGroup>): InventoryGroup {
    const groups = this.getGroups()
    const index = groups.findIndex((group) => group.id === id)

    if (index === -1) {
      throw new Error("Group not found")
    }

    const updatedGroup = {
      ...groups[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    groups[index] = updatedGroup
    this.saveGroups(groups)
    return updatedGroup
  }

  deleteGroup(id: string): boolean {
    const groups = this.getGroups()
    const filteredGroups = groups.filter((group) => group.id !== id)

    if (filteredGroups.length === groups.length) {
      return false // Group not found
    }

    // Also remove group assignment from items
    const items = this.getItems()
    const updatedItems = items.map((item) => ({
      ...item,
      groupId: item.groupId === id ? undefined : item.groupId,
    }))
    this.saveItems(updatedItems)

    this.saveGroups(filteredGroups)
    return true
  }

  private saveGroups(groups: InventoryGroup[]): void {
    try {
      localStorage.setItem(this.getGroupsStorageKey(), JSON.stringify(groups))
    } catch (error) {
      console.error("Error saving inventory groups:", error)
    }
  }

  private getDefaultGroups(): InventoryGroup[] {
    return [
      {
        id: "group-1",
        name: "Aulas de Primaria",
        description: "Mobiliario y equipos para las aulas de educación primaria",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "group-2",
        name: "Aulas de Secundaria",
        description: "Mobiliario y equipos para las aulas de educación secundaria",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "group-3",
        name: "Oficina Administrativa",
        description: "Equipos y mobiliario para la administración escolar",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "group-4",
        name: "Laboratorio de Ciencias",
        description: "Equipos especializados para el laboratorio de ciencias",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "group-5",
        name: "Biblioteca",
        description: "Mobiliario y recursos de la biblioteca escolar",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "group-6",
        name: "Área Deportiva",
        description: "Equipos y materiales para educación física y deportes",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "group-7",
        name: "Sala de Profesores",
        description: "Mobiliario y equipos para la sala de profesores",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "group-8",
        name: "Aula de Informática",
        description: "Computadoras y equipos tecnológicos para enseñanza",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
    ]
  }

  // Item management methods
  getItems(): InventoryItem[] {
    try {
      const items = localStorage.getItem(this.getStorageKey())
      return items ? JSON.parse(items) : this.getMockData()
    } catch (error) {
      console.error("Error loading inventory items:", error)
      return this.getMockData()
    }
  }

  addItem(itemData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): InventoryItem {
    const items = this.getItems()
    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    items.push(newItem)
    this.saveItems(items)
    return newItem
  }

  updateItem(id: string, updates: Partial<InventoryItem>): InventoryItem {
    const items = this.getItems()
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) {
      throw new Error("Item not found")
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    items[index] = updatedItem
    this.saveItems(items)
    return updatedItem
  }

  deleteItem(id: string): boolean {
    const items = this.getItems()
    const filteredItems = items.filter((item) => item.id !== id)

    if (filteredItems.length === items.length) {
      return false // Item not found
    }

    this.saveItems(filteredItems)
    return true
  }

  private saveItems(items: InventoryItem[]): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(items))
    } catch (error) {
      console.error("Error saving inventory items:", error)
    }
  }

  // Helper method to create similar items (variants)
  createSimilarItem(
    templateId: string,
    variantChanges: Partial<InventoryItem["variant"]>,
    states: InventoryItemState[],
  ): InventoryItem {
    const items = this.getItems()
    const template = items.find((item) => item.id === templateId)

    if (!template) {
      throw new Error("Template item not found")
    }

    const newItem: Omit<InventoryItem, "id" | "createdAt" | "updatedAt"> = {
      productType: template.productType,
      variant: {
        ...template.variant,
        ...variantChanges,
      },
      dimensions: template.dimensions,
      groupId: template.groupId,
      states: states,
    }

    return this.addItem(newItem)
  }

  // Get items by product type (for finding variants)
  getItemsByProductType(productType: string): InventoryItem[] {
    return this.getItems().filter((item) => item.productType.toLowerCase() === productType.toLowerCase())
  }

  // Get unique product types
  getProductTypes(): string[] {
    const items = this.getItems()
    const types = new Set(items.map((item) => item.productType))
    return Array.from(types).sort()
  }

  // Get variants of a specific product type
  getProductVariants(productType: string): InventoryItem[] {
    return this.getItemsByProductType(productType)
  }

  private getMockData(): InventoryItem[] {
    return [
      // Chairs for Primary School
      {
        id: "item-1",
        productType: "Sillas",
        variant: {
          color: "Azul",
          size: "Estándar",
          material: "Plástico",
          brand: "Mobiliario Escolar SAC",
          model: "Estudiante Pro",
          specifications: "Silla plástica con respaldo ergonómico",
        },
        groupId: "group-1", // Aulas de Primaria
        states: [
          {
            id: "state-1-1",
            condition: "Bueno",
            acquisitionType: "Boleta",
            acquisitionNumber: "B001-00456",
            acquisitionDate: "2024-02-20",
            unitValue: 45.0,
            quantity: 40,
            observations: "Para aulas de primaria",
            location: "Aulas 101-108",
          },
          {
            id: "state-1-2",
            condition: "Regular",
            acquisitionType: "Boleta",
            acquisitionNumber: "B001-00456",
            acquisitionDate: "2024-02-20",
            unitValue: 45.0,
            quantity: 8,
            observations: "Requieren limpieza profunda",
            location: "Almacén",
          },
        ],
        createdAt: "2024-02-20T09:00:00Z",
        updatedAt: "2024-02-20T09:00:00Z",
      },
      // Chairs for Secondary School
      {
        id: "item-2",
        productType: "Sillas",
        variant: {
          color: "Rojo",
          size: "Grande",
          material: "Plástico",
          brand: "Mobiliario Escolar SAC",
          model: "Estudiante Pro",
          specifications: "Silla plástica con respaldo ergonómico para secundaria",
        },
        groupId: "group-2", // Aulas de Secundaria
        states: [
          {
            id: "state-2-1",
            condition: "Bueno",
            acquisitionType: "Donación",
            acquisitionNumber: "DON-2024-005",
            acquisitionDate: "2024-03-01",
            unitValue: 0.0,
            quantity: 30,
            observations: "Donadas por empresa local",
            location: "Aulas 201-206",
          },
        ],
        createdAt: "2024-03-01T09:00:00Z",
        updatedAt: "2024-03-01T09:00:00Z",
      },
      // Small chairs for kindergarten
      {
        id: "item-3",
        productType: "Sillas",
        variant: {
          color: "Verde",
          size: "Pequeño",
          material: "Plástico",
          brand: "Mobiliario Escolar SAC",
          model: "Infantil",
          specifications: "Silla pequeña para educación inicial",
        },
        groupId: "group-1", // Aulas de Primaria
        states: [
          {
            id: "state-3-1",
            condition: "Bueno",
            acquisitionType: "Recibo",
            acquisitionNumber: "R-2024-012",
            acquisitionDate: "2024-03-10",
            unitValue: 35.0,
            quantity: 20,
            observations: "Para aula de inicial",
            location: "Aula Inicial",
          },
        ],
        createdAt: "2024-03-10T09:00:00Z",
        updatedAt: "2024-03-10T09:00:00Z",
      },

      // Tables for Primary School
      {
        id: "item-4",
        productType: "Mesas",
        variant: {
          color: "Marrón claro",
          size: "Bipersonal",
          material: "Madera",
          brand: "Mobiliario Escolar",
          model: "Mesa Bipersonal",
          specifications: "Mesa de madera para dos estudiantes",
        },
        dimensions: {
          length: 1.2,
          width: 0.6,
          height: 0.75,
        },
        groupId: "group-1", // Aulas de Primaria
        states: [
          {
            id: "state-4-1",
            condition: "Bueno",
            acquisitionType: "Boleta",
            acquisitionNumber: "B001-00234",
            acquisitionDate: "2024-02-01",
            unitValue: 180.0,
            quantity: 15,
            observations: "Mesas nuevas para primaria",
            location: "Aulas 101-105",
          },
          {
            id: "state-4-2",
            condition: "Regular",
            acquisitionType: "Boleta",
            acquisitionNumber: "B001-00234",
            acquisitionDate: "2024-02-01",
            unitValue: 180.0,
            quantity: 3,
            observations: "Requieren lijado y barnizado",
            location: "Aula 106",
          },
        ],
        createdAt: "2024-02-01T09:00:00Z",
        updatedAt: "2024-02-15T11:00:00Z",
      },
      // Tables for Secondary School
      {
        id: "item-5",
        productType: "Mesas",
        variant: {
          color: "Marrón oscuro",
          size: "Individual",
          material: "Madera",
          brand: "Mobiliario Escolar",
          model: "Mesa Individual",
          specifications: "Mesa individual para estudiantes de secundaria",
        },
        dimensions: {
          length: 0.8,
          width: 0.6,
          height: 0.75,
        },
        groupId: "group-2", // Aulas de Secundaria
        states: [
          {
            id: "state-5-1",
            condition: "Bueno",
            acquisitionType: "Recibo",
            acquisitionNumber: "R-2024-018",
            acquisitionDate: "2024-02-15",
            unitValue: 150.0,
            quantity: 25,
            observations: "Para aulas de secundaria",
            location: "Aulas 201-205",
          },
        ],
        createdAt: "2024-02-15T09:00:00Z",
        updatedAt: "2024-02-15T09:00:00Z",
      },
      // Office desk
      {
        id: "item-6",
        productType: "Escritorios",
        variant: {
          color: "Blanco",
          size: "Ejecutivo",
          material: "Melamina",
          brand: "Oficina Plus",
          model: "Ejecutiva",
          specifications: "Escritorio ejecutivo para administración",
        },
        dimensions: {
          length: 1.4,
          width: 0.8,
          height: 0.75,
        },
        groupId: "group-3", // Oficina Administrativa
        states: [
          {
            id: "state-6-1",
            condition: "Bueno",
            acquisitionType: "Recibo",
            acquisitionNumber: "R-2024-008",
            acquisitionDate: "2024-01-20",
            unitValue: 450.0,
            quantity: 3,
            observations: "Para dirección y secretaría",
            location: "Oficinas administrativas",
          },
        ],
        createdAt: "2024-01-20T09:00:00Z",
        updatedAt: "2024-01-20T09:00:00Z",
      },

      // Computers for Computer Lab
      {
        id: "item-7",
        productType: "Computadoras",
        variant: {
          brand: "HP",
          model: "ProDesk 400 G7",
          specifications: "Intel Core i5, 8GB RAM, 500GB HDD",
        },
        groupId: "group-8", // Aula de Informática
        states: [
          {
            id: "state-7-1",
            condition: "Bueno",
            acquisitionType: "Recibo",
            acquisitionNumber: "R-2023-089",
            acquisitionDate: "2023-11-15",
            unitValue: 1800.0,
            quantity: 15,
            observations: "Para aula de informática",
            location: "Aula de Informática",
          },
          {
            id: "state-7-2",
            condition: "Malo",
            acquisitionType: "Recibo",
            acquisitionNumber: "R-2023-089",
            acquisitionDate: "2023-11-15",
            unitValue: 1800.0,
            quantity: 2,
            observations: "Disco duro dañado, requiere reemplazo",
            location: "Taller de reparación",
          },
        ],
        createdAt: "2023-11-15T16:20:00Z",
        updatedAt: "2024-03-10T10:30:00Z",
      },

      // Projector for classrooms
      {
        id: "item-8",
        productType: "Proyectores",
        variant: {
          brand: "Epson",
          model: "PowerLite X41+",
          specifications: "3300 lúmenes, resolución XGA",
        },
        groupId: "group-2", // Aulas de Secundaria
        states: [
          {
            id: "state-8-1",
            condition: "Regular",
            acquisitionType: "Donación",
            acquisitionNumber: "DON-2024-003",
            acquisitionDate: "2024-03-05",
            unitValue: 1200.0,
            quantity: 1,
            observations: "Requiere mantenimiento del filtro",
            location: "Aula 201",
          },
        ],
        createdAt: "2024-03-05T09:15:00Z",
        updatedAt: "2024-03-05T09:15:00Z",
      },

      // Microscopes for Science Lab
      {
        id: "item-9",
        productType: "Microscopios",
        variant: {
          brand: "Olympus",
          model: "CX23",
          specifications: "Microscopio binocular con objetivos 4x, 10x, 40x",
        },
        groupId: "group-4", // Laboratorio de Ciencias
        states: [
          {
            id: "state-9-1",
            condition: "Bueno",
            acquisitionType: "Recibo",
            acquisitionNumber: "R-2024-015",
            acquisitionDate: "2024-03-01",
            unitValue: 850.0,
            quantity: 5,
            observations: "Para prácticas de biología",
            location: "Laboratorio",
          },
          {
            id: "state-9-2",
            condition: "Regular",
            acquisitionType: "Recibo",
            acquisitionNumber: "R-2024-015",
            acquisitionDate: "2024-03-01",
            unitValue: 850.0,
            quantity: 2,
            observations: "Requieren calibración",
            location: "Laboratorio",
          },
        ],
        createdAt: "2024-03-01T14:00:00Z",
        updatedAt: "2024-03-01T14:00:00Z",
      },

      // Bookshelves for Library
      {
        id: "item-10",
        productType: "Estanterías",
        variant: {
          color: "Marrón",
          size: "Grande",
          material: "Madera",
          brand: "Biblioteca Pro",
          model: "Estantería 5 Niveles",
          specifications: "Estantería de madera con 5 niveles para libros",
        },
        dimensions: {
          length: 1.0,
          width: 0.3,
          height: 2.0,
        },
        groupId: "group-5", // Biblioteca
        states: [
          {
            id: "state-10-1",
            condition: "Bueno",
            acquisitionType: "Boleta",
            acquisitionNumber: "B001-00789",
            acquisitionDate: "2024-01-10",
            unitValue: 320.0,
            quantity: 8,
            observations: "Para organización de libros",
            location: "Biblioteca",
          },
        ],
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-10T09:00:00Z",
      },
    ]
  }

  // Export functionality (mock)
  exportToExcel(): void {
    const items = this.getItems()
    console.log("Exporting to Excel:", items)
    // In a real implementation, this would generate an Excel file
  }

  // Import functionality (mock)
  importFromExcel(file: File): Promise<InventoryItem[]> {
    return new Promise((resolve) => {
      // Mock import process
      setTimeout(() => {
        console.log("Importing from Excel:", file.name)
        resolve([])
      }, 1000)
    })
  }

  // Add methods for managing item states
  addStateToItem(itemId: string, state: Omit<InventoryItemState, "id">): InventoryItemState {
    const items = this.getItems()
    const itemIndex = items.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      throw new Error("Item not found")
    }

    const newState: InventoryItemState = {
      ...state,
      id: Date.now().toString(),
    }

    items[itemIndex].states.push(newState)
    items[itemIndex].updatedAt = new Date().toISOString()

    this.saveItems(items)
    return newState
  }

  updateItemState(itemId: string, stateId: string, updates: Partial<InventoryItemState>): InventoryItemState {
    const items = this.getItems()
    const itemIndex = items.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      throw new Error("Item not found")
    }

    const stateIndex = items[itemIndex].states.findIndex((state) => state.id === stateId)

    if (stateIndex === -1) {
      throw new Error("State not found")
    }

    const updatedState = {
      ...items[itemIndex].states[stateIndex],
      ...updates,
    }

    items[itemIndex].states[stateIndex] = updatedState
    items[itemIndex].updatedAt = new Date().toISOString()

    this.saveItems(items)
    return updatedState
  }

  deleteItemState(itemId: string, stateId: string): boolean {
    const items = this.getItems()
    const itemIndex = items.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      return false
    }

    const originalLength = items[itemIndex].states.length
    items[itemIndex].states = items[itemIndex].states.filter((state) => state.id !== stateId)

    if (items[itemIndex].states.length !== originalLength) {
      items[itemIndex].updatedAt = new Date().toISOString()
      this.saveItems(items)
      return true
    }

    return false
  }

  // Helper method to get total quantity and value for items
  getItemTotals(item: InventoryItem): { totalQuantity: number; totalValue: number } {
    return item.states.reduce(
      (totals, state) => ({
        totalQuantity: totals.totalQuantity + state.quantity,
        totalValue: totals.totalValue + state.unitValue * state.quantity,
      }),
      { totalQuantity: 0, totalValue: 0 },
    )
  }

  // Get items by group
  getItemsByGroup(groupId: string): InventoryItem[] {
    return this.getItems().filter((item) => item.groupId === groupId)
  }

  // Get ungrouped items
  getUngroupedItems(): InventoryItem[] {
    return this.getItems().filter((item) => !item.groupId)
  }

  // Helper method to get display name for an item
  getItemDisplayName(item: InventoryItem): string {
    let name = item.productType

    const variantParts = []
    if (item.variant.color) variantParts.push(item.variant.color)
    if (item.variant.size) variantParts.push(item.variant.size)
    if (item.variant.material) variantParts.push(item.variant.material)

    if (variantParts.length > 0) {
      name += ` (${variantParts.join(", ")})`
    }

    return name
  }

  // Helper method to get variant description
  getVariantDescription(item: InventoryItem): string {
    const parts = []
    if (item.variant.brand) parts.push(item.variant.brand)
    if (item.variant.model) parts.push(item.variant.model)
    if (item.variant.specifications) parts.push(item.variant.specifications)

    return parts.join(" - ")
  }
}

export const inventoryService = new InventoryService()
