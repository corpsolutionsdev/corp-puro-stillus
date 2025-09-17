// JavaScript para interatividade da landing page

document.addEventListener('DOMContentLoaded', function() {
    // Controlar video background
    const videoBackground = document.querySelector('.video-background video');
    if (videoBackground) {
        // Pausar vídeo em dispositivos móveis para economizar bateria
        if (window.innerWidth <= 768) {
            videoBackground.pause();
        }
        
        // Pausar vídeo quando a página não está visível
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                videoBackground.pause();
            } else {
                videoBackground.play();
            }
        });
    }
    
    // Controlar loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Função para esconder o loading
    function hideLoading() {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    // Esconder loading quando a página estiver completamente carregada
    window.addEventListener('load', function() {
        // Adicionar um pequeno delay para mostrar o loading
        setTimeout(hideLoading, 1500);
    });
    
    // Fallback: esconder loading após 3 segundos máximo
    setTimeout(hideLoading, 3000);
    // Menu mobile com navigation drawer
    const hamburger = document.querySelector('#hamburger');
    const navDrawer = document.querySelector('#navDrawer');
    const drawerClose = document.querySelector('#drawerClose');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    
    // Abrir drawer
    hamburger.addEventListener('click', function() {
        hamburger.classList.add('active');
        navDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne scroll do body
    });
    
    // Fechar drawer
    function closeDrawer() {
        hamburger.classList.remove('active');
        navDrawer.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaura scroll do body
    }
    
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    
    // Fechar drawer ao clicar em um link
    document.querySelectorAll('.drawer-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Pequeno delay para permitir que a animação de clique seja visível
            setTimeout(closeDrawer, 150);
        });
    });
    
    // Fechar drawer com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
            closeDrawer();
        }
    });
    
    // Scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Ajuste para o header fixo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header transparente com blur no scroll (exceto na home)
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero');
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Aplicar blur assim que começar a rolar (scrollTop > 0)
        if (scrollTop > 0) {
            // Com scroll: navbar com blur
            header.classList.remove('in-home');
            header.classList.add('scrolled');
        } else {
            // No topo: navbar transparente sem blur
            header.classList.add('in-home');
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Inicializar estado da navbar
    updateHeader();
    
    // Botão voltar ao topo
    const backToTop = document.querySelector('#backToTop');
    
    // Mostrar/ocultar botão baseado no scroll
    function toggleBackToTop() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    // Scroll suave para o topo
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Adicionar listener para scroll
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Aplicar diferentes animações baseadas no tipo de elemento
                const element = entry.target;
                
                if (element.classList.contains('service-card')) {
                    element.classList.add('fade-in-scale');
                } else if (element.classList.contains('contact-item')) {
                    element.classList.add('fade-in-left');
                } else if (element.classList.contains('social-icon')) {
                    element.classList.add('bounce-in');
                } else if (element.classList.contains('about-text')) {
                    element.classList.add('fade-in-up');
                } else if (element.classList.contains('contact-location-section')) {
                    element.classList.add('fade-in-right');
                } else {
                    element.classList.add('fade-in-up');
                }
                
                // Adicionar delay escalonado para elementos múltiplos
                element.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.service-card, .contact-item, .social-icon, .about-text, .contact-location-section');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Efeito parallax no hero
    const heroBackground = document.querySelector('.hero-background img');
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Contador animado (se necessário)
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Efeito de hover nos cards de serviço, itens de contato e ícones sociais
    const interactiveElements = document.querySelectorAll('.service-card, .contact-item, .social-icon');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!this.classList.contains('touch-active')) {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (!this.classList.contains('touch-active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Botão WhatsApp com animação
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Adicionar efeito de clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Validação de formulário (se houver)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aqui você pode adicionar lógica de envio de formulário
            alert('Formulário enviado com sucesso!');
        });
    });
    
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Adicionar classe 'loaded' ao body quando a página carregar completamente
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Efeito de digitação no título (opcional)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Aplicar efeito de digitação ao título principal (opcional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth > 768) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
    
    // Smooth reveal para seções
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    // Adicionar efeito de partículas no background (opcional)
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(212, 175, 55, 0.3);
                border-radius: 50%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            particlesContainer.appendChild(particle);
        }
        
        document.body.appendChild(particlesContainer);
    }
    
    // Adicionar CSS para animação de partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Ativar partículas apenas em telas maiores
    if (window.innerWidth > 768) {
        createParticles();
    }
    
    // Detectar dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Otimizações para mobile
        document.body.classList.add('mobile-device');
        
        // Melhorar interação touch em mobile
        const hoverElements = document.querySelectorAll('.service-card, .contact-item, .social-icon');
        hoverElements.forEach(el => {
            el.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.classList.add('touch-active');
                this.style.transform = 'translateY(-3px) scale(1.01)';
            });
            
            el.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                    this.style.transform = 'translateY(0) scale(1)';
                }, 150);
            });
            
            el.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Adicionar CSS para touch
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .touch-active {
            transform: translateY(-3px) scale(1.01) !important;
            transition: transform 0.1s ease !important;
            background: rgba(212, 175, 55, 0.1) !important;
        }
        
        .mobile-device .contact-item {
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(212, 175, 55, 0.2);
        }
        
        .mobile-device .social-icon {
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(212, 175, 55, 0.3);
        }
    `;
    document.head.appendChild(touchStyle);
    
    // Definir ano atual no footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    console.log('Studio Puro Stillu\'s - Landing Page carregada com sucesso! ✨');
});
