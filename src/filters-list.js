import Component from "./component";
import Filter from "./filter";
import * as moment from 'moment';
import {removeChilds} from './utils';

const filtersData = [
  {
    id: `all`,
    name: `ALL`,
    filterFunction: () => true,
  },
  {
    id: `overdue`,
    name: `OVERDUE`,
    filterFunction: (data) => data.dueDate && data.dueDate < Date.now(),
  },
  {
    id: `today`,
    name: `TODAY`,
    filterFunction: (data) => moment(data.dueDate).isSame(Date.now(), `day`),
  },
  {
    id: `favorites`,
    name: `FAVORITES`,
    filterFunction: (data) => data.isFavorite,
  },
  {
    id: `repeating`,
    name: `REPEATING`,
    filterFunction: (data) => Object.values(data.repeatingDays).includes(true),
  },
  {
    id: `tags`,
    name: `TAGS`,
    filterFunction: (data) => data.tags && data.tags.size > 0,
  },
  {
    id: `archive`,
    name: `ARCHIVE`,
    filterFunction: (data) => data.isDone,
  }
];

/**
 * Класс представляет список фильтров
 */
export default class FilterList extends Component {
  constructor(getDataCallback) {
    super();
    this._filters = [];
    this._onFilter = null;
    this._getDataCallback = getDataCallback;
    this._activeFilterId = `all`;
  }

  /**
   * Установка обработчика события выбора фильтра
   * @param {Function} fn - обработчик
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Возвращает пустой шаблон фильтра
   */
  get template() {
    const elem = document.createElement(`section`);
    elem.classList.add(`main__filter`, `filter`, `container`);
    this._filters = filtersData.map(this._createFilter.bind(this));
    const filtersFragment = document.createDocumentFragment();
    for (const filter of this._filters) {
      filtersFragment.appendChild(filter.render());
    }
    elem.appendChild(filtersFragment);
    return elem;
  }

  /**
   * Обновление списка фильтров
   */
  update() {
    for (const filter of this._filters) {
      filter.active = (this._activeFilterId === filter.id);
      filter.update();
    }
  }

  /**
   * Обновление количества элементов в фильтре
   */
  updateCount() {
    for (const filter of this._filters) {
      filter.update();
    }
  }

  /**
   * Задание фильтра
   * @param {*} filterName - имя фильтра
   */
  selectFilter(filterName) {
    const selectedFilter = this._filters.find((filter) => filter.name === filterName);
    if (selectedFilter) {
      selectedFilter.isActive = true;
      selectedFilter.update();
      selectedFilter.dispatchChange();
    }
  }

  /**
   * Создание фильтра
   * @param {Object} filterData - данные фильтра
   * @return {Object} - фильтр
   */
  _createFilter(filterData) {
    const filter = new Filter(filterData, this._getDataCallback);
    filter.onFilter = (id, filterFunction) => {
      this._activeFilterId = id;
      this.update();
      if (typeof this._onFilter === `function`) {
        this._onFilter(filterFunction);
      }
    };
    return filter;
  }

  /**
   * Удаление компонента
   */
  unrender() {
    super.unrender();
    for (const filter of this._filters) {
      filter.unrender();
    }
  }
}
