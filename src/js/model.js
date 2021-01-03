import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  searchList: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // format json data to camalCase
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // if recipe.key is true then it will add the key as part of the data
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // 1. retreive recipe data
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    // 2. store recipe in state
    state.recipe = createRecipeObject(data);

    // 3. check if bookmarked
    // some() checks if any elements in the array pass a test (provided as a function)
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // 1. set search query in the state
    state.searchList.query = query;

    // 2. retreive search data
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // 3. format json data to camalCase to store as a new array in the state
    state.searchList.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        // if recipe.key is true then it will add the key as part of the data
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // reset page no.
    state.searchList.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.searchList.page) {
  // set page in our state
  state.searchList.page = page;

  // start slice index
  const start = (page - 1) * state.searchList.resultsPerPage; // 0
  // end slice index
  const end = page * state.searchList.resultsPerPage; // 9

  // return a slice of the results
  return state.searchList.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // loop the recipes ingredients
  state.recipe.ingredients.forEach(ing => {
    // calculate NEW ingredient quantity
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; // (4 * 3) / 2
  });

  // set NEW servings in state
  state.recipe.servings = newServings;
};

// local storage
const persistBookmarks = function () {
  // save bookmarks from state
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // save to local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // delete from local storage
  persistBookmarks();
};

// check local storage and load recipes into the state
const init = function () {
  // retreive bookmarks from local storage
  const storage = localStorage.getItem('bookmarks');
  // if any, store in the state
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  // convert recipe ingredients
  try {
    // convert object to an array
    // filter() method creates an array filled with all array elements that pass a test (provided as a function)
    // replaceAll() method returns a new string with all matches of a pattern replaced by a replacement
    // split() method is used to split a string into an array of substrings, and returns the new array
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim()); // ["0.5", "kg", "rice"]

        // check users ingredient format is correct
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat, please use the correct format'
          );

        // destructure
        const [quantity, unit, description] = ingArr;

        // if quantity true ? convert to number : null
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // format recipe data
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    // send POST request
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // store recipe in state
    state.recipe = createRecipeObject(data);

    // add NEW recipe to bookmarks
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
