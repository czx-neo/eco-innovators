// Update all API endpoints to include instructions
async function getRecipes() {
    const foodInput = document.getElementById("foodInput").value.trim().toLowerCase();
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${foodInput}&number=20&addRecipeInformation=true&fillInstructions=true&apiKey=${API_KEY}`;
    fetchRecipes(apiUrl);
}

// Add common parameters to all endpoints
const baseParams = `number=20&addRecipeInformation=true&instructionsRequired=true&fillInstructions=true&apiKey=${API_KEY}`;

async function getCuisineRecipes() {
    const selectedCountry = document.getElementById("countrySelect").value;
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?cuisine=${selectedCountry}&${baseParams}`;
    fetchRecipes(apiUrl);
}

// Updated display function with proper instruction handling
function displayRecipes(recipes) {
    const recipesDiv = document.getElementById("recipes");
    recipesDiv.innerHTML = "";

    recipes.forEach(recipe => {
        const instructions = extractInstructions(recipe);
        
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe-card");
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Time:</strong> ${recipe.readyInMinutes} minutes</p>
            <div class="instructions">
                <h4>Instructions</h4>
                ${instructions || "<p>No instructions available</p>"}
            </div>
            <a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a>
        `;
        recipesDiv.appendChild(recipeElement);
    });
}

// Helper function to extract instructions from different possible locations
function extractInstructions(recipe) {
    // Try structured instructions first
    if (recipe.analyzedInstructions?.length > 0) {
        return `<ol>${recipe.analyzedInstructions[0].steps
            .map(step => `<li>${step.step.replace(/<\/?[^>]+(>|$)/g, "")}</li>`)
            .join('')}</ol>`;
    }
    
    // Fallback to plain text instructions
    if (recipe.instructions) {
        return `<div class="fallback-instructions">${
            recipe.instructions.replace(/<\/?[^>]+(>|$)/g, "")
        }</div>`;
    }
    
    return null;
}