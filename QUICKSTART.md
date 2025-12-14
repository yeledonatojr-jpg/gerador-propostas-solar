# ⚡ Quick Start - Gerador de Propostas Solar

Este guia rápido vai te ajudar a rodar o sistema em menos de 5 minutos!

## 🚀 Começando em 3 Passos

### 1️⃣ Clone o Repositório (se ainda não fez)

```bash
git clone https://github.com/yeledonatojr-jpg/gerador-propostas-solar.git
cd gerador-propostas-solar
```

### 2️⃣ Inicie o Servidor

Escolha uma das opções:

**Opção A: Com npm**
```bash
npm start
```

**Opção B: Com script bash**
```bash
sh scripts/start.sh
```

**Opção C: Com Python direto**
```bash
python3 -m http.server 8080
```

### 3️⃣ Acesse no Navegador

Abra seu navegador e acesse:
```
http://localhost:8080
```

🎉 **Pronto!** O sistema já está rodando!

---

## 📝 Usando o Sistema

### Passo a Passo Básico:

1. **Preencha os dados do cliente**
   - Nome, empresa, contato, etc.

2. **Selecione o grupo tarifário**
   - Grupo B (Residencial/Comercial)
   - Grupo A (Industrial)

3. **Informe o consumo e tarifas**
   - Consumo mensal em kWh
   - Tarifa por kWh
   - Outros custos (se aplicável)

4. **Clique em "🧮 Gerar Proposta"**
   - O sistema calculará automaticamente tudo

5. **Visualize os resultados**
   - Investimento necessário
   - Economia mensal e anual
   - Payback
   - Gráficos interativos
   - Detalhes técnicos

6. **Imprima ou salve em PDF**
   - Clique em "🖨️ Imprimir / Salvar PDF"
   - Na janela de impressão, escolha "Salvar como PDF"

---

## 🎯 Exemplo Rápido

Vamos gerar uma proposta de exemplo:

### Dados de Entrada:
```
👤 Cliente:     João Silva
📊 Consumo:     500 kWh/mês
💰 Tarifa:      R$ 0,95/kWh
🏢 Grupo:       B (Residencial)
```

### Resultado Esperado:
```
⚡ Sistema:     ~5 kWp
📦 Placas:      8 unidades
💰 Investimento: R$ 22.500,00
💵 Economia:    R$ 380,00/mês
📊 Redução:     84%
⏱️  Payback:     4.9 anos
```

---

## ⚙️ Configuração Avançada (Opcional)

### Conectar ao Supabase

Para usar parâmetros dinâmicos do banco de dados:

1. **Crie uma conta no Supabase** (gratuito)
   - https://supabase.com

2. **Execute o SQL**
   - Abra o arquivo `database-schema.sql`
   - Execute no SQL Editor do Supabase

3. **Configure as credenciais**
   - Edite `js/supabase-config.js`
   - Cole sua URL e chave do Supabase

4. **Reinicie o servidor**
   - O status mudará para "✅ Conectado ao Supabase"

> 💡 O sistema funciona perfeitamente SEM Supabase usando valores padrão!

---

## 🧪 Validar o Sistema

Para verificar se tudo está correto:

```bash
# Validar arquivos e sintaxe
npm run validate

# Ou executar testes
npm test
```

---

## 📚 Documentação Completa

- 📖 [README.md](README.md) - Documentação completa
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Guia de deployment
- ✨ [FEATURES.md](FEATURES.md) - Lista de funcionalidades
- 🧪 [TESTING.md](TESTING.md) - Guia de testes

---

## ❓ Precisa de Ajuda?

### Problema: "Porta 8080 já está em uso"

**Solução**: Use outra porta
```bash
# Python
python3 -m http.server 8081

# Ou defina a variável de ambiente
PORT=8081 npm start
```

### Problema: "Python não encontrado"

**Solução**: 
- Windows: Instale Python em https://python.org
- Mac: `brew install python3`
- Linux: `sudo apt install python3`

### Problema: Status amarelo (Supabase)

**Solução**: 
- Isso é normal! O sistema funciona sem Supabase
- Valores padrão estão sendo usados
- Veja DEPLOYMENT.md para configurar Supabase

---

## 🎉 Pronto para Produção?

Quando estiver satisfeito com os testes:

1. Valide o sistema: `npm run validate`
2. Prepare para deploy: `npm run deploy`
3. Siga o guia: [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Desenvolvido com ❤️ para facilitar sua vida!**

🌞 **Boas vendas!** ⚡
