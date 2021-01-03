import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  // parent element
  _parentElement = document.querySelector('.results');
  // error msg
  _errorMessage = 'No recipes found for your query';
  // success msg
  _succesMessage = '';

  // map() results calling our markup function on each result
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
    // the result of this will be an array of markup strings
  }
}

export default new ResultsView();
