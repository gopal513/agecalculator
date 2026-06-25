document.addEventListener('DOMContentLoaded', () => {
    // Shared features across all tools (Theme & Canvas)
    if (typeof initTheme === 'function') initTheme();
    if (typeof initCanvasParticles === 'function') initCanvasParticles();
    
    // Page-specific initialization based on form IDs
    initAgeDifferenceTool();
    initDateDifferenceTool();
    initBirthdayCountdownTool();
    initZodiacFinderTool();
    initRetirementTool();
    initDaysBetweenTool();
});

// Reuse calculation engine from main.js if available, or define here
function calculateExactAgeHelper(birthDate, targetDate) {
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
    
    return { years, months, days };
}

/* ==========================================
   1. Age Difference Calculator Tool
   ========================================== */
function initAgeDifferenceTool() {
    const form = document.getElementById('age-diff-form');
    if (!form) return;
    
    const dobAInput = document.getElementById('dob-a');
    const dobBInput = document.getElementById('dob-b');
    const resultsContainer = document.getElementById('diff-results');
    const resetBtn = document.getElementById('diff-reset-btn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dobA = new Date(dobAInput.value);
        const dobB = new Date(dobBInput.value);
        
        dobA.setHours(0,0,0,0);
        dobB.setHours(0,0,0,0);
        
        if (isNaN(dobA.getTime()) || isNaN(dobB.getTime())) {
            alert('Please select valid dates.');
            return;
        }
        
        let older, younger, olderName, youngerName;
        
        if (dobA.getTime() === dobB.getTime()) {
            document.getElementById('diff-verdict').innerHTML = "🎉 Both individuals are exactly the same age!";
            document.getElementById('diff-years').textContent = '0';
            document.getElementById('diff-months').textContent = '0';
            document.getElementById('diff-days').textContent = '0';
            document.getElementById('diff-total-days').textContent = '0';
            resultsContainer.style.display = 'block';
            window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
            return;
        } else if (dobA < dobB) {
            older = dobA;
            younger = dobB;
            olderName = "Person A";
            youngerName = "Person B";
        } else {
            older = dobB;
            younger = dobA;
            olderName = "Person B";
            youngerName = "Person A";
        }
        
        // Exact age gap
        const diff = calculateExactAgeHelper(older, younger);
        
        // Total days difference
        const diffMs = younger - older;
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        document.getElementById('diff-verdict').innerHTML = `🌟 <strong>${olderName}</strong> is older than <strong>${youngerName}</strong>.`;
        document.getElementById('diff-years').textContent = diff.years;
        document.getElementById('diff-months').textContent = diff.months;
        document.getElementById('diff-days').textContent = diff.days;
        document.getElementById('diff-total-days').textContent = totalDays.toLocaleString();
        
        resultsContainer.style.display = 'block';
        window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
            setTimeout(() => {
                resultsContainer.style.display = 'none';
                form.reset();
            }, 300);
        });
    }
}

/* ==========================================
   2. Date Difference Calculator Tool
   ========================================== */
function initDateDifferenceTool() {
    const form = document.getElementById('date-diff-form');
    if (!form) return;
    
    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');
    const resultsContainer = document.getElementById('date-diff-results');
    const resetBtn = document.getElementById('date-diff-reset');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let start = new Date(startInput.value);
        let end = new Date(endInput.value);
        
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert('Please select valid dates.');
            return;
        }
        
        let swapped = false;
        if (start > end) {
            // Swap if start is later than end
            const temp = start;
            start = end;
            end = temp;
            swapped = true;
        }
        
        const diff = calculateExactAgeHelper(start, end);
        const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        
        const verdictEl = document.getElementById('date-diff-verdict');
        if (verdictEl) {
            verdictEl.innerHTML = swapped 
                ? "⚠️ Note: Start date was later than end date. Calculated absolute duration." 
                : "📅 Time duration between selected dates:";
        }
        
        document.getElementById('date-res-years').textContent = diff.years;
        document.getElementById('date-res-months').textContent = diff.months;
        document.getElementById('date-res-days').textContent = diff.days;
        document.getElementById('date-res-total-days').textContent = totalDays.toLocaleString();
        
        resultsContainer.style.display = 'block';
        window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
            setTimeout(() => {
                resultsContainer.style.display = 'none';
                form.reset();
            }, 300);
        });
    }
}

/* ==========================================
   3. Birthday Countdown Timer
   ========================================== */
function initBirthdayCountdownTool() {
    const form = document.getElementById('bday-countdown-form');
    if (!form) return;
    
    const dobInput = document.getElementById('dob');
    const resultsContainer = document.getElementById('countdown-results');
    const resetBtn = document.getElementById('countdown-reset');
    
    let countdownInterval;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dobVal = dobInput.value;
        if (!dobVal) return;
        
        const dob = new Date(dobVal);
        
        if (countdownInterval) clearInterval(countdownInterval);
        
        function updateTimer() {
            const now = new Date();
            let nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate(), 0, 0, 0, 0);
            
            // If birthday passed this year, set to next year
            if (nextBday < now) {
                nextBday.setFullYear(now.getFullYear() + 1);
            }
            
            const diffMs = nextBday - now;
            
            if (diffMs <= 0) {
                // Happy birthday today!
                document.getElementById('cd-days').textContent = '00';
                document.getElementById('cd-hours').textContent = '00';
                document.getElementById('cd-minutes').textContent = '00';
                document.getElementById('cd-seconds').textContent = '00';
                document.getElementById('countdown-heading').textContent = "🎉 Happy Birthday! 🎉";
                return;
            }
            
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            
            document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
            document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
            document.getElementById('countdown-heading').textContent = "Time Left Until Your Next Birthday";
        }
        
        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
        
        resultsContainer.style.display = 'block';
        window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (countdownInterval) clearInterval(countdownInterval);
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
            setTimeout(() => {
                resultsContainer.style.display = 'none';
                form.reset();
            }, 300);
        });
    }
}

/* ==========================================
   4. Zodiac Sign Finder
   ========================================== */
function initZodiacFinderTool() {
    const form = document.getElementById('zodiac-form');
    if (!form) return;
    
    const dobInput = document.getElementById('dob');
    const resultsContainer = document.getElementById('zodiac-results');
    const resetBtn = document.getElementById('zodiac-reset');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dob = new Date(dobInput.value);
        if (isNaN(dob.getTime())) return;
        
        const day = dob.getDate();
        const month = dob.getMonth() + 1; // 1-indexed
        
        const zodiacSigns = [
            { name: "Capricorn", symbol: "♑", start: [12, 22], end: [1, 19], trait: "Ambitious, patient, highly disciplined, and extremely reliable." },
            { name: "Aquarius", symbol: "♒", start: [1, 20], end: [2, 18], trait: "Innovative, open-minded, humanitarian, and highly independent." },
            { name: "Pisces", symbol: "♓", start: [2, 19], end: [3, 20], trait: "Empathetic, artistic, intuitive, wise, and deeply compassionate." },
            { name: "Aries", symbol: "♈", start: [3, 21], end: [4, 19], trait: "Eager, dynamic, quick-witted, courageous, and competitive." },
            { name: "Taurus", symbol: "♉", start: [4, 20], end: [5, 20], trait: "Strong, dependable, creative, patient, and highly practical." },
            { name: "Gemini", symbol: "♊", start: [5, 21], end: [6, 20], trait: "Versatile, expressive, curious, fast learner, and social." },
            { name: "Cancer", symbol: "♋", start: [6, 21], end: [7, 22], trait: "Intuitive, sentimental, protective, compassionate, and loving." },
            { name: "Leo", symbol: "♌", start: [7, 23], end: [8, 22], trait: "Outgoing, passionate, generous, self-assured, and natural leader." },
            { name: "Virgo", symbol: "♍", start: [8, 23], end: [9, 22], trait: "Analytical, practical, loyal, hard-working, and gentle." },
            { name: "Libra", symbol: "♎", start: [9, 23], end: [10, 22], trait: "Diplomatic, social, fair-minded, harmonious, and creative." },
            { name: "Scorpio", symbol: "♏", start: [10, 23], end: [11, 21], trait: "Passionate, brave, stubborn, resourceful, and deeply loyal." },
            { name: "Sagittarius", symbol: "♐", start: [11, 22], end: [12, 21], trait: "Optimistic, freedom-loving, funny, generous, and philosophical." }
        ];
        
        let foundSign = zodiacSigns[0]; // Cap fallback
        
        for (const sign of zodiacSigns) {
            const [sM, sD] = sign.start;
            const [eM, eD] = sign.end;
            if (
                (month === sM && day >= sD) ||
                (month === eM && day <= eD)
            ) {
                foundSign = sign;
                break;
            }
        }
        
        document.getElementById('z-symbol').textContent = foundSign.symbol;
        document.getElementById('z-name').textContent = foundSign.name;
        
        // Date formatting helper
        const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        document.getElementById('z-dates').textContent = `${monthNames[foundSign.start[0]]} ${foundSign.start[1]} - ${monthNames[foundSign.end[0]]} ${foundSign.end[1]}`;
        document.getElementById('z-trait').textContent = foundSign.trait;
        
        resultsContainer.style.display = 'block';
        window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
            setTimeout(() => {
                resultsContainer.style.display = 'none';
                form.reset();
            }, 300);
        });
    }
}

/* ==========================================
   5. Retirement Age Calculator
   ========================================== */
function initRetirementTool() {
    const form = document.getElementById('retirement-form');
    if (!form) return;
    
    const dobInput = document.getElementById('dob');
    const targetAgeInput = document.getElementById('target-age');
    const resultsContainer = document.getElementById('retirement-results');
    const resetBtn = document.getElementById('retirement-reset');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dob = new Date(dobInput.value);
        const targetAge = parseInt(targetAgeInput.value) || 60;
        
        if (isNaN(dob.getTime())) return;
        
        const now = new Date();
        now.setHours(0,0,0,0);
        dob.setHours(0,0,0,0);
        
        // Calculate current exact age
        const currentAge = calculateExactAgeHelper(dob, now);
        document.getElementById('ret-curr-age').textContent = `${currentAge.years} Years, ${currentAge.months} Months, ${currentAge.days} Days`;
        
        // Calculate retirement date
        const retirementDate = new Date(dob.getFullYear() + targetAge, dob.getMonth(), dob.getDate());
        
        if (now >= retirementDate) {
            document.getElementById('ret-time-left').textContent = "Retired! 🎉";
            document.getElementById('ret-days-left').textContent = "0";
            document.getElementById('ret-working-days').textContent = "0";
            document.getElementById('ret-status-lbl').textContent = "Congratulations! You have reached your retirement age milestone.";
            resultsContainer.style.display = 'block';
            window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
            return;
        }
        
        // Time left to retirement
        const timeLeft = calculateExactAgeHelper(now, retirementDate);
        document.getElementById('ret-time-left').textContent = `${timeLeft.years} Years, ${timeLeft.months} Months, ${timeLeft.days} Days`;
        
        // Total days left
        const totalDaysLeft = Math.ceil((retirementDate - now) / (1000 * 60 * 60 * 24));
        document.getElementById('ret-days-left').textContent = totalDaysLeft.toLocaleString();
        
        // Working days left (approximate - excluding weekends)
        const workingDaysLeft = calculateWorkingDays(now, retirementDate);
        document.getElementById('ret-working-days').textContent = workingDaysLeft.toLocaleString();
        
        document.getElementById('ret-status-lbl').innerHTML = `Target retirement date: <strong>${retirementDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>`;
        
        resultsContainer.style.display = 'block';
        window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
            setTimeout(() => {
                resultsContainer.style.display = 'none';
                form.reset();
            }, 300);
        });
    }
}

// O(1) Working Days Calculation (excludes Sat & Sun)
function calculateWorkingDays(startDate, endDate) {
    const elapsed = endDate - startDate;
    if (elapsed < 0) return 0;
    
    const totalDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    let workingDays = weeks * 5;
    
    const remainingDays = totalDays % 7;
    const startDay = startDate.getDay();
    
    for (let i = 0; i < remainingDays; i++) {
        const currentDay = (startDay + i) % 7;
        if (currentDay !== 0 && currentDay !== 6) {
            workingDays++;
        }
    }
    
    return workingDays;
}

/* ==========================================
   6. Days Between Dates Calculator
   ========================================== */
function initDaysBetweenTool() {
    const form = document.getElementById('days-between-form');
    if (!form) return;
    
    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');
    const includeEndCheckbox = document.getElementById('include-end');
    const resultsContainer = document.getElementById('days-between-results');
    const resetBtn = document.getElementById('days-between-reset');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert('Please select valid dates.');
            return;
        }
        
        let diffMs = Math.abs(end - start);
        let totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (includeEndCheckbox && includeEndCheckbox.checked) {
            totalDays += 1;
        }
        
        document.getElementById('days-res-total').textContent = totalDays.toLocaleString();
        
        // Show weeks equivalence
        const weeks = Math.floor(totalDays / 7);
        const remDays = totalDays % 7;
        document.getElementById('days-res-weeks').textContent = `${weeks} Weeks and ${remDays} Days`;
        
        resultsContainer.style.display = 'block';
        window.scrollTo({ top: resultsContainer.offsetTop - 100, behavior: 'smooth' });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
            setTimeout(() => {
                resultsContainer.style.display = 'none';
                form.reset();
            }, 300);
        });
    }
}
