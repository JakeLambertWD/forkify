import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  // parent element
  _parentElement = document.querySelector('.bookmarks__list');
  // error msg
  _errorMessage = 'No bookmarks yet, find a nice recipe and bookmark it';
  // success msg
  _succesMessage = '';

  // when page loads call the handler
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // map() results calling our markup function on each result
  _generateMarkup() {
    return this._data.map(bkm => previewView.render(bkm, false)).join('');
    // the result of this will be an array of markup strings
  }
}

export default new BookmarksView();
