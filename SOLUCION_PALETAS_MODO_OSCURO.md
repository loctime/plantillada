# Solución: Paletas de Colores en Modo Oscuro

## Problema Identificado

La paleta de colores no cambiaba los colores correctamente cuando se alternaba entre modo claro y oscuro. El problema era que cuando se aplicaba una paleta de colores, solo se aplicaban los colores del modo actual, pero al cambiar de modo, el sistema volvía al tema configurado original en lugar de mantener los colores de la paleta seleccionada.

## Causa Raíz

El `useEffect` en el `ThemeManager` siempre aplicaba `activeTheme` que venía del tema configurado, no de la paleta seleccionada. Esto causaba que al cambiar de modo, se perdieran los colores de la paleta aplicada.

## Solución Implementada

### 1. Nueva Función `getActiveColors()`

Se creó una nueva función que considera la paleta seleccionada al determinar qué colores aplicar:

```typescript
const getActiveColors = (): ColorConfig => {
  // Si hay una paleta seleccionada, usar sus colores
  if (selectedPalette !== 'default') {
    const palette = colorPalettes.find(p => p.id === selectedPalette)
    if (palette) {
      const paletteColors = isDarkMode ? palette.colors.dark : palette.colors.light
      return paletteColors
    }
  }

  // Si no hay paleta seleccionada, usar el tema configurado
  const currentTheme = getActiveTheme()
  const activeTheme = isDarkMode ? currentTheme.dark : currentTheme.light
  return activeTheme
}
```

### 2. Actualización de `applyPalette()`

La función `applyPalette()` ahora solo actualiza el estado de la paleta seleccionada, y los colores se aplican automáticamente a través del `useEffect`:

```typescript
const applyPalette = (paletteId: string) => {
  // Actualizar la paleta seleccionada
  setSelectedPalette(paletteId)
  
  // Los colores se aplicarán automáticamente en el useEffect
  // debido a que getActiveColors() ahora considera la paleta seleccionada
}
```

### 3. Mejora en `saveChanges()`

La función `saveChanges()` ahora guarda la paleta completa (ambos modos) cuando se selecciona una paleta:

```typescript
if (selectedPalette !== 'default') {
  const palette = colorPalettes.find(p => p.id === selectedPalette)
  if (palette) {
    // Usar los colores de la paleta para ambos modos
    newTheme = {
      light: palette.colors.light,
      dark: palette.colors.dark
    }
  }
}
```

### 4. Botón de Reset

Se agregó un botón "Resetear" que permite volver al tema configurado cuando se ha seleccionado una paleta:

```typescript
{selectedPalette !== 'default' && (
  <Button
    onClick={() => setSelectedPalette('default')}
    variant="outline"
    size="sm"
  >
    Resetear
  </Button>
)}
```

### 5. Indicador Visual

Se agregó un indicador en la vista previa que muestra qué paleta está activa:

```typescript
{selectedPalette !== 'default' && (
  <>
    <span className="text-xs text-muted-foreground">•</span>
    <span className="text-xs font-medium text-blue-600">
      {colorPalettes.find(p => p.id === selectedPalette)?.name || selectedPalette}
    </span>
  </>
)}
```

## Flujo de Funcionamiento

1. **Selección de Paleta**: El usuario selecciona una paleta de colores
2. **Aplicación Automática**: Los colores se aplican inmediatamente al modo actual
3. **Cambio de Modo**: Al cambiar entre claro/oscuro, se aplican automáticamente los colores correspondientes de la paleta seleccionada
4. **Persistencia**: Los colores de la paleta se mantienen hasta que se seleccione otra paleta o se haga reset
5. **Guardado**: Al guardar, se puede guardar la paleta completa o solo los cambios editados

## Archivos Modificados

- `components/theme-manager.tsx` - Lógica principal del gestor de colores
- `scripts/test-palette-dark-mode.js` - Script de prueba para verificar la lógica
- `scripts/test-palette-browser.js` - Script para probar en el navegador

## Pruebas

### Script de Prueba
```bash
node scripts/test-palette-dark-mode.js
```

### Prueba en Navegador
1. Abrir la consola del navegador
2. Cargar el script: `scripts/test-palette-browser.js`
3. Ejecutar: `createPaletteTestPanel()`
4. Probar las diferentes paletas y cambios de modo

## Resultados Esperados

- ✅ Las paletas mantienen sus colores específicos al cambiar de modo
- ✅ El modo oscuro usa colores más oscuros que el modo claro
- ✅ Los colores de acento pueden mantenerse similares entre modos
- ✅ Los colores de texto contrastan bien con el fondo
- ✅ Se puede resetear fácilmente al tema configurado
- ✅ La paleta seleccionada se indica visualmente

## Comandos de Prueba

```javascript
// En la consola del navegador
checkCurrentMode()           // Verificar modo actual
toggleMode()                 // Cambiar entre modo claro/oscuro
showCurrentColors()          // Mostrar colores actuales
applyPalette("abogados")     // Aplicar paleta específica
createPaletteTestPanel()     // Crear panel de prueba
```

## Paletas Disponibles

- `default` - Paleta por defecto (verde y azul)
- `abogados` - Paleta elegante (dorado y negro)
- `psicologos` - Paleta tranquila (púrpura y azul)
- `contable` - Paleta profesional (azul y naranja)
- `ingenieros` - Paleta técnica (azul y verde)
- `coaches` - Paleta energética (naranja y verde)
- `consultores` - Paleta profesional (verde y azul)
