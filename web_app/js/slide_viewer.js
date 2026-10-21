/**
 * Slide Presentation & Study Engine
 * Renders slides from PPTX files with text paragraphs, full extracted media images, and thumbnail navigation.
 */

class SlideViewer {
  constructor() {
    this.slidesData = window.APP_DATA ? window.APP_DATA.slides : [];
    this.currentDeckIndex = 0; // 0: Lesson 6, 1: Lesson 7, 2: Lesson 8, 3: Lesson 9
    this.currentSlideIndex = 0; // 0 to N-1
    this.filterSearchQuery = '';

    this.deckTabsEl = document.getElementById('slide-deck-tabs');
    this.thumbsStripEl = document.getElementById('slide-thumbs-strip');
    this.displayFrameEl = document.getElementById('slide-display-frame');
    this.slideNumberTag = document.getElementById('slide-number-tag');
    this.slideDeckTitle = document.getElementById('slide-deck-title');

    this.prevBtn = document.getElementById('slide-prev-btn');
    this.nextBtn = document.getElementById('slide-next-btn');

    this.init();
  }

  init() {
    if (!this.slidesData || this.slidesData.length === 0) return;

    this.renderDeckTabs();
    this.renderCurrentSlide();

    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

    // Keyboard navigation when slide tab is active
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      const slidePanel = document.getElementById('tab-slides');
      if (!slidePanel || !slidePanel.classList.contains('active')) return;

      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextSlide();
      }
    });

    // Slide search input
    const slideSearchInput = document.getElementById('slide-search-input');
    if (slideSearchInput) {
      slideSearchInput.addEventListener('input', (e) => {
        this.filterSearchQuery = e.target.value.toLowerCase().trim();
        this.handleSlideSearch();
      });
    }
  }

  renderDeckTabs() {
    if (!this.deckTabsEl) return;
    this.deckTabsEl.innerHTML = this.slidesData.map((deck, idx) => `
      <button class="filter-chip ${idx === this.currentDeckIndex ? 'active' : ''}" data-deck-idx="${idx}">
        ${deck.lesson} (${deck.topic}) • ${deck.total_slides} slides
      </button>
    `).join('');

    this.deckTabsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentDeckIndex = parseInt(btn.dataset.deckIdx, 10);
        this.currentSlideIndex = 0;
        this.deckTabsEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderThumbnails();
        this.renderCurrentSlide();
      });
    });

    this.renderThumbnails();
  }

  renderThumbnails() {
    if (!this.thumbsStripEl) return;
    const deck = this.slidesData[this.currentDeckIndex];
    if (!deck) return;

    this.thumbsStripEl.innerHTML = deck.slides.map((s, idx) => `
      <div class="slide-thumb-item ${idx === this.currentSlideIndex ? 'active' : ''}" data-idx="${idx}">
        Slide ${s.slide_number}
      </div>
    `).join('');

    this.thumbsStripEl.querySelectorAll('.slide-thumb-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentSlideIndex = parseInt(item.dataset.idx, 10);
        this.renderCurrentSlide();
      });
    });
  }

  renderCurrentSlide() {
    const deck = this.slidesData[this.currentDeckIndex];
    if (!deck || deck.slides.length === 0) return;

    const slide = deck.slides[this.currentSlideIndex];
    if (!slide) return;

    if (this.slideNumberTag) {
      this.slideNumberTag.textContent = `Slide ${slide.slide_number} / ${deck.total_slides}`;
    }
    if (this.slideDeckTitle) {
      this.slideDeckTitle.textContent = `${deck.lesson} : ${deck.topic}`;
    }

    // Update active thumbnail
    if (this.thumbsStripEl) {
      this.thumbsStripEl.querySelectorAll('.slide-thumb-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === this.currentSlideIndex);
      });
      // Scroll active thumb into view
      const activeThumb = this.thumbsStripEl.querySelector('.slide-thumb-item.active');
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // Build Slide Content Layout
    const hasImages = slide.images && slide.images.length > 0;
    const paragraphsHtml = slide.text_content.map(p => `
      <div class="slide-para-item">
        ${p}
      </div>
    `).join('');

    const imagesHtml = hasImages ? `
      <div class="slide-media-col">
        ${slide.images.map(img => `
          <img src="${img}" alt="Slide Image" class="slide-img-preview" loading="lazy" />
        `).join('')}
      </div>
    ` : '';

    this.displayFrameEl.innerHTML = `
      <div class="slide-header-meta">
        <div>
          <span class="badge badge-purple">${deck.lesson}</span>
          <span style="font-weight: 700; color: #FFF; margin-left: 0.5rem;">${slide.title || 'Nội dung'}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="icon-btn" id="btn-speak-slide" title="Đọc nội dung tiếng Nhật">Đọc slide</button>
          <span class="slide-number-tag">Trang ${slide.slide_number} / ${deck.total_slides}</span>
        </div>
      </div>

      <div class="slide-body-content ${hasImages ? '' : 'full-text'}">
        <div class="slide-text-col">
          ${paragraphsHtml || '<p style="color: var(--text-muted); font-style: italic;">Slide hình ảnh minh họa bài học.</p>'}
        </div>
        ${imagesHtml}
      </div>
    `;

    // Hook audio speaker for slide text
    const speakBtn = document.getElementById('btn-speak-slide');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        const fullText = slide.text_content.join(' ');
        window.soundEngine.speakJapanese(fullText);
      });
    }
  }

  nextSlide() {
    const deck = this.slidesData[this.currentDeckIndex];
    if (!deck) return;
    if (this.currentSlideIndex < deck.slides.length - 1) {
      this.currentSlideIndex++;
      this.renderCurrentSlide();
      window.soundEngine.playFlip();
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.renderCurrentSlide();
      window.soundEngine.playFlip();
    }
  }

  jumpToSlide(deckIdx, slideIdx) {
    this.currentDeckIndex = deckIdx;
    this.currentSlideIndex = slideIdx;
    this.renderDeckTabs();
    this.renderCurrentSlide();
  }

  handleSlideSearch() {
    if (!this.filterSearchQuery) {
      this.renderThumbnails();
      return;
    }
    const deck = this.slidesData[this.currentDeckIndex];
    if (!deck) return;

    // Filter thumbnails that match search
    this.thumbsStripEl.querySelectorAll('.slide-thumb-item').forEach((item, idx) => {
      const s = deck.slides[idx];
      const match = s.text_content.some(t => t.toLowerCase().includes(this.filterSearchQuery))
                 || (s.title && s.title.toLowerCase().includes(this.filterSearchQuery));
      item.style.display = match ? 'flex' : 'none';
    });
  }
}

window.SlideViewer = SlideViewer;
