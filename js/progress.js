// Progress tracking and certificate logic
class ProgressManager {
    constructor() {
        this.totalDays = 45;
        this.accessWindow = 48; // days
    }

    // Check if user is eligible for certificate
    isCertificateEligible(progressData) {
        if (!progressData.completedDays) return false;
        
        const completed = progressData.completedDays.sort((a, b) => a - b);
        
        // Must complete all 45 days
        if (completed.length < 45) return false;
        
        // Check if completed within access window
        const startDate = new Date(progressData.startDate);
        const endDate = new Date(completed[completed.length - 1]);
        const daysTaken = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        return daysTaken <= this.accessWindow;
    }

    // Calculate current phase
    getCurrentPhase(currentDay) {
        if (currentDay <= 15) return 1;
        if (currentDay <= 30) return 2;
        return 3;
    }

    // Get phase name
    getPhaseName(phaseNumber) {
        const phases = {
            1: { name: "التحضير", color: "#3b82f6", days: "1-15" },
            2: { name: "الإثبات", color: "#10b981", days: "16-30" },
            3: { name: "العمل", color: "#f59e0b", days: "31-45" }
        };
        return phases[phaseNumber] || phases[1];
    }

    // Calculate days remaining in access window
    getDaysRemaining(startDate) {
        const start = new Date(startDate);
        const now = new Date();
        const elapsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
        return Math.max(0, this.accessWindow - elapsed);
    }

    // Check if user missed 4+ days (for certificate eligibility)
    getMissedDaysCount(progressData) {
        if (!progressData.completedDays) return 0;
        
        const completed = progressData.completedDays.sort((a, b) => a - b);
        let missed = 0;
        let expectedDay = 1;

        for (let day of completed) {
            if (day > expectedDay) {
                missed += (day - expectedDay);
            }
            expectedDay = day + 1;
        }

        return missed;
    }

    // Generate certificate data
    generateCertificate(progressData, userData) {
        if (!this.isCertificateEligible(progressData)) {
            return null;
        }

        return {
            userName: userData.email.split('@')[0],
            completionDate: new Date().toISOString().split('T')[0],
            courseName: "نجاح 45 - تحدي 45 يوم",
            daysCompleted: progressData.completedDays.length,
            streak: progressData.streak,
            certificateId: 'NAJAH45-' + Date.now()
        };
    }
}

// Initialize progress manager
const progressManager = new ProgressManager();
