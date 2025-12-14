#!/bin/bash

# Script de deploy do Gerador de Propostas Solar
# Execute com: sh scripts/deploy.sh

echo "🚀 Deploy do Gerador de Propostas Solar"
echo "========================================"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "index.html" ]; then
    echo "❌ Erro: Execute este script a partir do diretório raiz do projeto"
    exit 1
fi

# Validar arquivos
echo "🔍 Validando arquivos..."
if command -v node &> /dev/null; then
    node tests/validate.js
    if [ $? -ne 0 ]; then
        echo "❌ Validação falhou. Corrija os erros antes de fazer deploy."
        exit 1
    fi
else
    echo "⚠️  Node.js não encontrado. Pulando validação automática."
fi

echo ""
echo "📋 Checklist de Deploy:"
echo "  [ ] Configurar credenciais do Supabase em js/supabase-config.js"
echo "  [ ] Executar database-schema.sql no Supabase"
echo "  [ ] Atualizar informações de contato em index.html"
echo "  [ ] Testar sistema localmente"
echo "  [ ] Fazer upload dos arquivos para o servidor"
echo ""

# Perguntar se quer continuar
read -p "Deseja continuar com o deploy? (s/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "❌ Deploy cancelado."
    exit 1
fi

# Criar diretório de build/dist se necessário
echo ""
echo "📦 Preparando arquivos para deploy..."

# Criar arquivo de timestamp
echo "Deploy realizado em: $(date)" > .deploy-timestamp

# Listar arquivos que serão enviados
echo ""
echo "📁 Arquivos a serem enviados:"
echo "  - index.html"
echo "  - config.html"
echo "  - js/ (todos os arquivos)"
echo "  - css/ (todos os arquivos)"
echo "  - assets/ (todos os arquivos)"
echo "  - database-schema.sql"
echo ""

echo "✅ Preparação concluída!"
echo ""
echo "📤 Próximos passos:"
echo "  1. Faça upload dos arquivos para seu servidor web"
echo "  2. Configure o Supabase (se ainda não foi feito)"
echo "  3. Teste o sistema no ambiente de produção"
echo "  4. Monitore os logs para garantir que tudo está funcionando"
echo ""
echo "🌐 Para servidor local, execute: npm start"
echo ""
