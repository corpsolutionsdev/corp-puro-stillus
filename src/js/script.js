// JavaScript para interatividade da landing page

// Módulo de controle de vídeo
const VideoController = {
    init() {
        const videoBackground = document.querySelector('.video-background video');
        if (videoBackground) {
            this.setupVideo(videoBackground);
        }
    },
    
    setupVideo(video) {
        const playVideo = () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log('Erro ao reproduzir vídeo:', error);
                    setTimeout(playVideo, 1000);
                });
            }
        };
        
        playVideo();
        video.addEventListener('loadeddata', playVideo);
        video.addEventListener('canplay', playVideo);
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                playVideo();
            }
        });
        
        document.addEventListener('touchstart', playVideo, { once: true });
        document.addEventListener('click', playVideo, { once: true });
    }
};

// Módulo de navegação
const NavigationController = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupHeaderScroll();
    },
    
    setupMobileMenu() {
        const hamburger = document.querySelector('#hamburger');
        const navDrawer = document.querySelector('#navDrawer');
        const drawerClose = document.querySelector('#drawerClose');
        const drawerOverlay = document.querySelector('.drawer-overlay');
        
        if (!hamburger || !navDrawer) return;
        
        const closeDrawer = () => {
            hamburger.classList.remove('active');
            navDrawer.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.add('active');
            navDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        drawerClose?.addEventListener('click', closeDrawer);
        drawerOverlay?.addEventListener('click', closeDrawer);
        
        document.querySelectorAll('.drawer-nav a').forEach(link => {
            link.addEventListener('click', () => setTimeout(closeDrawer, 150));
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
                closeDrawer();
            }
        });
    },
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    },
    
    setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        let ticking = false;
        
        const updateHeader = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 0) {
                header.classList.remove('in-home');
                header.classList.add('scrolled');
            } else {
                header.classList.add('in-home');
                header.classList.remove('scrolled');
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
        updateHeader();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar módulos
    VideoController.init();
    NavigationController.init();
    
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
    
    // Carrossel de imagens
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (carouselTrack && prevBtn && nextBtn) {
        let currentSlide = 0;
        const totalSlides = 2; // Apenas as imagens originais (sem duplicatas)
        const slideWidth = 25; // 25% por slide (100% / 4 slides)
        
        function updateCarousel() {
            const translateX = -currentSlide * slideWidth;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
            
            // Atualizar indicadores
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        // Event listeners para botões
        nextBtn.addEventListener('click', () => {
            nextSlide();
            pauseAutoPlay();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            pauseAutoPlay();
        });
        
        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                pauseAutoPlay();
            });
        });
        
        // Auto-play do carrossel (mais rápido e suave)
        let autoPlayInterval = setInterval(nextSlide, 3000); // Reduzido para 3 segundos
        
        // Pausar auto-play no hover e retomar quando sair
        const carousel = document.querySelector('.gallery-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(nextSlide, 3000);
            });
        }
        
        // Pausar auto-play quando a página não está visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(autoPlayInterval);
            } else {
                autoPlayInterval = setInterval(nextSlide, 3000);
            }
        });
        
        // Pausar auto-play quando o usuário interage manualmente
        function pauseAutoPlay() {
            clearInterval(autoPlayInterval);
            // Retomar após 10 segundos de inatividade
            setTimeout(() => {
                autoPlayInterval = setInterval(nextSlide, 3000);
            }, 10000);
        }
        
        // Suporte a touch/swipe
        let startX = 0;
        let endX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carouselTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left - próxima imagem
                } else {
                    prevSlide(); // Swipe right - imagem anterior
                }
                pauseAutoPlay();
            }
        }
        
        // Suporte a teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                pauseAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                pauseAutoPlay();
            }
        });
    }
    
    console.log('Studio Puro Stillu\'s - Landing Page carregada com sucesso! ✨');
});
