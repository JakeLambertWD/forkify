import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // jsdoc.app
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. a recipe)
   * @param {boolean} [render = true] If false, create a markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance
   */
  // render
  render(data, render = true) {
    // 1. error checking data
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // 2. store/overwrite data in data variable
    this._data = data;

    // 3. generate markup
    const markup = this._generateMarkup();
    if (!render) return markup;

    // 4. clear parent element
    this._clear();

    // 5. render markup to the DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // DOM updating algorithm
  update(data) {
    // 1. store data
    this._data = data;

    // 2. generate markup
    const newMarkup = this._generateMarkup();

    // 3. convert string in to DOM node elements
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // 4. create node list for current & new elements then convert to an Array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // 5. loop new elements array
    newElements.forEach((newEl, i) => {
      // 1. get current element by index
      const curEl = curElements[i];

      // 2. update changed TEXT
      if (
        // check new element is not equal to current element
        !newEl.isEqualNode(curEl) &&
        // & check the new element has text, firstChild = text node and nodeValue = the value of that text node | trim() removes white space from both ends
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // replace current element with the new element
        curEl.textContent = newEl.textContent;
      }

      // 3. update changed servings ATTRIBUTE
      if (!newEl.isEqualNode(curEl))
        // attributes returns all attributes from a specified node & then convert to an array
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
    });
  }

  // clear
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // spinner
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // render error message
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // render success message
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
