/**
 * Savoria Recipe Database
 * Comprehensive catalog of authentic global recipes with calibrated ingredients,
 * step-by-step instructions, nutritional data, and community reviews.
 */

export const INITIAL_RECIPES = [
  {
    id: "rec-1",
    title: "Creamy Tuscan Garlic Chicken",
    description: "Tender golden chicken breasts simmered in a velvety sun-dried tomato and baby spinach garlic cream sauce. An Italian classic ready in under 30 minutes.",
    cuisine: "Italian",
    mealType: "Dinner",
    diet: ["Gluten-Free", "High-Protein", "Keto-Friendly"],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    calories: 490,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Marco Bellini",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      role: "Italian Cuisine Specialist",
      verified: true
    },
    rating: 4.9,
    ratingCount: 184,
    tags: ["chicken", "garlic", "spinach", "sun-dried tomatoes", "cream", "parmesan", "quick dinner"],
    ingredients: [
      { name: "Chicken Breasts", quantity: 600, unit: "g", notes: "boneless, skinless, halved into cutlets" },
      { name: "Olive Oil", quantity: 2, unit: "tbsp", notes: "extra virgin" },
      { name: "Heavy Cream", quantity: 200, unit: "ml", notes: "or culinary cream" },
      { name: "Chicken Broth", quantity: 120, unit: "ml", notes: "low-sodium" },
      { name: "Garlic", quantity: 5, unit: "cloves", notes: "finely minced" },
      { name: "Sun-Dried Tomatoes", quantity: 80, unit: "g", notes: "drained and chopped" },
      { name: "Fresh Baby Spinach", quantity: 150, unit: "g", notes: "rinsed" },
      { name: "Parmesan Cheese", quantity: 60, unit: "g", notes: "freshly grated" },
      { name: "Italian Herb Seasoning", quantity: 1, unit: "tsp", notes: "dried oregano, basil & thyme" },
      { name: "Sea Salt & Black Pepper", quantity: 1, unit: "tsp", notes: "freshly cracked to taste" }
    ],
    instructions: [
      {
        step: 1,
        title: "Season and Sear Chicken",
        description: "Pat chicken cutlets dry with paper towels. Season both sides with salt, pepper, and Italian herbs. Heat 1 tbsp olive oil in a large skillet over medium-high heat. Sear chicken for 5 minutes per side until golden brown and cooked through (165°F / 74°C internal). Transfer to a warm plate.",
        timerMinutes: 10
      },
      {
        step: 2,
        title: "Sauté Aromatics",
        description: "In the same skillet over medium heat, add the remaining 1 tbsp olive oil. Add minced garlic and chopped sun-dried tomatoes. Sauté for 1-2 minutes until intensely fragrant, scraping up browned fond from the bottom.",
        timerMinutes: 2
      },
      {
        step: 3,
        title: "Create Velvety Cream Sauce",
        description: "Pour in the chicken broth and heavy cream. Bring to a gentle bubble, then turn heat down to low. Whisk in grated Parmesan cheese until smoothly incorporated and lightly thickened.",
        timerMinutes: 3
      },
      {
        step: 4,
        title: "Wilt Spinach and Combine",
        description: "Toss in the baby spinach leaves. Stir gently until wilted, about 2 minutes. Nest chicken cutlets back into the pan, spooning rich cream sauce over each piece to coat thoroughly.",
        timerMinutes: 3
      },
      {
        step: 5,
        title: "Garnish and Plate",
        description: "Remove from heat. Garnish with additional freshly grated Parmesan and fresh basil leaves. Serve warm alongside buttered pasta, garlic mash, or roasted asparagus.",
        timerMinutes: 0
      }
    ],
    nutrition: {
      calories: 490,
      protein: 48,
      carbs: 8,
      fat: 30,
      fiber: 2
    },
    reviews: [
      {
        id: "rev-101",
        userName: "Sophia Miller",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "3 days ago",
        comment: "This recipe is restaurant quality! The sauce was so rich and flavorful. Served it with tagliatelle and my family wiped the plates clean."
      },
      {
        id: "rev-102",
        userName: "David Kim",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "1 week ago",
        comment: "Amazingly quick for a weeknight dinner. The sun-dried tomatoes give it a perfect tangy balance against the rich cream."
      }
    ]
  },
  {
    id: "rec-2",
    title: "Artisanal Avocado Toast with Soft-Poached Eggs",
    description: "Crispy grilled sourdough slices layered with creamy seasoned Hass avocado, heirloom cherry tomatoes, soft-poached runny eggs, microgreens, and chili flakes.",
    cuisine: "American",
    mealType: "Breakfast",
    diet: ["Vegetarian", "Healthy", "High-Protein"],
    prepTime: 8,
    cookTime: 7,
    servings: 2,
    difficulty: "Easy",
    calories: 360,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Chloe Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Brunch Stylist",
      verified: true
    },
    rating: 4.8,
    ratingCount: 135,
    tags: ["avocado", "eggs", "sourdough", "breakfast", "brunch", "healthy", "quick"],
    ingredients: [
      { name: "Sourdough Bread Slices", quantity: 2, unit: "slices", notes: "thick-cut, rustic" },
      { name: "Ripe Hass Avocados", quantity: 2, unit: "medium", notes: "peeled and pitted" },
      { name: "Fresh Farm Eggs", quantity: 2, unit: "large" },
      { name: "Heirloom Cherry Tomatoes", quantity: 8, unit: "pieces", notes: "halved" },
      { name: "Fresh Lime Juice", quantity: 1, unit: "tbsp" },
      { name: "Extra Virgin Olive Oil", quantity: 1, unit: "tbsp" },
      { name: "Red Chili Flakes", quantity: 0.5, unit: "tsp" },
      { name: "Everything Bagel Seasoning", quantity: 1, unit: "tsp" },
      { name: "Microgreens or Arugula", quantity: 20, unit: "g", notes: "for garnish" },
      { name: "Flaky Sea Salt", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      {
        step: 1,
        title: "Toast Sourdough",
        description: "Brush sourdough slices lightly with olive oil. Toast in a hot cast-iron skillet or toaster until deeply golden with crisp edges.",
        timerMinutes: 3
      },
      {
        step: 2,
        title: "Prepare Creamy Avocado Mash",
        description: "In a bowl, combine avocado pulp, lime juice, a drizzle of olive oil, salt, and black pepper. Mash with a fork, leaving slight texture rather than pureeing.",
        timerMinutes: 2
      },
      {
        step: 3,
        title: "Poach the Eggs",
        description: "Bring a small pot of water with 1 tbsp vinegar to a gentle simmer. Create a vortex with a spoon and gently slide in cracked eggs. Poach for 3 minutes for glorious runny yolks.",
        timerMinutes: 3
      },
      {
        step: 4,
        title: "Assemble and Garnish",
        description: "Generously spread avocado mash over toasted sourdough. Top with halved cherry tomatoes and poached eggs. Sprinkle with chili flakes, everything bagel seasoning, and microgreens.",
        timerMinutes: 1
      }
    ],
    nutrition: {
      calories: 360,
      protein: 15,
      carbs: 28,
      fat: 22,
      fiber: 9
    },
    reviews: [
      {
        id: "rev-201",
        userName: "Oliver Sterling",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "Yesterday",
        comment: "The vortex poaching trick worked like magic on my first try! A cafe-level breakfast right at home."
      }
    ]
  },
  {
    id: "rec-3",
    title: "Authentic Tokyo Shoyu Ramen",
    description: "Rich and clear aromatic soy-dashi broth served over springy ramen noodles, topped with tender chashu pork slices, marinated ajitsuke tamago egg, nori, and scallions.",
    cuisine: "Japanese",
    mealType: "Dinner",
    diet: ["Dairy-Free"],
    prepTime: 25,
    cookTime: 40,
    servings: 2,
    difficulty: "Medium",
    calories: 620,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Kenji Sato",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      role: "Tokyo Noodle Master",
      verified: true
    },
    rating: 4.95,
    ratingCount: 210,
    tags: ["ramen", "noodles", "japanese", "soup", "pork", "shoyu", "comfort food"],
    ingredients: [
      { name: "Fresh Ramen Noodles", quantity: 260, unit: "g" },
      { name: "Rich Chicken or Pork Broth", quantity: 800, unit: "ml" },
      { name: "Japanese Soy Sauce (Shoyu)", quantity: 4, unit: "tbsp" },
      { name: "Mirin (Japanese Sweet Rice Wine)", quantity: 2, unit: "tbsp" },
      { name: "Sesame Oil", quantity: 1, unit: "tbsp", notes: "toasted" },
      { name: "Fresh Ginger", quantity: 15, unit: "g", notes: "thinly sliced" },
      { name: "Garlic", quantity: 3, unit: "cloves", notes: "crushed" },
      { name: "Chashu Pork Slices", quantity: 4, unit: "slices", notes: "or grilled chicken slices" },
      { name: "Soft-Boiled Marinated Ramen Eggs", quantity: 2, unit: "pieces", notes: "halved" },
      { name: "Green Scallions", quantity: 3, unit: "stalks", notes: "finely chopped" },
      { name: "Crispy Nori Seaweed Sheets", quantity: 2, unit: "squares" },
      { name: "Bamboo Shoots (Menma)", quantity: 40, unit: "g" }
    ],
    instructions: [
      {
        step: 1,
        title: "Infuse the Shoyu Tare & Broth",
        description: "In a saucepan, combine chicken broth, soy sauce, mirin, sesame oil, sliced ginger, and crushed garlic. Simmer gently for 20 minutes to meld flavors, then strain out solids.",
        timerMinutes: 20
      },
      {
        step: 2,
        title: "Boil Ramen Noodles",
        description: "Bring a large pot of unsalted water to a rolling boil. Drop fresh ramen noodles in and cook for 90 to 120 seconds until al dente. Drain thoroughly.",
        timerMinutes: 2
      },
      {
        step: 3,
        title: "Warm Meat and Assemble Bowls",
        description: "Quickly sear or torch chashu pork slices in a hot skillet for 1 minute until fragrant and lightly caramelized.",
        timerMinutes: 1
      },
      {
        step: 4,
        title: "Plating the Ramen",
        description: "Divide steaming broth between two deep ramen bowls. Fold noodles into the soup with chopsticks. Top with chashu pork, halved marinated egg, menma bamboo shoots, scallions, and nori sheet.",
        timerMinutes: 2
      }
    ],
    nutrition: {
      calories: 620,
      protein: 34,
      carbs: 68,
      fat: 22,
      fiber: 4
    },
    reviews: [
      {
        id: "rev-301",
        userName: "Hannah Leigh",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "5 days ago",
        comment: "Tastes like you flew straight to Shinjuku! The aroma of that tare broth will make your entire kitchen smell heavenly."
      }
    ]
  },
  {
    id: "rec-4",
    title: "Royal Paneer Butter Masala",
    description: "Cubes of tender cottage cheese simmered in a velvety, buttery tomato-cashew makhani gravy infused with aromatic spices, kasuri methi, and cream.",
    cuisine: "Indian",
    mealType: "Dinner",
    diet: ["Vegetarian", "Gluten-Free"],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    calories: 460,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Rajesh Sharma",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      role: "Traditional North Indian Cook",
      verified: true
    },
    rating: 4.9,
    ratingCount: 240,
    tags: ["paneer", "indian", "curry", "butter masala", "vegetarian", "gluten-free", "comfort food"],
    ingredients: [
      { name: "Fresh Paneer (Cottage Cheese)", quantity: 400, unit: "g", notes: "cut into 1-inch cubes" },
      { name: "Ripe Red Tomatoes", quantity: 5, unit: "large", notes: "roughly chopped" },
      { name: "Raw Cashews", quantity: 25, unit: "g", notes: "soaked in warm water" },
      { name: "Butter (Amul style)", quantity: 40, unit: "g" },
      { name: "Fresh Cream", quantity: 60, unit: "ml" },
      { name: "Ginger-Garlic Paste", quantity: 1.5, unit: "tbsp" },
      { name: "Kashmiri Red Chili Powder", quantity: 1, unit: "tbsp", notes: "for rich color and mild heat" },
      { name: "Garam Masala", quantity: 1, unit: "tsp" },
      { name: "Kasuri Methi (Dried Fenugreek Leaves)", quantity: 1, unit: "tbsp", notes: "crushed between palms" },
      { name: "Whole Cardamom & Cinnamon Stick", quantity: 1, unit: "mix", notes: "2 green cardamom, 1 stick" },
      { name: "Sugar or Honey", quantity: 0.5, unit: "tsp", notes: "to balance acidity" }
    ],
    instructions: [
      {
        step: 1,
        title: "Cook Tomato-Cashew Base",
        description: "In a saucepan, add chopped tomatoes, soaked cashews, 1 cup water, and whole cardamom & cinnamon. Simmer for 12 minutes until tomatoes are soft. Cool and blend into a silk-smooth puree.",
        timerMinutes: 12
      },
      {
        step: 2,
        title: "Temper Spices and Sauté Gravy",
        description: "Melt 2 tbsp butter in a kadai / deep pan. Add ginger-garlic paste and sauté for 1 minute. Add Kashmiri chili powder and immediately pour in the blended tomato-cashew puree. Cook for 8 minutes until butter begins to separate.",
        timerMinutes: 8
      },
      {
        step: 3,
        title: "Add Cream and Paneer",
        description: "Stir in fresh cream, garam masala, crushed kasuri methi, and salt with a pinch of sugar. Gently fold in the paneer cubes. Simmer on low for 4-5 minutes so the cheese absorbs flavor.",
        timerMinutes: 5
      },
      {
        step: 4,
        title: "Finishing Touch",
        description: "Finish with a dollop of butter and a swirl of cream. Serve hot with garlic naan or fragrant jeera rice.",
        timerMinutes: 0
      }
    ],
    nutrition: {
      calories: 460,
      protein: 19,
      carbs: 16,
      fat: 36,
      fiber: 3
    },
    reviews: [
      {
        id: "rev-401",
        userName: "Ananya Patel",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "4 days ago",
        comment: "This tastes identical to high-end Punjabi restaurants! The kasuri methi fragrance is the secret sauce."
      }
    ]
  },
  {
    id: "rec-5",
    title: "Mediterranean Quinoa & Chickpea Super Bowl",
    description: "A nourishing power bowl with fluffy rainbow quinoa, spiced crisp chickpeas, crunchy Persian cucumbers, Kalamata olives, creamy feta, and vibrant lemon-herb vinaigrette.",
    cuisine: "Mediterranean",
    mealType: "Lunch",
    diet: ["Vegetarian", "Gluten-Free", "High-Fiber", "Healthy"],
    prepTime: 12,
    cookTime: 15,
    servings: 3,
    difficulty: "Easy",
    calories: 410,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Lea Dupont",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      role: "Holistic Nutritionist",
      verified: true
    },
    rating: 4.85,
    ratingCount: 168,
    tags: ["quinoa", "chickpeas", "salad", "mediterranean", "healthy", "vegan-option", "meal prep"],
    ingredients: [
      { name: "Tri-Color Quinoa", quantity: 180, unit: "g", notes: "rinsed" },
      { name: "Cooked Chickpeas", quantity: 240, unit: "g", notes: "rinsed and dried" },
      { name: "Persian Cucumbers", quantity: 2, unit: "medium", notes: "diced" },
      { name: "Cherry Tomatoes", quantity: 150, unit: "g", notes: "halved" },
      { name: "Kalamata Olives", quantity: 60, unit: "g", notes: "pitted and sliced" },
      { name: "Crumbled Feta Cheese", quantity: 70, unit: "g" },
      { name: "Fresh Parsley & Mint", quantity: 30, unit: "g", notes: "finely chopped" },
      { name: "Extra Virgin Olive Oil", quantity: 3, unit: "tbsp" },
      { name: "Fresh Lemon Juice", quantity: 2, unit: "tbsp" },
      { name: "Ground Cumin & Paprika", quantity: 1, unit: "tsp", notes: "for roasting chickpeas" }
    ],
    instructions: [
      {
        step: 1,
        title: "Cook Fluffy Quinoa",
        description: "Combine quinoa with 360ml water and pinch of salt in a saucepan. Bring to boil, cover, and simmer for 15 minutes. Remove from heat and let steam covered 5 minutes, then fluff with fork.",
        timerMinutes: 15
      },
      {
        step: 2,
        title: "Pan-Roast Spiced Chickpeas",
        description: "Heat 1 tbsp olive oil in a skillet over medium-high. Add chickpeas with cumin, paprika, salt, and pepper. Sauté for 6-8 minutes until golden and crisp.",
        timerMinutes: 8
      },
      {
        step: 3,
        title: "Whisk Citrus Dressing",
        description: "In a small mason jar, shake remaining olive oil, lemon juice, minced garlic, dried oregano, salt, and pepper until emulsified.",
        timerMinutes: 2
      },
      {
        step: 4,
        title: "Assemble Bowls",
        description: "Layer fluffy quinoa at the base of meal bowls. Arrange spiced chickpeas, cucumber, cherry tomatoes, olives, and herbs in neat sections. Top with crumbled feta and drizzle dressing.",
        timerMinutes: 2
      }
    ],
    nutrition: {
      calories: 410,
      protein: 16,
      carbs: 52,
      fat: 17,
      fiber: 11
    },
    reviews: [
      {
        id: "rev-501",
        userName: "Marcus Thorne",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "2 days ago",
        comment: "Perfect for Sunday meal prep! Kept in mason jars for 4 days and stayed super crisp and delicious."
      }
    ]
  },
  {
    id: "rec-6",
    title: "Fresh Baja Fish Tacos with Zesty Lime Crema",
    description: "Crispy spice-crusted white fish tucked into warm corn tortillas with shredded purple cabbage, avocado slices, pickled red onions, and homemade cilantro-lime crema.",
    cuisine: "Mexican",
    mealType: "Lunch",
    diet: ["Dairy-Free-Option", "High-Protein", "Pescatarian"],
    prepTime: 15,
    cookTime: 10,
    servings: 3,
    difficulty: "Easy",
    calories: 380,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Carlos Mendez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "Baja Street Food Pioneer",
      verified: true
    },
    rating: 4.88,
    ratingCount: 195,
    tags: ["tacos", "fish", "mexican", "baja", "seafood", "quick", "street food"],
    ingredients: [
      { name: "White Fish Fillets (Cod or Halibut)", quantity: 450, unit: "g", notes: "cut into taco-sized strips" },
      { name: "Corn Tortillas", quantity: 6, unit: "pieces", notes: "warmed" },
      { name: "Purple Cabbage", quantity: 150, unit: "g", notes: "finely shredded" },
      { name: "Mexican Crema or Sour Cream", quantity: 80, unit: "g" },
      { name: "Fresh Cilantro", quantity: 20, unit: "g", notes: "chopped" },
      { name: "Fresh Limes", quantity: 2, unit: "whole", notes: "juiced and wedged" },
      { name: "Chili Powder & Cumin", quantity: 1, unit: "tbsp", notes: "equal parts" },
      { name: "Garlic Powder", quantity: 1, unit: "tsp" },
      { name: "Avocado", quantity: 1, unit: "sliced" },
      { name: "Pickled Jalapeños & Red Onions", quantity: 40, unit: "g", notes: "for garnish" }
    ],
    instructions: [
      {
        step: 1,
        title: "Season Fish",
        description: "Pat fish dry. Rub with chili powder, cumin, garlic powder, salt, and black pepper.",
        timerMinutes: 3
      },
      {
        step: 2,
        title: "Whisk Lime Crema",
        description: "Stir crema, fresh lime juice, chopped cilantro, and a pinch of salt together in a small bowl until silky.",
        timerMinutes: 2
      },
      {
        step: 3,
        title: "Pan Sear Fish",
        description: "Heat 1 tbsp oil in a skillet over medium-high heat. Sear fish strips for 3-4 minutes per side until golden, lightly flaky, and tender.",
        timerMinutes: 7
      },
      {
        step: 4,
        title: "Warm Tortillas & Build Tacos",
        description: "Warm corn tortillas over open flame or in a skillet for 20 seconds. Fill with shredded cabbage, seared fish, avocado slices, pickled onions, and generous drizzles of lime crema.",
        timerMinutes: 3
      }
    ],
    nutrition: {
      calories: 380,
      protein: 32,
      carbs: 34,
      fat: 14,
      fiber: 6
    },
    reviews: [
      {
        id: "rev-601",
        userName: "Elena Rodriguez",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "3 days ago",
        comment: "Brought back fond memories of eating fish tacos right on the beach in Ensenada. The lime crema is addictive!"
      }
    ]
  },
  {
    id: "rec-7",
    title: "Sheet-Pan Lemon Garlic Salmon & Asparagus",
    description: "Wild Alaskan salmon fillets roasted on a single sheet pan with crisp asparagus spears, garlic herb butter, and lemon wheels. A 20-minute keto dream with zero cleanup.",
    cuisine: "Mediterranean",
    mealType: "Dinner",
    diet: ["Keto-Friendly", "Gluten-Free", "Low-Carb", "Pescatarian"],
    prepTime: 8,
    cookTime: 14,
    servings: 2,
    difficulty: "Easy",
    calories: 420,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Lea Dupont",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      role: "Holistic Nutritionist",
      verified: true
    },
    rating: 4.92,
    ratingCount: 156,
    tags: ["salmon", "asparagus", "keto", "low-carb", "sheet pan", "quick", "dinner"],
    ingredients: [
      { name: "Salmon Fillets", quantity: 380, unit: "g", notes: "skin-on, 2 fillets" },
      { name: "Fresh Asparagus", quantity: 300, unit: "g", notes: "woody ends snapped off" },
      { name: "Melted Butter", quantity: 2, unit: "tbsp" },
      { name: "Garlic Cloves", quantity: 3, unit: "cloves", notes: "minced" },
      { name: "Fresh Lemon", quantity: 1, unit: "sliced into rounds" },
      { name: "Fresh Dill", quantity: 15, unit: "g", notes: "chopped" },
      { name: "Olive Oil", quantity: 1, unit: "tbsp" },
      { name: "Coarse Sea Salt & Lemon Pepper", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      {
        step: 1,
        title: "Preheat Oven and Prep Tray",
        description: "Preheat oven to 400°F (200°C). Line a large rimmed baking sheet with parchment paper.",
        timerMinutes: 5
      },
      {
        step: 2,
        title: "Arrange Salmon and Asparagus",
        description: "Place salmon fillets center-stage on the sheet pan. Scatter trimmed asparagus around fillets. Toss asparagus in 1 tbsp olive oil, salt, and pepper.",
        timerMinutes: 2
      },
      {
        step: 3,
        title: "Baste with Garlic Butter",
        description: "Whisk melted butter, minced garlic, and chopped dill. Brush liberally over the salmon fillets. Top each fillet with thin lemon rounds.",
        timerMinutes: 2
      },
      {
        step: 4,
        title: "Roast to Perfection",
        description: "Bake for 12-14 minutes until salmon flakes effortlessly with a fork and asparagus is tender-crisp. Broil for 1 minute for light charring.",
        timerMinutes: 14
      }
    ],
    nutrition: {
      calories: 420,
      protein: 42,
      carbs: 6,
      fat: 26,
      fiber: 3
    },
    reviews: [
      {
        id: "rev-701",
        userName: "Brad Stevens",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "6 days ago",
        comment: "This has become our Wednesday staple. Unbelievably juicy salmon and one single pan to wash!"
      }
    ]
  },
  {
    id: "rec-8",
    title: "Aromatic Thai Green Curry with Jasmine Rice",
    description: "An authentic, fragrant coconut curry loaded with tender chicken or tofu, Thai eggplants, bamboo shoots, and fresh Thai holy basil in a vibrant lemongrass paste.",
    cuisine: "Thai",
    mealType: "Dinner",
    diet: ["Gluten-Free", "Dairy-Free"],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    calories: 510,
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Somchai Prasert",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      role: "Bangkok Culinary Ambassador",
      verified: true
    },
    rating: 4.87,
    ratingCount: 172,
    tags: ["thai", "curry", "green curry", "coconut", "asian", "spicy", "gluten-free"],
    ingredients: [
      { name: "Chicken Thighs or Firm Tofu", quantity: 500, unit: "g", notes: "cut into bite-sized strips" },
      { name: "Full-Fat Coconut Milk", quantity: 400, unit: "ml", notes: "canned" },
      { name: "Authentic Thai Green Curry Paste", quantity: 3, unit: "tbsp" },
      { name: "Thai Eggplants or Zucchini", quantity: 150, unit: "g", notes: "quartered" },
      { name: "Bamboo Shoots", quantity: 100, unit: "g", notes: "sliced" },
      { name: "Fish Sauce (or Tamari)", quantity: 2, unit: "tbsp" },
      { name: "Palm Sugar or Brown Sugar", quantity: 1, unit: "tbsp" },
      { name: "Kaffir Lime Leaves", quantity: 4, unit: "leaves", notes: "torn" },
      { name: "Thai Sweet Basil (Horapa)", quantity: 30, unit: "g", notes: "fresh leaves" },
      { name: "Steamed Jasmine Rice", quantity: 4, unit: "cups", notes: "for serving" }
    ],
    instructions: [
      {
        step: 1,
        title: "Crack Coconut Cream",
        description: "Scoop the thick top layer of coconut cream (about 100ml) into a hot wok. Fry over medium heat until the coconut oil separates and bubbles.",
        timerMinutes: 4
      },
      {
        step: 2,
        title: "Sizzle Curry Paste",
        description: "Add green curry paste into the cracked cream. Stir-fry for 2-3 minutes until pungent and aromatic oil glistens.",
        timerMinutes: 3
      },
      {
        step: 3,
        title: "Cook Protein & Simmer",
        description: "Add chicken or tofu strips. Stir until coated and half cooked. Pour in remaining coconut milk, 100ml water, and torn kaffir lime leaves. Bring to gentle simmer.",
        timerMinutes: 5
      },
      {
        step: 4,
        title: "Add Vegetables and Season",
        description: "Add eggplants and bamboo shoots. Season with fish sauce and palm sugar. Cook 6-8 minutes until vegetables are tender.",
        timerMinutes: 7
      },
      {
        step: 5,
        title: "Infuse Basil and Serve",
        description: "Turn off heat, immediately stir in fresh Thai basil leaves to wilt. Serve piping hot with warm jasmine rice.",
        timerMinutes: 1
      }
    ],
    nutrition: {
      calories: 510,
      protein: 36,
      carbs: 45,
      fat: 22,
      fiber: 4
    },
    reviews: [
      {
        id: "rev-801",
        userName: "Maya Lin",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "1 week ago",
        comment: "Cracking the coconut cream makes all the difference! Smells like a night market in Chiang Mai."
      }
    ]
  },
  {
    id: "rec-9",
    title: "Tropical Açai & Wild Berry Smoothie Bowl",
    description: "Thick, frosty organic açai blend crowned with sliced strawberries, wild blueberries, banana coins, toasted coconut flakes, chia seeds, and artisan granola.",
    cuisine: "Brazilian",
    mealType: "Breakfast",
    diet: ["Vegan", "Dairy-Free", "Healthy", "Plant-Based"],
    prepTime: 7,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    calories: 320,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Chloe Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Brunch Stylist",
      verified: true
    },
    rating: 4.86,
    ratingCount: 112,
    tags: ["acai", "smoothie bowl", "breakfast", "vegan", "raw", "berries", "superfood"],
    ingredients: [
      { name: "Frozen Pure Açai Packet", quantity: 100, unit: "g", notes: "unsweetened" },
      { name: "Frozen Wild Berries", quantity: 120, unit: "g" },
      { name: "Frozen Ripe Banana", quantity: 1, unit: "medium" },
      { name: "Almond or Oat Milk", quantity: 60, unit: "ml", notes: "keep liquid minimal for thickness" },
      { name: "Fresh Strawberries", quantity: 4, unit: "sliced" },
      { name: "Crunchy Granola", quantity: 30, unit: "g" },
      { name: "Chia Seeds", quantity: 1, unit: "tsp" },
      { name: "Toasted Coconut Flakes", quantity: 1, unit: "tbsp" },
      { name: "Pure Maple Syrup or Agave", quantity: 1, unit: "tsp", notes: "optional" }
    ],
    instructions: [
      {
        step: 1,
        title: "Blend Smoothie Base",
        description: "Break frozen açai packet into high-speed blender. Add frozen berries, frozen banana, and splash of milk. Blend on low, using tamper to push down until smooth and sorbet-like.",
        timerMinutes: 3
      },
      {
        step: 2,
        title: "Pour into Chilled Bowl",
        description: "Spoon thick açai base into a chilled serving bowl. Smooth top surface with a spatula.",
        timerMinutes: 1
      },
      {
        step: 3,
        title: "Artistic Fruit & Seed Topping",
        description: "Arrange lines of sliced strawberries, blueberries, crunchy granola, chia seeds, and toasted coconut flakes across the top. Serve immediately with a spoon.",
        timerMinutes: 3
      }
    ],
    nutrition: {
      calories: 320,
      protein: 7,
      carbs: 58,
      fat: 9,
      fiber: 12
    },
    reviews: [
      {
        id: "rev-901",
        userName: "Zoe Kravitz",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "3 days ago",
        comment: "So thick it eats like ice cream! High fiber and keeps me energized until lunch."
      }
    ]
  },
  {
    id: "rec-10",
    title: "Classic New York Style Baked Cheesecake",
    description: "An ultra-creamy, velvety baked cheesecake with a buttery Graham cracker crust, kissed with Madagascar vanilla bean and a fresh raspberry coulis glaze.",
    cuisine: "American",
    mealType: "Dessert",
    diet: ["Vegetarian"],
    prepTime: 25,
    cookTime: 65,
    servings: 10,
    difficulty: "Medium",
    calories: 480,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Marco Bellini",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      role: "Pastry & Baking Specialist",
      verified: true
    },
    rating: 4.96,
    ratingCount: 310,
    tags: ["cheesecake", "dessert", "baking", "sweet", "cream cheese", "celebration"],
    ingredients: [
      { name: "Graham Cracker Crumbs", quantity: 200, unit: "g" },
      { name: "Melted Unsalted Butter", quantity: 75, unit: "g" },
      { name: "Full-Fat Cream Cheese (room temp)", quantity: 900, unit: "g" },
      { name: "Granulated Sugar", quantity: 220, unit: "g" },
      { name: "Sour Cream", quantity: 200, unit: "g" },
      { name: "Large Eggs (room temp)", quantity: 4, unit: "pieces" },
      { name: "Pure Vanilla Extract", quantity: 2, unit: "tsp" },
      { name: "Fresh Lemon Zest", quantity: 1, unit: "tsp" },
      { name: "Fresh Raspberries", quantity: 150, unit: "g", notes: "for topping" }
    ],
    instructions: [
      {
        step: 1,
        title: "Prepare Graham Crust",
        description: "Mix graham cracker crumbs, melted butter, and 2 tbsp sugar. Press firmly into bottom of a 9-inch springform pan. Bake at 350°F (175°C) for 10 minutes, then let cool completely.",
        timerMinutes: 10
      },
      {
        step: 2,
        title: "Whip Silky Cheese Batter",
        description: "Beat softened cream cheese and sugar on medium-low speed until creamy and smooth (don't overbeat to avoid excess air). Blend in sour cream, vanilla, and lemon zest.",
        timerMinutes: 5
      },
      {
        step: 3,
        title: "Incorporate Eggs",
        description: "Add eggs one by one on low speed, mixing just until each egg disappears into the silky batter.",
        timerMinutes: 3
      },
      {
        step: 4,
        title: "Water Bath Bake",
        description: "Wrap pan exterior with heavy-duty foil. Place in a roasting pan filled with 1 inch hot water. Bake at 325°F (160°C) for 60-70 minutes until edges are set with a slight center wobble.",
        timerMinutes: 65
      },
      {
        step: 5,
        title: "Slow Cool and Chill",
        description: "Turn off oven, prop door ajar with a wooden spoon, and let cool for 1 hour. Chill in refrigerator for at least 6 hours (or overnight) before slicing.",
        timerMinutes: 60
      }
    ],
    nutrition: {
      calories: 480,
      protein: 8,
      carbs: 38,
      fat: 33,
      fiber: 1
    },
    reviews: [
      {
        id: "rev-1001",
        userName: "Jessica Reed",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "1 week ago",
        comment: "Zero cracks on top! The water bath and slow cooling advice worked wonders. Everyone asked for the recipe."
      }
    ]
  },
  {
    id: "rec-11",
    title: "Wild Mushroom & Truffle Cream Tagliatelle",
    description: "Silky handcrafted tagliatelle pasta tossed in a luxurious brown butter and white truffle cream with caramelized cremini, shiitake, and fresh thyme.",
    cuisine: "Italian",
    mealType: "Dinner",
    diet: ["Vegetarian"],
    prepTime: 12,
    cookTime: 18,
    servings: 3,
    difficulty: "Medium",
    calories: 540,
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Marco Bellini",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      role: "Italian Cuisine Specialist",
      verified: true
    },
    rating: 4.93,
    ratingCount: 164,
    tags: ["pasta", "mushroom", "truffle", "italian", "dinner", "vegetarian", "gourmet"],
    ingredients: [
      { name: "Egg Tagliatelle or Fettuccine", quantity: 300, unit: "g" },
      { name: "Mixed Wild Mushrooms (Shiitake, Cremini)", quantity: 350, unit: "g", notes: "sliced" },
      { name: "Shallots", quantity: 2, unit: "medium", notes: "finely minced" },
      { name: "Garlic Cloves", quantity: 3, unit: "cloves", notes: "thinly sliced" },
      { name: "Unsalted Butter", quantity: 40, unit: "g" },
      { name: "Heavy Cream", quantity: 180, unit: "ml" },
      { name: "White Truffle Oil", quantity: 1.5, unit: "tsp", notes: "high quality finishing oil" },
      { name: "Parmigiano-Reggiano", quantity: 50, unit: "g", notes: "freshly microplaned" },
      { name: "Fresh Thyme Sprigs", quantity: 4, unit: "sprigs", notes: "leaves picked" },
      { name: "Dry White Wine", quantity: 60, unit: "ml", notes: "Pinot Grigio or Sauvignon Blanc" }
    ],
    instructions: [
      {
        step: 1,
        title: "Caramelize Mushrooms",
        description: "Melt 2 tbsp butter in a wide skillet over high heat. Add mushrooms in a single layer without crowding. Cook undisturbed for 4 minutes until deeply browned, then stir in shallots, garlic, and fresh thyme.",
        timerMinutes: 6
      },
      {
        step: 2,
        title: "Deglaze and Simmer Cream",
        description: "Pour in dry white wine to deglaze, scraping golden browned bits. Reduce wine by half. Pour in heavy cream, bring to gentle simmer, and reduce heat.",
        timerMinutes: 4
      },
      {
        step: 3,
        title: "Cook Pasta Al Dente",
        description: "Boil tagliatelle in heavily salted water for 6-8 minutes until al dente. Reserve 1/2 cup of starchy pasta cooking water before draining.",
        timerMinutes: 7
      },
      {
        step: 4,
        title: "Mantecatura (Emulsify)",
        description: "Toss pasta directly into the mushroom cream. Add grated Parmigiano and a splash of reserved pasta water. Toss vigorously until a glossy coating forms. Drizzle white truffle oil and serve immediately.",
        timerMinutes: 2
      }
    ],
    nutrition: {
      calories: 540,
      protein: 17,
      carbs: 64,
      fat: 25,
      fiber: 4
    },
    reviews: [
      {
        id: "rev-1101",
        userName: "Claire Delacroix",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "2 weeks ago",
        comment: "Earthly, deeply satisfying, and pure culinary decadence. That finishing touch of truffle oil elevates it to five stars!"
      }
    ]
  },
  {
    id: "rec-12",
    title: "Golden Crispy Falafel Mezze Platter",
    description: "Crunchy herbaceous chickpea fritters seasoned with fresh coriander, parsley, cumin, and garlic, served with creamy tahini dip, warm pita, and sumac onions.",
    cuisine: "Middle Eastern",
    mealType: "Lunch",
    diet: ["Vegan", "Dairy-Free", "High-Fiber", "Plant-Based"],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    calories: 390,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Chef Carlos Mendez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "Street Food Pioneer",
      verified: true
    },
    rating: 4.89,
    ratingCount: 148,
    tags: ["falafel", "middle eastern", "vegan", "mezze", "tahini", "plant based"],
    ingredients: [
      { name: "Dried Chickpeas (soaked overnight)", quantity: 300, unit: "g", notes: "do not use canned" },
      { name: "Fresh Parsley & Cilantro", quantity: 60, unit: "g", notes: "large bunch" },
      { name: "Onion", quantity: 1, unit: "medium", notes: "chopped" },
      { name: "Garlic Cloves", quantity: 4, unit: "cloves" },
      { name: "Ground Cumin & Coriander", quantity: 1.5, unit: "tbsp", notes: "toasted" },
      { name: "Baking Powder", quantity: 1, unit: "tsp" },
      { name: "Sesame Seeds", quantity: 2, unit: "tbsp" },
      { name: "High-Heat Frying Oil", quantity: 500, unit: "ml" },
      { name: "Tahini Paste", quantity: 80, unit: "g" },
      { name: "Warm Pita Breads", quantity: 4, unit: "loaves" }
    ],
    instructions: [
      {
        step: 1,
        title: "Pulse Herb & Chickpea Mixture",
        description: "Pulse drained soaked chickpeas, herbs, onion, garlic, spices, salt, and baking powder in food processor until gritty meal texture (not puree). Chill dough in fridge for 30 minutes.",
        timerMinutes: 30
      },
      {
        step: 2,
        title: "Shape Falafel Balls",
        description: "Shape mixture into walnut-sized patties using a falafel scoop or wet hands. Press sesame seeds onto both sides.",
        timerMinutes: 5
      },
      {
        step: 3,
        title: "Fry to Crisp Perfection",
        description: "Heat oil to 350°F (175°C). Gently lower falafels in batches. Fry 3-4 minutes until exterior is deep golden brown and crunchy.",
        timerMinutes: 4
      },
      {
        step: 4,
        title: "Whisk Tahini & Serve Platter",
        description: "Whisk tahini with lemon juice, garlic, and cold water until pale and creamy. Arrange falafels on a platter with warm pitas, pickled turnip, and tahini.",
        timerMinutes: 3
      }
    ],
    nutrition: {
      calories: 390,
      protein: 15,
      carbs: 46,
      fat: 16,
      fiber: 9
    },
    reviews: [
      {
        id: "rev-1201",
        userName: "Tariq Mansoor",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "4 days ago",
        comment: "Crispy on the outside, bright emerald green and soft on the inside! So authentic."
      }
    ]
  }
];
