/* ========================================
   LÓGICA PRINCIPAL DO GERADOR DE PROPOSTAS
======================================== */

// Variáveis globais de configuração
let CONFIG = {
    fatorIrradiacao: 113,
    potenciaPlaca: 625,
    eficienciaSistema: 80,
    precoKwpBase:  2450,
    tarifaBPadrao: 0.95,
    tarifaPontaPadrao: 1.25,
    tarifaForaPontaPadrao: 0.65,
    reajusteAnual: 8.5,
    taxaJuros: 1.49
};

// Carregar configurações do Supabase (se estiver autenticado)
async function carregarConfiguracoesGlobais() {
    try {
        const user = await obterUsuarioAtual();
        
        if (!user) {
            console.log('ℹ️ Usando configurações padrão (usuário não autenticado)');
            return;
        }
        
        const { data, error } = await supabase
            .from('configuracoes')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        if (data) {
            CONFIG = {
                fatorIrradiacao: data.fator_irradiacao || 113,
                potenciaPlaca: data.potencia_placa || 625,
                eficienciaSistema: data.eficiencia_sistema || 80,
                precoKwpBase: data.preco_kwp_base || 2450,
                tarifaBPadrao: data.tarifa_b_padrao || 0.95,
                tarifaPontaPadrao: data.tarifa_ponta_padrao || 1.25,
                tarifaForaPontaPadrao: data.tarifa_fora_ponta_padrao || 0.65,
                reajusteAnual: data.reajuste_anual || 8.5,
                taxaJuros: data.taxa_juros || 1.49
            };
            console.log('✅ Configurações personalizadas carregadas');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error);
    }
}

// Alternar campos de acordo com o grupo tarifário
function alternarCamposGrupo() {
    const grupoSelecionado = document.getElementById('grupo-tarifario').value;
    const camposB = document.getElementById('campos-grupo-b');
    const camposA = document.getElementById('campos-grupo-a');
    
    if (grupoSelecionado === 'A') {
        camposB.style.display = 'none';
        camposA.style.display = 'block';
    } else {
        camposB.style.display = 'block';
        camposA.style.display = 'none';
    }
}

// Toggle desconto
function toggleDesconto() {
    const checkbox = document.getElementById('aplicar-desconto');
    const campoDesconto = document.getElementById('campo-desconto');
    
    if (checkbox.checked) {
        campoDesconto.style.display = 'block';
    } else {
        campoDesconto.style.display = 'none';
        document.getElementById('percentual-desconto').value = 0;
        document.getElementById('valor-desconto-fixo').value = 0;
    }
}

// Calcular proposta
function calcularProposta() {
    try {
        // Validar dados do cliente
        const nomeCliente = document.getElementById('nome-cliente').value;
        if (campoVazio(nomeCliente)) {
            alert('⚠️ Por favor, preencha o nome do cliente.');
            document.getElementById('nome-cliente').focus();
            return;
        }
        
        // Obter grupo tarifário
        const grupoTarifario = document.getElementById('grupo-tarifario').value;
        
        let resultados;
        
        if (grupoTarifario === 'A') {
            resultados = calcularGrupoA();
        } else {
            resultados = calcularGrupoB();
        }
        
        if (! resultados) return;
        
        // Exibir resultados
        exibirResultados(resultados);
        
        // Scroll para resultados
        scrollParaElemento('visao-geral-resultados');
        
    } catch (error) {
        console.error('❌ Erro ao calcular proposta:', error);
        alert('Erro ao calcular proposta.  Verifique os dados e tente novamente.');
    }
}

// Calcular para Grupo B
function calcularGrupoB() {
    const consumoTotal = parseFloat(document.getElementById('consumo-total').value);
    const tarifaConsumo = parseFloat(document.getElementById('tarifa-consumo').value);
    const custoIluminacao = parseFloat(document.getElementById('custo-iluminacao').value) || 0;
    
    // Validações
    if (! consumoTotal || consumoTotal <= 0) {
        alert('⚠️ Por favor, informe o consumo total mensal.');
        document.getElementById('consumo-total').focus();
        return null;
    }
    
    if (! tarifaConsumo || tarifaConsumo <= 0) {
        alert('⚠️ Por favor, informe a tarifa de consumo.');
        document.getElementById('tarifa-consumo').focus();
        return null;
    }
    
    // Cálculo do dimensionamento
    const consumoCompensavel = consumoTotal - 100; // Descontar consumo mínimo
    const geracaoNecessaria = consumoCompensavel * 1.1; // 10% de margem
    
    // Potência necessária (kWp)
    const potenciaKwp = (geracaoNecessaria * 1000) / (CONFIG.fatorIrradiacao * (CONFIG.eficienciaSistema / 100));
    
    // Quantidade de placas
    const quantidadePlacas = Math.ceil((potenciaKwp * 1000) / CONFIG.potenciaPlaca);
    
    // Potência real instalada
    const potenciaReal = (quantidadePlacas * CONFIG.potenciaPlaca) / 1000;
    
    // Custo do sistema
    const outrosValores = parseFloat(document.getElementById('outros-valores').value) || 0;
    let investimentoTotal = (potenciaReal * CONFIG.precoKwpBase) + outrosValores;
    
    // Aplicar desconto se houver
    const descontoAplicado = calcularDesconto(investimentoTotal);
    investimentoTotal = descontoAplicado.valorFinal;
    
    // Economia mensal
    const economiaMensal = consumoCompensavel * tarifaConsumo;
    
    // Percentual de economia
    const gastoAtual = (consumoTotal * tarifaConsumo) + custoIluminacao;
    const gastoFuturo = (100 * tarifaConsumo) + custoIluminacao;
    const percentualEconomia = ((gastoAtual - gastoFuturo) / gastoAtual) * 100;
    
    // Payback
    const paybackAnos = investimentoTotal / (economiaMensal * 12);
    
    return {
        grupoTarifario: document.getElementById('grupo-tarifario').options[document.getElementById('grupo-tarifario').selectedIndex].text,
        potenciaKwp: potenciaReal,
        quantidadePlacas: quantidadePlacas,
        investimentoTotal: investimentoTotal,
        economiaMensal: economiaMensal,
        percentualEconomia: percentualEconomia,
        paybackAnos: paybackAnos,
        modeloInversor: document.getElementById('modelo-inversor').value || 'Não especificado',
        tipoEstrutura: document.getElementById('tipo-estrutura').value,
        desconto: descontoAplicado
    };
}

// Calcular para Grupo A
function calcularGrupoA() {
    const consumoPonta = parseFloat(document.getElementById('consumo-ponta').value);
    const tarifaPonta = parseFloat(document.getElementById('tarifa-ponta').value);
    const consumoForaPonta = parseFloat(document.getElementById('consumo-fora-ponta').value);
    const tarifaForaPonta = parseFloat(document.getElementById('tarifa-fora-ponta').value);
    const demandaContratada = parseFloat(document.getElementById('demanda-contratada').value) || 0;
    const tarifaDemanda = parseFloat(document.getElementById('tarifa-demanda').value) || 0;
    
    // Validações
    if (!consumoPonta || ! consumoForaPonta) {
        alert('⚠️ Por favor, informe o consumo ponta e fora ponta.');
        return null;
    }
    
    if (!tarifaPonta || !tarifaForaPonta) {
        alert('⚠️ Por favor, informe as tarifas.');
        return null;
    }
    
    // Consumo total
    const consumoTotal = consumoPonta + consumoForaPonta;
    
    // Geração necessária (assumindo que 70% da geração é fora ponta)
    const geracaoNecessaria = consumoTotal * 1.1;
    
    // Potência necessária (kWp)
    const potenciaKwp = (geracaoNecessaria * 1000) / (CONFIG.fatorIrradiacao * (CONFIG.eficienciaSistema / 100));
    
    // Quantidade de placas
    const quantidadePlacas = Math.ceil((potenciaKwp * 1000) / CONFIG.potenciaPlaca);
    
    // Potência real instalada
    const potenciaReal = (quantidadePlacas * CONFIG.potenciaPlaca) / 1000;
    
    // Custo do sistema
    const outrosValores = parseFloat(document.getElementById('outros-valores').value) || 0;
    let investimentoTotal = (potenciaReal * CONFIG.precoKwpBase) + outrosValores;
    
    // Aplicar desconto se houver
    const descontoAplicado = calcularDesconto(investimentoTotal);
    investimentoTotal = descontoAplicado.valorFinal;
    
    // Economia mensal (ponta + fora ponta)
    const economiaPonta = consumoPonta * tarifaPonta;
    const economiaForaPonta = consumoForaPonta * tarifaForaPonta;
    const economiaMensal = economiaPonta + economiaForaPonta;
    
    // Gasto atual vs futuro
    const gastoAtual = economiaMensal + (demandaContratada * tarifaDemanda);
    const gastoFuturo = demandaContratada * tarifaDemanda; // Apenas demanda
    const percentualEconomia = ((gastoAtual - gastoFuturo) / gastoAtual) * 100;
    
    // Payback
    const paybackAnos = investimentoTotal / (economiaMensal * 12);
    
    return {
        grupoTarifario: document.getElementById('grupo-tarifario').options[document.getElementById('grupo-tarifario').selectedIndex].text,
        potenciaKwp:  potenciaReal,
        quantidadePlacas: quantidadePlacas,
        investimentoTotal: investimentoTotal,
        economiaMensal: economiaMensal,
        percentualEconomia: percentualEconomia,
        paybackAnos: paybackAnos,
        modeloInversor: document.getElementById('modelo-inversor').value || 'Não especificado',
        tipoEstrutura: document.getElementById('tipo-estrutura').value,
        desconto: descontoAplicado
    };
}

// Calcular desconto
function calcularDesconto(valorOriginal) {
    const aplicarDesconto = document.getElementById('aplicar-desconto').checked;
    
    if (!aplicarDesconto) {
        return {
            aplicado: false,
            tipo: null,
            valor: 0,
            percentual: 0,
            valorFinal: valorOriginal
        };
    }
    
    const valorDescontoFixo = parseFloat(document.getElementById('valor-desconto-fixo').value) || 0;
    const percentualDesconto = parseFloat(document.getElementById('percentual-desconto').value) || 0;
    
    let valorDesconto = 0;
    let tipo = '';
    
    // Prioridade: valor fixo > percentual
    if (valorDescontoFixo > 0) {
        valorDesconto = valorDescontoFixo;
        tipo = 'fixo';
    } else if (percentualDesconto > 0) {
        valorDesconto = (valorOriginal * percentualDesconto) / 100;
        tipo = 'percentual';
    }
    
    const valorFinal = valorOriginal - valorDesconto;
    const percentualReal = (valorDesconto / valorOriginal) * 100;
    
    return {
        aplicado: true,
        tipo: tipo,
        valor: valorDesconto,
        percentual: percentualReal,
        valorFinal: valorFinal
    };
}

// Exibir resultados
function exibirResultados(resultados) {
    // Cards principais
    document.getElementById('res-investimento').textContent = formatarMoeda(resultados.investimentoTotal);
    document.getElementById('res-economia-mensal').textContent = formatarMoeda(resultados.economiaMensal);
    document.getElementById('res-percentual-economia').textContent = formatarNumero(resultados.percentualEconomia, 1) + '%';
    document.getElementById('res-payback').textContent = formatarNumero(resultados.paybackAnos, 1) + ' Anos';
    
    // Nota de investimento (com desconto se aplicável)
    if (resultados.desconto.aplicado) {
        const textoDesconto = resultados.desconto.tipo === 'fixo' 
            ? `Desconto de ${formatarMoeda(resultados.desconto.valor)} aplicado`
            : `Desconto de ${formatarNumero(resultados.desconto.percentual, 1)}% aplicado`;
        document.getElementById('nota-investimento').textContent = textoDesconto;
    } else {
        document.getElementById('nota-investimento').textContent = 'Kit Usina + Instalação';
    }
    
    // Detalhes técnicos
    document.getElementById('det-potencia').textContent = formatarNumero(resultados.potenciaKwp, 2) + ' kWp';
    document.getElementById('det-placas').textContent = resultados.quantidadePlacas + ' unidades';
    document.getElementById('det-inversor').textContent = resultados.modeloInversor;
    document.getElementById('det-estrutura').textContent = resultados.tipoEstrutura;
    document.getElementById('det-grupo').textContent = resultados.grupoTarifario;
    
    // Mostrar seção de resultados
    document.getElementById('visao-geral-resultados').style.display = 'block';
}

// Nova proposta
function novaProposta() {
    if (confirm('Deseja limpar todos os campos e iniciar uma nova proposta?')) {
        // Limpar formulário principal
        document.getElementById('nome-cliente').value = '';
        document.getElementById('empresa-cliente').value = '';
        document.getElementById('cpf-cnpj').value = '';
        document.getElementById('telefone-cliente').value = '';
        document.getElementById('representante').value = '';
        
        // Resetar data para hoje
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('data-proposta').value = hoje;
        
        // Limpar campos grupo B
        document.getElementById('consumo-total').value = '';
        document.getElementById('tarifa-consumo').value = CONFIG.tarifaBPadrao;
        document.getElementById('custo-iluminacao').value = 0;
        
        // Limpar campos grupo A
        document.getElementById('consumo-ponta').value = '';
        document.getElementById('tarifa-ponta').value = CONFIG.tarifaPontaPadrao;
        document.getElementById('consumo-fora-ponta').value = '';
        document.getElementById('tarifa-fora-ponta').value = CONFIG.tarifaForaPontaPadrao;
        document.getElementById('demanda-contratada').value = '';
        document.getElementById('tarifa-demanda').value = '';
        
        // Limpar especificações
        document.getElementById('modelo-inversor').value = '';
        document.getElementById('tipo-estrutura').value = 'Fibrocimento';
        document.getElementById('outros-valores').value = 0;
        
        // Limpar desconto
        document.getElementById('aplicar-desconto').checked = false;
        document.getElementById('campo-desconto').style.display = 'none';
        document.getElementById('percentual-desconto').value = 0;
        document.getElementById('valor-desconto-fixo').value = 0;
        
        // Ocultar resultados
        document.getElementById('visao-geral-resultados').style.display = 'none';
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Focar no nome do cliente
        document.getElementById('nome-cliente').focus();
    }
}

// Gerar PDF
function gerarPDF() {
    alert('🚧 Funcionalidade de geração de PDF em desenvolvimento!\n\nPor enquanto, use a opção de Imprimir e salve como PDF através do navegador.');
}

// Carregar configurações ao iniciar a página
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        await carregarConfiguracoesGlobais();
    });
}

