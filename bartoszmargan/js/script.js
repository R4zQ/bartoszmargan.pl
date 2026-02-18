/* zmiana jezyka */
const languageButton = document.getElementById('languageButton');
const languageFlag = document.getElementById('languageFlag');
let currentLang = 'pl';

function changeLanguage(lang) {
    try {
        currentLang = lang;
        document.documentElement.lang = lang;

        if (languageFlag) {
            languageFlag.src = `assets/change_lang/${lang === 'pl' ? 'polish.png' : 'english.png'}`;
        }

        const langText = document.getElementById('langText');
        if (langText) langText.textContent = lang.toUpperCase();

        document.querySelectorAll('[data-lang]').forEach(element => {
            try {
                const translations = JSON.parse(element.getAttribute('data-lang'));
                if (translations?.[lang]) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translations[lang];
                    } else {
                        element.textContent = translations[lang];
                    }
                }
            } catch (e) {
                console.error('Translation error:', e);
            }
        });

    } catch (error) {
        console.error('Language change error:', error);
    }
}

if (languageButton) {
    languageButton.addEventListener('click', () => {
        const newLang = currentLang === 'pl' ? 'en' : 'pl';
        changeLanguage(newLang);
        localStorage.setItem('preferredLanguage', newLang);
    });
}

/* pobieranie CV */
const downloadCV = document.getElementById('downloadCV');
if (downloadCV) {
    downloadCV.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            const link = document.createElement('a');
            link.href = 'assets/cv/Bartosz_Margan_CV.pdf';
            link.download = 'Bartosz_Margan_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('CV download error:', error);
        }
    });
}

/* nawigacja i home */
function initHomePage() {
    const navLinks = document.querySelectorAll('.navbar a, .cta-button');
    if (navLinks.length > 0) {
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => {
                        history.replaceState(null, null, ' ');
                    }, 1000);
                }
            });
        });
    }

    /* easter egg */
    const pageCorner = document.getElementById('pageCorner');
    const easterEgg = document.getElementById('easterEgg');
    const closeEgg = document.getElementById('closeEgg');

    if (pageCorner && easterEgg && closeEgg) {
        pageCorner.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'rotate(5deg)';
            setTimeout(() => this.style.transform = 'rotate(0)', 300);
            easterEgg.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeEgg.addEventListener('click', function() {
            easterEgg.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    /* scroll down -> projekty */
    const scrollDownBtn = document.querySelector('.scroll-down-btn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            const projects = document.getElementById('projects');
            if (projects) {
                window.scrollTo({
                    top: projects.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/* animacja tekstu */
let textAnimationTimer = null;

function initializeTextAnimation() {
    const nameElement = document.getElementById('changing-name');

    if (!nameElement) {
        return;
    }

    const ANIMATION_TEXT = ["jestem Bartosz.", "jestem Bartek.", "jestem RazQ."];
    const TYPING_SPEED_MS = 150;
    const DELETING_SPEED_MS = 100;
    const PAUSE_BEFORE_DELETE_MS = 2000;
    const INITIAL_DELAY_MS = 500;

    let currentTextIndex = 0;
    let currentCharPosition = 0;
    let isDeleting = false;

    function animateText() {
        const currentText = ANIMATION_TEXT[currentTextIndex % ANIMATION_TEXT.length];

        if (!isDeleting) {
            nameElement.textContent = currentText.substring(0, currentCharPosition);
            currentCharPosition++;

            if (currentCharPosition > currentText.length) {
                textAnimationTimer = setTimeout(() => {
                    isDeleting = true;
                    animateText();
                }, PAUSE_BEFORE_DELETE_MS);
                return;
            }
        } else {
            nameElement.textContent = currentText.substring(0, currentCharPosition);
            currentCharPosition--;

            if (currentCharPosition < 0) {
                isDeleting = false;
                currentTextIndex++;
            }
        }

        const animationSpeed = isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS;
        textAnimationTimer = setTimeout(animateText, animationSpeed);
    }

    if (textAnimationTimer) {
        clearTimeout(textAnimationTimer);
    }

    textAnimationTimer = setTimeout(animateText, INITIAL_DELAY_MS);

    window.addEventListener('beforeunload', () => {
        if (textAnimationTimer) {
            clearTimeout(textAnimationTimer);
        }
    });
}

/* animacja wejscia sekcji */
function initSectionObserver() {
    const sections = document.querySelectorAll('#projects, #skills, #experience, #contact');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        if (section.getBoundingClientRect().top > window.innerHeight * 0.85) {
            section.classList.add('section-hidden');
        }
        observer.observe(section);
    });
}

/* projekty */
function initProjectCarousel() {
    const carousel = document.querySelector('.projects-carousel');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    if (!carousel || !prevBtn || !nextBtn) return;

    const getCards = () => [...carousel.querySelectorAll('.project-card')];

    const getCurrentIndex = () => {
        const cards = getCards();
        const gap = parseFloat(window.getComputedStyle(carousel).gap) || 30;
        const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
        return Math.round(carousel.scrollLeft / (cardWidth + gap));
    };

    prevBtn.addEventListener('click', () => {
        const cards = getCards();
        const target = cards[Math.max(0, getCurrentIndex() - 1)];
        if (target) carousel.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        const cards = getCards();
        const target = cards[Math.min(cards.length - 1, getCurrentIndex() + 1)];
        if (target) carousel.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    });
}

/* inicjalizacja */
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
        changeLanguage(savedLang);
    } else {
        changeLanguage('pl');
    }

    initializeTextAnimation();

    if (document.getElementById('home')) {
        initHomePage();
    }

    initSectionObserver();
    initProjectCarousel();
});
