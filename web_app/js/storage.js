/**
 * Storage & Progress Manager (LocalStorage)
 * Tracks user mastery, SRS levels, favorites, and streak.
 */

const STORAGE_KEYS = {
  LEARNED: 'jpd326_learned_items',
  FAVORITES: 'jpd326_favorites',
  SRS_DATA: 'jpd326_srs_records',
  STATS: 'jpd326_user_stats',
  SLIDE_BOOKMARKS: 'jpd326_slide_bookmarks'
};

class StorageManager {
  constructor() {
    this.learned = this.load(STORAGE_KEYS.LEARNED, {});
    this.favorites = this.load(STORAGE_KEYS.FAVORITES, {});
    this.srs = this.load(STORAGE_KEYS.SRS_DATA, {});
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

  // Mark as Learned / SRS rating
  recordReview(id, rating) {
    // rating: 1 (again), 2 (hard), 3 (good), 4 (easy)
    const now = Date.now();
    let record = this.srs[id] || { level: 0, reviews: 0, lastReviewed: now };

    if (rating === 1) {
      record.level = Math.max(0, record.level - 1);
    } else if (rating === 4) {
      record.level += 2;
    } else {
      record.level += 1;
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

  resetAllProgress() {
    this.learned = {};
    this.favorites = {};
    this.srs = {};
    this.stats = {
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalReviews: 0,
      quizHighScores: {}
    };
    this.save(STORAGE_KEYS.LEARNED, this.learned);
    this.save(STORAGE_KEYS.FAVORITES, this.favorites);
    this.save(STORAGE_KEYS.SRS_DATA, this.srs);
    this.save(STORAGE_KEYS.STATS, this.stats);
  }
}

window.storageManager = new StorageManager();
