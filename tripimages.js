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

// Helper function to extract and show the first image of each unique medium on load
function displayFeaturedPreviews() {
    const featuredItems = [];
    const seenMediums = new Set();

    masterTripData.forEach(item => {
        if (!item.medium || !item.filename) return;
        const cleanMedium = item.medium.trim().toLowerCase();
        
        // If this category hasn't saved a preview image yet, grab this item
        if (!seenMediums.has(cleanMedium)) {
            seenMediums.add(cleanMedium);
            featuredItems.push(item);
        }
    });

    displayGallery(featuredItems);
}

// 2. Render inspiration grid cards (optimized for 100 images with lazy loading)
function displayGallery(items) {
    const grid = document.getElementById('inspiration-grid');
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

// 3. Tab Filtering Engine
function filterMedium(category, evt) {
    const target = category.toLowerCase();
    
    // Check if the clicked button is already active
    if (evt && evt.target && evt.target.classList.contains('active')) {
        // Toggle behavior: If clicking an active category button, collapse it and reset to initial previews
        if (target !== 'all') {
            evt.target.classList.remove('active');
            displayFeaturedPreviews();
            return;
        }
    }

    // Swap active class styling safely across all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (evt && evt.target) {
        evt.target.classList.add('active');
    }

    const items = masterTripData;
    
    // Looser matching strategy to ensure clean string matching between UI targets and dataset strings
    const filteredResults = items.filter(item => {
        if (target === 'all') return true;
        if (!item.medium) return false;
        
        const dbMedium = item.medium.trim().toLowerCase();
        return dbMedium.includes(target) || target.includes(dbMedium);
    });
    
    displayGallery(filteredResults);
}

// --- LIGHTBOX INTERACTION FUNCTIONS ---

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

function closeLightbox(event) {
    if (event.target === document.getElementById('lightbox')) {
        forceCloseLightbox();
    }
}

function forceCloseLightbox() {
    const box = document.getElementById('lightbox');
    if (!box) return;
    
    box.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        forceCloseLightbox();
    }
});