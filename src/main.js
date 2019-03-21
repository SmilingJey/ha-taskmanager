import TasksBoard from './tasks-board.js';
import FilterList from './filters-list.js';
import {insertAfter} from './utils.js';
import TasksData from './tasks-data.js';
import Statistic from './statistic';

const tasksData = new TasksData();
const filtersList = new FilterList(tasksData.getTasksData.bind(tasksData));
const statistic = new Statistic(tasksData.getTasksData.bind(tasksData));
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

const onControlChange = (evt) => {
  const id = evt.target.id;
  tasksBoard.setVisible(id === `control__task`);
  filtersList.setVisible(id === `control__task`);
  statistic.setVisible(id === `control__statistic`);
  if (id === `control__statistic`) {
    statistic.updateCharts();
  }
};

document.querySelector(`.control__btn-wrap`).addEventListener(`change`, onControlChange);

insertAfter(filtersList.render(), document.querySelector(`.main__search`));
insertAfter(statistic.render(), document.querySelector(`.main__search`));
document.querySelector(`main`).append(tasksBoard.render());
