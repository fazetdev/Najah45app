// Phase management and transitions
class PhaseManager {
    constructor() {
        this.phases = {
            1: {
                name: "التحضير",
                range: "1-15",
                color: "#3b82f6",
                description: "بناء الأساسيات وتحديد المسار",
                tasks: "التخطيط، التعريف، والتجهيز"
            },
            2: {
                name: "الإثبات",
                range: "16-30", 
                color: "#10b981",
                description: "بناء المحفظة وإثبات الجودة",
                tasks: "التنفيذ، المشاريع، والتطبيق"
            },
            3: {
                name: "العمل",
                range: "31-45",
                color: "#f59e0b", 
                description: "كسب العملاء وتحقيق الدخل",
                tasks: "التسويق، التفاوض، والاحتفاظ"
            }
        };
    }

    // Get current phase based on day
    getCurrentPhase(currentDay) {
        if (currentDay <= 15) return 1;
        if (currentDay <= 30) return 2;
        return 3;
    }

    // Get phase information
    getPhaseInfo(phaseNumber) {
        return this.phases[phaseNumber] || this.phases[1];
    }

    // Check if phase transition occurred
    checkPhaseTransition(oldDay, newDay) {
        const oldPhase = this.getCurrentPhase(oldDay);
        const newPhase = this.getCurrentPhase(newDay);
        
        return oldPhase !== newPhase;
    }

    // Handle phase transition
    handlePhaseTransition(newPhase) {
        const phaseInfo = this.getPhaseInfo(newPhase);
        
        // Show phase transition message
        const message = `🎯 انتقلت لمرحلة ${phaseInfo.name}\n\n${phaseInfo.description}\n\nالمهام: ${phaseInfo.tasks}`;
        alert(message);
        
        // Update UI with new phase color
        this.updatePhaseUI(newPhase);
    }

    // Update UI elements with phase colors
    updatePhaseUI(phaseNumber) {
        const phaseInfo = this.getPhaseInfo(phaseNumber);
        
        // Update progress bar color
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.background = phaseInfo.color;
        }
        
        // Update active phase indicator
        const phases = document.querySelectorAll('.phase');
        phases.forEach(phase => {
            if (phase.classList.contains('active')) {
                phase.style.background = phaseInfo.color;
            }
        });
    }

    // Get phase completion percentage
    getPhaseCompletion(currentDay) {
        const currentPhase = this.getCurrentPhase(currentDay);
        const phaseStartDay = (currentPhase - 1) * 15 + 1;
        const daysInPhase = 15;
        const daysCompletedInPhase = currentDay - phaseStartDay + 1;
        
        return Math.min(100, Math.max(0, (daysCompletedInPhase / daysInPhase) * 100));
    }

    // Get motivational message based on phase and progress
    getMotivationalMessage(currentDay, phaseProgress) {
        const phase = this.getCurrentPhase(currentDay);
        const phaseInfo = this.getPhaseInfo(phase);
        
        const messages = {
            1: [
                "بداية قوية! استمر في بناء الأساس المتين.",
                "كل يوم يقربك من الانطلاق الفعلي.",
                "التخطيط الجيد نصف النجاح."
            ],
            2: [
                "أنت الآن تبني دليلاً حقيقياً على مهاراتك!",
                "المشاريع التي تنفذها اليوم ستجذب العملاء غداً.",
                "الجودة في التنفيذ تميزك عن الآخرين."
            ],
            3: [
                "هذه هي مرحلة الحصاد! استعد للنتائج.",
                "ثقتك تزداد مع كل عميل تتعامل معه.", 
                "أنت تبني مستقبلك المهني خطوة بخطوة."
            ]
        };
        
        const phaseMessages = messages[phase] || messages[1];
        return phaseMessages[Math.floor(Math.random() * phaseMessages.length)];
    }
}

// Initialize phase manager
const phaseManager = new PhaseManager();
