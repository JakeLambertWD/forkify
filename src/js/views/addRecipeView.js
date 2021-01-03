import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  // form class
  _parentElement = document.querySelector('.upload');
  // success msg
  _message = 'Recipe was successfully uploaded';
  // add recipe window
  _window = document.querySelector('.add-recipe-window');
  // background overlay
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // toggle hidden classes
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // open event handler
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  // close event handlers
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // submit form handler
  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // the FormData is a web API that provides a way to easily construct a set of key/value pairs representing form fields and their values
      // return as an array
      const dataArr = [...new FormData(this)];
      // convert the array into an object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
