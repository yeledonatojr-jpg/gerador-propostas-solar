/* ========================================
   ENGINE DE CÁLCULOS E GERAÇÃO DE PROPOSTA
======================================== */

// Variáveis globais para armazenar resultados
let resultadosAtuais = null;

/* ========================================
   FUNÇÕES DE DIMENSIONAMENTO
======================================== */

// Calcular dimensionamento do sistema
function calcularDimensionamento(consumoMensal, grupoTarifario) {
    const params = window.parametrosGerais || {
        fator_irradiacao: 113.0,
        potencia_placa_wp: 625,
        preco_kwp_base: 4500.00
    };

    // Consumo compensável (descontar mínimo de 100 kWh para Grupo B)
    let consumoCompensavel = consumoMensal;
    if (grupoTarifario !== 'A') {
        consumoCompensavel = Math.max(0, consumoMensal - 100);
    }

    // Potência necessária (kWp) = consumo_mensal / fator_irradiação
    const potenciaKwp = consumoMensal / params.fator_irradiacao;

    // Quantidade de placas
    const quantidadePlacas = Math.ceil((potenciaKwp * 1000) / params.potencia_placa_wp);

    // Potência final instalada
    const potenciaFinal = (quantidadePlacas * params.potencia_placa_wp) / 1000;

    // Geração mensal estimada
    const geracaoMensal = potenciaFinal * params.fator_irradiacao;

    // Área necessária (assumindo ~2 m² por placa de 600W)
    const areaNecessaria = quantidadePlacas * 2;

    return {
        potenciaKwp: potenciaFinal,
        quantidadePlacas: quantidadePlacas,
        geracaoMensal: geracaoMensal,
        areaNecessaria: areaNecessaria,
        consumoCompensavel: consumoCompensavel
    };
}

/* ========================================
   CÁLCULOS FINANCEIROS
======================================== */

// Calcular economia e payback
function calcularEconomia(dados, dimensionamento) {
    const params = window.parametrosGerais || {
        preco_kwp_base: 4500.00,
        inflacao_anual_energia: 0.05
    };

    // Custo do sistema
    let investimentoTotal = dimensionamento.potenciaKwp * params.preco_kwp_base;
    
    // Adicionar outros valores se houver
    if (dados.outrosValores) {
        investimentoTotal += parseFloat(dados.outrosValores) || 0;
    }

    // Calcular economia mensal baseado no grupo tarifário
    let economiaMensal = 0;
    let gastoAtual = 0;
    let gastoPosSolar = 0;

    if (dados.grupoTarifario === 'A') {
        // Grupo A: considerar ponta e fora ponta
        const economiaConsumo = (parseFloat(dados.consumoPonta || 0) * parseFloat(dados.tarifaPonta || 0)) +
                                (parseFloat(dados.consumoForaPonta || 0) * parseFloat(dados.tarifaForaPonta || 0));
        
        const custoDemanda = (parseFloat(dados.demandaContratada || 0) * parseFloat(dados.tarifaDemanda || 0));
        
        gastoAtual = economiaConsumo + custoDemanda;
        gastoPosSolar = custoDemanda; // Apenas demanda permanece
        economiaMensal = economiaConsumo;
    } else {
        // Grupo B: cálculo simples
        const consumoTotal = parseFloat(dados.consumoTotal || 0);
        const tarifaConsumo = parseFloat(dados.tarifaConsumo || 0);
        const custoIluminacao = parseFloat(dados.custoIluminacao || 0);
        
        gastoAtual = (consumoTotal * tarifaConsumo) + custoIluminacao;
        gastoPosSolar = (100 * tarifaConsumo) + custoIluminacao; // Consumo mínimo
        economiaMensal = gastoAtual - gastoPosSolar;
    }

    // Economia anual
    const economiaAnual = economiaMensal * 12;

    // Percentual de economia
    const percentualEconomia = gastoAtual > 0 ? ((gastoAtual - gastoPosSolar) / gastoAtual) * 100 : 0;

    // Payback simples (anos)
    const payback = economiaAnual > 0 ? investimentoTotal / economiaAnual : 0;

    // Projeção de 5 anos com inflação energética
    const projecao5Anos = calcularProjecao5Anos(economiaMensal, params.inflacao_anual_energia);

    return {
        investimentoTotal: investimentoTotal,
        economiaMensal: economiaMensal,
        economiaAnual: economiaAnual,
        percentualEconomia: percentualEconomia,
        payback: payback,
        gastoAtual: gastoAtual,
        gastoPosSolar: gastoPosSolar,
        projecao5Anos: projecao5Anos
    };
}

// Calcular projeção de economia para 5 anos
function calcularProjecao5Anos(economiaMensal, inflacaoAnual) {
    const projecao = [];
    let economiaAcumulada = 0;
    
    for (let ano = 1; ano <= 5; ano++) {
        // Economia mensal com inflação acumulada
        const fatorInflacao = Math.pow(1 + inflacaoAnual, ano - 1);
        const economiaMensalAno = economiaMensal * fatorInflacao;
        const economiaAnualAno = economiaMensalAno * 12;
        
        economiaAcumulada += economiaAnualAno;
        
        projecao.push({
            ano: ano,
            economiaMensal: economiaMensalAno,
            economiaAnual: economiaAnualAno,
            economiaAcumulada: economiaAcumulada
        });
    }
    
    return projecao;
}

// Calcular parcelas de financiamento
function calcularFinanciamento(investimento) {
    const opcoes = [];

    // Opção 1: Cartão de Crédito (até 6 cartões, 21 meses)
    opcoes.push({
        tipo: 'Cartão de Crédito',
        descricao: 'Até 6 cartões diferentes',
        parcelas: 21,
        valorParcela: investimento / 21,
        observacao: 'Parcelamento direto, sem juros'
    });

    // Opção 2: Boleto Bancário
    const entrada = investimento * 0.20; // 20% de entrada
    const saldo = investimento - entrada;
    opcoes.push({
        tipo: 'Boleto Bancário',
        descricao: 'Sistema de entradas parceladas',
        entrada: entrada,
        saldo: saldo,
        parcelas: 10,
        valorParcela: saldo / 10,
        observacao: '20% de entrada + 10x sem juros'
    });

    // Opção 3: Financiamento BV (60 meses, carência 90 dias)
    const taxaMensal = 0.0149; // 1.49% a.m.
    const parcelas60 = 60;
    const valorParcela60 = investimento * (taxaMensal * Math.pow(1 + taxaMensal, parcelas60)) / 
                          (Math.pow(1 + taxaMensal, parcelas60) - 1);
    
    opcoes.push({
        tipo: 'Financiamento BV',
        descricao: '60 meses com carência de 90 dias',
        parcelas: parcelas60,
        valorParcela: valorParcela60,
        carencia: '90 dias',
        observacao: 'Sujeito a análise de crédito'
    });

    return opcoes;
}

/* ========================================
   GERAÇÃO DE GRÁFICOS
======================================== */

// Criar gráfico de comparação de custos
function criarGraficoComparacao(projecao5Anos, gastoAtual) {
    const ctx = document.getElementById('graficoComparacao');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (window.graficoComparacao) {
        window.graficoComparacao.destroy();
    }

    const anos = projecao5Anos.map(p => `Ano ${p.ano}`);
    const custosSemSolar = projecao5Anos.map((p, i) => gastoAtual * 12 * Math.pow(1.05, i));
    const custosComSolar = projecao5Anos.map(() => gastoAtual * 12 * 0.1); // ~10% do custo original

    window.graficoComparacao = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anos,
            datasets: [
                {
                    label: 'SEM Energia Solar',
                    data: custosSemSolar,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                },
                {
                    label: 'COM Energia Solar',
                    data: custosComSolar,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparativo de Custos Anuais',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatarMoeda(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + formatarNumero(value, 0);
                        }
                    }
                }
            }
        }
    });
}

// Criar gráfico de economia acumulada
function criarGraficoEconomia(projecao5Anos) {
    const ctx = document.getElementById('graficoEconomia');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (window.graficoEconomia) {
        window.graficoEconomia.destroy();
    }

    const anos = projecao5Anos.map(p => `Ano ${p.ano}`);
    const economiaAcumulada = projecao5Anos.map(p => p.economiaAcumulada);

    window.graficoEconomia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos,
            datasets: [{
                label: 'Economia Acumulada',
                data: economiaAcumulada,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Economia Acumulada - Projeção 5 Anos',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Economia: ' + formatarMoeda(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + formatarNumero(value, 0);
                        }
                    }
                }
            }
        }
    });
}

/* ========================================
   FUNÇÃO PRINCIPAL DE GERAÇÃO DE PROPOSTA
======================================== */

function gerarProposta() {
    try {
        // Validar dados do cliente
        const nomeCliente = document.getElementById('nome-cliente').value;
        if (!nomeCliente || nomeCliente.trim() === '') {
            alert('⚠️ Por favor, preencha o nome do cliente.');
            document.getElementById('nome-cliente').focus();
            return;
        }

        // Obter grupo tarifário
        const grupoTarifario = document.getElementById('grupo-tarifario').value;

        // Coletar dados do formulário
        const dados = coletarDadosFormulario(grupoTarifario);
        
        if (!dados) return; // Validação falhou

        // Calcular dimensionamento
        const consumoTotal = grupoTarifario === 'A' 
            ? parseFloat(dados.consumoPonta || 0) + parseFloat(dados.consumoForaPonta || 0)
            : parseFloat(dados.consumoTotal || 0);

        const dimensionamento = calcularDimensionamento(consumoTotal, grupoTarifario);

        // Calcular economia e financeiro
        const economia = calcularEconomia(dados, dimensionamento);

        // Calcular opções de financiamento
        const financiamento = calcularFinanciamento(economia.investimentoTotal);

        // Armazenar resultados
        resultadosAtuais = {
            cliente: dados.cliente,
            grupoTarifario: grupoTarifario,
            dimensionamento: dimensionamento,
            economia: economia,
            financiamento: financiamento,
            equipamentos: dados.equipamentos,
            dataGeracao: new Date().toLocaleDateString('pt-BR')
        };

        // Exibir resultados na tela
        exibirResultadosProposta(resultadosAtuais);

        // Gerar gráficos
        setTimeout(() => {
            criarGraficoComparacao(economia.projecao5Anos, economia.gastoAtual);
            criarGraficoEconomia(economia.projecao5Anos);
        }, 100);

        // Scroll para resultados
        scrollParaElemento('secao-resultados');

    } catch (error) {
        console.error('❌ Erro ao gerar proposta:', error);
        alert('Erro ao gerar proposta. Verifique os dados e tente novamente.');
    }
}

// Coletar dados do formulário
function coletarDadosFormulario(grupoTarifario) {
    const dados = {
        cliente: {
            nome: document.getElementById('nome-cliente').value,
            empresa: document.getElementById('empresa-cliente')?.value || '',
            cpfCnpj: document.getElementById('cpf-cnpj')?.value || '',
            telefone: document.getElementById('telefone-cliente')?.value || '',
            email: document.getElementById('email-cliente')?.value || ''
        },
        grupoTarifario: grupoTarifario,
        equipamentos: {
            modeloModulo: window.parametrosGerais?.modelo_modulo || 'YHSUNPRO TOPCon BIFACIAL 620-635W',
            modeloInversor: window.parametrosGerais?.modelo_inversor || 'SAJ 30K-220V',
            estrutura: window.parametrosGerais?.estrutura || 'Fibrocimento'
        }
    };

    if (grupoTarifario === 'A') {
        // Validar Grupo A
        const consumoPonta = document.getElementById('consumo-ponta')?.value;
        const consumoForaPonta = document.getElementById('consumo-fora-ponta')?.value;
        
        if (!consumoPonta || !consumoForaPonta) {
            alert('⚠️ Por favor, preencha os consumos de ponta e fora ponta.');
            return null;
        }

        dados.consumoPonta = consumoPonta;
        dados.tarifaPonta = document.getElementById('tarifa-ponta')?.value || 1.25;
        dados.consumoForaPonta = consumoForaPonta;
        dados.tarifaForaPonta = document.getElementById('tarifa-fora-ponta')?.value || 0.65;
        dados.demandaContratada = document.getElementById('demanda-contratada')?.value || 0;
        dados.tarifaDemanda = document.getElementById('tarifa-demanda')?.value || 0;
    } else {
        // Validar Grupo B
        const consumoTotal = document.getElementById('consumo-total')?.value;
        
        if (!consumoTotal) {
            alert('⚠️ Por favor, preencha o consumo total mensal.');
            return null;
        }

        dados.consumoTotal = consumoTotal;
        dados.tarifaConsumo = document.getElementById('tarifa-consumo')?.value || 0.95;
        dados.custoIluminacao = document.getElementById('custo-iluminacao')?.value || 0;
    }

    dados.outrosValores = document.getElementById('outros-valores')?.value || 0;

    return dados;
}

// Exibir resultados na tela
function exibirResultadosProposta(resultados) {
    // Mostrar seção de resultados
    const secaoResultados = document.getElementById('secao-resultados');
    if (secaoResultados) {
        secaoResultados.style.display = 'block';
    }

    // Atualizar cards principais
    if (document.getElementById('card-investimento')) {
        document.getElementById('card-investimento').textContent = formatarMoeda(resultados.economia.investimentoTotal);
    }
    if (document.getElementById('card-economia')) {
        document.getElementById('card-economia').textContent = formatarMoeda(resultados.economia.economiaMensal);
    }
    if (document.getElementById('card-reducao')) {
        document.getElementById('card-reducao').textContent = formatarNumero(resultados.economia.percentualEconomia, 1) + '%';
    }
    if (document.getElementById('card-payback')) {
        document.getElementById('card-payback').textContent = formatarNumero(resultados.economia.payback, 1) + ' anos';
    }

    // Atualizar detalhes técnicos
    atualizarDetalhesTecnicos(resultados);

    // Atualizar opções de financiamento
    atualizarFinanciamento(resultados.financiamento);

    // Atualizar informações do cliente no cabeçalho
    atualizarCabecalhoCliente(resultados.cliente, resultados.dataGeracao);
}

// Atualizar detalhes técnicos
function atualizarDetalhesTecnicos(resultados) {
    const detalhes = [
        { id: 'det-potencia', valor: formatarNumero(resultados.dimensionamento.potenciaKwp, 2) + ' kWp' },
        { id: 'det-geracao', valor: formatarNumero(resultados.dimensionamento.geracaoMensal, 0) + ' kWh/mês' },
        { id: 'det-placas', valor: resultados.dimensionamento.quantidadePlacas + ' unidades' },
        { id: 'det-area', valor: formatarNumero(resultados.dimensionamento.areaNecessaria, 0) + ' m²' },
        { id: 'det-modulo', valor: resultados.equipamentos.modeloModulo },
        { id: 'det-inversor', valor: resultados.equipamentos.modeloInversor },
        { id: 'det-estrutura', valor: resultados.equipamentos.estrutura }
    ];

    detalhes.forEach(item => {
        const elemento = document.getElementById(item.id);
        if (elemento) {
            elemento.textContent = item.valor;
        }
    });
}

// Atualizar opções de financiamento
function atualizarFinanciamento(opcoes) {
    opcoes.forEach((opcao, index) => {
        const prefixo = `fin-${index + 1}`;
        
        const elementos = {
            [`${prefixo}-tipo`]: opcao.tipo,
            [`${prefixo}-descricao`]: opcao.descricao,
            [`${prefixo}-parcelas`]: opcao.parcelas + 'x',
            [`${prefixo}-valor`]: formatarMoeda(opcao.valorParcela),
            [`${prefixo}-obs`]: opcao.observacao
        };

        Object.keys(elementos).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = elementos[id];
            }
        });

        // Informações extras para boleto
        if (opcao.entrada) {
            const elemEntrada = document.getElementById(`${prefixo}-entrada`);
            if (elemEntrada) {
                elemEntrada.textContent = formatarMoeda(opcao.entrada);
            }
        }
    });
}

// Atualizar cabeçalho com informações do cliente
function atualizarCabecalhoCliente(cliente, dataGeracao) {
    const mapeamento = {
        'header-nome-cliente': cliente.nome,
        'header-empresa-cliente': cliente.empresa || 'N/A',
        'header-data-proposta': dataGeracao
    };

    Object.keys(mapeamento).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = mapeamento[id];
        }
    });
}

/* ========================================
   EXPORTAR PARA USO GLOBAL
======================================== */

if (typeof window !== 'undefined') {
    window.gerarProposta = gerarProposta;
    window.resultadosAtuais = resultadosAtuais;
    window.calcularDimensionamento = calcularDimensionamento;
    window.calcularEconomia = calcularEconomia;
    window.calcularFinanciamento = calcularFinanciamento;
}
