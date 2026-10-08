/**
 * Savoria Recipe Platform - Main Application Controller
 * Handles client-side routing, UI rendering, modals, timers, and user interactions.
 */

import { authService } from "./services/auth.js";
import { recipeService } from "./services/recipeService.js";
import { collectionService } from "./services/collectionService.js";
import { mealPlannerService } from "./services/mealPlannerService.js";

class App {
  constructor() {
    this.currentView = "home";
    this.selectedRecipe = null;
    this.scaledServings = 4;
    this.activeTimer = null;
    this.activeTimerSeconds = 0;
    this.pantryList = ["Chicken", "Garlic", "Spinach", "Tomatoes", "Olive Oil"];
    this.selectedCollectionId = "col-favorites";

    // Search and filter state
    this.filterState = {
      query: "",
      cuisine: "All Cuisines",
      diet: "All Diets",
      mealType: "All Meals",
      maxTime: null,
      difficulty: "All",
      sortBy: "rating"
    };

    // Submitting recipe state
    this.tempIngredients = [
      { name: "Olive oil", quantity: 2, unit: "tbsp", notes: "extra virgin" },
      { name: "Garlic cloves", quantity: 3, unit: "cloves", notes: "minced" }
    ];
    this.tempInstructions = [
      { step: 1, title: "Prepare ingredients", description: "Wash and chop all vegetables and measure spices.", timerMinutes: 5 },
      { step: 2, title: "Sauté aromatics", description: "Heat oil in skillet and cook garlic until fragrant.", timerMinutes: 2 }
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupAuthWatcher();
    this.setupRouting();
    this.renderView(this.currentView);
  }

  setupAuthWatcher() {
    authService.onAuthStateChanged(user => {
      this.updateNavbarAuth(user);
      if (this.currentView === "profile") {
        this.renderProfileView();
      }
      if (this.currentView === "collections") {
        this.renderCollectionsView();
      }
    });
  }

  setupRouting() {
    window.addEventListener("hashchange", () => {
      this.handleHashRoute();
    });
    this.handleHashRoute();
  }

  handleHashRoute() {
    const hash = window.location.hash.slice(1);
    if (!hash || hash === "") {
      this.navigateTo("home", false);
      return;
    }

    if (hash.startsWith("recipe/")) {
      const recipeId = hash.split("/")[1];
      this.openRecipeDetailModal(recipeId);
      return;
    }

    const validViews = ["home", "pantry", "collections", "meal-planner", "submit-recipe", "profile"];
    if (validViews.includes(hash)) {
      this.navigateTo(hash, false);
    }
  }

  navigateTo(viewName, updateHash = true) {
    this.currentView = viewName;
    if (updateHash) {
      window.location.hash = viewName;
    }
    this.updateActiveNavLinks(viewName);
    this.renderView(viewName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateActiveNavLinks(viewName) {
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  bindEvents() {
    // Nav view switching
    document.querySelectorAll("[data-nav-target]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const target = btn.dataset.navTarget;
        this.navigateTo(target);
        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu) mobileMenu.classList.add("hidden");
      });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu) mobileMenu.classList.toggle("hidden");
      });
    }

    // Modal background click closing
    document.addEventListener("click", e => {
      if (e.target.classList.contains("modal-backdrop-click")) {
        this.closeModals();
      }
    });

    // Keyboard shortcuts (Escape closes modals)
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.closeModals();
        this.exitCookingMode();
      }
    });
  }

  updateNavbarAuth(user) {
    const authContainer = document.getElementById("nav-auth-section");
    const mobileAuthContainer = document.getElementById("mobile-auth-section");

    const content = user
      ? `
        <div class="relative group">
          <button id="user-profile-menu-btn" class="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200">
            <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover border border-orange-500">
            <span class="text-sm font-semibold text-slate-700 hidden md:inline-block">${user.name}</span>
            <i class="fa-solid fa-chevron-down text-xs text-slate-400"></i>
          </button>
          <div class="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 hidden group-hover:block hover:block z-50">
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="text-xs text-slate-400">Signed in as</p>
              <p class="text-sm font-bold text-slate-800 truncate">${user.name}</p>
            </div>
            <a href="#profile" class="block px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition">
              <i class="fa-solid fa-user mr-2 text-orange-500"></i>My Profile
            </a>
            <a href="#collections" class="block px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition">
              <i class="fa-solid fa-bookmark mr-2 text-orange-500"></i>Saved Recipes
            </a>
            <a href="#meal-planner" class="block px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition">
              <i class="fa-solid fa-calendar-days mr-2 text-orange-500"></i>Meal Planner
            </a>
            <hr class="my-1 border-slate-100">
            <button id="nav-logout-btn" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
              <i class="fa-solid fa-arrow-right-from-bracket mr-2"></i>Sign Out
            </button>
          </div>
        </div>
      `
      : `
        <div class="flex items-center gap-2">
          <button id="nav-signin-btn" class="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-orange-600 transition">
            Sign In
          </button>
          <button id="nav-signup-btn" class="px-4 py-1.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition">
            Register
          </button>
        </div>
      `;

    if (authContainer) authContainer.innerHTML = content;
    if (mobileAuthContainer) mobileAuthContainer.innerHTML = content;

    // Attach listeners
    const logoutBtn = document.getElementById("nav-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        authService.logout();
        this.showToast("Signed out successfully", "info");
      });
    }

    const signinBtn = document.getElementById("nav-signin-btn");
    if (signinBtn) {
      signinBtn.addEventListener("click", () => this.openAuthModal("signin"));
    }

    const signupBtn = document.getElementById("nav-signup-btn");
    if (signupBtn) {
      signupBtn.addEventListener("click", () => this.openAuthModal("signup"));
    }
  }

  renderView(viewName) {
    const main = document.getElementById("main-content");
    if (!main) return;

    switch (viewName) {
      case "home":
        this.renderHomeView();
        break;
      case "pantry":
        this.renderPantryView();
        break;
      case "collections":
        this.renderCollectionsView();
        break;
      case "meal-planner":
        this.renderMealPlannerView();
        break;
      case "submit-recipe":
        this.renderSubmitRecipeView();
        break;
      case "profile":
        this.renderProfileView();
        break;
      default:
        this.renderHomeView();
    }
  }

  // ==========================================
  // VIEW: HOME & EXPLORE
  // ==========================================
  renderHomeView() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const cuisines = recipeService.getCuisines();
    const diets = recipeService.getDietaryOptions();
    const mealTypes = recipeService.getMealTypes();
    const recipes = recipeService.searchRecipes(this.filterState);
    const featuredRecipe = recipeService.getAllRecipes()[0];

    main.innerHTML = `
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 py-16 px-4 sm:px-6 lg:px-8 border-b border-orange-100">
        <div class="max-w-6xl mx-auto text-center space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs sm:text-sm font-semibold tracking-wide">
            <i class="fa-solid fa-utensils"></i> Discover 1,000+ Community Tested Recipes
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Cook, Share & Savor <br/>
            <span class="text-orange-600 italic">Every Delicious Moment</span>
          </h1>

          <p class="max-w-2xl mx-auto text-base sm:text-lg text-slate-600">
            Search mouthwatering recipes by ingredients in your fridge, dietary preferences, or international cuisines with interactive serving scalers and step-by-step cooking timers.
          </p>

          <!-- Main Search Box -->
          <div class="max-w-2xl mx-auto relative pt-2">
            <div class="relative flex items-center shadow-lg rounded-2xl bg-white overflow-hidden border border-orange-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition">
              <i class="fa-solid fa-magnifying-glass text-slate-400 text-lg ml-4"></i>
              <input
                id="hero-search-input"
                type="text"
                placeholder="Search recipe by name, ingredient (e.g. garlic, chicken), or chef..."
                value="${this.filterState.query}"
                class="w-full py-4 pl-3 pr-28 text-slate-800 placeholder-slate-400 focus:outline-none text-sm sm:text-base"
              />
              <button id="hero-surprise-btn" title="Pick a random recipe" class="absolute right-2 px-3 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition">
                <i class="fa-solid fa-dice"></i> Surprise Me
              </button>
            </div>

            <!-- Quick Suggestions -->
            <div class="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs text-slate-600">
              <span class="font-medium text-slate-400">Popular:</span>
              <button class="quick-tag-btn hover:text-orange-600 underline">Pasta</button>
              <button class="quick-tag-btn hover:text-orange-600 underline">Ramen</button>
              <button class="quick-tag-btn hover:text-orange-600 underline">Gluten-Free</button>
              <button class="quick-tag-btn hover:text-orange-600 underline">Tacos</button>
              <button class="quick-tag-btn hover:text-orange-600 underline">Keto Salmon</button>
              <button class="quick-tag-btn hover:text-orange-600 underline">Avocado Toast</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Recipe of the Day Spotlight -->
      ${featuredRecipe ? `
        <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div class="bg-white rounded-3xl shadow-md border border-slate-200/80 p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6">
            <div class="relative w-full md:w-1/2 h-64 sm:h-72 rounded-2xl overflow-hidden group cursor-pointer" onclick="window.app.openRecipeDetailModal('${featuredRecipe.id}')">
              <img src="${featuredRecipe.image}" alt="${featuredRecipe.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                ★ Recipe Spotlight
              </div>
            </div>
            <div class="w-full md:w-1/2 space-y-3">
              <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span class="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800 font-semibold">${featuredRecipe.cuisine}</span>
                <span>•</span>
                <span><i class="fa-regular fa-clock mr-1"></i>${featuredRecipe.prepTime + featuredRecipe.cookTime} mins</span>
                <span>•</span>
                <span class="text-amber-500 font-semibold"><i class="fa-solid fa-star mr-1"></i>${featuredRecipe.rating} (${featuredRecipe.ratingCount})</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold font-serif text-slate-900 hover:text-orange-600 cursor-pointer transition" onclick="window.app.openRecipeDetailModal('${featuredRecipe.id}')">
                ${featuredRecipe.title}
              </h2>
              <p class="text-sm text-slate-600 line-clamp-2">${featuredRecipe.description}</p>
              <div class="pt-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img src="${featuredRecipe.author.avatar}" alt="${featuredRecipe.author.name}" class="w-8 h-8 rounded-full object-cover border">
                  <div>
                    <p class="text-xs font-bold text-slate-800">${featuredRecipe.author.name}</p>
                    <p class="text-[11px] text-slate-400">${featuredRecipe.author.role}</p>
                  </div>
                </div>
                <button onclick="window.app.openRecipeDetailModal('${featuredRecipe.id}')" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl shadow-sm transition flex items-center gap-2">
                  Start Cooking <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      ` : ""}

      <!-- Filters & Recipe Catalog Section -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <!-- Filter Controls Bar -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2 w-full md:w-auto">
              <span class="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <i class="fa-solid fa-sliders text-orange-500"></i> Filters:
              </span>
              <span id="recipe-results-count" class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                ${recipes.length} recipes found
              </span>
            </div>

            <!-- Sort By -->
            <div class="flex items-center gap-2 w-full md:w-auto justify-end">
              <label for="filter-sort" class="text-xs text-slate-500 font-medium">Sort By:</label>
              <select id="filter-sort" class="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500">
                <option value="rating" ${this.filterState.sortBy === "rating" ? "selected" : ""}>Highest Rated ★</option>
                <option value="reviews" ${this.filterState.sortBy === "reviews" ? "selected" : ""}>Most Reviews</option>
                <option value="time" ${this.filterState.sortBy === "time" ? "selected" : ""}>Fastest Total Time ⏱</option>
                <option value="calories" ${this.filterState.sortBy === "calories" ? "selected" : ""}>Lowest Calories</option>
                <option value="newest" ${this.filterState.sortBy === "newest" ? "selected" : ""}>Newest Additions</option>
              </select>

              <button id="reset-filters-btn" class="text-xs font-semibold text-slate-400 hover:text-orange-600 ml-2 transition">
                Reset
              </button>
            </div>
          </div>

          <!-- Dropdown Selectors Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label class="block text-slate-500 mb-1 font-semibold">Cuisine</label>
              <select id="filter-cuisine" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 focus:ring-orange-500">
                ${cuisines.map(c => `<option value="${c}" ${this.filterState.cuisine === c ? "selected" : ""}>${c}</option>`).join("")}
              </select>
            </div>

            <div>
              <label class="block text-slate-500 mb-1 font-semibold">Dietary Preference</label>
              <select id="filter-diet" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 focus:ring-orange-500">
                ${diets.map(d => `<option value="${d}" ${this.filterState.diet === d ? "selected" : ""}>${d}</option>`).join("")}
              </select>
            </div>

            <div>
              <label class="block text-slate-500 mb-1 font-semibold">Meal Type</label>
              <select id="filter-meal" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 focus:ring-orange-500">
                ${mealTypes.map(m => `<option value="${m}" ${this.filterState.mealType === m ? "selected" : ""}>${m}</option>`).join("")}
              </select>
            </div>

            <div>
              <label class="block text-slate-500 mb-1 font-semibold">Max Cook Time</label>
              <select id="filter-time" class="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 focus:ring-orange-500">
                <option value="" ${!this.filterState.maxTime ? "selected" : ""}>Any Duration</option>
                <option value="20" ${this.filterState.maxTime === "20" ? "selected" : ""}>Under 20 mins (Lightning Fast)</option>
                <option value="35" ${this.filterState.maxTime === "35" ? "selected" : ""}>Under 35 mins (Weeknight Friendly)</option>
                <option value="60" ${this.filterState.maxTime === "60" ? "selected" : ""}>Under 60 mins</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Recipe Cards Grid -->
        <div id="recipe-results-grid">
          ${recipes.length === 0 ? `
            <div class="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
              <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <h3 class="text-xl font-bold text-slate-800">No matching recipes found</h3>
              <p class="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any recipes matching your current filter combination. Try clearing your search term or adjusting filters.
              </p>
              <button id="empty-reset-btn" class="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition">
                Reset All Filters
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${recipes.map(recipe => this.renderRecipeCard(recipe)).join("")}
            </div>
          `}
        </div>
      </section>
    `;

    this.bindHomeEvents();
  }

  renderRecipeCard(recipe) {
    const isSaved = collectionService.isRecipeSaved(recipe.id);
    const totalTime = recipe.prepTime + recipe.cookTime;

    return `
      <div class="recipe-card bg-white rounded-2xl overflow-hidden border border-slate-200/90 flex flex-col group">
        <!-- Thumbnail & Badges -->
        <div class="relative h-48 w-full overflow-hidden cursor-pointer" onclick="window.app.openRecipeDetailModal('${recipe.id}')">
          <img
            src="${recipe.image}"
            alt="${recipe.title}"
            class="card-image-zoom w-full h-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

          <!-- Cuisine Badge -->
          <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
            ${recipe.cuisine}
          </div>

          <!-- Favorite Button -->
          <button
            onclick="event.stopPropagation(); window.app.toggleFavoriteRecipe('${recipe.id}')"
            title="${isSaved ? 'Remove from favorites' : 'Save to favorites'}"
            class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm ${isSaved ? 'text-red-500' : 'text-slate-400 hover:text-red-500'} shadow transition transform active:scale-90"
          >
            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>

          <!-- Quick Stats Overlay -->
          <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span class="flex items-center gap-1">
              <i class="fa-regular fa-clock"></i> ${totalTime}m
            </span>
            <span class="flex items-center gap-1 font-semibold text-amber-300">
              <i class="fa-solid fa-star"></i> ${recipe.rating} (${recipe.ratingCount})
            </span>
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-fire text-orange-400"></i> ${recipe.calories} kcal
            </span>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3 cursor-pointer" onclick="window.app.openRecipeDetailModal('${recipe.id}')">
          <div>
            <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
              ${(recipe.diet || []).slice(0, 2).map(d => `
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  ${d}
                </span>
              `).join("")}
              <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                ${recipe.difficulty}
              </span>
            </div>

            <h3 class="font-bold text-slate-800 text-base leading-snug group-hover:text-orange-600 transition line-clamp-1">
              ${recipe.title}
            </h3>

            <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              ${recipe.description}
            </p>
          </div>

          <!-- Footer / Author & Action -->
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="${recipe.author.avatar}" alt="${recipe.author.name}" class="w-6 h-6 rounded-full object-cover">
              <span class="text-[11px] font-medium text-slate-600 truncate max-w-[120px]">${recipe.author.name}</span>
            </div>

            <span class="text-xs font-semibold text-orange-600 group-hover:translate-x-0.5 transition flex items-center gap-1">
              View <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  bindHomeEvents() {
    const searchInput = document.getElementById("hero-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        this.filterState.query = e.target.value;
        this.updateHomeGrid();
      });
    }

    const surpriseBtn = document.getElementById("hero-surprise-btn");
    if (surpriseBtn) {
      surpriseBtn.addEventListener("click", () => {
        const all = recipeService.getAllRecipes();
        const rand = all[Math.floor(Math.random() * all.length)];
        if (rand) this.openRecipeDetailModal(rand.id);
      });
    }

    document.querySelectorAll(".quick-tag-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tag = btn.innerText.trim();
        this.filterState.query = tag;
        if (searchInput) searchInput.value = tag;
        this.updateHomeGrid();
      });
    });

    const cuisineSelect = document.getElementById("filter-cuisine");
    if (cuisineSelect) {
      cuisineSelect.addEventListener("change", e => {
        this.filterState.cuisine = e.target.value;
        this.updateHomeGrid();
      });
    }

    const dietSelect = document.getElementById("filter-diet");
    if (dietSelect) {
      dietSelect.addEventListener("change", e => {
        this.filterState.diet = e.target.value;
        this.updateHomeGrid();
      });
    }

    const mealSelect = document.getElementById("filter-meal");
    if (mealSelect) {
      mealSelect.addEventListener("change", e => {
        this.filterState.mealType = e.target.value;
        this.updateHomeGrid();
      });
    }

    const timeSelect = document.getElementById("filter-time");
    if (timeSelect) {
      timeSelect.addEventListener("change", e => {
        this.filterState.maxTime = e.target.value || null;
        this.updateHomeGrid();
      });
    }

    const sortSelect = document.getElementById("filter-sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", e => {
        this.filterState.sortBy = e.target.value;
        this.updateHomeGrid();
      });
    }

    const resetBtn = document.getElementById("reset-filters-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetFilters());
    }

    const emptyResetBtn = document.getElementById("empty-reset-btn");
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener("click", () => this.resetFilters());
    }
  }

  resetFilters() {
    this.filterState = {
      query: "",
      cuisine: "All Cuisines",
      diet: "All Diets",
      mealType: "All Meals",
      maxTime: null,
      difficulty: "All",
      sortBy: "rating"
    };
    this.renderHomeView();
    this.showToast("All filters have been reset", "info");
  }

  updateHomeGrid() {
    const input = document.getElementById("hero-search-input");
    const selectionStart = input ? input.selectionStart : null;
    const selectionEnd = input ? input.selectionEnd : null;

    const recipes = recipeService.searchRecipes(this.filterState);
    const countEl = document.getElementById("recipe-results-count");
    if (countEl) {
      countEl.textContent = `${recipes.length} recipes found`;
    }

    const gridEl = document.getElementById("recipe-results-grid");
    if (gridEl) {
      gridEl.innerHTML = recipes.length === 0 ? `
        <div class="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-800">No matching recipes found</h3>
          <p class="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any recipes matching your current filter combination. Try clearing your search term or adjusting filters.
          </p>
          <button id="empty-reset-btn" class="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition">
            Reset All Filters
          </button>
        </div>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${recipes.map(recipe => this.renderRecipeCard(recipe)).join("")}
        </div>
      `;

      const emptyResetBtn = document.getElementById("empty-reset-btn");
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener("click", () => this.resetFilters());
      }
    }

    if (input) {
      input.focus();
      if (selectionStart !== null && selectionEnd !== null) {
        input.setSelectionRange(selectionStart, selectionEnd);
      } else {
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }

  // ==========================================
  // VIEW: PANTRY / WHAT'S IN YOUR FRIDGE SEARCH
  // ==========================================
  renderPantryView() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const matchedResults = recipeService.searchByPantry(this.pantryList);

    const stapleSuggestions = [
      "Chicken", "Eggs", "Garlic", "Onions", "Tomatoes", "Pasta",
      "Rice", "Spinach", "Heavy Cream", "Parmesan", "Avocado", "Salmon"
    ];

    main.innerHTML = `
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <!-- Header Banner -->
        <div class="text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <i class="fa-solid fa-basket-shopping"></i> Smart Pantry Engine
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900">
            What Can I Cook Right Now?
          </h1>
          <p class="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Tell us what ingredients are sitting in your fridge or pantry. We'll find recipes you can make immediately and highlight what few items you might be missing!
          </p>
        </div>

        <!-- Pantry Input Box & Tag List -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4 max-w-3xl mx-auto">
          <form id="pantry-add-form" class="flex gap-2">
            <input
              id="pantry-input"
              type="text"
              placeholder="Type an ingredient (e.g. Mushrooms, Butter, Rice) and press Add..."
              class="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button type="submit" class="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-1.5">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </form>

          <!-- Current Ingredients In Pantry -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-500">
              <span class="font-bold text-slate-700">Your Current Ingredients (${this.pantryList.length}):</span>
              ${this.pantryList.length > 0 ? `
                <button id="clear-pantry-btn" class="text-red-500 hover:underline">Clear All</button>
              ` : ""}
            </div>

            <div class="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-50 rounded-xl border border-slate-200/60">
              ${this.pantryList.length === 0 ? `
                <span class="text-xs text-slate-400 italic">No ingredients added yet. Click staples below or type above!</span>
              ` : this.pantryList.map(item => `
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <i class="fa-solid fa-check text-[10px]"></i> ${item}
                  <button type="button" onclick="window.app.removePantryItem('${item}')" class="text-emerald-700 hover:text-red-600 ml-1 transition">
                    <i class="fa-solid fa-xmark text-xs"></i>
                  </button>
                </span>
              `).join("")}
            </div>
          </div>

          <!-- Quick Staples Picker -->
          <div class="space-y-2 pt-2 border-t border-slate-100">
            <span class="text-xs font-bold text-slate-500">Quick-Add Popular Kitchen Staples:</span>
            <div class="flex flex-wrap gap-1.5">
              ${stapleSuggestions.map(staple => {
                const inList = this.pantryList.some(p => p.toLowerCase() === staple.toLowerCase());
                return `
                  <button
                    type="button"
                    onclick="window.app.toggleStaple('${staple}')"
                    class="px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      inList
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }"
                  >
                    ${inList ? '✓ ' : '+ '}${staple}
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- Matched Recipes Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-800">
              Matching Recipes (${matchedResults.length})
            </h2>
            <span class="text-xs text-slate-500">Sorted by highest ingredient match %</span>
          </div>

          ${matchedResults.length === 0 ? `
            <div class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl">
                <i class="fa-solid fa-kitchen-set"></i>
              </div>
              <h3 class="text-base font-bold text-slate-700">No matching recipes yet</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">
                Add more ingredients you have at home to see recipes unlock automatically.
              </p>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${matchedResults.map(item => this.renderPantryRecipeCard(item)).join("")}
            </div>
          `}
        </div>
      </section>
    `;

    const form = document.getElementById("pantry-add-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("pantry-input");
        const val = input ? input.value.trim() : "";
        if (val) {
          if (!this.pantryList.some(p => p.toLowerCase() === val.toLowerCase())) {
            this.pantryList.push(val);
            this.renderPantryView();
          } else {
            this.showToast(`${val} is already in your pantry list`, "info");
          }
        }
      });
    }

    const clearBtn = document.getElementById("clear-pantry-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.pantryList = [];
        this.renderPantryView();
      });
    }
  }

  toggleStaple(staple) {
    const idx = this.pantryList.findIndex(p => p.toLowerCase() === staple.toLowerCase());
    if (idx > -1) {
      this.pantryList.splice(idx, 1);
    } else {
      this.pantryList.push(staple);
    }
    this.renderPantryView();
  }

  removePantryItem(item) {
    this.pantryList = this.pantryList.filter(p => p.toLowerCase() !== item.toLowerCase());
    this.renderPantryView();
  }

  renderPantryRecipeCard({ recipe, matchCount, totalCount, matchPercent, matched, missing }) {
    const isSaved = collectionService.isRecipeSaved(recipe.id);

    return `
      <div class="recipe-card bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between">
        <div class="relative h-44 cursor-pointer" onclick="window.app.openRecipeDetailModal('${recipe.id}')">
          <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

          <!-- Match Percentage Badge -->
          <div class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow ${
            matchPercent >= 75 ? 'bg-emerald-600' : matchPercent >= 45 ? 'bg-amber-600' : 'bg-slate-700'
          }">
            <i class="fa-solid fa-bolt mr-1"></i> ${matchPercent}% Pantry Match
          </div>

          <button
            onclick="event.stopPropagation(); window.app.toggleFavoriteRecipe('${recipe.id}')"
            class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm ${isSaved ? 'text-red-500' : 'text-slate-400 hover:text-red-500'} shadow transition"
          >
            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>

          <div class="absolute bottom-2.5 left-3 right-3 text-white text-xs flex justify-between">
            <span><i class="fa-regular fa-clock"></i> ${recipe.prepTime + recipe.cookTime} mins</span>
            <span class="text-amber-300 font-semibold"><i class="fa-solid fa-star"></i> ${recipe.rating}</span>
          </div>
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 class="font-bold text-slate-800 text-base hover:text-orange-600 cursor-pointer transition" onclick="window.app.openRecipeDetailModal('${recipe.id}')">
              ${recipe.title}
            </h3>

            <!-- Matched vs Missing details -->
            <div class="mt-3 space-y-2 text-xs">
              <div>
                <span class="font-semibold text-emerald-700">✓ You have (${matched.length}):</span>
                <p class="text-slate-600 truncate mt-0.5">${matched.map(m => m.name).join(", ")}</p>
              </div>

              ${missing.length > 0 ? `
                <div>
                  <span class="font-semibold text-rose-600">✗ Missing (${missing.length}):</span>
                  <p class="text-slate-500 truncate mt-0.5">${missing.map(m => m.name).join(", ")}</p>
                </div>
              ` : `
                <div class="text-emerald-700 font-semibold">
                  🎉 You have all ingredients to cook this right now!
                </div>
              `}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">${recipe.cuisine} • ${recipe.mealType}</span>
            <button onclick="window.app.openRecipeDetailModal('${recipe.id}')" class="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition">
              View Recipe
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: COLLECTIONS & FAVORITES
  // ==========================================
  renderCollectionsView() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const user = authService.getCurrentUser();
    const collections = collectionService.getCollections();

    // Ensure selectedCollectionId is valid
    if (!collections.some(c => c.id === this.selectedCollectionId)) {
      this.selectedCollectionId = collections[0]?.id || "col-favorites";
    }

    const currentCollection = collections.find(c => c.id === this.selectedCollectionId) || collections[0];
    const recipes = collectionService.getRecipesForCollection(this.selectedCollectionId);

    main.innerHTML = `
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold font-serif text-slate-900">
              Personalized Collections
            </h1>
            <p class="text-sm text-slate-500 mt-1">
              Curate, organize, and revisit your go-to culinary creations anytime.
            </p>
          </div>
          <button id="create-collection-btn" class="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-2 self-start">
            <i class="fa-solid fa-folder-plus"></i> New Collection
          </button>
        </div>

        <!-- Collections Tab Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          ${collections.map(col => `
            <button
              onclick="window.app.switchCollection('${col.id}')"
              class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                col.id === this.selectedCollectionId
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }"
            >
              <span>${col.name}</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${
                col.id === this.selectedCollectionId ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
              }">
                ${col.recipeIds.length}
              </span>
            </button>
          `).join("")}
        </div>

        <!-- Active Collection Details -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">${currentCollection.name}</h2>
            <p class="text-xs text-slate-500 mt-0.5">${currentCollection.description || "Custom curated recipe collection"}</p>
          </div>

          ${!currentCollection.isDefault ? `
            <button onclick="window.app.deleteCurrentCollection('${currentCollection.id}')" class="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 self-start sm:self-center">
              <i class="fa-solid fa-trash-can"></i> Delete Collection
            </button>
          ` : ""}
        </div>

        <!-- Recipes Inside Active Collection -->
        ${recipes.length === 0 ? `
          <div class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div class="w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto text-xl">
              <i class="fa-regular fa-bookmark"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800">This collection is empty</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Explore delicious recipes from the homepage and click the heart or "Save" button to add them here!
            </p>
            <button onclick="window.app.navigateTo('home')" class="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition">
              Browse Recipes
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${recipes.map(recipe => this.renderRecipeCard(recipe)).join("")}
          </div>
        `}
      </section>
    `;

    const createBtn = document.getElementById("create-collection-btn");
    if (createBtn) {
      createBtn.addEventListener("click", () => this.openCreateCollectionModal());
    }
  }

  switchCollection(id) {
    this.selectedCollectionId = id;
    this.renderCollectionsView();
  }

  deleteCurrentCollection(id) {
    if (confirm("Are you sure you want to delete this custom collection? Recipes inside won't be deleted.")) {
      try {
        collectionService.deleteCollection(id);
        this.selectedCollectionId = "col-favorites";
        this.renderCollectionsView();
        this.showToast("Collection removed", "info");
      } catch (err) {
        this.showToast(err.message, "warning");
      }
    }
  }

  openCreateCollectionModal() {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm modal-backdrop-click">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-folder-plus text-orange-600"></i> New Collection
            </h3>
            <button onclick="window.app.closeModals()" class="text-slate-400 hover:text-slate-600">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form id="create-collection-form" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Collection Name *</label>
              <input
                type="text"
                id="col-name-input"
                required
                placeholder="e.g. Healthy Lunches, Sunday Baking, Mexican Fiesta"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Short Description (Optional)</label>
              <textarea
                id="col-desc-input"
                rows="2"
                placeholder="What kind of recipes belong here?"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" onclick="window.app.closeModals()" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition">
                Create Collection
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    const form = document.getElementById("create-collection-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("col-name-input").value;
        const desc = document.getElementById("col-desc-input").value;
        try {
          const newCol = collectionService.createCollection(name, desc);
          this.selectedCollectionId = newCol.id;
          this.closeModals();
          this.renderCollectionsView();
          this.showToast(`Collection "${name}" created!`, "success");
        } catch (err) {
          this.showToast(err.message, "warning");
        }
      });
    }
  }

  // ==========================================
  // VIEW: MEAL PLANNER & SMART GROCERY LIST
  // ==========================================
  renderMealPlannerView() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const days = mealPlannerService.getDays();
    const slots = mealPlannerService.getSlots();
    const plan = mealPlannerService.getMealPlan();
    const groceryData = mealPlannerService.generateGroceryList();

    main.innerHTML = `
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-2">
              <i class="fa-solid fa-calendar-check"></i> Weekly Nutrition & Meal Schedule
            </div>
            <h1 class="text-3xl font-extrabold font-serif text-slate-900">
              Weekly Meal Planner
            </h1>
            <p class="text-sm text-slate-500 mt-1">
              Plan your week, eliminate decision fatigue, and auto-generate your grocery list.
            </p>
          </div>

          <div class="flex items-center gap-2 self-start md:self-auto">
            <button onclick="window.app.clearWeeklyPlan()" class="px-3.5 py-2 border border-slate-200 text-slate-600 hover:text-red-600 rounded-xl text-xs font-semibold bg-white transition">
              <i class="fa-regular fa-trash-can mr-1"></i> Clear Week
            </button>
            <a href="#grocery-section" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
              <i class="fa-solid fa-cart-shopping"></i> View Grocery List (${groceryData.totalItems})
            </a>
          </div>
        </div>

        <!-- 7-Day Interactive Planner Grid -->
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
          ${days.map(day => `
            <div class="bg-white rounded-2xl border border-slate-200 p-3 space-y-3 flex flex-col justify-between shadow-xs">
              <div class="border-b border-slate-100 pb-2 text-center">
                <span class="text-xs font-extrabold uppercase tracking-wider text-slate-800">${day}</span>
              </div>

              <!-- Day Slots -->
              <div class="space-y-2.5 flex-1">
                ${slots.map(slot => {
                  const recipeId = plan[day] ? plan[day][slot] : null;
                  const recipe = recipeId ? recipeService.getRecipeById(recipeId) : null;

                  return `
                    <div class="bg-slate-50 rounded-xl p-2 border border-slate-100 text-xs space-y-1 relative group">
                      <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>${slot}</span>
                        ${recipe ? `
                          <button
                            onclick="window.app.removeMealSlot('${day}', '${slot}')"
                            title="Remove recipe"
                            class="text-slate-400 hover:text-red-500 transition"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        ` : ""}
                      </div>

                      ${recipe ? `
                        <div class="cursor-pointer" onclick="window.app.openRecipeDetailModal('${recipe.id}')">
                          <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-16 object-cover rounded-lg mb-1">
                          <p class="font-bold text-slate-800 line-clamp-1 hover:text-orange-600 transition">${recipe.title}</p>
                          <span class="text-[10px] text-slate-500">${recipe.prepTime + recipe.cookTime}m • ${recipe.calories} kcal</span>
                        </div>
                      ` : `
                        <button
                          onclick="window.app.openMealSlotPicker('${day}', '${slot}')"
                          class="w-full py-3 border border-dashed border-slate-300 rounded-lg text-slate-400 hover:text-orange-600 hover:border-orange-400 transition flex flex-col items-center justify-center gap-1"
                        >
                          <i class="fa-solid fa-plus text-xs"></i>
                          <span class="text-[10px] font-semibold">Assign</span>
                        </button>
                      `}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Smart Grocery Shopping List Section -->
        <div id="grocery-section" class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Aggregated From Your Weekly Plan
              </div>
              <h2 class="text-2xl font-bold font-serif text-slate-900">
                Smart Grocery Shopping List
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                ${groceryData.checkedCount} of ${groceryData.totalItems} items checked off
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="window.app.clearCheckedGrocery()" class="px-3.5 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition">
                Reset Checkmarks
              </button>
              <button onclick="window.print()" class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5">
                <i class="fa-solid fa-print"></i> Print Grocery List
              </button>
            </div>
          </div>

          <!-- Add Custom Item -->
          <form id="add-grocery-item-form" class="flex gap-2 max-w-lg">
            <input
              type="text"
              id="grocery-custom-name"
              placeholder="Add extra pantry item (e.g. Oat milk, Coffee beans)..."
              class="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
            <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition">
              + Add Item
            </button>
          </form>

          <!-- Grouped Grocery Categories -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${Object.entries(groceryData.categorized).map(([catTitle, items]) => {
              if (items.length === 0) return "";
              return `
                <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>${catTitle}</span>
                    <span class="text-[11px] text-slate-400 font-normal">(${items.length})</span>
                  </h3>

                  <ul class="space-y-2 text-xs">
                    ${items.map(item => `
                      <li class="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-white transition group">
                        <input
                          type="checkbox"
                          ${item.checked ? 'checked' : ''}
                          onchange="window.app.toggleGroceryCheck('${item.id}')"
                          class="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 ingredient-checkbox cursor-pointer"
                        />
                        <div class="flex-1 leading-tight">
                          <span class="font-medium text-slate-800 ${item.checked ? 'line-through text-slate-400' : ''}">
                            ${item.quantity ? `${item.quantity} ${item.unit} ` : ''}${item.name}
                          </span>
                          <span class="block text-[10px] text-slate-400 mt-0.5">
                            For: ${item.recipes.join(", ")}
                          </span>
                        </div>
                        ${item.isCustom ? `
                          <button onclick="window.app.removeCustomGrocery('${item.id}')" class="text-slate-300 hover:text-red-500 text-xs">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        ` : ""}
                      </li>
                    `).join("")}
                  </ul>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </section>
    `;

    const groceryForm = document.getElementById("add-grocery-item-form");
    if (groceryForm) {
      groceryForm.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("grocery-custom-name");
        if (input && input.value.trim()) {
          mealPlannerService.addCustomGroceryItem(input.value.trim());
          this.renderMealPlannerView();
          this.showToast("Item added to grocery list", "success");
        }
      });
    }
  }

  toggleGroceryCheck(id) {
    mealPlannerService.toggleGroceryItem(id);
    this.renderMealPlannerView();
  }

  clearCheckedGrocery() {
    mealPlannerService.clearCheckedGrocery();
    this.renderMealPlannerView();
    this.showToast("Checkmarks reset", "info");
  }

  removeCustomGrocery(id) {
    mealPlannerService.removeCustomGroceryItem(id);
    this.renderMealPlannerView();
  }

  removeMealSlot(day, slot) {
    mealPlannerService.removeRecipe(day, slot);
    this.renderMealPlannerView();
    this.showToast(`Removed meal from ${day} ${slot}`, "info");
  }

  clearWeeklyPlan() {
    if (confirm("Are you sure you want to clear your planned meals for the week?")) {
      mealPlannerService.clearPlan();
      this.renderMealPlannerView();
      this.showToast("Weekly plan cleared", "info");
    }
  }

  openMealSlotPicker(day, slot) {
    const recipes = recipeService.getAllRecipes();
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm modal-backdrop-click">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-base font-bold text-slate-800">
                Assign Recipe to ${day} ${slot}
              </h3>
              <p class="text-xs text-slate-400">Select one recipe from your catalog</p>
            </div>
            <button onclick="window.app.closeModals()" class="text-slate-400 hover:text-slate-600">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div class="overflow-y-auto space-y-2 flex-1 pr-1">
            ${recipes.map(r => `
              <div
                onclick="window.app.assignRecipeToSlot('${day}', '${slot}', '${r.id}')"
                class="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 cursor-pointer transition"
              >
                <img src="${r.image}" alt="${r.title}" class="w-12 h-12 rounded-lg object-cover">
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-slate-800 text-xs truncate">${r.title}</p>
                  <p class="text-[11px] text-slate-500">${r.cuisine} • ${r.prepTime + r.cookTime} mins • ★ ${r.rating}</p>
                </div>
                <button class="px-2.5 py-1 bg-orange-600 text-white rounded-lg text-xs font-semibold">
                  Select
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  assignRecipeToSlot(day, slot, recipeId) {
    mealPlannerService.assignRecipe(day, slot, recipeId);
    this.closeModals();
    this.renderMealPlannerView();
    this.showToast(`Recipe assigned to ${day} ${slot}!`, "success");
  }

  // ==========================================
  // VIEW: SUBMIT NEW RECIPE
  // ==========================================
  renderSubmitRecipeView() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const user = authService.getCurrentUser();
    const cuisines = recipeService.getCuisines().filter(c => c !== "All Cuisines");

    main.innerHTML = `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Share Your Culinary Art
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900">
            Submit a New Recipe
          </h1>
          <p class="text-slate-600 text-sm max-w-lg mx-auto">
            Inspire thousands of home cooks worldwide. Add ingredients with measurements and numbered instructions.
          </p>
        </div>

        ${!user ? `
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-800">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-circle-info text-amber-600 text-base"></i>
              <span>You are submitting as a <strong>Guest</strong>. Sign in so this recipe is linked directly to your chef profile!</span>
            </div>
            <button onclick="window.app.openAuthModal('signin')" class="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition">
              Sign In
            </button>
          </div>
        ` : ""}

        <!-- Form Card -->
        <form id="submit-recipe-form" class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <!-- Basic Details -->
          <div class="space-y-4">
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Basic Recipe Information
            </h2>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Recipe Title *</label>
              <input
                type="text"
                id="form-title"
                required
                placeholder="e.g. Creamy Sun-Dried Tomato Fettuccine"
                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Short Appetizing Description *</label>
              <textarea
                id="form-desc"
                required
                rows="2"
                placeholder="Describe flavors, textures, and what makes this dish special..."
                class="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Photo Image URL *</label>
              <input
                type="url"
                id="form-image"
                required
                value="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
                placeholder="https://images.unsplash.com/..."
                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <span class="text-[11px] text-slate-400 mt-1 block">Paste an Unsplash or direct web photo URL of your dish.</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Cuisine *</label>
                <select id="form-cuisine" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:ring-orange-500">
                  ${cuisines.map(c => `<option value="${c}">${c}</option>`).join("")}
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Meal Type *</label>
                <select id="form-meal" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:ring-orange-500">
                  <option value="Dinner">Dinner</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Difficulty *</label>
                <select id="form-difficulty" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:ring-orange-500">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard / Advanced</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Base Servings *</label>
                <input
                  type="number"
                  id="form-servings"
                  required
                  min="1"
                  max="20"
                  value="4"
                  class="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-orange-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Prep Time (mins) *</label>
                <input type="number" id="form-prep" required min="1" value="15" class="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-orange-500">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Cook Time (mins) *</label>
                <input type="number" id="form-cook" required min="0" value="20" class="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-orange-500">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Calories / serving</label>
                <input type="number" id="form-calories" min="50" value="450" class="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-orange-500">
              </div>
            </div>

            <!-- Dietary Checkboxes -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-2">Dietary Tags</label>
              <div class="flex flex-wrap gap-3 text-xs">
                ${["Vegetarian", "Vegan", "Gluten-Free", "Keto-Friendly", "Dairy-Free", "High-Protein"].map(diet => `
                  <label class="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" name="form-diet" value="${diet}" class="rounded text-orange-600 focus:ring-orange-500">
                    <span class="text-slate-700">${diet}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Dynamic Ingredients List -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">
                  2. Ingredients List
                </h2>
                <p class="text-xs text-slate-500">Specify numerical amounts so the serving scaler can adjust dynamically.</p>
              </div>
              <button type="button" onclick="window.app.addIngredientRow()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1">
                <i class="fa-solid fa-plus text-orange-600"></i> Add Ingredient
              </button>
            </div>

            <div id="ingredients-form-rows" class="space-y-2">
              ${this.tempIngredients.map((ing, idx) => this.renderIngredientFormRow(ing, idx)).join("")}
            </div>
          </div>

          <!-- Dynamic Steps List -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900">
                  3. Step-by-Step Instructions
                </h2>
                <p class="text-xs text-slate-500">Provide sequential steps with optional countdown timers.</p>
              </div>
              <button type="button" onclick="window.app.addInstructionRow()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1">
                <i class="fa-solid fa-plus text-orange-600"></i> Add Step
              </button>
            </div>

            <div id="instructions-form-rows" class="space-y-3">
              ${this.tempInstructions.map((ins, idx) => this.renderInstructionFormRow(ins, idx)).join("")}
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="window.app.navigateTo('home')" class="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" class="px-7 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center gap-2">
              <i class="fa-solid fa-cloud-arrow-up"></i> Publish Recipe
            </button>
          </div>
        </form>
      </section>
    `;

    const form = document.getElementById("submit-recipe-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        this.handleRecipeSubmit();
      });
    }
  }

  renderIngredientFormRow(ing, idx) {
    return `
      <div class="flex items-center gap-2 ingredient-row" data-idx="${idx}">
        <input
          type="text"
          placeholder="Ingredient name (e.g. Heavy cream)"
          value="${ing.name}"
          class="ing-name flex-2 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-orange-500"
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Qty"
          value="${ing.quantity}"
          class="ing-qty w-20 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-orange-500"
          required
        />
        <input
          type="text"
          placeholder="Unit (g, ml, tbsp)"
          value="${ing.unit}"
          class="ing-unit w-24 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-orange-500"
        />
        <button
          type="button"
          onclick="window.app.removeIngredientRow(${idx})"
          class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition"
        >
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>
    `;
  }

  renderInstructionFormRow(ins, idx) {
    return `
      <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 instruction-row" data-idx="${idx}">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Step ${idx + 1}</span>
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-1 font-normal text-slate-500">
              <i class="fa-regular fa-clock text-orange-600"></i> Timer (mins):
              <input type="number" min="0" value="${ins.timerMinutes || 0}" class="ins-timer w-16 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            </label>
            <button
              type="button"
              onclick="window.app.removeInstructionRow(${idx})"
              class="text-slate-400 hover:text-red-500 text-xs"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Step title (e.g. Sauté Aromatics)"
          value="${ins.title}"
          class="ins-title w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-orange-500"
          required
        />

        <textarea
          rows="2"
          placeholder="Detailed instructions for this step..."
          class="ins-desc w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-orange-500"
          required
        >${ins.description}</textarea>
      </div>
    `;
  }

  addIngredientRow() {
    this.tempIngredients.push({ name: "", quantity: 1, unit: "unit", notes: "" });
    this.refreshFormRows();
  }

  removeIngredientRow(idx) {
    if (this.tempIngredients.length <= 1) {
      this.showToast("Recipe must have at least one ingredient", "warning");
      return;
    }
    this.tempIngredients.splice(idx, 1);
    this.refreshFormRows();
  }

  addInstructionRow() {
    this.tempInstructions.push({
      step: this.tempInstructions.length + 1,
      title: "",
      description: "",
      timerMinutes: 0
    });
    this.refreshFormRows();
  }

  removeInstructionRow(idx) {
    if (this.tempInstructions.length <= 1) {
      this.showToast("Recipe must have at least one step", "warning");
      return;
    }
    this.tempInstructions.splice(idx, 1);
    this.refreshFormRows();
  }

  refreshFormRows() {
    // Sync current values from DOM before re-rendering
    const ingRows = document.querySelectorAll(".ingredient-row");
    ingRows.forEach((row, i) => {
      if (this.tempIngredients[i]) {
        this.tempIngredients[i].name = row.querySelector(".ing-name")?.value || "";
        this.tempIngredients[i].quantity = Number(row.querySelector(".ing-qty")?.value) || 1;
        this.tempIngredients[i].unit = row.querySelector(".ing-unit")?.value || "";
      }
    });

    const insRows = document.querySelectorAll(".instruction-row");
    insRows.forEach((row, i) => {
      if (this.tempInstructions[i]) {
        this.tempInstructions[i].title = row.querySelector(".ins-title")?.value || "";
        this.tempInstructions[i].description = row.querySelector(".ins-desc")?.value || "";
        this.tempInstructions[i].timerMinutes = Number(row.querySelector(".ins-timer")?.value) || 0;
      }
    });

    const ingContainer = document.getElementById("ingredients-form-rows");
    if (ingContainer) {
      ingContainer.innerHTML = this.tempIngredients.map((ing, idx) => this.renderIngredientFormRow(ing, idx)).join("");
    }

    const insContainer = document.getElementById("instructions-form-rows");
    if (insContainer) {
      insContainer.innerHTML = this.tempInstructions.map((ins, idx) => this.renderInstructionFormRow(ins, idx)).join("");
    }
  }

  handleRecipeSubmit() {
    const title = document.getElementById("form-title").value.trim();
    const description = document.getElementById("form-desc").value.trim();
    const image = document.getElementById("form-image").value.trim();
    const cuisine = document.getElementById("form-cuisine").value;
    const mealType = document.getElementById("form-meal").value;
    const difficulty = document.getElementById("form-difficulty").value;
    const servings = Number(document.getElementById("form-servings").value) || 4;
    const prepTime = Number(document.getElementById("form-prep").value) || 15;
    const cookTime = Number(document.getElementById("form-cook").value) || 20;
    const calories = Number(document.getElementById("form-calories").value) || 450;

    const dietCheckboxes = document.querySelectorAll("input[name='form-diet']:checked");
    const diet = Array.from(dietCheckboxes).map(cb => cb.value);

    // Harvest ingredients
    const ingredients = [];
    document.querySelectorAll(".ingredient-row").forEach(row => {
      const name = row.querySelector(".ing-name")?.value.trim();
      const qty = Number(row.querySelector(".ing-qty")?.value) || 1;
      const unit = row.querySelector(".ing-unit")?.value.trim() || "";
      if (name) ingredients.push({ name, quantity: qty, unit });
    });

    if (ingredients.length === 0) {
      this.showToast("Please include at least one ingredient.", "warning");
      return;
    }

    // Harvest instructions
    const instructions = [];
    document.querySelectorAll(".instruction-row").forEach((row, idx) => {
      const stepTitle = row.querySelector(".ins-title")?.value.trim() || `Step ${idx + 1}`;
      const desc = row.querySelector(".ins-desc")?.value.trim();
      const timer = Number(row.querySelector(".ins-timer")?.value) || 0;
      if (desc) {
        instructions.push({
          step: idx + 1,
          title: stepTitle,
          description: desc,
          timerMinutes: timer
        });
      }
    });

    if (instructions.length === 0) {
      this.showToast("Please include at least one instruction step.", "warning");
      return;
    }

    const user = authService.getCurrentUser();

    const recipeData = {
      title,
      description,
      image,
      cuisine,
      mealType,
      difficulty,
      servings,
      prepTime,
      cookTime,
      calories,
      diet,
      tags: [cuisine.toLowerCase(), mealType.toLowerCase(), ...diet.map(d => d.toLowerCase())],
      ingredients,
      instructions,
      nutrition: {
        calories: calories,
        protein: Math.round(calories * 0.05),
        carbs: Math.round(calories * 0.08),
        fat: Math.round(calories * 0.03),
        fiber: 3
      }
    };

    const newRecipe = recipeService.addRecipe(recipeData, user);
    this.showToast("Recipe published to Savoria community!", "success");
    this.openRecipeDetailModal(newRecipe.id);
  }

  // ==========================================
  // VIEW: USER PROFILE & DASHBOARD
  // ==========================================
  renderProfileView() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const user = authService.getCurrentUser();

    if (!user) {
      main.innerHTML = `
        <section class="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            <i class="fa-solid fa-user-lock"></i>
          </div>
          <h2 class="text-2xl font-bold font-serif text-slate-800">Chef Sign-In Required</h2>
          <p class="text-xs text-slate-500">
            Sign in to view your culinary profile, submitted recipes, saved collections, and meal planner.
          </p>
          <div class="flex justify-center gap-3 pt-2">
            <button onclick="window.app.openAuthModal('signin')" class="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition">
              Sign In
            </button>
            <button onclick="window.app.openAuthModal('demo')" class="px-5 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-200 transition">
              1-Click Demo Login
            </button>
          </div>
        </section>
      `;
      return;
    }

    const allCustom = recipeService.getCustomRecipes();
    const myRecipes = allCustom.filter(r => r.author && r.author.id === user.id);
    const collections = collectionService.getCollections();

    main.innerHTML = `
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <!-- Profile Header Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img src="${user.avatar}" alt="${user.name}" class="w-24 h-24 rounded-full object-cover border-4 border-orange-100 shadow-md">
          <div class="flex-1 text-center sm:text-left space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">${user.name}</h1>
                <p class="text-xs font-bold text-orange-600 uppercase tracking-wider">${user.role}</p>
              </div>
              <button onclick="window.app.openEditProfileModal()" class="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition self-center sm:self-start">
                <i class="fa-solid fa-pen-to-square mr-1"></i> Edit Profile
              </button>
            </div>
            <p class="text-sm text-slate-600 max-w-xl">${user.bio || "Passionate home cook exploring recipes on Savoria."}</p>
            <div class="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500">
              <span><strong>${myRecipes.length}</strong> Created Recipes</span>
              <span>•</span>
              <span><strong>${collections.length}</strong> Saved Collections</span>
              <span>•</span>
              <span>Member since <strong>${user.createdAt || '2026'}</strong></span>
            </div>
          </div>
        </div>

        <!-- My Created Recipes Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold font-serif text-slate-800">
              My Created Recipes (${myRecipes.length})
            </h2>
            <button onclick="window.app.navigateTo('submit-recipe')" class="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
              <i class="fa-solid fa-plus"></i> Submit Another
            </button>
          </div>

          ${myRecipes.length === 0 ? `
            <div class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <p class="text-xs text-slate-500">You haven't submitted any custom recipes yet.</p>
              <button onclick="window.app.navigateTo('submit-recipe')" class="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold">
                Submit Your First Recipe
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${myRecipes.map(r => this.renderRecipeCard(r)).join("")}
            </div>
          `}
        </div>
      </section>
    `;
  }

  openEditProfileModal() {
    const user = authService.getCurrentUser();
    if (!user) return;

    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm modal-backdrop-click">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">Edit Profile</h3>
            <button onclick="window.app.closeModals()" class="text-slate-400 hover:text-slate-600">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form id="edit-profile-form" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Display Name</label>
              <input type="text" id="edit-name" value="${user.name}" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-orange-500" required>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Culinary Title / Role</label>
              <input type="text" id="edit-role" value="${user.role}" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-orange-500" required>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Bio</label>
              <textarea id="edit-bio" rows="2" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-orange-500">${user.bio || ""}</textarea>
            </div>

            <div class="flex justify-end gap-2 pt-3">
              <button type="button" onclick="window.app.closeModals()" class="px-4 py-2 border rounded-xl font-semibold">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const form = document.getElementById("edit-profile-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        authService.updateProfile({
          name: document.getElementById("edit-name").value,
          role: document.getElementById("edit-role").value,
          bio: document.getElementById("edit-bio").value
        });
        this.closeModals();
        this.renderProfileView();
        this.showToast("Profile updated successfully", "success");
      });
    }
  }

  // ==========================================
  // RECIPE DETAIL MODAL & INTERACTIVE COOKING
  // ==========================================
  openRecipeDetailModal(recipeId) {
    const recipe = recipeService.getRecipeById(recipeId);
    if (!recipe) {
      this.showToast("Recipe not found", "warning");
      return;
    }

    this.selectedRecipe = recipe;
    this.scaledServings = recipe.servings || 4;
    window.location.hash = `recipe/${recipe.id}`;

    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    const isSaved = collectionService.isRecipeSaved(recipe.id);
    const collections = collectionService.getCollections();

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md modal-backdrop-click overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden text-slate-800 relative recipe-print-container" onclick="event.stopPropagation()">
          
          <!-- Sticky Top Header Actions -->
          <div class="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-slate-100 flex items-center justify-between no-print">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                ${recipe.cuisine}
              </span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs text-slate-600 font-medium">${recipe.mealType}</span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Start Hands Free Cooking Mode -->
              <button onclick="window.app.enterCookingMode('${recipe.id}')" class="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
                <i class="fa-solid fa-play text-[10px]"></i> Cook Mode
              </button>

              <!-- Share -->
              <button onclick="window.app.copyRecipeShareLink('${recipe.id}')" title="Copy shareable link" class="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs transition">
                <i class="fa-solid fa-share-nodes"></i>
              </button>

              <!-- Print -->
              <button onclick="window.print()" title="Print recipe" class="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs transition">
                <i class="fa-solid fa-print"></i>
              </button>

              <!-- Close -->
              <button onclick="window.app.closeModals()" title="Close" class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-xs transition ml-2">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Hero Image & Headline -->
          <div class="relative h-64 sm:h-80 w-full overflow-hidden">
            <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            
            <div class="absolute bottom-4 left-6 right-6 text-white space-y-2">
              <div class="flex items-center gap-2">
                <div class="flex items-center text-amber-400 text-xs font-bold gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  <i class="fa-solid fa-star"></i> ${recipe.rating} (${recipe.ratingCount} reviews)
                </div>
                ${(recipe.diet || []).map(d => `
                  <span class="text-[11px] bg-emerald-700/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-white font-medium">${d}</span>
                `).join("")}
              </div>
              <h1 class="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">
                ${recipe.title}
              </h1>
            </div>
          </div>

          <div class="p-6 sm:p-8 space-y-8">
            <!-- Author & Quick Metrics Bar -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <img src="${recipe.author.avatar}" alt="${recipe.author.name}" class="w-12 h-12 rounded-full object-cover border-2 border-orange-500">
                <div>
                  <div class="flex items-center gap-1.5">
                    <p class="font-bold text-slate-800 text-sm">${recipe.author.name}</p>
                    ${recipe.author.verified ? '<i class="fa-solid fa-circle-check text-orange-500 text-xs" title="Verified Chef"></i>' : ''}
                  </div>
                  <p class="text-xs text-slate-400">${recipe.author.role}</p>
                </div>
              </div>

              <!-- Quick Metrics Grid -->
              <div class="flex items-center gap-3 sm:gap-6 text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                <div class="text-center">
                  <span class="block text-slate-400 text-[10px] uppercase font-bold">Prep</span>
                  <span class="font-bold text-slate-800">${recipe.prepTime}m</span>
                </div>
                <div class="w-px h-6 bg-slate-200"></div>
                <div class="text-center">
                  <span class="block text-slate-400 text-[10px] uppercase font-bold">Cook</span>
                  <span class="font-bold text-slate-800">${recipe.cookTime}m</span>
                </div>
                <div class="w-px h-6 bg-slate-200"></div>
                <div class="text-center">
                  <span class="block text-slate-400 text-[10px] uppercase font-bold">Total</span>
                  <span class="font-bold text-orange-600">${recipe.prepTime + recipe.cookTime}m</span>
                </div>
                <div class="w-px h-6 bg-slate-200"></div>
                <div class="text-center">
                  <span class="block text-slate-400 text-[10px] uppercase font-bold">Difficulty</span>
                  <span class="font-bold text-slate-800">${recipe.difficulty}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-slate-600 text-sm leading-relaxed">
              ${recipe.description}
            </p>

            <!-- Save To Collection Dropdown Action Bar -->
            <div class="bg-orange-50/70 border border-orange-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
              <div class="flex items-center gap-2">
                <button
                  onclick="window.app.toggleFavoriteRecipe('${recipe.id}')"
                  class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    isSaved ? 'bg-red-500 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:text-red-500'
                  }"
                >
                  <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                  <span>${isSaved ? 'Saved to Favorites' : 'Add to Favorites'}</span>
                </button>

                <!-- Custom Collection Picker -->
                <select
                  id="recipe-collection-select"
                  onchange="window.app.handleSaveToSpecificCollection('${recipe.id}', this.value)"
                  class="text-xs border border-slate-200 bg-white rounded-xl px-3 py-2 text-slate-700 focus:ring-orange-500"
                >
                  <option value="">+ Add to Collection...</option>
                  ${collections.map(c => `
                    <option value="${c.id}">${c.name}</option>
                  `).join("")}
                </select>
              </div>

              <!-- Add to Meal Plan -->
              <button
                onclick="window.app.openQuickAddMealPlan('${recipe.id}')"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <i class="fa-solid fa-calendar-plus"></i> Add to Weekly Meal Plan
              </button>
            </div>

            <!-- Two-Column Layout: Scalable Ingredients & Nutrition -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Ingredients (2 cols) -->
              <div class="md:col-span-2 space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 class="text-lg font-bold font-serif text-slate-900">Ingredients</h3>
                    <p class="text-[11px] text-slate-400">Check off items as you prep in your kitchen</p>
                  </div>

                  <!-- Servings Scaler Widget -->
                  <div class="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span class="text-xs text-slate-500 font-medium">Servings:</span>
                    <button onclick="window.app.scaleServings(-1)" class="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold hover:bg-orange-500 hover:text-white transition flex items-center justify-center text-xs">
                      -
                    </button>
                    <span id="serving-count-display" class="font-bold text-sm text-slate-900 w-5 text-center">${this.scaledServings}</span>
                    <button onclick="window.app.scaleServings(1)" class="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold hover:bg-orange-500 hover:text-white transition flex items-center justify-center text-xs">
                      +
                    </button>
                  </div>
                </div>

                <ul id="scaled-ingredients-list" class="space-y-2.5 text-xs">
                  ${this.renderScaledIngredients(recipe)}
                </ul>
              </div>

              <!-- Nutrition Facts Panel (1 col) -->
              <div class="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 h-fit">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Nutrition Facts</span>
                  <i class="fa-solid fa-heart-pulse text-rose-500"></i>
                </h3>
                <div class="space-y-2 text-xs">
                  <div class="flex justify-between py-1 border-b border-slate-200/60 font-bold text-slate-800">
                    <span>Calories</span>
                    <span class="text-orange-600 font-extrabold text-sm">${recipe.nutrition?.calories || recipe.calories} kcal</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-200/60 text-slate-600">
                    <span>Protein</span>
                    <span class="font-semibold text-slate-800">${recipe.nutrition?.protein || 24} g</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-200/60 text-slate-600">
                    <span>Carbohydrates</span>
                    <span class="font-semibold text-slate-800">${recipe.nutrition?.carbs || 35} g</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-200/60 text-slate-600">
                    <span>Total Fat</span>
                    <span class="font-semibold text-slate-800">${recipe.nutrition?.fat || 18} g</span>
                  </div>
                  <div class="flex justify-between py-1 text-slate-600">
                    <span>Dietary Fiber</span>
                    <span class="font-semibold text-slate-800">${recipe.nutrition?.fiber || 4} g</span>
                  </div>
                </div>
                <div class="pt-2 text-[10px] text-slate-400 italic">
                  * Daily values based on standard 2,000 calorie diet.
                </div>
              </div>
            </div>

            <!-- Step-by-Step Instructions -->
            <div class="space-y-4 pt-4 border-t border-slate-100">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold font-serif text-slate-900">
                  Step-by-Step Instructions
                </h3>
                <span class="text-xs text-slate-400">${recipe.instructions.length} sequential steps</span>
              </div>

              <div class="space-y-4">
                ${recipe.instructions.map((step, idx) => `
                  <div class="step-item p-4 rounded-2xl bg-white border border-slate-200 transition hover:border-orange-200" id="step-row-${idx}">
                    <div class="flex items-start gap-3.5">
                      <div class="step-number w-8 h-8 rounded-xl bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center shrink-0">
                        ${step.step || idx + 1}
                      </div>

                      <div class="flex-1 space-y-2">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                          <h4 class="font-bold text-slate-800 text-sm">${step.title}</h4>
                          
                          <!-- Step Timer Button if available -->
                          ${step.timerMinutes && step.timerMinutes > 0 ? `
                            <button
                              onclick="window.app.startStepTimer(${step.timerMinutes}, 'Step ${step.step}: ${step.title}')"
                              class="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-semibold flex items-center gap-1.5 transition no-print"
                            >
                              <i class="fa-regular fa-clock"></i>
                              <span>Start ${step.timerMinutes}m Timer</span>
                            </button>
                          ` : ""}
                        </div>

                        <p class="step-text text-xs sm:text-sm text-slate-600 leading-relaxed">
                          ${step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Active Floating Timer Bar (Hidden until started) -->
            <div id="recipe-timer-bar" class="hidden sticky bottom-4 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-between no-print timer-pulse">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-stopwatch text-orange-400 text-xl"></i>
                <div>
                  <p id="timer-title-display" class="text-xs font-semibold text-slate-300">Cooking Timer</p>
                  <p id="timer-countdown-display" class="text-xl font-mono font-bold text-orange-400">00:00</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button id="timer-pause-btn" onclick="window.app.toggleTimerPause()" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg">
                  Pause
                </button>
                <button onclick="window.app.resetTimer()" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-xs font-semibold rounded-lg">
                  Cancel
                </button>
              </div>
            </div>

            <!-- Community Reviews & Rating Form -->
            <div class="space-y-6 pt-6 border-t border-slate-100">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold font-serif text-slate-900">Community Reviews</h3>
                  <p class="text-xs text-slate-400">${recipe.ratingCount} reviews from fellow home cooks</p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-extrabold text-amber-500">★ ${recipe.rating}</span>
                  <span class="text-xs text-slate-400 block">Overall Score</span>
                </div>
              </div>

              <!-- Submit Review Form -->
              <form id="recipe-review-form" class="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 no-print">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Write a Review & Rate</h4>
                
                <!-- Star Rating Radio -->
                <div class="flex items-center gap-2 text-amber-400 text-base" id="star-rating-picker">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <button
                      type="button"
                      onclick="window.app.selectRatingStars(${star})"
                      class="star-picker-btn text-amber-400 hover:scale-110 transition"
                      data-star="${star}"
                    >
                      <i class="fa-solid fa-star"></i>
                    </button>
                  `).join("")}
                  <span id="star-rating-label" class="text-xs font-bold text-slate-600 ml-2">5 Stars (Masterpiece)</span>
                  <input type="hidden" id="selected-star-val" value="5">
                </div>

                <textarea
                  id="review-comment-input"
                  required
                  rows="2"
                  placeholder="Share your kitchen tips, taste notes, or any adjustments you made..."
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                ></textarea>

                <div class="flex justify-end">
                  <button type="submit" class="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition">
                    Post Review
                  </button>
                </div>
              </form>

              <!-- Reviews List -->
              <div class="space-y-3">
                ${(recipe.reviews || []).map(rev => `
                  <div class="p-4 rounded-xl bg-white border border-slate-100 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <img src="${rev.userAvatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + rev.userName}" alt="${rev.userName}" class="w-6 h-6 rounded-full object-cover">
                        <span class="text-xs font-bold text-slate-800">${rev.userName}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-amber-500 text-xs font-semibold">★ ${rev.rating}</span>
                        <span class="text-[11px] text-slate-400">${rev.date}</span>
                      </div>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">${rev.comment}</p>
                  </div>
                `).join("")}
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    const reviewForm = document.getElementById("recipe-review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", e => {
        e.preventDefault();
        this.submitRecipeReview(recipe.id);
      });
    }
  }

  renderScaledIngredients(recipe) {
    const baseServings = recipe.servings || 4;
    const factor = this.scaledServings / baseServings;

    return (recipe.ingredients || []).map((ing, i) => {
      let scaledQty = "";
      if (ing.quantity) {
        const val = Math.round(ing.quantity * factor * 10) / 10;
        scaledQty = `<strong class="text-orange-600 font-bold">${val}</strong> ${ing.unit || ""} `;
      }

      return `
        <li class="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition">
          <input type="checkbox" id="ing-check-${i}" class="ingredient-checkbox mt-0.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer">
          <label for="ing-check-${i}" class="flex-1 cursor-pointer">
            <span class="text-slate-800">${scaledQty}${ing.name}</span>
            ${ing.notes ? `<span class="text-slate-400 italic"> (${ing.notes})</span>` : ""}
          </label>
        </li>
      `;
    }).join("");
  }

  scaleServings(delta) {
    const next = this.scaledServings + delta;
    if (next < 1 || next > 24) return;
    this.scaledServings = next;

    const display = document.getElementById("serving-count-display");
    if (display) display.innerText = next;

    const list = document.getElementById("scaled-ingredients-list");
    if (list && this.selectedRecipe) {
      list.innerHTML = this.renderScaledIngredients(this.selectedRecipe);
    }
  }

  selectRatingStars(rating) {
    const valInput = document.getElementById("selected-star-val");
    if (valInput) valInput.value = rating;

    const label = document.getElementById("star-rating-label");
    const labels = ["1 Star (Poor)", "2 Stars (Fair)", "3 Stars (Good)", "4 Stars (Great)", "5 Stars (Masterpiece)"];
    if (label) label.innerText = labels[rating - 1];

    document.querySelectorAll(".star-picker-btn").forEach(btn => {
      const s = Number(btn.dataset.star);
      if (s <= rating) {
        btn.classList.add("text-amber-400");
        btn.classList.remove("text-slate-300");
      } else {
        btn.classList.add("text-slate-300");
        btn.classList.remove("text-amber-400");
      }
    });
  }

  submitRecipeReview(recipeId) {
    const user = authService.getCurrentUser() || {
      name: "Guest Gourmet",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Guest"
    };

    const rating = Number(document.getElementById("selected-star-val").value) || 5;
    const comment = document.getElementById("review-comment-input").value;

    try {
      recipeService.addReview(recipeId, { rating, comment, user });
      this.showToast("Review submitted! Thank you for rating.", "success");
      this.openRecipeDetailModal(recipeId);
    } catch (err) {
      this.showToast(err.message, "warning");
    }
  }

  copyRecipeShareLink(recipeId) {
    const url = `${window.location.origin}${window.location.pathname}#recipe/${recipeId}`;
    navigator.clipboard.writeText(url).then(() => {
      this.showToast("Recipe link copied to clipboard!", "success");
    }).catch(() => {
      this.showToast(`Recipe URL: ${url}`, "info");
    });
  }

  toggleFavoriteRecipe(recipeId) {
    const isSaved = collectionService.toggleFavorite(recipeId);
    this.showToast(isSaved ? "Saved to Favorites ❤️" : "Removed from Favorites", isSaved ? "success" : "info");
    if (this.currentView === "collections") {
      this.renderCollectionsView();
    } else if (this.currentView === "home") {
      this.renderHomeView();
    } else if (this.selectedRecipe && this.selectedRecipe.id === recipeId) {
      this.openRecipeDetailModal(recipeId);
    }
  }

  handleSaveToSpecificCollection(recipeId, collectionId) {
    if (!collectionId) return;
    try {
      const added = collectionService.toggleRecipeInCollection(recipeId, collectionId);
      this.showToast(added ? "Added to collection!" : "Removed from collection", "success");
    } catch (err) {
      this.showToast(err.message, "warning");
    }
  }

  openQuickAddMealPlan(recipeId) {
    const days = mealPlannerService.getDays();
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm modal-backdrop-click">
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4" onclick="event.stopPropagation()">
          <h3 class="text-base font-bold text-slate-800">Add to Weekly Meal Plan</h3>
          <p class="text-xs text-slate-500">Choose day and meal slot for this recipe:</p>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Day of Week</label>
              <select id="quick-day-select" class="w-full border rounded-xl p-2.5 bg-slate-50 font-semibold">
                ${days.map(d => `<option value="${d}">${d}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Meal Slot</label>
              <select id="quick-slot-select" class="w-full border rounded-xl p-2.5 bg-slate-50 font-semibold">
                <option value="Dinner">Dinner</option>
                <option value="Lunch">Lunch</option>
                <option value="Breakfast">Breakfast</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button onclick="window.app.closeModals()" class="px-4 py-2 border rounded-xl text-xs font-semibold">Cancel</button>
            <button onclick="window.app.confirmQuickMealPlan('${recipeId}')" class="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700">
              Save Slot
            </button>
          </div>
        </div>
      </div>
    `;
  }

  confirmQuickMealPlan(recipeId) {
    const day = document.getElementById("quick-day-select").value;
    const slot = document.getElementById("quick-slot-select").value;
    mealPlannerService.assignRecipe(day, slot, recipeId);
    this.closeModals();
    this.showToast(`Added to ${day} ${slot}!`, "success");
  }

  // ==========================================
  // COOKING TIMER & HANDS-FREE COOKING MODE
  // ==========================================
  startStepTimer(minutes, title = "Step Timer") {
    if (this.activeTimer) clearInterval(this.activeTimer);

    this.activeTimerSeconds = minutes * 60;
    const bar = document.getElementById("recipe-timer-bar");
    const titleDisplay = document.getElementById("timer-title-display");
    const countDisplay = document.getElementById("timer-countdown-display");

    if (bar) bar.classList.remove("hidden");
    if (titleDisplay) titleDisplay.innerText = title;

    this.updateTimerDisplay();

    this.activeTimer = setInterval(() => {
      this.activeTimerSeconds--;
      this.updateTimerDisplay();

      if (this.activeTimerSeconds <= 0) {
        clearInterval(this.activeTimer);
        this.activeTimer = null;
        this.playTimerChime();
        this.showToast(`⏰ Timer finished: ${title}!`, "success");
        if (countDisplay) countDisplay.innerText = "00:00 (DONE!)";
      }
    }, 1000);

    this.showToast(`Timer started: ${minutes} minutes`, "info");
  }

  updateTimerDisplay() {
    const countDisplay = document.getElementById("timer-countdown-display");
    if (!countDisplay) return;

    const m = Math.floor(this.activeTimerSeconds / 60);
    const s = this.activeTimerSeconds % 60;
    countDisplay.innerText = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  toggleTimerPause() {
    const btn = document.getElementById("timer-pause-btn");
    if (this.activeTimer) {
      clearInterval(this.activeTimer);
      this.activeTimer = null;
      if (btn) btn.innerText = "Resume";
    } else if (this.activeTimerSeconds > 0) {
      this.activeTimer = setInterval(() => {
        this.activeTimerSeconds--;
        this.updateTimerDisplay();
        if (this.activeTimerSeconds <= 0) {
          clearInterval(this.activeTimer);
          this.playTimerChime();
          this.showToast("⏰ Timer finished!", "success");
        }
      }, 1000);
      if (btn) btn.innerText = "Pause";
    }
  }

  resetTimer() {
    if (this.activeTimer) clearInterval(this.activeTimer);
    this.activeTimer = null;
    this.activeTimerSeconds = 0;
    const bar = document.getElementById("recipe-timer-bar");
    if (bar) bar.classList.add("hidden");
  }

  playTimerChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio fallback
    }
  }

  enterCookingMode(recipeId) {
    const recipe = recipeService.getRecipeById(recipeId);
    if (!recipe) return;

    const overlay = document.createElement("div");
    overlay.id = "cooking-mode-overlay";
    overlay.className = "cooking-mode-overlay p-6 sm:p-10 flex flex-col justify-between";

    let currentStepIdx = 0;

    const renderCookingStep = () => {
      const step = recipe.instructions[currentStepIdx];
      overlay.innerHTML = `
        <!-- Top Nav -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold uppercase tracking-wider">
              Cooking Mode
            </span>
            <span class="text-sm font-semibold text-slate-300 truncate max-w-xs sm:max-w-md">${recipe.title}</span>
          </div>

          <button onclick="window.app.exitCookingMode()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition">
            Exit <i class="fa-solid fa-xmark ml-1"></i>
          </button>
        </div>

        <!-- Main Step Display -->
        <div class="max-w-3xl mx-auto my-auto text-center space-y-6 py-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-2xl border border-orange-500/30">
            ${currentStepIdx + 1}
          </div>

          <h2 class="text-2xl sm:text-4xl font-extrabold text-white">
            ${step.title}
          </h2>

          <p class="text-lg sm:text-2xl text-slate-300 leading-relaxed font-light">
            ${step.description}
          </p>

          ${step.timerMinutes && step.timerMinutes > 0 ? `
            <div class="pt-4">
              <button
                onclick="window.app.startStepTimer(${step.timerMinutes}, '${step.title}')"
                class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-sm shadow-lg transition flex items-center gap-2 mx-auto"
              >
                <i class="fa-solid fa-stopwatch"></i> Start ${step.timerMinutes}-Minute Timer
              </button>
            </div>
          ` : ""}
        </div>

        <!-- Bottom Controls -->
        <div class="border-t border-slate-800 pt-4 flex items-center justify-between">
          <button
            id="cook-prev-btn"
            class="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold disabled:opacity-30 transition flex items-center gap-2"
            ${currentStepIdx === 0 ? "disabled" : ""}
          >
            <i class="fa-solid fa-chevron-left"></i> Previous Step
          </button>

          <span class="text-xs text-slate-400 font-mono">
            Step ${currentStepIdx + 1} of ${recipe.instructions.length}
          </span>

          <button
            id="cook-next-btn"
            class="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold disabled:opacity-30 transition flex items-center gap-2"
          >
            ${currentStepIdx === recipe.instructions.length - 1 ? 'Finish Cooking 🎉' : 'Next Step <i class="fa-solid fa-chevron-right"></i>'}
          </button>
        </div>
      `;

      const prevBtn = overlay.querySelector("#cook-prev-btn");
      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          if (currentStepIdx > 0) {
            currentStepIdx--;
            renderCookingStep();
          }
        });
      }

      const nextBtn = overlay.querySelector("#cook-next-btn");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          if (currentStepIdx < recipe.instructions.length - 1) {
            currentStepIdx++;
            renderCookingStep();
          } else {
            this.exitCookingMode();
            this.showToast("Congratulations on cooking this masterpiece! Bon Appétit 🍽️", "success");
          }
        });
      }
    };

    renderCookingStep();
    document.body.appendChild(overlay);
  }

  exitCookingMode() {
    const overlay = document.getElementById("cooking-mode-overlay");
    if (overlay) overlay.remove();
  }

  // ==========================================
  // AUTH MODAL & LOGINS
  // ==========================================
  openAuthModal(initialTab = "signin") {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop-click">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6" onclick="event.stopPropagation()">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center text-sm font-extrabold">S</span>
              <h3 class="text-xl font-bold font-serif text-slate-900">Welcome to Savoria</h3>
            </div>
            <button onclick="window.app.closeModals()" class="text-slate-400 hover:text-slate-600">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Tabs Switcher -->
          <div class="flex border-b border-slate-200">
            <button
              id="tab-signin-btn"
              onclick="window.app.switchAuthTab('signin')"
              class="flex-1 pb-3 text-sm font-bold text-center ${initialTab === 'signin' || initialTab === 'demo' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-400 hover:text-slate-600'}"
            >
              Sign In
            </button>
            <button
              id="tab-signup-btn"
              onclick="window.app.switchAuthTab('signup')"
              class="flex-1 pb-3 text-sm font-bold text-center ${initialTab === 'signup' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-400 hover:text-slate-600'}"
            >
              Create Account
            </button>
          </div>

          <!-- Sign In Form -->
          <div id="auth-signin-view" class="${initialTab === 'signup' ? 'hidden' : ''} space-y-4">
            <form id="signin-form" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="signin-email"
                  required
                  placeholder="chef@savoria.com"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  id="signin-password"
                  required
                  placeholder="••••••••"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <button type="submit" class="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow transition">
                Sign In
              </button>
            </form>

            <!-- Quick 1-Click Demo Accounts -->
            <div class="pt-3 border-t border-slate-100 space-y-2">
              <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                1-Click Quick Demo Sign-In:
              </span>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <button onclick="window.app.loginDemoUser(0)" class="p-2 border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition text-left flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" class="w-6 h-6 rounded-full object-cover">
                  <div class="truncate">
                    <p class="font-bold text-slate-800 text-[11px] truncate">Alex Rivera</p>
                    <p class="text-[10px] text-slate-400 truncate">Home Cook</p>
                  </div>
                </button>
                <button onclick="window.app.loginDemoUser(1)" class="p-2 border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition text-left flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=80&q=80" class="w-6 h-6 rounded-full object-cover">
                  <div class="truncate">
                    <p class="font-bold text-slate-800 text-[11px] truncate">Chef Isabella</p>
                    <p class="text-[10px] text-slate-400 truncate">Instructor</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Register Form -->
          <div id="auth-signup-view" class="${initialTab === 'signup' ? '' : 'hidden'} space-y-4">
            <form id="signup-form" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  id="signup-name"
                  required
                  placeholder="e.g. Jordan Smith"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  id="signup-email"
                  required
                  placeholder="jordan@example.com"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Password (min 6 chars) *</label>
                <input
                  type="password"
                  id="signup-password"
                  required
                  minlength="6"
                  placeholder="••••••••"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Culinary Interest / Role</label>
                <select id="signup-role" class="w-full border border-slate-200 rounded-xl p-2 text-xs bg-slate-50">
                  <option value="Enthusiastic Home Cook">Enthusiastic Home Cook</option>
                  <option value="Pastry & Baking Fanatic">Pastry & Baking Fanatic</option>
                  <option value="Plant-Based Cook">Plant-Based Cook</option>
                  <option value="Professional Chef">Professional Chef</option>
                </select>
              </div>

              <button type="submit" class="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow transition mt-2">
                Create Free Account
              </button>
            </form>
          </div>

        </div>
      </div>
    `;

    const signinForm = document.getElementById("signin-form");
    if (signinForm) {
      signinForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("signin-email").value;
        const pass = document.getElementById("signin-password").value;
        try {
          authService.login(email, pass);
          this.closeModals();
          this.showToast("Welcome back to Savoria!", "success");
        } catch (err) {
          this.showToast(err.message, "warning");
        }
      });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value;
        const email = document.getElementById("signup-email").value;
        const pass = document.getElementById("signup-password").value;
        const role = document.getElementById("signup-role").value;
        try {
          authService.register(name, email, pass, role);
          this.closeModals();
          this.showToast(`Welcome, Chef ${name}! Account created.`, "success");
        } catch (err) {
          this.showToast(err.message, "warning");
        }
      });
    }
  }

  switchAuthTab(tab) {
    const signinView = document.getElementById("auth-signin-view");
    const signupView = document.getElementById("auth-signup-view");
    const tabSignin = document.getElementById("tab-signin-btn");
    const tabSignup = document.getElementById("tab-signup-btn");

    if (!signinView || !signupView || !tabSignin || !tabSignup) return;

    if (tab === "signin") {
      if (signinView) signinView.classList.remove("hidden");
      if (signupView) signupView.classList.add("hidden");
      tabSignin.classList.add("text-orange-600", "border-b-2", "border-orange-600");
      tabSignin.classList.remove("text-slate-400");
      tabSignup.classList.remove("text-orange-600", "border-b-2", "border-orange-600");
      tabSignup.classList.add("text-slate-400");
    } else {
      if (signinView) signinView.classList.add("hidden");
      if (signupView) signupView.classList.remove("hidden");
      tabSignup.classList.add("text-orange-600", "border-b-2", "border-orange-600");
      tabSignup.classList.remove("text-slate-400");
      tabSignin.classList.remove("text-orange-600", "border-b-2", "border-orange-600");
      tabSignin.classList.add("text-slate-400");
    }
  }

  loginDemoUser(index) {
    try {
      const user = authService.loginWithDemo(index);
      this.closeModals();
      this.showToast(`Signed in as ${user.name}!`, "success");
    } catch (err) {
      this.showToast(err.message, "warning");
    }
  }

  closeModals() {
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
    if (window.location.hash.startsWith("#recipe/")) {
      window.location.hash = this.currentView || "home";
    }
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const bgColors = {
      success: "bg-emerald-600 text-white",
      info: "bg-slate-900 text-white",
      warning: "bg-amber-600 text-white"
    };

    const icons = {
      success: "fa-solid fa-circle-check",
      info: "fa-solid fa-bell",
      warning: "fa-solid fa-triangle-exclamation"
    };

    toast.className = `toast-msg flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-medium ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
      <i class="${icons[type] || icons.info}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate and expose globally
window.app = new App();
