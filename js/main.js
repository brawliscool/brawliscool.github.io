// Language Translation System
let currentLang = 'en'; // Default language

const translations = {
    en: {
        // Navigation
        nav_home: 'Home',
        nav_services: 'Services',
        nav_gallery: 'Our Work',
        nav_about: 'About',
        nav_contact: 'Contact',

        // Hero Section
        hero_badge: '#1 Rated in Freestone County',
        hero_title: 'Premium Mobile Car Detailing in',
        hero_location: 'Fairfield, TX',
        hero_description: 'Experience showroom quality at your doorstep. We bring professional auto detailing directly to your home or office with our fully equipped mobile unit.',
        hero_cta: 'Get a Free Quote',
        hero_cta_secondary: 'View Services',

        // Services Section
        services_title: 'Our',
        services_title_highlight: 'Services',
        service_express_title: 'Express Wash & Vacuum',
        service_express_desc: 'Perfect for regular maintenance to keep your vehicle looking fresh.',
        service_express_feature1: 'Hand wash & dry',
        service_express_feature2: 'Wheel clean & tire shine',
        service_express_feature3: 'Interior vacuum',
        service_express_feature4: 'Wipe down dash & console',
        service_express_feature5: 'Clean refined windows',
        service_express_btn: 'Book Express',

        service_standard_title: 'Standard Full Detail',
        service_standard_desc: 'Our most popular package. Deep cleaning inside and out.',
        service_standard_feature1: 'Everything in Express +',
        service_standard_feature2: 'Clay bar treatment',
        service_standard_feature3: 'Hand wax application',
        service_standard_feature4: 'Shampoo seats & carpets',
        service_standard_feature5: 'Leather conditioning',
        service_standard_btn: 'Book Standard',

        service_premium_title: 'Premium Detail',
        service_premium_desc: 'The ultimate restoration for enthusiasts and special occasions.',
        service_premium_feature1: 'Everything in Standard +',
        service_premium_feature2: 'Light machine polish',
        service_premium_feature3: 'Engine bay detail',
        service_premium_feature4: 'Fabric protection',
        service_premium_feature5: 'Plastic debris removal',
        service_premium_btn: 'Book Premium',

        services_addon: '',

        // Gallery
        gallery_title: 'See the',
        gallery_title_highlight: 'Transformation',
        gallery_before: 'Before',
        gallery_after: 'After',

        // About
        about_title: 'About',
        about_title_highlight: 'Us',
        about_desc1: 'We are a locally owned and operated business serving Fairfield, TX and Freestone County. We believe in honest work, fair pricing, and results that speak for themselves.',
        about_desc2: 'Our mobile unit is fully self-contained with water and power, meaning we can service your vehicle anywhere - your driveway, your office parking lot, or wherever is convenient for you.',
        about_service_area: 'Service Area',
        about_travel_note: '*Extended travel fees may apply for locations >25 miles.',
        about_stat: 'Happy Customers',

        // Testimonials
        testimonials_title: 'Recent',
        testimonials_title_highlight: 'Reviews',

        // Contact
        contact_title: 'Ready to',
        contact_title_highlight: 'Shine?',
        contact_desc: 'Fill out the form to get a fast, free quote. We usually respond within 1 hour during business hours.',
        contact_phone_title: 'Call or Text',
        contact_email_title: 'Email Us',
        contact_hours_title: 'Business Hours',
        contact_hours_value: 'Mon - Sat: 8:00 AM - 6:00 PM',

        form_name: 'Full Name',
        form_service: 'Service Type',
        form_service_placeholder: 'Select a service...',
        form_service_express: 'Basic Package ($89)',
        form_service_standard: 'Standard Package ($149)',
        form_service_premium: 'Premium Package ($249)',
        form_vehicle: 'Vehicle Info (Year/Make/Model)',
        form_vehicle_placeholder: 'e.g. 2020 Ford F-150',
        form_requests: 'Any Special Requests?',
        form_requests_placeholder: 'Tell us about any specific stains or concerns...',
        form_submit: 'Get Quote',

        // Footer
        footer_desc: 'Professional mobile car detailing bringing showroom quality to your driveway.',
        footer_quick_links: 'Quick Links',
        footer_legal: 'Legal',
        footer_privacy: 'Privacy Policy',
        footer_terms: 'Terms of Service',
        footer_copyright: '2025 A&J Mobile Detailing. All rights reserved.'
    },
    es: {
        // Navigation
        nav_home: 'Inicio',
        nav_services: 'Servicios',
        nav_gallery: 'Nuestro Trabajo',
        nav_about: 'Acerca de',
        nav_contact: 'Contacto',

        // Hero Section
        hero_badge: '#1 Calificado en el Condado de Freestone',
        hero_title: 'Detallado Móvil Premium de Autos en',
        hero_location: 'Fairfield, TX',
        hero_description: 'Experimente calidad de sala de exhibición en su puerta. Traemos detallado profesional de autos directamente a su hogar u oficina con nuestra unidad móvil completamente equipada.',
        hero_cta: 'Obtenga una Cotización Gratis',
        hero_cta_secondary: 'Ver Servicios',

        // Services Section
        services_title: 'Nuestros',
        services_title_highlight: 'Servicios',
        service_express_title: 'Lavado Rápido y Aspirado',
        service_express_desc: 'Perfecto para mantenimiento regular para mantener su vehículo luciendo fresco.',
        service_express_feature1: 'Lavado y secado a mano',
        service_express_feature2: 'Limpieza de ruedas y brillo de llantas',
        service_express_feature3: 'Aspirado interior',
        service_express_feature4: 'Limpieza de tablero y consola',
        service_express_feature5: 'Ventanas limpias y refinadas',
        service_express_btn: 'Reservar Rápido',

        service_standard_title: 'Detallado Completo Estándar',
        service_standard_desc: 'Nuestro paquete más popular. Limpieza profunda por dentro y por fuera.',
        service_standard_feature1: 'Todo en Rápido +',
        service_standard_feature2: 'Tratamiento con barra de arcilla',
        service_standard_feature3: 'Aplicación de cera a mano',
        service_standard_feature4: 'Champú de asientos y alfombras',
        service_standard_feature5: 'Acondicionamiento de cuero',
        service_standard_btn: 'Reservar Estándar',

        service_premium_title: 'Detallado Premium',
        service_premium_desc: 'La restauración definitiva para entusiastas y ocasiones especiales.',
        service_premium_feature1: 'Todo en Estándar +',
        service_premium_feature2: 'Pulido ligero a máquina',
        service_premium_feature3: 'Detalle del compartimento del motor',
        service_premium_feature4: 'Protección de tela',
        service_premium_feature5: 'Eliminación de residuos plásticos',
        service_premium_btn: 'Reservar Premium',

        services_addon: 'Servicios adicionales disponibles: Restauración de Faros ($40), Eliminación de Pelo de Mascotas ($30+), Detalle del Motor ($50).',

        // Gallery
        gallery_title: 'Vea la',
        gallery_title_highlight: 'Transformación',
        gallery_before: 'Antes',
        gallery_after: 'Después',

        // About
        about_title: 'Acerca de',
        about_title_highlight: 'Nosotros',
        about_desc1: 'Somos un negocio de propiedad local que sirve a Fairfield, TX y el Condado de Freestone. Creemos en el trabajo honesto, precios justos y resultados que hablan por sí mismos.',
        about_desc2: 'Nuestra unidad móvil es completamente autónoma con agua y energía, lo que significa que podemos dar servicio a su vehículo en cualquier lugar: su entrada, el estacionamiento de su oficina o donde sea conveniente para usted.',
        about_service_area: 'Área de Servicio',
        about_travel_note: '*Pueden aplicar tarifas de viaje extendido para ubicaciones >25 millas.',
        about_stat: 'Clientes Satisfechos',

        // Testimonials
        testimonials_title: 'Reseñas',
        testimonials_title_highlight: 'Recientes',

        // Contact
        contact_title: '¿Listo para',
        contact_title_highlight: 'Brillar?',
        contact_desc: 'Complete el formulario para obtener una cotización rápida y gratuita. Generalmente respondemos dentro de 1 hora durante el horario comercial.',
        contact_phone_title: 'Llamar o Enviar Mensaje',
        contact_email_title: 'Envíenos un Correo',
        contact_hours_title: 'Horario Comercial',
        contact_hours_value: 'Lun - Sáb: 8:00 AM - 6:00 PM',

        form_name: 'Nombre Completo',
        form_service: 'Tipo de Servicio',
        form_service_placeholder: 'Seleccione un servicio...',
        form_service_express: 'Paquete Básico ($89)',
        form_service_standard: 'Paquete Estándar ($149)',
        form_service_premium: 'Paquete Premium ($249)',
        form_vehicle: 'Información del Vehículo (Año/Marca/Modelo)',
        form_vehicle_placeholder: 'ej. 2020 Ford F-150',
        form_requests: '¿Alguna Solicitud Especial?',
        form_requests_placeholder: 'Cuéntenos sobre manchas o preocupaciones específicas...',
        form_submit: 'Obtener Cotización',

        // Footer
        footer_desc: 'Detallado móvil profesional de autos que trae calidad de sala de exhibición a su entrada.',
        footer_quick_links: 'Enlaces Rápidos',
        footer_legal: 'Legal',
        footer_privacy: 'Política de Privacidad',
        footer_terms: 'Términos de Servicio',
        footer_copyright: '2025 A&J Mobile Detailing. Todos los derechos reservados.'
    }
};

const SUPABASE_URL = 'https://vjrppghecgcqzyulpnkk.supabase.co';
const QUOTE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/quote`;
const CHAT_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat`;

function translatePage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Update language toggle button
    document.getElementById('langText').textContent = lang === 'en' ? 'ES' : 'EN';

    // Navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        const key = link.getAttribute(`data-${lang}`);
        if (key) link.textContent = key;
    });

    // Hero Section
    const heroBadge = document.querySelector('.hero .badge');
    if (heroBadge) heroBadge.textContent = t.hero_badge;

    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.innerHTML = `${t.hero_title} <span class="highlight">${t.hero_location}</span>`;
    }

    const heroDesc = document.querySelector('.hero p');
    if (heroDesc) heroDesc.textContent = t.hero_description;

    const heroBtns = document.querySelectorAll('.hero .btn');
    if (heroBtns[0]) heroBtns[0].innerHTML = `${t.hero_cta} <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>`;
    if (heroBtns[1]) heroBtns[1].textContent = t.hero_cta_secondary;

    // Services Section
    const servicesTitle = document.querySelector('#services h2');
    if (servicesTitle) {
        servicesTitle.innerHTML = `${t.services_title} <span class="highlight">${t.services_title_highlight}</span>`;
    }

    const serviceCards = document.querySelectorAll('.services-grid .card');
    if (serviceCards[0]) {
        serviceCards[0].querySelector('h3').textContent = t.service_express_title;
        serviceCards[0].querySelector('p').textContent = t.service_express_desc;
        const features = serviceCards[0].querySelectorAll('.feature-list li');
        features[0].innerHTML = `<i class="fas fa-check"></i> ${t.service_express_feature1}`;
        features[1].innerHTML = `<i class="fas fa-check"></i> ${t.service_express_feature2}`;
        features[2].innerHTML = `<i class="fas fa-check"></i> ${t.service_express_feature3}`;
        features[3].innerHTML = `<i class="fas fa-check"></i> ${t.service_express_feature4}`;
        features[4].innerHTML = `<i class="fas fa-check"></i> ${t.service_express_feature5}`;
        serviceCards[0].querySelector('.btn').textContent = t.service_express_btn;
    }

    if (serviceCards[1]) {
        serviceCards[1].querySelector('h3').textContent = t.service_standard_title;
        serviceCards[1].querySelector('p').textContent = t.service_standard_desc;
        const features = serviceCards[1].querySelectorAll('.feature-list li');
        features[0].innerHTML = `<i class="fas fa-check"></i> <strong>${t.service_standard_feature1}</strong>`;
        features[1].innerHTML = `<i class="fas fa-check"></i> ${t.service_standard_feature2}`;
        features[2].innerHTML = `<i class="fas fa-check"></i> ${t.service_standard_feature3}`;
        features[3].innerHTML = `<i class="fas fa-check"></i> ${t.service_standard_feature4}`;
        features[4].innerHTML = `<i class="fas fa-check"></i> ${t.service_standard_feature5}`;
        serviceCards[1].querySelector('.btn').textContent = t.service_standard_btn;
    }

    if (serviceCards[2]) {
        serviceCards[2].querySelector('h3').textContent = t.service_premium_title;
        serviceCards[2].querySelector('p').textContent = t.service_premium_desc;
        const features = serviceCards[2].querySelectorAll('.feature-list li');
        features[0].innerHTML = `<i class="fas fa-check"></i> <strong>${t.service_premium_feature1}</strong>`;
        features[1].innerHTML = `<i class="fas fa-check"></i> ${t.service_premium_feature2}`;
        features[2].innerHTML = `<i class="fas fa-check"></i> ${t.service_premium_feature3}`;
        features[3].innerHTML = `<i class="fas fa-check"></i> ${t.service_premium_feature4}`;
        features[4].innerHTML = `<i class="fas fa-check"></i> ${t.service_premium_feature5}`;
        serviceCards[2].querySelector('.btn').textContent = t.service_premium_btn;
    }

    const addonText = document.querySelector('#services .container > div:last-child p');
    if (addonText) addonText.textContent = t.services_addon;

    // Gallery
    const galleryTitle = document.querySelector('#gallery h2');
    if (galleryTitle) {
        galleryTitle.innerHTML = `${t.gallery_title} <span class="highlight">${t.gallery_title_highlight}</span>`;
    }

    document.querySelectorAll('.label.before').forEach(el => el.textContent = t.gallery_before);
    document.querySelectorAll('.label.after').forEach(el => el.textContent = t.gallery_after);

    // About
    const aboutTitle = document.querySelector('#about h2');
    if (aboutTitle) {
        aboutTitle.innerHTML = `${t.about_title} <span class="highlight">${t.about_title_highlight}</span>`;
    }

    const aboutParas = document.querySelectorAll('#about .contact-layout > div:first-child > p');
    if (aboutParas[0]) aboutParas[0].textContent = t.about_desc1;
    if (aboutParas[1]) aboutParas[1].textContent = t.about_desc2;

    const serviceAreaTitle = document.querySelector('#about h3');
    if (serviceAreaTitle) serviceAreaTitle.textContent = t.about_service_area;

    const travelNote = document.querySelector('#about .contact-layout > div:first-child > p:last-of-type');
    if (travelNote) travelNote.textContent = t.about_travel_note;

    const statText = document.querySelector('#about .contact-layout > div:last-child > div > div:last-child');
    if (statText) statText.textContent = t.about_stat;

    // Testimonials
    const testimonialsTitle = document.querySelector('.testimonial-card').closest('section').querySelector('h2');
    if (testimonialsTitle) {
        testimonialsTitle.innerHTML = `${t.testimonials_title} <span class="highlight">${t.testimonials_title_highlight}</span>`;
    }

    // Contact
    const contactTitle = document.querySelector('#contact h2');
    if (contactTitle) {
        contactTitle.innerHTML = `${t.contact_title} <span class="highlight">${t.contact_title_highlight}</span>`;
    }

    const contactDesc = document.querySelector('#contact .contact-info-block > p');
    if (contactDesc) contactDesc.textContent = t.contact_desc;

    const infoItems = document.querySelectorAll('.info-item h4');
    if (infoItems[0]) infoItems[0].textContent = t.contact_phone_title;
    if (infoItems[1]) infoItems[1].textContent = t.contact_email_title;
    if (infoItems[2]) infoItems[2].textContent = t.contact_hours_title;

    const hoursValue = document.querySelectorAll('.info-item p')[2];
    if (hoursValue) hoursValue.textContent = t.contact_hours_value;

    // Form
    const formLabels = document.querySelectorAll('.form-label');
    if (formLabels[0]) formLabels[0].textContent = t.form_name;
    if (formLabels[1]) formLabels[1].textContent = t.form_service;
    if (formLabels[2]) formLabels[2].textContent = t.form_vehicle;
    if (formLabels[3]) formLabels[3].textContent = t.form_requests;

    const selectOptions = document.querySelectorAll('.form-select option');
    if (selectOptions[0]) selectOptions[0].textContent = t.form_service_placeholder;
    if (selectOptions[1]) selectOptions[1].textContent = t.form_service_express;
    if (selectOptions[2]) selectOptions[2].textContent = t.form_service_standard;
    if (selectOptions[3]) selectOptions[3].textContent = t.form_service_premium;

    const vehicleInput = document.querySelector('.form-input[placeholder*="2020"]');
    if (vehicleInput) vehicleInput.placeholder = t.form_vehicle_placeholder;

    const requestsTextarea = document.querySelector('.form-textarea');
    if (requestsTextarea) requestsTextarea.placeholder = t.form_requests_placeholder;

    const submitBtn = document.querySelector('#quoteForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = t.form_submit;

    // Footer
    const footerDesc = document.querySelector('.footer-about p');
    if (footerDesc) footerDesc.textContent = t.footer_desc;

    const footerTitles = document.querySelectorAll('.footer-title');
    if (footerTitles[0]) footerTitles[0].textContent = t.footer_quick_links;
    if (footerTitles[1]) footerTitles[1].textContent = t.footer_legal;

    const footerLinks = document.querySelectorAll('.footer-links a');
    const footerLinkTexts = [
        t.nav_home, t.nav_services, 'Portfolio', t.nav_contact,
        t.footer_privacy, t.footer_terms
    ];
    footerLinks.forEach((link, i) => {
        if (footerLinkTexts[i]) link.textContent = footerLinkTexts[i];
    });

    const copyright = document.querySelector('.copyright');
    if (copyright) copyright.textContent = `© ${t.footer_copyright}`;

    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Language Toggle Event
document.getElementById('langToggle').addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    translatePage(newLang);
});

// Load saved language preference
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    if (savedLang === 'es') {
        translatePage('es');
    }
});


const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const header = document.querySelector('header');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const Icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        Icon.classList.remove('fa-bars');
        Icon.classList.add('fa-times');
    } else {
        Icon.classList.add('fa-bars');
        Icon.classList.remove('fa-times');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Image Comparison Slider Logic
function initComparisons() {
    const overlays = document.querySelectorAll('.comparison-overlay');

    overlays.forEach(overlay => {
        const wrapper = overlay.parentElement;
        const handle = wrapper.querySelector('.handle');
        let clicked = false;

        // Mouse Events
        wrapper.addEventListener('mousedown', slideReady);
        window.addEventListener('mouseup', slideFinish);

        // Touch Events
        wrapper.addEventListener('touchstart', slideReady);
        window.addEventListener('touchend', slideFinish);

        function slideReady(e) {
            e.preventDefault();
            clicked = true;
            window.addEventListener('mousemove', slideMove);
            window.addEventListener('touchmove', slideMove);
        }

        function slideFinish() {
            clicked = false;
            window.removeEventListener('mousemove', slideMove);
            window.removeEventListener('touchmove', slideMove);
        }

        function slideMove(e) {
            if (!clicked) return;

            const rect = wrapper.getBoundingClientRect();
            let pos = getCursorPos(e);

            // Prevent slider from going out of bounds
            if (pos < 0) pos = 0;
            if (pos > rect.width) pos = rect.width;

            slide(pos);

            function getCursorPos(e) {
                let x = 0;
                e = (e.changedTouches) ? e.changedTouches[0] : e;
                x = e.pageX - rect.left - window.pageXOffset;
                return x;
            }

            function slide(x) {
                overlay.style.width = x + "px";
                handle.style.left = (x / rect.width * 100) + "%"; // Update handle based on percentage to keep it aligned
            }
        }
    });
}

// Initialize sliders
initComparisons();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.card, .hero-content, .comparison-wrapper, .testimonial-card, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

// Form Submission (Supabase Edge Function)
const quoteForm = document.getElementById('quoteForm');

if (quoteForm) {
    const urlParams = new URLSearchParams(window.location.search);

    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = quoteForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        const formData = new FormData(quoteForm);
        const payload = {
            name: formData.get('name')?.toString().trim(),
            phone: formData.get('phone')?.toString().trim(),
            vehicle: formData.get('vehicle')?.toString().trim() || '',
            service: formData.get('service')?.toString(),
            requests: formData.get('requests')?.toString() || '',
            marketingConsent: formData.get('marketingConsent'),
            referer: window.location.href,
            utmSource: urlParams.get('utm_source'),
            utmMedium: urlParams.get('utm_medium'),
            utmCampaign: urlParams.get('utm_campaign')
        };

        if (!payload.name || !payload.phone || !payload.service || !payload.marketingConsent) {
            alert('Please fill out all required fields before submitting.');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch(QUOTE_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to send quote request.');
            }

            btn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = '#10b981';

            setTimeout(() => {
                alert('Your quote request has been received! We will contact you shortly.');
                quoteForm.reset();
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 1400);
        } catch (error) {
            console.error('Quote submission error:', error);
            btn.innerHTML = '<span>Failed</span> <i class="fas fa-times"></i>';
            btn.style.background = '#ef4444';

            setTimeout(() => {
                alert(error.message || 'Failed to submit. Please try again or contact us directly at (903) 555-0123.');
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        }
    });
}

// AI Chat Widget
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// Toggle chat window
chatButton?.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

// Reset chat function
// Reset chat function
function resetChat() {
    // Clear all messages
    chatMessages.innerHTML = '';

    // Add welcome message back
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chat-message bot-message';
    welcomeMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <p>Hi! 👋 I'm Nova, your detailing assistant. How can I help you today?</p>
                <div class="quick-replies">
                    <button class="quick-reply" data-message="What services do you offer?">Services</button>
                    <button class="quick-reply" data-message="What are your prices?">Pricing</button>
                    <button class="quick-reply" data-message="How do I book?">Book Now</button>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(welcomeMessage);

    // Re-attach quick reply listeners
    welcomeMessage.querySelectorAll('.quick-reply').forEach(button => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-message');
            chatInput.value = message;
            sendMessage();
        });
    });
}

chatClose?.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    resetChat();
});

// Close chat when clicking outside
document.addEventListener('click', (e) => {
    if (chatWindow && chatWindow.classList.contains('active') &&
        !chatWindow.contains(e.target) &&
        chatButton && !chatButton.contains(e.target)) {
        chatWindow.classList.remove('active');
        resetChat();
    }
});

// AI Responses Database
const aiResponses = {
    'services': {
        keywords: ['service', 'offer', 'what do you', 'packages', 'detail'],
        response: 'We offer three premium packages:\n\n🚿 **Basic Package ($89)** - Express wash & wax\n⭐ **Standard Package ($149)** - Deep cleaning inside & out\n💎 **Premium Package ($249)** - Complete restoration\n\nWould you like to know more about a specific package?'
    },
    'pricing': {
        keywords: ['price', 'cost', 'how much', 'pricing', 'rates'],
        response: 'Our pricing is simple and transparent:\n\n• Basic: $89\n• Standard: $149 (Most Popular!)\n• Premium: $249\n\nAll prices include mobile service - we come to you! 🚗'
    },
    'booking': {
        keywords: ['book', 'schedule', 'appointment', 'reserve', 'when'],
        response: 'Booking is easy! You can:\n\n1. Fill out our quote form on this page\n2. Call us at (903) 555-0123\n3. Text us anytime\n\nWe typically respond within 1 hour during business hours (Mon-Sat, 8AM-6PM). Ready to book?'
    },
    'location': {
        keywords: ['where', 'location', 'area', 'service area', 'fairfield'],
        response: 'We\'re based in Fairfield, TX and serve all of Freestone County including:\n\n📍 Fairfield\n📍 Teague\n📍 Streetman\n📍 Donie\n\nWe\'re mobile, so we come to you!'
    },
    'time': {
        keywords: ['how long', 'duration', 'time', 'takes'],
        response: 'Service times vary by package:\n\n⏱️ Basic: 1-1.5 hours\n⏱️ Standard: 2-3 hours\n⏱️ Premium: 4-5 hours\n\nWe never rush - quality is our priority!'
    },
    'contact': {
        keywords: ['contact', 'phone', 'email', 'reach', 'call'],
        response: '📞 **Phone:** (903) 555-0123\n📧 **Email:** hello@fairfielddetailing.com\n⏰ **Hours:** Mon-Sat, 8AM-6PM\n\nFeel free to call, text, or email anytime!'
    }
};

// Find best response
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Check for greetings
    if (message.match(/\b(hi|hello|hey|good morning|good afternoon)\b/)) {
        return 'Hello! 👋 How can I help you with your car detailing needs today?';
    }

    // Check for thanks
    if (message.match(/\b(thank|thanks|appreciate)\b/)) {
        return 'You\'re welcome! Is there anything else I can help you with? 😊';
    }

    // Search for keyword matches
    for (const [category, data] of Object.entries(aiResponses)) {
        for (const keyword of data.keywords) {
            if (message.includes(keyword)) {
                return data.response;
            }
        }
    }

    // Default response
    return 'I\'d be happy to help! You can ask me about:\n\n• Our services and packages\n• Pricing\n• Booking an appointment\n• Service area\n• Contact information\n\nOr click one of the quick reply buttons below!';
}

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

    const formattedContent = formatMessageContent(text);

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${isUser ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble">
                ${formattedContent}
            </div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    chatInput.value = '';

    // Show typing state (optional: add a real typing bubble)
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <div class="message-bubble typing-bubble">
                <span class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Use local response only (Client-side Demo Mode)
    // Since we are on a static site, we don't have a backend server for AI.
    // If you add a backend later, uncomment the fetch code below.

    // Simulate network delay for realism
    /* 
    // LOCAL RESPONSES (Uncomment if not using a server)
    setTimeout(() => {
        // Remove typing indicator
        if (typingDiv.parentNode) chatMessages.removeChild(typingDiv);

        const localResponse = getBotResponse(message);
        addMessage(localResponse, false);
    }, 600);
    */

    // SERVER-SIDE CODE (Uses Supabase Edge Function)
    try {
        const response = await fetch(CHAT_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        // Check if response is valid JSON
        const contentType = response.headers.get('content-type');
        if (!response.ok || !contentType || !contentType.includes('application/json')) {
            throw new Error('Chat server unreachable');
        }

        const data = await response.json();

        // Remove typing indicator
        if (typingDiv.parentNode) chatMessages.removeChild(typingDiv);

        if (data.success) {
            addMessage(data.reply, false);
        } else {
            console.warn('Server error, falling back to local:', data.message);
            const localResponse = getBotResponse(message);
            addMessage(localResponse, false);
        }
    } catch (error) {
        if (typingDiv.parentNode) chatMessages.removeChild(typingDiv);
        console.warn('Network error, falling back to local:', error);
        const localResponse = getBotResponse(message);
        addMessage(localResponse, false);
    }
}

// Event listeners
chatSend?.addEventListener('click', sendMessage);
chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Quick replies
document.querySelectorAll('.quick-reply').forEach(button => {
    button.addEventListener('click', () => {
        const message = button.getAttribute('data-message');
        chatInput.value = message;
        sendMessage();
    });
});

function escapeHtmlContent(text = '') {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatMessageContent(rawText = '') {
    const sanitized = escapeHtmlContent(rawText);
    const withBold = sanitized.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const sections = withBold.split(/\n{2,}/).map(section => section.trim()).filter(Boolean);

    if (!sections.length) {
        return `<p>${withBold.replace(/\n/g, '<br>')}</p>`;
    }

    return sections.map(section => formatSection(section)).join('');
}

function formatSection(section) {
    const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
    if (!lines.length) return '';

    const bulletRegex = /^([-*•·]\s+|\d+\.\s+)/;
    const orderedRegex = /^\d+\.\s+/;

    if (lines.every(line => bulletRegex.test(line))) {
        const isOrdered = lines.every(line => orderedRegex.test(line));
        const listItems = lines
            .map(line => line.replace(bulletRegex, '').trim())
            .map(item => `<li>${item}</li>`)
            .join('');
        const tag = isOrdered ? 'ol' : 'ul';
        return `<${tag}>${listItems}</${tag}>`;
    }

    return `<p>${lines.join('<br>')}</p>`;
}
