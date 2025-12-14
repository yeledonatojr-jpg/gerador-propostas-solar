/* ========================================
   FUNÇÕES UTILITÁRIAS
======================================== */

// Formatar valores em Real (R$)
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Formatar números com separador de milhares
function formatarNumero(numero, casasDecimais = 2) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: casasDecimais,
        maximumFractionDigits: casasDecimais
    }).format(numero);
}

// Validar e-mail
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf. substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf. substring(10, 11))) return false;
    
    return true;
}

// Validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos. charAt(1)) return false;
    
    return true;
}

// Formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar CNPJ
function formatarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Formatar Telefone
function formatarTelefone(telefone) {
    telefone = telefone.replace(/[^\d]/g, '');
    
    if (telefone.length === 11) {
        return telefone. replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
}

// Mostrar mensagem de sucesso
function mostrarSucesso(mensagem, elementoId = 'mensagem') {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.className = 'mensagem-sucesso';
        elemento.innerHTML = `✅ ${mensagem}`;
        elemento.style.display = 'block';
        
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Mostrar mensagem de erro
function mostrarErro(mensagem, elementoId = 'mensagem') {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.className = 'mensagem-erro';
        elemento.innerHTML = `❌ ${mensagem}`;
        elemento.style.display = 'block';
        
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Limpar formulário
function limparFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Scroll suave para elemento
function scrollParaElemento(elementoId) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Debounce (evitar múltiplas chamadas)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Copiar texto para área de transferência
async function copiarParaClipboard(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        return true;
    } catch (error) {
        console.error('Erro ao copiar:', error);
        return false;
    }
}

// Baixar arquivo
function baixarArquivo(conteudo, nomeArquivo, tipo = 'text/plain') {
    const blob = new Blob([conteudo], { type: tipo });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Obter data atual formatada
function obterDataAtual() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Converter data ISO para BR
function converterDataISO(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Aguardar (promise delay)
function aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Verificar se campo está vazio
function campoVazio(valor) {
    return !valor || valor.trim() === '';
}

// Sanitizar input (prevenir XSS básico)
function sanitizarInput(texto) {
    const elemento = document.createElement('div');
    elemento.textContent = texto;
    return elemento.innerHTML;
}

// Calcular porcentagem
function calcularPorcentagem(valor, total) {
    if (total === 0) return 0;
    return (valor / total) * 100;
}

// Arredondar para n casas decimais
function arredondar(numero, casas = 2) {
    return Math.round(numero * Math.pow(10, casas)) / Math.pow(10, casas);
}

/* ========================================
   EXPORTAR FUNÇÕES GLOBALMENTE
======================================== */

if (typeof window !== 'undefined') {
    window.formatarMoeda = formatarMoeda;
    window.formatarNumero = formatarNumero;
    window.validarEmail = validarEmail;
    window.validarCPF = validarCPF;
    window.validarCNPJ = validarCNPJ;
    window.formatarCPF = formatarCPF;
    window.formatarCNPJ = formatarCNPJ;
    window.formatarTelefone = formatarTelefone;
    window.mostrarSucesso = mostrarSucesso;
    window.mostrarErro = mostrarErro;
    window.limparFormulario = limparFormulario;
    window.scrollParaElemento = scrollParaElemento;
    window.debounce = debounce;
    window.copiarParaClipboard = copiarParaClipboard;
    window.baixarArquivo = baixarArquivo;
    window.obterDataAtual = obterDataAtual;
    window.converterDataISO = converterDataISO;
    window.aguardar = aguardar;
    window.campoVazio = campoVazio;
    window.sanitizarInput = sanitizarInput;
    window.calcularPorcentagem = calcularPorcentagem;
    window.arredondar = arredondar;
}
