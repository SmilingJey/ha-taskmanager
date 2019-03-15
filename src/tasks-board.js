import Component from './component.js';
import createMockTask from './moc-task.js';
import {randomInteger, removeChilds} from './utils.js';
import Task from './task.js';

/**
 * Класс представляет список задач
 */
export default class TasksBoard extends Component {
  constructor() {
    super();
    const tasksCount = randomInteger(10) + 3;
    this._tasks = Array(tasksCount).fill().map(createMockTask);
    this._filterFunction = null;
  }

  /**
   * Задает алгоритм фильтрации
   * @param {Function} fn - функция фильтрации задач
   */
  set filterFunction(fn) {
    this._filterFunction = fn;
    this.update();
  }

  /**
   * Возврацает массив задач, после применения заданного фильтра
   * @param {Array} array - исходный массив
   * @return {Array} - отфильтрованный массив
   */
  filterPoints(array) {
    const hasFilterFunction = typeof this._filterFunction === `function`;
    return (hasFilterFunction) ? array.filter(this._filterFunction) : array;
  }

  /**
   * Возвращает массив задач для отображения
   * @return {Array} - массив задач
   */
  getDisplayedPoints() {
    return this.filterPoints(this._tasks);
  }

  /**
   * Возвращает шаблон
   * @return {Node} - пустой шаблон списка задач
   */
  get template() {
    const templateElement = document.querySelector(`#tasks-board`).content;
    const element = templateElement.querySelector(`.board`).cloneNode(true);
    return element;
  }

  /**
   * Отображение компонента
   */
  update() {
    const displayedTasks = this.getDisplayedPoints();
    this._updateNoTaskMessage(this._tasks.length > 0);
    this._updateTasks(displayedTasks);
  }

  /**
   * Отображение задач
   * @param {Array} tasksData - массив задач
   */
  _updateTasks(tasksData) {
    const tasksContainerElement = this._element.querySelector(`.board__tasks`);
    removeChilds(tasksContainerElement);
    const tasksFragment = document.createDocumentFragment();
    for (const taskData of tasksData) {
      tasksFragment.appendChild(this._createTask(taskData).render());
    }
    tasksContainerElement.appendChild(tasksFragment);
  }

  /**
   * Создает объект задачи и задает обработчик сохранения
   * @param {Object} taskData - описание точки путешествия
   * @return {Object} объект точки путешествия
   */
  _createTask(taskData) {
    const task = new Task(taskData);
    task.onSubmit = (data) => {
      this._tasks[taskData] = data;
      task.element.parentElement.replaceChild(this._createTask(data).render(), task.element);
      task.unrender();
    };
    return task;
  }

  /**
   * Отображение сообщения о выполнении всех хадач
   * @param {Boolean} isVisible - выполнены ли все задачи
   */
  _updateNoTaskMessage(isVisible) {
    const noTaskMessageElement = this._element.querySelector(`.board__no-tasks`);
    if (isVisible) {
      noTaskMessageElement.classList.add(`visually-hidden`);
    } else {
      noTaskMessageElement.classList.remove(`visually-hidden`);
    }
  }
}
