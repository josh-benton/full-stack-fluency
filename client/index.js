//async functions to handle API requests
async function getTasks() {
  const response = await fetch(`/api/tasks`);
  return await response.json();
}

async function getTasksById(id) {
  const response = await fetch(`/api/tasks/${id}`);
  return await response.json();
}

async function createTask(taskData) {
  const response = await fetch(`/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return await response.json();
}

async function updateTaskWithPatch(id, taskData) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return await response.json();
}

async function updateTaskWithPut(id, taskData) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return await response.json();
}

async function deleteTask(id) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete task: ${errorText}`);
  }
  return true;
}

// DOM UI
document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");

  taskForm.addEventListener("submit", createOrUpdateTask);
  taskList.addEventListener("click", handleTaskListClick);

  loadTasks();

  async function loadTasks() {
    const tasks = await getTasks();
    tasks.forEach(addTaskToUI);
  }

  // Handle form submission
  function createOrUpdateTask(event) {
    event.preventDefault();

    const taskId = taskForm.getAttribute("task-id");
    const taskData = {
      task: document.getElementById("task-desc").value,
    };

    console.log("taskData: ", taskData);

    if (taskId) {
      updateTaskWithPatch(taskId, taskData).then((updatedTask) => {
        updateTaskInUI(updatedTask);
        resetForm();
      });
    } else {
      taskForm.setAttribute("task-id", "");
      createTask(taskData).then((newTask) => {
        console.log(newTask);
        console.log("taskId: ", newTask.id);
        addTaskToUI(newTask);
        resetForm();
      });
    }
  }

  //Add a task element to the UI
  function addTaskToUI(task) {
    const taskEl = createTaskEl(task);
    taskList.appendChild(taskEl);
  }

  // Update a task element in the UI
  function updateTaskInUI(updatedTask) {
    const taskEl = document.querySelector(
      `[task-id="${updatedTask.task_id}"].task-desc`
    );
    taskEl.innerHTML = createTaskInnerHTML(updatedTask);
  }

  //Create a new task element
  function createTaskEl(task) {
    const li = document.createElement("li");
    li.classList.add("task");
    li.setAttribute("task-id", task.id);
    li.innerHTML = createTaskInnerHTML(task);
    return li;
  }

  // Create the HTML for a task element
  function createTaskInnerHTML(task) {
    return `
            <span class="task-desc">${task.task}</span>
            <button class="edit-task">Edit</button>
            <button class="delete-task">Delete</button>
            `;
  }

  // Reset the form field
  function resetForm() {
    taskForm.reset();
    taskForm.removeAttribute("data-task-id");
    taskForm.dataset.taskId = "";
  }

  // Handle edit and delete click events
  function handleTaskListClick(event) {
    const taskId = event.target.closest(".task").getAttribute("task-id");
    const action = event.target.className;
    const taskDescEl = event.target
      .closest(".task")
      .querySelector(".task-desc");

    if (action === "edit-task") {
      const taskText = taskDescEl.innerText;
      taskDescEl.innerHTML = `<input type="text" value="${taskText}"></input>`;
      event.target.innerHTML = "Save";
      event.target.className = "save-task";
    } else if (action === "delete-task") {
      deleteTask(taskId).then((isDeleted) => {
        if (isDeleted) {
          removeTaskFromUI(taskId);
        }
      });
    } else if (action === "save-task") {
      const newTaskText = taskDescEl.querySelector("input").value;
      console.log(newTaskText);
      const taskData = {
        task: newTaskText,
      };
      updateTaskWithPatch(taskId, taskData).then((updatedTask) => {
        taskDescEl.innerHTML = updatedTask.task;
        event.target.innerHTML = "Edit";
        event.target.className = "edit-task";
      });
    }
  }

  // Populate the form fields with the task data
  function populateForm(task) {
    if (task.task) {
      document.getElementById("task-desc").value = task.task_desc;
    }
    taskForm.setAttribute("data-task-id", task.task_id);
  }

  // Remove the task element from the UI
  function removeTaskFromUI(taskId) {
    const taskEl = document.querySelector(`[task-id="${taskId}"]`);
    taskEl.remove();
  }
});
