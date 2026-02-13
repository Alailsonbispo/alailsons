/**
 * Portfolio Alailson Bispo
 * JavaScript com funcionalidades essenciais
 */

// Configurações
const CONFIG = {
    typewriterSpeed: 30,
    recadosCooldown: 5000, // 5 segundos entre recados
    maxRecados: 50,
    storageKey: 'recados_portfolio'
};

// Estado da aplicação
let canSubmitRecado = true;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Inicializa todas as funcionalidades
 */
function initializeApp() {
    initTypewriter();
    initXPProgress();
    initRecados();
    initKonamiCode();
    initFormValidation();
    initCharacterCounter();
}

/* ========== 1. EFEITO TYPEWRITER ========== */
function initTypewriter() {
    const element = document.querySelector('.subtitle');
    if (!element) return;
    
    const originalText = element.innerHTML;
    
    // Limpa o conteúdo
    element.innerHTML = '';
    element.style.visibility = 'visible';
    
    let i = 0;
    const speed = CONFIG.typewriterSpeed;
    
    function typeNextChar() {
        if (i < originalText.length) {
            // Verifica se é uma tag HTML
            if (originalText[i] === '<') {
                // Encontra o fim da tag
                const tagEnd = originalText.indexOf('>', i);
                element.innerHTML += originalText.substring(i, tagEnd + 1);
                i = tagEnd + 1;
            } else {
                element.innerHTML += originalText[i];
                i++;
            }
            
            // Adiciona cursor piscante
            element.innerHTML += '<span class="cursor">|</span>';
            
            setTimeout(typeNextChar, speed);
        } else {
            // Remove o cursor final
            element.innerHTML = originalText;
        }
    }
    
    // Começa após um pequeno delay
    setTimeout(typeNextChar, 500);
}

/* ========== 2. BARRA DE PROGRESSO XP ========== */
function initXPProgress() {
    const fill = document.querySelector('.xp-fill');
    const text = document.querySelector('.xp-text');
    
    if (!fill || !text) return;
    
    // Dados do curso
    const progressData = {
        totalDisciplinas: 40,
        disciplinasConcluidas: 18,
        semestreAtual: 5,
        totalSemestres: 6
    };
    
    // Calcula progresso
    const progresso = Math.min(
        100,
        Math.round(
            (progressData.disciplinasConcluidas / progressData.totalDisciplinas * 70) +
            (progressData.semestreAtual / progressData.totalSemestres * 30)
        )
    );
    
    // Atualiza ARIA label
    const bar = document.querySelector('.xp-bar');
    if (bar) {
        bar.setAttribute('aria-valuenow', progresso);
    }
    
    // Animação
    setTimeout(() => {
        fill.style.width = progresso + '%';
        
        let currentProgress = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        function updateProgress(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            currentProgress = Math.round(easeOutQuart * progresso);
            
            text.textContent = `ADS ${progressData.semestreAtual}º Semestre • Progresso: ${currentProgress}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            } else {
                text.textContent = `ADS ${progressData.semestreAtual}º Semestre • Progresso: ${progresso}%`;
            }
        }
        
        requestAnimationFrame(updateProgress);
    }, 1000);
}

/* ========== 3. SISTEMA DE RECADOS ========== */
function initRecados() {
    const form = document.getElementById('recadoForm');
    const list = document.getElementById('listaRecados');
    
    if (!form || !list) return;
    
    let storage = loadRecados();
    
    function loadRecados() {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
        } catch (e) {
            console.error('Erro ao carregar recados:', e);
            return [];
        }
    }
    
    function saveRecados(recados) {
        try {
            if (recados.length > CONFIG.maxRecados) {
                recados = recados.slice(0, CONFIG.maxRecados);
            }
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(recados));
        } catch (e) {
            console.error('Erro ao salvar recados:', e);
            showToast('Não foi possível salvar o recado.');
        }
    }
    
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    function formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'agora mesmo';
        if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
        if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
        
        return new Date(timestamp).toLocaleDateString('pt-BR');
    }
    
    function renderRecados() {
        if (storage.length === 0) {
            list.innerHTML = '<p class="empty-message">Nenhum recado ainda. Seja o primeiro!</p>';
            return;
        }
        
        list.innerHTML = storage.map(recado => `
            <div class="recado-item">
                <strong>${escapeHTML(recado.nome)}</strong>
                <p>${escapeHTML(recado.msg)}</p>
                <small>${formatRelativeTime(recado.timestamp)}</small>
            </div>
        `).join('');
    }
    
    renderRecados();
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const msg = document.getElementById('mensagem').value.trim();
        
        if (!validateForm(nome, msg)) {
            return;
        }
        
        if (!canSubmitRecado) {
            showToast('Aguarde alguns segundos antes de enviar outro recado');
            return;
        }
        
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        btn.classList.add('loading');
        canSubmitRecado = false;
        
        // Simula envio
        setTimeout(() => {
            storage.unshift({ 
                nome, 
                msg, 
                timestamp: Date.now() 
            });
            
            saveRecados(storage);
            renderRecados();
            form.reset();
            
            showToast('Recado enviado com sucesso!');
            
            btn.disabled = false;
            btn.textContent = originalText;
            btn.classList.remove('loading');
            
            setTimeout(() => {
                canSubmitRecado = true;
            }, CONFIG.recadosCooldown);
            
        }, 1000);
    });
}

/* ========== 4. KONAMI CODE (EASTER EGG) ========== */
function initKonamiCode() {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown