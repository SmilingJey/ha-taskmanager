import ModelTask from './model-task.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: `tasks`})
      .then(API.toJSON)
      .then(ModelTask.parseTasks);
  }

  createTask({data}) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON)
      .then(ModelTask.parseTask);
  }

  updateTask({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON)
      .then(ModelTask.parseTask);
  }

  deleteTask({id}) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  syncTasks({tasks}) {
    return this._load({
      url: `tasks/sync`,
      method: `POST`,
      body: JSON.stringify(tasks),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(API.checkStatus);
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static toJSON(response) {
    return response.json();
  }
}

