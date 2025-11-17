class Najah45Dashboard {
    constructor() {
        this.currentDay = 1;
        this.totalDays = 45;
        this.accessWindow = 48;
        this.progressData = null;
        this.nextDayTimer = null;
        
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.updateDashboard();
        this.startNextDayTimer();
    }

    loadProgress() {
        const saved = localStorage.getItem('najah45_progress');
        if (saved) {
            this.progressData = JSON.parse(saved);
            this.currentDay = Math.min(this.progressData.currentDay || 1, this.totalDays);
        } else {
            this.progressData = {
                currentDay: 1,
                completedDays: [],
                startDate: new Date().toISOString(),
                userName: "المستخدم"
            };
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('najah45_progress', JSON.stringify(this.progressData));
    }

    setupEventListeners() {
        // Calendar toggle
        document.getElementById('calendarToggle').addEventListener('click', () => {
            this.showCalendar();
        });
        document.getElementById('closeCalendar').addEventListener('click', () => {
            this.hideCalendar();
        });

        // Main action buttons
        document.getElementById('openTaskBtn').addEventListener('click', () => {
            this.openTask();
        });
        document.getElementById('uploadProofBtn').addEventListener('click', () => {
            this.uploadProof();
        });
        document.getElementById('submitTaskBtn').addEventListener('click', () => {
            this.submitTask();
        });

        // Bottom navigation
        document.getElementById('websiteBtn').addEventListener('click', () => {
            this.openWebsite();
        });
        document.getElementById('portfolioBtn').addEventListener('click', () => {
            this.openPortfolio();
        });
        document.getElementById('achievementsBtn').addEventListener('click', () => {
            this.showAchievements();
        });
        document.getElementById('certificateBtn').addEventListener('click', () => {
            this.showCertificate();
        });

        // File upload
        document.getElementById('proofFile').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
    }

    updateDashboard() {
        this.updateProgressBar();
        this.updateDayInfo();
        this.updateNavigation();
        this.updateCalendar();
    }

    updateProgressBar() {
        const progressPercent = (this.currentDay / this.totalDays) * 100;
        document.getElementById('progressFill').style.width = progressPercent + '%';
        
        // Update active phase
        document.querySelectorAll('.phase').forEach(phase => phase.classList.remove('active'));
        if (this.currentDay <= 15) {
            document.querySelector('.phase-1').classList.add('active');
        } else if (this.currentDay <= 30) {
            document.querySelector('.phase-2').classList.add('active');
        } else {
            document.querySelector('.phase-3').classList.add('active');
        }
    }

    updateDayInfo() {
        document.getElementById('currentDayDisplay').textContent = this.currentDay;
        document.getElementById('remainingDays').textContent = this.totalDays - this.currentDay + 1;
        document.getElementById('userName').textContent = this.progressData.userName;
    }

    updateNavigation() {
        // Enable website on day 7, portfolio on day 15
        document.getElementById('websiteBtn').disabled = this.currentDay < 7;
        document.getElementById('portfolioBtn').disabled = this.currentDay < 15;
    }

    updateCalendar() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';
        
        for (let day = 1; day <= this.totalDays; day++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            cell.textContent = day;
            
            if (this.progressData.completedDays.includes(day)) {
                cell.classList.add('completed');
            } else if (day === this.currentDay) {
                cell.classList.add('current');
            } else if (day < this.currentDay) {
                cell.classList.add('missed');
            } else {
                cell.classList.add('upcoming');
            }
            
            grid.appendChild(cell);
        }
    }

    showCalendar() {
        document.getElementById('calendarPopup').style.display = 'block';
    }

    hideCalendar() {
        document.getElementById('calendarPopup').style.display = 'none';
    }

    openTask() {
        const taskSection = document.getElementById('taskSection');
        taskSection.style.display = 'block';
        
        document.getElementById('taskTitle').textContent = `المهمة اليومية - اليوم ${this.currentDay}`;
        document.getElementById('taskDescription').textContent = this.getTaskDescription(this.currentDay);
    }

    getTaskDescription(day) {
        const tasks = {
            1: "حدد مهارتك الرئيسية واكتب وصفاً مختصراً للخدمة.",
            2: "ابحث عن 3 منافسين محليين في مجالك.",
            3: "حدد جمهورك المستهدف في دول الخليج.",
            7: "اليوم 7: ابدأ في بناء موقعك الشخصي (اضغط على زر 'موقعي').",
            15: "اليوم 15: ابدأ في بناء محفظتك (اضغط على زر 'محفظتي')."
        };
        return tasks[day] || `مهمة اليوم ${day} - استمر في التقدم نحو أهدافك.`;
    }

    uploadProof() {
        document.getElementById('proofFile').click();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const proofSection = document.getElementById('proofSection');
            proofSection.style.display = 'block';
            
            // Enable submit button
            document.getElementById('submitTaskBtn').disabled = false;
        }
    }

    submitTask() {
        if (this.currentDay >= this.totalDays) {
            alert('🎉 مبروك! أكملت جميع أيام التحدي!');
            return;
        }

        // Mark day as completed
        if (!this.progressData.completedDays.includes(this.currentDay)) {
            this.progressData.completedDays.push(this.currentDay);
        }

        // Move to next day (but wait for 12AM KSA to actually progress)
        this.currentDay++;
        this.progressData.currentDay = this.currentDay;
        
        this.saveProgress();
        this.updateDashboard();
        
        // Reset UI
        document.getElementById('taskSection').style.display = 'none';
        document.getElementById('proofSection').style.display = 'none';
        document.getElementById('submitTaskBtn').disabled = true;
        
        alert(`✅ تم تسليم مهمة اليوم ${this.currentDay - 1} بنجاح!`);
    }

    startNextDayTimer() {
        this.updateNextDayTimer();
        this.nextDayTimer = setInterval(() => {
            this.updateNextDayTimer();
        }, 1000);
    }

    updateNextDayTimer() {
        const now = new Date();
        const ksaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Riyadh"}));
        const nextDay = new Date(ksaTime);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        
        const diff = nextDay - ksaTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('nextDayTimer').textContent = 
            `اليوم التالي: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    openWebsite() {
        alert('🌐 أداة بناء الموقع الشخصي - متاحة من اليوم 7\n\nهنا ستتمكن من إنشاء موقعك الشخصي خلال 3 أيام.');
    }

    openPortfolio() {
        alert('📊 محفظة الأعمال - متاحة من اليوم 15\n\nهنا ستتمكن من عرض مشاريعك وإنجازاتك للعملاء.');
    }

    showAchievements() {
        alert('🏆 إنجازاتي - قيد التطوير\n\nستعرض هنا الميداليات والإنجازات الرئيسية خلال رحلتك.');
    }

    showCertificate() {
        const completed = this.progressData.completedDays.length;
        const progress = Math.min(100, (completed / this.totalDays) * 100);
        alert(`📜 تقدمك نحو الشهادة: ${completed}/${this.totalDays} يوم (${progress.toFixed(1)}%)\n\nأكمل جميع الأيام الـ45 للحصول على الشهادة.`);
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    new Najah45Dashboard();
});
