/**
 * Navigation Manager
 * Handles referencing and manipulating the website's navigation toolbar.
 */
const NavigationManager = {
    // 1. Cache the navigation links
    getLinks() {
        // Targets all anchor tags within the navigation container
        // If your nav gets wrapped in a <nav> tag later, change selector to 'nav a'
        return document.querySelectorAll('header a, .navigation-container a, a[href^="url?id="]');
    },

    // 2. Find a specific nav item by its text content
    findLinkByText(text) {
        const links = this.getLinks();
        return Array.from(links).find(link => link.textContent.trim().toLowerCase() === text.toLowerCase());
    },

    // 3. Highlight the active page link
    setActivePage() {
        const currentUrl = window.location.href;
        const links = this.getLinks();

        links.forEach(link => {
            if (link.href === currentUrl) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page'); // Good for accessibility
            } else {
                link.classList.remove('active');
            }
        });
    },

    // 4. Add custom click behavior (e.g., smooth scrolling or analytics tracking)
    initNavigationClicks(callback) {
        const links = this.getLinks();
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                if (typeof callback === 'function') {
                    callback(event, link);
                }
            });
        });
    }
};

// Automatically run setup when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    NavigationManager.setActivePage();
});