// ===============================
// NEON GAMER - script.js
// Versão Final Integrada & Otimizada
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Alailson.dev - Sistemas Online!');
    
    // Inicialização
    initAvatarAnimation();
    initXPAnimation();
    initProjects();
    initSocialCards();
    initRecadosSystem();
    initKonamiCode();
    initParticleEffects();
    initTypewriterEffect();

    // Utilitários Global
    window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===============================
// 1. SISTEMA DE RECADOS (LocalStorage + Formspree)
// ===============================
function initRecadosSystem() {
    const form = document.querySelector('.recado-form');
    const listaRecados = document.getElementById('listaRecados');
    
    // CONFIGURAÇÃO: Coloque seu ID do Formspree entre as aspas
    const FORMSPREE_ID = "SEU_ID_AQUI"; 

    if (!form || !listaRecados) return;
    
    let recados = JSON.parse(localStorage.getItem('recados')) || [];
    renderRecados();
    
    function renderRecados() {
        if (recados.length === 0) {
            listaRecados.innerHTML = `
                <div class="recado-vazio">
                    <span>📝</span>
                    <p>Nenhum recado ainda. Seja o primeiro!</p>
                </div>
            `;
            document.getElementById('totalRecados').textContent = '0 recados';
            return;
        }
        
        document.getElementById('totalRecados').textContent = `${recados.length} recados`;
        
        listaRecados.innerHTML = recados.map(recado => `
            <div class="recado-item fade-in-up" data-id="${recado.id}">
                <div class="recado-header">
                    <strong>${escapeHTML(recado.nome)}</strong>
                    <span class="recado-data">${recado.data}</span>
                </div>
                <p class="recado-texto">${escapeHTML(recado.texto)}</p>
                <div class="recado-actions">
                    <button class="like-btn" data-action="like">
                        ❤️ <span class="like-count">${recado.likes}</span>
                    </button>
                    <button class="delete-btn" data-action="delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = form.querySelector('button');
        const nomeInput = form.querySelector('input[name="nome"]');
        const textoInput = form.querySelector('textarea[name="recado"]');
        
        const nome = nomeInput.value.trim();
        const texto = textoInput.value.trim();
        
        if (!nome || !texto) {
            showNotification('⚠️ Preencha todos os campos!', 'warning');
            return;
        }

        // Bloqueia botão para evitar múltiplos envios
        btnSubmit.textContent = "ENVIANDO... 🚀";
        btnSubmit.disabled = true;

        try {
            // Envio para o Formspree
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const novoRecado = {
                    id: Date.now(),
                    nome: nome,
                    texto: texto,
                    data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
                    likes: 0
                };
                
                recados.unshift(novoRecado);
                localStorage.setItem('recados', JSON.stringify(recados));
                
                renderRecados();
                form.reset();
                showNotification('🎉 Recado enviado e salvo!', 'success');
                createParticles(form, 15);
            } else {
                throw new Error();
            }
        } catch (error) {
            showNotification('❌ Erro no servidor. Tente novamente.', 'error');
        } finally {
            btnSubmit.textContent = "ENVIAR RECADO";
            btnSubmit.disabled = false;
        }
    });

    // Delegação de eventos (Like/Delete)
    listaRecados.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const item = btn.closest('.recado-item');
        const id = parseInt(item.dataset.id);
        
        if (btn.dataset.action === 'like') {
            recados = recados.map(r => r.id === id ? {...r, likes: r.likes + 1} : r);
            localStorage.setItem('recados', JSON.stringify(recados));
            btn.querySelector('.like-count').textContent = recados.find(r => r.id === id).likes;
            createParticles(btn, 5);
        } else if (btn.dataset.action === 'delete') {
            if(confirm('Deseja remover este recado do seu navegador?')) {
                recados = recados.filter(r => r.id !== id);
                localStorage.setItem('recados', JSON.stringify(recados));
                renderRecados();
                showNotification('🗑️ Removido localmente!', 'info');
            }
        }
    });
}

// ===============================
// 2. EFEITOS VISUAIS E ANIMAÇÕES
// ===============================

function initAvatarAnimation() {
    const avatarBox = document.querySelector('.avatar-box');
    if (!avatarBox) return;
    avatarBox.addEventListener('click', () => {
        createParticles(avatarBox, 15);
        showNotification('✨ Avatar Level Up!', 'success');
    });
}

function initXPAnimation() {
    const xpFill = document.querySelector('.xp-fill');
    const xpText = document.querySelector('.xp-text');
    if (!xpFill) return;
    setTimeout(() => {
        xpFill.style.transition = 'width 2s ease-in-out';
        xpFill.style.width = '45%';
        animateCounter(xpText, 0, 45, 2000, '% XP');
    }, 500);
}

function initProjects() {
    document.querySelectorAll('.project-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

function initSocialCards() {
    document.querySelectorAll('.social-card:not(.disabled)').forEach((card, i) => {
        card.style.animationDelay = `${0.3 + (i * 0.1)}s`;
        card.classList.add('fade-in-up');
    });
}

function initKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let index = 0;
    document.addEventListener('keydown', (e) => {
        if (e.code === code[index]) {
            index++;
            if (index === code.length) {
                document.body.classList.add('konami-mode');
                showNotification('🎮 MODO DEUS ATIVADO!', 'konami');
                createParticles(document.body, 50);
                setTimeout(() => {
                    document.body.classList.remove('konami-mode');
                    index = 0;
                }, 10000);
            }
        } else { index = 0; }
    });
}

// ===============================
// 3. SISTEMA DE PARTÍCULAS & UI
// ===============================

function createParticles(el, count) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const rect = el.getBoundingClientRect();
        p.style.left = (rect.left + rect.width / 2) + 'px';
        p.style.top = (rect.top + rect.height / 2) + 'px';
        p.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
        p.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

function showNotification(msg, type) {
    const n = document.createElement('div');
    n.className = `notification notification-${type} show`;
    n.innerHTML = `<span>${msg}</span>`;
    document.body.appendChild(n);
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
}

function animateCounter(el, start, end, duration, suffix) {
    let startTimestamp = null;
    const step = (ts) => {
        if (!startTimestamp) startTimestamp = ts;
        const progress = Math.min((ts - startTimestamp) / duration, 1);
        el.textContent = `Level 3 • XP: ${Math.floor(progress * (end - start) + start)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function initTypewriterEffect() {
    const sub = document.querySelector('.subtitle');
    if (!sub) return;
    const txt = sub.textContent;
    sub.textContent = '';
    let i = 0;
    (function type() {
        if (i < txt.length) { sub.textContent += txt.charAt(i++); setTimeout(type, 50); }
    })();
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function initParticleEffects() {
    const s = document.createElement('style');
    s.textContent = `
        .particle { position: fixed; width: 5px; height: 5px; background: var(--neon-a); border-radius: 50%; pointer-events: none; z-index: 9999; animation: pFloat 1s forwards; }
        @keyframes pFloat { to { transform: translate(var(--tx), var(--ty)); opacity: 0; } }
        .notification { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 10px; background: #111; border: 1px solid var(--neon-a); color: white; transform: translateX(150%); transition: 0.3s; z-index: 10000; }
        .notification.show { transform: translateX(0); }
        .notification-success { border-color: var(--success); }
        .notification-konami { background: linear-gradient(45deg, var(--neon-a), var(--neon-c)); color: black; font-weight: bold; }
    `;
    document.head.appendChild(s);
}
