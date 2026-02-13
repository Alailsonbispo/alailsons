document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initXP();
    initRecados();
    initKonami();
});

function initTypewriter() {
    const sub = document.querySelector('.subtitle');
    const text = sub.innerHTML;
    sub.innerHTML = '';
    let i = 0;
    function type() {
        if (i <= text.length) {
            sub.innerHTML = text.substring(0, i) + '<span class="cursor">|</span>';
            if (text.charAt(i) === '<') {
                i = text.indexOf('>', i) + 1;
            } else {
                i++;
            }
            setTimeout(type, 30);
        } else {
            sub.innerHTML = text; // Remove cursor at end
        }
    }
    setTimeout(type, 500);
}

function initXP() {
    const fill = document.querySelector('.xp-fill');
    const text = document.querySelector('.xp-text');
    setTimeout(() => {
        fill.style.width = '45%';
        let count = 0;
        let interval = setInterval(() => {
            if(count >= 45) {
                count = 45;
                clearInterval(interval);
            }
            text.textContent = `ADS 5º Semestre • XP: ${count}% para Formatura`;
            count++;
        }, 30);
    }, 1000);
}

function initRecados() {
    const form = document.getElementById('recadoForm');
    const list = document.getElementById('listaRecados');
    let storage = JSON.parse(localStorage.getItem('recados')) || [];

    const escapeHTML = (str) => str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));

    const render = () => {
        list.innerHTML = storage.map(r => `
            <div style="background:#111; border-left:2px solid #fff; padding:15px; margin-top:15px; border-radius:4px;">
                <strong>${escapeHTML(r.nome)}</strong>
                <p style="color:#999; font-size:0.9rem;">${escapeHTML(r.msg)}</p>
            </div>
        `).join('');
    };
    render();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        try {
            const response = await fetch("https://formspree.io/f/mqedkvda", {
                method: "POST",
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                storage.unshift({ nome: form.nome.value, msg: form.mensagem.value });
                localStorage.setItem('recados', JSON.stringify(storage));
                render();
                form.reset();
            }
        } catch (err) { alert('Erro ao enviar'); }
        btn.disabled = false;
        btn.textContent = 'Enviar Mensagem';
    });
}

function initKonami() {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let cur = 0;
    document.addEventListener('keydown', (e) => {
        if (e.code === seq[cur]) {
            cur++;
            if (cur === seq.length) {
                document.body.style.filter = 'invert(1)';
                setTimeout(() => document.body.style.filter = 'none', 5000);
                cur = 0;
            }
        } else { cur = 0; }
    });
}

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.showKonamiHint = () => alert('Tente o código Konami no teclado!');