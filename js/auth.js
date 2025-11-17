// TEST MODE - NO AUTH REQUIRED
console.log("Running in test mode - no authentication");

const authManager = {
    currentUser: { email: "test@example.com" },
    updateUI: function() {
        document.getElementById('userEmail').textContent = "وضع التجربة";
    },
    logout: function() {
        if (confirm("العودة للصفحة الرئيسية؟")) {
            window.location.href = 'index.html';
        }
    }
};

// Initialize immediately
authManager.updateUI();

// Logout button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logoutBtn').addEventListener('click', authManager.logout);
});
