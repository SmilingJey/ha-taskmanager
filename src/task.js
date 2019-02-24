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

export default createTaskElement;
