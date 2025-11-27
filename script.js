// ===============================
// NEON GAMER - script.js
// Versão Melhorada Completa
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
    initRecadosSystem();
    initKonamiCode();
    initParticleEffects();
    initTypewriterEffect();
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
// 6. SISTEMA DE RECADOS COMPLETO
// ===============================
function initRecadosSystem() {
    const form = document.querySelector('.recado-form');
    const feedback = document.querySelector('.feedback-msg');
    const listaRecados = document.querySelector('.lista-recados');
    
    if (!form) return;
    
    // Criar área de recados se não existir
    if (!listaRecados) {
        const area = document.createElement('div');
        area.className = 'lista-recados';
        form.parentNode.insertBefore(area, form.nextSibling);
    }
    
    // Carregar recados existentes
    let recados = JSON.parse(localStorage.getItem('recados')) || [];
    renderRecados();
    
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
            data: new Date().toLocaleString('pt-BR'),
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
    
    // Efeitos nos inputs
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
    
    function renderRecados() {
        const area = document.querySelector('.lista-recados');
        if (!area) return;
        
        if (recados.length === 0) {
            area.innerHTML = `
                <div class="recado-vazio">
                    <span>📝</span>
                    <p>Nenhum recado ainda. Seja o primeiro a comentar!</p>
                </div>
            `;
            return;
        }
        
        area.innerHTML = recados.map(recado => `
            <div class="recado-item" data-id="${recado.id}">
                <div class="recado-header">
                    <strong>${escapeHTML(recado.nome)}</strong>
                    <span class="recado-data">${recado.data}</span>
                </div>
                <p class="recado-texto">${escapeHTML(recado.texto)}</p>
                <div class="recado-actions">
                    <button class="like-btn" onclick="likeRecado(${recado.id})">
                        ❤️ <span>${recado.likes}</span>
                    </button>
                    <button class="delete-btn" onclick="deleteRecado(${recado.id})">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Expor funções globalmente
    window.likeRecado = function(id) {
        recados = recados.map(recado => {
            if (recado.id === id) {
                return { ...recado, likes: recado.likes + 1 };
            }
            return recado;
        });
        localStorage.setItem('recados', JSON.stringify(recados));
        renderRecados();
        createParticles(event.target, 5);
    };
    
    window.deleteRecado = function(id) {
        if (!confirm('Tem certeza que deseja excluir este recado?')) return;
        
        recados = recados.filter(recado => recado.id !== id);
        localStorage.setItem('recados', JSON.stringify(recados));
        renderRecados();
        showNotification('🗑️ Recado excluído!', 'info');
    };
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
        
        if (e.code === konamiSequence[konamiIndex]) {
            konamiIndex++;
            
            // Feedback visual progressivo
            document.body.style.filter = `hue-rotate(${konamiIndex * 36}deg)`;
            
            if (konamiIndex === konamiSequence.length) {
                activateKonamiMode();
                konamiIndex = 0;
            }
        } else {
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
        playSound('konami');
        
        // Desativar após 6 segundos
        setTimeout(() => {
            document.body.classList.remove('konami-mode');
            konamiActive = false;
            showNotification('✨ Modo Konami Finalizado!', 'success');
        }, 6000);
    }
}

// ===============================
// 8. SISTEMA DE PARTÍCULAS
// ===============================
function initParticleEffects() {
    // CSS dinâmico para partículas
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
    document.head.appendChild(style);
}

function createParticles(element, count = 5) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição aleatória dentro do elemento
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        // Movimento aleatório
        const tx = (Math.random() - 0.5) * 100;
        const ty = -(Math.random() * 80 + 20);
        
        // Cor baseada no elemento
        const colors = ['var(--neon-a)', 'var(--neon-b)', 'var(--neon-c)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.background = color;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animationDelay = `${Math.random() * 0.2}s`;
        
        element.style.position = 'relative';
        element.appendChild(particle);
        
        // Remover após animação
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// ===============================
// 9. SISTEMA DE NOTIFICAÇÕES
// ===============================
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
    `;
    
    // Estilos dinâmicos
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.1);
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
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .notification-success { border-left: 4px solid var(--success); }
        .notification-error { border-left: 4px solid #ff4444; }
        .notification-warning { border-left: 4px solid #ffaa00; }
        .notification-info { border-left: 4px solid var(--neon-a); }
        .notification-konami { 
            border-left: 4px solid transparent;
            background: linear-gradient(135deg, var(--neon-a), var(--neon-b), var(--neon-c));
            animation: konamiNotification 0.5s ease infinite;
        }
        
        .notification.show { transform: translateX(0); }
        
        @keyframes konamiNotification {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
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
    // Implementação básica - você pode adicionar sons reais depois
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'click') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// ===============================
// 13. UTILITÁRIOS
// ===============================
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===============================
// 14. PERFORMANCE E OTIMIZAÇÃO
// ===============================
// Debounce para eventos de resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalcular elementos se necessário
    }, 250);
});

// Intersection Observer para animações sob demanda
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