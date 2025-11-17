// Dashboard functionality
class Dashboard {
    constructor() {
        this.currentDay = 1;
        this.progressData = null;
        this.init();
    }

    init() {
        this.loadProgress();
        this.updateDashboard();
        this.setupEventListeners();
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('najah45_progress');
        if (savedProgress) {
            this.progressData = JSON.parse(savedProgress);
            this.currentDay = this.progressData.currentDay || 1;
        } else {
            // Initialize new progress
            this.progressData = {
                currentDay: 1,
                currentPhase: 1,
                completedDays: [],
                streak: 0,
                missedDays: 0,
                startDate: new Date().toISOString(),
                portfolioProgress: 0,
                websiteProgress: 0,
                certificateEligible: true
            };
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('najah45_progress', JSON.stringify(this.progressData));
    }

    updateDashboard() {
        this.updateProgressBar();
        this.updatePhaseIndicator();
        this.updateTaskDisplay();
        this.updateMenuButtons();
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const currentDayElement = document.getElementById('currentDay');
        const daysLeftElement = document.getElementById('daysLeft');

        if (progressFill) {
            const progressPercent = (this.currentDay / 45) * 100;
            progressFill.style.width = progressPercent + '%';
        }

        if (currentDayElement) {
            currentDayElement.textContent = 'اليوم: ' + this.currentDay;
        }

        if (daysLeftElement) {
            const daysLeft = 45 - this.currentDay;
            daysLeftElement.textContent = 'متبقي: ' + daysLeft + ' يوم';
        }
    }

    updatePhaseIndicator() {
        const phases = document.querySelectorAll('.phase');
        phases.forEach(phase => phase.classList.remove('active'));

        if (this.currentDay <= 15) {
            document.querySelector('.phase-1').classList.add('active');
        } else if (this.currentDay <= 30) {
            document.querySelector('.phase-2').classList.add('active');
        } else {
            document.querySelector('.phase-3').classList.add('active');
        }
    }

    updateTaskDisplay() {
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');

        if (taskTitle) {
            taskTitle.textContent = 'المهمة اليومية - اليوم ' + this.currentDay;
        }

        if (taskDescription) {
            taskDescription.textContent = this.getTaskDescription(this.currentDay);
        }
    }

    getTaskDescription(day) {
        const tasks = {
            1: "حدد مهارتك الرئيسية وأكتب وصفًا مختصرًا للخدمة التي ستقدمها.",
            2: "ابحث عن 3 منافسين محليين في مجالك وادرس عروضهم.",
            3: "حدد جمهورك المستهدف في دول الخليج.",
            // ... more tasks will be added
            7: "اليوم 7: ابدأ في بناء موقعك الشخصي (سيتم فتح أداة الموقع).",
            8: "اليوم 8: ابدأ في بناء ملفك الشخصي (سيتم فتح أداة الملف الشخصي).",
            16: "اليوم 16: ابدأ المشروع الأول في ملفك الشخصي."
        };

        return tasks[day] || "مهمة اليوم " + day + " - التفاصيل قريباً...";
    }

    updateMenuButtons() {
        const portfolioBtn = document.getElementById('portfolioBtn');
        const websiteBtn = document.getElementById('websiteBtn');

        // Enable portfolio on day 8
        if (portfolioBtn) {
            portfolioBtn.disabled = this.currentDay < 8;
        }

        // Enable website on day 7
        if (websiteBtn) {
            websiteBtn.disabled = this.currentDay < 7;
        }
    }

    setupEventListeners() {
        const completeTaskBtn = document.getElementById('completeTaskBtn');
        if (completeTaskBtn) {
            completeTaskBtn.addEventListener('click', () => this.completeTask());
        }

        // Menu button events
        const portfolioBtn = document.getElementById('portfolioBtn');
        if (portfolioBtn) {
            portfolioBtn.addEventListener('click', () => this.openPortfolio());
        }

        const websiteBtn = document.getElementById('websiteBtn');
        if (websiteBtn) {
            websiteBtn.addEventListener('click', () => this.openWebsite());
        }
    }

    completeTask() {
        // Add to completed days
        if (!this.progressData.completedDays.includes(this.currentDay)) {
            this.progressData.completedDays.push(this.currentDay);
        }

        // Calculate streak
        this.calculateStreak();

        // Move to next day
        this.currentDay++;
        this.progressData.currentDay = this.currentDay;

        // Save progress
        this.saveProgress();

        // Show celebration
        this.showCelebration();

        // Update dashboard
        setTimeout(() => {
            this.updateDashboard();
        }, 1000);
    }

    calculateStreak() {
        const completed = this.progressData.completedDays.sort((a, b) => a - b);
        let streak = 0;
        let expectedDay = 1;

        for (let day of completed) {
            if (day === expectedDay) {
                streak++;
                expectedDay++;
            }
        }

        this.progressData.streak = streak;
        this.progressData.missedDays = completed.length - streak;
    }

    showCelebration() {
        const completeBtn = document.getElementById('completeTaskBtn');
        if (completeBtn) {
            completeBtn.classList.add('celebrating');
            setTimeout(() => {
                completeBtn.classList.remove('celebrating');
            }, 1500);
        }

        // Show completion message
        alert('🎉 مبروك! أكملت اليوم ' + (this.currentDay - 1));
    }

    openPortfolio() {
        alert('سيتم فتح أداة الملف الشخصي - قيد التطوير');
    }

    openWebsite() {
        alert('سيتم فتح أداة موقع الويب - قيد التطوير');
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new Dashboard();
});
