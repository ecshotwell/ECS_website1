let masterGalleryData = [];

// 1. Fetch and Parse CSV File
Papa.parse("images.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        masterGalleryData = results.data;
        populateFilterDropdowns(masterGalleryData);
        displayGallery(masterGalleryData);
    },
    error: function(err) {
        // Safe check for the portfolio grid container
        const grid = document.getElementById('portfolio-grid');
        if (grid) {
            grid.innerHTML = '<p class="no-results">Error loading portfolio data. Please ensure images.csv exists.</p>';
        }
        console.error(err);
    }
});

// 2. Dynamically extract unique values for dropdown filters (Matches exact HTML select elements)
function populateFilterDropdowns(data) {
    const attributes = ['subject', 'medium', 'location', 'size', 'artist'];
    attributes.forEach(attr => {
        // FIXED: Matched exact ID naming conventions matching your layout (e.g., id="subject")
        const selectElement = document.getElementById(attr);
        
        if (!selectElement) return; // Safeguard if select elements haven't loaded yet

        // Extract unique values matching exact lowercase CSV headers safely
        const uniqueValues = [...new Set(data.map(item => {
            const val = item[attr];
            return val ? val.trim() : null;
        }).filter(Boolean))].sort();
        
        // Clear any existing dynamic options except the first "All" option
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

// 3. Render gallery grid cards
function displayGallery(items) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (items.length === 0) {
        grid.innerHTML = '<div class="no-results">No items match your chosen filter criteria.</div>';
        return;
    }
    
    items.forEach((item, index) => {
        if (!item.filename) return; // Guard against corrupt CSV rows

        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        let cleanFilename = item.filename.trim();
        let imgPath = cleanFilename.startsWith('imgfiles/') ? `./${cleanFilename}` : `./imgfiles/ecs-art/${cleanFilename}`;

        card.innerHTML = `
            <img src="${imgPath}" alt="${item.subject || 'Artwork'}" loading="lazy">
            <div class="gallery-info">
                <h3>${item.subject || 'Untitled'}</h3>
                <p><strong>Medium:</strong> ${item.medium || 'N/A'}</p>
                <p><strong>Location:</strong> ${item.location || 'N/A'}</p>
                <p><strong>Size:</strong> ${item.size || 'N/A'}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openLightbox(item, imgPath));
        grid.appendChild(card);
    });
}

/// 4. Filter gallery calculation
function filterGallery() {
    const subjectFilter = document.getElementById('subject').value;
    const mediumFilter = document.getElementById('medium').value;
    const locationFilter = document.getElementById('location').value;
    const sizeFilter = document.getElementById('size').value;
    const artistFilter = document.getElementById('artist').value;
    
    const filteredResults = masterGalleryData.filter(item => {
        const matchSubject = (subjectFilter === 'all' || item.subject?.trim() === subjectFilter);
        const matchMedium = (mediumFilter === 'all' || item.medium?.trim() === mediumFilter);
        const matchLocation = (locationFilter === 'all' || item.location?.trim() === locationFilter);
        
        // FIXED: Define the matchSize variable properly using sizeFilter
        const matchSize = (sizeFilter === 'all' || item.size?.trim() === sizeFilter);
        
        const matchArtist = (artistFilter === 'all' || item.artist?.trim() === artistFilter);
        
        return matchSubject && matchMedium && matchLocation && matchSize && matchArtist;
    });
    displayGallery(filteredResults);
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
    document.getElementById('lightbox-location').textContent = item.location || 'N/A';
    document.getElementById('lightbox-size').textContent = item.size || 'N/A';
    document.getElementById('lightbox-artist').textContent = item.artist || 'N/A';
    
    box.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event && event.stopPropagation) {
        event.stopPropagation();
    }
    const box = document.getElementById('lightbox');
    if (box) box.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});