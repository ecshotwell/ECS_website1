// 1. Select the DOM elements
const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

// 2. Initialize the index counter
let counter = 0;

// 3. Function to move the carousel and manage button visibility
function updateCarousel() {
  // Get the precise width of one image dynamically
  const size = carouselImages[0].clientWidth; 
  
  // Shift the slide container to the left
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;

  // --- Hide/Show Navigation Buttons ---
  // If on the first slide (index 0), hide the previous button
  if (counter === 0) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'block';
  }

  // If on the last slide, hide the next button
  if (counter === carouselImages.length - 1) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'block';
  }
}

// 4. Next Button Click Event
nextBtn.addEventListener('click', () => {
  // Stop if we are on the last image
  if (counter >= carouselImages.length - 1) return;
  
  counter++;
  updateCarousel();
});

// 5. Prev Button Click Event
prevBtn.addEventListener('click', () => {
  // Stop if we are on the first image
  if (counter <= 0) return;
  
  counter--;
  updateCarousel();
});

// 6. Fix for window resizing (prevents the layout from breaking if the screen changes size)
window.addEventListener('resize', updateCarousel);

const images = document.querySelectorAll('.carousel-slide img');
const captionTitle = document.getElementById('captionTitle');
const captionDesc = document.getElementById('captionDesc');

// Track your active image index (hook this up to your existing index variable)
let currentIndex = 0; 

function updateCaption() {
    // 1. Get the currently active image
    const currentImg = images[currentIndex];
    
    // 2. Extract the custom data attributes
    const title = currentImg.getAttribute('data-title');
    const desc = currentImg.getAttribute('data-desc');
    
    // 3. Inject them into the HTML text elements
    captionTitle.textContent = title;
    captionDesc.textContent = desc;
}
// ==========================================
// 4. Next Button Click Event (Unified)
// ==========================================
nextBtn.addEventListener('click', () => {
  // Stop if we are on the last image
  if (counter >= carouselImages.length - 1) return;
  
  counter++;             /* Advance the image counter by 1 */
  currentIndex = counter; /* Keep the caption index perfectly synced */
  
  updateCarousel();
  updateCaption(); 
});

// ==========================================
// 5. Prev Button Click Event (Unified)
// ==========================================
prevBtn.addEventListener('click', () => {
  // Stop if we are on the first image
  if (counter <= 0) return;
  
  counter--;             /* Decrease the image counter by 1 */
  currentIndex = counter; /* Keep the caption index perfectly synced */
  
  updateCarousel();
  updateCaption();
});

// ==========================================
// 6. Responsive Window Resizing & Initial Load
// ==========================================
window.addEventListener('resize', updateCarousel);

// Run these once when the page first loads to set the initial state
updateCarousel();
updateCaption();