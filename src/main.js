import TasksBoard from './tasks-board.js';
import FilterList from './filters-list.js';
import {insertAfter} from './utils.js';
import TasksData from './tasks-data.js';
import Statistic from './statistic';
import ModelTask from './model-task.js';
import * as moment from 'moment';

const tasksData = new TasksData();
const filtersList = new FilterList(tasksData.getTasks.bind(tasksData));
const statistic = new Statistic(tasksData.getTasks.bind(tasksData));
const tasksBoard = new TasksBoard({
  getTasks: tasksData.getTasks.bind(tasksData),
  deleteTask: tasksData.deleteTask.bind(tasksData),
  updateTask: tasksData.updateTask.bind(tasksData),
  onHashTagClick: (text) => {
    const searchInputElement = document.querySelector(`.search__input`);
    const controlSearch = document.querySelector(`#control__search`);
    controlSearch.checked = true;

    searchInputElement.value = text;
    showPage(`control__search`);
    setTaskBoardSerch();
  }
});

tasksData.onDataChange = (eventName) => {
  filtersList.updateCount();
  if (eventName === `allupdate`) {
    tasksBoard.update();
  }
};

filtersList.onFilter = (filterFunction) => {
  tasksBoard.filterFunction = filterFunction;
};

// создание новой задачи
function pushNewTask() {
  const newTaskData = ModelTask.createEmptyTask();
  tasksData.createTask(newTaskData)
    .then((data) => {
      tasksBoard.addTask(data, true);
    })
    .catch((e) => {
      tasksBoard.showErrorMessage();
      throw e;
    });
}

const newTaskElement = document.querySelector(`label[for="control__new-task"]`);
newTaskElement.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  filtersList.selectFilter(`ALL`);
  showPage(`control__task`);
  pushNewTask();
});

// переключение между странацами
function showPage(pageName) {
  tasksBoard.setVisible(pageName === `control__task` || pageName === `control__search`);
  filtersList.setVisible(pageName === `control__task`);
  document.querySelector(`#control__task`).checked = pageName === `control__task`;
  statistic.setVisible(pageName === `control__statistic`);
  document.querySelector(`#control__statistic`).checked = pageName === `control__statistic`;
  if (pageName === `control__task`) {
    tasksBoard.filterFunction = null;
  }

  if (pageName === `control__statistic`) {
    statistic.updateCharts();
  }
  const searchInputElement = document.querySelector(`.search__input`);
  if (pageName === `control__search`) {
    searchInputElement.classList.remove(`search__input--hidden`);
    setTaskBoardSerch();
  } else {
    searchInputElement.classList.add(`search__input--hidden`);
  }
}

const onControlChange = (evt) => {
  const id = evt.target.id;
  showPage(id);
};

document.querySelector(`.control__btn-wrap`).addEventListener(`change`, onControlChange);

insertAfter(filtersList.render(), document.querySelector(`.main__search`));
insertAfter(statistic.render(), document.querySelector(`.main__search`));
document.querySelector(`main`).append(tasksBoard.render());

// переключение между online и offline режимами работы
window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  tasksData.syncTasks();
});

// поиск
const searchInputElement = document.querySelector(`.search__input`);

function setTaskBoardSerch() {
  const searchText = searchInputElement.value;
  tasksBoard.filterFunction = (task) => {
    if (searchText.charAt(0) === `#`) {
      return Array.from(task.tags).join(` #`).toLowerCase().includes(searchText.toLowerCase());
    }
    if (searchText.charAt(0) === `D`) {
      return moment(task.dueDate).format(`DD.MM.YYYY`).toLowerCase().includes(searchText.toLowerCase());
    }
    if (task.title.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    if (Array.from(task.tags).join(` `).toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    if (moment(task.dueDate).format(`DD.MM.YYYY`).toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    return false;
  };
}

searchInputElement.addEventListener(`keydown`, () => {
  setTaskBoardSerch();
});

// загрузка данных
tasksBoard.showLoadingMessage();
tasksData.getTasksFromServer()
  .catch((e) => {
    tasksBoard.showErrorMessage();
    throw e;
  });
