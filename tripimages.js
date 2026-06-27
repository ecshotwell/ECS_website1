/* tripimages.js
   Engine for the Inspiration Travel Gallery (100 pictures, 4 categories)
*/

let masterTripData = [];

// 1. Fetch and Parse CSV File
Papa.parse("tripimages.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        masterTripData = results.data;
        // On initial load, only show one preview image for each medium
        displayFeaturedPreviews();
    },
    error: function(err) {
        const grid = document.getElementById('inspiration-grid');
        if (grid) {
            grid.innerHTML = '<p class="no-results">Error loading travel data. Please ensure tripimages.csv exists.</p>';
        }
        console.error(err);
    }
});

// 2. Curated Baseline State: Show exactly 1 representative image per unique discipline, sorted by priority
function displayFeaturedPreviews() {
    // Define the custom order priority to match Gallery page
    const orderMap = {
        'blacksmithing': 1,
        'ironwork': 1,
        'ceramics': 2,
        'pottery': 2,
        'sculpture': 3,
        'other': 4
    };

    const seenMediums = new Set();
    const featuredItems = [];

    // 2.1 Gather one representative item per unique medium
    masterTripData.forEach(item => {
        if (!item.medium || !item.filename) return;
        const cleanMedium = item.medium.trim().toLowerCase();
        
        if (!seenMediums.has(cleanMedium)) {
            seenMediums.add(cleanMedium);
            featuredItems.push(item);
        }
    });

    // 2.2 Sort the curated list based on your defined orderMap
    featuredItems.sort((a, b) => {
        const medA = a.medium.trim().toLowerCase();
        const medB = b.medium.trim().toLowerCase();
        
        const priorityA = orderMap[medA] || 99;
        const priorityB = orderMap[medB] || 99;
        
        return priorityA - priorityB;
    });

    displayGallery(featuredItems);
}

// 3. Render gallery grid cards
function displayGallery(items) {
    const grid = document.getElementById('inspiration-grid'); // Changed back to your correct HTML ID
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (items.length === 0) {
        grid.innerHTML = '<div class="no-results">No pieces match your chosen travel criteria.</div>';
        return;
    }
    
    items.forEach((item) => {
        if (!item.filename) return;

        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        // FIXED: Pointing to the /images folder as requested
        let cleanFilename = item.filename.trim();
        let imgPath = `./images/${cleanFilename}`;

        card.innerHTML = `
            <img src="${imgPath}" alt="${item.subject || 'Inspiration Study'}" loading="lazy">
            <div class="gallery-info">
                <h3>${item.subject || 'Untitled Study'}</h3>
                <p><strong>Medium:</strong> ${item.medium || 'N/A'}</p>
                <p><strong>Location:</strong> ${item.location || 'N/A'}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openLightbox(item, imgPath));
        grid.appendChild(card);
    });
}

// 4. Tab Filtering Engine
function filterMedium(category, evt) {
    const target = category.toLowerCase();
    
    // 4.1 Check if the clicked button is already active
    if (evt && evt.target && evt.target.classList.contains('active')) {
        if (target !== 'all') {
            evt.target.classList.remove('active');
            displayFeaturedPreviews();
            return;
        }
    }

    // 4.2 Swap active class styling safely
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (evt && evt.target) {
        evt.target.classList.add('active');
    }

    const items = masterTripData;
    
    // 4.3 Filtering logic
    const filteredResults = items.filter(item => {
        if (target === 'all') return true;
        if (!item.medium) return false;
        
        const dbMedium = item.medium.trim().toLowerCase();
        return dbMedium.includes(target) || target.includes(dbMedium);
    });
    
    displayGallery(filteredResults);
}

// 5. Lightbox Interaction Functions
function openLightbox(item, calculatedPath) {
    const imgPath = calculatedPath || `./images/${item.filename.trim()}`;
    
    const box = document.getElementById('lightbox');
    if (!box) return;

    document.getElementById('lightbox-img').src = imgPath;
    document.getElementById('lightbox-img').alt = item.subject || 'Inspiration Study';
    document.getElementById('lightbox-title').textContent = item.subject || 'Untitled Study';
    document.getElementById('lightbox-medium').textContent = item.medium || 'N/A';
    document.getElementById('lightbox-location').textContent = item.location || 'N/A';
    
    box.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 5.1 Handles background mask overlay clicks
function closeLightbox(event) {
    if (event.target === document.getElementById('lightbox')) {
        forceCloseLightbox();
    }
}

// 5.2 Closes window instantly
function forceCloseLightbox() {
    const box = document.getElementById('lightbox');
    if (!box) return;
    
    box.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 5.3 Desktop accessibility shortcut
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        forceCloseLightbox();
    }
});