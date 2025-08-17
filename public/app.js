class AuthService {
    constructor() {
        this.userKey = 'tradingAppUser';
    }

    isLoggedIn() {
        return !!localStorage.getItem(this.userKey);
    }

    getUser() {
        try {
            return JSON.parse(localStorage.getItem(this.userKey));
        } catch (e) {
            return null;
        }
    }

    getRole() {
        const user = this.getUser();
        return user ? user.role : null;
    }

    login(userData) {
        localStorage.setItem(this.userKey, JSON.stringify(userData));
    }

    logout() {
        localStorage.removeItem(this.userKey);
        window.location.href = '/login.html';
    }

    /**
     * Protects a page, requires a user to be logged in.
     * Redirects to login page if not authenticated.
     * @param {string|null} requiredRole - Optional role required to access the page.
     */
    requireAuth(requiredRole = null) {
        if (!this.isLoggedIn()) {
            this.logout();
            return;
        }

        if (requiredRole && this.getRole() !== requiredRole) {
            alert('Access Denied: You do not have permission to view this page.');
            window.location.href = '/index.html';
        }
    }
}

// Global instance for easy access
const authService = new AuthService();
