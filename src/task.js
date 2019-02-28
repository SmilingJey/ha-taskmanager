import {removeChilds} from './utils.js';
import * as moment from 'moment';

/**
 * Функция задает текст карточки задачи
 * @param {Node} taskElement - карточка задачи
 * @param {Object} taskDefinition - описание задачи
 */
function setTaskElementTitle(taskElement, taskDefinition) {
  const titleElement = taskElement.querySelector(`.card__text`);
  titleElement.value = taskDefinition.title;
}

/**
 * Функция задает цвет карточки задачи
 * @param {Node} taskElement - карточка задачи
 * @param {Object} taskDefinition - описание задачи
 */
function setTaskElementColor(taskElement, taskDefinition) {
  taskElement.classList.add(`card--${taskDefinition.color}`);
  const colorInputElement = taskElement.querySelector(`#color-${taskDefinition.color}-${taskDefinition.number}`);
  colorInputElement.checked = true;
}

/**
 * Функция задает дату выполнения задачи
 * @param {Node} taskElement - карточка задачи
 * @param {Object} taskDefinition - описание задачи
 */
function setTaskElementDate(taskElement, taskDefinition) {
  const statusElement = taskElement.querySelector(`.card__date-status`);
  const deadlineFieldsetElement = taskElement.querySelector(`.card__date-deadline`);
  if (taskDefinition.hasDeadline) {
    statusElement.textContent = `YES`;
    deadlineFieldsetElement.disabled = false;
    const dateElement = deadlineFieldsetElement.querySelector(`.card__date`);
    dateElement.value = moment(taskDefinition.dealineDate).format(`D MMMM`);
    const timeElement = deadlineFieldsetElement.querySelector(`.card__time`);
    timeElement.value = moment(taskDefinition.dealineDate).format(`h:mm A`);
  } else {
    statusElement.textContent = `NO`;
    deadlineFieldsetElement.disabled = true;
  }
}

/**
 * Функция задает изображение прикрепленное к задаче
 * @param {Node} taskElement - карточка задачи
 * @param {Object} taskDefinition - описание задачи
 */
function setTaskElementPicture(taskElement, taskDefinition) {
  const imgConteinerElement = taskElement.querySelector(`.card__img-wrap`);
  if (taskDefinition.picture) {
    imgConteinerElement.classList.remove(`card__img-wrap--empty`);
    const imgElement = imgConteinerElement.querySelector(`.card__img`);
    imgElement.src = taskDefinition.picture;
  } else {
    imgConteinerElement.classList.add(`card__img-wrap--empty`);
  }
}

/**
 * Функция задает дни в которые повторяется задача
 * @param {Node} taskElement - карточка задачи
 * @param {Object} taskDefinition - дни, в которые задача повтояется
 */
function setTaskElementRepeating(taskElement, taskDefinition) {
  const statusElement = taskElement.querySelector(`.card__repeat-status`);
  const repeatDaysFieldsetElement = taskElement.querySelector(`.card__repeat-days`);
  if (taskDefinition.isRepeating) {
    taskElement.classList.add(`card--repeat`);
    statusElement.textContent = `YES`;
    repeatDaysFieldsetElement.disabled = false;
    for (const day in taskDefinition.repeatingDays) {
      if (taskDefinition.repeatingDays.hasOwnProperty(day)) {
        const dayElement = repeatDaysFieldsetElement.querySelector(`#repeat-${day}-${taskDefinition.number}`);
        if (dayElement) {
          dayElement.checked = taskDefinition.repeatingDays[day];
        }
      }
    }
  } else {
    taskElement.classList.remove(`card--repeat`);
    statusElement.textContent = `NO`;
    repeatDaysFieldsetElement.disabled = true;
  }
}

const hashTagTemlate = document.querySelector(`#task-hashtag-template`);

/**
 * Функция задает теги задачи
 * @param {Node} taskElement - карточка задачи
 * @param {Object} taskDefinition - описание задачи
 */
function setTaskElementTags(taskElement, taskDefinition) {
  const tagsContainerElement = taskElement.querySelector(`.card__hashtag-list`);
  removeChilds(tagsContainerElement, `.card__hashtag-inner`);

  for (const tag of taskDefinition.tags) {
    const hashTagElement = hashTagTemlate.content.querySelector(`.card__hashtag-inner`).cloneNode(true);
    const hashTagNameElement = hashTagElement.querySelector(`.card__hashtag-name`);
    hashTagNameElement.textContent = `#${tag}`;
    tagsContainerElement.prepend(hashTagElement);
  }
}

/**
 * Функция изменяет старый id ввода на новый и исправляет аттрибут for
 * у соответствующего элемента label
 * @param {*} taskElement - карточка задачи
 * @param {*} oldId - старый id
 * @param {*} newId - новый id
 */
function setTaskInputId(taskElement, oldId, newId) {
  const inputElement = taskElement.querySelector(`#${oldId}`);
  const labelElement = taskElement.querySelector(`label[for=${oldId}]`);
  inputElement.id = newId;
  labelElement.for = newId;
}

/**
 * Функция задает уникальные атрибуты id и for для элементов
 * input и label карточки задачи
 * @param {*} taskElement - карточка задачи
 * @param {*} number - номер задачи
 */
function setTaskId(taskElement, number) {
  const idForChange = [
    `repeat-mo`,
    `repeat-tu`,
    `repeat-we`,
    `repeat-th`,
    `repeat-fr`,
    `repeat-sa`,
    `repeat-su`,
    `color-black`,
    `color-yellow`,
    `color-blue`,
    `color-green`,
    `color-pink`
  ];

  for (const id of idForChange) {
    setTaskInputId(taskElement, id, `${id}-${number}`);
  }
}

const taskTemplate = document.querySelector(`#card-template`);

/**
 * Возвращает карточку задачи, созданную из шаблона #card-template
 * @param {Object} taskDefinition - описание задачи
 * @return {Node} - возвращает элемент карточки задачи
 */
function createTaskElement(taskDefinition) {
  const taskElement = taskTemplate.content.querySelector(`.card`).cloneNode(true);
  setTaskId(taskElement, taskDefinition.number);
  setTaskElementTitle(taskElement, taskDefinition);
  setTaskElementColor(taskElement, taskDefinition);
  setTaskElementDate(taskElement, taskDefinition);
  setTaskElementPicture(taskElement, taskDefinition);
  setTaskElementTags(taskElement, taskDefinition);
  setTaskElementRepeating(taskElement, taskDefinition);
  return taskElement;
}

export default createTaskElement;
