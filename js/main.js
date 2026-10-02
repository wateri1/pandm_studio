/**
 * P&M Studio - Main Interactive Logic
 * Vanilla JS, no jQuery.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CURRENT YEAR IN FOOTER ---
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- 2. PHONE MASK ---
    // Mask format: +7 (7XX) XXX-XX-XX
    const phoneInputs = document.querySelectorAll('.phone-mask');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x[1]) {
                e.target.value = '+7 ';
                return;
            }
            if (x[1] !== '7') {
                x[1] = '7'; // Force Kazakhstan code
            }
            e.target.value = '+7 ' + (x[2] ? '(' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
        
        input.addEventListener('focus', function(e) {
            if (e.target.value === '') e.target.value = '+7 (7';
        });
        input.addEventListener('blur', function(e) {
            if (e.target.value === '+7 (7' || e.target.value === '+7 ') e.target.value = '';
        });
    });

    // --- 3. HEADER SCROLL & MOBILE MENU ---
    const header = document.getElementById('header');
    const burgerBtn = document.querySelector('.burger-btn');
    const headerNav = document.querySelector('.header-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
            header.style.padding = '0';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    if (burgerBtn && headerNav) {
        burgerBtn.addEventListener('click', () => {
            // Simplified toggle for demonstration
            if (headerNav.style.display === 'flex') {
                headerNav.style.display = 'none';
            } else {
                headerNav.style.display = 'flex';
                headerNav.style.flexDirection = 'column';
                headerNav.style.position = 'absolute';
                headerNav.style.top = '80px';
                headerNav.style.left = '0';
                headerNav.style.width = '100%';
                headerNav.style.backgroundColor = '#fff';
                headerNav.style.padding = '20px';
                headerNav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }
        });
    }

    // --- 4. MODALS (MicroModal pattern) ---
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('[data-micromodal-close]');

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    };

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    // --- 5. EXIT-INTENT POPUP ---
    let exitIntentShown = localStorage.getItem('pandm_exit_intent_shown');
    
    if (!exitIntentShown) {
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY < 10 && !document.getElementById('exitModal').classList.contains('is-open')) {
                openModal('exitModal');
                localStorage.setItem('pandm_exit_intent_shown', 'true');
            }
        });
    }

    // --- 6. FAQ ACCORDION ---
    window.toggleFaq = function(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Close all others
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.nextElementSibling.style.maxHeight = null;
        });

        // Toggle current
        if (!isExpanded) {
            button.setAttribute('aria-expanded', 'true');
            const answer = button.nextElementSibling;
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    };

    // --- 7. PORTFOLIO CAROUSEL SYNC (MOBILE) ---
    const portfolioGrid = document.querySelector('.portfolio-simple-grid');
    const portfolioDots = document.querySelectorAll('.portfolio-dot');
    
    if (portfolioGrid && portfolioDots.length > 0) {
        portfolioGrid.addEventListener('scroll', () => {
            const scrollLeft = portfolioGrid.scrollLeft;
            const itemWidth = portfolioGrid.firstElementChild ? (portfolioGrid.firstElementChild.offsetWidth + 16) : 1;
            const activeIndex = Math.min(Math.round(scrollLeft / itemWidth), portfolioDots.length - 1);
            
            portfolioDots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, { passive: true });

        portfolioDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'), 10);
                const items = portfolioGrid.querySelectorAll('.portfolio-grid-item');
                if (items[index]) {
                    items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        });
    }

    // --- 8. QUIZ LOGIC ---
    let currentQuizStep = 1;
    const totalQuizSteps = 4;

    window.nextQuizStep = function(step) {
        document.querySelectorAll('.quiz-step').forEach(el => el.classList.remove('active'));
        const stepId = typeof step === 'string' ? `quiz-step-${step}` : `quiz-step-${step}`;
        const targetEl = document.getElementById(stepId);
        if (targetEl) targetEl.classList.add('active');
        
        let progressStep = step;
        if (step === 'constructor') progressStep = 1.5;
        if (step === 4) progressStep = 4;
        
        updateQuizProgress(progressStep);
    };

    window.prevQuizStep = function(step) {
        document.querySelectorAll('.quiz-step').forEach(el => el.classList.remove('active'));
        const stepId = typeof step === 'string' ? `quiz-step-${step}` : `quiz-step-${step}`;
        const targetEl = document.getElementById(stepId);
        if (targetEl) targetEl.classList.add('active');
        
        let progressStep = step;
        if (step === 'constructor') progressStep = 1.5;
        updateQuizProgress(progressStep);
    };

    function updateQuizProgress(step) {
        let percent = (Math.floor(step) / totalQuizSteps) * 100;
        if (step === 1.5) percent = 35; 
        const progressFill = document.getElementById('quiz-progress-fill');
        const currentStepEl = document.getElementById('quiz-current-step');
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (currentStepEl) currentStepEl.textContent = Math.floor(step);
    }

    window.handleStep1Next = function() {
        const selectedType = document.querySelector('input[name="siteType"]:checked');
        if (!selectedType) return;
        
        if (selectedType.value === 'constructor') {
            nextQuizStep('constructor');
        } else {
            nextQuizStep(2);
        }
    };

    window.handleStep2Back = function() {
        const selectedType = document.querySelector('input[name="siteType"]:checked');
        if (selectedType && selectedType.value === 'constructor') {
            prevQuizStep('constructor');
        } else {
            prevQuizStep(1);
        }
    };

    window.openConstructorQuiz = function() {
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
        const constructorRadio = document.querySelector('input[name="siteType"][value="constructor"]');
        if (constructorRadio) constructorRadio.checked = true;
        handleStep1Next();
    };

    window.submitQuizToWhatsApp = function() {
        const siteTypeRadio = document.querySelector('input[name="siteType"]:checked');
        let siteType = siteTypeRadio ? siteTypeRadio.nextElementSibling.querySelector('.option-title').innerText : '';
        
        let blocks = [];
        if (siteTypeRadio && siteTypeRadio.value === 'constructor') {
            document.querySelectorAll('input[name="constructorBlocks"]:checked').forEach(cb => {
                blocks.push(cb.value);
            });
        }
        
        const designStatusRadio = document.querySelector('input[name="designStatus"]:checked');
        let designStatus = designStatusRadio ? designStatusRadio.value : 'Не указано';

        const adStatusRadio = document.querySelector('input[name="adStatus"]:checked');
        let adStatus = adStatusRadio ? adStatusRadio.value : 'Не указано';
        
        let text = `• Заявка с калькулятора (Скидка 5%)\n\nЗдравствуйте! Хочу посоветоваться по разработке сайта.\n\n`;
        text += `• Тип сайта: ${siteType}\n`;
        if (blocks.length > 0) {
            text += `• Выбранные блоки (Конструктор): ${blocks.join(', ')}\n`;
        }
        text += `• Дизайн: ${designStatus}\n`;
        text += `• Реклама и трафик: ${adStatus}\n`;

        const WHATSAPP_PHONE = '77085667448';
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`, '_blank');
        
        document.querySelectorAll('.quiz-step').forEach(el => el.classList.remove('active'));
        document.getElementById('quiz-step-success').classList.add('active');
        document.querySelector('.quiz-progress').style.display = 'none';
    };

    // --- 9. FORM SUBMISSIONS ---
    const WHATSAPP_PHONE = '77085667448';

    function sendToWhatsApp(nameId, taskId, prefix) {
        const nameEl = document.getElementById(nameId);
        const taskEl = document.getElementById(taskId);
        const name = nameEl ? nameEl.value : 'Аноним';
        const task = taskEl ? taskEl.value : '';
        
        let text = `${prefix}\nЗдравствуйте! Меня зовут ${name}.`;
        if (task) {
            text += `\nОписание задачи: ${task}`;
        }
        
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`, '_blank');
    }

    // --- 9. FORM SUBMISSIONS ---
    window.submitHeroForm = function() {
        sendToWhatsApp('hero-name', 'hero-task', '• Заявка с главного экрана');
    };
    window.submitConceptForm = function() {
        sendToWhatsApp('concept-name', 'concept-task', '• Заявка на бесплатный концепт');
    };
    window.submitCtaForm = function() {
        const taskEl = document.getElementById('cta-task');
        const task = taskEl && taskEl.value.trim() ? taskEl.value.trim() : 'Создание сайта под ключ';
        let text = `• Заявка на обсуждение проекта\n\nЗдравствуйте! Хочу обсудить задачу:\n${task}`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`, '_blank');
    };
    window.submitExitForm = function() {
        let text = `• Заявка с сайта (Скидка 10%)\n\nЗдравствуйте! Хочу зафиксировать скидку 10% на разработку сайта.`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`, '_blank');
        closeModal('exitModal');
    };
    window.submitModalForm = function() {
        sendToWhatsApp('modal-name', 'modal-task', '• Быстрая заявка');
        closeModal('contactModal');
    };
});
