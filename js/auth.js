/* ========================================
   SISTEMA DE AUTENTICAÇÃO
======================================== */

// Fazer login
async function fazerLogin() {
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;
    
    // Validações
    if (campoVazio(email) || campoVazio(senha)) {
        mostrarErro('Por favor, preencha e-mail e senha.', 'login-erro');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarErro('E-mail inválido.', 'login-erro');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });
        
        if (error) throw error;
        
        console.log('✅ Login realizado com sucesso!', data);
        mostrarSucesso('Login realizado com sucesso!', 'login-erro');
        
        // Aguardar um momento e carregar configurações
        await aguardar(1000);
        await carregarConfiguracoes();
        
    } catch (error) {
        console.error('❌ Erro no login:', error);
        mostrarErro(`Erro ao fazer login: ${error.message}`, 'login-erro');
    }
}

// Fazer logout
async function fazerLogout() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        
        if (error) throw error;
        
        console.log('✅ Logout realizado');
        
        // Esconder formulário de configurações
        document.getElementById('config-form').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
        
        // Limpar campos
        document.getElementById('email-login').value = '';
        document.getElementById('senha-login').value = '';
        
        mostrarSucesso('Logout realizado com sucesso!', 'login-erro');
        
    } catch (error) {
        console.error('❌ Erro ao fazer logout:', error);
        mostrarErro(`Erro ao fazer logout: ${error.message}`, 'config-mensagem');
    }
}

// Carregar configurações do usuário
async function carregarConfiguracoes() {
    try {
        const user = await obterUsuarioAtual();
        
        if (!user) {
            console.log('⚠️ Usuário não autenticado');
            return;
        }
        
        console.log('👤 Usuário autenticado:', user.email);
        
        // Buscar configurações do banco
        const { data, error } = await supabase
            .from('configuracoes')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        // Se encontrou configurações, preencher formulário
        if (data) {
            console.log('✅ Configurações carregadas:', data);
            preencherFormularioConfig(data);
        } else {
            console.log('ℹ️ Nenhuma configuração encontrada.  Usando valores padrão.');
        }
        
        // Mostrar formulário de configurações
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('config-form').style.display = 'block';
        
        // Carregar kits
        await carregarKits();
        
    } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error);
        mostrarErro(`Erro ao carregar configurações: ${error.message}`, 'config-mensagem');
    }
}

// Preencher formulário com configurações
function preencherFormularioConfig(config) {
    // Dados da empresa
    document.getElementById('cfg-nome-empresa').value = config.nome_empresa || '';
    document.getElementById('cfg-cnpj').value = config.cnpj || '';
    document.getElementById('cfg-telefone').value = config.telefone || '';
    document.getElementById('cfg-email').value = config.email || '';
    document.getElementById('cfg-endereco').value = config.endereco || '';
    
    // Parâmetros técnicos
    document.getElementById('cfg-fator-irradiacao').value = config.fator_irradiacao || 113;
    document.getElementById('cfg-potencia-placa').value = config.potencia_placa || 625;
    document.getElementById('cfg-eficiencia-sistema').value = config.eficiencia_sistema || 80;
    
    // Parâmetros financeiros
    document.getElementById('cfg-preco-kwp-base').value = config.preco_kwp_base || 2450;
    document.getElementById('cfg-tarifa-b-padrao').value = config.tarifa_b_padrao || 0.95;
    document.getElementById('cfg-tarifa-ponta-padrao').value = config.tarifa_ponta_padrao || 1.25;
    document.getElementById('cfg-tarifa-fora-ponta-padrao').value = config.tarifa_fora_ponta_padrao || 0.65;
    document.getElementById('cfg-reajuste-anual').value = config.reajuste_anual || 8.5;
    document.getElementById('cfg-taxa-juros').value = config.taxa_juros || 1.49;
}

// Salvar configurações
async function salvarConfiguracoes() {
    try {
        const user = await obterUsuarioAtual();
        
        if (!user) {
            mostrarErro('Você precisa estar autenticado para salvar.', 'config-mensagem');
            return;
        }
        
        // Coletar dados do formulário
        const configuracoes = {
            user_id: user.id,
            nome_empresa: document.getElementById('cfg-nome-empresa').value,
            cnpj: document.getElementById('cfg-cnpj').value,
            telefone: document.getElementById('cfg-telefone').value,
            email: document.getElementById('cfg-email').value,
            endereco: document.getElementById('cfg-endereco').value,
            fator_irradiacao: parseFloat(document.getElementById('cfg-fator-irradiacao').value),
            potencia_placa: parseFloat(document.getElementById('cfg-potencia-placa').value),
            eficiencia_sistema: parseFloat(document.getElementById('cfg-eficiencia-sistema').value),
            preco_kwp_base: parseFloat(document.getElementById('cfg-preco-kwp-base').value),
            tarifa_b_padrao: parseFloat(document.getElementById('cfg-tarifa-b-padrao').value),
            tarifa_ponta_padrao: parseFloat(document.getElementById('cfg-tarifa-ponta-padrao').value),
            tarifa_fora_ponta_padrao: parseFloat(document.getElementById('cfg-tarifa-fora-ponta-padrao').value),
            reajuste_anual: parseFloat(document.getElementById('cfg-reajuste-anual').value),
            taxa_juros: parseFloat(document.getElementById('cfg-taxa-juros').value),
            updated_at: new Date().toISOString()
        };
        
        // Tentar atualizar ou inserir
        const { data, error } = await supabase
            .from('configuracoes')
            .upsert(configuracoes, { onConflict: 'user_id' })
            .select();
        
        if (error) throw error;
        
        console.log('✅ Configurações salvas:', data);
        mostrarSucesso('Configurações salvas com sucesso!', 'config-mensagem');
        
    } catch (error) {
        console.error('❌ Erro ao salvar configurações:', error);
        mostrarErro(`Erro ao salvar:  ${error.message}`, 'config-mensagem');
    }
}

// Carregar kits do usuário
async function carregarKits() {
    try {
        const user = await obterUsuarioAtual();
        
        if (!user) return;
        
        const { data, error } = await supabase
            .from('kits')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        exibirKits(data || []);
        
    } catch (error) {
        console.error('❌ Erro ao carregar kits:', error);
        mostrarErro(`Erro ao carregar kits: ${error.message}`, 'config-mensagem');
    }
}

// Exibir kits na interface
function exibirKits(kits) {
    const container = document.getElementById('kits-lista');
    
    if (kits.length === 0) {
        container.innerHTML = '<p class="texto-vazio">Nenhum kit cadastrado ainda.</p>';
        return;
    }
    
    container.innerHTML = kits.map(kit => `
        <div class="kit-card">
            <h4>${kit.nome}</h4>
            <p><strong>Potência:</strong> ${kit.potencia_kwp} kWp</p>
            <p><strong>Inversor:</strong> ${kit.modelo_inversor || 'Não especificado'}</p>
            <p><strong>Estrutura:</strong> ${kit.tipo_estrutura || 'Não especificado'}</p>
            <p><strong>Preço:</strong> ${formatarMoeda(kit.preco_total)}</p>
            <div class="kit-acoes">
                <button class="btn btn-secondary" onclick="editarKit(${kit.id})">✏️ Editar</button>
                <button class="btn btn-secondary" onclick="excluirKit(${kit.id})">🗑️ Excluir</button>
            </div>
        </div>
    `).join('');
}

// Mostrar formulário de novo kit
function mostrarFormularioKit() {
    document.getElementById('form-novo-kit').style.display = 'block';
    document.getElementById('kit-nome').focus();
}

// Cancelar formulário de kit
function cancelarFormularioKit() {
    document.getElementById('form-novo-kit').style.display = 'none';
    limparFormularioKit();
}

// Limpar formulário de kit
function limparFormularioKit() {
    document.getElementById('kit-nome').value = '';
    document.getElementById('kit-potencia').value = '';
    document.getElementById('kit-inversor').value = '';
    document.getElementById('kit-estrutura').value = 'Fibrocimento';
    document.getElementById('kit-preco').value = '';
}

// Salvar kit
async function salvarKit() {
    try {
        const user = await obterUsuarioAtual();
        
        if (!user) {
            mostrarErro('Você precisa estar autenticado.', 'config-mensagem');
            return;
        }
        
        const nome = document.getElementById('kit-nome').value;
        const potencia = parseFloat(document.getElementById('kit-potencia').value);
        const inversor = document.getElementById('kit-inversor').value;
        const estrutura = document.getElementById('kit-estrutura').value;
        const preco = parseFloat(document.getElementById('kit-preco').value);
        
        if (campoVazio(nome) || !potencia || !preco) {
            mostrarErro('Preencha todos os campos obrigatórios.', 'config-mensagem');
            return;
        }
        
        const kit = {
            user_id: user.id,
            nome: nome,
            potencia_kwp: potencia,
            modelo_inversor: inversor,
            tipo_estrutura: estrutura,
            preco_total: preco,
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
            .from('kits')
            .insert([kit])
            .select();
        
        if (error) throw error;
        
        console.log('✅ Kit salvo:', data);
        mostrarSucesso('Kit cadastrado com sucesso!', 'config-mensagem');
        
        cancelarFormularioKit();
        await carregarKits();
        
    } catch (error) {
        console.error('❌ Erro ao salvar kit:', error);
        mostrarErro(`Erro ao salvar kit: ${error.message}`, 'config-mensagem');
    }
}

// Excluir kit
async function excluirKit(kitId) {
    if (!confirm('Tem certeza que deseja excluir este kit?')) return;
    
    try {
        const { error } = await supabase
            .from('kits')
            .delete()
            .eq('id', kitId);
        
        if (error) throw error;
        
        console.log('✅ Kit excluído');
        mostrarSucesso('Kit excluído com sucesso!', 'config-mensagem');
        
        await carregarKits();
        
    } catch (error) {
        console.error('❌ Erro ao excluir kit:', error);
        mostrarErro(`Erro ao excluir kit: ${error.message}`, 'config-mensagem');
    }
}

// Verificar autenticação ao carregar página
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        if (window.location.pathname.includes('config.html')) {
            const session = await verificarAutenticacao();
            if (session) {
                await carregarConfiguracoes();
            }
        }
    });
}
