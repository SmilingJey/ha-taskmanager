import {randomInteger, randomArrayItem, removeChilds} from './utils.js';
import createFilterElement from './filter.js';
import createTaskElement from './task.js';

/**
 * Функция отображает список фильтров
 */
function renderFilters() {
  const filterDefinitions = [
    {
      id: `all`,
      name: `ALL`,
      tasksCount: randomInteger(10),
      onClick: showTasks,
      isActive: true
    },

    {
      id: `overdue`,
      name: `OVERDUE`,
      tasksCount: randomInteger(10),
      onClick: showTasks,
      isActive: false
    },

    {
      id: `today`,
      name: `TODAY`,
      tasksCount: randomInteger(10),
      onClick: showTasks,
      isActive: false
    },

    {
      id: `favorites`,
      name: `FAVORITES`,
      tasksCount: randomInteger(10),
      onClick: showTasks,
      isActive: false
    },

    {
      id: `repeating`,
      name: `REPEATING`,
      tasksCount: randomInteger(10),
      onClick: showTasks,
      isActive: false
    },

    {
      id: `tags`,
      name: `TAGS`,
      tasksCount: randomInteger(10),
      onClick: showTasks,
      isActive: false
    },

    {
      id: `archive`,
      name: `ARCHIVE`,
      tasksCount: randomInteger(10),
      onClick: showTasks,
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

const tasksContainerElement = document.querySelector(`.board__tasks`);

/**
 * Функция отображает случайное количество карточек задач
 */
function showTasks() {
  removeChilds(tasksContainerElement);
  const tasksCount = randomInteger(10);
  const TASK_COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];
  const tasksDefinitions = Array(tasksCount).fill().map(() => (
    {color: randomArrayItem(TASK_COLORS)})
  );

  const tasksFragment = document.createDocumentFragment();
  for (const taskDefinition of tasksDefinitions) {
    tasksFragment.appendChild(createTaskElement(taskDefinition));
  }

  tasksContainerElement.appendChild(tasksFragment);
}

showTasks();

