#!/bin/sh
# Script para ejecutar el servidor de desarrollo del Gestor de Tareas desde WSL

echo "🚀 Iniciando servidor de desarrollo del Gestor de Tareas..."
echo ""

cd /home/lucas/task-organizer

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules no encontrado. Instalando dependencias..."
    npm install
    echo ""
fi

echo "🌐 Iniciando Vite..."
echo "📝 Una vez iniciado, abre tu navegador en la URL que se muestre"
echo "   (típicamente http://localhost:5173)"
echo ""

npm run dev
