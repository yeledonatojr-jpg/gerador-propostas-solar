# 🌞 Gerador de Propostas Solar - VOLTTAIC Style

Sistema profissional e completo para geração de propostas comerciais de energia solar fotovoltaica com cálculos automáticos, interface moderna, visualizações gráficas e integração com Supabase.

## ✨ Funcionalidades Principais

### 🎨 Interface e Design
- ✅ **Tailwind CSS**: Design moderno, responsivo e profissional
- ✅ **Fonte Inter**: Tipografia limpa e moderna
- ✅ **Paleta de cores temática**:
  - 🔵 Azul: Investimento/Técnico
  - 🟢 Verde: Economia/Sustentabilidade  
  - 🟡 Amarelo: Percentuais/Redução
  - 🟠 Laranja: Payback/ROI
- ✅ **Cards informativos destacados** com gradientes e ícones
- ✅ **Layout responsivo** para desktop, tablet e mobile

### 📊 Funcionalidades de Cálculo
- ✅ **Múltiplos Grupos Tarifários**: Grupo B, B-Optante e Grupo A (Industrial)
- ✅ **Dimensionamento automático**:
  - Potência do sistema (kWp)
  - Quantidade de placas solares
  - Geração mensal estimada (kWh)
  - Área necessária (m²)
- ✅ **Cálculos financeiros avançados**:
  - Investimento total
  - Economia mensal e anual
  - Percentual de economia
  - Payback (retorno do investimento)
  - Projeção financeira de 5 anos com inflação energética

### 📈 Visualizações com Chart.js
- ✅ **Gráfico de Barras**: Comparativo de custos anuais (COM x SEM energia solar)
- ✅ **Gráfico de Linha**: Economia acumulada projetada ao longo de 5 anos
- ✅ Legendas, tooltips informativos e cores temáticas

### 🔧 Detalhes Técnicos
- ✅ Especificações completas da usina solar
- ✅ Informações sobre equipamentos (módulos e inversores)
- ✅ Garantias detalhadas (30 anos eficiência, 25 anos fabricação, 10 anos inversor)
- ✅ Tipo de estrutura de fixação

### 💳 Opções de Financiamento
- ✅ **Cartão de Crédito**: Até 6 cartões, parcelamento em 21 meses
- ✅ **Boleto Bancário**: Sistema de entrada + parcelamento (20% + 10x)
- ✅ **Financiamento BV**: 60 meses com carência de 90 dias
- ✅ Cálculo automático de parcelas

### 📄 Geração de PDF / Impressão
- ✅ Layout otimizado para impressão
- ✅ Elementos de formulário ocultos automaticamente
- ✅ Quebras de página adequadas
- ✅ Cores e logos preservados na impressão
- ✅ Rodapé com informações de contato e validade

### 🗄️ Integração com Supabase
- ✅ Conexão com banco de dados Supabase
- ✅ Parâmetros configuráveis na tabela `parametros_gerais`:
  - Fator de irradiação solar
  - Potência das placas (Wp)
  - Preço base por kWp
  - Validade da proposta
  - Modelos de equipamentos
  - Taxa de inflação energética
- ✅ Fallback para valores padrão caso conexão falhe
- ✅ Status visual de conexão com alertas coloridos

### ✅ Escopo e Prazos
- ✅ **Serviços INCLUÍDOS**: Dimensionamento, projeto, equipamentos, instalação, homologação, monitoramento
- ✅ **Serviços NÃO INCLUÍDOS**: Reforço estrutural, obras civis, reparos elétricos
- ✅ **Prazos médios**: Instalação (30 dias), homologação (45 dias), vistoria (15 dias)

## 🚀 Como Usar

### 1. Configurar o Supabase

Crie uma conta no [Supabase](https://supabase.com) e execute o seguinte SQL:

```sql
CREATE TABLE parametros_gerais (
  id INTEGER PRIMARY KEY,
  fator_irradiacao DECIMAL(10,2) DEFAULT 113.0,
  potencia_placa_wp INTEGER DEFAULT 625,
  preco_kwp_base DECIMAL(10,2) DEFAULT 4500.00,
  validade_proposta INTEGER DEFAULT 10,
  modelo_modulo TEXT DEFAULT 'YHSUNPRO TOPCon BIFACIAL 620-635W',
  modelo_inversor TEXT DEFAULT 'SAJ 30K-220V',
  estrutura TEXT DEFAULT 'Fibrocimento',
  nome_representante TEXT DEFAULT 'Donato Junior',
  inflacao_anual_energia DECIMAL(5,4) DEFAULT 0.0500
);

-- Inserir valores padrão
INSERT INTO parametros_gerais (id, fator_irradiacao, potencia_placa_wp, preco_kwp_base, validade_proposta)
VALUES (1, 113.0, 625, 4500.00, 10);
```

### 2. Configurar Credenciais

Edite o arquivo `js/supabase-config.js` com suas credenciais do Supabase:

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-publica';
```

### 3. Iniciar o Sistema

Abra o arquivo `index.html` em um navegador ou utilize um servidor HTTP local:

```bash
# Python 3
python3 -m http.server 8080

# Node.js (com http-server)
npx http-server -p 8080
```

Acesse: `http://localhost:8080`

### 4. Gerar Propostas

1. Preencha os dados do cliente
2. Selecione o grupo tarifário
3. Informe consumo mensal e tarifas
4. Clique em "🧮 Gerar Proposta"
5. Visualize os resultados, gráficos e detalhes técnicos
6. Use "🖨️ Imprimir / Salvar PDF" para gerar o documento final

## 📁 Estrutura do Projeto

```
/
├── index.html              # Página principal com formulário e resultados
├── config.html             # Página de configurações (mantida do sistema original)
├── README.md               # Documentação
├── css/
│   ├── styles.css         # Estilos customizados (mantido para compatibilidade)
│   └── print.css          # Estilos otimizados para impressão
├── js/
│   ├── proposta.js        # Engine de cálculos e geração de proposta
│   ├── supabase-config.js # Configuração e integração com Supabase
│   ├── utils.js           # Funções utilitárias
│   ├── script.js          # Scripts legados (mantido para compatibilidade)
│   └── auth.js            # Autenticação (sistema original)
└── assets/
    └── images/            # Imagens e logos
```

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **Tailwind CSS 3** - Framework CSS utilitário
- **JavaScript ES6+** - Lógica e cálculos
- **Chart.js 4** - Visualizações gráficas
- **Supabase** - Backend as a Service (BaaS)
- **Google Fonts (Inter)** - Tipografia moderna

## 📐 Fórmulas de Cálculo

### Dimensionamento
```
Potência (kWp) = Consumo Mensal (kWh) / Fator de Irradiação
Quantidade de Placas = ARREDONDAR_PARA_CIMA(Potência * 1000 / Potência da Placa)
Potência Final = (Quantidade de Placas * Potência da Placa) / 1000
Geração Mensal = Potência Final * Fator de Irradiação
```

### Economia
```
Economia Mensal = Gasto Atual - Gasto Pós-Solar
Percentual de Economia = (Economia Mensal / Gasto Atual) * 100
Payback (anos) = Investimento Total / (Economia Mensal * 12)
```

### Projeção 5 Anos
```
Economia Ano N = Economia Base * (1 + Inflação Energética)^(N-1)
Economia Acumulada = Σ (Economia Anual de cada ano)
```

## 🎨 Personalização

### Cores Temáticas
As cores podem ser personalizadas diretamente no HTML usando classes Tailwind:

- Azul: `bg-blue-600`, `from-blue-500 to-blue-700`
- Verde: `bg-green-600`, `from-green-500 to-green-700`
- Amarelo: `bg-yellow-600`, `from-yellow-500 to-yellow-700`
- Laranja: `bg-orange-600`, `from-orange-500 to-orange-700`

### Parâmetros Configuráveis
Todos os parâmetros técnicos e financeiros podem ser ajustados na tabela `parametros_gerais` do Supabase:

- Fator de irradiação solar regional
- Potência das placas (Wp)
- Preço base por kWp instalado
- Taxa de inflação energética anual
- Modelos de equipamentos
- Validade da proposta (dias)

## 🐛 Solução de Problemas

### Parâmetros não carregam do Supabase
- Verifique as credenciais em `js/supabase-config.js`
- Confirme que a tabela `parametros_gerais` existe e tem o registro com `id = 1`
- O sistema usará valores padrão automaticamente se a conexão falhar

### Gráficos não aparecem
- Verifique se o CDN do Chart.js está acessível
- Abra o console do navegador para verificar erros
- Certifique-se de que a proposta foi gerada com sucesso

### Impressão sem cores
- Use Chrome ou Edge para melhor suporte a `print-color-adjust`
- Ative "Gráficos de fundo" nas configurações de impressão do navegador

## 📝 Licença

Este projeto é de uso interno. Todos os direitos reservados.

## 👤 Autor

Desenvolvido para otimizar a geração de propostas comerciais de energia solar fotovoltaica.

## 🆘 Suporte

Para dúvidas ou sugestões, entre em contato através dos canais oficiais da empresa.
    
  
