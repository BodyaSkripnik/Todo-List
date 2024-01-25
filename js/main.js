const tasks = [
  {
    id: "task-42528647",
    completed: true,
    text: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit.",
    title: "Eu ea incididunt sunt consectetur",
    date: "2024.01.13",
  },
  {
    id: "task-63583488",
    completed: true,
    text: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in.",
    title: "Eu ea incididunt sunt consectetur fugiat non",
    date: "2024.01.12",
  },
  {
    id: "task-45299838",
    completed: false,
    text: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.",
    title: "Deserunt laborum id consectetur pariatur veniam occaecat",
    date: "2024.01.11",
  },
  {
    id: "task-41603808",
    completed: false,
    text: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip.",
    title: "Deserunt laborum id consectetur",
    date: "2024.01.10",
  },
  {
    id: "task-41503808",
    completed: false,
    text: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip.",
    title: "Deserunt laborum id consectetur",
    date: "2024.01.14",
  },
];

// "task-63583488"
/* const taskIndex = tasks.findIndex((task) => task.id === "task-45299838");
tasks.splice(taskIndex, 1); */

function x(tasksArray) {
  return tasksArray.reduce((acc, el) => {
    acc[el.id] = el;
    return acc;
  }, {});
}

const tasksObj = x(tasks);

if (!localStorage.getItem("tasks")) {
  updateTasksInLS(tasksObj);
}

const themes = {
  dark: {
    "--primary": "#181818",
    "--secondary": "#fafafa",
  },
  light: {
    "--primary": "#fafafa",
    "--secondary": "#181818",
  },
};

// DOM Elements
const todoWrapper = getElement(".todo__wrapper");
const todoForm = getElement(".todo__form");
const overlay = getElement(".overlay");
const modal = getElement(".modal");
const inputTitle = todoForm.elements.taskTitle;
const inputText = todoForm.elements.taskText;
const themeSelect = getElement(".header__themes");
const htmlRoot = getElement(":root");
const todoSort = getElement(".todo__sort");

// Variables
const themeFromLS = localStorage.getItem("theme");
const tasksFromLS = JSON.parse(localStorage.getItem("tasks"));
const sortText = localStorage.getItem("sortBy")

// Events

renderAllTasks(tasksFromLS);

todoWrapper.addEventListener("click", onDeleteTask);

todoForm.addEventListener("submit", onAddTask);

themeSelect.addEventListener("change", onChangeTheme);

todoSort.addEventListener("change", onSortTasks);

setTheme(themeFromLS);
themeSelect.value = themeFromLS || "dark";
todoSort.value = sortText || 'fromNew';

// Functions

function getElement(selector) {
  return document.querySelector(selector);
}

function createTaskTemplate({ title, text, id }, className = "") {
  return `
    <div class="todo__item ${className}" data-id='${id}'>
      <h3 class="todo__item-title">${title}</h3>
      <p class="todo__item-text">${text}</p>
      <div class="todo__item-footer">
        <button class="btn btn--red btn--delete-js">Delete task</button>
      </div>
    </div>
    <span></span>
  `;
}

function renderAllTasks(tasks) {
  const fragment = Object.values(tasks)
    .reverse()
    .reduce((acc, task) => (acc += createTaskTemplate(task)), "");
  //fragment = fragment.split("<span></span>").reverse().join("");
  // todoWrapper.insertAdjacentHTML("beforeend", fragment);
  todoWrapper.innerHTML = fragment;

  setTimeout(() => {
    todoWrapper
      .querySelectorAll(".todo__item")
      .forEach((item) => item.classList.add("visible"));
  }, 1);
}

function renderSingleTask(task) {
  const taskTemplate = createTaskTemplate(task, "visible");
  todoWrapper.insertAdjacentHTML("afterbegin", taskTemplate);
}

function onAddTask(e) {
  e.preventDefault();
  const titleValue = inputTitle.value;
  const textValue = inputText.value;
  if (validateInput(inputTitle, titleValue) === true) {
    const newTask = createNewTask(titleValue, textValue);
    renderSingleTask(newTask);
    updateTasksInLS(tasksFromLS);
    todoForm.reset();
  }
}

function createNewTask(title, text) {
  const task = {
    id: "task-" + Math.floor(Math.random() * 100000000),
    completed: false,
    text,
    title,
    date: new Date().toLocaleDateString("en-GB").split("/").reverse().join("."),
  };
  tasksFromLS[task.id] = task;
  return task;
}

function validateInput(input, value) {
  if (value.length < 3) {
    input.style.border = "1px solid red";
    input.nextElementSibling.innerText = input.dataset.message;
    return false;
  } else {
    input.style.border = "1px solid #181818";
    input.nextElementSibling.innerText = null;
    return true;
  }
}

function onDeleteTask(e) {
  if (e.target.classList.contains("btn--delete-js")) {
    const taskItem = e.target.closest(".todo__item");
    const taskId = taskItem.dataset.id;
    const taskTitle = taskItem.querySelector(".todo__item-title");
    showModal(taskTitle);
    function onConfirmDelete(e) {
      if (e.target.classList.contains("btn--delete-js")) {
        removeElementFromLayout(taskItem);
        removeElementFormObj(taskId);
        hideModal();
        updateTasksInLS(tasksFromLS);
        modal.removeEventListener("click", onConfirmDelete);
      }
      if (e.target.classList.contains("btn--cancel-js")) {
        hideModal();
        modal.removeEventListener("click", onConfirmDelete);
      }
    }
    modal.addEventListener("click", onConfirmDelete);
  }
}

function removeElementFromLayout(element) {
  element.remove();
}

function removeElementFormObj(id) {
  delete tasksFromLS[id];
}

function updateTasksInLS(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showModal(title) {
  modal.querySelector(".modal__text span").innerText = title.innerText;
  overlay.classList.add("overlay--active");
  modal.classList.add("modal--active");
}

function hideModal() {
  overlay.classList.remove("overlay--active");
  modal.classList.remove("modal--active");
}

function onChangeTheme(e) {
  const selectedTheme = e.target.value;
  localStorage.setItem("theme", selectedTheme);
  setTheme(selectedTheme);
}

function setTheme(theme) {
  const themeObj = themes[theme];
  for (let key in themeObj) {
    htmlRoot.style.setProperty(key, themeObj[key]);
  }
}

function onSortTasks(e) {
  const tasksArray = Object.values(tasksFromLS);
  if (e.target.value === "fromNew") {
    tasksArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    tasksArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  const tasksObj = x(tasksArray);
  renderAllTasks(tasksObj);
  updateTasksInLS(tasksObj);
  localStorage.setItem("sortBy", e.target.value);
}
