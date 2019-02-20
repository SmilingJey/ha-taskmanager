'use strict';

(function () {

  class Filter {
    constructor(id, name, tasksCount = 0, isActive = false) {
      this.id = id;
      this.name = name;
      this.tasksCount = tasksCount;
      this.isActive = isActive;
    }

    render() {
      const filterElement = Filter.tempate.content.cloneNode(true);

      const filterInputElement = filterElement.querySelector(`input`);
      filterInputElement.setAttribute(`id`, `filter__${this.id}`);
      filterInputElement.checked = this.isActive;
      filterInputElement.disabled = this.tasksCount === 0;

      const filterLabelElement = filterElement.querySelector(`label`);
      filterLabelElement.innerHTML = `${this.name} <span class="filter__${this.id}-count">${this.tasksCount}</span>`;
      filterLabelElement.setAttribute(`for`, `filter__${this.id}`);

      return filterElement;
    }
  }

  Filter.tempate = document.querySelector(`#filter-template`);

  function renderFilters() {
    const filters = [
      new Filter(`all`, `ALL`, Math.floor(Math.random() * 10), true),
      new Filter(`overdue`, `OVERDUE`, Math.floor(Math.random() * 10)),
      new Filter(`today`, `TODAY`, Math.floor(Math.random() * 10)),
      new Filter(`favorites`, `FAVORITES`, Math.floor(Math.random() * 10)),
      new Filter(`repeating`, `REPEATING`, Math.floor(Math.random() * 10)),
      new Filter(`tags`, `TAGS`, Math.floor(Math.random() * 10)),
      new Filter(`archive`, `ARCHIVE`, Math.floor(Math.random() * 10))
    ];

    const filtersContainerElement = document.querySelector(`.main__filter`);
    const filtersFragment = document.createDocumentFragment();
    for (const filter of filters) {
      filtersFragment.appendChild(filter.render());
    }
    filtersContainerElement.appendChild(filtersFragment);
  }

  renderFilters();
})();
