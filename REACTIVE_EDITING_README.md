# 🎯 Fórmula Mágica para Edición Reactiva

## ⚡ El Problema y La Solución

### ❌ Lo que NO funciona (causa falta de reactividad):
```tsx
// Componente que recibe config como prop
interface MyLayoutProps {
  config: Config
}

export function MyLayout({ config }: MyLayoutProps) {
  const { updateConfig } = useAdmin()
  
  return (
    <EditableText 
      value={config.site.title}
      onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
    />
  )
}

// Uso en componente padre
<MyLayout config={config} />
```

### ✅ Lo que SÍ funciona (reactividad completa):
```tsx
// Componente que usa el contexto directamente
export function MyLayout() {
  const { config, updateConfig } = useAdmin()
  
  if (!config) {
    return <LoadingSpinner />
  }
  
  return (
    <EditableText 
      value={config.site.title}
      onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
    />
  )
}

// Uso en componente padre
<MyLayout />
```

## 🔑 Reglas de Oro para Implementaciones Editables

### 1. **SIEMPRE usar el contexto directamente**
- ✅ `const { config, updateConfig } = useAdmin()`
- ❌ NO recibir `config` como prop

### 2. **SIEMPRE agregar estado de loading**
```tsx
if (!config) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Cargando configuración...</p>
      </div>
    </div>
  )
}
```

### 3. **SIEMPRE hacer nuevos elementos editables**
Cuando implementes algo nuevo, automáticamente:
- ✅ Agregar `EditableText`, `EditableImage`, `EditableUrl` según corresponda
- ✅ Actualizar la interfaz `Config` en `lib/config-loader.ts`
- ✅ Usar `updateConfig` para guardar cambios
- ❌ NO hardcodear texto/imágenes

### 4. **Patrón estándar para elementos editables**
```tsx
// Para texto
<EditableText 
  value={config.miSeccion?.miCampo || "Valor por defecto"}
  onSave={(value) => {
    updateConfig({
      ...config,
      miSeccion: {
        ...config.miSeccion,
        miCampo: value
      }
    })
  }}
  className="mi-clase-css"
  tag="h2"
/>

// Para imágenes
<EditableImage
  value={config.miSeccion?.miImagen || "/placeholder.jpg"}
  alt="Descripción"
  className="mi-clase-css"
  onSave={(value) => {
    updateConfig({
      ...config,
      miSeccion: {
        ...config.miSeccion,
        miImagen: value
      }
    })
  }}
/>

// Para URLs
<EditableUrl 
  value={config.miSeccion?.miUrl || "#"}
  onSave={(value) => {
    updateConfig({
      ...config,
      miSeccion: {
        ...config.miSeccion,
        miUrl: value
      }
    })
  }}
  className="mi-clase-css"
/>
```

### 5. **Para arrays editables**
```tsx
// En la interfaz Config
miSeccion?: {
  miArray?: Array<{
    title: string
    description: string
  }>
}

// En el componente
{config.miSeccion?.miArray?.map((item, index) => (
  <EditableText 
    value={item.title}
    onSave={(value) => {
      const newArray = [...(config.miSeccion?.miArray || [])]
      newArray[index] = { ...newArray[index], title: value }
      updateConfig({
        ...config,
        miSeccion: {
          ...config.miSeccion,
          miArray: newArray
        }
      })
    }}
  />
))}
```

## 🚀 Checklist para Nuevas Implementaciones

Antes de considerar una implementación completa, verificar:

- [ ] ¿El componente usa `useAdmin()` directamente?
- [ ] ¿Tiene estado de loading cuando `!config`?
- [ ] ¿Todos los textos son `EditableText`?
- [ ] ¿Todas las imágenes son `EditableImage`?
- [ ] ¿Todas las URLs son `EditableUrl`?
- [ ] ¿La interfaz `Config` está actualizada?
- [ ] ¿Los cambios se guardan con `updateConfig`?
- [ ] ¿Funciona la reactividad en modo admin?

## 🎨 Ejemplo Completo: Nuevo Layout

```tsx
"use client"

import { useAdmin } from "@/lib/admin-context"
import { EditableText } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"

export function MiNuevoLayout() {
  const { config, updateConfig } = useAdmin()

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header>
        <EditableText 
          value={config.site.title}
          onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
          className="text-2xl font-bold"
          tag="h1"
        />
      </header>
      
      <main>
        <EditableText 
          value={config.miSeccion?.titulo || "Título por defecto"}
          onSave={(value) => {
            updateConfig({
              ...config,
              miSeccion: {
                ...config.miSeccion,
                titulo: value
              }
            })
          }}
          className="text-4xl font-bold"
          tag="h2"
        />
        
        <EditableImage
          value={config.miSeccion?.imagen || "/placeholder.jpg"}
          alt="Imagen principal"
          className="rounded-lg"
          onSave={(value) => {
            updateConfig({
              ...config,
              miSeccion: {
                ...config.miSeccion,
                imagen: value
              }
            })
          }}
        />
      </main>
    </div>
  )
}
```

## 🔧 Actualización de la Interfaz Config

```tsx
// En lib/config-loader.ts
export interface Config {
  // ... otros campos existentes
  
  miSeccion?: {
    titulo?: string
    imagen?: string
    descripcion?: string
    elementos?: Array<{
      titulo: string
      descripcion: string
    }>
  }
}
```

## 📝 Notas Importantes

1. **NUNCA usar `JSON.stringify`** en `updateConfig` - rompe la reactividad
2. **SIEMPRE usar spread operator** para mantener inmutabilidad: `{ ...config, ... }`
3. **SIEMPRE verificar que `config` existe** antes de usarlo
4. **SIEMPRE proporcionar valores por defecto** con `|| "default"`
5. **SIEMPRE probar la reactividad** en modo admin antes de considerar completo

---

**Regla Fundamental**: Si no es editable, no está terminado. 🎯
