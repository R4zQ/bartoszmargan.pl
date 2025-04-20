// ====================== SYSTEM ZMIANY JĘZYKA ======================
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
        
        document.querySelectorAll('[data-lang]').forEach(element => {
            try {
                const translations = JSON.parse(element.getAttribute('data-lang'));
                if (translations?.[lang]) {
                    if (element.tagName === 'INPUT' && element.type === 'submit') {
                        element.value = translations[lang];
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

// ====================== POBRANIE CV ======================
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

// ====================== OBSŁUGA STRONY GŁÓWNEJ ======================
function initHomePage() {
    const navLinks = document.querySelectorAll('.navbar a, .cta-button');
    if (navLinks.length > 0) {
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offset = targetId === '#skills' ? 200 : 
                                 targetId === '#experience' ? 80 : 
                                 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                    setTimeout(() => {
                        history.replaceState(null, null, ' ');
                    }, 1000);
                }
            });
        });
    }

    // Easter Egg
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

    // Efekt hackerski
    const pentestingTrigger = document.querySelector('.pentesting-trigger');
    if (pentestingTrigger) {
        pentestingTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            const hackEffect = document.getElementById('hackEffect');
            if (hackEffect) {
                document.body.classList.add('hack-mode');
                hackEffect.classList.add('active');
                
                const noise = document.createElement('div');
                noise.className = 'noise-effect';
                document.body.appendChild(noise);
                
                setTimeout(() => noise.remove(), 2000);
                
                const closeHack = document.querySelector('.close-hack');
                if (closeHack) {
                    closeHack.addEventListener('click', function() {
                        hackEffect.classList.remove('active');
                        document.body.classList.remove('hack-mode');
                    });
                }
            }
        });
    }

    // Formularz kontaktowy
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusElement = document.getElementById('formStatus');
            
            if (!statusElement) return;
            
            const name = document.getElementById('name')?.value;
            const subject = document.getElementById('subject')?.value;
            const message = document.getElementById('message')?.value;
            
            if (!name || !subject || !message) {
                statusElement.textContent = currentLang === 'pl' 
                    ? 'Proszę wypełnić wszystkie pola' 
                    : 'Please fill all fields';
                statusElement.style.display = 'block';
                return;
            }
            
            statusElement.textContent = currentLang === 'pl' 
                ? 'Trwa otwieranie klienta poczty...' 
                : 'Opening mail client...';
            statusElement.style.display = 'block';
            
            const mailtoLink = `mailto:bartosz.margan@wp.pl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                (currentLang === 'pl' ? 'Wiadomość od: ' : 'Message from: ') + `${name}\n\n${message}`
            )}`;
            
            setTimeout(() => {
                window.location.href = mailtoLink;
                setTimeout(() => {
                    statusElement.style.display = 'none';
                    contactForm.reset();
                }, 3000);
            }, 500);
        });
    }

    // Przycisk przewijania w dół
    const scrollDownBtn = document.querySelector('.scroll-down-btn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ====================== ANIMACJA TEKSTU ======================
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

document.addEventListener('DOMContentLoaded', function() {
    initializeTextAnimation();
});

// ====================== INICJALIZACJA STRONY ======================
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
        changeLanguage(savedLang);
    } else {
        changeLanguage('pl');
    }

    if (document.getElementById('home')) {
        initHomePage();
    }
    
    
});