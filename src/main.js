import TasksBoard from './tasks-board.js';
import FilterList from './filters-list.js';
import {insertAfter} from './utils.js';
import TasksData from './tasks-data.js';

const tasksData = new TasksData();

const filtersList = new FilterList(tasksData.getTasksData.bind(tasksData));

const tasksBoard = new TasksBoard({
  getTasksData: tasksData.getTasksData.bind(tasksData),
  deleteTask: tasksData.deleteTask.bind(tasksData),
  updateTask: tasksData.updateTask.bind(tasksData),
});

tasksData.onDataChange = () => {
  filtersList.updateCount();
};

filtersList.onFilter = (filterFunction) => {
  tasksBoard.filterFunction = filterFunction;
};

insertAfter(filtersList.render(), document.querySelector(`.main__search`));
document.querySelector(`main`).append(tasksBoard.render());
