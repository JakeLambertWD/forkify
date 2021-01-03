import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  // parent element
  _parentElement = document.querySelector('.pagination');

  _addHandlerClick(handler) {
    // click event on parent element
    this._parentElement.addEventListener('click', function (e) {
      // 1. event delegation working down the DOM tree
      const btn = e.target.closest('.btn--inline');

      // 2. check btn was clicked
      if (!btn) return;

      // 3. retreive dataset from html element and + convert to an integer
      const goToPage = +btn.dataset.goto;

      // 4. parse the page no. to handler in the controller
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // 1. get current page
    const currentPage = this._data.page;

    // 2. calculate number of pages needed to display search results
    // Math.ceil() rounds up to the next largest integer
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // next button
    if (currentPage === 1 && numPages > 1) {
      // The data- attribute gives us the ability to embed custom data attributes on all HTML elements
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    // previous page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }
    // both buttons
    if (currentPage < numPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    // no buttons
    return '';
  }
}

export default new PaginationView();
