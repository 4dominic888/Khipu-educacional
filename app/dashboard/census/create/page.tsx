"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ClipboardList, Save, AlertTriangle } from "lucide-react"

interface CensusFormData {
  title: string
  description: string
  // Infrastructure
  buildingCondition: string
  classroomCount: number
  classroomCondition: string
  bathroomCondition: string
  electricityCondition: string
  waterSupply: string
  internetAccess: string
  // Security
  hasSecurityMeasures: boolean
  emergencyExits: string
  fireExtinguishers: boolean
  firstAidKit: boolean
  // Educational Resources
  hasLibrary: boolean
  libraryCondition: string
  hasLaboratory: boolean
  laboratoryCondition: string
  sportsArea: string
  sportsAreaCondition: string
  // Technology
  computersCount: number
  computersCondition: string
  projectorsCount: number
  projectorsCondition: string
  // Human Resources
  teachersCount: number
  administrativeStaff: number
  supportStaff: number
  // Additional observations
  observations: string
  recommendations: string
}

export default function CreateCensusPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CensusFormData>({
    title: "",
    description: "",
    buildingCondition: "",
    classroomCount: 0,
    classroomCondition: "",
    bathroomCondition: "",
    electricityCondition: "",
    waterSupply: "",
    internetAccess: "",
    hasSecurityMeasures: false,
    emergencyExits: "",
    fireExtinguishers: false,
    firstAidKit: false,
    hasLibrary: false,
    libraryCondition: "",
    hasLaboratory: false,
    laboratoryCondition: "",
    sportsArea: "",
    sportsAreaCondition: "",
    computersCount: 0,
    computersCondition: "",
    projectorsCount: 0,
    projectorsCondition: "",
    teachersCount: 0,
    administrativeStaff: 0,
    supportStaff: 0,
    observations: "",
    recommendations: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      alert("Por favor complete los campos obligatorios")
      return
    }

    setIsSubmitting(true)

    try {
      // Mock save - in real implementation, this would save to backend
      console.log("Saving census:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Censo creado exitosamente")
      router.push("/dashboard/census")
    } catch (error) {
      console.error("Error creating census:", error)
      alert("Error al crear el censo")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof CensusFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-8 h-8" />
              Crear Nuevo Censo
            </h1>
            <p className="text-gray-600 mt-1">Evaluación integral del estado de la institución educativa</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos básicos del censo institucional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Censo *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Censo Institucional 2024"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del objetivo y alcance del censo"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle>Infraestructura</CardTitle>
                <CardDescription>Evaluación del estado físico de las instalaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Estado General del Edificio</Label>
                  <RadioGroup
                    value={formData.buildingCondition}
                    onValueChange={(value) => updateFormData("buildingCondition", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excelente" id="building-excellent" />
                      <Label htmlFor="building-excellent">Excelente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bueno" id="building-good" />
                      <Label htmlFor="building-good">Bueno</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="building-regular" />
                      <Label htmlFor="building-regular">Regular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="malo" id="building-bad" />
                      <Label htmlFor="building-bad">Malo</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classroomCount">Número de Aulas</Label>
                    <Input
                      id="classroomCount"
                      type="number"
                      min="0"
                      value={formData.classroomCount}
                      onChange={(e) => updateFormData("classroomCount", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classroomCondition">Estado de las Aulas</Label>
                    <Select
                      value={formData.classroomCondition}
                      onValueChange={(value) => updateFormData("classroomCondition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bathroomCondition">Estado de los Baños</Label>
                    <Select
                      value={formData.bathroomCondition}
                      onValueChange={(value) => updateFormData("bathroomCondition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="electricityCondition">Estado del Sistema Eléctrico</Label>
                    <Select
                      value={formData.electricityCondition}
                      onValueChange={(value) => updateFormData("electricityCondition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waterSupply">Suministro de Agua</Label>
                    <Select
                      value={formData.waterSupply}
                      onValueChange={(value) => updateFormData("waterSupply", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanente">Permanente</SelectItem>
                        <SelectItem value="intermitente">Intermitente</SelectItem>
                        <SelectItem value="deficiente">Deficiente</SelectItem>
                        <SelectItem value="no-disponible">No Disponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="internetAccess">Acceso a Internet</Label>
                    <Select
                      value={formData.internetAccess}
                      onValueChange={(value) => updateFormData("internetAccess", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                        <SelectItem value="no-disponible">No Disponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>Medidas de seguridad y emergencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasSecurityMeasures"
                      checked={formData.hasSecurityMeasures}
                      onCheckedChange={(checked) => updateFormData("hasSecurityMeasures", checked)}
                    />
                    <Label htmlFor="hasSecurityMeasures">La institución cuenta con medidas de seguridad</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyExits">Estado de las Salidas de Emergencia</Label>
                    <Select
                      value={formData.emergencyExits}
                      onValueChange={(value) => updateFormData("emergencyExits", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                        <SelectItem value="no-disponible">No Disponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fireExtinguishers"
                      checked={formData.fireExtinguishers}
                      onCheckedChange={(checked) => updateFormData("fireExtinguishers", checked)}
                    />
                    <Label htmlFor="fireExtinguishers">Cuenta con extintores de incendios</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="firstAidKit"
                      checked={formData.firstAidKit}
                      onCheckedChange={(checked) => updateFormData("firstAidKit", checked)}
                    />
                    <Label htmlFor="firstAidKit">Cuenta con botiquín de primeros auxilios</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Recursos Educativos</CardTitle>
                <CardDescription>Espacios y recursos para el aprendizaje</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasLibrary"
                        checked={formData.hasLibrary}
                        onCheckedChange={(checked) => updateFormData("hasLibrary", checked)}
                      />
                      <Label htmlFor="hasLibrary">Cuenta con biblioteca</Label>
                    </div>
                    {formData.hasLibrary && (
                      <div className="space-y-2 ml-6">
                        <Label htmlFor="libraryCondition">Estado de la biblioteca</Label>
                        <Select
                          value={formData.libraryCondition}
                          onValueChange={(value) => updateFormData("libraryCondition", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excelente">Excelente</SelectItem>
                            <SelectItem value="bueno">Bueno</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="malo">Malo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasLaboratory"
                        checked={formData.hasLaboratory}
                        onCheckedChange={(checked) => updateFormData("hasLaboratory", checked)}
                      />
                      <Label htmlFor="hasLaboratory">Cuenta con laboratorio</Label>
                    </div>
                    {formData.hasLaboratory && (
                      <div className="space-y-2 ml-6">
                        <Label htmlFor="laboratoryCondition">Estado del laboratorio</Label>
                        <Select
                          value={formData.laboratoryCondition}
                          onValueChange={(value) => updateFormData("laboratoryCondition", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excelente">Excelente</SelectItem>
                            <SelectItem value="bueno">Bueno</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="malo">Malo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sportsArea">Área Deportiva</Label>
                    <Select value={formData.sportsArea} onValueChange={(value) => updateFormData("sportsArea", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cancha-multiple">Cancha Múltiple</SelectItem>
                        <SelectItem value="patio">Patio</SelectItem>
                        <SelectItem value="campo-deportivo">Campo Deportivo</SelectItem>
                        <SelectItem value="no-disponible">No Disponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sportsAreaCondition">Estado del Área Deportiva</Label>
                    <Select
                      value={formData.sportsAreaCondition}
                      onValueChange={(value) => updateFormData("sportsAreaCondition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technology */}
            <Card>
              <CardHeader>
                <CardTitle>Tecnología</CardTitle>
                <CardDescription>Recursos tecnológicos disponibles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="computersCount">Número de Computadoras</Label>
                    <Input
                      id="computersCount"
                      type="number"
                      min="0"
                      value={formData.computersCount}
                      onChange={(e) => updateFormData("computersCount", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="computersCondition">Estado de las Computadoras</Label>
                    <Select
                      value={formData.computersCondition}
                      onValueChange={(value) => updateFormData("computersCondition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectorsCount">Número de Proyectores</Label>
                    <Input
                      id="projectorsCount"
                      type="number"
                      min="0"
                      value={formData.projectorsCount}
                      onChange={(e) => updateFormData("projectorsCount", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectorsCondition">Estado de los Proyectores</Label>
                    <Select
                      value={formData.projectorsCondition}
                      onValueChange={(value) => updateFormData("projectorsCondition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Human Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Recursos Humanos</CardTitle>
                <CardDescription>Personal de la institución educativa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teachersCount">Número de Docentes</Label>
                    <Input
                      id="teachersCount"
                      type="number"
                      min="0"
                      value={formData.teachersCount}
                      onChange={(e) => updateFormData("teachersCount", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="administrativeStaff">Personal Administrativo</Label>
                    <Input
                      id="administrativeStaff"
                      type="number"
                      min="0"
                      value={formData.administrativeStaff}
                      onChange={(e) => updateFormData("administrativeStaff", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportStaff">Personal de Apoyo</Label>
                    <Input
                      id="supportStaff"
                      type="number"
                      min="0"
                      value={formData.supportStaff}
                      onChange={(e) => updateFormData("supportStaff", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
                <CardDescription>Observaciones y recomendaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="observations">Observaciones</Label>
                  <Textarea
                    id="observations"
                    placeholder="Observaciones generales sobre el estado de la institución"
                    value={formData.observations}
                    onChange={(e) => updateFormData("observations", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recomendaciones</Label>
                  <Textarea
                    id="recommendations"
                    placeholder="Recomendaciones para mejorar el estado de la institución"
                    value={formData.recommendations}
                    onChange={(e) => updateFormData("recommendations", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Crear Censo"}
              </Button>
            </div>
          </div>
        </form>
      </div>
  )
}
