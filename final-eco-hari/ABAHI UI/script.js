const API_KEY = "c9070602d11e40438b03a6e53688cae8"; // Update API key

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
});

// Fetch recipes based on ingredients
async function getRecipes() {
    const foodInput = document.getElementById("foodInput").value.trim().toLowerCase();
    if (!foodInput) {
        alert("Please enter ingredients to search.");
        return;
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${foodInput}&number=20&addRecipeInformation=true&apiKey=${API_KEY}`;
    fetchRecipes(apiUrl);
}

// Fetch recipes based on selected cuisine (country)
async function getCuisineRecipes() {
    const selectedCountry = document.getElementById("countrySelect").value;
    if (!selectedCountry) {
        alert("Please select a country.");
        return;
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?cuisine=${selectedCountry}&number=20&addRecipeInformation=true&apiKey=${API_KEY}`;
    fetchRecipes(apiUrl);
}

// Fetch only vegetarian recipes
async function getVegetarianRecipes() {
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?diet=vegetarian&number=20&addRecipeInformation=true&apiKey=${API_KEY}`;
    fetchRecipes(apiUrl);
}

// Fetch only non-vegetarian recipes
async function getNonVegetarianRecipes() {
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?excludeIngredients=tofu,lentils,beans,peas&number=20&addRecipeInformation=true&apiKey=${API_KEY}`;
    fetchRecipes(apiUrl);
}

// Fetch a random recipe
async function getRandomRecipe() {
    const apiUrl = `https://api.spoonacular.com/recipes/random?number=1&addRecipeInformation=true&apiKey=${API_KEY}`;
    fetchRecipes(apiUrl);
}

// Function to fetch and display recipes
async function fetchRecipes(apiUrl) {
    try {
        const recipesDiv = document.getElementById("recipes");
        recipesDiv.innerHTML = `<div class="loading-spinner"></div><p>Loading recipes...</p>`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || data.length === 0 || (!data.results && !data.recipes)) {
            recipesDiv.innerHTML = "<p>No recipes found. Try different inputs.</p>";
            return;
        }

        const recipeData = data.results || data.recipes;
        displayRecipes(recipeData);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        document.getElementById("recipes").innerHTML = "<p>Failed to fetch recipes. Please try again later.</p>";
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    const recipesDiv = document.getElementById("recipes");
    recipesDiv.innerHTML = "";

    recipes.forEach(recipe => {
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe-card");
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Time:</strong> ${recipe.readyInMinutes} minutes</p>
            <p>${recipe.summary.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 150)}...</p>
            <a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}

// Service Worker for caching
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});