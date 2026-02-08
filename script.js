// ===============================
// NEON GAMER - script.js
// Versão Final com Fetch API (AJAX)
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Alailson.dev - Sistema carregado com envio AJAX!');
    
    initAvatarAnimation();
    initXPAnimation();
    initProjects();
    initSocialCards();
    initRecadosSystem(); 
    initKonamiCode();
    initParticleEffects();
    initTypewriterEffect();

    window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    window.toggleSound = () => showNotification('🔈 Sons em fase de testes!', 'warning');
    window.showKonamiHint = () => showNotification('Dica: ↑ ↑ ↓ ↓ ← → ← → B A', 'info');
});

// ===============================
// SISTEMA DE RECADOS (FETCH API)
// ===============================
function initRecadosSystem() {
    const form = document.getElementById('recadoForm');
    const listaRecados = document.getElementById('listaRecados');
    
    if (!form || !listaRecados) return;
    
    let recados = JSON.parse(localStorage.getItem('recados')) || [];
    renderRecados();

    function renderRecados() {
        if (recados.length === 0) {
            listaRecados.innerHTML = `<div class="recado-vazio"><p>Nenhum recado ainda. Seja o primeiro!</p></div>`;
            document.getElementById('totalRecados').textContent = '0 recados';
            return;
        }
        document.getElementById('totalRecados').textContent = `${recados.length} recados`;
        listaRecados.innerHTML = recados.map(recado => `
            <div class="recado-item" data-id="${recado.id}">
                <div class="recado-header"><strong>${escapeHTML(recado.nome)}</strong><span>${recado.data}</span></div>
                <p class="recado-texto">${escapeHTML(recado.texto)}</p>
                <div class="recado-actions">
                    <button class="like-btn" data-action="like">❤️ <span class="like-count">${recado.likes}</span></button>
                    <button class="delete-btn" data-action="delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    // ENVIO COM FETCH (SEM REDIRECIONAMENTO)
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o redirecionamento para a página do Formspree
        
        const btn = this.querySelector('.submit-btn');
        const btnText = btn.querySelector('.btn-text');
        const nomeInput = this.querySelector('input[name="nome"]');
        const textoInput = this.querySelector('textarea[name="mensagem"]');
        
        const nome = nomeInput.value.trim();
        const texto = textoInput.value.trim();

        if (!nome || !texto) {
            showNotification('⚠️ Preencha todos os campos!', 'error');
            return;
        }

        // Feedback visual de carregamento
        btnText.textContent = "Enviando...";
        btn.disabled = true;

        const data = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                // Sucesso: Salva localmente
                const novoRecado = {
                    id: Date.now(),
                    nome: nome,
                    texto: texto,
                    data: new Date().toLocaleDateString('pt-BR'),
                    likes: 0
                };
                
                recados.unshift(novoRecado);
                localStorage.setItem('recados', JSON.stringify(recados));
                
                renderRecados();
                form.reset();
                showNotification('🚀 Recado enviado para o meu e-mail!', 'success');
                createParticles(form, 15);
            } else {
                showNotification('❌ Erro no servidor do Formspree.', 'error');
            }
        })
        .catch(() => {
            showNotification('❌ Erro de conexão. Verifique sua internet.', 'error');
        })
        .finally(() => {
            btnText.textContent = "Enviar Recado";
            btn.disabled = false;
        });
    });

    // Likes e Deletes
    listaRecados.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = parseInt(btn.closest('.recado-item').dataset.id);
        
        if (btn.dataset.action === 'like') {
            recados = recados.map(r => r.id === id ? {...r, likes: r.likes + 1} : r);
            localStorage.setItem('recados', JSON.stringify(recados));
            renderRecados();
        } else if (btn.dataset.action === 'delete') {
            if(confirm("Deseja apagar este recado da sua tela?")) {
                recados = recados.filter(r => r.id !== id);
                localStorage.setItem('recados', JSON.stringify(recados));
                renderRecados();
            }
        }
    });
}

// ===============================
// ANIMAÇÕES E EFEITOS (RESTAURADOS)
// ===============================
function initAvatarAnimation() {
    const box = document.querySelector('.avatar-box');
    if (!box) return;
    box.addEventListener('mouseenter', () => createParticles(box, 5));
    box.addEventListener('click', () => showNotification('✨ Avatar Level Max!', 'success'));
}

function initXPAnimation() {
    const fill = document.querySelector('.xp-fill');
    const txt = document.querySelector('.xp-text');
    if (fill && txt) {
        setTimeout(() => {
            fill.style.width = '45%';
            animateCounter(txt, 0, 45, 2000, '% XP');
        }, 800);
    }
}

function initProjects() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px) scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
    });
}

function initSocialCards() {
    document.querySelectorAll('.social-card').forEach(card => {
        card.addEventListener('click', () => playSound('click'));
    });
}

function initKonamiCode() {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let i = 0;
    document.addEventListener('keydown', (e) => {
        if (e.code === seq[i]) {
            i++;
            if (i === seq.length) {
                document.body.style.filter = 'hue-rotate(180deg) invert(1)';
                showNotification('🎮 GOD MODE: ON', 'konami');
                setTimeout(() => { document.body.style.filter = ''; i = 0; }, 5000);
            }
        } else { i = 0; }
    });
}

function initParticleEffects() {
    const style = document.createElement('style');
    style.textContent = `.particle { position: absolute; pointer-events: none; width: 4px; height: 4px; border-radius: 50%; animation: pFloat 1s ease-out forwards; z-index: 1000; } @keyframes pFloat { 0% { transform: scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }`;
    document.head.appendChild(style);
}

function createParticles(el, count = 5) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * rect.width}px`;
        p.style.top = `${Math.random() * rect.height}px`;
        p.style.background = 'var(--neon-a)';
        p.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
        p.style.setProperty('--ty', `${-(Math.random() * 50 + 20)}px`);
        el.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

function showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.style = "position:fixed; top:20px; right:20px; background:#111; color:#fff; padding:15px; border-radius:8px; z-index:9999; border-left:5px solid var(--neon-a); font-family: 'Montserrat', sans-serif; font-size: 14px; pointer-events: none;";
    n.innerHTML = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function initTypewriterEffect() {
    const sub = document.querySelector('.subtitle');
    if (!sub) return;
    const txt = sub.textContent;
    sub.textContent = '';
    let i = 0;
    (function type() {
        if (i < txt.length) { sub.textContent += txt.charAt(i); i++; setTimeout(type, 30); }
    })();
}

function animateCounter(el, start, end, duration, suffix) {
    let startT = null;
    const step = (ts) => {
        if (!startT) startT = ts;
        const progress = Math.min((ts - startT) / duration, 1);
        el.textContent = `Level 3 • XP: ${Math.floor(progress * (end - start) + start)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function playSound(type) {
    const audio = document.getElementById(type === 'click' ? 'clickSound' : 'konamiSound');
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[m]));
}
