$("#author-search").on("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
  
      var bookInput = $("#author-search").val().trim();
      var cocktailUrl = "https://thecocktaildb.com/api/json/v1/1/random.php";
  
      // Clear previous data and reset the page
      resetPage();
  
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
  });
  
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
  