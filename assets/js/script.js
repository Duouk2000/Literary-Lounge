// Listen for any input that is entered into the search box
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();    
    const authorName = document.getElementById('author-search').value;
    fetchRandomDrinkInformation();
    searchAuthorName(authorName);
  });
});

function fetchRandomDrinkInformation() {
  var cocktailUrl = "https://thecocktaildb.com/api/json/v1/1/random.php";


// $("#author-search").on("keypress", function (event) {
//     if (event.key === "Enter") {
//       event.preventDefault();

//       var bookInput = $("#author-search").val().trim();
//       var cocktailUrl = "https://thecocktaildb.com/api/json/v1/1/random.php";

//       // Clear previous data and reset the page
//       resetPage();

    // Fetch random cocktail data
    fetch(cocktailUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(function (cocktailData) {
        console.log("Cocktail API Response:", cocktailData);
        var drinkName = cocktailData.drinks[0].strDrink;
        var drinkImg = cocktailData.drinks[0].strDrinkThumb;
        var drinkInst = cocktailData.drinks[0].strInstructions;

        // Get all ingredients from cocktailData
        var allIngredients = [];
        cocktailData.drinks.forEach(function (drink) {
          var ingredients = getAllIngredients(drink);
          allIngredients = allIngredients.concat(ingredients);
        });

        console.log("All Ingredients:", allIngredients);

        console.log(drinkName);
        console.log(drinkImg);
        console.log(drinkInst);

        $(".drinkName").text(`Drink name: ${drinkName}`);
        $(".drinkinst").text(`Instruction: ${drinkInst}`);
        $(".drinking").text(`Ingredients: ${allIngredients.join(", ")}`);
        $(".drinkImg").attr("src", drinkImg);

        // Save data to local storage
        saveToLocalStorage({
          drinkName: drinkName,
          drinkInst: drinkInst,
          allIngredients: allIngredients.join(", "),
          drinkImg: drinkImg
        });

        
      })
      .catch(function (error) {
        console.error("Error fetching cocktail data:", error.message);
      })
      .finally(function () {
        // Clear the search input field
        $("#search-input").val("");
      });
      
  }

// Function to get all ingredients from a drink object
function getAllIngredients(drink) {
  var ingredients = [];
  for (var i = 1; i <= 15; i++) {
    var ingredientKey = "strIngredient" + i;
    var measureKey = "strMeasure" + i;

    if (drink[ingredientKey]) {
      var ingredient = drink[measureKey]
        ? drink[measureKey] + " " + drink[ingredientKey]
        : drink[ingredientKey];
      ingredients.push(ingredient);
    }
  }
  return ingredients;
}

// Function to reset the page
function resetPage() {
  $("#search-input").val(""); // Assuming .drinkImg is the class of your image element
}

// Function to save data to local storage
function saveToLocalStorage(data) {
  localStorage.setItem("cocktailData", JSON.stringify(data));
}

// ## Open Library code ##
function searchAuthorName(authorName) {
  const authorAPI = 'https://openlibrary.org/search/authors.json?q=';

  // Fetch author information
  fetch(authorAPI + authorName)
    .then(function (response) {
      return response.json();
    })
    .then(function (authorData) {
      displayAuthorInformation(authorData);
    });
  // Call the function to fetch random drink information
  fetchRandomDrinkInformation();
}

function displayAuthorInformation(authorData) {
  // Console log data to work out the data structure
  console.log(authorData);

  // Pull top work of the author into the HTML element
  document.getElementById('topWork').textContent = `Top Work: ${authorData.docs[0].top_work}`;

  var key = authorData.docs[0].key;
  const authorKeyAPI = `https://openlibrary.org/authors/${key}.json`;

  // Fetch additional author information using the obtained key
  fetch(authorKeyAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (authorKey) {
      console.log(authorKey.bio);
      document.getElementById('name').textContent = `Author: ${authorKey.name}`;
      document.getElementById('dob').textContent = `Date of Birth: ${authorKey.birth_date}`;
      document.getElementById('bio').textContent = `Bio: ${authorKey.bio}`;
    });
}
