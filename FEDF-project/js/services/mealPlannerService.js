/**
 * Meal Planner & Smart Grocery List Service
 * Organizes weekly meal schedules and computes aggregated grocery shopping lists.
 */

import { authService } from "./auth.js";
import { recipeService } from "./recipeService.js";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner"];

class MealPlannerService {
  getStorageKey() {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : "guest_user";
    return `savoria_meal_plan_${userId}`;
  }

  getGroceryStorageKey() {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : "guest_user";
    return `savoria_grocery_checked_${userId}`;
  }

  getCustomGroceryStorageKey() {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : "guest_user";
    return `savoria_grocery_custom_${userId}`;
  }

  getDays() {
    return DAYS_OF_WEEK;
  }

  getSlots() {
    return MEAL_SLOTS;
  }

  getMealPlan() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) return JSON.parse(stored);

      // Default pre-populated weekly plan for great initial impression
      const initialPlan = {
        Monday: { Breakfast: "rec-2", Lunch: "rec-5", Dinner: "rec-1" },
        Tuesday: { Breakfast: "rec-9", Lunch: "rec-6", Dinner: "rec-4" },
        Wednesday: { Breakfast: "rec-2", Lunch: "rec-5", Dinner: "rec-7" },
        Thursday: { Breakfast: null, Lunch: "rec-6", Dinner: "rec-8" },
        Friday: { Breakfast: "rec-9", Lunch: null, Dinner: "rec-3" },
        Saturday: { Breakfast: "rec-2", Lunch: "rec-12", Dinner: "rec-11" },
        Sunday: { Breakfast: "rec-9", Lunch: "rec-12", Dinner: "rec-10" }
      };

      localStorage.setItem(this.getStorageKey(), JSON.stringify(initialPlan));
      return initialPlan;
    } catch {
      return {};
    }
  }

  saveMealPlan(plan) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(plan));
  }

  assignRecipe(day, slot, recipeId) {
    const plan = this.getMealPlan();
    if (!plan[day]) plan[day] = {};
    plan[day][slot] = recipeId;
    this.saveMealPlan(plan);
    return plan;
  }

  removeRecipe(day, slot) {
    const plan = this.getMealPlan();
    if (plan[day] && plan[day][slot]) {
      plan[day][slot] = null;
      this.saveMealPlan(plan);
    }
    return plan;
  }

  clearPlan() {
    const emptyPlan = {};
    DAYS_OF_WEEK.forEach(d => {
      emptyPlan[d] = { Breakfast: null, Lunch: null, Dinner: null };
    });
    this.saveMealPlan(emptyPlan);
    return emptyPlan;
  }

  /**
   * Generates a smart consolidated grocery list grouped by department
   */
  generateGroceryList() {
    const plan = this.getMealPlan();
    const allRecipes = recipeService.getAllRecipes();
    const checkedMap = this.getCheckedGroceryItems();
    const customItems = this.getCustomGroceryItems();

    // Map of unique recipe IDs planned
    const plannedRecipeIds = [];
    Object.values(plan).forEach(daySlots => {
      if (daySlots) {
        Object.values(daySlots).forEach(rId => {
          if (rId) plannedRecipeIds.push(rId);
        });
      }
    });

    // Ingredient aggregator
    const ingredientsMap = new Map();

    plannedRecipeIds.forEach(id => {
      const recipe = allRecipes.find(r => r.id === id);
      if (!recipe || !recipe.ingredients) return;

      recipe.ingredients.forEach(ing => {
        const key = ing.name.trim().toLowerCase();
        if (ingredientsMap.has(key)) {
          const existing = ingredientsMap.get(key);
          if (existing.unit === ing.unit) {
            existing.quantity = Math.round((existing.quantity + ing.quantity) * 10) / 10;
          }
          if (!existing.recipes.includes(recipe.title)) {
            existing.recipes.push(recipe.title);
          }
        } else {
          ingredientsMap.set(key, {
            id: `item-${encodeURIComponent(key)}`,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            recipes: [recipe.title],
            category: this.categorizeIngredient(ing.name)
          });
        }
      });
    });

    const items = Array.from(ingredientsMap.values()).map(item => ({
      ...item,
      checked: !!checkedMap[item.id]
    }));

    // Add custom user items
    customItems.forEach(c => {
      items.push({
        id: c.id,
        name: c.name,
        quantity: c.quantity || 1,
        unit: c.unit || "item",
        recipes: ["Custom Addition"],
        category: c.category || "Pantry & Extras",
        checked: !!checkedMap[c.id],
        isCustom: true
      });
    });

    // Group by category
    const categorized = {
      "Fresh Produce 🥦": [],
      "Dairy, Cheese & Eggs 🧀": [],
      "Meat, Poultry & Seafood 🍗": [],
      "Grains, Pasta & Bakery 🍞": [],
      "Pantry, Sauces & Spices 🧂": [],
      "Others & Custom Items 🛒": []
    };

    items.forEach(item => {
      if (categorized[item.category]) {
        categorized[item.category].push(item);
      } else {
        categorized["Others & Custom Items 🛒"].push(item);
      }
    });

    return {
      totalItems: items.length,
      checkedCount: items.filter(i => i.checked).length,
      categorized,
      plannedMealsCount: plannedRecipeIds.length
    };
  }

  categorizeIngredient(name) {
    const n = name.toLowerCase();
    if (
      n.includes("spinach") || n.includes("tomato") || n.includes("avocado") ||
      n.includes("garlic") || n.includes("onion") || n.includes("lime") ||
      n.includes("lemon") || n.includes("scallion") || n.includes("cucumber") ||
      n.includes("herb") || n.includes("parsley") || n.includes("cilantro") ||
      n.includes("asparagus") || n.includes("eggplant") || n.includes("cabbage") ||
      n.includes("ginger") || n.includes("basil") || n.includes("berry") ||
      n.includes("strawberry") || n.includes("thyme") || n.includes("mushroom")
    ) {
      return "Fresh Produce 🥦";
    }

    if (
      n.includes("cream") || n.includes("milk") || n.includes("cheese") ||
      n.includes("parmesan") || n.includes("butter") || n.includes("egg") ||
      n.includes("sour cream") || n.includes("feta") || n.includes("paneer")
    ) {
      return "Dairy, Cheese & Eggs 🧀";
    }

    if (
      n.includes("chicken") || n.includes("pork") || n.includes("salmon") ||
      n.includes("fish") || n.includes("shrimp") || n.includes("beef") ||
      n.includes("bacon") || n.includes("chashu")
    ) {
      return "Meat, Poultry & Seafood 🍗";
    }

    if (
      n.includes("sourdough") || n.includes("noodle") || n.includes("ramen") ||
      n.includes("quinoa") || n.includes("rice") || n.includes("pasta") ||
      n.includes("tagliatelle") || n.includes("tortilla") || n.includes("pita") ||
      n.includes("bread") || n.includes("graham") || n.includes("granola")
    ) {
      return "Grains, Pasta & Bakery 🍞";
    }

    return "Pantry, Sauces & Spices 🧂";
  }

  getCheckedGroceryItems() {
    try {
      return JSON.parse(localStorage.getItem(this.getGroceryStorageKey())) || {};
    } catch {
      return {};
    }
  }

  toggleGroceryItem(itemId) {
    const checked = this.getCheckedGroceryItems();
    checked[itemId] = !checked[itemId];
    localStorage.setItem(this.getGroceryStorageKey(), JSON.stringify(checked));
    return checked[itemId];
  }

  getCustomGroceryItems() {
    try {
      return JSON.parse(localStorage.getItem(this.getCustomGroceryStorageKey())) || [];
    } catch {
      return [];
    }
  }

  addCustomGroceryItem(name, quantity = 1, unit = "item") {
    if (!name || !name.trim()) return null;
    const items = this.getCustomGroceryItems();
    const newItem = {
      id: `custom-gro-${Date.now()}`,
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit: unit.trim() || "item",
      category: "Others & Custom Items 🛒"
    };
    items.push(newItem);
    localStorage.setItem(this.getCustomGroceryStorageKey(), JSON.stringify(items));
    return newItem;
  }

  removeCustomGroceryItem(id) {
    let items = this.getCustomGroceryItems();
    items = items.filter(i => i.id !== id);
    localStorage.setItem(this.getCustomGroceryStorageKey(), JSON.stringify(items));
  }

  clearCheckedGrocery() {
    localStorage.removeItem(this.getGroceryStorageKey());
  }
}

export const mealPlannerService = new MealPlannerService();
