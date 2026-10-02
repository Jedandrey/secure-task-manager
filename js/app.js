const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 0;

function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = taskText;

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.classList.add("complete-btn");
    completeButton.textContent = "Complete";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "Remove";

    taskItem.appendChild(textSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(editButton);
    taskItem.appendChild(removeButton);

    return taskItem;
}

function addTask(taskText) {
    const trimmedText = taskText.trim();

    if (trimmedText === "") {
        taskMessage.textContent = "Task cannot be empty";
        taskInput.focus();
        return;
    }

    taskCounter += 1;

    const taskId = `task-${taskCounter}`;
    const taskItem = createTaskElement(trimmedText, taskId);

    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskMessage.textContent = "";

    updateTaskCounts();
    taskInput.focus();
}

function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");

    if (taskItem.classList.contains("completed")) {
        taskItem.dataset.state = "completed";
    } else {
        taskItem.dataset.state = "pending";
    }

    updateTaskCounts();
}

function beginTaskEdit(taskItem) {
    const textSpan = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = textSpan.textContent;

    textSpan.replaceWith(editInput);

    editButton.textContent = "Save";
    editInput.focus();
}

function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!editInput) {
        return;
    }

    const trimmedText = editInput.value.trim();

    if (trimmedText === "") {
        taskMessage.textContent = "Task cannot be empty";
        editInput.focus();
        return;
    }

    const newTextSpan = document.createElement("span");
    newTextSpan.classList.add("task-text");
    newTextSpan.textContent = trimmedText;

    editInput.replaceWith(newTextSpan);

    editButton.textContent = "Edit";
    taskMessage.textContent = "";
}

function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

function updateTaskCounts() {
    const tasks = taskList.querySelectorAll(".task-item");

    let pending = 0;
    let completed = 0;

    tasks.forEach((taskItem) => {
        if (taskItem.dataset.state === "completed") {
            completed += 1;
        } else {
            pending += 1;
        }
    });

    totalCount.textContent = tasks.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

function handleTaskListClick(event) {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (event.target.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
        return;
    }

    if (event.target.matches(".edit-btn")) {
        if (event.target.textContent === "Edit") {
            beginTaskEdit(taskItem);
        } else {
            saveTaskEdit(taskItem);
        }
        return;
    }

    if (event.target.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}

function loadSampleTasks() {
    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    sampleTasks.forEach((taskText) => {
        taskCounter += 1;

        const taskId = `task-${taskCounter}`;
        const taskItem = createTaskElement(taskText, taskId);

        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);

    taskMessage.textContent = "";
    updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskList.addEventListener("click", handleTaskListClick);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

updateTaskCounts();