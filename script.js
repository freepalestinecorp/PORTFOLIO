document.addEventListener("DOMContentLoaded", (event) => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Lock scroll during veil intro
    document.body.classList.add("veil-active");

    // Hide everything until veil opens
    gsap.set(".gs-reveal", { visibility: "visible", opacity: 0 });

    // ========== DIAGONAL VEIL INTRO ==========
    const veilTl = gsap.timeline({
        onComplete: startHeroAnimations
    });

    // Small delay so user sees the white screen, then triangles slide apart
    veilTl
        .to({}, { duration: 0.2 }) // brief white flash
        .to(".veil-top", {
            x: "-100%",
            y: "-100%",
            duration: 1.2,
            ease: "power4.inOut"
        })
        .to(".veil-bottom", {
            x: "100%",
            y: "100%",
            duration: 1.2,
            ease: "power4.inOut"
        }, "<"); // both triangles move simultaneously

    // ========== HERO ANIMATIONS (fires after veil opens) ==========
    function startHeroAnimations() {
        // Unlock scroll and remove veil from DOM
        document.body.classList.remove("veil-active");
        document.getElementById("veilOverlay").classList.add("veil-done");

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Reveal "Open to work" badge and "Contact now" button
        tl.fromTo(".status-badge", 
            { y: -20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1 }
        )
        .fromTo(".btn-contact",
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            "<"
        )
        
        // 2. Reveal text block
        .fromTo(".hero-title-main",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            "-=0.6"
        )
        .fromTo(".hero-title-outline",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            "-=0.6"
        )
        .fromTo(".hero-subtitle",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.5"
        )

        // 3. Reveal brand logos and sparkle
        .fromTo(".hero-content .brand-logo",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
            "-=0.4"
        )
        .fromTo(".sparkle-icon",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "back.out(2)" },
            "-=0.8"
        )

        // 4. Slide up the glassmorphic nav bar
        .fromTo(".glass-nav",
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "back.out(1.5)" },
            "-=0.4"
        );

        // 5. If we are on the About page, animate its content
        if (document.querySelector(".about-main")) {
            gsap.set(".about-main", { opacity: 1 });
            tl.fromTo(".about-visual",
                { x: -60, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
                "-=1.0"
            )
            .fromTo(".about-content",
                { x: 60, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: "expo.out" },
                "-=1.0"
            );
        }
    }

    // ========== SCROLL-TRIGGERED SECTIONS ==========
    
    // Clients Section
    gsap.fromTo(".clients-section", 
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: {
                trigger: ".clients-section",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );

    // Expert/About Section
    gsap.fromTo(".expert-section",
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: {
                trigger: ".expert-section",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );

    // Expert image card slide in from left
    gsap.fromTo(".expert-visual",
        { opacity: 0, x: -60 },
        {
            opacity: 1, x: 0, duration: 1, ease: "power2.out",
            scrollTrigger: {
                trigger: ".expert-section",
                start: "top 75%",
                toggleActions: "play none none none"
            }
        }
    );

    // Expert content slide in from right
    gsap.fromTo(".expert-content",
        { opacity: 0, x: 60 },
        {
            opacity: 1, x: 0, duration: 1, delay: 0.2, ease: "power2.out",
            scrollTrigger: {
                trigger: ".expert-section",
                start: "top 75%",
                toggleActions: "play none none none"
            }
        }
    );

    // Testimonials Section
    gsap.fromTo(".testimonials-section",
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: {
                trigger: ".testimonials-section",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );

    // ========== NAV HOVER & TRANSITION EFFECTS ==========
    const navItems = document.querySelectorAll(".nav-item:not(.active)");
    navItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            gsap.to(item, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        item.addEventListener("mouseleave", () => {
            gsap.to(item, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
    });

    // Page Transition Logic
    document.querySelectorAll("a.nav-item").forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#")) return;

            const currentPath = window.location.pathname;
            const isHomePage = currentPath === "/" || currentPath.endsWith("/index.html");
            
            const linkPath = href.split('#')[0];
            const isLinkToHome = linkPath === "" || linkPath === "index.html" || linkPath === "/";
            const isLinkToCurrent = (isHomePage && isLinkToHome) || (!isHomePage && linkPath === currentPath.split('/').pop());

            if (!isLinkToCurrent) {
                e.preventDefault();
                
                // Bring veil back
                const veil = document.getElementById("veilOverlay");
                veil.classList.remove("veil-done");
                veil.style.display = "block";
                
                // Animate veil closing
                gsap.to(".veil-top", { x: "0%", y: "0%", duration: 1.0, ease: "power4.inOut" });
                gsap.to(".veil-bottom", { x: "0%", y: "0%", duration: 1.0, ease: "power4.inOut", onComplete: () => {
                    window.location.href = href;
                }});
            }
        });
    });



    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains("active")) {
                    otherItem.classList.remove("active");
                }
            });
            // Toggle current item
            item.classList.toggle("active");
        });
    });

    // ========== BLUEPRINT ACCORDION ==========
    const blueprintItems = document.querySelectorAll(".blueprint-item");
    blueprintItems.forEach(item => {
        const question = item.querySelector(".blueprint-question");
        if (question) {
            question.addEventListener("click", () => {
                // Close other items
                blueprintItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("active")) {
                        otherItem.classList.remove("active");
                    }
                });
                // Toggle current item
                item.classList.toggle("active");
            });
        }
    });

    // ========== INTERACTIVE CANVAS BACKGROUND ==========
    class InteractiveDots {
        constructor(containerSelector) {
            this.container = document.querySelector(containerSelector);
            if (!this.container) return;

            this.canvas = document.createElement('canvas');
            this.canvas.classList.add('interactive-bg');
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '0';
            
            if (getComputedStyle(this.container).position === 'static') {
                this.container.style.position = 'relative';
            }
            
            this.container.insertBefore(this.canvas, this.container.firstChild);
            
            this.ctx = this.canvas.getContext('2d');
            this.dotColor = '#94A3B8';
            this.spacing = 35; 
            this.dotRadius = 2.5; 
            
            this.particles = [];
            this.mouse = { x: -1000, y: -1000, radius: 150 };
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });

            this.container.addEventListener('click', (e) => {
                const rect = this.container.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                
                for (let p of this.particles) {
                    let dx = clickX - p.x;
                    let dy = clickY - p.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 250) {
                        let force = (250 - distance) / 250;
                        p.vx -= (dx / distance) * force * 20;
                        p.vy -= (dy / distance) * force * 20;
                    }
                }
            });
            
            this.animate();
        }
        
        resize() {
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
            this.initParticles();
        }
        
        initParticles() {
            this.particles = [];
            const cols = Math.floor(this.canvas.width / this.spacing) + 2;
            const rows = Math.floor(this.canvas.height / this.spacing) + 2;
            
            for (let i = -1; i < cols; i++) {
                for (let j = -1; j < rows; j++) {
                    this.particles.push({
                        x: i * this.spacing,
                        y: j * this.spacing,
                        baseX: i * this.spacing,
                        baseY: j * this.spacing,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        }
        
        animate() {
            requestAnimationFrame(() => this.animate());
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.dotColor;
            this.ctx.globalAlpha = 0.6;
            
            for (let p of this.particles) {
                let dx = this.mouse.x - p.x;
                let dy = this.mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (this.mouse.radius - distance) / this.mouse.radius;
                    let directionX = forceDirectionX * force * -4;
                    let directionY = forceDirectionY * force * -4;
                    
                    p.vx += directionX;
                    p.vy += directionY;
                }
                
                p.vx += (p.baseX - p.x) * 0.04;
                p.vy += (p.baseY - p.y) * 0.04;
                
                p.vx *= 0.85;
                p.vy *= 0.85;
                
                p.x += p.vx;
                p.y += p.vy;
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, this.dotRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    new InteractiveDots('.faq-section');
    new InteractiveDots('.integrations-section');
    new InteractiveDots('.expert-section');

    // ========== BLUEPRINT INTERACTIVITY ==========
    const blueprintSection = document.querySelector('.blueprint-section');
    const blueprintImg = document.querySelector('.blueprint-main-img');
    const colorDots = document.querySelectorAll('.color-dot');
    const toolbarIcons = document.querySelectorAll('.float-toolbar i');

    if (blueprintSection && blueprintImg) {
        // Color changing
        colorDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const color = window.getComputedStyle(e.target).backgroundColor;
                blueprintSection.style.backgroundColor = color;
            });
        });

        // Toolbar Icons (Mobile/Desktop view)
        toolbarIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                toolbarIcons.forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                
                if (e.target.classList.contains('ph-device-mobile')) {
                    blueprintImg.classList.add('mobile-view');
                } else if (e.target.classList.contains('ph-desktop')) {
                    blueprintImg.classList.remove('mobile-view');
                }
            });
        });
    }

    // ========== FRAMER 3D CAROUSEL ==========
    function initFramerCarousel() {
        const carousel = document.querySelector('.framer-carousel');
        if (!carousel) return;

        const cards = Array.from(document.querySelectorAll('.fcard'));
        if (cards.length === 0) return;
        
        const totalCards = cards.length;
        let angle = 0;

        function animate() {
            // Speed of rotation
            angle -= 0.002;
            
            // Adjust radius based on screen size
            const rx = window.innerWidth > 1024 ? 500 : (window.innerWidth > 768 ? 350 : 200);
            const rz = window.innerWidth > 768 ? 350 : 200;

            cards.forEach((card, i) => {
                // Spread cards evenly around the circle
                const cardAngle = angle + (i * (Math.PI * 2) / totalCards);
                
                const x = Math.sin(cardAngle) * rx;
                const z = Math.cos(cardAngle) * rz;
                
                // Translate so front is z=0, back is z = -2*rz
                const translatedZ = z - rz;
                
                // Normalize Z to 0..1 for scale/opacity
                // Front = 1, Back = 0
                const normalizedZ = (translatedZ + (2 * rz)) / (2 * rz);
                
                // Back cards are smaller and more transparent
                const scale = 0.65 + (0.35 * normalizedZ);
                const opacity = 0.4 + (0.6 * normalizedZ);
                
                card.style.transform = `translate3d(${x}px, 0px, ${translatedZ}px) scale(${scale})`;
                card.style.opacity = opacity;
                
                // Z-index ensures front cards cover back cards
                card.style.zIndex = Math.round(normalizedZ * 100);
            });

            requestAnimationFrame(animate);
        }
        
        // Start loop
        requestAnimationFrame(animate);
    }
    
    // Initialize immediately if present
    initFramerCarousel();

    // ========== PORTFOLIO FILTERING ==========
    const filterPills = document.querySelectorAll('.filter-pill');

    if (filterPills.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Remove active class from all pills
                filterPills.forEach(p => p.classList.remove('active'));
                // Add active class to clicked pill
                pill.classList.add('active');

                const filterValue = pill.textContent.trim().toLowerCase();

                // Select cards dynamically
                const currentCards = document.querySelectorAll('.project-showcase-card');
                
                currentCards.forEach(card => {
                    const tagElement = card.querySelector('.project-tag');
                    const category = tagElement ? tagElement.textContent.trim().toLowerCase() : '';

                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========== MAGNETIC BUTTONS & LINKS ==========
    const magneticElements = document.querySelectorAll('.nav-item, .btn-contact, .btn-hero-rec');
    
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button itself
            gsap.to(elem, {
                duration: 0.3,
                x: x * 0.3,
                y: y * 0.3,
                ease: "power2.out"
            });
            
            // Subtle parallax for child elements
            const children = elem.querySelectorAll('span, i');
            if (children.length > 0) {
                gsap.to(children, {
                    duration: 0.3,
                    x: x * 0.15,
                    y: y * 0.15,
                    ease: "power2.out"
                });
            }
        });

        elem.addEventListener('mouseleave', () => {
            // Snap back to original position
            gsap.to(elem, {
                duration: 0.7,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.4)"
            });
            
            const children = elem.querySelectorAll('span, i');
            if (children.length > 0) {
                gsap.to(children, {
                    duration: 0.7,
                    x: 0,
                    y: 0,
                    ease: "elastic.out(1, 0.4)"
                });
            }
        });
    });


    // ========== PARALLAX IMAGES (About Hero) ==========
    // Check if we are on the page with these images
    if (document.querySelector('.about-hero-recreation')) {
        // Main left image moves slightly slower (upward)
        gsap.to(".hero-img-main-left", {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-hero-recreation",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Sub left image moves faster (upward)
        gsap.to(".hero-img-sub-left", {
            y: -120,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-hero-recreation",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Main right image moves very slowly (upward)
        gsap.to(".hero-img-main-right", {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-hero-recreation",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Sub right image moves very fast (upward)
        gsap.to(".hero-img-sub-right", {
            y: -150,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-hero-recreation",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // ========== 3D TILT EFFECT (Cards & Images) ==========
    function applyTiltEffect(selector) {
        const tiltElements = document.querySelectorAll(selector);
        tiltElements.forEach(elem => {
            gsap.set(elem, { transformPerspective: 1000 });

            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -15; 
                const rotateY = ((x - centerX) / centerX) * 15;
                
                gsap.to(elem, {
                    duration: 0.3, rotateX: rotateX, rotateY: rotateY, y: -10,
                    ease: "power2.out", overwrite: "auto"
                });
            });

            elem.addEventListener('mouseleave', () => {
                gsap.to(elem, {
                    duration: 0.8, rotateX: 0, rotateY: 0, y: 0,
                    ease: "elastic.out(1, 0.4)", overwrite: "auto"
                });
            });
        });
    }

    applyTiltEffect('.service-card, .hero-img-main-left img, .hero-img-main-right img, .hero-img-sub-left img, .hero-img-sub-right img, .project-showcase-card');

    // ========== DYNAMIC PORTFOLIO ==========
    if (document.body.classList.contains('portfolio-page')) {
        initPortfolio();
    }

    async function initPortfolio() {
        try {
            const projects = window.PORTFOLIO_DATA || [];
            
            const filtersContainer = document.getElementById('dynamic-category-filters');
            const gridContainer = document.getElementById('dynamic-portfolio-grid');
            if (!filtersContainer || !gridContainer) return;

            // Build unique categories
            const categories = new Set();
            projects.forEach(p => p.categories.forEach(c => categories.add(c)));
            
            // Render filter pills
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'filter-pill';
                btn.textContent = cat;
                btn.dataset.filter = cat;
                filtersContainer.appendChild(btn);
            });

            // Render projects
            function renderProjects(filterCategory) {
                gridContainer.innerHTML = '';
                const filtered = filterCategory === 'All' 
                    ? projects 
                    : projects.filter(p => p.categories.includes(filterCategory));

                filtered.forEach(p => {
                    // Create slug from title
                    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    
                    const card = document.createElement('a');
                    card.href = `case-study.html?id=${slug}`;
                    card.className = 'project-showcase-card gs-reveal';
                    card.style.textDecoration = 'none';
                    
                    card.innerHTML = `
                        <div class="project-image-container">
                            <img src="${p.img}" alt="${p.title}" loading="lazy">
                            <div class="project-overlay">
                                <div class="view-project-btn">
                                    <span>View Case Study</span>
                                    <i class="ph-bold ph-arrow-up-right"></i>
                                </div>
                            </div>
                        </div>
                        <div class="project-info">
                            <h3 class="project-title">${p.title}</h3>
                            <div class="project-tags">
                                ${p.categories.map(c => `<span class="project-tag">${c}</span>`).join('')}
                            </div>
                        </div>
                    `;
                    gridContainer.appendChild(card);
                });

                // Re-apply tilt effect to new cards and trigger ScrollTrigger refresh
                applyTiltEffect('.project-showcase-card');
                ScrollTrigger.refresh();
            }

            renderProjects('All');

            // Filter click events
            filtersContainer.addEventListener('click', (e) => {
                if(e.target.classList.contains('filter-pill')) {
                    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    renderProjects(e.target.dataset.filter);
                }
            });

        } catch (e) {
            console.error("Error loading portfolio data:", e);
        }
    }
});
