const API_KEY = "4c137389c1ea478e9c1383eda254250e";

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

// Fetch only vegetable-based recipes
async function getVegetableRecipes() {
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
        document.getElementById("recipes").innerHTML = "<p>Loading recipes...</p>"; // Show loading message

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || data.length === 0 || (!data.results && !data.recipes)) {
            document.getElementById("recipes").innerHTML = "<p>No recipes found. Try different inputs.</p>";
            return;
        }

        const recipeData = data.results || data.recipes; // Handle both cases
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
            <p>${recipe.summary.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 100)}...</p>
            <a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}
