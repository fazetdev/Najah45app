class Najah45Dashboard {
    constructor() {
        this.currentDay = 1;
        this.totalDays = 45;
        this.accessWindow = 48;
        this.progressData = null;
        this.phases = {
            1: { name: "التحضير", color: "#3b82f6", days: "1-15", badge: "phase1" },
            2: { name: "الإثبات", color: "#10b981", days: "16-30", badge: "phase2" },
            3: { name: "العمل", color: "#f59e0b", days: "31-45", badge: "phase3" }
        };
        this.achievements = [
            { id: 1, name: "البداية", desc: "أكمل اليوم الأول", icon: "🎯", day: 1 },
            { id: 2, name: "أسبوع من التحدي", desc: "أكمل 7 أيام متتالية", icon: "🔥", day: 7 },
            { id: 3, name: "موقعي الإلكتروني", desc: "أنشئ موقعك الشخصي", icon: "🌐", day: 7 },
            { id: 4, name: "منتصف الرحلة", desc: "أكمل 22 يوماً", icon: "⚡", day: 22 },
            { id: 5, name: "محفظة الأعمال", desc: "أنشئ محفظتك الشخصية", icon: "📊", day: 15 },
            { id: 6, name: "بطل الاستمرارية", desc: "أكمل 30 يوماً متتالية", icon: "🏆", day: 30 },
            { id: 7, name: "خبير التسويق", desc: "احصل على أول عميل", icon: "💼", day: 35 },
            { id: 8, name: "نجاح 45", desc: "أكمل جميع الأيام الـ45", icon: "🎉", day: 45 }
        ];
        
        this.init();
    }

    init() {
        this.loadProgress();
        this.renderCalendar();
        this.updateDashboard();
        this.setupEventListeners();
        this.checkAchievements();
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
                streak: 0,
                achievements: [],
                website: "",
                portfolio: [],
                proofs: {},
                startDate: new Date().toISOString()
            };
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('najah45_progress', JSON.stringify(this.progressData));
    }

    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';
        
        for (let day = 1; day <= this.accessWindow; day++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            cell.textContent = day;
            
            if (day <= this.totalDays) {
                if (this.progressData.completedDays.includes(day)) {
                    cell.className += ' completed';
                    cell.title = `مكتمل - اليوم ${day}`;
                } else if (day === this.currentDay) {
                    cell.className += ' current';
                    cell.title = `الحالي - اليوم ${day}`;
                } else if (day < this.currentDay) {
                    cell.className += ' missed';
                    cell.title = `مفقود - اليوم ${day}`;
                } else {
                    cell.className += ' upcoming';
                    cell.title = `قادم - اليوم ${day}`;
                }
            } else {
                cell.style.background = '#f1f5f9';
                cell.style.color = '#9ca3af';
                cell.title = 'يوم مرن';
            }
            
            grid.appendChild(cell);
        }
    }

    updateDashboard() {
        this.updateProgressInfo();
        this.updateTaskDisplay();
        this.updateNavigation();
        this.renderCalendar();
    }

    updateProgressInfo() {
        // Update counters
        document.getElementById('completedDays').textContent = this.progressData.completedDays.length;
        document.getElementById('streakCount').textContent = this.progressData.streak;
        
        // Update phase badge
        const phaseBadge = document.getElementById('phaseBadge');
        const currentPhase = this.getCurrentPhase();
        phaseBadge.textContent = this.phases[currentPhase].name;
        phaseBadge.className = `phase-badge ${this.phases[currentPhase].badge}`;
    }

    getCurrentPhase() {
        if (this.currentDay <= 15) return 1;
        if (this.currentDay <= 30) return 2;
        return 3;
    }

    updateTaskDisplay() {
        document.getElementById('taskTitle').textContent = `المهمة اليومية - اليوم ${this.currentDay}`;
        document.getElementById('taskDescription').innerHTML = this.getTaskContent(this.currentDay);
        
        // Reset proof section
        this.resetProofSection();
    }

    getTaskContent(day) {
        const tasks = {
            1: `<h3>حدد مهارتك الرئيسية</h3>
                <p>فكر في المهارات التي تمتلكها وتستطيع تقديمها كخدمة:</p>
                <ul>
                    <li>ما الذي تجيد فعله بشكل طبيعي؟</li>
                    <li>ماذا يطلب منك الناس المساعدة فيه؟</li>
                    <li>ما المهام التي تستمتع بأدائها؟</li>
                </ul>
                <p><strong>المطلوب:</strong> اكتب قائمة بـ 3 مهارات رئيسية تمتلكها</p>`,

            2: `<h3>ابحث عن المنافسين المحليين</h3>
                <p>ابحث عن 3 أشخاص أو شركات يقدمون خدمات مشابهة في دول الخليج:</p>
                <ul>
                    <li>ما الخدمات التي يقدمونها؟</li>
                    <li>كيف يعرضون خدماتهم؟</li>
                    <li>ما أسعارهم التقريبية؟</li>
                </ul>
                <p><strong>المطلوب:</strong> اكتب ملاحظات عن ما تعلمته من المنافسين</p>`,

            3: `<h3>حدد جمهورك المستهدف</h3>
                <p>فكر في العملاء المثاليين لخدماتك في الخليج:</p>
                <ul>
                    <li>ما نوع الشركات التي تحتاج خدمتك؟</li>
                    <li>أين يتواجد هؤلاء العملاء؟</li>
                    <li>ما المشاكل التي تحلها لهم؟</li>
                </ul>
                <p><strong>المطلوب:</strong> حدد 3 أنواع من العملاء المستهدفين</p>`,

            7: `<h3>🚀 ابدأ بناء موقعك الشخصي</h3>
                <p>اليوم ستبدأ في إنشاء موقعك الشخصي! اضغط على زر "موقعي" في الأسفل للبدء.</p>
                <p>سنساعدك في إنشاء موقع احترافي خلال 3 أيام فقط.</p>
                <p><strong>المطلوب:</strong> ابدأ في بناء الموقع باستخدام الأداة المخصصة</p>`,

            8: `<h3>📊 ابدأ بناء محفظتك</h3>
                <p>اليوم ستبدأ في إنشاء محفظة أعمالك! اضغط على زر "إنجازاتي" في الأسفل.</p>
                <p>ستعرض محفظتك أفضل أعمالك للعملاء المحتملين.</p>
                <p><strong>المطلوب:</strong> ابدأ في إضافة مشاريعك إلى المحفظة</p>`,

            15: `<h3>🎯 راجع تقدمك في الأسبوعين الأولين</h3>
                <p>تهانينا! أنهيت مرحلة التحضير بنجاح.</p>
                <p>راجع ما أنجزته خلال الأسبوعين الماضيين:</p>
                <ul>
                    <li>المهارات التي حددتها</li>
                    <li>المنافسين الذين درستهم</li>
                    <li>الجمهور المستهدف</li>
                    <li>موقعك الشخصي (إذا أنشأته)</li>
                </ul>
                <p><strong>المطلوب:</strong> اكتب تقريراً مختصراً عن تقدمك</p>`,

            16: `<h3>💼 ابدأ المشروع الأول في محفظتك</h3>
                <p>الآن حان وقت التنفيذ! ستبدأ في إضافة مشاريع حقيقية إلى محفظتك.</p>
                <p>المشروع الأول: أنشئ عملاً نموذجياً يظهر مهاراتك بشكل احترافي.</p>
                <p><strong>المطلوب:</strong> ابدأ في العمل على المشروع الأول</p>`,

            30: `<h3>⚡ منتصف الرحلة - تقييم شامل</h3>
                <p>وصلت إلى منتصف رحلة النجاح! تهانينا على استمراريتك.</p>
                <p>راجع إنجازاتك حتى الآن واستعد لمرحلة كسب العملاء.</p>
                <p><strong>المطلوب:</strong> قيم تقدمك وحدد أهداف الأسابيع القادمة</p>`,

            45: `<h3>🎉 اليوم الأخير - احتفل بإنجازك!</h3>
                <p>مبروك! أكملت رحلة الـ45 يوماً بنجاح.</p>
                <p>أنت الآن مستعد تماماً لبدء رحلتك في العمل الحر بمهنية واحترافية.</p>
                <p><strong>المطلوب:</strong> اكتب رسالة شكر لنفسك على الالتزام والاستمرارية</p>`
        };

        return tasks[day] || `<h3>المهمة اليومية - اليوم ${day}</h3>
                            <p>استمر في رحلتك! اليوم سيساعدك في التقدم خطوة أخرى نحو أهدافك.</p>
                            <p><strong>المطلوب:</strong> اتبع التعليمات المحددة للمهمة</p>`;
    }

    resetProofSection() {
        document.getElementById('proofPreview').style.display = 'none';
        document.getElementById('proofText').value = '';
        document.getElementById('proofFile').value = '';
        this.updateSubmitButton();
    }

    updateSubmitButton() {
        const submitBtn = document.getElementById('submitTaskBtn');
        const hasProof = document.getElementById('proofPreview').style.display !== 'none' || 
                        document.getElementById('proofText').value.trim() !== '';
        
        submitBtn.disabled = !hasProof;
    }

    updateNavigation() {
        // Enable website on day 7, portfolio on day 8
        document.getElementById('websiteBtn').disabled = this.currentDay < 7;
        document.getElementById('portfolioBtn').disabled = this.currentDay < 8;
    }

    setupEventListeners() {
        // Proof upload
        document.getElementById('uploadProofBtn').addEventListener('click', () => {
            document.getElementById('proofFile').click();
        });

        document.getElementById('proofFile').addEventListener('change', (e) => {
            this.handleProofUpload(e);
        });

        document.getElementById('removeProofBtn').addEventListener('click', () => {
            this.resetProofSection();
        });

        document.getElementById('proofText').addEventListener('input', () => {
            this.updateSubmitButton();
        });

        // Submit task
        document.getElementById('submitTaskBtn').addEventListener('click', () => {
            this.submitTask();
        });

        // Navigation
        document.getElementById('websiteBtn').addEventListener('click', () => {
            this.openWebsiteBuilder();
        });

        document.getElementById('portfolioBtn').addEventListener('click', () => {
            this.openPortfolioManager();
        });

        document.getElementById('achievementsBtn').addEventListener('click', () => {
            this.showAchievements();
        });

        document.getElementById('certificateBtn').addEventListener('click', () => {
            this.showCertificate();
        });

        // Modal controls
        document.getElementById('closeAchievements').addEventListener('click', () => {
            document.getElementById('achievementsModal').style.display = 'none';
        });
    }

    handleProofUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('proofPreview').style.display = 'block';
                this.updateSubmitButton();
            };
            reader.readAsDataURL(file);
        }
    }

    submitTask() {
        if (this.currentDay > this.totalDays) {
            alert('🎉 مبروك! أكملت جميع أيام التحدي بنجاح!');
            return;
        }

        // Save proof
        const proofText = document.getElementById('proofText').value;
        const proofFile = document.getElementById('proofFile').files[0];
        
        this.progressData.proofs = this.progressData.proofs || {};
        this.progressData.proofs[this.currentDay] = {
            text: proofText,
            hasFile: !!proofFile,
            timestamp: new Date().toISOString()
        };

        // Update progress
        if (!this.progressData.completedDays.includes(this.currentDay)) {
            this.progressData.completedDays.push(this.currentDay);
        }

        // Calculate streak
        this.calculateStreak();

        // Move to next day
        this.currentDay++;
        this.progressData.currentDay = this.currentDay;

        // Save and update
        this.saveProgress();
        this.checkAchievements();
        
        // Show celebration
        this.showCelebration();
        
        // Update dashboard
        setTimeout(() => {
            this.updateDashboard();
        }, 2000);
    }

    calculateStreak() {
        const completed = [...this.progressData.completedDays].sort((a, b) => a - b);
        let streak = 0;
        let expectedDay = 1;

        for (let day of completed) {
            if (day === expectedDay) {
                streak++;
                expectedDay++;
            }
        }

        this.progressData.streak = streak;
    }

    checkAchievements() {
        const unlocked = [];
        
        this.achievements.forEach(achievement => {
            if (this.progressData.completedDays.includes(achievement.day) && 
                !this.progressData.achievements.includes(achievement.id)) {
                unlocked.push(achievement);
                this.progressData.achievements.push(achievement.id);
            }
        });

        if (unlocked.length > 0) {
            this.showUnlockedAchievements(unlocked);
        }
        
        this.saveProgress();
    }

    showUnlockedAchievements(achievements) {
        let message = "🎉 مبروك! فزت بميداليات جديدة:\n\n";
        achievements.forEach(ach => {
            message += `${ach.icon} ${ach.name}\n${ach.desc}\n\n`;
        });
        alert(message);
    }

    showCelebration() {
        const submitBtn = document.getElementById('submitTaskBtn');
        submitBtn.classList.add('celebration-animation');
        
        setTimeout(() => {
            submitBtn.classList.remove('celebration-animation');
        }, 1000);

        alert(`🎊 مبروك! أكملت اليوم ${this.currentDay - 1} بنجاح!\n\nاستمر في التقدم!`);
    }

    openWebsiteBuilder() {
        alert('🚀 أداة بناء الموقع الشخصي - قيد التطوير\n\nستساعدك في إنشاء موقع احترافي خلال 3 أيام!');
    }

    openPortfolioManager() {
        alert('📊 مدير المحفظة الشخصية - قيد التطوير\n\nستعرض هنا أفضل أعمالك وإنجازاتك!');
    }

    showAchievements() {
        const grid = document.getElementById('achievementsGrid');
        grid.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${this.progressData.achievements.includes(achievement.id) ? 'unlocked' : ''}`;
            
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.name}</h4>
                <p>${achievement.desc}</p>
                <small>${this.progressData.achievements.includes(achievement.id) ? '✅ مكتمل' : '🔒 مقفل'}</small>
            `;
            
            grid.appendChild(card);
        });
        
        document.getElementById('achievementsModal').style.display = 'block';
    }

    showCertificate() {
        const completed = this.progressData.completedDays.length;
        const eligible = completed >= 45;
        
        const message = eligible ? 
            `🏆 تهانينا! أنت مؤهل للحصول على شهادة نجاح 45!\n\nأكملت ${completed} من 45 يوم بنجاح.` :
            `📜 تقدمك نحو الشهادة: ${completed} من 45 يوم مكتمل\n\nأنت تحتاج ${45 - completed} أيام إضافية للحصول على الشهادة.`;
            
        alert(message);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    new Najah45Dashboard();
});
