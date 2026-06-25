/**
 * Navigation Manager
 * Handles referencing and manipulating the website's navigation toolbar.
 */
const NavigationManager = {
    // 1. Cache the navigation links accurately targeting your toolbar
    getLinks() {
        return document.querySelectorAll('.navigation-toolbar a');
    },

    // 2. Find a specific nav item by its text content
    findLinkByText(text) {
        const links = this.getLinks();
        return Array.from(links).find(link => link.textContent.trim().toLowerCase() === text.toLowerCase());
    },

    // 3. Highlight the active page link beautifully
    setActivePage() {
        // Get just the current page filename (e.g., "inspiration.html") or default to index.html
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        const links = this.getLinks();

        links.forEach(link => {
            // Safely grab the filename from the link's href attribute
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;
            
            const linkPath = linkHref.split("/").pop();

            // Match exact filenames to avoid full domain comparison issues
            if (linkPath === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page'); // Good for accessibility
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
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