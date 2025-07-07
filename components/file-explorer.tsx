"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Folder,
  File,
  Upload,
  FolderPlus,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Share,
  ImageIcon,
  FileText,
  Archive,
  Video,
  Music,
  ArrowLeft,
  Grid,
  List,
  Search,
  SortAsc,
  Copy,
  Move,
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: number
  mimeType?: string
  uploadDate: string
  isPublic: boolean
  parentId?: string
  thumbnailUrl?: string
  productId?: string // For product images
}

interface FileExplorerProps {
  className?: string
}

export function FileExplorer({ className }: FileExplorerProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  // Mock data - in real implementation this would come from API
  const [files] = useState<FileItem[]>([
    // Root folders
    {
      id: "1",
      name: "Documentos Públicos",
      type: "folder",
      uploadDate: "2024-03-01",
      isPublic: true,
    },
    {
      id: "2",
      name: "Imágenes de Productos",
      type: "folder",
      uploadDate: "2024-03-01",
      isPublic: true,
    },
    {
      id: "3",
      name: "Archivos Privados",
      type: "folder",
      uploadDate: "2024-03-01",
      isPublic: false,
    },
    {
      id: "4",
      name: "Documentos Administrativos",
      type: "folder",
      uploadDate: "2024-02-15",
      isPublic: false,
    },
    {
      id: "5",
      name: "Recursos Educativos",
      type: "folder",
      uploadDate: "2024-02-20",
      isPublic: true,
    },
    {
      id: "6",
      name: "Multimedia",
      type: "folder",
      uploadDate: "2024-03-05",
      isPublic: true,
    },

    // Files in "Documentos Públicos" (id: 1)
    {
      id: "101",
      name: "Manual de Usuario.pdf",
      type: "file",
      size: 2048576,
      mimeType: "application/pdf",
      uploadDate: "2024-03-15",
      isPublic: true,
      parentId: "1",
    },
    {
      id: "102",
      name: "Reglamento Interno.docx",
      type: "file",
      size: 1024000,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadDate: "2024-03-10",
      isPublic: true,
      parentId: "1",
    },
    {
      id: "103",
      name: "Calendario Académico 2024.pdf",
      type: "file",
      size: 856432,
      mimeType: "application/pdf",
      uploadDate: "2024-02-28",
      isPublic: true,
      parentId: "1",
    },
    {
      id: "104",
      name: "Directorio Telefónico.xlsx",
      type: "file",
      size: 245760,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadDate: "2024-03-12",
      isPublic: true,
      parentId: "1",
    },

    // Files in "Imágenes de Productos" (id: 2)
    {
      id: "201",
      name: "escritorio-madera-001.jpg",
      type: "file",
      size: 512000,
      mimeType: "image/jpeg",
      uploadDate: "2024-03-12",
      isPublic: true,
      parentId: "2",
      productId: "inv-001",
      thumbnailUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "202",
      name: "silla-ergonomica-002.jpg",
      type: "file",
      size: 768000,
      mimeType: "image/jpeg",
      uploadDate: "2024-03-14",
      isPublic: true,
      parentId: "2",
      productId: "inv-002",
      thumbnailUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "203",
      name: "proyector-epson-003.png",
      type: "file",
      size: 1024000,
      mimeType: "image/png",
      uploadDate: "2024-03-16",
      isPublic: true,
      parentId: "2",
      productId: "inv-003",
      thumbnailUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "204",
      name: "pizarra-acrilica-004.jpg",
      type: "file",
      size: 645120,
      mimeType: "image/jpeg",
      uploadDate: "2024-03-18",
      isPublic: true,
      parentId: "2",
      productId: "inv-004",
      thumbnailUrl: "/placeholder.svg?height=100&width=100",
    },

    // Files in "Archivos Privados" (id: 3)
    {
      id: "301",
      name: "Presupuesto 2024.xlsx",
      type: "file",
      size: 2560000,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadDate: "2024-03-08",
      isPublic: false,
      parentId: "3",
    },
    {
      id: "302",
      name: "Nómina Personal.xlsx",
      type: "file",
      size: 1843200,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadDate: "2024-03-05",
      isPublic: false,
      parentId: "3",
    },
    {
      id: "303",
      name: "Contratos Docentes.zip",
      type: "file",
      size: 5242880,
      mimeType: "application/zip",
      uploadDate: "2024-02-25",
      isPublic: false,
      parentId: "3",
    },

    // Files in "Documentos Administrativos" (id: 4)
    {
      id: "401",
      name: "Acta Consejo Directivo - Marzo.docx",
      type: "file",
      size: 456789,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadDate: "2024-03-20",
      isPublic: false,
      parentId: "4",
    },
    {
      id: "402",
      name: "Informe Mensual Febrero.pdf",
      type: "file",
      size: 1234567,
      mimeType: "application/pdf",
      uploadDate: "2024-03-01",
      isPublic: false,
      parentId: "4",
    },
    {
      id: "403",
      name: "Resoluciones Directorales.pdf",
      type: "file",
      size: 2876543,
      mimeType: "application/pdf",
      uploadDate: "2024-03-18",
      isPublic: false,
      parentId: "4",
    },

    // Files in "Recursos Educativos" (id: 5)
    {
      id: "501",
      name: "Plan Curricular 2024.docx",
      type: "file",
      size: 987654,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadDate: "2024-02-22",
      isPublic: true,
      parentId: "5",
    },
    {
      id: "502",
      name: "Programación Anual Matemática.pdf",
      type: "file",
      size: 1567890,
      mimeType: "application/pdf",
      uploadDate: "2024-02-28",
      isPublic: true,
      parentId: "5",
    },
    {
      id: "503",
      name: "Sesiones de Aprendizaje.zip",
      type: "file",
      size: 8765432,
      mimeType: "application/zip",
      uploadDate: "2024-03-10",
      isPublic: true,
      parentId: "5",
    },
    {
      id: "504",
      name: "Evaluaciones Primer Bimestre.xlsx",
      type: "file",
      size: 654321,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadDate: "2024-03-15",
      isPublic: true,
      parentId: "5",
    },

    // Files in "Multimedia" (id: 6)
    {
      id: "601",
      name: "Video Institucional 2024.mp4",
      type: "file",
      size: 52428800,
      mimeType: "video/mp4",
      uploadDate: "2024-03-08",
      isPublic: true,
      parentId: "6",
    },
    {
      id: "602",
      name: "Himno Nacional.mp3",
      type: "file",
      size: 3145728,
      mimeType: "audio/mpeg",
      uploadDate: "2024-02-15",
      isPublic: true,
      parentId: "6",
    },
    {
      id: "603",
      name: "Presentación Día del Maestro.pptx",
      type: "file",
      size: 15728640,
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      uploadDate: "2024-03-12",
      isPublic: true,
      parentId: "6",
    },
    {
      id: "604",
      name: "Fotos Ceremonia Graduación.zip",
      type: "file",
      size: 125829120,
      mimeType: "application/zip",
      uploadDate: "2024-03-20",
      isPublic: true,
      parentId: "6",
    },

    // Subfolder in "Recursos Educativos"
    {
      id: "505",
      name: "Materiales por Grado",
      type: "folder",
      uploadDate: "2024-02-25",
      isPublic: true,
      parentId: "5",
    },

    // Files in "Materiales por Grado" subfolder (id: 505)
    {
      id: "5051",
      name: "Primer Grado - Comunicación.pdf",
      type: "file",
      size: 2345678,
      mimeType: "application/pdf",
      uploadDate: "2024-03-01",
      isPublic: true,
      parentId: "505",
    },
    {
      id: "5052",
      name: "Segundo Grado - Matemática.docx",
      type: "file",
      size: 1876543,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadDate: "2024-03-03",
      isPublic: true,
      parentId: "505",
    },
    // Additional test folders in root
    {
      id: "7",
      name: "Proyectos 2024",
      type: "folder",
      uploadDate: "2024-01-15",
      isPublic: true,
    },
    {
      id: "8",
      name: "Backup Sistema",
      type: "folder",
      uploadDate: "2024-03-22",
      isPublic: false,
    },

    // Files in "Proyectos 2024" (id: 7)
    {
      id: "701",
      name: "Proyecto Ciencias.docx",
      type: "file",
      size: 3456789,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadDate: "2024-03-20",
      isPublic: true,
      parentId: "7",
    },
    {
      id: "702",
      name: "Presupuesto Proyecto.xlsx",
      type: "file",
      size: 567890,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadDate: "2024-03-18",
      isPublic: true,
      parentId: "7",
    },
    {
      id: "703",
      name: "Cronograma Actividades.pdf",
      type: "file",
      size: 1234567,
      mimeType: "application/pdf",
      uploadDate: "2024-03-15",
      isPublic: true,
      parentId: "7",
    },

    // Files in "Backup Sistema" (id: 8)
    {
      id: "801",
      name: "backup-database-2024-03.sql",
      type: "file",
      size: 15728640,
      mimeType: "application/sql",
      uploadDate: "2024-03-22",
      isPublic: false,
      parentId: "8",
    },
    {
      id: "802",
      name: "configuracion-sistema.json",
      type: "file",
      size: 45678,
      mimeType: "application/json",
      uploadDate: "2024-03-20",
      isPublic: false,
      parentId: "8",
    },

    // Subfolder in "Proyectos 2024"
    {
      id: "704",
      name: "Documentos Finales",
      type: "folder",
      uploadDate: "2024-03-25",
      isPublic: true,
      parentId: "7",
    },

    // Files in "Documentos Finales" subfolder (id: 704)
    {
      id: "7041",
      name: "Informe Final Proyecto.pdf",
      type: "file",
      size: 5678901,
      mimeType: "application/pdf",
      uploadDate: "2024-03-25",
      isPublic: true,
      parentId: "704",
    },
    {
      id: "7042",
      name: "Presentacion Final.pptx",
      type: "file",
      size: 8901234,
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      uploadDate: "2024-03-26",
      isPublic: true,
      parentId: "704",
    },
  ])

  const currentFiles = files.filter((file) => file.parentId === currentFolderId)
  const filteredFiles = currentFiles.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const breadcrumbs = getBreadcrumbs(currentFolderId, files)

  function getBreadcrumbs(folderId: string | null, allFiles: FileItem[]): FileItem[] {
    if (!folderId) return []

    const folder = allFiles.find((f) => f.id === folderId)
    if (!folder) return []

    const parentBreadcrumbs = getBreadcrumbs(folder.parentId || null, allFiles)
    return [...parentBreadcrumbs, folder]
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") {
      if (file.name === "Imágenes de Productos") {
        return <ImageIcon className="w-8 h-8 text-green-600" />
      }
      return <Folder className="w-8 h-8 text-blue-600" />
    }

    if (file.mimeType?.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8 text-green-600" />
    }
    if (file.mimeType?.includes("pdf")) {
      return <FileText className="w-8 h-8 text-red-600" />
    }
    if (file.mimeType?.includes("word") || file.mimeType?.includes("document")) {
      return <FileText className="w-8 h-8 text-blue-600" />
    }
    if (file.mimeType?.includes("sheet") || file.mimeType?.includes("excel")) {
      return <FileText className="w-8 h-8 text-green-600" />
    }
    if (file.mimeType?.startsWith("video/")) {
      return <Video className="w-8 h-8 text-purple-600" />
    }
    if (file.mimeType?.startsWith("audio/")) {
      return <Music className="w-8 h-8 text-orange-600" />
    }
    if (file.mimeType?.includes("zip") || file.mimeType?.includes("rar")) {
      return <Archive className="w-8 h-8 text-yellow-600" />
    }

    return <File className="w-8 h-8 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === "folder") {
      setCurrentFolderId(file.id)
    } else {
      // Only handle folder navigation, no file preview
      console.log("File selected:", file.name)
    }
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      console.log("Creating folder:", newFolderName, "in", currentFolderId)
      setNewFolderName("")
      setIsCreateFolderOpen(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      console.log(
        "Uploading files:",
        Array.from(files).map((f) => f.name),
      )
      setIsUploadOpen(false)
    }
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-6 h-6" />
              Explorador de Archivos
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Nueva Carpeta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Carpeta</DialogTitle>
                    <DialogDescription>Ingrese el nombre para la nueva carpeta</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="folderName">Nombre de la Carpeta</Label>
                      <Input
                        id="folderName"
                        placeholder="Mi Nueva Carpeta"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateFolder}>Crear Carpeta</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Archivos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Subir Archivos</DialogTitle>
                    <DialogDescription>Seleccione los archivos que desea subir</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Arrastra archivos aquí o haz clic para seleccionar</p>
                      <Input type="file" multiple onChange={handleFileUpload} className="hidden" id="fileUpload" />
                      <Label htmlFor="fileUpload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>Seleccionar Archivos</span>
                        </Button>
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Configuración</Label>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="makePublic" className="rounded" />
                        <Label htmlFor="makePublic" className="text-sm">
                          Hacer archivos públicos
                        </Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancelar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Button variant="ghost" size="sm" onClick={() => setCurrentFolderId(null)} className="p-1 h-auto">
              <Folder className="w-4 h-4 mr-1" />
              Raíz
            </Button>
            {breadcrumbs.map((folder, index) => (
              <div key={folder.id} className="flex items-center gap-2">
                <span>/</span>
                <Button variant="ghost" size="sm" onClick={() => setCurrentFolderId(folder.id)} className="p-1 h-auto">
                  {folder.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar archivos y carpetas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {currentFolderId && (
              <Button variant="outline" size="sm" onClick={() => setCurrentFolderId(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            )}
            <Button variant="outline" size="sm">
              <SortAsc className="w-4 h-4 mr-2" />
              Ordenar
            </Button>
          </div>

          {/* Selected Items Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-800">{selectedItems.length} elemento(s) seleccionado(s)</span>
              <div className="flex gap-1 ml-auto">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Descargar
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm">
                  <Move className="w-4 h-4 mr-1" />
                  Mover
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}

          {/* File Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group relative p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                    selectedItems.includes(file.id) ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Compartir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Renombrar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Move className="w-4 h-4 mr-2" />
                          Mover
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(file.id)}
                      onChange={() => toggleItemSelection(file.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2">
                    {file.thumbnailUrl && file.mimeType?.startsWith("image/") ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={file.thumbnailUrl || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      getFileIcon(file)
                    )}
                    <div className="w-full">
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      {file.type === "file" && file.size && (
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      )}
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {file.isPublic ? (
                          <Badge variant="outline" className="text-xs">
                            Público
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Privado
                          </Badge>
                        )}
                        {file.productId && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            Producto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-600 border-b">
                <div className="col-span-1"></div>
                <div className="col-span-5">Nombre</div>
                <div className="col-span-2">Tamaño</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-1">Estado</div>
                <div className="col-span-1"></div>
              </div>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group ${
                    selectedItems.includes(file.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(file.id)}
                      onChange={() => toggleItemSelection(file.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    {file.thumbnailUrl && file.mimeType?.startsWith("image/") ? (
                      <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={file.thumbnailUrl || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0">{getFileIcon(file)}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {file.productId && <p className="text-xs text-gray-500">Producto: {file.productId}</p>}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-gray-600">
                    {file.type === "file" && file.size ? formatFileSize(file.size) : "-"}
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-gray-600">
                    {new Date(file.uploadDate).toLocaleDateString("es-ES")}
                  </div>
                  <div className="col-span-1 flex items-center">
                    {file.isPublic ? (
                      <Badge variant="outline" className="text-xs">
                        Público
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Privado
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Compartir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Renombrar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Move className="w-4 h-4 mr-2" />
                          Mover
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No se encontraron archivos" : "Carpeta vacía"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Intente con otros términos de búsqueda"
                  : "Comience subiendo archivos o creando carpetas"}
              </p>
              {!searchTerm && (
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Nueva Carpeta
                  </Button>
                  <Button onClick={() => setIsUploadOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Archivos
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
