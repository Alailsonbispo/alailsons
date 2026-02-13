/**
 * Portfolio Alailson Bispo
 * JavaScript otimizado com todas as funcionalidades
 */

// Configurações
const CONFIG = {
    typewriterSpeed: 30,
    xpUpdateSpeed: 30,
    recadosCooldown: 5000, // 5 segundos entre recados
    maxRecados: 50,
    storageKey: 'recados_portfolio',
    statsKey: 'curriculo_stats'
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
    initCurriculo();
    initFormValidation();
    initCharacterCounter();
    updateEstatisticas();
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
            
            // Adiciona cursor piscante (remove o anterior)
            const cursorIndex = element.innerHTML.lastIndexOf('<span');
            if (cursorIndex !== -1) {
                element.innerHTML = element.innerHTML.substring(0, cursorIndex);
            }
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
    
    // Dados reais do curso (ajuste conforme sua realidade)
    const progressData = {
        totalDisciplinas: 40,
        disciplinasConcluidas: 18,
        semestreAtual: 5,
        totalSemestres: 6
    };
    
    // Calcula progresso ponderado
    const progresso = Math.min(
        100,
        Math.round(
            (progressData.disciplinasConcluidas / progressData.totalDisciplinas * 70) +
            (progressData.semestreAtual / progressData.totalSemestres * 30)
        )
    );
    
    // Atualiza ARIA label para acessibilidade
    const bar = document.querySelector('.xp-bar');
    if (bar) {
        bar.setAttribute('aria-valuenow', progresso);
    }
    
    // Animação suave com requestAnimationFrame
    setTimeout(() => {
        fill.style.width = progresso + '%';
        
        // Contador animado
        let currentProgress = 0;
        const duration = 2000; // 2 segundos
        const startTime = performance.now();
        
        function updateProgress(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para suavizar
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
            // Limita o número de recados
            if (recados.length > CONFIG.maxRecados) {
                recados = recados.slice(0, CONFIG.maxRecados);
            }
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(recados));
        } catch (e) {
            console.error('Erro ao salvar recados:', e);
            showToast('Não foi possível salvar o recado. O armazenamento pode estar cheio.');
        }
    }
    
    // Escape HTML para prevenir XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Formata data relativa
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
        
        // Validação
        const nome = document.getElementById('nome').value.trim();
        const msg = document.getElementById('mensagem').value.trim();
        
        if (!validateForm(nome, msg)) {
            return;
        }
        
        // Rate limiting
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
        
        // Simula envio (substitua pela sua lógica real)
        setTimeout(() => {
            // Adiciona recado
            storage.unshift({ 
                nome, 
                msg, 
                timestamp: Date.now() 
            });
            
            saveRecados(storage);
            renderRecados();
            form.reset();
            
            showToast('Recado enviado com sucesso!');
            
            // Reset botão
            btn.disabled = false;
            btn.textContent = originalText;
            btn.classList.remove('loading');
            
            // Cooldown
            setTimeout(() => {
                canSubmitRecado = true;
            }, CONFIG.recadosCooldown);
            
        }, 1000);
    });
}

/* ========== 4. FUNÇÕES DO CURRÍCULO ========== */
function initCurriculo() {
    // Carrega estatísticas
    updateEstatisticas();
    
    // Incrementa visualizações da página
    incrementarVisualizacao();
}

function trackDownload() {
    try {
        const stats = loadStats();
        stats.downloads = (stats.downloads || 0) + 1;
        saveStats(stats);
        
        updateEstatisticas();
        showToast('Download iniciado! Obrigado pelo interesse! 📥');
    } catch (e) {
        console.error('Erro ao trackear download:', e);
    }
}

function visualizarCurriculo() {
    const modal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    
    if (!modal || !pdfViewer) return;
    
    // Caminho para o PDF (ajuste conforme necessário)
    pdfViewer.src = './assets/curriculo-alailson.pdf';
    modal.classList.add('show');
    
    // Incrementa visualizações
    incrementarVisualizacaoDetalhe();
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
}

function fecharModal() {
    const modal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    
    if (modal) {
        modal.classList.remove('show');
    }
    if (pdfViewer) {
        pdfViewer.src = '';
    }
}

// Fechar ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('pdfModal');
    if (event.target === modal) {
        fecharModal();
    }
};

function copiarLinkCurriculo() {
    // Cria link compartilhável
    const link = `${window.location.origin}${window.location.pathname}#curriculo`;
    
    navigator.clipboard.writeText(link).then(() => {
        showToast('Link copiado! Compartilhe com recrutadores 📋');
    }).catch(() => {
        showToast('Erro ao copiar. Tente novamente.');
    });
}

function loadStats() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.statsKey)) || {
            downloads: 0,
            visualizacoes: 0,
            visualizacoesDetalhe: 0
        };
    } catch (e) {
        return {
            downloads: 0,
            visualizacoes: 0,
            visualizacoesDetalhe: 0
        };
    }
}

function saveStats(stats) {
    localStorage.setItem(CONFIG.statsKey, JSON.stringify(stats));
}

function incrementarVisualizacao() {
    const stats = loadStats();
    stats.visualizacoes = (stats.visualizacoes || 0) + 1;
    saveStats(stats);
    updateEstatisticas();
}

function incrementarVisualizacaoDetalhe() {
    const stats = loadStats();
    stats.visualizacoesDetalhe = (stats.visualizacoesDetalhe || 0) + 1;
    saveStats(stats);
    updateEstatisticas();
}

function updateEstatisticas() {
    const stats = loadStats();
    
    const downloadEl = document.getElementById('downloadCount');
    const viewEl = document.getElementById('viewCount');
    
    if (downloadEl) {
        downloadEl.textContent = stats.downloads || 0;
    }
    
    if (viewEl) {
        viewEl.textContent = stats.visualizacoes || 0;
    }
}

/* ========== 5. KONAMI CODE (EASTER EGG) ========== */
function initKonamiCode() {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let cur = 0;
    let timeout;
    
    document.addEventListener('keydown', (e) => {
        // Reset após inatividade
        clearTimeout(timeout);
        timeout = setTimeout(() => { cur = 0; }, 3000);
        
        if (e.code === seq[cur]) {
            cur++;
            if (cur === seq.length) {
                ativarModoMatrix();
                cur = 0;
            }
        } else {
            cur = 0;
        }
    });
}

function ativarModoMatrix() {
    // Efeito Matrix
    document.body.classList.add('matrix-mode');
    
    // Criar chuva de código Matrix
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    const interval = setInterval(drawMatrix, 50);
    
    // Desativa após 5 segundos
    setTimeout(() => {
        clearInterval(interval);
        document.body.classList.remove('matrix-mode');
        canvas.remove();
        showToast('🎮 Konami code ativado!');
    }, 5000);
}

/* ========== 6. VALIDAÇÃO DE FORMULÁRIO ========== */
function initFormValidation() {
    const nomeInput = document.getElementById('nome');
    const msgInput = document.getElementById('mensagem');
    
    if (nomeInput) {
        nomeInput.addEventListener('input', () => {
            validateField(nomeInput, 3, 50);
        });
    }
    
    if (msgInput) {
        msgInput.addEventListener('input', () => {
            validateField(msgInput, 5, 500);
        });
    }
}

function validateField(input, min, max) {
    const value = input.value.trim();
    const errorEl = document.getElementById(`${input.id}-error`);
    
    if (!errorEl) return true;
    
    if (value.length < min) {
        errorEl.textContent = `Mínimo de ${min} caracteres`;
        input.classList.add('error');
        return false;
    } else if (value.length > max) {
        errorEl.textContent = `Máximo de ${max} caracteres`;
        input.classList.add('error');
        return false;
    } else {
        errorEl.textContent = '';
        input.classList.remove('error');
        return true;
    }
}

function validateForm(nome, msg) {
    const nomeValid = nome.length >= 3 && nome.length <= 50;
    const msgValid = msg.length >= 5 && msg.length <= 500;
    
    if (!nomeValid) {
        showToast('Nome deve ter entre 3 e 50 caracteres');
    }
    
    if (!msgValid) {
        showToast('Mensagem deve ter entre 5 e 500 caracteres');
    }
    
    return nomeValid && msgValid;
}

/* ========== 7. CONTADOR DE CARACTERES ========== */
function initCharacterCounter() {
    const textarea = document.getElementById('mensagem');
    const counter = document.getElementById('charCounter');
    
    if (!textarea || !counter) return;
    
    textarea.addEventListener('input', () => {
        const remaining = 500 - textarea.value.length;
        counter.textContent = `${remaining} caracteres restantes`;
        
        if (remaining < 50) {
            counter.style.color = '#ffaa00';
        } else if (remaining < 20) {
            counter.style.color = '#ff4444';
        } else {
            counter.style.color = '#999999';
        }
    });
}

/* ========== 8. TOAST SYSTEM ========== */
function showToast(message, duration = 3000) {
    // Remove toast existente
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Cria novo toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove após duração
    setTimeout(() => {
        toast.style.animation = 'slideOutToast 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ========== 9. FUNÇÕES AUXILIARES ========== */
window.scrollToTop = () => {
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
};

window.showKonamiHint = () => {
    showToast('🎮 Dica: Tente o código Konami no teclado! (↑↑↓↓←→←→BA)');
};

// Inicializa lazy loading para imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Detecção de conexão lenta
function initConnectionAwareness() {
    if ('connection' in navigator) {
        if (navigator.connection.saveData) {
            document.body.classList.add('save-data');
        }
        
        navigator.connection.addEventListener('change', () => {
            if (navigator.connection.saveData) {
                document.body.classList.add('save-data');
            } else {
                document.body.classList.remove('save-data');
            }
        });
    }
}

/* ========== 10. INICIALIZAÇÕES ADICIONAIS ========== */
// Garante que o modal feche ao navegar
window.addEventListener('popstate', () => {
    fecharModal();
});

// Previne scroll do body quando modal está aberto
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModal();
    }
});