"use client"

import InitialConfig from "@/components/ui/initial-config"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <svg viewBox="0 0 40 40" className="w-10 h-10 text-indigo-600">
              <path
                fill="currentColor"
                d="M20 4c-2 0-4 1-6 2l-8 4c-1 0-2 1-2 2v16c0 1 1 2 2 2l8 4c2 1 4 2 6 2s4-1 6-2l8-4c1 0 2-1 2-2V12c0-1-1-2-2-2l-8-4c-2-1-4-2-6-2zm0 4l6 3-6 3-6-3 6-3zm-8 6l6 3v10l-6-3V14zm16 0v10l-6 3V17l6-3z"
              />
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.6" />
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                d="M12 16c2 2 4 2 6 0s4-2 6 0M14 20c1.5 1.5 3 1.5 4 0s2.5-1.5 4 0"
                opacity="0.8"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Khipu</h1>
          <p className="text-gray-600">Sistema de Gestión Educativa</p>
        </div>

        {/* Form */}
        <InitialConfig />

      </div>
    </div>
  )
}
