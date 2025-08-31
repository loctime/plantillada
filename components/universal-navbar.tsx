"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Settings, Palette } from "lucide-react"
import { DynamicNavigation } from "@/components/dynamic-navigation"
import { ThemeSwitch } from "@/components/theme-switch"
import { DesignQuickPicker } from "@/components/design-quick-picker"
import { ScheduleButton } from "@/components/schedule-dialog"
import { SimplifiedColorEditor } from "@/components/simplified-color-editor"
import { useAdmin } from "@/lib/admin-context"
import { EditableText } from "@/components/editable-text"

interface UniversalNavbarProps {
  className?: string
  showDesignPicker?: boolean
  showScheduleButton?: boolean
  showAdminLink?: boolean
}

export function UniversalNavbar({ 
  className = "",
  showDesignPicker = true,
  showScheduleButton = true,
  showAdminLink = true
}: UniversalNavbarProps) {
  const { config, updateConfig } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!config) return null

  return (
    <header className={`sticky top-0 z-50 theme-bg-navbar-transparent theme-backdrop-blur theme-border theme-transition ${className}`}>
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Lado izquierdo: Título */}
        <div className="flex items-center">
          <EditableText
            value={config.site?.title || ""}
            onSave={(newValue) => updateConfig({ site: { ...config.site, title: newValue } })}
            className="font-semibold tracking-tight text-lg theme-text-heading"
            tag="span"
          />
        </div>
        
        {/* Centro: Navegación (solo desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <DynamicNavigation config={config} isMobile={false} />
          {/* Selector rápido de diseños (admin) */}
          {showDesignPicker && <DesignQuickPicker />}
        </div>
        
        {/* Lado derecho: Botones y controles */}
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <SimplifiedColorEditor />
          
          {showScheduleButton && (
            <ScheduleButton 
              url={config.integrations.calendlyUrl} 
              label={config.buttons?.heroButton || "Agendar"} 
              onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, heroButton: newValue } })}
            />
          )}
          
          {/* Enlace al Panel de Administración */}
          {showAdminLink && (
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium theme-text-subtitle theme-hover-text theme-transition"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
          
          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md theme-hover-bg theme-transition"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 theme-text-primary" />
            ) : (
              <Menu className="h-5 w-5 theme-text-primary" />
            )}
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden theme-border-t theme-bg-primary">
          <div className="container px-4 py-4">
            <DynamicNavigation config={config} isMobile={true} />
            {showDesignPicker && (
              <div className="mt-3">
                <DesignQuickPicker fullWidth />
              </div>
            )}
            {showAdminLink && (
              <div className="mt-4 pt-4 theme-border-t">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium theme-text-subtitle theme-hover-text theme-transition"
                >
                  <Settings className="h-4 w-4" />
                  Panel de Administración
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
