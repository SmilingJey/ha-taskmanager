import Component from "./component";
import Filter from "./filter";
import * as moment from 'moment';

const filtersData = [
  {
    id: `all`,
    name: `ALL`,
    filterFunction: () => true,
    isActive: true,
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
    filterFunction: (data) => data.isArchive,
  }
];

export default class FilterList extends Component {
  constructor(getDataCallback) {
    super();
    this._filters = [];
    this._onFilter = null;
    this._getDataCallback = getDataCallback;
  }

  get template() {
    const elem = document.createElement(`section`);
    elem.classList.add(`main__filter`, `filter`, `container`);
    return elem;
  }

  update() {
    for (const filter of this._filters) {
      filter.unrender();
    }

    const filtersFragment = document.createDocumentFragment();
    this._filters = filtersData.map(this._createFilter.bind(this));
    for (const filter of this._filters) {
      filtersFragment.appendChild(filter.render());
    }
    this._element.appendChild(filtersFragment);
  }

  updateCount() {
    for (const filter of filtersData) {
      filter.updateCount(this._getDataCallback);
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _createFilter(filterData) {
    const filter = new Filter(filterData, this._getDataCallback);
    filter.onFilter = (filterFunction) => {
      if (typeof this._onFilter === `function`) {
        this._onFilter(filterFunction);
      }
    };
    return filter;
  }

  unrender() {
    this.super();
    for (const filter of this._filters) {
      filter.unrender();
    }
  }
}
