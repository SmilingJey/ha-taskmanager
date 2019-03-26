import Component from './component.js';

/**
 * Класс представляет фильтр
 */
export default class Filter extends Component {
  constructor(data, getTasksDataCallback) {
    super();
    this._id = data.id;
    this._name = data.name;
    this._isActive = data.isActive;
    this._filterFunction = data.filterFunction;
    this._onFilter = null;
    this._onChange = this._onChange.bind(this);
    this._getTasksData = getTasksDataCallback;
  }

  /**
   * Установка обработчика события выбора фильтра
   * @param {Function} fn - обработчик
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Возвращает имя фильтра
   */
  get name() {
    return this._name;
  }

  /**
   * Задает активен ли фильтр
   * @param {Boolean} active
   */
  set isActive(active) {
    this._isActive = active;
  }

  /**
   * Возвращает шаблон фильтра
   * @return {Node} - пустой элемент фильтра
   */
  get template() {
    return Filter.temlate.cloneNode(true);
  }

  /**
   * Обновляет данные фильтра
   */
  update() {
    const tasksData = this._getTasksData();
    const itemCount = tasksData !== null ? tasksData.filter(this._filterFunction).length : 0;
    const filterInputElement = this._element.querySelector(`input`);
    filterInputElement.setAttribute(`id`, `filter__${this._id}`);
    filterInputElement.checked = this._isActive;
    filterInputElement.disabled = itemCount === 0;
    const filterLabelElement = this._element.querySelector(`label`);
    filterLabelElement.innerHTML = `${this._name} <span class="filter__${this._id}-count">${itemCount}</span>`;
    filterLabelElement.htmlFor = `filter__${this._id}`;
  }

  /**
   * Установка обработчиков событий
   */
  bind() {
    this._element.querySelector(`input`).addEventListener(`change`, this._onChange);
  }

  /**
   * Удаление обработчиков событий
   */
  unbind() {
    this._element.querySelector(`input`).removeEventListener(`change`, this._onChange);
  }

  /**
   * Обработчик события выбор фильтра
   */
  _onChange() {
    this.dispatchChange();
  }

  dispatchChange() {
    if (typeof this._onFilter === `function`) {
      this._onFilter(this._filterFunction);
    }
  }
}

Filter.temlate = document.querySelector(`#filter-template`).content.querySelector(`.filter`);
