class SearchView {
  // parent element
  _parentEl = document.querySelector('.search');

  // get user input
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // clear user input
  _clearInput() {
    return (this._parentEl.querySelector('.search__field').value = '');
  }

  // event listener
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // prevent form default from reloading the page
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
