// Celebration animations and effects
class CelebrationManager {
    constructor() {
        this.celebrations = {
            dayComplete: {
                message: "🎉 مبروك! أكملت اليوم بنجاح",
                animation: "bounce"
            },
            phaseComplete: {
                message: "🔥 رائع! أنهيت مرحلة جديدة",
                animation: "fireworks"
            },
            portfolioProject: {
                message: "🚀 مشروع جديد أضيف لملفك الشخصي",
                animation: "rocket"
            },
            certificate: {
                message: "🏆 إنجاز رائع! حصلت على الشهادة",
                animation: "trophy"
            }
        };
    }

    // Show celebration for specific achievement
    showCelebration(type, customMessage = null) {
        const celebration = this.celebrations[type];
        if (!celebration) return;

        const message = customMessage || celebration.message;
        this.showMessage(message);
        this.playAnimation(celebration.animation);
    }

    // Show celebration message
    showMessage(message) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(16, 185, 129, 0.95);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        // Remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }

    // Play animation
    playAnimation(animationType) {
        switch (animationType) {
            case 'bounce':
                this.bounceAnimation();
                break;
            case 'fireworks':
                this.fireworksAnimation();
                break;
            case 'rocket':
                this.rocketAnimation();
                break;
            case 'trophy':
                this.trophyAnimation();
                break;
        }
    }

    // Bounce animation for day completion
    bounceAnimation() {
        const completeBtn = document.getElementById('completeTaskBtn');
        if (completeBtn) {
            completeBtn.style.animation = 'celebrate 0.5s ease 3';
            setTimeout(() => {
                completeBtn.style.animation = '';
            }, 1500);
        }
    }

    // Simple fireworks effect
    fireworksAnimation() {
        this.createParticles(10, '🎊');
        this.createParticles(10, '🎉');
    }

    // Rocket animation
    rocketAnimation() {
        this.createParticles(5, '🚀');
    }

    // Trophy animation
    trophyAnimation() {
        this.createParticles(8, '🏆');
    }

    // Create particle effects
    createParticles(count, emoji) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.textContent = emoji;
                particle.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 999;
                    animation: float 1s ease-out forwards;
                `;

                // Random direction
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 100;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                particle.style.setProperty('--x', x + 'px');
                particle.style.setProperty('--y', y + 'px');

                document.body.appendChild(particle);

                // Remove after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * 100);
        }
    }

    // Add CSS for particle animations
    injectStyles() {
        if (document.getElementById('celebration-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'celebration-styles';
        styles.textContent = `
            @keyframes float {
                0% {
                    transform: translate(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--x), var(--y));
                    opacity: 0;
                }
            }

            @keyframes celebrate {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize celebration manager
const celebrationManager = new CelebrationManager();
celebrationManager.injectStyles();
