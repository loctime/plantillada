"use client"

import { DefaultLayout } from "./default-layout"
import { Config } from "@/lib/config-loader"

interface BlogLayoutProps {
  config: Config
}

export function BlogLayout({ config }: BlogLayoutProps) {
  // Por ahora usa el layout por defecto
  // En el futuro se puede personalizar específicamente para blogs
  return <DefaultLayout config={config} />
}
