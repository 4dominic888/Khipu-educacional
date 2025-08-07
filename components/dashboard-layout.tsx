"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Package,
  FileText,
  ClipboardList,
  Shield,
  HelpCircle,
  Settings,
  Calendar,
  LogOut,
  Plus,
  Puzzle,
  UserCheck,
  BookOpen,
  Users,
  Library,
  DollarSign,
  Folder,
  ChevronDown,
} from "lucide-react"
import { pluginService, type Plugin } from "@/lib/plugin-system"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const iconMap = {
  UserCheck,
  BookOpen,
  Users,
  Calendar,
  Library,
  DollarSign,
  Puzzle,
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [institution, setInstitution] = useState<any>(null)
  const [currentYear, setCurrentYear] = useState<string>("")
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [enabledPlugins, setEnabledPlugins] = useState<Plugin[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const institutionData = localStorage.getItem("khipu_institution")
    const year = localStorage.getItem("khipu_current_year")
    const years = JSON.parse(localStorage.getItem("khipu_years") || '["2024"]')

    if (!institutionData) {
      router.push("/")
      return
    }

    setInstitution(JSON.parse(institutionData))
    setCurrentYear(year || "2024")
    setAvailableYears(years)
    setEnabledPlugins(pluginService.getEnabledPlugins())
  }, [router])

  const createNewYear = () => {
    const newYear = prompt("Ingrese el año a crear (YYYY):")
    if (newYear && /^\d{4}$/.test(newYear) && !availableYears.includes(newYear)) {
      const updatedYears = [...availableYears, newYear].sort()
      setAvailableYears(updatedYears)
      localStorage.setItem("khipu_years", JSON.stringify(updatedYears))
      localStorage.setItem("khipu_current_year", newYear)
      setCurrentYear(newYear)
    }
  }

  const switchYear = (year: string) => {
    localStorage.setItem("khipu_current_year", year)
    setCurrentYear(year)
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const navigationItems = [
    {
      title: "Panel Principal",
      icon: Home,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: "Inventario de Bienes",
      icon: Package,
      href: "/dashboard/inventory",
      isActive: pathname.startsWith("/dashboard/inventory"),
    },
    {
      title: "Censo Institucional",
      icon: ClipboardList,
      href: "/dashboard/census",
      isActive: pathname.startsWith("/dashboard/census"),
    },
    {
      title: "Explorador de Archivos",
      icon: Folder,
      href: "/dashboard/files",
      isActive: pathname.startsWith("/dashboard/files"),
    },
    {
      title: "Documentos de Gestión",
      icon: FileText,
      href: "/dashboard/documents",
      isActive: pathname.startsWith("/dashboard/documents"),
    },
    {
      title: "Auditoría",
      icon: Shield,
      href: "/dashboard/audit",
      isActive: pathname.startsWith("/dashboard/audit"),
    },
    {
      title: "Soporte",
      icon: HelpCircle,
      href: "/dashboard/support",
      isActive: pathname.startsWith("/dashboard/support"),
    },
  ]

  if (!institution) {
    return <div>Cargando...</div>
  }

  return (
        <div className="sidebar-container">
            <div className={cn("flex flex-col", isSidebarCollapsed && "hidden md:block md:w-0")}>

                {/* Profile */}
                <div className="sidebar-profile-container">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-full flex items-center gap-3 p-2">
                                <img className="sidebar-profile-image bg-indigo-600" src="/placeholder-logo-two.svg" alt="Logo" width={35} height={35} />
                                <div className="flex-1 text-left">
                                    <h2 className="font-semibold text-sm">Khipu</h2>
                                    <p className="text-xs text-muted-foreground truncate">{institution.name}</p>
                                </div>
                                <ChevronDown />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" className="w-56">
                            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" />
                                Configuración
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar Sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="bg-[#DEDEE2] w-full h-0.5"></div>

                {/* Navigation Items */}
                <div className="">
                    <p className="sidebar-subtitle">Navegacion</p>
                    {navigationItems.map((item) => (
                        <a href={item.href} className="sidebar-button">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                        </a>
                    ))}

                    {/* Plugins Section */}
                    <p className="sidebar-subtitle">Plugins</p>
                    {enabledPlugins.length > 0 && (
                        <div>
                            <ul className="">
                                {enabledPlugins.map((plugin) => {
                                    const IconComponent = iconMap[plugin.icon as keyof typeof iconMap] || Puzzle
                                    return (
                                        <li key={plugin.id}>
                                            <a
                                                href={plugin.route}
                                                className={`sidebar-button ${pathname.startsWith(plugin.route)
                                                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                                    : ""
                                                    }`}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                <span>{plugin.name}</span>
                                            </a>
                                        </li>
                                    )
                                })}
                                <li>
                                    <a
                                        href="/dashboard/plugins"
                                        className="sidebar-button"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Gestionar Plugins</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Academic Year */}
                    <p className="sidebar-subtitle">Año Académico</p>
                    <div className="px-2 space-y-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                                    <Calendar className="w-4 h-4" />
                                    {currentYear}
                                    <Badge variant="secondary" className="ml-2">
                                        Actual
                                    </Badge>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuLabel>Cambiar Año</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {availableYears.map((year) => (
                                    <DropdownMenuItem
                                        key={year}
                                        onClick={() => switchYear(year)}
                                        className={year === currentYear ? "bg-accent" : ""}
                                    >
                                        {year}
                                        {year === currentYear && (
                                            <Badge variant="secondary" className="ml-auto">
                                                Actual
                                            </Badge>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={createNewYear}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Nuevo Año
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                <header>
                    <button
                        data-sidebar="trigger"
                        className="h-7 w-7"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <PanelLeft />
                        <span className="sr-only">Toggle Sidebar</span>
                    </button>
                    <div className="flex-1" />
                    <Badge variant="outline">
                        {institution.accessMode === "credentialed" ? "Acceso con Credenciales" : "Acceso Libre"}
                    </Badge>
                    <ThemeToggle />
                </header>
                <main className="flex-1 p-6 bg-background">{children}</main>
            </div>

      {/* <SidebarProvider>
      <div className="min-h-screen flex w-full">
          <Sidebar className="z-40">
            <SidebarHeader className="border-b border-sidebar-border opacity-100">
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                    <path
                      fill="currentColor"
                      d="M12 2c-1.2 0-2.4 0.6-3.6 1.2l-4.8 2.4c-0.6 0-1.2 0.6-1.2 1.2v9.6c0 0.6 0.6 1.2 1.2 1.2l4.8 2.4c1.2 0.6 2.4 1.2 3.6 1.2s2.4-0.6 3.6-1.2l4.8-2.4c0.6 0 1.2-0.6 1.2-1.2V7.2c0-0.6-0.6-1.2-1.2-1.2l-4.8-2.4C14.4 2.6 13.2 2 12 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm truncate">Khipu</h2>
                  <p className="text-xs text-sidebar-foreground/70 truncate">{institution.name}</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.href}>
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

      {enabledPlugins.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4" />
                    Plugins
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {enabledPlugins.map((plugin) => {
                        const IconComponent = iconMap[plugin.icon as keyof typeof iconMap] || Puzzle
                        return (
                          <SidebarMenuItem key={plugin.id}>
                            <SidebarMenuButton asChild isActive={pathname.startsWith(plugin.route)}>
                              <a href={plugin.route}>
                                <IconComponent className="w-4 h-4" />
                                <span>{plugin.name}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <a href="/dashboard/plugins">
                            <Settings className="w-4 h-4" />
                            <span>Gestionar Plugins</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              <SidebarGroup>
                <SidebarGroupLabel>Año Académico</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-2 space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                          <Calendar className="w-4 h-4" />
                          {currentYear}
                          <Badge variant="secondary" className="ml-2">
                            Actual
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Cambiar Año</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableYears.map((year) => (
                          <DropdownMenuItem
                            key={year}
                            onClick={() => switchYear(year)}
                            className={year === currentYear ? "bg-accent" : ""}
                          >
                            {year}
                            {year === currentYear && (
                              <Badge variant="secondary" className="ml-auto">
                                Actual
                              </Badge>
                            )}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={createNewYear}>
                          <Plus className="w-4 h-4 mr-2" />
                          Crear Nuevo Año
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton>
                        <User className="w-4 h-4" />
                        <span className="truncate">{institution.director}</span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="w-56">
                      <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Configuración
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

      <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 z-30">
              <SidebarTrigger className ="-ml-1" />
              <div className="flex-1" />
              <Badge variant="outline">
                {institution.accessMode === "credentialed" ? "Acceso con Credenciales" : "Acceso Libre"}
              </Badge>
            </header>
            <main className="flex-1 p-6 bg-backgr·ound">{children}</main>
          </SidebarInset>·
        </div>
      </SidebarProvider> */}

    </div>
  )
}
