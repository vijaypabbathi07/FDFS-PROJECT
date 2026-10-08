/**
 * Collection Service
 * Manages user personalized recipe collections and bookmarks in localStorage.
 */

import { authService } from "./auth.js";
import { recipeService } from "./recipeService.js";

const DEFAULT_COLLECTIONS = [
  {
    id: "col-favorites",
    name: "Favorites ❤️",
    description: "Your handpicked, all-time favorite recipes",
    recipeIds: ["rec-1", "rec-3"],
    isDefault: true
  },
  {
    id: "col-quick-dinners",
    name: "Quick Weeknight Dinners ⏱️",
    description: "Healthy and fast meals ready in under 30 minutes",
    recipeIds: ["rec-1", "rec-6", "rec-7"],
    isDefault: false
  },
  {
    id: "col-weekend-treats",
    name: "Weekend Brunch & Baking 🥐",
    description: "Indulgent treats and leisurely weekend culinary projects",
    recipeIds: ["rec-2", "rec-10"],
    isDefault: false
  }
];

class CollectionService {
  getStorageKey() {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : "guest_user";
    return `savoria_collections_${userId}`;
  }

  getCollections() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with defaults
      localStorage.setItem(this.getStorageKey(), JSON.stringify(DEFAULT_COLLECTIONS));
      return DEFAULT_COLLECTIONS;
    } catch {
      return DEFAULT_COLLECTIONS;
    }
  }

  saveCollections(collections) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(collections));
  }

  createCollection(name, description = "") {
    if (!name || !name.trim()) throw new Error("Collection name cannot be empty.");

    const collections = this.getCollections();
    const newCol = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      recipeIds: [],
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    collections.push(newCol);
    this.saveCollections(collections);
    return newCol;
  }

  deleteCollection(collectionId) {
    let collections = this.getCollections();
    const target = collections.find(c => c.id === collectionId);
    if (!target) return false;
    if (target.isDefault) {
      throw new Error("Cannot delete the default Favorites collection.");
    }

    collections = collections.filter(c => c.id !== collectionId);
    this.saveCollections(collections);
    return true;
  }

  isRecipeSaved(recipeId) {
    const collections = this.getCollections();
    return collections.some(col => col.recipeIds.includes(recipeId));
  }

  isRecipeInCollection(recipeId, collectionId) {
    const collections = this.getCollections();
    const col = collections.find(c => c.id === collectionId);
    return col ? col.recipeIds.includes(recipeId) : false;
  }

  toggleFavorite(recipeId) {
    const collections = this.getCollections();
    let favCol = collections.find(c => c.id === "col-favorites" || c.isDefault);
    if (!favCol) {
      favCol = {
        id: "col-favorites",
        name: "Favorites ❤️",
        description: "Your handpicked, all-time favorite recipes",
        recipeIds: [],
        isDefault: true
      };
      collections.unshift(favCol);
    }

    const idx = favCol.recipeIds.indexOf(recipeId);
    let isSaved = false;
    if (idx > -1) {
      favCol.recipeIds.splice(idx, 1);
      isSaved = false;
    } else {
      favCol.recipeIds.push(recipeId);
      isSaved = true;
    }

    this.saveCollections(collections);
    return isSaved;
  }

  toggleRecipeInCollection(recipeId, collectionId) {
    const collections = this.getCollections();
    const col = collections.find(c => c.id === collectionId);
    if (!col) throw new Error("Collection not found.");

    const idx = col.recipeIds.indexOf(recipeId);
    let added = false;
    if (idx > -1) {
      col.recipeIds.splice(idx, 1);
      added = false;
    } else {
      col.recipeIds.push(recipeId);
      added = true;
    }

    this.saveCollections(collections);
    return added;
  }

  getRecipesForCollection(collectionId) {
    const collections = this.getCollections();
    const col = collections.find(c => c.id === collectionId);
    if (!col) return [];

    const allRecipes = recipeService.getAllRecipes();
    return col.recipeIds
      .map(id => allRecipes.find(r => r.id === id))
      .filter(Boolean);
  }
}

export const collectionService = new CollectionService();
