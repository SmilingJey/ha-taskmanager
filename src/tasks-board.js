import Component from './component.js';
import {removeChilds} from './utils.js';
import Task from './task.js';

/**
 * Класс представляет список задач
 */
export default class TasksBoard extends Component {
  constructor(dataCallbacks) {
    super();
    this._filterFunction = () => true;

    this._getTasks = dataCallbacks.getTasks;
    this._deleteTask = dataCallbacks.deleteTask;
    this._updateTask = dataCallbacks.updateTask;
    this._onHashTagClick = dataCallbacks.onHashTagClick;

    this._tasks = [];
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
   * @param {Array} tasks - массив задач
   * @return {Array} - массив задач для отображения
   */
  getDisplayedPoints(tasks) {
    return this.filterPoints(tasks);
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
   * Добавляет новыю задачу задачу
   * @param {Object} taskData - данные задачи
   * @param {Boolean} isEdit - открыть задачу в режиме редактирования
   */
  addTask(taskData, isEdit = false) {
    const task = this._createTask(taskData, isEdit);
    const tasksContainerElement = this._element.querySelector(`.board__tasks`);
    tasksContainerElement.insertBefore(task.render(), tasksContainerElement.firstChild);
    this._tasks.unshift(task);
  }

  /**
   * Отображение компонента
   */
  update() {
    const tasksData = this._getTasks();
    if (tasksData !== null) {
      const displayedTasks = this.getDisplayedPoints(tasksData).reverse();
      this._updateNoTaskMessage(displayedTasks.length > 0);
      this._updateTasks(displayedTasks);
    }
  }

  /**
   * Отображение задач
   * @param {Array} tasksData - массив задач
   */
  _updateTasks(tasksData) {
    for (const task of this._tasks) {
      task.unrender();
    }
    const tasksContainerElement = this._element.querySelector(`.board__tasks`);
    removeChilds(tasksContainerElement);
    const tasksFragment = document.createDocumentFragment();
    this._tasks = tasksData.map((taskData) => this._createTask(taskData));
    for (const task of this._tasks) {
      tasksFragment.appendChild(task.render());
    }
    tasksContainerElement.appendChild(tasksFragment);
  }

  /**
   * Создает объект задачи и задает обработчик сохранения
   * @param {Object} taskData - описание точки путешествия
   * @param {Boolean} isEdit - в режиме ли редактирования карточка
   * @return {Object} объект точки путешествия
   */
  _createTask(taskData, isEdit = false) {
    const task = new Task(taskData, isEdit, this._onHashTagClick);
    task.onSubmit = (data) => {
      task.savingBlock();
      task.unsetUnsaved();
      this._updateTask(data)
        .then((updatedTaskData) => {
          const updatedTask = this._createTask(updatedTaskData);
          task.element.parentElement.replaceChild(updatedTask.render(), task.element);
          task.unrender();
          this._tasks[this._tasks.indexOf(task)] = updatedTask;
          this._updateNoTaskMessage(this._getTasks().length > 0);
        })
        .catch(() => {
          task.shake();
          task.setUnsaved();
          task.unblock();
          this.showErrorMessage();
        });
    };

    task.onDelete = () => {
      task.deletingBlock();
      task.unsetUnsaved();
      this._deleteTask(taskData)
        .then(() => {
          task.unrender();
          this._tasks.splice(this._tasks.indexOf(task), 1);
          this._updateNoTaskMessage(this._getTasks().length > 0);
        })
        .catch(() => {
          task.shake();
          task.setUnsaved();
          task.unblock();
          this.showErrorMessage();
        });
    };

    return task;
  }

  /**
   * Отображение сообщения о выполнении всех хадач
   * @param {Boolean} hasTasks - выполнены ли все задачи
   */
  _updateNoTaskMessage(hasTasks) {
    const noTaskMessageElement = this._element.querySelector(`.board__no-tasks`);
    if (hasTasks) {
      noTaskMessageElement.classList.add(`visually-hidden`);
    } else {
      this._showMessage(`No tasks found`);
    }
  }

  /**
   * Отобразить сообщение об ошибке
   */
  showErrorMessage() {
    this._showMessage(` Something went wrong. Check your connection or try again later`);
  }

  /**
   * Отобразить сообщение о загрузке задач
   */
  showLoadingMessage() {
    this._showMessage(` Loading tasks...`);
  }

  /**
   * Отобразить сообщение
   * @param {String} text - текст сообщения
   */
  _showMessage(text) {
    const noTaskMessageElement = this._element.querySelector(`.board__no-tasks`);
    noTaskMessageElement.classList.remove(`visually-hidden`);
    noTaskMessageElement.textContent = text;
  }
}
