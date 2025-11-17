class Najah45Dashboard {
    constructor() {
        this.currentDay = 1;
        this.totalDays = 45;
        this.accessWindow = 48;
        this.progressData = null;
        this.userName = "زائر";
        
        this.medals = [
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
        this.setupEventListeners();
        this.renderCalendar();
        this.updateDashboard();
        this.checkMedals();
        
        // إذا كان المستخدم جديداً، اطلب اسمه
        if (!this.progressData.userName) {
            this.askForUserName();
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('najah45_progress');
        if (saved) {
            this.progressData = JSON.parse(saved);
            this.currentDay = Math.min(this.progressData.currentDay || 1, this.totalDays);
            this.userName = this.progressData.userName || "زائر";
        } else {
            this.progressData = {
                currentDay: 1,
                completedDays: [],
                streak: 0,
                unlockedMedals: [],
                proofs: {},
                userName: "",
                startDate: new Date().toISOString()
            };
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('najah45_progress', JSON.stringify(this.progressData));
    }

    askForUserName() {
        const name = prompt("مرحباً! ما هو اسمك؟") || "زميل";
        this.userName = name;
        this.progressData.userName = name;
        this.saveProgress();
        this.updateWelcomeMessage();
    }

    setupEventListeners() {
        // زر رفع الإثبات
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('proofFile').click();
        });

        // تغيير الملف
        document.getElementById('proofFile').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // إزالة الصورة
        document.getElementById('removeProofBtn').addEventListener('click', () => {
            this.removeProof();
        });

        // نص الإثبات
        document.getElementById('proofNotes').addEventListener('input', () => {
            this.updateSubmitButton();
        });

        // زر التسليم
        document.getElementById('submitBtn').addEventListener('click', () => {
            this.submitTask();
        });

        // أزرار التنقل السفلي
        document.getElementById('websiteBtn').addEventListener('click', () => {
            this.openWebsite();
        });

        document.getElementById('portfolioBtn').addEventListener('click', () => {
            this.openPortfolio();
        });

        document.getElementById('medalsBtn').addEventListener('click', () => {
            this.showMedals();
        });

        document.getElementById('certificateBtn').addEventListener('click', () => {
            this.showCertificate();
        });

        // إغلاق النوافذ
        document.getElementById('closeMedals').addEventListener('click', () => {
            document.getElementById('medalsModal').style.display = 'none';
        });

        document.getElementById('closeCertificate').addEventListener('click', () => {
            document.getElementById('certificateModal').style.display = 'none';
        });
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
                } else if (day === this.currentDay) {
                    cell.className += ' current';
                } else if (day < this.currentDay) {
                    cell.className += ' missed';
                } else {
                    cell.className += ' upcoming';
                }
            } else {
                cell.className += ' grace';
            }
            
            grid.appendChild(cell);
        }
    }

    updateDashboard() {
        this.updateWelcomeMessage();
        this.updateTaskDisplay();
        this.updateNavigation();
        this.updatePhases();
        this.renderCalendar();
    }

    updateWelcomeMessage() {
        document.getElementById('welcomeText').textContent = `مرحباً يا ${this.userName}!`;
        document.getElementById('streakCount').textContent = this.progressData.streak;
    }

    updateTaskDisplay() {
        document.getElementById('taskTitle').textContent = `المهمة اليومية - اليوم ${this.currentDay}`;
        document.getElementById('taskDescription').innerHTML = this.getTaskDescription(this.currentDay);
        this.resetProofSection();
    }

    getTaskDescription(day) {
        const tasks = {
            1: `<p><strong>اليوم الأول - ابدأ رحلتك!</strong></p>
                <p>حدد مهارتك الرئيسية واكتب وصفاً مختصراً للخدمة التي ستقدمها.</p>
                <p>💡 <em>تلميح: فكر فيما يطلبه منك الناس دائماً</em></p>`,

            2: `<p><strong>ابحث عن المنافسين</strong></p>
                <p>ابحث عن 3 منافسين محليين في مجالك وادرس عروضهم.</p>
                <p>🎯 <em>الهدف: فهم السوق المحلي</em></p>`,

            3: `<p><strong>حدد جمهورك</strong></p>
                <p>حدد جمهورك المستهدف في دول الخليج.</p>
                <p>👥 <em>ركز على العملاء المناسبين</em></p>`,

            7: `<p><strong>🚀 ابدأ بناء موقعك الشخصي</strong></p>
                <p>اليوم ستبدأ في إنشاء موقعك الشخصي!</p>
                <p>🌐 <em>اضغط على زر "موقعي" في الأسفل للبدء</em></p>`,

            8: `<p><strong>📊 ابدأ بناء إنجازاتك</strong></p>
                <p>اليوم ستبدأ في بناء محفظة أعمالك!</p>
                <p>💼 <em>اضغط على زر "إنجازاتي" في الأسفل</em></p>`,

            15: `<p><strong>🎯 راجع تقدمك</strong></p>
                <p>راجع ما أنجزته خلال الأسبوعين الماضيين.</p>
                <p>📈 <em>استعد لمرحلة الإثبات</em></p>`,

            30: `<p><strong>⚡ منتصف الرحلة</strong></p>
                <p>وصلت إلى منتصف رحلة النجاح! تهانينا!</p>
                <p>🎊 <em>استعد لمرحلة كسب العملاء</em></p>`,

            45: `<p><strong>🎉 اليوم الأخير</strong></p>
                <p>مبروك! أكملت رحلة الـ45 يوماً بنجاح.</p>
                <p>🏆 <em>أنت الآن مستعد لبدء رحلتك بمهنية</em></p>`
        };

        return tasks[day] || `<p><strong>اليوم ${day} - استمر في التقدم</strong></p>
                            <p>واصل رحلتك نحو النجاح في العمل الحر.</p>
                            <p>💪 <em>كل يوم يقربك من أهدافك</em></p>`;
    }

    resetProofSection() {
        document.getElementById('proofPreview').style.display = 'none';
        document.getElementById('proofNotes').value = '';
        document.getElementById('proofFile').value = '';
        this.updateSubmitButton();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('proofPreview').style.display = 'block';
                this.updateSubmitButton();
            };
            reader.readAsDataURL(file);
        }
    }

    removeProof() {
        this.resetProofSection();
    }

    updateSubmitButton() {
        const hasProof = document.getElementById('proofPreview').style.display !== 'none' || 
                        document.getElementById('proofNotes').value.trim() !== '';
        document.getElementById('submitBtn').disabled = !hasProof;
    }

    updateNavigation() {
        document.getElementById('websiteBtn').disabled = this.currentDay < 7;
        document.getElementById('portfolioBtn').disabled = this.currentDay < 8;
    }

    updatePhases() {
        // إزالة النشاط من جميع المراحل
        document.querySelectorAll('.phase-pill').forEach(pill => {
            pill.classList.remove('active');
        });

        // تفعيل المرحلة الحالية
        if (this.currentDay <= 15) {
            document.getElementById('phase1').classList.add('active');
        } else if (this.currentDay <= 30) {
            document.getElementById('phase2').classList.add('active');
        } else {
            document.getElementById('phase3').classList.add('active');
        }
    }

    submitTask() {
        if (this.currentDay > this.totalDays) {
            alert('🎉 مبروك! أكملت جميع أيام التحدي بنجاح!');
            return;
        }

        // حفظ الإثبات
        const proofText = document.getElementById('proofNotes').value;
        const proofFile = document.getElementById('proofFile').files[0];
        
        this.progressData.proofs = this.progressData.proofs || {};
        this.progressData.proofs[this.currentDay] = {
            text: proofText,
            hasFile: !!proofFile,
            timestamp: new Date().toISOString()
        };

        // تحديث التقدم - فتح فوري (بدون انتظار 24 ساعة)
        if (!this.progressData.completedDays.includes(this.currentDay)) {
            this.progressData.completedDays.push(this.currentDay);
        }

        // حساب التتابع
        this.calculateStreak();

        // الانتقال لليوم التالي - فوري
        this.currentDay++;
        this.progressData.currentDay = this.currentDay;

        // الحفظ والتحديث
        this.saveProgress();
        this.checkMedals();
        
        // الاحتفال
        this.celebrate();
        
        // تحديث اللوحة
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

    checkMedals() {
        const newlyUnlocked = [];
        
        this.medals.forEach(medal => {
            if (this.progressData.completedDays.includes(medal.day) && 
                !this.progressData.unlockedMedals.includes(medal.id)) {
                newlyUnlocked.push(medal);
                this.progressData.unlockedMedals.push(medal.id);
            }
        });

        if (newlyUnlocked.length > 0) {
            this.showUnlockedMedals(newlyUnlocked);
        }
        
        this.saveProgress();
    }

    showUnlockedMedals(medals) {
        let message = "🎉 مبروك! فزت بميداليات جديدة:\n\n";
        medals.forEach(medal => {
            message += `${medal.icon} ${medal.name}\n${medal.desc}\n\n`;
        });
        alert(message);
    }

    celebrate() {
        // رسوميات الاحتفال
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        // رسالة نجاح
        alert(`🎊 مبروك! أكملت اليوم ${this.currentDay - 1} بنجاح!\n\nاليوم التالي مفتوح الآن!`);
    }

    openWebsite() {
        alert('🚀 أداة بناء الموقع الشخصي - قيد التطوير\n\nستساعدك في إنشاء موقع احترافي خلال 3 أيام!');
    }

    openPortfolio() {
        alert('📊 مدير المحفظة الشخصية - قيد التطوير\n\nستعرض هنا أفضل أعمالك وإنجازاتك!');
    }

    showMedals() {
        const grid = document.getElementById('medalsGrid');
        grid.innerHTML = '';
        
        this.medals.forEach(medal => {
            const isUnlocked = this.progressData.unlockedMedals.includes(medal.id);
            const card = document.createElement('div');
            card.className = `medal-card ${isUnlocked ? 'unlocked' : ''}`;
            
            card.innerHTML = `
                <div class="medal-icon">${medal.icon}</div>
                <div class="medal-name">${medal.name}</div>
                <div class="medal-desc">${medal.desc}</div>
                <div class="medal-status ${isUnlocked ? 'unlocked' : 'locked'}">
                    ${isUnlocked ? '✅ مكتمل' : '🔒 مقفل'}
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        document.getElementById('medalsModal').style.display = 'block';
    }

    showCertificate() {
        const completed = this.progressData.completedDays.length;
        const progress = Math.min(100, (completed / this.totalDays) * 100);
        const isEligible = completed >= this.totalDays;
        
        const content = document.getElementById('certificateContent');
        content.innerHTML = `
            <div class="certificate-progress">
                ${isEligible ? 
                    '🏆 تهانينا! أنت مؤهل للحصول على شهادة نجاح 45!' :
                    `📊 تقدمك نحو الشهادة: ${completed}/${this.totalDays} يوم (${progress.toFixed(1)}%)`
                }
            </div>
            <p>${isEligible ? 
                'لقد أكملت جميع الأيام الـ45 بنجاح. أنت الآن جاهز لبدء رحلتك في العمل الحر!' :
                `أنت تحتاج ${this.totalDays - completed} أيام إضافية للحصول على الشهادة. استمر!`
            }</p>
            <button class="certificate-download" ${isEligible ? '' : 'disabled'}>
                📥 تحميل الشهادة
            </button>
        `;
        
        document.getElementById('certificateModal').style.display = 'block';
    }
}

// تهيئة اللوحة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    new Najah45Dashboard();
});
