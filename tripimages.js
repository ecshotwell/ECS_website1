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
        populateFilterDropdowns(masterTripData);
        displayGallery(masterTripData);
    },
    error: function(err) {
        const grid = document.getElementById('inspiration-grid');
        if (grid) {
            grid.innerHTML = '<p class="no-results">Error loading travel data. Please ensure tripimages.csv exists.</p>';
        }
        console.error(err);
    }
});

// 2. Dynamically extract unique values for travel dropdown filters
function populateFilterDropdowns(data) {
    // Only map headers relevant to your travel log
    const attributes = ['subject', 'medium', 'location'];
    attributes.forEach(attr => {
        const selectElement = document.getElementById(attr);
        if (!selectElement) return;

        const uniqueValues = [...new Set(data.map(item => {
            const val = item[attr];
            return val ? val.trim() : null;
        }).filter(Boolean))].sort();
        
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }

        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    });
}

// 3. Render inspiration grid cards (optimized for 100 images with lazy loading)
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
        // Updated to use your local travel images folder structure
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

// 4. Filter logic tailored strictly to travel contexts
function filterGallery() {
    const subjectFilter = document.getElementById('subject').value;
    const mediumFilter = document.getElementById('medium').value;
    const locationFilter = document.getElementById('location').value;
    
    const filteredResults = masterTripData.filter(item => {
        const matchSubject = (subjectFilter === 'all' || item.subject?.trim() === subjectFilter);
        const matchMedium = (mediumFilter === 'all' || item.medium?.trim() === mediumFilter);
        const matchLocation = (locationFilter === 'all' || item.location?.trim() === locationFilter);
        
        return matchSubject && matchMedium && matchLocation;
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
    
    // Safely hide or reset elements not used in the travel CSV schema
    const sizeEl = document.getElementById('lightbox-size');
    const artistEl = document.getElementById('lightbox-artist');
    if (sizeEl) sizeEl.textContent = 'N/A';
    if (artistEl) artistEl.textContent = 'N/A';
    
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
// Add this to the very bottom of tripimages.js if keeping your tab HTML structure:
function filterMedium(category) {
    // 1. Swap active class styling on the buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // 2. Filter the cards directly based on the "medium" column
    const items = masterTripData;
    const target = category.toLowerCase();
    
    const filteredResults = items.filter(item => {
        if (target === 'all') return true;
        return item.medium?.trim().toLowerCase() === target;
    });
    
    displayGallery(filteredResults);
}