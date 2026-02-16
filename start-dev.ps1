# Ejecutar Gestor de Tareas - Script para PowerShell

Write-Host "🚀 Iniciando Gestor de Tareas desde WSL..." -ForegroundColor Green
Write-Host ""

# Ejecutar el servidor de desarrollo desde WSL
wsl -e sh -c "cd /home/lucas/asistente-ventas-plagas-skill/Antigravity/task-organizer && chmod +x start-dev.sh && ./start-dev.sh"
