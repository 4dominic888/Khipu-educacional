"use client"

import { School } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
        <div className="card">
            <div className="flex flex-col space-y-1.5 p-6">
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
                                <label htmlFor="name">Nombre de la Institución *</label>
                                <input
                                    className='k-text-input'
                                    id="name"
                                    placeholder="Ej: I.E. San Martín de Porres"
                                    value={institution.name || ""}
                                    onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone">Teléfono</label>
                                <input
                                    className='k-text-input'
                                    id="phone"
                                    placeholder="Ej: 01-234-5678"
                                    value={institution.phone || ""}
                                    onChange={(e) => setInstitution({ ...institution, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address">Dirección</label>
                            <textarea
                                id="address"
                                placeholder="Dirección completa de la institución"
                                value={institution.address || ""}
                                onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                className='k-text-input'
                                id="email"
                                type="email"
                                placeholder="contacto@institucion.edu.pe"
                                value={institution.email || ""}
                                onChange={(e) => setInstitution({ ...institution, email: e.target.value })}
                            />
                        </div>
                        <button
                            className="w-full btn-normal"
                            disabled={!institution.name}
                            onClick={() => setStep(2)}
                        >
                            Continuar
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="director">Nombre del Director *</label>
                                <input
                                    className='k-text-input'
                                    id="director"
                                    placeholder="Nombre completo"
                                    value={institution.director || ""}
                                    onChange={(e) => setInstitution({ ...institution, director: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="directorDni">DNI del Director *</label>
                                <input
                                    className='k-text-input'
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
                            <label>Modo de Acceso al Sistema *</label>
                            <RadioGroup defaultValue="credentialed">
                                <RadioGroupItem
                                    value="credentialed"
                                    id="credentialed"
                                    label="Acceso con Credenciales"
                                    description="Los usuarios deben ingresar nombre, DNI y contraseña"
                                />
                                <RadioGroupItem
                                    value="free"
                                    id="free"
                                    label="Acceso Anónimo"
                                    description="Los usuarios acceden sin identificación"
                                />
                            </RadioGroup>
                        </div>

                        <div className="flex gap-2">
                            <button className='btn-outline flex-1' onClick={() => setStep(1)}>Atrás</button>
                            <button className='btn-normal flex-1'
                                onClick={handleSubmit}
                                disabled={!institution.director || !institution.directorDni || institution.directorDni.length !== 8}
                            >
                                Finalizar Configuración
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InitialConfig