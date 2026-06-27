/* gallery.js
   Engine for the Artwork Portfolio Gallery
*/

let masterGalleryData = [];

// 1. Fetch and Parse CSV File
Papa.parse("images.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        masterGalleryData = results.data;
        // Load the curated baseline view when the page first boots up
        displayInitialState();
    },
    error: function(err) {
        const grid = document.getElementById('portfolio-grid');
        if (grid) {
            grid.innerHTML = '<p class="no-results">Error loading portfolio data. Please ensure images.csv exists.</p>';
        }
        console.error(err);
    }
});

// 2. Curated Baseline State: Show exactly 1 representative image per unique discipline, sorted by priority
function displayInitialState() {
    // Define the custom order priority
    const orderMap = {
        'blacksmithing': 1,
        'ironwork': 1,
        'ceramics': 2,
        'pottery': 2,
        'sculpture': 3,
        'other': 4
    };

    const uniqueMediums = new Set();
    const curatedItems = [];

    // 2.1 Gather one representative item per unique medium
    masterGalleryData.forEach(item => {
        const medium = item.medium ? item.medium.trim().toLowerCase() : '';
        if (medium && !uniqueMediums.has(medium)) {
            uniqueMediums.add(medium);
            curatedItems.push(item);
        }
    });

    // 2.2 Sort the curated list based on your defined orderMap
    curatedItems.sort((a, b) => {
        const medA = a.medium.trim().toLowerCase();
        const medB = b.medium.trim().toLowerCase();
        
        // Get priority, default to 99 if not found
        const priorityA = orderMap[medA] || 99;
        const priorityB = orderMap[medB] || 99;
        
        return priorityA - priorityB;
    });

    displayGallery(curatedItems);
}

// 3. Render gallery grid cards
function displayGallery(items) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (items.length === 0) {
        grid.innerHTML = '<div class="no-results">No items match your chosen filter criteria.</div>';
        return;
    }
    
    items.forEach((item) => {
        if (!item.filename) return;

        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        // Simplified pathing: points directly to your new folder
        let cleanFilename = item.filename.trim();
        let imgPath = `./imgfiles/ecsart/${cleanFilename}`;

        card.innerHTML = `
            <img src="${imgPath}" alt="${item.subject || 'Artwork'}" loading="lazy">
            <div class="gallery-info">
                <h2>${item.subject || 'Untitled'}</h2>
                <div class="meta-line"><span class="meta-label">Medium:</span> ${item.medium || 'N/A'}</div>
                <div class="meta-line"><span class="meta-label">Artist:</span> ${item.artist || 'N/A'}</div>
            </div>
        `;
        
        card.addEventListener('click', () => openLightbox(item, imgPath));
        grid.appendChild(card);
    });
}

// 4. Tab Filtration Engine with Interactive Toggle States
function filterMedium(category, event) {
    // 4.1 Force a clean reference to the button element
    const clickedButton = (event && event.currentTarget) ? event.currentTarget : this;
    
    if (!clickedButton || typeof clickedButton.classList === 'undefined') {
        return;
    }

    const isAlreadyActive = clickedButton.classList.contains('active');

    // 4.2 If clicking ANY active button, deselect it and revert to the baseline curated view
    if (isAlreadyActive) {
        clickedButton.classList.remove('active');
        displayInitialState(); 
        return;
    }

    // 4.3 Standard Tab Maintenance: Clear old active assignments globally
    const buttons = document.querySelectorAll('.tab-btn, #gallery-tabs .tab-btn');
    buttons.forEach(btn => {
        if (btn && btn.classList) {
            btn.classList.remove('active');
        }
    });

    // 4.4 Highlight the newly targeted button option
    clickedButton.classList.add('active');

    // 4.5 Sanitize and lower-case the incoming target parameter
    const target = category ? category.trim().toLowerCase() : '';

    // 4.6 Display entire collection or filter cleanly by data category fields
    if (target === 'all' || target === '') {
        displayGallery(masterGalleryData);
    } else {
        const filteredResults = masterGalleryData.filter(item => {
            const med = item.medium ? item.medium.replace(/\s+/g, ' ').trim().toLowerCase() : '';
            
            // Map alternative variations safely
            if (target === 'blacksmithing' || target === 'ironwork') {
                return med === 'blacksmithing' || med === 'ironwork' || med === 'steel';
            }
            if (target === 'pottery' || target === 'ceramics') {
                return med === 'pottery' || med === 'ceramics';
            }
            return med === target;
        });
        displayGallery(filteredResults);
    }
}

// 5. Lightbox Interaction Functions
function openLightbox(item, calculatedPath) {
    // Force usage of the new folder path
    const imgPath = calculatedPath || `./imgfiles/ecsart/${item.filename.trim()}`;
    
    const box = document.getElementById('lightbox');
    if (!box) return;

    document.getElementById('lightbox-img').src = imgPath;
    document.getElementById('lightbox-img').alt = item.subject || 'Artwork';
    document.getElementById('lightbox-title').textContent = item.subject || 'Untitled';
    document.getElementById('lightbox-medium').textContent = item.medium || 'N/A';
    document.getElementById('lightbox-artist').textContent = item.artist || 'N/A';
    
    box.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 5.1 Handles background mask overlay clicks
function closeLightbox(event) {
    if (event.target === document.getElementById('lightbox')) {
        forceCloseLightbox();
    }
}

// 5.2 Closes window instantly (Fires from Close 'X' button & background)
function forceCloseLightbox() {
    const box = document.getElementById('lightbox');
    if (!box) return;
    
    box.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

// 5.3 Desktop accessibility shortcut (Escape key close-out)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        forceCloseLightbox();
    }
});