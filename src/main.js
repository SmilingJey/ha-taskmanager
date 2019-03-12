import {randomInteger} from './utils.js';
import createFilterElement from './filter.js';
import TasksBoard from './tasks-board.js';


/**
 * Функция отображает список фильтров
 */
function renderFilters() {
  const filterDefinitions = [
    {
      id: `all`,
      name: `ALL`,
      tasksCount: randomInteger(10),
      onClick: null,
      isActive: true
    },

    {
      id: `overdue`,
      name: `OVERDUE`,
      tasksCount: randomInteger(10),
      onClick: null,
      isActive: false
    },

    {
      id: `today`,
      name: `TODAY`,
      tasksCount: randomInteger(10),
      onClick: null,
      isActive: false
    },

    {
      id: `favorites`,
      name: `FAVORITES`,
      tasksCount: randomInteger(10),
      onClick: null,
      isActive: false
    },

    {
      id: `repeating`,
      name: `REPEATING`,
      tasksCount: randomInteger(10),
      onClick: null,
      isActive: false
    },

    {
      id: `tags`,
      name: `TAGS`,
      tasksCount: randomInteger(10),
      onClick: null,
      isActive: false
    },

    {
      id: `archive`,
      name: `ARCHIVE`,
      tasksCount: randomInteger(10),
      onClick: null,
      isActive: false
    }
  ];

  const filtersFragment = document.createDocumentFragment();
  const filterElements = filterDefinitions.map(createFilterElement);

  for (const filterElement of filterElements) {
    filtersFragment.appendChild(filterElement);
  }

  const filtersContainerElement = document.querySelector(`.main__filter`);
  filtersContainerElement.appendChild(filtersFragment);
}

renderFilters();

const tasksBoard = new TasksBoard();
document.querySelector(`main`).append(tasksBoard.render());

