"use client"

import { DefaultLayout } from "./default-layout"
import { Config } from "@/lib/config-loader"

interface IngenierosLayoutProps {
  config: Config
}

export function IngenierosLayout({ config }: IngenierosLayoutProps) {
  // Por ahora usa el layout por defecto
  // En el futuro se puede personalizar específicamente para ingenieros
  return <DefaultLayout config={config} />
}
