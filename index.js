const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.back') || document.getElementById('back');
const nextButton = document.querySelector('.forward') || document.getElementById('forward');
const pauseButton = document.querySelector('.pause') || document.getElementById('pause');
const indicatorsContainer = document.querySelector('.indicators') || document.getElementById('indicators');

let currentSlide = 0;
let slideInterval;
let isPaused = false;

function showSlide(index) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
}

function createIndicators() {
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.addEventListener('click', () => showSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    updateIndicators();
}

function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('div');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 2000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

prevButton.addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

pauseButton.addEventListener('click', () => {
    if (isPaused) {
        startAutoSlide();
        pauseButton.textContent = 'pause';
    } else {
        stopAutoSlide();
        pauseButton.textContent = 'start';
    }
    isPaused = !isPaused;
});

startAutoSlide();
createIndicators();

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    }
});

let startX;
document.querySelector('.slider-container').addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.querySelector('.slider-container').addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX > endX + 50) {
        showSlide(currentSlide + 1);
    } else if (startX < endX - 50) {
        showSlide(currentSlide - 1);
    }
});