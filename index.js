function Slider(containerId, config) {
    this.container = document.getElementById(containerId);
    this.config = Object.assign({
        autoPlayInterval: 3000,
        showIndicators: true,
        images: []
    }, config);

    if (!Array.isArray(this.config.images)) {
        this.config.images = [];
    }

    if (typeof this.config.autoPlayInterval !== 'number' || this.config.autoPlayInterval <= 0) {
        this.config.autoPlayInterval = 3000;
    }

    if (typeof this.config.showIndicators !== 'boolean') {
        this.config.showIndicators = true;
    }
    this.currentSlide = 0;
    this.isPaused = false;
    this.startX = 0;

    this.init();
}

Slider.prototype.init = function () {
    this.createStructure();
    this.createControls();
    if (this.config.showIndicators) {
        this.createIndicators();
    }
    this.startAutoSlide();
    this.addEvents();
};

Slider.prototype.createStructure = function () {
    this.slider = document.createElement('div');
    this.slider.className = 'slider';
    this.config.images.forEach(src => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        const img = document.createElement('img');
        img.src = src;
        slide.appendChild(img);
        this.slider.appendChild(slide);
    });
    this.container.appendChild(this.slider);
};

Slider.prototype.createControls = function () {
    this.controls = document.createElement('div');
    this.controls.className = 'controls';

    this.prevButton = document.createElement('button');
    this.prevButton.textContent = 'back';
    this.controls.appendChild(this.prevButton);

    this.pauseButton = document.createElement('button');
    this.pauseButton.textContent = 'pause/start';
    this.controls.appendChild(this.pauseButton);

    this.nextButton = document.createElement('button');
    this.nextButton.textContent = 'forward';
    this.controls.appendChild(this.nextButton);

    this.container.appendChild(this.controls);
};

Slider.prototype.createIndicators = function () {
    this.indicators = document.createElement('div');
    this.indicators.className = 'indicators';

    this.config.images.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        this.indicators.appendChild(indicator);
    });

    this.container.appendChild(this.indicators);
};

Slider.prototype.updateIndicators = function () {
    if (!this.indicators) return;
    Array.from(this.indicators.children).forEach((el, index) => {
        el.classList.toggle('active', index === this.currentSlide);
    });
};

Slider.prototype.showSlide = function (index) {
    if (index < 0) {
        this.currentSlide = this.config.images.length - 1;
    } else if (index >= this.config.images.length) {
        this.currentSlide = 0;
    } else {
        this.currentSlide = index;
    }
    this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    this.updateIndicators();
};

Slider.prototype.startAutoSlide = function () {
    this.interval = setInterval(() => {
        this.showSlide(this.currentSlide + 1);
    }, this.config.autoPlayInterval);
};

Slider.prototype.stopAutoSlide = function () {
    clearInterval(this.interval);
};

Slider.prototype.togglePause = function () {
    if (this.isPaused) {
        this.startAutoSlide();
        this.pauseButton.textContent = 'Pause';
    } else {
        this.stopAutoSlide();
        this.pauseButton.textContent = 'Start';
    }
    this.isPaused = !this.isPaused;
};

Slider.prototype.addEvents = function () {
    this.prevButton.addEventListener('click', () => this.showSlide(this.currentSlide - 1));
    this.nextButton.addEventListener('click', () => this.showSlide(this.currentSlide + 1));
    this.pauseButton.addEventListener('click', () => this.togglePause());

    if (this.indicators) {
        Array.from(this.indicators.children).forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showSlide(index));
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.showSlide(this.currentSlide - 1);
        if (e.key === 'ArrowRight') this.showSlide(this.currentSlide + 1);
    });

    this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.container.addEventListener('mouseleave', () => {
        if (!this.isPaused) this.startAutoSlide();
    });

    this.container.addEventListener('touchstart', (e) => {
        this.startX = e.touches[0].clientX;
    });

    this.container.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (this.startX > endX + 50) {
            this.showSlide(this.currentSlide + 1);
        } else if (this.startX < endX - 50) {
            this.showSlide(this.currentSlide - 1);
        }
    });

    this.container.addEventListener('mousedown', (e) => {
        this.startX = e.clientX;
    });

    this.container.addEventListener('mouseup', (e) => {
        const endX = e.clientX;
        if (this.startX > endX + 50) {
            this.showSlide(this.currentSlide + 1);
        } else if (this.startX < endX - 50) {
            this.showSlide(this.currentSlide - 1);
        }
    });
};

new Slider('slider1', {
    autoPlayInterval: undefined,
    showIndicators: false,
    images: undefined,
});