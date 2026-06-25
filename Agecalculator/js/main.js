document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    initTheme();
    
    // Canvas Particles Background
    initCanvasParticles();
    
    // Did You Know? Facts Slider
    initFactsSlider();
    
    // Category Tab Switcher (More Free Calculators)
    initCategoryTabs();
    
    // Main Age Calculator Logic
    initAgeCalculator();

    // Global Authentication & History UI
    initGlobalAuthUI();
});

/* ==========================================
   Theme Management
   ========================================== */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = 'dark'; // Default
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (!userPrefersDark) {
        currentTheme = 'light';
    }
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    toggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================
   Canvas Particles Background
   ========================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let animationId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            
            const colors = ['rgba(139, 92, 246, ', 'rgba(34, 211, 238, ', 'rgba(236, 72, 153, '];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.01;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            
            this.opacity += this.opacitySpeed;
            if (this.opacity < 0.1 || this.opacity > 0.6) {
                this.opacitySpeed = -this.opacitySpeed;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + this.opacity + ')';
            ctx.fill();
        }
    }
    
    function createParticles() {
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const theme = document.documentElement.getAttribute('data-theme');
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        if (theme === 'dark' && particles.length > 0) {
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 100) {
                        const alpha = (1 - dist / 100) * 0.15;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

/* ==========================================
   Did You Know? Facts Slider
   ========================================== */
const AGE_FACTS = [
    "A year is not exactly 365 days; it's 365.2422 days. That is why we add a leap day every 4 years!",
    "The oldest verified person ever was Jeanne Calment of France, who lived to the age of 122 years and 164 days.",
    "Your brain is not fully developed until you reach about age 25, specifically the prefrontal cortex.",
    "A person takes an average of 23,000 breaths every single day of their life.",
    "By the time you turn 18, you will have spent around 3,000 full days sleeping.",
    "Your heart beats about 100,000 times a day, pumping around 2,000 gallons of blood.",
    "The concept of 'birthday cake' and candles originated in ancient Greece as a tribute to the moon goddess Artemis.",
    "In the time it takes you to read this sentence, you have aged about 5 seconds, and the Earth has traveled 150 kilometers around the Sun.",
    "The oldest living tree is a Great Basin bristlecone pine named Methuselah, estimated to be over 4,850 years old!"
];

function initFactsSlider() {
    const factText = document.getElementById('fact-text');
    if (!factText) return;
    
    let currentIndex = 0;
    
    function updateFact() {
        factText.style.opacity = 0;
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % AGE_FACTS.length;
            factText.textContent = AGE_FACTS[currentIndex];
            factText.style.opacity = 1;
        }, 500);
    }
    
    factText.textContent = AGE_FACTS[0];
    setInterval(updateFact, 8000);
}

/* ==========================================
   Category Tab Switcher
   ========================================== */
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.cat-tab');
    const panels = document.querySelectorAll('.cat-panel');
    
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.cat;
            
            // Update tab active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panel visibility
            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById('cat-' + target);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

/* ==========================================
   Main Age Calculator Engine
   ========================================== */
const ZODIAC = [
  { name: "Capricorn",   symbol: "♑", m: 1,  d: 19 },
  { name: "Aquarius",    symbol: "♒", m: 2,  d: 18 },
  { name: "Pisces",      symbol: "♓", m: 3,  d: 20 },
  { name: "Aries",       symbol: "♈", m: 4,  d: 19 },
  { name: "Taurus",      symbol: "♉", m: 5,  d: 20 },
  { name: "Gemini",      symbol: "♊", m: 6,  d: 20 },
  { name: "Cancer",      symbol: "♋", m: 7,  d: 22 },
  { name: "Leo",         symbol: "♌", m: 8,  d: 22 },
  { name: "Virgo",       symbol: "♍", m: 9,  d: 22 },
  { name: "Libra",       symbol: "♎", m: 10, d: 22 },
  { name: "Scorpio",     symbol: "♏", m: 11, d: 21 },
  { name: "Sagittarius", symbol: "♐", m: 12, d: 21 },
];

const ZODIAC_IMAGES = {
  Capricorn: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#capGrad)" stroke-width="2.5" fill="rgba(168,85,247,0.03)"/><path d="M35 38H45V60C45 68 55 68 55 60V50C55 42 65 42 65 50C65 58 58 65 60 70C62 75 70 72 70 65" stroke="url(#capGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#C084FC"/><stop offset="1" stop-color="#34D399"/></linearGradient></defs></svg>`,
  Aquarius: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#aqGrad)" stroke-width="2.5" fill="rgba(34,211,238,0.03)"/><path d="M30 45L40 37L50 45L60 37L70 45M30 63L40 55L50 63L60 55L70 63" stroke="url(#aqGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="aqGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs></svg>`,
  Pisces: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#piGrad)" stroke-width="2.5" fill="rgba(236,72,153,0.03)"/><path d="M32 30C45 38 45 62 32 70M68 30C55 38 55 62 68 70M28 50H72" stroke="url(#piGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="piGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#EC4899"/><stop offset="1" stop-color="#FB923C"/></linearGradient></defs></svg>`,
  Aries: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#arGrad)" stroke-width="2.5" fill="rgba(168,85,247,0.03)"/><path d="M35 38C25 45 42 45 48 40C54 45 71 45 61 38M50 40V70" stroke="url(#arGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="arGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a855f7"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs></svg>`,
  Taurus: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#tauGrad)" stroke-width="2.5" fill="rgba(251,146,60,0.03)"/><path d="M35 32C32 45 68 45 65 32M50 45C38 45 38 72 50 72C62 72 62 45 50 45Z" stroke="url(#tauGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="tauGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FB923C"/><stop offset="1" stop-color="#FBBF24"/></linearGradient></defs></svg>`,
  Gemini: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#gemGrad)" stroke-width="2.5" fill="rgba(34,211,238,0.03)"/><path d="M32 32H68M32 68H68M42 32V68M58 32V68" stroke="url(#gemGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#34D399"/></linearGradient></defs></svg>`,
  Cancer: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#canGrad)" stroke-width="2.5" fill="rgba(236,72,153,0.03)"/><path d="M62 40C62 48 52 48 52 40C52 32 68 32 68 44C68 54 32 50 32 60C32 68 42 68 42 60C42 52 32 52 32 44" stroke="url(#canGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="canGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#EC4899"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs></svg>`,
  Leo: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#leoGrad)" stroke-width="2.5" fill="rgba(251,146,60,0.03)"/><path d="M35 55C35 48 42 42 48 48C52 52 45 62 55 60C62 58 65 42 58 35" stroke="url(#leoGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="leoGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FB923C"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs></svg>`,
  Virgo: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#virGrad)" stroke-width="2.5" fill="rgba(52,211,153,0.03)"/><path d="M32 35V60M42 35C42 65 42 65 42 52M42 35C45 30 52 30 52 42V60C52 65 60 62 62 55C65 45 60 38 52 38" stroke="url(#virGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="virGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#34D399"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs></svg>`,
  Libra: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#libGrad)" stroke-width="2.5" fill="rgba(168,85,247,0.03)"/><path d="M30 65H70M30 53H38C38 43 62 43 62 53H70" stroke="url(#libGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="libGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#C084FC"/><stop offset="1" stop-color="#FB923C"/></linearGradient></defs></svg>`,
  Scorpio: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#scoGrad)" stroke-width="2.5" fill="rgba(236,72,153,0.03)"/><path d="M32 35V60M42 35V55M42 35C45 30 52 30 52 42V55C52 62 62 52 65 60L68 53" stroke="url(#scoGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="scoGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#EC4899"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs></svg>`,
  Sagittarius: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><circle cx="50" cy="50" r="42" stroke="url(#sagGrad)" stroke-width="2.5" fill="rgba(251,146,60,0.03)"/><path d="M32 68L68 32M68 32H50M68 32V50M42 42L58 58" stroke="url(#sagGrad)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="sagGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FB923C"/><stop offset="1" stop-color="#34D399"/></linearGradient></defs></svg>`
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Date Parsing Helper supporting DD-MM-YY and DD-MM-YYYY
function parseDateInput(dateStr) {
    const parts = dateStr.trim().split(/[\-\/\.]/);
    if (parts.length !== 3) return null;
    
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1; // 0-indexed month
    let y = parseInt(parts[2], 10);
    
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
    if (m < 0 || m > 11 || d < 1 || d > 31) return null;
    
    // Resolve 2-digit years
    if (y < 100) {
        const currentYear = new Date().getFullYear();
        const threshold = currentYear - 2000;
        y = y <= threshold ? 2000 + y : 1900 + y;
    }
    
    const parsedDate = new Date(y, m, d);
    
    // Validate actual calendar bounds (reject Feb 31, Apr 31, etc.)
    if (parsedDate.getFullYear() === y && parsedDate.getMonth() === m && parsedDate.getDate() === d) {
        return parsedDate;
    }
    return null;
}

function getZodiac(date) {
    const m = date.getMonth() + 1;
    const day = date.getDate();
    for (const z of ZODIAC) {
        if (m < z.m || (m === z.m && day <= z.d)) return z;
    }
    return ZODIAC[0];
}

function calculateExactAge(birthDate, targetDate) {
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        const prevMonthDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        days += prevMonthDate.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    return { y: years, mo: months, da: days };
}

function nextBirthday(birthDate) {
    const now = new Date();
    let next = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (next <= now) next.setFullYear(now.getFullYear() + 1);
    const ms = next - now;
    return { days: Math.ceil(ms / 86400000) };
}

// Moon Phase calculation
function getMoonPhase(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (month < 3) {
        month += 12;
        year--;
    }
    
    const c = 365.25 * year;
    const e = 30.6 * month;
    const jd = c + e + day - 694039.09;
    const jdDivided = jd / 29.530588853;
    const phaseRaw = jdDivided - Math.floor(jdDivided);
    const phaseDays = phaseRaw * 29.530588853;
    
    let phaseName = "";
    let phaseEmoji = "";
    
    if (phaseDays < 1.84) {
        phaseName = "New Moon";
        phaseEmoji = "🌑";
    } else if (phaseDays < 5.53) {
        phaseName = "Waxing Crescent";
        phaseEmoji = "🌒";
    } else if (phaseDays < 9.22) {
        phaseName = "First Quarter";
        phaseEmoji = "🌓";
    } else if (phaseDays < 12.91) {
        phaseName = "Waxing Gibbous";
        phaseEmoji = "🌔";
    } else if (phaseDays < 16.61) {
        phaseName = "Full Moon";
        phaseEmoji = "🌕";
    } else if (phaseDays < 20.30) {
        phaseName = "Waning Gibbous";
        phaseEmoji = "🌖";
    } else if (phaseDays < 23.99) {
        phaseName = "Last Quarter";
        phaseEmoji = "🌗";
    } else if (phaseDays < 27.68) {
        phaseName = "Waning Crescent";
        phaseEmoji = "🌘";
    } else {
        phaseName = "New Moon";
        phaseEmoji = "🌑";
    }
    
    return { name: phaseName, symbol: phaseEmoji };
}

const fmt = n => Math.round(n).toLocaleString();
const pad = n => String(n).padStart(2, "0");

let liveTickerInterval = null;

function initAgeCalculator() {
    const form = document.getElementById('age-calc-form');
    const dobInput = document.getElementById('dob');
    const resultsContainer = document.getElementById('results');
    const placeholderTiles = document.getElementById('placeholder-tiles');
    const calcAgainBtn = document.getElementById('calc-again-btn');
    
    if (!form || !dobInput || !resultsContainer) return;
    
    // Auto-mask formatting for DD-MM-YY / DD-MM-YYYY
    dobInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Numbers only
        if (val.length > 8) val = val.substring(0, 8);
        
        let formatted = '';
        if (val.length > 0) {
            formatted += val.substring(0, 2);
        }
        if (val.length > 2) {
            formatted += '-' + val.substring(2, 4);
        }
        if (val.length > 4) {
            formatted += '-' + val.substring(4, 8);
        }
        e.target.value = formatted;
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dobVal = dobInput.value;
        const dob = parseDateInput(dobVal);
        
        if (!dob) {
            alert('Please enter a valid date in DD-MM-YY or DD-MM-YYYY format.');
            return;
        }
        
        const now = new Date();
        now.setHours(0,0,0,0);
        
        if (dob > now) {
            alert('Birth date cannot be in the future.');
            return;
        }
        
        // Hide placeholder and show results
        placeholderTiles.style.display = 'none';
        resultsContainer.style.display = 'block';
        window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
        
        // Calculate Age once
        const age = calculateExactAge(dob, new Date());
        
        // Display Main metric values with pad formatting
        document.getElementById('res-years').textContent = pad(age.y);
        document.getElementById('res-months').textContent = pad(age.mo);
        document.getElementById('res-days').textContent = pad(age.da);
        
        // Personality stats (Day born, Zodiac, Moon Phase)
        const zodiac = getZodiac(dob);
        document.getElementById('pers-zodiac-symbol').innerHTML = ZODIAC_IMAGES[zodiac.name] || zodiac.symbol;
        document.getElementById('pers-zodiac-name').textContent = zodiac.name;
        
        const birthDayName = DAYS[dob.getDay()];
        document.getElementById('pers-day-born').textContent = birthDayName;
        
        const moon = getMoonPhase(dob);
        document.getElementById('pers-moon-symbol').textContent = moon.symbol;
        document.getElementById('pers-moon-name').textContent = moon.name;
        
        // Life Progress bar
        const lifePct = Math.min(100, (age.y / 80) * 100).toFixed(1);
        document.getElementById('life-pct-label').textContent = `${lifePct}% of 80 yrs`;
        document.getElementById('life-progress').value = lifePct;
        
        // Birthday countdown checks
        const bday = nextBirthday(dob);
        if (bday.days === 365 || bday.days === 366 || bday.days === 0) {
            triggerConfetti();
        }
        
        // Setup ticking calculations
        if (liveTickerInterval) clearInterval(liveTickerInterval);
        
        function tick() {
            const timeNow = new Date();
            const secs = Math.floor((timeNow - dob) / 1000);
            
            document.getElementById('res-seconds').textContent = fmt(secs);
            
            // Stat cards
            const mins = Math.floor(secs / 60);
            const hrs = Math.floor(secs / 3600);
            const days = Math.floor(secs / 86400);
            const weeks = Math.floor(days / 7);
            const months = age.y * 12 + age.mo;
            
            document.getElementById('stat-minutes').textContent = fmt(mins);
            document.getElementById('stat-hours').textContent = fmt(hrs);
            document.getElementById('stat-days').textContent = fmt(days);
            document.getElementById('stat-weeks').textContent = fmt(weeks);
            document.getElementById('stat-months').textContent = fmt(months);
            
            const liveBday = nextBirthday(dob);
            document.getElementById('stat-bday').textContent = liveBday.days === 0 ? "Today! 🎂" : `${liveBday.days}d`;
            
            // Bio Stats
            const hearts = Math.floor(secs * 1.17);
            const breaths = Math.floor(secs * 0.267);
            document.getElementById('bio-hearts').textContent = fmt(hearts);
            document.getElementById('bio-breaths').textContent = fmt(breaths);
        }
        
        tick();
        liveTickerInterval = setInterval(tick, 1000);
        
        // Setup sharing urls
        setupShareButtons(age, bday.days === 0);
    });
    
    if (calcAgainBtn) {
        calcAgainBtn.addEventListener('click', () => {
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
            setTimeout(() => {
                if (liveTickerInterval) clearInterval(liveTickerInterval);
                resultsContainer.style.display = 'none';
                placeholderTiles.style.display = 'block';
                form.reset();
                dobInput.focus();
            }, 300);
        });
    }
}

/* ==========================================
   Social Sharing Setup
   ========================================== */
function setupShareButtons(age, isBirthday) {
    const waBtn = document.getElementById('share-wa');
    const tgBtn = document.getElementById('share-tg');
    const twBtn = document.getElementById('share-tw');
    
    if (!waBtn || !tgBtn || !twBtn) return;
    
    let shareText = '';
    if (isBirthday) {
        shareText = `🎉 Today is my Birthday! I am exactly ${age.y} years old today. Calculate your exact age with style: `;
    } else {
        shareText = `✨ I am exactly ${age.y} Years, ${age.mo} Months, and ${age.da} Days old! Find out your exact age lived down to the hour: `;
    }
    
    const pageUrl = encodeURIComponent(window.location.href);
    const textEncoded = encodeURIComponent(shareText);
    
    waBtn.href = `https://api.whatsapp.com/send?text=${textEncoded}${pageUrl}`;
    tgBtn.href = `https://t.me/share/url?url=${pageUrl}&text=${textEncoded}`;
    twBtn.href = `https://twitter.com/intent/tweet?text=${textEncoded}&url=${pageUrl}`;
}

/* ==========================================
   Native Birthday Confetti Effect
   ========================================== */
function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const colors = ['#a855f7', '#22d3ee', '#ec4899', '#34d399', '#fbbf24'];
    const particles = [];
    
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 4 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    
    let animationId;
    let frame = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;
            
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
        });
        
        frame++;
        if (frame < 250) {
            animationId = requestAnimationFrame(draw);
        } else {
            cancelAnimationFrame(animationId);
            canvas.remove();
            window.removeEventListener('resize', resizeCanvas);
        }
    }
    
    draw();
}
// parseDateInput is globally available as a plain script (no module export needed)

/* ==========================================
   Global Authentication & History UI
   ========================================== */
function initGlobalAuthUI() {
    // Inject missing nav actions on subpages
    const navContainer = document.querySelector('.nav-actions');
    if (navContainer && !document.getElementById('login-btn')) {
        navContainer.innerHTML = `
            <button class="nav-menu-link" id="activity-btn" style="display:none; background: transparent; border: 1px solid var(--card-border); cursor: pointer; color: var(--text-color); padding: 8px 16px; border-radius: 20px; margin-right: 8px;">My Activity</button>
            <button class="nav-menu-link" id="login-btn" style="background: var(--card-bg); border: 1px solid var(--card-border); cursor: pointer; color: var(--text-color); padding: 8px 16px; border-radius: 20px; margin-right: 8px;">Login</button>
            <a href="index.html" class="nav-menu-link hide-mobile">Home</a>
        `;
    } else if (document.getElementById('login-btn')) {
        // Add activity button if it doesn't exist on index
        if (!document.getElementById('activity-btn')) {
            const loginBtn = document.getElementById('login-btn');
            const actBtn = document.createElement('button');
            actBtn.className = 'nav-menu-link';
            actBtn.id = 'activity-btn';
            actBtn.style.cssText = 'display:none; background: transparent; border: 1px solid var(--card-border); cursor: pointer; color: var(--text-color); padding: 8px 16px; border-radius: 20px; margin-right: 8px;';
            actBtn.textContent = 'My Activity';
            loginBtn.parentNode.insertBefore(actBtn, loginBtn);
        }
    }

    // Inject Modals if they don't exist
    if (!document.getElementById('login-modal')) {
        const modalHtml = `
        <div class="modal-overlay" id="login-modal">
            <div class="modal-content glass-card">
                <button class="modal-close" id="login-close" aria-label="Close modal">&times;</button>
                <div id="login-view">
                    <h2 style="margin-bottom: 10px; font-family: 'Space Grotesk', sans-serif;">Login / Sign Up</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Access your secure calculation history across devices.</p>
                    <form id="login-form" style="display: flex; flex-direction: column; gap: 15px;">
                        <input type="email" class="glass-input" id="login-email" placeholder="Email Address" required style="padding: 12px; font-size: 1rem; border-radius: 12px; text-align: left;">
                        <input type="password" class="glass-input" id="login-password" placeholder="Password" required style="padding: 12px; font-size: 1rem; border-radius: 12px; text-align: left;">
                        <button type="submit" class="glass-btn" style="padding: 12px; border-radius: 12px; margin-top: 5px;">Secure Login</button>
                        <a href="#" id="forgot-pw-link" style="color: var(--accent-primary); font-size: 0.85rem; margin-top: 5px;">Forgot Password?</a>
                    </form>
                </div>
                <div id="forgot-view" style="display: none;">
                    <h2 style="margin-bottom: 10px; font-family: 'Space Grotesk', sans-serif;">Reset Password</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Enter your email to receive a secure reset link.</p>
                    <form id="forgot-form" style="display: flex; flex-direction: column; gap: 15px;">
                        <input type="email" class="glass-input" id="forgot-email" placeholder="Email Address" required style="padding: 12px; font-size: 1rem; border-radius: 12px; text-align: left;">
                        <button type="submit" class="glass-btn" style="padding: 12px; border-radius: 12px; margin-top: 5px;">Send Reset Link</button>
                        <a href="#" id="back-login-link" style="color: var(--text-muted); font-size: 0.85rem; margin-top: 5px;">Back to Login</a>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal-overlay" id="activity-modal">
            <div class="modal-content glass-card" style="max-width: 500px; max-height: 80vh; overflow-y: auto;">
                <button class="modal-close" id="activity-close" aria-label="Close modal">&times;</button>
                <h2 style="margin-bottom: 20px; font-family: 'Space Grotesk', sans-serif;">My Activity</h2>
                <div id="activity-list" style="text-align: left; display: flex; flex-direction: column; gap: 10px;">
                    <!-- Activities populated here -->
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const loginBtn = document.getElementById('login-btn');
    const activityBtn = document.getElementById('activity-btn');
    const loginModal = document.getElementById('login-modal');
    const activityModal = document.getElementById('activity-modal');
    const loginClose = document.getElementById('login-close');
    const activityClose = document.getElementById('activity-close');

    // Persistence Check
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        updateUILoggedIn(currentUser);
    }

    // Modal Triggers
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(localStorage.getItem('currentUser')) {
                // Log out toggle? Or just profile. Let's do nothing if logged in, or show a prompt.
                if(confirm("Do you want to log out?")) {
                    localStorage.removeItem('currentUser');
                    location.reload();
                }
            } else {
                loginModal.classList.add('active');
            }
        });
    }

    if (activityBtn) {
        activityBtn.addEventListener('click', (e) => {
            e.preventDefault();
            populateActivity();
            activityModal.classList.add('active');
        });
    }

    [loginClose, activityClose].forEach(btn => {
        if(btn) btn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            activityModal.classList.remove('active');
        });
    });

    [loginModal, activityModal].forEach(modal => {
        if(modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // Forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            localStorage.setItem('currentUser', email);
            showToast(`Welcome ${email.split('@')[0]}! Your history is securely syncing.`);
            loginModal.classList.remove('active');
            updateUILoggedIn(email);
        });
    }

    // Forgot PW Flow
    document.getElementById('forgot-pw-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('forgot-view').style.display = 'block';
    });
    document.getElementById('back-login-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('forgot-view').style.display = 'none';
        document.getElementById('login-view').style.display = 'block';
    });
    document.getElementById('forgot-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast("A secure password reset link has been sent to your email.");
        document.getElementById('forgot-view').style.display = 'none';
        document.getElementById('login-view').style.display = 'block';
    });

    // Global Activity Tracker
    document.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON' && (e.target.textContent.toLowerCase().includes('calculate') || e.target.classList.contains('btn-calc'))) {
            logActivity(`Used Calculator: ${document.title.split('-')[0].trim()}`);
        }
    });

    function updateUILoggedIn(email) {
        const name = email.split('@')[0];
        if(loginBtn) {
            loginBtn.textContent = name;
            loginBtn.style.color = '#10b981';
            loginBtn.style.borderColor = '#10b981';
            loginBtn.style.background = 'rgba(16, 185, 129, 0.1)';
        }
        if(activityBtn) activityBtn.style.display = 'inline-block';
    }

    function logActivity(actionDesc) {
        if(!localStorage.getItem('currentUser')) return;
        let history = JSON.parse(localStorage.getItem('userActivity') || '[]');
        history.unshift({ action: actionDesc, time: new Date().toLocaleString() });
        if(history.length > 50) history.pop();
        localStorage.setItem('userActivity', JSON.stringify(history));
    }

    function populateActivity() {
        const list = document.getElementById('activity-list');
        const history = JSON.parse(localStorage.getItem('userActivity') || '[]');
        if(history.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted);">No activity recorded yet.</p>';
            return;
        }
        list.innerHTML = history.map(h => `
            <div style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="font-weight: 600;">${h.action}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${h.time}</div>
            </div>
        `).join('');
    }

    function showToast(message) {
        let toast = document.getElementById('flawless-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'flawless-toast';
            toast.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%);
                color: #fff; font-family: 'Space Grotesk', sans-serif;
                padding: 12px 24px; border-radius: 12px; font-weight: 600;
                box-shadow: 0 10px 25px rgba(168,85,247,0.3);
                opacity: 0; transform: translateY(-20px); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        // Trigger reflow
        void toast.offsetWidth;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
        }, 3500);
    }
}
