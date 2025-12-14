/* ========================================
   CONFIGURAÇÃO DO SUPABASE
======================================== */

// ⚠️ SUAS CREDENCIAIS DO SUPABASE
const SUPABASE_URL = 'https://xurlxquvsdjrjpikrsta.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmx4cXV2c2RqcmpwaWtyc3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NzcxNTcsImV4cCI6MjA4MTI1MzE1N30.zqa-dSNhha8B6XEvgGxAVuoIxqGpNNGbuFiVmQC9ltM';

// Cliente Supabase (será inicializado)
let supabaseClient;

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
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        return false;
    }
}

// Inicializar automaticamente quando a página carregar
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initSupabase();
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
}
