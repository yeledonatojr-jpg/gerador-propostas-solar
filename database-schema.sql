-- ========================================
-- SCHEMA DO BANCO DE DADOS SUPABASE
-- Sistema de Geração de Propostas Solar
-- ========================================

-- Tabela de Parâmetros Gerais do Sistema
-- Armazena configurações globais que afetam todos os cálculos
CREATE TABLE IF NOT EXISTS parametros_gerais (
  id INTEGER PRIMARY KEY,
  
  -- Parâmetros Técnicos
  fator_irradiacao DECIMAL(10,2) DEFAULT 113.0 
    COMMENT 'Fator de irradiação solar médio da região (kWh/kWp/mês)',
  
  potencia_placa_wp INTEGER DEFAULT 625 
    COMMENT 'Potência nominal das placas solares em Watts',
  
  -- Parâmetros Financeiros
  preco_kwp_base DECIMAL(10,2) DEFAULT 4500.00 
    COMMENT 'Preço base por kWp instalado em Reais',
  
  inflacao_anual_energia DECIMAL(5,4) DEFAULT 0.0500 
    COMMENT 'Taxa de inflação energética anual (5% = 0.0500)',
  
  -- Parâmetros Comerciais
  validade_proposta INTEGER DEFAULT 10 
    COMMENT 'Validade da proposta em dias',
  
  nome_representante TEXT DEFAULT 'Donato Junior' 
    COMMENT 'Nome do representante comercial padrão',
  
  -- Especificações de Equipamentos
  modelo_modulo TEXT DEFAULT 'YHSUNPRO TOPCon BIFACIAL 620-635W' 
    COMMENT 'Modelo padrão dos módulos fotovoltaicos',
  
  modelo_inversor TEXT DEFAULT 'SAJ 30K-220V' 
    COMMENT 'Modelo padrão do inversor solar',
  
  estrutura TEXT DEFAULT 'Fibrocimento' 
    COMMENT 'Tipo de estrutura de fixação padrão',
  
  -- Metadados
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir valores padrão iniciais
INSERT INTO parametros_gerais (
  id, 
  fator_irradiacao, 
  potencia_placa_wp, 
  preco_kwp_base, 
  validade_proposta,
  modelo_modulo,
  modelo_inversor,
  estrutura,
  nome_representante,
  inflacao_anual_energia
) VALUES (
  1,                                          -- ID único
  113.0,                                      -- Irradiação média Brasil
  625,                                        -- Placas de 625W
  4500.00,                                    -- R$ 4.500,00 por kWp
  10,                                         -- 10 dias de validade
  'YHSUNPRO TOPCon BIFACIAL 620-635W',      -- Módulo TOPCon
  'SAJ 30K-220V',                            -- Inversor SAJ
  'Fibrocimento',                            -- Estrutura padrão
  'Donato Junior',                           -- Representante
  0.0500                                     -- 5% de inflação anual
)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- COMENTÁRIOS E NOTAS
-- ========================================

-- FATOR DE IRRADIAÇÃO:
-- Representa a média de energia solar recebida na região em kWh/kWp/mês
-- Valores típicos no Brasil:
--   - Sul: 100-120 kWh/kWp/mês
--   - Sudeste: 110-130 kWh/kWp/mês
--   - Centro-Oeste: 120-140 kWh/kWp/mês
--   - Nordeste: 130-160 kWh/kWp/mês
--   - Norte: 110-130 kWh/kWp/mês

-- PREÇO BASE POR kWp:
-- Inclui equipamentos + instalação + homologação
-- Varia conforme:
--   - Potência total do sistema (quanto maior, menor o custo por kWp)
--   - Complexidade da instalação
--   - Região do Brasil
--   - Tipo de estrutura
-- Valores médios em 2024:
--   - Residencial: R$ 4.000 - R$ 5.500 por kWp
--   - Comercial: R$ 3.800 - R$ 5.000 por kWp
--   - Industrial: R$ 3.500 - R$ 4.800 por kWp

-- INFLAÇÃO ENERGÉTICA:
-- Taxa média de reajuste anual das tarifas de energia elétrica
-- Histórico Brasil (últimos 10 anos): 5-12% a.a.
-- Valor conservador recomendado: 5% (0.0500)

-- ========================================
-- QUERIES ÚTEIS
-- ========================================

-- Consultar parâmetros atuais
-- SELECT * FROM parametros_gerais WHERE id = 1;

-- Atualizar fator de irradiação
-- UPDATE parametros_gerais SET fator_irradiacao = 120.0 WHERE id = 1;

-- Atualizar preço base
-- UPDATE parametros_gerais SET preco_kwp_base = 4800.00 WHERE id = 1;

-- Atualizar modelo de equipamento
-- UPDATE parametros_gerais 
-- SET modelo_modulo = 'NOVO MODELO 650W' 
-- WHERE id = 1;

-- ========================================
-- ÍNDICES (OPCIONAL)
-- ========================================

-- Como só há um registro, índices não são necessários
-- Mas poderia ser útil se houver múltiplas configurações regionais

-- CREATE INDEX idx_parametros_updated ON parametros_gerais(updated_at);

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Habilitar RLS na tabela
-- ALTER TABLE parametros_gerais ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (para o frontend)
-- CREATE POLICY "Permitir leitura pública" 
-- ON parametros_gerais FOR SELECT 
-- USING (true);

-- Permitir atualização apenas para usuários autenticados
-- CREATE POLICY "Permitir atualização autenticada" 
-- ON parametros_gerais FOR UPDATE 
-- USING (auth.role() = 'authenticated');

-- ========================================
-- BACKUP E RESTAURAÇÃO
-- ========================================

-- Fazer backup dos parâmetros
-- COPY parametros_gerais TO '/tmp/parametros_backup.csv' WITH CSV HEADER;

-- Restaurar de backup
-- COPY parametros_gerais FROM '/tmp/parametros_backup.csv' WITH CSV HEADER;
