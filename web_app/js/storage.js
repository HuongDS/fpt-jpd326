/**
 * Storage & Progress Manager (LocalStorage)
 * Tracks user mastery, SRS levels, favorites, and streak.
 */

const STORAGE_KEYS = {
  LEARNED: 'jpd326_learned_items',
  FAVORITES: 'jpd326_favorites',
  UNREMEMBERED: 'jpd326_unremembered_items',
  SRS_DATA: 'jpd326_srs_records',
  STATS: 'jpd326_user_stats',
  FC_PROGRESS: 'jpd326_fc_progress'
};

class StorageManager {
  constructor() {
    this.learned = this.load(STORAGE_KEYS.LEARNED, {});
    this.favorites = this.load(STORAGE_KEYS.FAVORITES, {});
    this.unremembered = this.load(STORAGE_KEYS.UNREMEMBERED, {});
    this.srs = this.load(STORAGE_KEYS.SRS_DATA, {});
    this.fcProgress = this.load(STORAGE_KEYS.FC_PROGRESS, { lastDeck: null, decks: {} });
    this.stats = this.load(STORAGE_KEYS.STATS, {
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalReviews: 0,
      quizHighScores: {}
    });
    this.checkStreak();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Could not read from localStorage', e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }

  checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.stats.lastActiveDate !== today) {
      const last = new Date(this.stats.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        this.stats.streakDays += 1;
      } else if (diffDays > 1) {
        this.stats.streakDays = 1;
      }
      this.stats.lastActiveDate = today;
      this.save(STORAGE_KEYS.STATS, this.stats);
    }
  }

  // Favorite toggle
  toggleFavorite(id) {
    if (this.favorites[id]) {
      delete this.favorites[id];
    } else {
      this.favorites[id] = true;
    }
    this.save(STORAGE_KEYS.FAVORITES, this.favorites);
    return !!this.favorites[id];
  }

  isFavorite(id) {
    return !!this.favorites[id];
  }

  // --------------------------------------------------------------------------
  // Unremembered Items (Danh sách từ bị đánh dấu là CHƯA NHỚ / CẦN ÔN LẠI)
  // --------------------------------------------------------------------------
  markUnremembered(id, flag = true) {
    if (flag) {
      this.unremembered[id] = true;
      delete this.learned[id];
    } else {
      delete this.unremembered[id];
    }
    this.save(STORAGE_KEYS.UNREMEMBERED, this.unremembered);
    this.save(STORAGE_KEYS.LEARNED, this.learned);
    return !!this.unremembered[id];
  }

  toggleUnremembered(id) {
    return this.markUnremembered(id, !this.unremembered[id]);
  }

  isUnremembered(id, rawId = null) {
    if (this.unremembered[id]) return true;
    if (rawId && this.unremembered[rawId]) return true;
    return false;
  }

  markBatchUnremembered(items) {
    if (!items || !Array.isArray(items)) return;
    items.forEach(item => {
      const id = typeof item === 'string' ? item : (item.id || item.rawKanjiId);
      if (id) {
        this.unremembered[id] = true;
        delete this.learned[id];
      }
    });
    this.save(STORAGE_KEYS.UNREMEMBERED, this.unremembered);
    this.save(STORAGE_KEYS.LEARNED, this.learned);
  }

  getUnrememberedCount(prefix = '') {
    if (!prefix) return Object.keys(this.unremembered).length;
    return Object.keys(this.unremembered).filter(id => id.startsWith(prefix)).length;
  }

  // Mark as Learned / SRS rating
  recordReview(id, rating) {
    // rating: 1 (again / chưa thuộc / chưa nhớ), 2 (hard / khó nhớ), 3 (good / đã nhớ), 4 (easy / quá dễ)
    const now = Date.now();
    let record = this.srs[id] || { level: 0, reviews: 0, lastReviewed: now };

    if (rating === 1) {
      record.level = Math.max(0, record.level - 1);
      // Đánh dấu ngay vào danh sách chưa nhớ
      this.unremembered[id] = true;
      delete this.learned[id];
    } else if (rating === 2) {
      record.level += 1;
      // Khó nhớ: giữ lại trong danh sách nếu đã có
    } else {
      // Rating 3 (Đã nhớ) hoặc 4 (Quá dễ): Xóa khỏi danh sách chưa nhớ!
      delete this.unremembered[id];
      if (rating === 4) {
        record.level += 2;
      } else {
        record.level += 1;
      }
    }

    record.reviews += 1;
    record.lastReviewed = now;
    this.srs[id] = record;

    if (record.level >= 2) {
      this.learned[id] = true;
    } else {
      delete this.learned[id];
    }

    this.stats.totalReviews += 1;
    this.save(STORAGE_KEYS.SRS_DATA, this.srs);
    this.save(STORAGE_KEYS.LEARNED, this.learned);
    this.save(STORAGE_KEYS.UNREMEMBERED, this.unremembered);
    this.save(STORAGE_KEYS.STATS, this.stats);
  }

  isLearned(id) {
    return !!this.learned[id];
  }

  getLearnedCount(prefix = '') {
    if (!prefix) return Object.keys(this.learned).length;
    return Object.keys(this.learned).filter(id => id.startsWith(prefix)).length;
  }

  saveQuizScore(mode, score) {
    if (!this.stats.quizHighScores) this.stats.quizHighScores = {};
    const currentHigh = this.stats.quizHighScores[mode] || 0;
    if (score > currentHigh) {
      this.stats.quizHighScores[mode] = score;
    }
    this.save(STORAGE_KEYS.STATS, this.stats);
  }

  saveFlashcardProgress(deckKey, info) {
    if (!this.fcProgress) {
      this.fcProgress = this.load(STORAGE_KEYS.FC_PROGRESS, { lastDeck: null, decks: {} });
    }
    if (!this.fcProgress.decks) this.fcProgress.decks = {};
    this.fcProgress.decks[deckKey] = info;
    this.fcProgress.lastDeck = {
      deckKey,
      category: info.category,
      lessonFilter: info.lessonFilter,
      kanjiSubType: info.kanjiSubType
    };
    this.save(STORAGE_KEYS.FC_PROGRESS, this.fcProgress);
  }

  getFlashcardProgress(deckKey) {
    if (!this.fcProgress) {
      this.fcProgress = this.load(STORAGE_KEYS.FC_PROGRESS, { lastDeck: null, decks: {} });
    }
    return (this.fcProgress.decks && this.fcProgress.decks[deckKey]) || null;
  }

  getLastActiveDeck() {
    if (!this.fcProgress) {
      this.fcProgress = this.load(STORAGE_KEYS.FC_PROGRESS, { lastDeck: null, decks: {} });
    }
    return this.fcProgress.lastDeck || null;
  }

  resetAllProgress() {
    this.learned = {};
    this.favorites = {};
    this.unremembered = {};
    this.srs = {};
    this.fcProgress = { lastDeck: null, decks: {} };
    this.stats = {
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalReviews: 0,
      quizHighScores: {}
    };
    this.save(STORAGE_KEYS.LEARNED, this.learned);
    this.save(STORAGE_KEYS.FAVORITES, this.favorites);
    this.save(STORAGE_KEYS.UNREMEMBERED, this.unremembered);
    this.save(STORAGE_KEYS.SRS_DATA, this.srs);
    this.save(STORAGE_KEYS.FC_PROGRESS, this.fcProgress);
    this.save(STORAGE_KEYS.STATS, this.stats);
  }
}

window.storageManager = new StorageManager();
