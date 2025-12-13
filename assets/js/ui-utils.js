/**
 * UI Utilities
 */

// Global notification constants if needed
const NOTIFICATION_DURATION = 3000;

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;

    let iconSvgString = '';
    if (type === 'success') {
        iconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${getComputedStyle(document.documentElement).getPropertyValue('--success')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4655" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
        iconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${getComputedStyle(document.documentElement).getPropertyValue('--primary')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    const iconContainer = document.createElement('div');
    iconContainer.className = 'notification-icon';
    iconContainer.appendChild(createSvgElement(iconSvgString));
    toast.appendChild(iconContainer);

    const msgSpan = document.createElement('span');
    msgSpan.className = 'notification-message';
    msgSpan.textContent = message;
    toast.appendChild(msgSpan);

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('closing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, NOTIFICATION_DURATION);
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createSvgElement(svgString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    return doc.documentElement;
}
