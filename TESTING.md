# 🧪 Guia de Testes do Sistema

## Verificação de Instalação

### 1. Verificar Arquivos Principais
```bash
# Todos esses arquivos devem existir:
✓ index.html
✓ js/proposta.js
✓ js/supabase-config.js
✓ js/utils.js
✓ database-schema.sql
✓ README.md
✓ FEATURES.md
```

### 2. Verificar CDN e Dependências
Abra `index.html` e verifique se todos os CDNs estão carregando:
- ✓ Tailwind CSS
- ✓ Chart.js 4.4.0
- ✓ Supabase JS
- ✓ Google Fonts (Inter)

---

## Testes Funcionais

### Teste 1: Formulário Básico (Grupo B)
```
Entrada:
- Nome: João Silva
- Consumo: 500 kWh/mês
- Tarifa: R$ 0,95/kWh
- Iluminação: R$ 0,00

Resultado Esperado:
- Potência: ~4,42 kWp
- Placas: 8 unidades
- Investimento: ~R$ 19.900,00
- Economia Mensal: ~R$ 380,00
- Payback: ~4,4 anos
```

### Teste 2: Formulário Avançado (Grupo A)
```
Entrada:
- Nome: Empresa XYZ Ltda
- Grupo: A (Industrial)
- Consumo Ponta: 200 kWh
- Tarifa Ponta: R$ 1,25/kWh
- Consumo Fora Ponta: 800 kWh
- Tarifa Fora Ponta: R$ 0,65/kWh
- Demanda: 50 kW
- Tarifa Demanda: R$ 30,00/kW

Resultado Esperado:
- Potência: ~8,85 kWp
- Placas: 15 unidades
- Investimento: ~R$ 39.800,00
- Economia Mensal: ~R$ 770,00
- Payback: ~4,3 anos
```

### Teste 3: Gráficos
```
Passos:
1. Gerar proposta com dados do Teste 1
2. Scroll até a seção de gráficos
3. Verificar gráfico de barras (COM vs SEM solar)
4. Verificar gráfico de linha (Economia acumulada)

Validação:
✓ Gráfico de barras mostra barras vermelhas e verdes
✓ Gráfico de linha mostra curva crescente azul
✓ Tooltips funcionam ao passar o mouse
✓ Valores são exibidos em formato de moeda (R$)
```

### Teste 4: Opções de Financiamento
```
Validação:
✓ Card "Cartão de Crédito" exibe 21 parcelas
✓ Card "Boleto Bancário" exibe entrada de 20%
✓ Card "Financiamento BV" exibe 60 parcelas
✓ Valores das parcelas são calculados corretamente
```

### Teste 5: Impressão / PDF
```
Passos:
1. Gerar proposta completa
2. Clicar em "Imprimir / Salvar PDF"
3. Verificar visualização de impressão

Validação:
✓ Formulário de entrada está oculto
✓ Resultados estão visíveis
✓ Cores dos cards são preservadas
✓ Gráficos aparecem corretamente
✓ Layout está organizado
✓ Não há quebras de página inadequadas
```

---

## Testes de Integração

### Teste 6: Conexão com Supabase
```
Cenário 1: Supabase Conectado
- Status: Verde ✅
- Mensagem: "Conectado ao Supabase - Parâmetros atualizados"
- Valores usados: Da tabela parametros_gerais

Cenário 2: Supabase Desconectado
- Status: Amarelo ⚠️
- Mensagem: "Usando valores padrão - Supabase não conectado"
- Valores usados: CONFIG_PADRAO do código
```

### Teste 7: Parâmetros Configuráveis
```
SQL:
UPDATE parametros_gerais 
SET fator_irradiacao = 120.0,
    preco_kwp_base = 5000.00
WHERE id = 1;

Validação:
1. Recarregar página
2. Gerar nova proposta
3. Verificar se cálculos usam novos valores
✓ Fator de irradiação: 120.0
✓ Preço por kWp: R$ 5.000,00
```

---

## Testes de Responsividade

### Teste 8: Desktop (1920x1080)
```
✓ Layout em 4 colunas (cards principais)
✓ Formulário em 3 colunas
✓ Gráficos lado a lado
✓ Todos os elementos visíveis
✓ Sem overflow horizontal
```

### Teste 9: Tablet (768x1024)
```
✓ Layout em 2 colunas (cards principais)
✓ Formulário em 2 colunas
✓ Gráficos empilhados verticalmente
✓ Botões mantêm tamanho adequado
✓ Texto legível
```

### Teste 10: Mobile (375x667)
```
✓ Layout em 1 coluna (cards principais)
✓ Formulário em 1 coluna
✓ Gráficos empilhados
✓ Botões ocupam largura total
✓ Touch-friendly (elementos grandes o suficiente)
```

---

## Testes de Validação

### Teste 11: Campos Obrigatórios
```
Tentativa 1: Gerar proposta sem preencher nome
Esperado: ✓ Alerta "Por favor, preencha o nome do cliente"

Tentativa 2: Gerar proposta sem consumo
Esperado: ✓ Alerta "Por favor, informe o consumo total mensal"

Tentativa 3: Gerar proposta com campos vazios (Grupo A)
Esperado: ✓ Alerta "Por favor, preencha os consumos de ponta e fora ponta"
```

### Teste 12: Valores Numéricos
```
Teste: Inserir valores inválidos
- Consumo: "abc"
- Tarifa: "-1.5"

Esperado: 
✓ Campos numéricos bloqueiam texto
✓ Valores negativos são tratados
✓ Validação HTML5 funciona (type="number", min="0")
```

---

## Testes de Cálculo

### Teste 13: Precisão dos Cálculos
```javascript
// Entrada de referência
const consumo = 500; // kWh/mês
const tarifa = 0.95; // R$/kWh
const fatorIrradiacao = 113.0;
const potenciaPlaca = 625; // W
const precoKwp = 4500.00;

// Cálculos esperados
const potencia = 500 / 113 = 4.42 kWp
const placas = Math.ceil(4.42 * 1000 / 625) = 8 unidades
const potenciaFinal = 8 * 625 / 1000 = 5.00 kWp
const investimento = 5.00 * 4500 = 22.500,00
const economiaMensal = (500 - 100) * 0.95 = 380,00
const payback = 22500 / (380 * 12) = 4.9 anos

Validação:
✓ Potência calculada = 5.00 kWp (±0.01)
✓ Placas = 8 unidades
✓ Investimento = R$ 22.500,00 (±1.00)
✓ Economia = R$ 380,00 (±1.00)
✓ Payback = 4.9 anos (±0.1)
```

### Teste 14: Projeção de 5 Anos
```javascript
// Com economia mensal de R$ 380,00 e inflação de 5%

Ano 1: 380 * 12 = 4.560,00 | Acum: 4.560,00
Ano 2: 380 * 1.05 * 12 = 4.788,00 | Acum: 9.348,00
Ano 3: 380 * 1.1025 * 12 = 5.027,40 | Acum: 14.375,40
Ano 4: 380 * 1.1576 * 12 = 5.278,77 | Acum: 19.654,17
Ano 5: 380 * 1.2155 * 12 = 5.542,71 | Acum: 25.196,88

Validação:
✓ Valores crescem ~5% ao ano
✓ Economia acumulada no ano 5 > investimento inicial
✓ Gráfico de linha mostra curva ascendente
```

---

## Testes de Performance

### Teste 15: Tempo de Carregamento
```
Medida com DevTools (Network tab):
✓ Tailwind CSS: < 100ms
✓ Chart.js: < 200ms
✓ Supabase JS: < 150ms
✓ Total FCP (First Contentful Paint): < 1s
✓ Total LCP (Largest Contentful Paint): < 2s
```

### Teste 16: Geração de Proposta
```
Medida com console.time():
✓ Cálculos: < 50ms
✓ Renderização de resultados: < 100ms
✓ Geração de gráficos: < 500ms
✓ Total: < 1 segundo
```

---

## Checklist Final de Aceitação

### Interface
- [ ] Design moderno e profissional
- [ ] Cores seguem paleta VOLTTAIC
- [ ] Fonte Inter carregada corretamente
- [ ] Cards com gradientes funcionando
- [ ] Ícones exibidos corretamente

### Funcionalidades
- [ ] Formulário completo e funcional
- [ ] Toggle Grupo A/B funcionando
- [ ] Cálculos precisos e validados
- [ ] Gráficos renderizando corretamente
- [ ] Financiamento com 3 opções
- [ ] Impressão/PDF otimizada

### Integração
- [ ] Supabase conectando
- [ ] Parâmetros sendo carregados
- [ ] Fallback funcionando
- [ ] Status visual correto

### Responsividade
- [ ] Desktop (1920px) ✓
- [ ] Laptop (1280px) ✓
- [ ] Tablet (768px) ✓
- [ ] Mobile (375px) ✓

### Documentação
- [ ] README.md completo
- [ ] FEATURES.md detalhado
- [ ] database-schema.sql documentado
- [ ] Código comentado

### Qualidade
- [ ] Sem erros no console
- [ ] Sem warnings de segurança
- [ ] CodeQL passou (0 alertas)
- [ ] Code review aprovado

---

## Bugs Conhecidos

### Limitações Atuais:
1. ⚠️ **Gráficos em impressão**: Podem não aparecer em alguns navegadores antigos
   - **Solução**: Usar Chrome/Edge com "Gráficos de fundo" ativado

2. ⚠️ **Supabase timeout**: Se a conexão for muito lenta, pode demorar para carregar
   - **Solução**: Sistema usa fallback automático após timeout

3. ℹ️ **Valores arredondados**: Alguns cálculos podem ter diferenças de centavos
   - **Causa**: Arredondamento de ponto flutuante em JavaScript
   - **Impacto**: Desprezível (< R$ 0,10)

---

## Relatório de Testes

Data: ____/____/______  
Testador: _______________________  
Versão: 2.0.0 (VOLTTAIC Style)

| Teste | Status | Observações |
|-------|--------|-------------|
| Teste 1 | ☐ PASS ☐ FAIL | |
| Teste 2 | ☐ PASS ☐ FAIL | |
| Teste 3 | ☐ PASS ☐ FAIL | |
| Teste 4 | ☐ PASS ☐ FAIL | |
| Teste 5 | ☐ PASS ☐ FAIL | |
| Teste 6 | ☐ PASS ☐ FAIL | |
| Teste 7 | ☐ PASS ☐ FAIL | |
| Teste 8 | ☐ PASS ☐ FAIL | |
| Teste 9 | ☐ PASS ☐ FAIL | |
| Teste 10 | ☐ PASS ☐ FAIL | |
| Teste 11 | ☐ PASS ☐ FAIL | |
| Teste 12 | ☐ PASS ☐ FAIL | |
| Teste 13 | ☐ PASS ☐ FAIL | |
| Teste 14 | ☐ PASS ☐ FAIL | |
| Teste 15 | ☐ PASS ☐ FAIL | |
| Teste 16 | ☐ PASS ☐ FAIL | |

**Resultado Final:** ☐ APROVADO ☐ REPROVADO

---

**Assinatura:** _______________________  
**Data:** ____/____/______
