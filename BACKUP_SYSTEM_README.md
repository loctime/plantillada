# 💾 Sistema de Backup y Restauración

## 📋 Descripción

El sistema de backup y restauración permite crear copias de seguridad de la configuración del sitio y restaurarlas cuando sea necesario. Esto es especialmente útil antes de aplicar cambios importantes o cuando se necesita revertir a una configuración anterior.

## 🎯 Características Principales

### Backup Automático
- **Backup automático**: Se crea automáticamente al aplicar diseños
- **Backup manual**: Crear copias de seguridad en cualquier momento
- **Metadatos**: Timestamp, descripción, tipo de backup
- **Compresión**: Optimización del tamaño de almacenamiento

### Gestión de Backups
- **Lista de backups**: Vista completa de todas las copias de seguridad
- **Información detallada**: Fecha, tamaño, descripción
- **Eliminación**: Borrar backups antiguos o innecesarios
- **Búsqueda**: Filtrar backups por fecha o descripción

### Restauración
- **Restauración completa**: Revertir toda la configuración
- **Restauración parcial**: Restaurar solo secciones específicas
- **Previsualización**: Ver cambios antes de restaurar
- **Confirmación**: Proceso de dos pasos para evitar errores

## 🛠️ Uso del Sistema

### Crear Backup Manual
1. Ir al panel de administración → "Backup"
2. Hacer clic en "Crear Backup"
3. Agregar descripción opcional
4. El sistema creará una copia de seguridad completa

### Aplicar Diseño (Backup Automático)
1. Ir a "Seleccionar Diseño"
2. Elegir diseño deseado
3. El sistema creará automáticamente un backup antes de aplicar
4. Aplicar diseño con seguridad

### Restaurar Backup
1. Ir a "Backup" → "Gestionar Backups"
2. Seleccionar backup a restaurar
3. Revisar información del backup
4. Confirmar restauración
5. El sistema restaurará la configuración

### Eliminar Backup
1. Ir a "Gestionar Backups"
2. Seleccionar backup a eliminar
3. Confirmar eliminación
4. El backup se eliminará permanentemente

## 🔧 APIs Disponibles

### Crear Backup
```typescript
POST /api/backup
{
  "description": "Backup antes de cambios importantes",
  "type": "manual" // "manual" | "automatic"
}

// Respuesta
{
  "success": true,
  "backup": {
    "id": "backup_123",
    "timestamp": "2024-01-15T10:30:00Z",
    "description": "Backup antes de cambios importantes",
    "type": "manual",
    "size": 2048,
    "config": {
      // Configuración completa del sitio
    }
  }
}
```

### Listar Backups
```typescript
GET /api/backup

// Respuesta
{
  "backups": [
    {
      "id": "backup_123",
      "timestamp": "2024-01-15T10:30:00Z",
      "description": "Backup antes de cambios importantes",
      "type": "manual",
      "size": 2048
    },
    {
      "id": "backup_124",
      "timestamp": "2024-01-15T09:15:00Z",
      "description": "Backup automático - Diseño Tech Shop",
      "type": "automatic",
      "size": 1536
    }
  ]
}
```

### Restaurar Backup
```typescript
POST /api/backup/[backupId]/restore
{
  "confirm": true
}

// Respuesta
{
  "success": true,
  "message": "Backup restaurado exitosamente",
  "restoredAt": "2024-01-15T11:00:00Z"
}
```

### Eliminar Backup
```typescript
DELETE /api/backup/[backupId]
{
  "confirm": true
}

// Respuesta
{
  "success": true,
  "message": "Backup eliminado exitosamente"
}
```

## 🎨 Componentes del Sistema

### BackupManager Component
```tsx
// components/backup-manager.tsx
interface Backup {
  id: string
  timestamp: string
  description: string
  type: 'manual' | 'automatic'
  size: number
  config?: any
}

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([])
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Lógica de gestión de backups
  // Crear, restaurar, eliminar
  // Manejo de estados
}
```

### BackupList Component
```tsx
// components/backup-list.tsx
interface BackupListProps {
  backups: Backup[]
  onSelect: (backup: Backup) => void
  onRestore: (backupId: string) => void
  onDelete: (backupId: string) => void
}

const BackupList: React.FC<BackupListProps> = ({
  backups,
  onSelect,
  onRestore,
  onDelete
}) => {
  // Renderizado de lista de backups
  // Acciones de restaurar y eliminar
  // Filtros y búsqueda
}
```

## 🔒 Seguridad y Validación

### Validación de Backups
```typescript
interface BackupValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

const validateBackup = (backup: Backup): BackupValidation => {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Validar estructura de datos
  if (!backup.config) {
    errors.push("Configuración faltante")
  }
  
  // Validar timestamp
  if (new Date(backup.timestamp) > new Date()) {
    errors.push("Timestamp inválido")
  }
  
  // Validar tamaño
  if (backup.size > MAX_BACKUP_SIZE) {
    warnings.push("Backup muy grande")
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
```

### Confirmación de Restauración
```typescript
interface RestoreConfirmation {
  backupId: string
  timestamp: string
  description: string
  changes: ConfigChange[]
}

interface ConfigChange {
  section: string
  oldValue: any
  newValue: any
  type: 'added' | 'modified' | 'removed'
}
```

## 📊 Gestión de Almacenamiento

### Límites de Almacenamiento
```typescript
const BACKUP_LIMITS = {
  maxBackups: 50,
  maxBackupSize: 1024 * 1024, // 1MB
  maxTotalSize: 50 * 1024 * 1024, // 50MB
  autoCleanup: true
}
```

### Limpieza Automática
```typescript
const cleanupOldBackups = async () => {
  const backups = await getBackups()
  
  // Eliminar backups automáticos antiguos (más de 30 días)
  const oldAutomaticBackups = backups.filter(backup => 
    backup.type === 'automatic' && 
    isOlderThan(backup.timestamp, 30)
  )
  
  // Eliminar backups manuales excedentes
  const manualBackups = backups.filter(b => b.type === 'manual')
  if (manualBackups.length > 20) {
    const toDelete = manualBackups.slice(20)
    await deleteBackups(toDelete.map(b => b.id))
  }
}
```

## 🚨 Solución de Problemas

### Problemas Comunes

#### Error "Backup muy grande"
- **Causa**: La configuración excede el límite de tamaño
- **Solución**: Comprimir datos o aumentar límite
- **Prevención**: Limpiar configuración innecesaria

#### Error "No se puede restaurar"
- **Causa**: Backup corrupto o estructura incompatible
- **Solución**: Validar integridad del backup
- **Prevención**: Verificar backups antes de eliminar

#### Error "Espacio insuficiente"
- **Causa**: Se alcanzó el límite de almacenamiento
- **Solución**: Eliminar backups antiguos
- **Prevención**: Configurar limpieza automática

### Herramientas de Diagnóstico
```bash
# Verificar integridad de backups
node scripts/verify-backups.js

# Limpiar backups antiguos
node scripts/cleanup-backups.js

# Restaurar backup desde línea de comandos
node scripts/restore-backup.js backup_id
```

## 📈 Métricas y Monitoreo

### Estadísticas de Backup
```typescript
interface BackupStats {
  totalBackups: number
  totalSize: number
  averageSize: number
  oldestBackup: string
  newestBackup: string
  automaticBackups: number
  manualBackups: number
  failedBackups: number
}
```

### Alertas y Notificaciones
```typescript
const checkBackupHealth = async () => {
  const stats = await getBackupStats()
  
  // Alerta si no hay backups recientes
  if (isOlderThan(stats.newestBackup, 7)) {
    sendAlert("No hay backups recientes")
  }
  
  // Alerta si el almacenamiento está lleno
  if (stats.totalSize > BACKUP_LIMITS.maxTotalSize * 0.9) {
    sendAlert("Almacenamiento de backups casi lleno")
  }
}
```

## 🔄 Mejoras Futuras

### Fase 1 - Funcionalidades Básicas ✅
- Backup manual y automático
- Restauración completa
- Gestión de backups

### Fase 2 - Funcionalidades Avanzadas 📋
- Backup programado automático
- Restauración parcial por secciones
- Sincronización con almacenamiento externo
- Encriptación de backups

### Fase 3 - Integración Cloud ☁️
- Backup en Google Drive/Dropbox
- Sincronización multi-dispositivo
- Backup diferencial
- Compresión avanzada

---

**Sistema de Backup y Restauración** - Protección y recuperación de datos del sitio 💾
