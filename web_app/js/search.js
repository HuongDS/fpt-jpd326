/**
 * Global Omnisearch Engine
 * Instant keyboard-driven lookup across Kanji, Vocabulary, Grammar, and Slides.
 */

class OmniSearch {
  constructor() {
    this.modal = document.getElementById('search-modal');
    this.input = document.getElementById('global-search-input');
    this.resultsList = document.getElementById('search-results-list');
    this.init();
  }

  init() {
    // Open modal buttons
    const triggerBtn = document.getElementById('btn-open-search');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.open());
    }

    // Hotkey: Ctrl + K or /
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Close on overlay click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
      const closeBtn = document.getElementById('btn-close-search');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    }

    // Input typing
    if (this.input) {
      this.input.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    if (this.input) {
      this.input.value = '';
      this.input.focus();
    }
    this.handleSearch('');
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }

  handleSearch(query) {
    const q = query.trim().toLowerCase();
    const data = window.APP_DATA;
    if (!data || !this.resultsList) return;

    if (!q) {
      this.resultsList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
          Gõ bất kỳ từ vựng, hán tự, nghĩa tiếng Việt hoặc ngữ pháp để tra cứu...
        </div>`;
      return;
    }

    const matches = [];

    // Search Kanji
    data.kanji.forEach(k => {
      if (k.kanji.includes(q) || k.han_viet.toLowerCase().includes(q) || k.onyomi.toLowerCase().includes(q) || k.kunyomi.toLowerCase().includes(q) || k.examples_raw.toLowerCase().includes(q)) {
        matches.push({
          type: 'kanji',
          badge: 'Hán tự',
          badgeClass: 'badge-sakura',
          title: `${k.kanji} (${k.han_viet})`,
          sub: `On: ${k.onyomi || '—'} | Kun: ${k.kunyomi || '—'} • ${k.lesson}`,
          raw: k
        });
      }
    });

    // Search Vocabulary
    data.vocabulary.forEach(v => {
      if (v.display.toLowerCase().includes(q) || v.kana.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q)) {
        matches.push({
          type: 'vocab',
          badge: 'Từ vựng',
          badgeClass: 'badge-amber',
          title: `${v.display} [${v.kana}]`,
          sub: `${v.meaning} • ${v.lesson} (${v.part})`,
          raw: v
        });
      }
    });

    // Search Grammar
    data.grammar.forEach(g => {
      if (g.title.toLowerCase().includes(q) || g.formula.toLowerCase().includes(q) || (g.points && g.points.toLowerCase().includes(q))) {
        matches.push({
          type: 'grammar',
          badge: 'Ngữ pháp',
          badgeClass: 'badge-emerald',
          title: g.title,
          sub: `${g.formula.replace(/\n/g, ' ')} • ${g.lesson}`,
          raw: g
        });
      }
    });

    // Search Slides
    data.slides.forEach((deck, deckIdx) => {
      deck.slides.forEach((s, slideIdx) => {
        const textMatch = s.text_content.some(t => t.toLowerCase().includes(q));
        if (textMatch || (s.title && s.title.toLowerCase().includes(q))) {
          matches.push({
            type: 'slide',
            badge: 'Slide',
            badgeClass: 'badge-purple',
            title: `${deck.lesson} - Slide ${s.slide_number}: ${s.title || 'Nội dung'}`,
            sub: s.text_content.slice(0, 2).join(' | '),
            deckIdx,
            slideIdx
          });
        }
      });
    });

    if (matches.length === 0) {
      this.resultsList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
          Không tìm thấy kết quả nào phù hợp với "<strong>${query}</strong>"
        </div>`;
      return;
    }

    this.resultsList.innerHTML = matches.slice(0, 40).map((m, idx) => `
      <div class="search-result-item" data-idx="${idx}">
        <div style="display: flex; flex-direction: column; gap: 0.2rem; overflow: hidden;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge ${m.badgeClass}">${m.badge}</span>
            <strong style="color: #FFF; font-size: 0.95rem;">${m.title}</strong>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
            ${m.sub}
          </div>
        </div>
        <span style="font-size: 0.8rem; color: var(--accent-cyan);">Xem</span>
      </div>
    `).join('');

    this.resultsList.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.idx, 10);
        const match = matches[idx];
        this.selectResult(match);
      });
    });
  }

  selectResult(match) {
    this.close();
    if (match.type === 'slide') {
      window.app.switchTab('slides');
      if (window.slideViewer) {
        window.slideViewer.jumpToSlide(match.deckIdx, match.slideIdx);
      }
    } else if (match.type === 'vocab') {
      window.app.switchTab('vocab');
      // Highlight in vocab list or switch to it
      window.soundEngine.speakJapanese(match.raw.kana || match.raw.display);
    } else if (match.type === 'kanji') {
      window.app.switchTab('kanji');
      window.app.openKanjiModal(match.raw);
    } else if (match.type === 'grammar') {
      window.app.switchTab('grammar');
    }
  }
}

window.OmniSearch = OmniSearch;
