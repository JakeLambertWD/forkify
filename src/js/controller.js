import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// display recipe
const controlRecipes = async function () {
  try {
    // 1. get the hash from the URL and slice from index 1
    const id = window.location.hash.slice(1);

    // 2. check there is an id
    if (!id) return;

    // 3. load spinner
    recipeView.renderSpinner();

    // 4. highlight active recipe in the results & bookmarks views
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 5. get the recipe data
    // when calling an async function you must always handle the returned promise
    await model.loadRecipe(id);

    // 6. Render recipe data to the DOM
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// display search results
const controlSearchResults = async function () {
  try {
    // 1. load spinner
    resultsView.renderSpinner();

    // 2. get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 3. get search results
    await model.loadSearchResults(query);

    // 4. render search results
    resultsView.render(model.getSearchResultsPage());

    // 5. render the initial pagination buttons
    paginationView.render(model.state.searchList);
  } catch (err) {
    console.log(err);
  }
};

// pagination
const controlPagination = function (goToPage) {
  // 1. render NEW search results
  // resultsView.render(model.state.searchList.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. render NEW pagination buttons
  paginationView.render(model.state.searchList);
};

// recipe servings
const controlServings = function (newServings) {
  // 1. update the recipe servings (in state)
  model.updateServings(newServings);

  // 2. update the recipe view
  recipeView.update(model.state.recipe);
};

// bookmarks
const controlAddBookmark = function () {
  // 1. add or remove
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. update recipe view for bookmark btn
  recipeView.update(model.state.recipe);

  // 3. render the bookmarks list
  bookmarksView.render(model.state.bookmarks);
};

// render the bookmarks list as soon as the page loads
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window after 2.5 seconds
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// innitialise event listeners
const init = function () {
  // publisher/subscriber pattern
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView._addHandlerUpdateServings(controlServings);
  recipeView._addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView._addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
