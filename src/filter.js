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

export default createFilterElement;
