// Offline synchronization manager
class OfflineSync {
    constructor() {
        this.pendingActions = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Load pending actions from localStorage
        this.loadPendingActions();
    }

    // Handle when device comes online
    handleOnline() {
        this.isOnline = true;
        console.log('Device is online - syncing data...');
        this.syncPendingActions();
    }

    // Handle when device goes offline  
    handleOffline() {
        this.isOnline = false;
        console.log('Device is offline - storing locally');
    }

    // Add action to pending queue
    addAction(action) {
        this.pendingActions.push({
            ...action,
            timestamp: new Date().toISOString(),
            id: Date.now() + Math.random()
        });
        
        this.savePendingActions();
    }

    // Sync all pending actions when online
    async syncPendingActions() {
        if (!this.isOnline || this.pendingActions.length === 0) {
            return;
        }

        console.log(`Syncing ${this.pendingActions.length} pending actions...`);

        // Try to sync each pending action
        const successfulSyncs = [];
        const failedSyncs = [];

        for (const action of this.pendingActions) {
            try {
                // Here you would make actual Supabase API calls
                // For now, we'll simulate successful sync
                await this.simulateSupabaseCall(action);
                successfulSyncs.push(action.id);
            } catch (error) {
                console.error('Failed to sync action:', action, error);
                failedSyncs.push(action);
            }
        }

        // Remove successfully synced actions
        this.pendingActions = failedSyncs;
        this.savePendingActions();

        if (successfulSyncs.length > 0) {
            console.log(`Successfully synced ${successfulSyncs.length} actions`);
        }
    }

    // Simulate Supabase API call (replace with actual calls)
    async simulateSupabaseCall(action) {
        return new Promise((resolve) => {
            setTimeout(resolve, 100); // Simulate network delay
        });
    }

    // Save pending actions to localStorage
    savePendingActions() {
        localStorage.setItem('najah45_pending_actions', JSON.stringify(this.pendingActions));
    }

    // Load pending actions from localStorage
    loadPendingActions() {
        const saved = localStorage.getItem('najah45_pending_actions');
        if (saved) {
            this.pendingActions = JSON.parse(saved);
        }
    }

    // Get sync status
    getSyncStatus() {
        return {
            isOnline: this.isOnline,
            pendingActions: this.pendingActions.length,
            lastSync: localStorage.getItem('najah45_last_sync') || 'Never'
        };
    }

    // Force sync
    async forceSync() {
        if (!this.isOnline) {
            throw new Error('Cannot sync while offline');
        }
        
        await this.syncPendingActions();
        localStorage.setItem('najah45_last_sync', new Date().toISOString());
    }
}

// Initialize offline sync manager
const offlineSync = new OfflineSync();

// Export for use in other modules
window.offlineSync = offlineSync;
