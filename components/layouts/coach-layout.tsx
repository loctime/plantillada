"use client"

import { DefaultLayout } from "./default-layout"
import { Config } from "@/lib/config-loader"

interface CoachLayoutProps {
  config: Config
}

export function CoachLayout({ config }: CoachLayoutProps) {
  // Por ahora usa el layout por defecto
  // En el futuro se puede personalizar específicamente para coaches
  return <DefaultLayout config={config} />
}
