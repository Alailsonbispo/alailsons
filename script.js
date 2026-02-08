// ===============================
// NEON GAMER - script.js
// Versão Final - Sincronizada com Formspree
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Alailson.dev - Inicializado com sucesso!');
    
    initAvatarAnimation();
    initXPAnimation();
    initProjects();
    initSocialCards();
    initRecadosSystem(); 
    initKonamiCode();
    initParticleEffects();
    initTypewriterEffect();

    // Utilitários do footer
    window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    window.toggleSound = () => showNotification('🔈 Sons em desenvolvimento para a próxima DLC!', 'warning');
    window.showKonamiHint = () => showNotification('Dica: ↑ ↑ ↓ ↓ ← → ← → B A', 'info');
});

// ===============================
// 2. ANIMAÇÃO DO AVATAR
// ===============================
function initAvatarAnimation() {
    const avatar = document.querySelector('.avatar-img');
    const avatarBox = document.querySelector('.avatar-box');
    if (!avatarBox) return;
    
    avatarBox.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(5deg)';
        avatar.style.filter = 'brightness(1.3) saturate(1.2)';
        createParticles(avatarBox, 8);
    });
    
    avatarBox.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
        avatar.style.filter = 'brightness(1) saturate(1)';
    });
}

// ===============================
// 3. ANIMAÇÃO DA BARRA DE XP
// ===============================
function initXPAnimation() {
    const xpFill = document.querySelector('.xp-fill');
    const xpText = document.querySelector('.xp-text');
    if (!xpFill || !xpText) return;
    
    setTimeout(() => {
        xpFill.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
        xpFill.style.width = '45%';
        animateCounter(xpText, 0, 45, 2000, '% XP');
    }, 1000);
}

// ===============================
// 4. SISTEMA DE PROJETOS
// ===============================
function initProjects() {
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// ===============================
// 5. CARDS SOCIAIS
// ===============================
function initSocialCards() {
    document.querySelectorAll('.social-card:not(.disabled)').forEach((card, index) => {
        card.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            createParticles(this, 8);
            setTimeout(() => this.style.transform = 'translateY(-6px) scale(1.05)', 150);
        });
    });
}

// ===============================
// 6. SISTEMA DE RECADOS (REVISADO)
// ===============================
function initRecadosSystem() {
    const form = document.getElementById('recadoForm');
    const listaRecados = document.getElementById('listaRecados');
    if (!form || !listaRecados) return;
    
    let recados = JSON.parse(localStorage.getItem('recados')) || [];
    renderRecados();
    
    function renderRecados() {
        // Atualiza contadores
        const totalRecados = recados.length;
        const totalLikes = recados.reduce((sum, r) => sum + (r.likes || 0), 0);
        
        document.getElementById('totalRecados').textContent = `${totalRecados} recados`;
        document.getElementById('totalLikes').textContent = `${totalLikes} curtidas`;

        if (totalRecados === 0) {
            listaRecados.innerHTML = `<div class="recado-vazio"><span>📝</span><p>Nenhum recado ainda.</p></div>`;
            return;
        }

        listaRecados.innerHTML = recados.map(recado => `
            <div class="recado-item" data-id="${recado.id}">
                <div class="recado-header">
                    <strong>${escapeHTML(recado.nome)}</strong>
                    <span class="recado-data">${recado.data}</span>
                </div>
                <p class="recado-texto">${escapeHTML(recado.texto)}</p>
                <div class="recado-actions">
                    <button class="like-btn" data-action="like">❤️ <span class="like-count">${recado.likes}</span></button>
                    <button class="delete-btn" data-action="delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nomeInput = this.querySelector('input[name="nome"]');
        const textoInput = this.querySelector('textarea[name="mensagem"]');
        const submitBtn = this.querySelector('.submit-btn');
        
        const nome = nomeInput.value.trim();
        const texto = textoInput.value.trim();
        
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        showNotification('⏳ Enviando recado...', 'info');

        try {
            const response = await fetch("https://formspree.io/f/mqedkvda", {
                method: "POST",
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const novoRecado = {
                    id: Date.now(),
                    nome: nome,
                    texto: texto,
                    data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    likes: 0
                };
                
                recados.unshift(novoRecado);
                localStorage.setItem('recados', JSON.stringify(recados));
                
                showNotification('🚀 Recado enviado com sucesso!', 'success');
                createParticles(form, 15);
                renderRecados();
                this.reset();
            } else {
                showNotification('❌ Erro no servidor. Tente mais tarde.', 'error');
            }
        } catch (error) {
            showNotification('❌ Erro de conexão.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });

    listaRecados.addEventListener('click', function(e) {
        const targetButton = e.target.closest('button[data-action]');
        if (!targetButton) return;
        const recadoItem = targetButton.closest('.recado-item');
        const id = parseInt(recadoItem.dataset.id);
        
        if (targetButton.dataset.action === 'like') {
            recados = recados.map(r => r.id === id ? {...r, likes: (r.likes || 0) + 1} : r);
            localStorage.setItem('recados', JSON.stringify(recados));
            renderRecados();
            createParticles(targetButton, 5);
        } else if (targetButton.dataset.action === 'delete') {
            if(confirm('Excluir este recado da sua visualização?')) {
                recados = recados.filter(r => r.id !== id);
                localStorage.setItem('recados', JSON.stringify(recados));
                renderRecados();
                showNotification('🗑️ Recado removido.', 'info');
            }
        }
    });
}

// ===============================
// 7. CÓDIGO KONAMI
// ===============================
function initKonamiCode() {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let index = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.code === sequence[index]) {
            index++;
            if (index === sequence.length) {
                activateKonami();
                index = 0;
            }
        } else {
            index = 0;
        }
    });

    function activateKonami() {
        document.body.classList.add('konami-mode');
        showNotification('🎮 MODO DEUS ATIVADO!', 'konami');
        createParticles(document.body, 40);
        setTimeout(() => document.body.classList.remove('konami-mode'), 5000);
    }
}

// ===============================
// 8. PARTÍCULAS & NOTIFICAÇÕES
// ===============================
function initParticleEffects() {
    const style = document.createElement('style');
    style.textContent = `
        .particle { position: absolute; pointer-events: none; width: 4px; height: 4px; border-radius: 50%; animation: pFloat 1s ease-out forwards; z-index: 1000; }
        @keyframes pFloat { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
    `;
    document.head.appendChild(style);
}

function createParticles(el, count = 5) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const tx = (Math.random() - 0.5) * 100;
        const ty = -(Math.random() * 80 + 20);
        p.style.left = `${Math.random() * rect.width + rect.left + window.scrollX}px`;
        p.style.top = `${Math.random() * rect.height + rect.top + window.scrollY}px`;
        p.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        p.style.position = 'absolute';
        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

function showNotification(msg, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const n = document.createElement('div');
    n.className = `notification show notification-${type}`;
    n.style.cssText = `position:fixed; top:20px; right:20px; background:#111; color:#fff; padding:15px; border-radius:8px; border-left:4px solid var(--neon-a); z-index:9999; box-shadow:0 10px 30px rgba(0,0,0,0.5);`;
    n.innerHTML = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// ===============================
// 9. TYPEWRITER & CONTADOR
// ===============================
function initTypewriterEffect() {
    const sub = document.querySelector('.subtitle');
    if (!sub) return;
    const txt = sub.textContent;
    sub.textContent = '';
    let i = 0;
    function type() {
        if (i < txt.length) { sub.textContent += txt.charAt(i); i++; setTimeout(type, 40); }
    }
    setTimeout(type, 800);
}

function animateCounter(el, start, end, duration, suffix = '') {
    let startTime = null;
    const step = (now) => {
        if (!startTime) startTime = now;
        const progress = Math.min((now - startTime) / duration, 1);
        el.textContent = `Level 3 • XP: ${Math.floor(progress * (end - start) + start)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}
