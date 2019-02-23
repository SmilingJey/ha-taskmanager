(function () {
  const filterTemlate = document.querySelector(`#filter-template`);

  /**
   * Возвращает элемент фильтра, созданный из шаблона #filter-template
   * @param {Object} filterDefinition - описание фильтра
   * @return {Node} - возвращает элемент фильтра
   */
  function createFilterElement(filterDefinition) {
    const filterElement = filterTemlate.content.cloneNode(true);

    const filterInputElement = filterElement.querySelector(`input`);
    filterInputElement.setAttribute(`id`, `filter__${filterDefinition.id}`);
    filterInputElement.checked = filterDefinition.isActive;
    filterInputElement.disabled = filterDefinition.tasksCount === 0;

    const filterLabelElement = filterElement.querySelector(`label`);
    filterLabelElement.innerHTML = `${filterDefinition.name} <span class="filter__${filterDefinition.id}-count">${filterDefinition.tasksCount}</span>`;
    filterLabelElement.setAttribute(`for`, `filter__${filterDefinition.id}`);
    filterLabelElement.addEventListener(`click`, filterDefinition.onClick);

    return filterElement;
  }

  /**
   * Функция возвращает целое случайное число в диапазоне [0, max)
   * @param {*} max - максимальное число ()
   * @return {Node}
   */
  function randomInteger(max) {
    return Math.floor(Math.random() * max);
  }

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

  const taskTemplate = document.querySelector(`#card-template`);

  /**
   * Возвращает карточку задачи, созданную из шаблона #card-template
   * @param {Object} taskDefinition - описание задачи
   * @return {Node} - возвращает элемент карточки задачи
   */
  function createTaskElement(taskDefinition) {
    const taskElement = taskTemplate.content.querySelector(`.card`).cloneNode(true);
    taskElement.classList.add(`card--${taskDefinition.color}`);
    return taskElement;
  }

  /**
   * Функция удаляет все дочерние элементы
   * @param {*} element - DOM элемент, из которого будут удалены дочерние
   */
  function removeChilds(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Функция возвращает случайный элемент массива
   * @param {Array} array - массив
   * @return {*} - возвращает случайный элемент массива
   */
  function randomArrayItem(array) {
    return array[randomInteger(array.length)];
  }

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
})();
