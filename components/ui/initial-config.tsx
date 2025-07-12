"use client"

import { School } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"

interface Institution {
    id: string
    name: string
    address: string
    phone: string
    email: string
    director: string
    directorDni: string
    accessMode: "credentialed" | "free"
    createdAt: string
}

const InitialConfig = () => {
    const [step, setStep] = useState(1)
    const [institution, setInstitution] = useState<Partial<Institution>>({
        accessMode: "credentialed",
    })
    const router = useRouter()

    // Check if institution is already set up
    useEffect(() => {
        const existingInstitution = localStorage.getItem("khipu_institution")
        if (existingInstitution) {
            router.push("/dashboard")
        }
    }, [router])

    const handleSubmit = () => {
        const institutionData: Institution = {
            id: Date.now().toString(),
            name: institution.name || "",
            address: institution.address || "",
            phone: institution.phone || "",
            email: institution.email || "",
            director: institution.director || "",
            directorDni: institution.directorDni || "",
            accessMode: institution.accessMode || "credentialed",
            createdAt: new Date().toISOString(),
        }

        localStorage.setItem("khipu_institution", JSON.stringify(institutionData))
        localStorage.setItem("khipu_current_year", "2024")
        router.push("/dashboard")
    }

    return (
        <div className="shadow-xl rounded-lg border bg-card text-card-foreground">
            <div className="lex flex-col space-y-1.5 p-6">
                <h1 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
                    <School className="w-5 h-5" />
                    Configuración Inicial de la Institución
                </h1>
                <p className="text-sm text-muted-foreground">Configure los datos básicos de su institución educativa</p>
            </div>
            <div className="space-y-6  p-6 pt-0">
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre de la Institución *</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej: I.E. San Martín de Porres"
                                    value={institution.name || ""}
                                    onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    placeholder="Ej: 01-234-5678"
                                    value={institution.phone || ""}
                                    onChange={(e) => setInstitution({ ...institution, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Textarea
                                id="address"
                                placeholder="Dirección completa de la institución"
                                value={institution.address || ""}
                                onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contacto@institucion.edu.pe"
                                value={institution.email || ""}
                                onChange={(e) => setInstitution({ ...institution, email: e.target.value })}
                            />
                        </div>

                        <Button onClick={() => setStep(2)} className="w-full" disabled={!institution.name}>
                            Continuar
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="director">Nombre del Director *</Label>
                                <Input
                                    id="director"
                                    placeholder="Nombre completo"
                                    value={institution.director || ""}
                                    onChange={(e) => setInstitution({ ...institution, director: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="directorDni">DNI del Director *</Label>
                                <Input
                                    id="directorDni"
                                    placeholder="12345678"
                                    maxLength={8}
                                    value={institution.directorDni || ""}
                                    onChange={(e) =>
                                        setInstitution({ ...institution, directorDni: e.target.value.replace(/\D/g, "") })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Modo de Acceso al Sistema *</Label>
                            <RadioGroup
                                value={institution.accessMode}
                                onValueChange={(value: "credentialed" | "free") =>
                                    setInstitution({ ...institution, accessMode: value })
                                }
                            >
                                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                    <RadioGroupItem value="credentialed" id="credentialed" />
                                    <div className="flex-1">
                                        <Label htmlFor="credentialed" className="font-medium">
                                            Acceso con Credenciales
                                        </Label>
                                        <p className="text-sm text-gray-600">Los usuarios deben ingresar nombre, DNI y contraseña</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                    <RadioGroupItem value="free" id="free" />
                                    <div className="flex-1">
                                        <Label htmlFor="free" className="font-medium">
                                            Acceso Libre
                                        </Label>
                                        <p className="text-sm text-gray-600">Los usuarios solo seleccionan su nombre de usuario</p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                Atrás
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="flex-1"
                                disabled={!institution.director || !institution.directorDni || institution.directorDni.length !== 8}
                            >
                                Finalizar Configuración
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InitialConfig