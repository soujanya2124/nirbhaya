// Toast notification system
class Toast {
    constructor() {
        console.log('[Toast] Initializing toast notification system');
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'default') {
        console.log(`[Toast] Showing notification: ${message} (${type})`);
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => {
                this.container.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

const toast = new Toast();

// SOS Demo Implementation
class SOSDemo {
    constructor() {
        console.log('[SOSDemo] Initializing SOS demo component');
        this.button = document.getElementById('sosButton');
        this.statusContainer = document.getElementById('sosStatus');
        this.isActive = false;
        this.timeouts = [];

        if (!this.button || !this.statusContainer) {
            console.error('[SOSDemo] Required DOM elements not found');
            return;
        }

        this.button.addEventListener('click', () => this.activate());
        console.log('[SOSDemo] Successfully initialized');
    }

    activate() {
        if (this.isActive) {
            console.log('[SOSDemo] Already active, ignoring activation request');
            return;
        }

        console.log('[SOSDemo] Activating emergency simulation');
        this.isActive = true;
        this.button.classList.add('active');
        this.statusContainer.innerHTML = '';
        toast.show('SOS Activated - Emergency services are being contacted...', 'error');

        const sequence = [
            {
                message: 'Emergency Services Contacted',
                icon: 'bxs-error',
                delay: 2000
            },
            {
                message: 'Alert Sent to Emergency Contacts',
                icon: 'bxs-bell',
                delay: 4000
            },
            {
                message: 'Location Shared Successfully',
                icon: 'bxs-check-circle',
                delay: 6000
            }
        ];

        sequence.forEach(({ message, icon, delay }) => {
            const timeout = setTimeout(() => {
                console.log(`[SOSDemo] Sequence step: ${message}`);
                this.statusContainer.appendChild(
                    this.createStatusMessage(message, icon)
                );
            }, delay);
            this.timeouts.push(timeout);
        });

        const resetTimeout = setTimeout(() => {
            this.reset();
            toast.show('Demo completed - System reset');
        }, 8000);
        this.timeouts.push(resetTimeout);
    }

    createStatusMessage(message, icon) {
        const div = document.createElement('div');
        div.className = 'status-message';
        div.innerHTML = `<i class='bx ${icon}'></i>${message}`;
        return div;
    }

    reset() {
        console.log('[SOSDemo] Resetting demo state');
        this.isActive = false;
        this.button.classList.remove('active');
        this.statusContainer.innerHTML = '';
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];
    }
}

// Location Sharing Implementation
class LocationSharing {
    constructor() {
        console.log('[LocationSharing] Initializing location sharing component');
        this.button = document.getElementById('shareLocationButton');
        this.statusContainer = document.getElementById('shareStatus');

        if (!this.button || !this.statusContainer) {
            console.error('[LocationSharing] Required DOM elements not found');
            return;
        }

        this.button.addEventListener('click', () => this.shareLocation());
        console.log('[LocationSharing] Successfully initialized');
    }

    async shareLocation() {
        if (!navigator.geolocation) {
            console.error('[LocationSharing] Geolocation not supported');
            toast.show('Geolocation is not supported by your browser', 'error');
            return;
        }

        try {
            console.log('[LocationSharing] Requesting user location');
            this.button.disabled = true;
            this.statusContainer.innerHTML = `
                <div class="status-message">
                    <i class='bx bx-loader-alt bx-spin'></i>
                    <span>Getting your location...</span>
                </div>
            `;

            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            console.log('[LocationSharing] Location obtained:', { latitude, longitude });

            // Create share content
            const shareData = {
                title: 'My Location',
                text: 'Here is my current location',
                url: `https://maps.google.com/?q=${latitude},${longitude}`
            };

            if (navigator.share) {
                await navigator.share(shareData);
                console.log('[LocationSharing] Shared via native share API');
                toast.show('Location shared successfully!');
            } else {
                console.log('[LocationSharing] Native sharing unavailable, showing link');
                this.showShareLink(shareData.url);
            }
        } catch (error) {
            console.error('[LocationSharing] Error:', error);
            toast.show(
                error.code === 1 
                    ? 'Please allow location access to share your location' 
                    : 'Error sharing location',
                'error'
            );
        } finally {
            this.button.disabled = false;
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }

    showShareLink(url) {
        console.log('[LocationSharing] Displaying share link');
        this.statusContainer.innerHTML = `
            <div class="share-link">${url}</div>
            <div class="share-actions">
                <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${url}').then(() => toast.show('Link copied to clipboard!'))">
                    <i class='bx bx-copy'></i> Copy Link
                </button>
            </div>
        `;
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[App] Initializing application components...');
    try {
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            console.error('[App] Global error:', { msg, url, lineNo, columnNo, error });
            return false;
        };

        new SOSDemo();
        new LocationSharing();
        console.log('[App] All components initialized successfully');
    } catch (error) {
        console.error('[App] Initialization error:', error);
    }
});

// Add styles for toast notifications
const style = document.createElement('style');
style.textContent = `
    .toast-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
    }

    .toast {
        background-color: var(--card-bg);
        color: var(--foreground);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
    }

    .toast-error {
        border-left: 4px solid var(--primary);
    }

    .toast-fade-out {
        animation: slideOut 0.3s ease forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);