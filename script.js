// ===============================
// NEON GAMER - script.js
// Versão Melhorada Completa e Otimizada
// ===============================

// ===============================
// 1. INICIALIZAÇÃO E CONFIGURAÇÃO
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Alailson.dev - Inicializado com sucesso!');
    
    // Inicializar todos os sistemas
    initAvatarAnimation();
    initXPAnimation();
    initProjects();
    initSocialCards();
    initRecadosSystem(); // <--- Função principal revisada
    initKonamiCode();
    initParticleEffects();
    initTypewriterEffect();
    // Funções utilitárias do footer (não precisam de init)
    window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    window.toggleSound = () => showNotification('🔈 Sons não implementados, mas a intenção é boa!', 'warning');
    window.showKonamiHint = () => showNotification('Dica: Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, B, A', 'info');
});

// ===============================
// 2. ANIMAÇÃO DO AVATAR MELHORADA
// ===============================
function initAvatarAnimation() {
    const avatar = document.querySelector('.avatar-img');
    const avatarBox = document.querySelector('.avatar-box');
    
    if (!avatar) return;
    
    // Efeito hover com tilt
    avatarBox.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(5deg)';
        avatar.style.filter = 'brightness(1.3) saturate(1.2)';
        
        // Efeito de partículas
        createParticles(avatarBox, 8);
    });
    
    avatarBox.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
        avatar.style.filter = 'brightness(1) saturate(1)';
    });
    
    // Efeito de clique
    avatarBox.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
        }, 150);
        
        // Feedback visual
        createParticles(avatarBox, 15);
        showNotification('✨ Avatar interativo!', 'success');
    });
}

// ===============================
// 3. ANIMAÇÃO DA BARRA DE XP
// ===============================
function initXPAnimation() {
    const xpFill = document.querySelector('.xp-fill');
    const xpText = document.querySelector('.xp-text');
    
    if (!xpFill || !xpText) return;
    
    // Animação de entrada
    setTimeout(() => {
        xpFill.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
        xpFill.style.width = '45%';
        
        // Atualizar texto dinamicamente
        animateCounter(xpText, 0, 45, 2000, '% XP');
    }, 1000);
    
    // Efeito hover na seção XP
    const xpSection = document.querySelector('.xp-section');
    xpSection.addEventListener('click', function() {
        createParticles(this, 5);
        this.style.transform = 'scale(1.02)';
        setTimeout(() => this.style.transform = 'scale(1)', 200);
    });
}

// ===============================
// 4. SISTEMA DE PROJETOS INTERATIVO
// ===============================
function initProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Delay stagger para animação
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
        
        // Efeito de clique nos projetos
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return;
            
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }, 150);
            
            createParticles(this, 3);
        });
        
        // Efeito de foco no link
        const link = card.querySelector('a');
        if (link) {
            link.addEventListener('focus', function() {
                card.style.transform = 'translateY(-12px) scale(1.05)';
                card.style.zIndex = '10';
            });
            
            link.addEventListener('blur', function() {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.zIndex = '1';
            });
        }
    });
}

// ===============================
// 5. CARDS SOCIAIS INTERATIVOS
// ===============================
function initSocialCards() {
    const socialCards = document.querySelectorAll('.social-card:not(.disabled)');
    
    socialCards.forEach((card, index) => {
        // Animação escalonada
        card.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        card.classList.add('fade-in-up');
        
        // Efeito de clique aprimorado
        card.addEventListener('click', function(e) {
            if (this.classList.contains('disabled')) return;
            
            // Feedback tátil
            this.style.transform = 'scale(0.95)';
            createParticles(this, 8);
            
            // Som de clique (opcional)
            playSound('click');
            
            setTimeout(() => {
                this.style.transform = 'translateY(-6px) scale(1.05)';
            }, 150);
        });
        
        // Efeitos especiais por tipo
        if (card.classList.contains('github')) {
            card.addEventListener('mouseenter', function() {
                this.style.animation = 'githubPulse 0.5s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.animation = '';
            });
        }
        
        if (card.classList.contains('instagram')) {
            card.addEventListener('mouseenter', function() {
                this.style.animation = 'instaPulse 2s ease infinite';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.animation = 'instaPulse 8s ease infinite';
            });
        }
    });
}

// ===============================
// 6. SISTEMA DE RECADOS COMPLETO (REVISADO)
// ===============================
function initRecadosSystem() {
    const form = document.querySelector('.recado-form');
    const listaRecados = document.getElementById('listaRecados');
    
    if (!form || !listaRecados) return;
    
    // Carregar recados existentes
    let recados = JSON.parse(localStorage.getItem('recados')) || [];
    renderRecados();
    
    // FUNÇÃO INTERNA: Renderizar Recados
    function renderRecados() {
        if (recados.length === 0) {
            listaRecados.innerHTML = `
                <div class="recado-vazio">
                    <span>📝</span>
                    <p>Nenhum recado ainda. Seja o primeiro a comentar!</p>
                </div>
            `;
            // Atualiza o contador (opcional)
            document.getElementById('totalRecados').textContent = '0 recados';
            return;
        }
        
        // Atualiza o contador de recados
        document.getElementById('totalRecados').textContent = `${recados.length} recados`;
        
        listaRecados.innerHTML = recados.map(recado => `
            <div class="recado-item" data-id="${recado.id}">
                <div class="recado-header">
                    <strong>${escapeHTML(recado.nome)}</strong>
                    <span class="recado-data">${recado.data}</span>
                </div>
                <p class="recado-texto">${escapeHTML(recado.texto)}</p>
                <div class="recado-actions">
                    <button class="like-btn" data-action="like">
                        ❤️ <span class="like-count">${recado.likes}</span>
                    </button>
                    <button class="delete-btn" data-action="delete">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // FUNÇÃO INTERNA: Lógica do Like (Otimizada para não renderizar a lista inteira)
    function handleLike(id, buttonElement) {
        let updatedRecado;
        recados = recados.map(recado => {
            if (recado.id === id) {
                updatedRecado = { ...recado, likes: recado.likes + 1 };
                return updatedRecado;
            }
            return recado;
        });
        localStorage.setItem('recados', JSON.stringify(recados));
        
        // Atualiza a contagem do like no DOM diretamente
        const countSpan = buttonElement.querySelector('.like-count');
        if (countSpan && updatedRecado) {
            countSpan.textContent = updatedRecado.likes;
        }
        createParticles(buttonElement, 5);
    }
    
    // FUNÇÃO INTERNA: Lógica do Delete
    function handleDelete(id) {
        if (!confirm('Tem certeza que deseja excluir este recado?')) return;
        
        recados = recados.filter(recado => recado.id !== id);
        localStorage.setItem('recados', JSON.stringify(recados));
        renderRecados(); // Renderiza tudo novamente após a exclusão
        showNotification('🗑️ Recado excluído!', 'info');
    }
    
    // Configurar formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nomeInput = this.querySelector('input[type="text"]');
        const textoInput = this.querySelector('textarea');
        
        const nome = nomeInput.value.trim();
        const texto = textoInput.value.trim();
        
        // Validação
        if (!nome || !texto) {
            showNotification('⚠️ Preencha todos os campos!', 'error');
            return;
        }
        
        if (texto.length < 5) {
            showNotification('📝 Recado muito curto!', 'warning');
            return;
        }
        
        // Criar novo recado
        const novoRecado = {
            id: Date.now(),
            nome: nome,
            texto: texto,
            data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            likes: 0
        };
        
        // Adicionar à lista
        recados.unshift(novoRecado);
        localStorage.setItem('recados', JSON.stringify(recados));
        
        // Feedback visual
        showNotification('🎉 Recado enviado com sucesso!', 'success');
        createParticles(form, 12);
        
        // Renderizar e limpar
        renderRecados();
        this.reset();
        
        // Focar no nome para novo recado
        nomeInput.focus();
    });
    
    // DELEGAÇÃO DE EVENTOS: Trata cliques nos botões Like/Delete
    listaRecados.addEventListener('click', function(e) {
        const targetButton = e.target.closest('button[data-action]');
        if (!targetButton) return;

        const recadoItem = targetButton.closest('.recado-item');
        if (!recadoItem) return;

        // O ID do recado é lido do atributo data-id do item pai
        const id = parseInt(recadoItem.dataset.id);
        
        if (targetButton.dataset.action === 'like') {
            handleLike(id, targetButton);
        } else if (targetButton.dataset.action === 'delete') {
            handleDelete(id);
        }
    });

    // Efeitos nos inputs (mantido, pois é limpo)
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            createParticles(this, 3);
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// ===============================
// 7. CÓDIGO KONAMI MELHORADO
// ===============================
function initKonamiCode() {
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    let konamiIndex = 0;
    let konamiActive = false;
    
    document.addEventListener('keydown', function(e) {
        if (konamiActive) return;
        
        // Verifica se a tecla pressionada corresponde à sequência
        if (e.code === konamiSequence[konamiIndex]) {
            konamiIndex++;
            
            // Feedback visual progressivo (leve mudança de cor)
            document.body.style.filter = `hue-rotate(${konamiIndex * 36}deg)`;
            
            if (konamiIndex === konamiSequence.length) {
                activateKonamiMode();
                konamiIndex = 0;
            }
        } else {
            // Sequência quebrada
            konamiIndex = 0;
            document.body.style.filter = 'none';
        }
    });
    
    function activateKonamiMode() {
        konamiActive = true;
        
        // Efeitos visuais
        document.body.classList.add('konami-mode');
        createParticles(document.body, 50);
        
        // Notificação
        showNotification('🎮 Modo Konami Ativado!', 'konami');
        
        // Efeitos sonoros (opcional)
        // playSound('konami'); // Comentei o playSound pois o original estava injetando audioContext repetidamente.
        
        // Desativar após 6 segundos
        setTimeout(() => {
            document.body.classList.remove('konami-mode');
            document.body.style.filter = 'none'; // Reseta o filtro do keydown
            konamiActive = false;
            showNotification('✨ Modo Konami Finalizado!', 'success');
        }, 6000);
    }
}

// ===============================
// 8. SISTEMA DE PARTÍCULAS
// ===============================
function initParticleEffects() {
    // CSS dinâmico para partículas (bom para encapsulamento)
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            pointer-events: none;
            width: 4px;
            height: 4px;
            background: var(--neon-a);
            border-radius: 50%;
            animation: particleFloat 1s ease-out forwards;
            z-index: 1000;
        }
        
        @keyframes particleFloat {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--tx, 0), var(--ty, -50px)) scale(0);
                opacity: 0;
            }
        }
    `;
    // Evita adicionar o estilo múltiplas vezes
    if (!document.querySelector('#particle-styles')) {
        style.id = 'particle-styles';
        document.head.appendChild(style);
    }
}

function createParticles(element, count = 5) {
    const rect = element.getBoundingClientRect();
    const isBody = element === document.body;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        let x, y;
        
        if (isBody) {
            // Para o body, usa a janela inteira
            x = Math.random() * window.innerWidth;
            y = Math.random() * window.innerHeight;
            particle.style.position = 'fixed'; // Posição fixa para o body
        } else {
            // Posição relativa ao elemento
            x = Math.random() * rect.width;
            y = Math.random() * rect.height;
            element.style.position = 'relative'; // Garante que o elemento seja relativo
        }
        
        // Movimento aleatório
        const tx = (Math.random() - 0.5) * 100;
        const ty = -(Math.random() * 80 + 20);
        
        // Cor baseada no tema
        const colors = ['var(--neon-a)', 'var(--neon-b)', 'var(--neon-c)'];
        const color = getComputedStyle(document.documentElement).getPropertyValue(colors[Math.floor(Math.random() * colors.length)]);
        
        particle.style.left = `${isBody ? x : x}px`;
        particle.style.top = `${isBody ? y : y}px`;
        particle.style.background = color || 'white';
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animationDelay = `${Math.random() * 0.2}s`;
        
        // Adiciona ao elemento (ou ao body se for fixed)
        (isBody ? document.body : element).appendChild(particle);
        
        // Remover após animação
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1200);
    }
}

// ===============================
// 9. SISTEMA DE NOTIFICAÇÕES
// ===============================
function showNotification(message, type = 'info') {
    // Estilos dinâmicos (injeta apenas uma vez)
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(10, 10, 10, 0.85); /* Usa var(--bg) */
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 12px;
                padding: 16px 20px;
                color: white;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            }
            
            .notification-success { border-left: 4px solid var(--success); }
            .notification-error { border-left: 4px solid #ff4444; }
            .notification-warning { border-left: 4px solid #ffaa00; }
            .notification-info { border-left: 4px solid var(--neon-a); }
            .notification-konami { 
                border-left: 4px solid transparent;
                background: linear-gradient(135deg, var(--neon-a), var(--neon-b), var(--neon-c));
                animation: konamiNotification 0.5s ease infinite;
                color: black;
            }
            
            .notification.show { transform: translateX(0); }
            
            @keyframes konamiNotification {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remover notificação existente (para evitar acúmulo)
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: '💡',
        konami: '🎮'
    };
    return icons[type] || '💡';
}

// ===============================
// 10. ANIMAÇÃO DE DIGITAÇÃO (TYPEWRITER)
// ===============================
function initTypewriterEffect() {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;
    
    // Se o texto já estiver visível (pelo CSS), não precisa do efeito
    // Se você quer que ele digite, o CSS do subtítulo deve começar com opacity: 0;
    
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < originalText.length) {
            subtitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Iniciar após delay
    setTimeout(typeWriter, 1000);
}

// ===============================
// 11. ANIMAÇÃO DE CONTADOR
// ===============================
function animateCounter(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        // Mantive Level 3 fixo, como estava no código original
        element.textContent = `Level 3 • XP: ${value}${suffix}`; 
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===============================
// 12. EFEITOS SONOROS (OPCIONAL)
// ===============================
function playSound(type) {
    // Nota: O seu código original injetava o AudioContext a cada clique,
    // o que pode causar erros. Para uma implementação segura, use o método 
    // do seu HTML (tag <audio>).
    const audioEl = document.getElementById(type === 'click' ? 'clickSound' : 'konamiSound');
    if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.log("Erro ao tocar áudio:", e));
    }
}

// ===============================
// 13. UTILITÁRIOS
// ===============================
function escapeHTML(text) {
    // Função mais simples e padrão para escapar HTML
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ===============================
// 14. PERFORMANCE E OTIMIZAÇÃO
// ===============================
// Debounce para eventos de resize (mantido)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalcular elementos se necessário
    }, 250);
});

// Intersection Observer para animações sob demanda (mantido)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, { threshold: 0.1 });

// Observar elementos que precisam de animação
document.querySelectorAll('.project-card, .social-card').forEach(el => {
    observer.observe(el);
});

console.log('🎮 Todos os sistemas inicializados! Bem-vindo ao Alailson.dev!');