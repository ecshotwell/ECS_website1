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

// 2. Curated Baseline State: Show exactly 1 representative image per unique discipline
function displayInitialState() {
    const uniqueMediums = new Set();
    const curatedItems = [];

    masterGalleryData.forEach(item => {
        const medium = item.medium ? item.medium.trim() : '';
        if (medium && !uniqueMediums.has(medium)) {
            uniqueMediums.add(medium);
            curatedItems.push(item);
        }
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
        
        let cleanFilename = item.filename.trim();
        let imgPath = cleanFilename.startsWith('imgfiles/') ? `./${cleanFilename}` : `./imgfiles/ecs-art/${cleanFilename}`;

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
function filterMediumTab(category, event) {
    const clickedButton = event.currentTarget;
    const isAlreadyActive = clickedButton.classList.contains('active');

    // 1. If clicking ANY active button, deselect it and revert to the baseline curated view
    if (isAlreadyActive) {
        clickedButton.classList.remove('active');
        displayInitialState(); // Reverts instantly back to one thumbnail per discipline
        return;
    }

    // 2. Standard Tab Maintenance: Clear old active assignments inside #gallery-tabs
    const buttons = document.querySelectorAll('#gallery-tabs .tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. Highlight the newly targeted button option
    clickedButton.classList.add('active');

    // 4. Display entire collection or filter cleanly by data category array fields
    if (category === 'all') {
        displayGallery(masterGalleryData);
    } else {
        // Map alternative naming variations safely if needed (e.g. Pottery to Ceramics matching)
        const target = category.toLowerCase();
        const filteredResults = masterGalleryData.filter(item => {
            const med = item.medium ? item.medium.trim().toLowerCase() : '';
            if (target === 'pottery' || target === 'ceramics') {
                return med === 'pottery' || med === 'ceramics';
            }
            return med === target;
        });
        displayGallery(filteredResults);
    }
}

// --- LIGHTBOX INTERACTION FUNCTIONS ---

function openLightbox(item, calculatedPath) {
    const imgPath = calculatedPath || `./${item.filename.trim()}`;
    
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

// Handles background mask overlay clicks
function closeLightbox(event) {
    if (event.target === document.getElementById('lightbox')) {
        forceCloseLightbox();
    }
}

// Closes window instantly (Fires from Close 'X' button & background)
function forceCloseLightbox() {
    const box = document.getElementById('lightbox');
    if (!box) return;
    
    box.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restores page scrolling smoothly
}

// Desktop accessibility shortcut (Escape key close-out)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        forceCloseLightbox();
    }
});