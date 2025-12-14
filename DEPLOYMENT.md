# 🚀 Guia de Deployment - Gerador de Propostas Solar

Este guia detalha como fazer o deploy do sistema em diferentes ambientes.

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

- ✅ Uma conta no [Supabase](https://supabase.com) (gratuita)
- ✅ Um servidor web ou plataforma de hospedagem
- ✅ Python 3 ou Node.js instalado (para testes locais)

## 🔧 Configuração Inicial

### 1. Configurar o Banco de Dados (Supabase)

1. Acesse [Supabase](https://supabase.com) e crie um novo projeto
2. Aguarde a criação do banco de dados
3. No painel do Supabase, vá em **SQL Editor**
4. Execute o conteúdo do arquivo `database-schema.sql`
5. Verifique se a tabela `parametros_gerais` foi criada com sucesso

### 2. Obter as Credenciais

No painel do Supabase:

1. Vá em **Settings** > **API**
2. Copie a **URL** do projeto
3. Copie a **anon/public key**

### 3. Configurar as Credenciais no Código

Edite o arquivo `js/supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-publica-aqui';
```

⚠️ **IMPORTANTE**: Nunca commite suas credenciais reais no Git!

## 🖥️ Deployment Local (Desenvolvimento)

### Opção 1: Python (Recomendado)

```bash
# Método 1: npm script
npm start

# Método 2: Script bash
sh scripts/start.sh

# Método 3: Direto com Python
python3 -m http.server 8080
```

Acesse: `http://localhost:8080`

### Opção 2: Node.js

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm run start:node
```

## 🌐 Deployment em Produção

### Opção 1: Servidor Web Tradicional (Apache/Nginx)

1. **Preparar os arquivos**:
```bash
sh scripts/deploy.sh
```

2. **Upload via FTP/SFTP**:
   - Faça upload de todos os arquivos para o diretório public_html ou www
   - Mantenha a estrutura de pastas intacta

3. **Arquivos necessários**:
```
/
├── index.html
├── config.html
├── js/
│   ├── proposta.js
│   ├── supabase-config.js
│   ├── utils.js
│   ├── script.js
│   └── auth.js
├── css/
│   └── styles.css
├── assets/
│   └── images/
└── database-schema.sql (apenas referência)
```

4. **Configurar o servidor**:
   - Certifique-se de que `index.html` é o arquivo padrão
   - Habilite HTTPS (obrigatório para produção)

### Opção 2: GitHub Pages

1. **Criar branch gh-pages**:
```bash
git checkout -b gh-pages
git push origin gh-pages
```

2. **Configurar no GitHub**:
   - Vá em **Settings** > **Pages**
   - Selecione branch `gh-pages`
   - Clique em **Save**

3. **Acessar**:
   - Seu site estará em: `https://seu-usuario.github.io/gerador-propostas-solar`

### Opção 3: Vercel

1. **Instalar CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Configurar**:
   - Framework: Other
   - Build Command: (deixe em branco)
   - Output Directory: ./
   - Seguir instruções na tela

### Opção 4: Netlify

1. **Via Interface Web**:
   - Acesse [Netlify](https://netlify.com)
   - Arraste a pasta do projeto
   - Aguarde o deploy

2. **Via CLI**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Opção 5: Firebase Hosting

1. **Instalar Firebase CLI**:
```bash
npm install -g firebase-tools
firebase login
```

2. **Inicializar**:
```bash
firebase init hosting
```

3. **Deploy**:
```bash
firebase deploy --only hosting
```

## ✅ Checklist de Deploy

Antes de fazer o deploy em produção, verifique:

### Configuração
- [ ] Credenciais do Supabase configuradas em `js/supabase-config.js`
- [ ] Banco de dados criado e populado com `database-schema.sql`
- [ ] Informações de contato atualizadas em `index.html` (linha 504)
- [ ] Logo da empresa adicionado (se aplicável)

### Testes
- [ ] Sistema testado localmente
- [ ] Formulário funciona corretamente
- [ ] Cálculos validados
- [ ] Gráficos exibem corretamente
- [ ] Impressão/PDF funciona
- [ ] Responsividade testada (mobile, tablet, desktop)
- [ ] Conexão com Supabase funcionando

### Validação
- [ ] Executar `npm run validate` sem erros
- [ ] Executar `npm test` (se aplicável)
- [ ] Testar em diferentes navegadores (Chrome, Firefox, Safari, Edge)

### Segurança
- [ ] HTTPS habilitado
- [ ] Credenciais não expostas no código público
- [ ] Arquivo `.env` não commitado (se usar)

## 🔍 Validação do Deploy

Após o deploy, verifique:

1. **Página carrega corretamente**:
   - Acesse a URL do seu site
   - Verifique se não há erros no console (F12)

2. **Supabase conectado**:
   - Deve aparecer status verde: "✅ Conectado ao Supabase"
   - Se aparecer amarelo, verifique as credenciais

3. **Funcionalidades**:
   - Preencha o formulário
   - Gere uma proposta
   - Verifique os cálculos
   - Teste a impressão/PDF

4. **Performance**:
   - Página deve carregar em menos de 3 segundos
   - Gráficos devem renderizar instantaneamente

## 🐛 Troubleshooting

### Problema: Status "⚠️ Usando valores padrão"

**Solução**:
- Verifique as credenciais em `js/supabase-config.js`
- Confirme que a URL e a chave estão corretas
- Verifique se a tabela `parametros_gerais` existe no Supabase
- Abra o console do navegador para ver erros específicos

### Problema: Gráficos não aparecem

**Solução**:
- Verifique se o CDN do Chart.js está acessível
- Abra o console do navegador (F12) e procure por erros
- Certifique-se de que a proposta foi gerada com sucesso

### Problema: Impressão sem cores

**Solução**:
- Use Chrome ou Edge (melhor suporte)
- Nas configurações de impressão, ative "Gráficos de fundo"
- Verifique se `print-color-adjust: exact` está no CSS

### Problema: "Arquivo não encontrado" (404)

**Solução**:
- Verifique se todos os arquivos foram enviados
- Confirme que a estrutura de pastas está correta
- Verifique permissões de leitura no servidor

### Problema: CORS Error

**Solução**:
- Certifique-se de que está usando HTTPS em produção
- Verifique as configurações do Supabase (deve permitir origem do seu domínio)
- Se em localhost, use http-server ou similar

## 📊 Monitoramento

### Logs do Supabase

1. Acesse o painel do Supabase
2. Vá em **Logs** para ver queries e erros
3. Configure alertas para erros críticos

### Google Analytics (Opcional)

Adicione no `<head>` do `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXX-X');
</script>
```

## 🔄 Atualizações

Para atualizar o sistema em produção:

1. Faça backup dos arquivos atuais
2. Teste as alterações localmente
3. Execute `npm run validate`
4. Faça upload dos novos arquivos
5. Teste em produção
6. Se necessário, execute novos scripts SQL no Supabase

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação em `README.md`
2. Revise o arquivo `TESTING.md`
3. Consulte os logs do navegador (Console F12)
4. Verifique os logs do Supabase

## 🎯 Boas Práticas

- ✅ Sempre teste localmente antes do deploy
- ✅ Faça backup regular do banco de dados
- ✅ Mantenha as dependências atualizadas
- ✅ Use HTTPS em produção
- ✅ Monitore os logs regularmente
- ✅ Documente customizações específicas

---

**Desenvolvido com ❤️ para otimizar a geração de propostas solares!**

🌞 **Boa sorte com seu deploy!** ⚡
