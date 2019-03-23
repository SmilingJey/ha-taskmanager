import createMockTask from './moc-task.js';

/**
 * Класс содержиет данные задач
 */
export default class TasksData {
  constructor() {
    this._tasks = Array(12).fill().map(createMockTask);
    this._onDataChange = null;
  }

  /**
   * Задает колбэк вызываемый при изменении данных
   * @param {Function} fn - функция вызываемая при изменении данных
   */
  set onDataChange(fn) {
    this._onDataChange = fn;
  }

  /**
   * Возвращает данные задач
   * @return {Array} - задачи
   */
  getTasksData() {
    return this._tasks;
  }

  /**
   * Добавляет новую задачу
   * @param {Object} data - задача
   */
  addTask(data) {
    this._tasks.unshift(data);
    this._emitDataChange();
  }

  /**
   * Оюновление данных задачи
   * @param {Object} oldData - старые данные
   * @param {Object} newData - новые данные
   */
  updateTask(oldData, newData) {
    this._tasks[this._tasks.indexOf(oldData)] = newData;
    this._emitDataChange();
  }

  /**
   * Удаление задачи
   * @param {Object} data - данные задачи
   */
  deleteTask(data) {
    this._tasks.splice(this._tasks.indexOf(data), 1);
    this._emitDataChange();
  }

  _emitDataChange() {
    if (typeof this._onDataChange === `function`) {
      this._onDataChange();
    }
  }
}
