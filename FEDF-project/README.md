# 🍳 Savoria — Community Food Recipe & Meal Planning Platform

A modern, feature-packed frontend web application designed for browsing, creating, organizing, and sharing culinary recipes, with smart pantry matching, interactive cooking timers, serving size scalers, personalized collections, weekly meal planning, and automated grocery lists.

Built with **HTML5, Tailwind CSS, JavaScript (ES6 Modules)** and configured for an effortless development experience in **Visual Studio Code**.

---

## 🌟 Key Features Overview

| Feature | Description |
| :--- | :--- |
| 🔍 **Multi-Criteria Search & Filtering** | Search recipes by name, ingredient, cuisine (*Italian, Mexican, Japanese, Indian, Thai, Mediterranean*), diet (*Vegan, Vegetarian, Gluten-Free, Keto, High-Protein*), meal type (*Breakfast, Lunch, Dinner, Dessert*), difficulty, and max cook time. |
| 🥦 **Pantry Match ("What's in my Fridge?")** | Input ingredients you currently have at home; Savoria matches recipes and calculates a **Pantry Match %**, highlighting what you have and what single ingredient you might be missing. |
| ⚖️ **Dynamic Servings Scaler** | Adjust servings (e.g. 2 → 4 → 8) with instant, mathematical re-calculation of all ingredient amounts in real time. |
| ⏱️ **Cooking Mode & Step Timers** | Interactive checkboxes for completed steps, countdown timers with audible sound alert chimes, and a fullscreen distraction-free **"Cooking Mode"**. |
| 📂 **Personalized Collections** | Default "Favorites ❤️" plus the ability to create custom collections (e.g., *Quick Dinners, Weekend Brunch, Holiday Baking*). |
| 📝 **Submit New Recipe** | A comprehensive recipe creator form with dynamic ingredient and instruction step adders, timer inputs, nutritional calculators, and instant publishing to the local catalog. |
| ⭐ **Community Ratings & Reviews** | Interactive 5-star rating submission and review feed with user avatars and timestamps. |
| 📅 **7-Day Meal Planner** | Plan breakfast, lunch, and dinner from Monday to Sunday. |
| 🛒 **Smart Grocery List** | Automatically aggregates all ingredients across recipes planned in your weekly schedule, grouped by store department (*Produce, Dairy, Meat, Bakery, Pantry*), with checkable items and custom additions. |
| 🔐 **Authentication System** | Dedicated standalone `auth.html` page + instant modal sign-in/up, persistent session storage, profile editor, and **1-click demo accounts**. |
| 🖨️ **Print-Ready Stylesheet** | Clean `@media print` formatting that prints clean recipe index cards and grocery checklists without web navigation bars. |

---

## 🚀 How to Run in Visual Studio Code

### Method 1: Instant 1-Click with Live Server (Recommended — Zero Setup)

1. Open **Visual Studio Code**.
2. Open the inner `FEDF-project` folder containing `index.html`.
3. Install the **Live Server** extension in VS Code (if not already installed, press `Ctrl + Shift + X` and search `Live Server`).
4. Right-click `index.html` in the file explorer and click **"Open with Live Server"**.
5. The application will launch in your browser at `http://127.0.0.1:5500/index.html`.

---

### Method 2: Modern Node.js / Vite Dev Server

1. Open the outer project folder in VS Code (the folder containing `.vscode` and the inner `FEDF-project` folder).
2. Open the built-in terminal by pressing `` Ctrl + ` ``.
3. Install dependencies and start the dev server:
   ```bash
   cd FEDF-project
   npm.cmd install
   npm.cmd run dev
   ```
4. Open the displayed local URL (typically `http://localhost:3000`).

---

### Method 3: 1-Click F5 Debugging in VS Code

The `.vscode/launch.json` Chrome profile opens `http://localhost:3000`. Start the Vite server using Method 2 first, then press `F5` and select **"Launch Chrome against localhost"**.

---

## 🔑 Demo Login Accounts

Both pages (`index.html` and `auth.html`) feature **1-click demo buttons** to test immediately:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Home Chef** | `demo@savoria.com` | `password123` | Curates collections, saves recipes, writes reviews |
| **Culinary Instructor** | `chef@savoria.com` | `chef123` | Verified chef badge, master recipes |

*You can also click **"Sign Up"** to create a custom profile anytime; account data is securely stored in your browser's `localStorage`.*

---

## 📂 Project Structure

```text
food-recipe-app/
├── .vscode/
│   ├── settings.json         # Workspace settings (Live Server, auto-formatting)
│   ├── launch.json           # 1-click F5 debug configurations for Chrome/Edge
│   └── extensions.json       # Recommended extensions (Live Server, Prettier)
├── css/
│   └── style.css             # Custom styles, animations, print stylesheet, cooking mode
├── js/
│   ├── data/
│   │   └── recipes.js        # 12 authentic curated recipes with nutritional data
│   ├── services/
│   │   ├── auth.js           # Account authentication & demo session manager
│   │   ├── recipeService.js  # Recipe queries, pantry matcher & review engine
│   │   ├── collectionService.js # User custom collections & bookmarks
│   │   └── mealPlannerService.js# 7-day meal schedule & smart grocery aggregation
│   └── app.js                # Core controller, client-side routing, modals & timers
├── index.html                # Main single-page application
├── auth.html                 # Dedicated standalone Sign In & Register page
├── package.json              # NPM scripts and devDependencies
├── vite.config.js            # Vite configuration for multi-page serving
└── README.md                 # Full project documentation
```

---

## 🛠️ Testing & Feature Checklist

- [x] **Browse Recipes**: Filter by cuisine (Italian, Mexican, Japanese, etc.) and tags (Gluten-Free, Keto, Vegan).
- [x] **Surprise Me**: Click "Surprise Me" in the hero banner to pick a random culinary delight.
- [x] **Ingredient Scaler**: Open any recipe, click `+` or `-` under Servings, and watch all quantities update.
- [x] **Cooking Timer**: Click "Start 10m Timer" on any step; hear the sound chime and see the countdown bar.
- [x] **Pantry Matcher**: Head to the "Pantry Match" tab, add items you have in your fridge, and see matching recipes ranked by percentage.
- [x] **Meal Planner & Grocery**: Add recipes to Monday/Tuesday slots and generate an auto-grouped grocery list by supermarket aisle.
- [x] **Custom Collections**: Create a collection like "Dinner Party" and bookmark recipes into it.
- [x] **Submit Recipe**: Fill out the recipe submission form with custom steps, timers, and publish instantly.
- [x] **Authentication**: Sign in with 1-click demo accounts or register your own chef profile.
