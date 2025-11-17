// Authentication functions
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in (from localStorage)
        const userData = localStorage.getItem('najah45_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'index.html';
        }
    }

    updateUI() {
        if (this.currentUser) {
            const userEmailElement = document.getElementById('userEmail');
            if (userEmailElement) {
                userEmailElement.textContent = this.currentUser.email;
            }
        }
    }

    logout() {
        localStorage.removeItem('najah45_user');
        localStorage.removeItem('najah45_progress');
        window.location.href = 'index.html';
    }

    // Simulate login for demo (will be replaced with actual Supabase auth)
    simulateLogin(email) {
        const userData = {
            email: email,
            userId: 'demo_user_' + Date.now(),
            joinedDate: new Date().toISOString()
        };
        localStorage.setItem('najah45_user', JSON.stringify(userData));
        this.currentUser = userData;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Logout button event
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            authManager.logout();
        });
    }
});
