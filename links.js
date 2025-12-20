document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Lógica do Horário de Funcionamento ---
    function atualizarStatus() {
        const statusBadge = document.querySelector('.status-badge');
        const now = new Date();
        const dia = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const hora = now.getHours();
        
        let texto = "";
        let aberto = false;

        // Configurações
        const horaAbre = 9;
        const horaFecha = 20;

        // Lógica
        if (dia === 0) { 
            // Domingo -> Abre Terça
            texto = "Abre terça-feira às 9h";
            aberto = false;
        } else if (dia === 1) { 
            // Segunda -> Abre Terça (Amanhã)
            texto = "Abre amanhã às 9h";
            aberto = false;
        } else if (dia >= 2 && dia <= 6) { 
            // Terça a Sábado
            if (hora >= horaAbre && hora < horaFecha) {
                // Dentro do horário (9h às 17h59)
                texto = "Aberto hoje até as 20h";
                aberto = true;
            } else if (hora < horaAbre) {
                // Antes de abrir (Antes das 9h)
                texto = "Abre hoje às 9h";
                aberto = false;
            } else {
                // Depois de fechar (Depois das 18h)
                if (dia === 6) {
                    // Se for Sábado a noite -> Abre Terça
                    texto = "Abre terça-feira às 9h";
                } else {
                    // Terça a Sexta a noite -> Abre Amanhã
                    texto = "Abre amanhã às 9h";
                }
                aberto = false;
            }
        }

        // Atualiza o HTML
        // Se fechado, muda a bolinha para vermelho (#e74c3c), se aberto verde (#2ecc71)
        const corDot = aberto ? '#2ecc71' : '#e74c3c'; 
        
        statusBadge.innerHTML = `
            <span class="status-dot" style="background-color: ${corDot}; box-shadow: 0 0 5px ${corDot};"></span> 
            ${texto}
        `;
    }

    // Executa a função
    atualizarStatus();


    // --- 2. Animação de entrada dos botões (Mantida) ---
    const links = document.querySelectorAll('.link-btn');
    links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });

    // --- 3. Funcionalidade do botão Compartilhar (Mantida) ---
    const shareBtn = document.getElementById('btn-share');
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'Studio Classe',
            text: 'Agende seu horário e conheça a barbearia Studio Classe!',
            url: window.location.href
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (err) {}
        } else {
            navigator.clipboard.writeText(window.location.href);
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '<i class="fas fa-check"></i> Link Copiado!';
            setTimeout(() => { shareBtn.innerHTML = originalText; }, 2000);
        }
    });
});

document.getElementById('btn-compartilhar').addEventListener('click', async () => {
    const urlAtual = window.location.href;
    const titulo = document.title;
    
    // Verifica se você está testando localmente (Localhost ou IP numérico)
    // Isso é necessário porque o menu nativo do Android trava ao tentar ler IPs locais.
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.hostname.startsWith('192.168.');

    // Lógica: Só abre o menu nativo se tiver suporte E NÃO for localhost
    if (navigator.share && !isLocalhost) {
        try {
            await navigator.share({
                title: titulo,
                text: 'Dê uma olhada nisto:',
                url: urlAtual
            });
        } catch (err) {
            console.log('Compartilhamento cancelado');
        }
    } else {
        // MODO SEGURANÇA: Copia o link (Para PC ou Testes Locais)
        try {
            await navigator.clipboard.writeText(urlAtual);
            alert('Link copiado! (O menu nativo não abre em Localhost para evitar travamentos)');
        } catch (err) {
            alert('Erro ao copiar o link.');
        }
    }
});
