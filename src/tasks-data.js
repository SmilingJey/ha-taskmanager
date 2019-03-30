import API from './api.js';
import ModelTask from './model-task.js';
import Store from './store.js';
import Provider from './provider.js';

const AUTHORIZATION = `Basic smilingjey5`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;
const TASKS_STORE_KEY = `tasks-store-key`;

/**
 * Класс содержиет данные задач
 */
export default class TasksData {
  constructor() {
    this._tasks = null;
    this._onDataChange = null;
    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._store = new Store({key: TASKS_STORE_KEY, storage: localStorage});
    this._provider = new Provider({
      api: this._api,
      store: this._store,
      generateId: () => String(Date.now())
    });
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
  getTasks() {
    return this._tasks;
  }

  /**
   * Добавляет новую задачу
   * @param {Object} data - задача
   * @return {Promise} - промис
   */
  createTask(data) {
    const rawData = ModelTask.toRAW(data);
    delete rawData.id;
    return this._provider.createTask({data: rawData})
      .then((newData) => {
        this._tasks.push(newData);
        this._emitDataChange(`add`);
        return newData;
      });
  }

  /**
   * Получение списка задач с сервера
   * @return {Promise} - промис
   */
  getTasksFromServer() {
    return this._provider.getTasks()
      .then((tasks) => {
        this._tasks = tasks;
        this._emitDataChange(`allupdate`);
        return tasks;
      });
  }

  /**
   * Обновление задачи
   * @param {Object} task - новые данные
   * @return {Promise} - промис
   */
  updateTask(task) {
    return this._provider.updateTask({id: task.id, data: ModelTask.toRAW(task)})
      .then((updatedTaskData) => {
        this._tasks[this._getTaskIndexById(task.id)] = updatedTaskData;
        this._emitDataChange(`update`);
        return updatedTaskData;
      });
  }

  /**
   * Удаление задачи
   * @param {Object} data - данные задачи
   * @return {Promise} - промис
   */
  deleteTask({id}) {
    return this._provider.deleteTask({id})
      .then(() => {
        this._tasks.splice(this._getTaskIndexById(id), 1);
        this._emitDataChange(`delete`);
      });
  }

  syncTasks() {
    this._provider.syncTasks();
  }

  /**
   * Поиск задачи в this._tasks по id
   * @param {String} id - идентификатор задачи
   * @return {Number} - индекс задачи в массиве this._tasks
   */
  _getTaskIndexById(id) {
    return this._tasks.findIndex((task) => id === task.id);
  }

  /**
   * Событие о изменении задач
   * @param {String} eventName - имя события
   */
  _emitDataChange(eventName) {
    if (typeof this._onDataChange === `function`) {
      this._onDataChange(eventName);
    }
  }
}
