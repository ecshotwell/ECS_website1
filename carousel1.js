// 1. Select the DOM elements
const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

// 2. Initialize the index counter
let counter = 0;

// 3. Function to move the carousel
function updateCarousel() {
  // Get the precise width of one image dynamically
  const size = carouselImages[0].clientWidth; 
  
  // Shift the slide container to the left
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
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