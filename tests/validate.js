#!/usr/bin/env node

/**
 * Script de validação básica do sistema
 * Verifica se os arquivos principais existem e estão corretos
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando validação do sistema...\n');

let hasErrors = false;

// Arquivos que devem existir
const requiredFiles = [
    'index.html',
    'config.html',
    'js/proposta.js',
    'js/supabase-config.js',
    'js/utils.js',
    'js/script.js',
    'database-schema.sql',
    'README.md'
];

// Verificar arquivos obrigatórios
console.log('📁 Verificando arquivos obrigatórios...');
requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - AUSENTE!`);
        hasErrors = true;
    }
});

// Verificar sintaxe dos arquivos JavaScript
console.log('\n🔧 Verificando sintaxe JavaScript...');
const jsFiles = [
    'js/proposta.js',
    'js/supabase-config.js',
    'js/utils.js',
    'js/script.js'
];

const { execSync } = require('child_process');

jsFiles.forEach(file => {
    try {
        execSync(`node --check ${file}`, { stdio: 'pipe' });
        console.log(`  ✅ ${file} - Sintaxe válida`);
    } catch (error) {
        console.log(`  ❌ ${file} - Erro de sintaxe!`);
        console.log(`     ${error.message}`);
        hasErrors = true;
    }
});

// Verificar se index.html tem as dependências necessárias
console.log('\n📦 Verificando dependências no index.html...');
const indexContent = fs.readFileSync('index.html', 'utf8');

const dependencies = [
    { name: 'Tailwind CSS', pattern: /tailwindcss\.com/ },
    { name: 'Chart.js', pattern: /chart\.js/ },
    { name: 'Supabase', pattern: /@supabase\/supabase-js/ },
    { name: 'Google Fonts (Inter)', pattern: /fonts\.googleapis\.com.*Inter/ }
];

dependencies.forEach(dep => {
    if (dep.pattern.test(indexContent)) {
        console.log(`  ✅ ${dep.name}`);
    } else {
        console.log(`  ⚠️  ${dep.name} - Não encontrado!`);
    }
});

// Verificar se os scripts são carregados na ordem correta
console.log('\n🔄 Verificando ordem de carregamento dos scripts...');
const scriptOrder = [
    'supabase-config.js',
    'utils.js',
    'proposta.js',
    'script.js'
];

let lastIndex = -1;
let orderCorrect = true;

scriptOrder.forEach(script => {
    const index = indexContent.indexOf(`src="js/${script}"`);
    if (index === -1) {
        console.log(`  ⚠️  ${script} - Não encontrado no HTML!`);
        orderCorrect = false;
    } else if (index < lastIndex) {
        console.log(`  ❌ ${script} - Ordem incorreta!`);
        orderCorrect = false;
    } else {
        lastIndex = index;
    }
});

if (orderCorrect) {
    console.log('  ✅ Scripts carregados na ordem correta');
}

// Resumo
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ VALIDAÇÃO FALHOU - Corrija os erros acima');
    process.exit(1);
} else {
    console.log('✅ VALIDAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('\n🚀 Sistema pronto para uso!');
    console.log('   Execute "npm start" para iniciar o servidor');
    process.exit(0);
}
