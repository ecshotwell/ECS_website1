// 1. Select the DOM elements
const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const captionTitle = document.getElementById('captionTitle');
const captionDesc = document.getElementById('captionDesc');

// 2. Initialize the index counters (Shared)
let counter = 0;
let currentIndex = 0; 

// 3. Function to move the carousel and manage button visibility
function updateCarousel() {
  // Get the precise width of one image dynamically
  const size = carouselImages[0].clientWidth; 
  
  // Shift the slide container to the left
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;

  // --- Hide/Show Navigation Buttons ---
  if (counter === 0) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'block';
  }

  if (counter === carouselImages.length - 1) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'block';
  }
}

// 4. Function to update captions dynamically
function updateCaption() {
    // Get the currently active image using the shared index
    const currentImg = carouselImages[counter];
    
    // Extract the custom data attributes
    const title = currentImg.getAttribute('data-title');
    const desc = currentImg.getAttribute('data-desc');
    
    // Inject them into the HTML text elements
    captionTitle.textContent = title;
    captionDesc.textContent = desc;
}

// ==========================================
// 5. Next Button Click Event (Unified)
// ==========================================
nextBtn.addEventListener('click', () => {
  if (counter >= carouselImages.length - 1) return;
  
  counter++;             /* Advance by exactly 1 */
  currentIndex = counter; 
  
  updateCarousel();
  updateCaption(); 
});

// ==========================================
// 6. Prev Button Click Event (Unified)
// ==========================================
prevBtn.addEventListener('click', () => {
  if (counter <= 0) return;
  
  counter--;             /* Decrease by exactly 1 */
  currentIndex = counter; 
  
  updateCarousel();
  updateCaption();
});

// ==========================================
// 7. Responsive Window Resizing & Initial Load
// ==========================================
window.addEventListener('resize', updateCarousel);

// Run once on page load to establish correct layout and text positions
updateCarousel();
updateCaption();