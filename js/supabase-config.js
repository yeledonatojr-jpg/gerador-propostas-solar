/* ========================================
   CONFIGURAÇÃO DO SUPABASE
======================================== */

// ⚠️ SUAS CREDENCIAIS DO SUPABASE
const SUPABASE_URL = 'https://xurlxquvsdjrjpikrsta.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmx4cXV2c2RqcmpwaWtyc3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NzcxNTcsImV4cCI6MjA4MTI1MzE1N30.zqa-dSNhha8B6XEvgGxAVuoIxqGpNNGbuFiVmQC9ltM';

// Cliente Supabase (será inicializado)
let supabaseClient;

// Parâmetros globais (fallback se Supabase falhar)
let parametrosGerais = {
    fator_irradiacao: 113.0,
    potencia_placa_wp: 625,
    preco_kwp_base: 4500.00,
    validade_proposta: 10,
    modelo_modulo: 'YHSUNPRO TOPCon BIFACIAL 620-635W',
    modelo_inversor: 'SAJ 30K-220V',
    estrutura: 'Fibrocimento',
    nome_representante: 'Donato Junior',
    inflacao_anual_energia: 0.0500
};

// Status da conexão
let supabaseConectado = false;

// Função para inicializar o Supabase
function initSupabase() {
    try {
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Biblioteca do Supabase não carregada!');
            return false;
        }

        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Disponibilizar globalmente
        if (typeof window !== 'undefined') {
            window.supabaseClient = supabaseClient;
        }
        
        console.log('✅ Supabase inicializado com sucesso!');
        supabaseConectado = true;
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        supabaseConectado = false;
        return false;
    }
}

// Carregar parâmetros gerais do Supabase
async function carregarParametrosGerais() {
    if (!supabaseConectado) {
        console.log('ℹ️ Usando parâmetros padrão (Supabase não conectado)');
        atualizarStatusConexao('warning', 'Usando valores padrão - Supabase não conectado');
        return parametrosGerais;
    }

    try {
        const { data, error } = await supabaseClient
            .from('parametros_gerais')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('⚠️ Erro ao buscar parâmetros:', error);
            atualizarStatusConexao('warning', 'Usando valores padrão - Tabela não encontrada');
            return parametrosGerais;
        }

        if (data) {
            parametrosGerais = {
                fator_irradiacao: data.fator_irradiacao || 113.0,
                potencia_placa_wp: data.potencia_placa_wp || 625,
                preco_kwp_base: data.preco_kwp_base || 4500.00,
                validade_proposta: data.validade_proposta || 10,
                modelo_modulo: data.modelo_modulo || 'YHSUNPRO TOPCon BIFACIAL 620-635W',
                modelo_inversor: data.modelo_inversor || 'SAJ 30K-220V',
                estrutura: data.estrutura || 'Fibrocimento',
                nome_representante: data.nome_representante || 'Donato Junior',
                inflacao_anual_energia: data.inflacao_anual_energia || 0.0500
            };
            console.log('✅ Parâmetros carregados do Supabase:', parametrosGerais);
            atualizarStatusConexao('success', 'Conectado ao Supabase - Parâmetros atualizados');
        }

        return parametrosGerais;
    } catch (error) {
        console.error('❌ Erro ao carregar parâmetros:', error);
        atualizarStatusConexao('error', 'Erro ao conectar - Usando valores padrão');
        return parametrosGerais;
    }
}

// Atualizar status visual de conexão
function atualizarStatusConexao(tipo, mensagem) {
    const statusElement = document.getElementById('supabase-status');
    if (statusElement) {
        const cores = {
            success: 'bg-green-100 text-green-800 border-green-300',
            warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            error: 'bg-red-100 text-red-800 border-red-300'
        };
        
        const icones = {
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        statusElement.className = `p-3 rounded-lg border ${cores[tipo] || cores.warning} mb-4`;
        statusElement.innerHTML = `${icones[tipo] || '⚠️'} ${mensagem}`;
    }
}

// Inicializar automaticamente quando a página carregar
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        initSupabase();
        await carregarParametrosGerais();
    });
}

/* ========================================
   FUNÇÕES AUXILIARES DO SUPABASE
======================================== */

// Verificar se o usuário está autenticado
async function verificarAutenticacao() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return session;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return null;
    }
}

// Obter usuário atual
async function obterUsuarioAtual() {
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
}

// Fazer logout
async function realizarLogout() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        console.log('✅ Logout realizado com sucesso');
        return true;
    } catch (error) {
        console.error('❌ Erro ao fazer logout:', error);
        return false;
    }
}

/* ========================================
   EXPORTAR PARA USO GLOBAL
======================================== */

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.verificarAutenticacao = verificarAutenticacao;
    window.obterUsuarioAtual = obterUsuarioAtual;
    window.realizarLogout = realizarLogout;
    window.carregarParametrosGerais = carregarParametrosGerais;
    window.parametrosGerais = parametrosGerais;
}
