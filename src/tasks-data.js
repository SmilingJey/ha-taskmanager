import createMockTask from './moc-task.js';

export default class TasksData {
  constructor() {
    this._tasks = Array(12).fill().map(createMockTask);
    this._onDataChange = null;
  }

  getTasksData() {
    return this._tasks;
  }

  addTask(data) {
    this._tasks.unshift(data);
    this._emitDataChange();
  }

  updateTask(oldData, newData) {
    this._points[this._points.indexOf(oldData)] = newData;
    this._emitDataChange();
  }

  deleteTask(data) {
    this._tasks.splice(this._tasks.indexOf(data), 1);
    this._emitDataChange();
  }

  set onDataChange(fn) {
    this._onDataChange = fn;
  }

  _emitDataChange() {
    if (typeof this._onDataChange === `function`) {
      this._onDataChange();
    }
  }
}
