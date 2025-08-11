"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { EditableButton } from "@/components/editable-button"

type Props = {
  url?: string
  label?: string
  className?: string
  variant?: "default" | "outline"
  onLabelChange?: (newLabel: string) => void
}

export function ScheduleButton({
  url = "https://calendly.com/tu-usuario/sesion",
  label = "Agendar",
  className,
  variant = "default",
  onLabelChange,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const calendlyUrl = url

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EditableButton
          value={label}
          onSave={onLabelChange || (() => {})}
          variant={variant === "outline" ? "outline" : "default"}
          className={cn(className)}
          placeholder="Texto del botón"
        >
          <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
        </EditableButton>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Agenda tu sesión</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full rounded-md overflow-hidden border bg-muted">
          {/* Inline embed via iframe (sin scripts externos) */}
          <iframe src={calendlyUrl} title="Calendly" className="w-full h-full" loading="lazy" />
        </div>
        <p className="text-xs text-muted-foreground">
          Si el embed no carga, abre en una pestaña nueva:{" "}
          <a className="underline" href={calendlyUrl} target="_blank" rel="noopener noreferrer">
            {calendlyUrl}
          </a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
