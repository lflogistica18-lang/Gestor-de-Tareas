# Ejecutar Gestor de Tareas - Script para PowerShell

Write-Host "🚀 Iniciando Gestor de Tareas desde WSL..." -ForegroundColor Green
Write-Host ""

# Ejecutar el servidor de desarrollo desde WSL
wsl -d Ubuntu -e sh -c "cd /home/lucas/task-organizer && chmod +x start-dev.sh && ./start-dev.sh"
