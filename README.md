# 📝 Gestor de Tareas Inteligente

Un organizador de tareas personal y profesional construido con **React, Vite y Tailwind CSS**. Diseñado para una gestión fluida con soporte multidependencia (Personal/Trabajo) y organización por secciones.

## 🚀 Funcionalidades Principales

- **Divisiones**: Separa tus tareas de "Trabajo" y "Personal" con un solo clic.
- **Secciones Dinámicas**: Organiza cada división en categorías (Ej: Proyectos, Casa, Finanzas).
- **Control de Estados**:
  - **Pendiente**: Tareas por iniciar.
  - **En Curso (Nuevo)**: Tareas activas con resaltado visual (Color Óxido).
  - **Completada**: Historial de tareas finalizadas.
- **Calendario Integrado**: Navegación diaria y selector de fecha completo.
- **Flexibilidad de Fechas (Nuevo)**: Asigna cualquier fecha de vencimiento directamente desde el formulario.
- **Quick Add**: Agrega tareas rápidas desde cualquier sección sin abrir el modal.
- **Drag & Drop**: Mueve tareas entre secciones fácilmente.

## 🛠️ Tecnologías

- **Frontend**: React 18
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Gráficos**: Recharts (Reporte Semanal)
- **Manejo de Fechas**: date-fns

## 📦 Instalación y Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Construir para producción:
   ```bash
   npm run build
   ```

## 📈 Próximos Pasos
- Notificaciones de escritorio.
- Modo oscuro completo.
- Sincronización con la nube (Supabase).