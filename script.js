// ===============================
// NEON GAMER - script.js CORRIGIDO
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    initAvatarAnimation();
    initXPAnimation();
    initProjects();
    initSocialCards();
    initRecadosSystem(); 
    initKonamiCode();
    initParticleEffects();
    initTypewriterEffect();

    window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    window.showKonamiHint = () => showNotification('Dica: ↑ ↑ ↓ ↓ ← → ← → B A', 'info');
});

function initRecadosSystem() {
    const form = document.getElementById('recadoForm');
    const listaRecados = document.getElementById('listaRecados');
    const totalRecadosEl = document.getElementById('totalRecados');
    const totalLikesEl = document.getElementById('totalLikes');

    if (!form || !listaRecados) return;
    
    let recados = JSON.parse(localStorage.getItem('recados')) || [];
    renderRecados();

    function renderRecados() {
        // Atualiza contadores globais
        if (totalRecadosEl) totalRecadosEl.textContent = recados.length;
        if (totalLikesEl) {
            const likesSoma = recados.reduce((acc, curr) => acc + (curr.likes || 0), 0);
            totalLikesEl.textContent = likesSoma;
        }

        if (recados.length === 0) {
            listaRecados.innerHTML = `<div class="recado-vazio"><span>✨</span><p>Nenhum recado ainda.</p></div>`;
            return;
        }

        // Gera o HTML que o seu CSS antigo reconhece (.recado-item strong, .recado-item p)
        listaRecados.innerHTML = recados.map(recado => `
            <div class="recado-item" style="animation: fadeInUp 0.5s ease both">
                <strong>${escapeHTML(recado.nome)}</strong>
                <span class="recado-data">${recado.data}</span>
                <p>${escapeHTML(recado.texto)}</p>
                <div class="recado-actions">
                    <button class="like-btn" data-id="${recado.id}" data-action="like">❤️ <span>${recado.likes || 0}</span></button>
                    <button class="delete-btn" data-id="${recado.id}" data-action="delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('.submit-btn');
        const btnText = btn.querySelector('.btn-text');
        const nome = this.querySelector('input[name="nome"]').value.trim();
        const texto = this.querySelector('textarea[name="mensagem"]').value.trim();

        if (nome.length < 2 || texto.length < 5) {
            showNotification('⚠️ Nome ou mensagem muito curta!', 'warning');
            return;
        }

        if (btnText) btnText.textContent = "Enviando...";
        btn.disabled = true;

        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                const novo = { 
                    id: Date.now(), 
                    nome, 
                    texto, 
                    data: new Date().toLocaleDateString('pt-BR'), 
                    likes: 0 
                };
                recados.unshift(novo);
                localStorage.setItem('recados', JSON.stringify(recados));
                renderRecados();
                form.reset();
                showNotification('🚀 Recado enviado com sucesso!', 'success');
                createParticles(form, 15);
            } else {
                showNotification('❌ Erro no Formspree.', 'error');
            }
        })
        .catch(() => showNotification('❌ Erro de conexão.', 'error'))
        .finally(() => {
            if (btnText) btnText.textContent = "Enviar Recado";
            btn.disabled = false;
        });
    });

    listaRecados.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === 'like') {
            recados = recados.map(r => r.id === id ? {...r, likes: (r.likes || 0) + 1} : r);
        } else if (action === 'delete') {
            if(!confirm("Excluir da sua tela?")) return;
            recados = recados.filter(r => r.id !== id);
        }
        
        localStorage.setItem('recados', JSON.stringify(recados));
        renderRecados();
    });
}

// --- FUNÇÕES DE APOIO ---
function initAvatarAnimation() {
    const box = document.querySelector('.avatar-box');
    if(box) box.addEventListener('mouseenter', () => createParticles(box, 5));
}

function initXPAnimation() {
    const fill = document.getElementById('xpFill');
    const txt = document.getElementById('xpText');
    if (fill) {
        setTimeout(() => { 
            fill.style.width = '45%'; 
            animateCounter(txt, 0, 45, 2000, '% XP'); 
        }, 800);
    }
}

function initProjects() {
    document.querySelectorAll('.project-card').forEach(c => {
        c.addEventListener('mouseenter', () => c.style.transform = 'translateY(-10px)');
        c.addEventListener('mouseleave', () => c.style.transform = 'translateY(0)');
    });
}

function initSocialCards() {
    document.querySelectorAll('.social-card').forEach(c => c.addEventListener('click', () => playSound('click')));
}

function initKonamiCode() {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let i = 0;
    document.addEventListener('keydown', (e) => {
        if (e.code === seq[i]) { 
            i++; 
            if (i === seq.length) { 
                document.body.classList.add('konami-mode');
                showNotification('🎮 GOD MODE ATIVADO!', 'success');
                setTimeout(() => { 
                    document.body.classList.remove('konami-mode');
                    i = 0; 
                }, 10000);
            }
        } else { i = 0; }
    });
}

function initParticleEffects() {
    if (!document.getElementById('particle-style')) {
        const s = document.createElement('style');
        s.id = 'particle-style';
        s.textContent = `.particle { position: absolute; pointer-events: none; width: 4px; height: 4px; border-radius: 50%; animation: pFloat 1s forwards; z-index: 1000; } @keyframes pFloat { 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }`;
        document.head.appendChild(s);
    }
}

function createParticles(el, count = 5) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * r.width}px`;
        p.style.top = `${Math.random() * r.height}px`;
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
    n.style = "position:fixed; top:20px; right:20px; background:#111; color:#fff; padding:15px; border-radius:8px; z-index:9999; border-left:5px solid var(--neon-a); font-family: sans-serif; box-shadow: 0 0 20px rgba(0,0,0,0.5);";
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
        if (i < txt.length) { 
            sub.textContent += txt.charAt(i); 
            i++; 
            setTimeout(type, 30); 
        } 
    })();
}

function animateCounter(el, start, end, duration, suffix) {
    let startT = null;
    const step = (ts) => {
        if (!startT) startT = ts;
        const progress = Math.min((ts - startT) / duration, 1);
        const val = Math.floor(progress * (end - start) + start);
        if(el) el.textContent = `Level 3 • XP: ${val}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function playSound(type) {
    const a = document.getElementById('clickSound');
    if (a) { a.currentTime = 0; a.play().catch(() => {}); }
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[m]));
}
