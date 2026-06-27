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
        // Grab the clean filename from the end of the path, ignoring slashes or backslashes
        let currentPath = window.location.pathname.split(/[/\\]/).pop();
        
        // If the path is empty or a root index, default to index.html
        if (!currentPath || currentPath === "ericshotwellusa.com" || currentPath === "") {
            currentPath = "index.html";
        }
        
        const links = this.getLinks();

        links.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;
            
            let linkPath = linkHref.split('/').pop();

            // Match both direct filenames (about.html) and extensionless paths (about)
            const isMatch = (linkPath === currentPath) || 
                            (linkPath.replace(".html", "") === currentPath.replace(".html", ""));

            if (isMatch) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
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