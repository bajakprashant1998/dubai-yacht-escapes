import { useState, useEffect, useCallback } from "react";

export interface RecentlyViewedItem {
  type: "tour" | "service";
  id: string;
  slug: string;
  categorySlug?: string;
  title: string;
  image: string;
  price: number;
  viewedAt: number;
}

const STORAGE_KEY = "recently-viewed";
const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedItem[];
        // Filter out items older than 30 days
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const filtered = parsed.filter((item) => item.viewedAt > thirtyDaysAgo);
        setItems(filtered);
      }
    } catch {
      // Invalid data, reset
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const addRecentlyViewed = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    setItems((prev) => {
      // Remove if already exists
      const filtered = prev.filter((i) => !(i.id === item.id && i.type === item.type));
      
      // Add to front with timestamp
      const newItem: RecentlyViewedItem = {
        ...item,
        viewedAt: Date.now(),
      };
      
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage full or unavailable
      }
      
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getRecentlyViewed = useCallback((limit?: number) => {
    return limit ? items.slice(0, limit) : items;
  }, [items]);

  return {
    items,
    addRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewed,
  };
};

// Standalone function for adding items without hook (for use in detail pages)
export const addToRecentlyViewed = (item: Omit<RecentlyViewedItem, "viewedAt">) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items: RecentlyViewedItem[] = [];
    
    if (stored) {
      items = JSON.parse(stored);
    }
    
    // Remove if already exists
    items = items.filter((i) => !(i.id === item.id && i.type === item.type));
    
    // Add to front with timestamp
    const newItem: RecentlyViewedItem = {
      ...item,
      viewedAt: Date.now(),
    };
    
    items = [newItem, ...items].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable
  }
};
