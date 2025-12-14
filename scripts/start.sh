#!/bin/bash

# Script para iniciar o servidor de desenvolvimento
# Execute com: sh scripts/start.sh

echo "🌞 Iniciando Gerador de Propostas Solar"
echo "======================================="
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "index.html" ]; then
    echo "❌ Erro: Execute este script a partir do diretório raiz do projeto"
    exit 1
fi

# Detectar Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python não encontrado. Instale Python 3 para continuar."
    exit 1
fi

# Porta padrão
PORT=${PORT:-8080}

# Validar que PORT contém apenas números (POSIX compatible)
case "$PORT" in
    ''|*[!0-9]*)
        echo "❌ Erro: PORT deve conter apenas números. Valor fornecido: $PORT"
        exit 1
        ;;
esac

# Validar que PORT está em um range válido
if [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    echo "❌ Erro: PORT deve estar entre 1 e 65535. Valor fornecido: $PORT"
    exit 1
fi

echo "✅ Python encontrado: $PYTHON_CMD"
echo "🌐 Iniciando servidor HTTP na porta $PORT..."
echo ""
echo "   Acesse: http://localhost:$PORT"
echo "   ou:     http://127.0.0.1:$PORT"
echo ""
echo "   Pressione Ctrl+C para parar o servidor"
echo ""
echo "==================================================="
echo ""

# Iniciar servidor
$PYTHON_CMD -m http.server $PORT
