import Component from './component.js';

/**
 * Класс представляет фильтр
 */
export default class Filter extends Component {
  constructor(data, getDataCallback) {
    super();

    this._id = data.id;
    this._name = data.name;
    this._isActive = data.isActive;
    this._filterFunction = data.filterFunction;

    this._onFilter = null;
    this._onClick = this._onClick.bind(this);

    this._getDataCallback = getDataCallback;
  }

  get template() {
    return Filter.temlate.content.cloneNode(true);
  }

  update() {
    const itemCount = 10;

    const filterInputElement = this._element.querySelector(`input`);
    filterInputElement.setAttribute(`id`, `filter__${this._id}`);
    filterInputElement.checked = this._isActive;
    filterInputElement.disabled = itemCount === 0;

    const filterLabelElement = this._element.querySelector(`label`);
    filterLabelElement.innerHTML = `${this._name} <span class="filter__${this.id}-count">${itemCount}</span>`;

    filterLabelElement.htmlFor = `filter__${this._id}`;

    this.updateCount();
  }

  updateCount() {
    const countElement = this._element.querySelector(`.filter__${this.id}-count`);
    countElement.textContent = this._getDataCallback().filter(this._filterFunction).length;
  }


  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter(this._filterFunction);
    }
  }

  bind() {
    this._element.querySelector(`input`).addEventListener(`change`, this._onClick);
  }

  unbind() {
    this._element.querySelector(`input`).removeEventListener(`change`, this._onClick);
  }
}

Filter.temlate = document.querySelector(`#filter-template`);
