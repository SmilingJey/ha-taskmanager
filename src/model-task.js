export default class ModelTask {
  constructor() {}

  static createEmptyTask() {
    return {
      id: `0`,
      title: `New task`,
      color: `black`,
      tags: new Set([]),
      dueDate: ``,
      repeatingDays: {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false,
      },
      picture: ``,
      isDone: false,
      isFavorite: false,
    };
  }

  static toRAW(data) {
    return {
      'id': data.id.toString(),
      'title': data.title,
      'color': data.color,
      'tags': [...data.tags.values()],
      'due_date': data.dueDate,
      'repeating_days': data.repeatingDays,
      'picture': data.picture,
      'is_done': data.isDone,
      'is_favorite': data.isFavorite,
    };
  }

  static parseTask(data) {
    return {
      id: data[`id`].toString(),
      title: data[`title`] || ``,
      color: data[`color`],
      tags: new Set(data[`tags`] || []),
      dueDate: new Date(data[`due_date`]),
      repeatingDays: data[`repeating_days`],
      picture: data[`picture`] || ``,
      isDone: Boolean(data[`is_done`]),
      isFavorite: Boolean(data[`is_favorite`]),
    };
  }

  static parseTasks(data) {
    return data.map(ModelTask.parseTask);
  }
}
