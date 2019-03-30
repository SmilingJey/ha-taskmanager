
import ModelTask from './model-task.js';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;

    this._storeItem = this._storeItem.bind(this);
    this._storeItems = this._storeItems.bind(this);
  }

  createTask({data}) {
    if (this._isOnline()) {
      return this._api.createTask({data})
        .then(this._storeItem);
    } else {
      data.id = this._generateId();
      this._needSync = true;
      this._store.setItem({key: data.id, item: data});
      return Promise.resolve(ModelTask.parseTask(data));
    }
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
        .then(this._storeItems);
    } else {
      const rawTasksMap = this._store.getAll();
      const rawTasks = objectToArray(rawTasksMap);
      const tasks = ModelTask.parseTasks(rawTasks);
      return Promise.resolve(tasks);
    }
  }

  updateTask({id, data}) {
    if (this._isOnline()) {
      return this._api.updateTask({id, data})
        .then(this._storeItem);
    } else {
      const task = data;
      this._needSync = true;
      this._store.setItem({key: task.id, item: task});
      return Promise.resolve(ModelTask.parseTask(task));
    }
  }

  deleteTask({id}) {
    if (this._isOnline()) {
      return this._api.deleteTask({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  syncTasks() {
    return this._api.syncTasks({tasks: objectToArray(this._store.getAll())});
  }

  _storeItem(item) {
    this._store.setItem({key: item.id, item: ModelTask.toRAW(item)});
    return item;
  }

  _storeItems(items) {
    this._store.removeItemAll();
    items.map(this._storeItem.bind(this));
    return items;
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
