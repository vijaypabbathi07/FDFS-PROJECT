/**
 * Recipe Service
 * Handles data fetching, filtering, searching, pantry matching, and user submissions.
 */

import { INITIAL_RECIPES } from "../data/recipes.js";

const STORAGE_KEY_CUSTOM_RECIPES = "savoria_custom_recipes";
const STORAGE_KEY_REVIEWS = "savoria_recipe_reviews_map";

class RecipeService {
  constructor() {
    this.initialRecipes = INITIAL_RECIPES;
  }

  getCustomRecipes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_RECIPES)) || [];
    } catch {
      return [];
    }
  }

  getCustomReviews() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS)) || {};
    } catch {
      return {};
    }
  }

  getAllRecipes() {
    const custom = this.getCustomRecipes();
    const reviewsMap = this.getCustomReviews();

    const combined = [...custom, ...this.initialRecipes];

    // Merge any dynamically added reviews
    return combined.map(recipe => {
      const addedReviews = reviewsMap[recipe.id] || [];
      if (addedReviews.length === 0) return recipe;

      const allReviews = [...addedReviews, ...(recipe.reviews || [])];
      const avgRating = Number(
        (allReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / allReviews.length).toFixed(1)
      );

      return {
        ...recipe,
        reviews: allReviews,
        rating: avgRating,
        ratingCount: allReviews.length
      };
    });
  }

  getRecipeById(id) {
    const recipes = this.getAllRecipes();
    return recipes.find(r => r.id === id) || null;
  }

  getCuisines() {
    const recipes = this.getAllRecipes();
    const list = Array.from(new Set(recipes.map(r => r.cuisine))).filter(Boolean);
    return ["All Cuisines", ...list.sort()];
  }

  getDietaryOptions() {
    return [
      "All Diets",
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Keto-Friendly",
      "Dairy-Free",
      "High-Protein",
      "Healthy"
    ];
  }

  getMealTypes() {
    return ["All Meals", "Breakfast", "Lunch", "Dinner", "Dessert"];
  }

  searchRecipes({
    query = "",
    cuisine = "All Cuisines",
    diet = "All Diets",
    mealType = "All Meals",
    maxTime = null,
    difficulty = "All",
    sortBy = "rating"
  }) {
    let list = this.getAllRecipes();
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(r => {
        const titleMatch = r.title.toLowerCase().includes(q);
        const descMatch = r.description.toLowerCase().includes(q);
        const tagMatch = r.tags && r.tags.some(t => t.toLowerCase().includes(q));
        const authorMatch = r.author && r.author.name.toLowerCase().includes(q);
        const ingredientMatch = r.ingredients && r.ingredients.some(i => i.name.toLowerCase().includes(q));
        return titleMatch || descMatch || tagMatch || authorMatch || ingredientMatch;
      });
    }

    if (cuisine && cuisine !== "All Cuisines") {
      list = list.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
    }

    if (diet && diet !== "All Diets") {
      list = list.filter(r => r.diet && r.diet.some(d => d.toLowerCase() === diet.toLowerCase()));
    }

    if (mealType && mealType !== "All Meals") {
      list = list.filter(r => r.mealType.toLowerCase() === mealType.toLowerCase());
    }

    if (maxTime && Number(maxTime) > 0) {
      const timeLimit = Number(maxTime);
      list = list.filter(r => (r.prepTime + r.cookTime) <= timeLimit);
    }

    if (difficulty && difficulty !== "All") {
      list = list.filter(r => r.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        list.sort((a, b) => b.ratingCount - a.ratingCount);
        break;
      case "time":
        list.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
        break;
      case "calories":
        list.sort((a, b) => a.calories - b.calories);
        break;
      case "newest":
        list.sort((a, b) => (b.createdAt || "2026-01-01").localeCompare(a.createdAt || "2026-01-01"));
        break;
      default:
        break;
    }

    return list;
  }

  /**
   * Search by Pantry Ingredients
   * Takes a list of user pantry ingredients and finds recipes with matching ingredients,
   * calculating a match percentage and identifying missing items.
   */
  searchByPantry(pantryIngredients = []) {
    if (!pantryIngredients.length) return [];

    const normalizedPantry = pantryIngredients.map(item => item.trim().toLowerCase());
    const recipes = this.getAllRecipes();

    const scored = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients || [];
      const totalCount = recipeIngredients.length;
      if (totalCount === 0) return { recipe, matchCount: 0, matchPercent: 0, missing: [] };

      const matched = [];
      const missing = [];

      recipeIngredients.forEach(ing => {
        const nameLower = ing.name.toLowerCase();
        const isMatched = normalizedPantry.some(p => nameLower.includes(p) || p.includes(nameLower));
        if (isMatched) {
          matched.push(ing);
        } else {
          missing.push(ing);
        }
      });

      const matchPercent = Math.round((matched.length / totalCount) * 100);

      return {
        recipe,
        matchCount: matched.length,
        totalCount,
        matchPercent,
        matched,
        missing
      };
    });

    // Return items that have at least 1 match, sorted by highest match percentage
    return scored
      .filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent || b.recipe.rating - a.recipe.rating);
  }

  addRecipe(recipeData, user) {
    const custom = this.getCustomRecipes();

    const newRecipe = {
      ...recipeData,
      id: `custom-rec-${Date.now()}`,
      author: {
        id: user ? user.id : "guest",
        name: user ? user.name : "Community Cook",
        avatar: user ? user.avatar : "https://api.dicebear.com/7.x/adventurer/svg?seed=Cook",
        role: user ? user.role : "Home Chef",
        verified: false
      },
      rating: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString(),
      reviews: [
        {
          id: `rev-creator-${Date.now()}`,
          userName: user ? user.name : "Creator",
          userAvatar: user ? user.avatar : "https://api.dicebear.com/7.x/adventurer/svg?seed=Cook",
          rating: 5,
          date: "Just now",
          comment: "Freshly created recipe! Enjoy cooking it."
        }
      ]
    };

    custom.unshift(newRecipe);
    localStorage.setItem(STORAGE_KEY_CUSTOM_RECIPES, JSON.stringify(custom));
    return newRecipe;
  }

  deleteRecipe(recipeId, userId) {
    let custom = this.getCustomRecipes();
    const recipe = custom.find(r => r.id === recipeId);
    if (!recipe) {
      throw new Error("Cannot delete preset curated recipes. Only your submitted recipes can be removed.");
    }

    if (recipe.author && recipe.author.id && recipe.author.id !== userId) {
      throw new Error("You can only delete recipes that you have created.");
    }

    custom = custom.filter(r => r.id !== recipeId);
    localStorage.setItem(STORAGE_KEY_CUSTOM_RECIPES, JSON.stringify(custom));
    return true;
  }

  addReview(recipeId, { rating, comment, user }) {
    if (!user) throw new Error("You must be signed in to submit a rating and review.");
    if (!rating || rating < 1 || rating > 5) throw new Error("Please select a star rating from 1 to 5.");
    if (!comment || comment.trim().length < 4) throw new Error("Please write a meaningful review comment.");

    const reviewsMap = this.getCustomReviews();
    const list = reviewsMap[recipeId] || [];

    const newReview = {
      id: `rev-${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatar,
      rating: Number(rating),
      date: "Just now",
      comment: comment.trim()
    };

    list.unshift(newReview);
    reviewsMap[recipeId] = list;
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviewsMap));

    return this.getRecipeById(recipeId);
  }
}

export const recipeService = new RecipeService();
