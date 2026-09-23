/**
 * NEXUS Web Studio - Main Interactive Logic
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
    let exitIntentShown = localStorage.getItem('nexus_exit_intent_shown');
    
    if (!exitIntentShown) {
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY < 10 && !document.getElementById('exitModal').classList.contains('is-open')) {
                openModal('exitModal');
                localStorage.setItem('nexus_exit_intent_shown', 'true');
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

    // --- 7. PORTFOLIO SWITCHER ---
    window.switchPortfolio = function(id) {
        // Update active class on list items
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.classList.remove('active');
        });
        const clickedItem = document.querySelector(`.portfolio-list .portfolio-item:nth-child(${id})`);
        if (clickedItem) clickedItem.classList.add('active');

        // Update image/content inside laptop
        document.querySelectorAll('.portfolio-scroll-content').forEach(content => {
            content.style.display = 'none';
        });
        const targetContent = document.getElementById(`portfolio-image-${id}`);
        if (targetContent) {
            targetContent.style.display = 'block';
            // Scroll to top of the laptop viewport
            document.getElementById('portfolio-viewport').scrollTop = 0;
        }
    };

    // --- 8. QUIZ LOGIC ---
    let currentQuizStep = 1;
    const totalQuizSteps = 3;

    window.nextQuizStep = function(step) {
        document.querySelectorAll('.quiz-step').forEach(el => el.classList.remove('active'));
        document.getElementById(`quiz-step-${step}`).classList.add('active');
        updateQuizProgress(step);
    };

    window.prevQuizStep = function(step) {
        document.querySelectorAll('.quiz-step').forEach(el => el.classList.remove('active'));
        document.getElementById(`quiz-step-${step}`).classList.add('active');
        updateQuizProgress(step);
    };

    function updateQuizProgress(step) {
        const percent = (step / totalQuizSteps) * 100;
        document.getElementById('quiz-progress-fill').style.width = `${percent}%`;
        document.getElementById('quiz-current-step').textContent = step;
    }

    window.submitQuiz = function() {
        document.querySelectorAll('.quiz-step').forEach(el => el.classList.remove('active'));
        document.getElementById('quiz-step-success').classList.add('active');
        document.querySelector('.quiz-progress').style.display = 'none';
        // Here you would typically send data to server/WhatsApp
    };

    // --- 9. FORM SUBMISSIONS (Mock) ---
    window.submitHeroForm = function() {
        alert("Заявка с главного экрана принята! Мы свяжемся с вами.");
    };
    window.submitConceptForm = function() {
        alert("Заявка на бесплатный концепт принята! Дизайнер уже приступил.");
    };
    window.submitCtaForm = function() {
        alert("Сообщение отправлено! Ждите звонка.");
    };
    window.submitExitForm = function() {
        alert("Скидка 10% зафиксирована! Менеджер свяжется с вами.");
        closeModal('exitModal');
    };
    window.submitModalForm = function() {
        alert("Заявка отправлена!");
        closeModal('contactModal');
    };
});
