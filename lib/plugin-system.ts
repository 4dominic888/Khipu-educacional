export interface Plugin {
  id: string
  name: string
  description: string
  version: string
  author: string
  icon: string
  category: "academic" | "administrative" | "technical" | "reports"
  enabled: boolean
  route: string
  permissions: string[]
  dependencies?: string[]
  config?: Record<string, any>
}

export interface PluginRegistry {
  plugins: Plugin[]
  enabledPlugins: Plugin[]
}

class PluginService {
  private storageKey = "khipu_plugins"

  getPlugins(): Plugin[] {
    try {
      const plugins = localStorage.getItem(this.storageKey)
      return plugins ? JSON.parse(plugins) : this.getDefaultPlugins()
    } catch (error) {
      console.error("Error loading plugins:", error)
      return this.getDefaultPlugins()
    }
  }

  getEnabledPlugins(): Plugin[] {
    return this.getPlugins().filter((plugin) => plugin.enabled)
  }

  enablePlugin(pluginId: string): boolean {
    const plugins = this.getPlugins()
    const plugin = plugins.find((p) => p.id === pluginId)

    if (plugin) {
      plugin.enabled = true
      this.savePlugins(plugins)
      return true
    }

    return false
  }

  disablePlugin(pluginId: string): boolean {
    const plugins = this.getPlugins()
    const plugin = plugins.find((p) => p.id === pluginId)

    if (plugin) {
      plugin.enabled = false
      this.savePlugins(plugins)
      return true
    }

    return false
  }

  installPlugin(plugin: Plugin): boolean {
    const plugins = this.getPlugins()

    // Check if plugin already exists
    if (plugins.find((p) => p.id === plugin.id)) {
      return false
    }

    plugins.push(plugin)
    this.savePlugins(plugins)
    return true
  }

  uninstallPlugin(pluginId: string): boolean {
    const plugins = this.getPlugins()
    const filteredPlugins = plugins.filter((p) => p.id !== pluginId)

    if (filteredPlugins.length !== plugins.length) {
      this.savePlugins(filteredPlugins)
      return true
    }

    return false
  }

  private savePlugins(plugins: Plugin[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(plugins))
    } catch (error) {
      console.error("Error saving plugins:", error)
    }
  }

  private getDefaultPlugins(): Plugin[] {
    return [
      {
        id: "attendance-tracker",
        name: "Control de Asistencia",
        description: "Registro y seguimiento de asistencia de estudiantes y personal",
        version: "1.0.0",
        author: "Khipu Team",
        icon: "UserCheck",
        category: "academic",
        enabled: true,
        route: "/dashboard/plugins/attendance",
        permissions: ["view_attendance", "manage_attendance"],
      },
      {
        id: "grade-book",
        name: "Libro de Calificaciones",
        description: "Gestión de notas y evaluaciones académicas",
        version: "1.2.0",
        author: "Khipu Team",
        icon: "BookOpen",
        category: "academic",
        enabled: true,
        route: "/dashboard/plugins/gradebook",
        permissions: ["view_grades", "manage_grades"],
      },
      {
        id: "parent-portal",
        name: "Portal de Padres",
        description: "Comunicación y seguimiento para padres de familia",
        version: "1.1.0",
        author: "Khipu Team",
        icon: "Users",
        category: "administrative",
        enabled: false,
        route: "/dashboard/plugins/parent-portal",
        permissions: ["view_parent_info", "manage_communications"],
      },
      {
        id: "schedule-manager",
        name: "Gestor de Horarios",
        description: "Creación y gestión de horarios académicos",
        version: "2.0.0",
        author: "Khipu Team",
        icon: "Calendar",
        category: "academic",
        enabled: true,
        route: "/dashboard/plugins/schedule",
        permissions: ["view_schedule", "manage_schedule"],
      },
      {
        id: "library-system",
        name: "Sistema de Biblioteca",
        description: "Gestión de préstamos y catálogo de libros",
        version: "1.5.0",
        author: "Khipu Team",
        icon: "Library",
        category: "administrative",
        enabled: false,
        route: "/dashboard/plugins/library",
        permissions: ["view_library", "manage_books"],
      },
      {
        id: "financial-reports",
        name: "Reportes Financieros",
        description: "Análisis financiero y reportes contables",
        version: "1.3.0",
        author: "Khipu Team",
        icon: "DollarSign",
        category: "reports",
        enabled: true,
        route: "/dashboard/plugins/financial",
        permissions: ["view_financial", "generate_reports"],
      },
    ]
  }
}

export const pluginService = new PluginService()
