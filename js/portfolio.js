// Portfolio management
class PortfolioManager {
    constructor() {
        this.projects = [
            { id: 1, name: "المشروع الأول", completed: false, description: "سيتم تفعيله في اليوم 16" },
            { id: 2, name: "المشروع الثاني", completed: false, description: "سيتم تفعيله في اليوم 23" },
            { id: 3, name: "المشروع الثالث", completed: false, description: "سيتم تفعيله في اليوم 30" }
        ];
    }

    // Initialize portfolio progress
    initPortfolio() {
        const saved = localStorage.getItem('najah45_portfolio');
        if (saved) {
            this.projects = JSON.parse(saved);
        }
        this.updatePortfolioProgress();
    }

    // Complete a project
    completeProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.completed = true;
            project.completionDate = new Date().toISOString();
            this.savePortfolio();
            this.updatePortfolioProgress();
            return true;
        }
        return false;
    }

    // Get portfolio progress (0-3)
    getProgress() {
        return this.projects.filter(p => p.completed).length;
    }

    // Update progress in main progress data
    updatePortfolioProgress() {
        const progressData = JSON.parse(localStorage.getItem('najah45_progress') || '{}');
        progressData.portfolioProgress = this.getProgress();
        localStorage.setItem('najah45_progress', JSON.stringify(progressData));
    }

    // Save portfolio to localStorage
    savePortfolio() {
        localStorage.setItem('najah45_portfolio', JSON.stringify(this.projects));
    }

    // Get project by day (which project should be active based on current day)
    getCurrentProject(currentDay) {
        if (currentDay >= 16 && currentDay < 23) return this.projects[0];
        if (currentDay >= 23 && currentDay < 30) return this.projects[1];
        if (currentDay >= 30) return this.projects[2];
        return null;
    }

    // Open portfolio interface
    openPortfolioInterface() {
        const progress = this.getProgress();
        const message = `تقدم الملف الشخصي: ${progress}/3 مشاريع\n\n`;
        const projectsList = this.projects.map(p => 
            `${p.name}: ${p.completed ? '✅ مكتمل' : '⏳ قيد الانتظار'}\n${p.description}`
        ).join('\n\n');
        
        alert(message + projectsList);
    }
}

// Initialize portfolio manager
const portfolioManager = new PortfolioManager();
