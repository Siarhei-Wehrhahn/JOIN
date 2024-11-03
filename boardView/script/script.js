let subtasksArray = [];
let contactArrayAddTask = [];
let selectedPriority = null;
let selectedCategory = "";
let taskArray = [];

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function selectPriority(priority) {
  const urgentButton = document.getElementById("urgent-button");
  const urgentText = document.getElementById("urgentText");
  const urgentIcon = document.getElementById("urgentIcon");
  const mediumButton = document.getElementById("medium-button");
  const mediumText = document.getElementById("mediumText");
  const mediumIcon = document.getElementById("mediumIcon");
  const lowButton = document.getElementById("low-button");
  const lowText = document.getElementById("lowText");
  const lowIcon = document.getElementById("lowIcon");
  if (selectedPriority === priority) {
    urgentButton.classList.remove("redButton");
    urgentText.classList.remove("whiteText");
    urgentIcon.classList.remove("whiteIcon");
    mediumButton.classList.remove("orangeButton");
    mediumText.classList.remove("whiteText");
    mediumIcon.classList.remove("whiteIcon");
    lowButton.classList.remove("greenButton");
    lowText.classList.remove("whiteText");
    lowIcon.classList.remove("whiteIcon");
    selectedPriority = null;
    return;
  }
  urgentButton.classList.remove("redButton");
  urgentText.classList.remove("whiteText");
  urgentIcon.classList.remove("whiteIcon");
  mediumButton.classList.remove("orangeButton");
  mediumText.classList.remove("whiteText");
  mediumIcon.classList.remove("whiteIcon");
  lowButton.classList.remove("greenButton");
  lowText.classList.remove("whiteText");
  lowIcon.classList.remove("whiteIcon");
  if (priority === "urgent") {
    urgentButton.classList.add("redButton");
    urgentText.classList.add("whiteText");
    urgentIcon.classList.add("whiteIcon");
  } else if (priority === "medium") {
    mediumButton.classList.add("orangeButton");
    mediumText.classList.add("whiteText");
    mediumIcon.classList.add("whiteIcon");
  } else if (priority === "low") {
    lowButton.classList.add("greenButton");
    lowText.classList.add("whiteText");
    lowIcon.classList.add("whiteIcon");
  }
  selectedPriority = priority;
}

const toggleContactSelection = () => {
  const contentArea = document.getElementById("contactRender");
  const arrow = document.querySelector(".dropDownArrow");

  if (contentArea.classList.contains("d_none")) {
    contentArea.classList.toggle("d_none");
    arrow.classList.toggle("turnArrow");
    renderAddTaskOverlay();
    updateCheckboxes();
  } else {
    contentArea.classList.toggle("d_none");
    arrow.classList.toggle("turnArrow");
  }
};

const addContactToArray = async (index) => {
  const loadContacts = await loadData("/contacts");
  const contacts = Object.values(loadContacts)
    .filter((contact) => contact.name && contact.email && contact.phone)
    .sort((a, b) => a.name.localeCompare(b.name));

  const contact = contacts[index];
  let contactIndex = contactArrayAddTask.findIndex(
    (c) => c.email === contact.email
  );

  if (contactIndex === -1) {
    contactArrayAddTask.push(contact);
  } else {
    contactArrayAddTask.splice(contactIndex, 1);
  }

  document.querySelector(`#checkbox-${index}`).checked = contactIndex === -1;
};

const updateCheckboxes = async () => {
  const loadContacts = await loadData("/contacts");
  const contacts = Object.values(loadContacts)
    .filter((contact) => contact.name && contact.email && contact.phone)
    .sort((a, b) => a.name.localeCompare(b.name));

  contacts.forEach((contact, index) => {
    const isSelected = contactArrayAddTask.some(
      (c) => c.email === contact.email
    );
    const checkbox = document.querySelector(`#checkbox-${index}`);
    if (checkbox) checkbox.checked = isSelected;
  });
};

const renderAddTaskOverlay = async () => {
  const loadContacts = await loadData("/contacts");
  const contacts = Object.values(loadContacts)
    .filter((contact) => contact.name && contact.email && contact.phone)
    .sort((a, b) => a.name.localeCompare(b.name));
  const overlay = document.getElementById("contactRender");
  overlay.innerHTML = "";

  for (let index = 0; index < contacts.length; index++) {
    const person = contacts[index];
    const initials = person.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("");
    overlay.innerHTML += getOverlayAddTask(person, initials, index);
  }
};

function toggleAddTaskOverlay() {
  const overlay = document.getElementById("overlayAddTask");
  if (overlay.classList.contains("d_none")) {
    resetInputAddTask();
    overlay.classList.remove("d_none");
    overlay.classList.remove("slide-out");
    overlay.classList.add("slide-in");
  } else {
    overlay.classList.remove("slide-in");
    overlay.classList.add("slide-out");
    setTimeout(() => {
      overlay.classList.add("d_none");
      overlay.classList.remove("slide-out");
    }, 1000);
  }
}

function triggerInputButtons() {
  const inputField = document.getElementById("subtaskInputId");
  const buttons = document.getElementById("deleteOrSave");
  const addIcon = document.getElementById("addIconId");

  if (inputField.value.length > 0) {
    buttons.classList.remove("d_none");
    buttons.classList.add("deleteOrSaveBtn");
    addIcon.classList.add("d_none");
  } else if (inputField.value.length <= 0) {
    buttons.classList.add("d_none");
    buttons.classList.remove("deleteOrSaveBtn");
    addIcon.classList.remove("d_none");
  }
}

const deleteInput = () => {
  document.getElementById("subtaskInputId").value = "";
  triggerInputButtons();
};

const addSubtaskToArray = () => {
  const inputField = document.getElementById("subtaskInputId").value;
  const subtask = {subtask: inputField, checked: false}
  subtasksArray.push(subtask);
  deleteInput();
  renderSubtask();
};

const deleteSubtask = (i) => {
  subtasksArray.splice(i, 1);
  renderSubtask();
};

const renderNotesIntoTaskArray = async () => {
  const todo = document.getElementById("contentTodo");
  const progress = document.getElementById("contentProgress");
  const feedback = document.getElementById("contentFeedback");
  const done = document.getElementById("contentDone");
  todo.innerHTML = "";
  progress.innerHTML = "";
  feedback.innerHTML = "";
  done.innerHTML = "";
  try {
    const databaseJson = await loadData("/tasks");
    if (databaseJson) {
      taskArray.length = 0;

      taskArray = [];
      Object.keys(databaseJson).forEach((key) => {
        taskArray.push({
          id: key,
          title: databaseJson[key].title,
          description: databaseJson[key].description,
          assignedTo: databaseJson[key].assignedTo,
          dueDate: databaseJson[key].dueDate,
          prio: databaseJson[key].prio,
          category: databaseJson[key].category,
          subtasks: databaseJson[key].subtasks,
          area: databaseJson[key].area,
        });
      });
      savetasksToLocalStorage();

      if (taskArray.length === 0) {
        todo.innerHTML = `<div class="no-task">No tasks To do</div>`;
        progress.innerHTML = `<div class="no-task">No tasks in progress</div>`;
        feedback.innerHTML = `<div class="no-task">No tasks in feedback</div>`;
        done.innerHTML = `<div class="no-task">No tasks done</div>`;
        return;
      }

      for (let index = 0; index < taskArray.length; index++) {
        const task = taskArray[index];
        let people = Object.values(task.assignedTo).filter(person => person.name);
        let colorCategory = "";
        if (task.category == "User Story") {
          colorCategory = "#0038FF";
        } else {
          colorCategory = "#1FD7C1";
        }
        switch (task.area) {
          case "toDo":
            todo.innerHTML += getNoteRef(task, colorCategory, index);
            renderContactAssignedTo(people, index);
            updateProgressBar(index);
            break;
          case "progress":
            progress.innerHTML += getNoteRef(task, colorCategory, index);
            renderContactAssignedTo(people, index);
            updateProgressBar(index);
            break;
          case "feedback":
            feedback.innerHTML += getNoteRef(task, colorCategory, index);
            renderContactAssignedTo(people, index);
            updateProgressBar(index);
            break;
          case "done":
            done.innerHTML += getNoteRef(task, colorCategory, index);
            renderContactAssignedTo(people, index);
            updateProgressBar(index);
            break;
        }
      }
    } else {
      todo.innerHTML = `<div class="no-task">No tasks To do</div>`;
      progress.innerHTML = `<div class="no-task">No tasks in progress</div>`;
      feedback.innerHTML = `<div class="no-task">No tasks in feedback</div>`;
      done.innerHTML = `<div class="no-task">No tasks done</div>`;
    }
  } catch (error) {
    console.error("Failed to load tasks in renderNotes", error);
  }
};

const setPrioIcon = ((prio) => {
  if (prio == "low") {
    return "../assets/icon/prioLow.svg"
  } else if (prio == "urgent") {
    return "../assets/icon/prioUrgent.svg"
  } else {
    return "../assets/icon/prioMedia.svg"
  }
})

const renderContactAssignedTo = (persons, index) => {
  const content = document.getElementById('assignedToPeopleId' + index);
  persons.forEach(person => {
    let color = getColorForName(person.name)
    const initials = person.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    content.innerHTML += getPersonLogo(initials, color);
  })
}

const getTaskData = async () => {
  const databaseJson = await loadData("/tasks");
  if (databaseJson) {

    taskArray = [];
    return Object.keys(databaseJson).forEach((key) => {
      taskArray.push({
        id: key,
        title: databaseJson[key].title,
        description: databaseJson[key].description,
        assignedTo: databaseJson[key].assignedTo,
        dueDate: databaseJson[key].dueDate,
        prio: databaseJson[key].prio,
        category: databaseJson[key].category,
        subtasks: databaseJson[key].subtasks,
        area: databaseJson[key].area,
      });
    });
  }
}

const savetasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(taskArray))
}

const loadTasksFromLocalStorage = () => {
  const savedTaks =localeStorage.getItem("tasks");
  taskArray = JSON.parse(savedTaks);
  taskArray.forEach(updateProgressBar);  
}

const updateProgressBar = async (index) => {
  const databaseJson = await loadData("/tasks");
  if (databaseJson) {
    taskArray = [];
    Object.keys(databaseJson).forEach((key) => {
      taskArray.push({
        id: key,
        title: databaseJson[key].title,
        description: databaseJson[key].description,
        assignedTo: databaseJson[key].assignedTo,
        dueDate: databaseJson[key].dueDate,
        prio: databaseJson[key].prio,
        category: databaseJson[key].category,
        subtasks: databaseJson[key].subtasks || [],
        area: databaseJson[key].area,
      });
    });
  }
  const task = taskArray[index];
  const completedSubtasks = task.subtasks.filter(subtask => subtask.checked).length;
  const totalSubtasks = task.subtasks.length;

  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const progressBar = document.getElementById(`progressBar${task.title}`);
  const subtaskAmount = document.getElementById(`subtaskAmount${task.title}`);

  if (progressBar && subtaskAmount) {
    progressBar.value = progressPercentage;
    subtaskAmount.innerText = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  } else {
    progressBar.value = progressPercentage;
    subtaskAmount.innerText = `0/0 Subtasks`;
  }
};

const toggleSubtask = (taskId, subtaskIndex) => {
  const task = taskArray.find(task => task.id == taskId);
  if (task) {
    task.subtasks[subtaskIndex].checked = !task.subtasks[subtaskIndex].checked;

    savetasksToLocalStorage();
    updateProgressBar(taskArray.indexOf(task));
  }
};

const renderAssignedToContacts = async (task) => {
  const renderDiv = document.getElementById('assignedToContactsId');
   for (let index = 0; index < task.assignedTo.length; index++) {
    const contact = task.assignedTo[index];
    let color = getColorForName(contact.name)
    const initials = contact.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    renderDiv.innerHTML = getAssignedToContacts(color, initials, contact)
   }
}

// TODO Toggle funktion für die checkbox
const renderSubtask = () => {
  const subTaskContent = document.getElementById("subtasksContentId");
  subTaskContent.innerHTML = "";
  for (let index = 0; index < subtasksArray.length; index++) {
    const task = subtasksArray[index];
    subTaskContent.innerHTML += getSubtask(task.subtask, index);
  }
};

const editSubtask = (index) => {
  const subTaskContent = document.getElementById("subtasksContentId");
  subTaskContent.innerHTML = "";
  subTaskContent.innerHTML = getEditSubtask(index);
  document.getElementById("editInput").value = subtasksArray[index];
};

const saveEditSubtask = (i) => {
  const editSubtask = document.getElementById("editInput").value;
  subtasksArray[i] = editSubtask;
  renderSubtask();
};

// TODO Toggle funktion für die checkbox
const renderSubtasks = (task) => {
  let subtaskDestination = document.getElementById('subTaskDivToRenderId');
  subtaskDestination.innerHTML = "";
  for (let index = 0; index < task.subtasks.length; index++) {
    const subtask = task.subtasks[index];
    subtaskDestination.innerHTML += getSubtaskForOverlay(subtask, task, index);
  }
}

const deleteTask = (i) => {
  deleteData(`/tasks/${taskArray[i].id}`)
  toggleTaskNoteOverlay();
  setTimeout(() => {
    renderNotesIntoTaskArray();
}, 100);
}

function renderTaskOverlay(i) {
  const taskOverlay = document.getElementById('taskOverlay')
  toggleTaskNoteOverlay();
  taskOverlay.innerHTML = getTaskOverlay(taskArray[i], i);
  renderAssignedToContacts(taskArray[i]);
  renderSubtasks(taskArray[i]);
}

const addTaskViewToFirebase = () => {
  const title = document.getElementById("titleInputId").value;
  const description = document.getElementById("descriptionInputId").value;
  const dueDate = document.getElementById("dateInput").value;
  const taskObject = {
    title: title,
    description: description,
    assignedTo: contactArrayAddTask,
    dueDate: dueDate,
    prio: selectedPriority,
    category: selectedCategory,
    subtasks: subtasksArray,
    area: "toDo",
  };
  postData("/tasks", taskObject);
  resetInputAddTask();
  toggleAddTaskOverlay();
  renderNotesIntoTaskArray();
};

const addTaskToFirebase = () => {
  const title = document.getElementById("titleInputId").value;
  const description = document.getElementById("descriptionInputId").value;
  const dueDate = document.getElementById("dateInput").value;
  const taskObject = {
    title: title,
    description: description,
    assignedTo: contactArrayAddTask,
    dueDate: dueDate,
    prio: selectedPriority,
    category: selectedCategory,
    subtasks: subtasksArray,
    area: "toDo",
  };
  postData("/tasks", taskObject);
  resetInputAddTask();
  toggleAddTaskOverlay();
  renderNotesIntoTaskArray();
};

const resetInputAddTask = () => {
  document.getElementById("titleInputId").value = "";
  document.getElementById("descriptionInputId").value = "";
  document.getElementById("dateInput").value = "";
  contactArrayAddTask = [];
  selectedCategory = "medium";
  subtasksArray = [];
};

function updateInputValue() {
  const selectElement = document.getElementById("categorySelect");
  selectedCategory = selectElement.value;
}

const toggleArrow = () => {
  document
    .getElementById("dropDowmArrowCategoryId")
    .classList.toggle("turnArrow");
};

function toggleTaskNoteOverlay() {
  const overlay = document.getElementById("taskOverlay");
  document.querySelector('.grayBackground').classList.toggle('d_none')
  if (overlay.classList.contains("d_none")) {
    resetInputAddTask();
    overlay.classList.remove("d_none");
    overlay.classList.remove("slide-out");
    overlay.classList.add("slide-in");
  } else {
    overlay.classList.remove("slide-in");
    overlay.classList.add("slide-out");
    setTimeout(() => {
      overlay.classList.add("d_none");
      overlay.classList.remove("slide-out");
    }, 500);
  }
}

function toggleEditOverlay() {
  const editOverlay = document.getElementById("overlayEditContact");
  if (editOverlay.classList.contains("d_none")) {
    editOverlay.classList.remove("slide-out");
    editOverlay.classList.add("slide-in");
  } else {
    editOverlay.classList.add("slide-out");
    editOverlay.classList.remove("slide-in");
    setTimeout(() => {
      editOverlay.classList.add("d_none");
      editOverlay.classList.remove("slide-out");
    }, 1000);
  }
}


const searchTask = async () => {
  const inputValue = document.getElementById('inputSearchBar').value.toLowerCase();
  const todo = document.getElementById("contentTodo");
  const progress = document.getElementById("contentProgress");
  const feedback = document.getElementById("contentFeedback");
  const done = document.getElementById("contentDone");
  const databaseJson = await loadData("/tasks");


  todo.innerHTML = "";
  progress.innerHTML = "";
  feedback.innerHTML = "";
  done.innerHTML = "";

  taskArray = [];
  if (databaseJson) {
    taskArray.length = 0;

    Object.keys(databaseJson).forEach((key) => {
      taskArray.push({
        id: key,
        title: databaseJson[key].title,
        description: databaseJson[key].description,
        assignedTo: databaseJson[key].assignedTo,
        dueDate: databaseJson[key].dueDate,
        prio: databaseJson[key].prio,
        category: databaseJson[key].category,
        subtasks: databaseJson[key].subtasks,
        area: databaseJson[key].area,
      });
    });
  }
  if (inputValue.length >= 2) {
    for (let index = 0; index < taskArray.length; index++) {
      const task = taskArray[index];
      if (task.title.toLowerCase().includes(inputValue)) {
        let colorCategory = "";
        if (task.category == "User Story") {
          colorCategory = "#0038FF";
        } else {
          colorCategory = "#1FD7C1";
        }
        switch (task.area) {
          case "toDo":
            todo.innerHTML += getNoteRef(task, colorCategory);
            renderContactAssignedTo(task.assignedTo);
            updateProgressBar(index);
            break;
          case "progress":
            progress.innerHTML += getNoteRef(task, colorCategory);
            renderContactAssignedTo(task.assignedTo);
            updateProgressBar(index);
            break;
          case "feedback":
            feedback.innerHTML += getNoteRef(task, colorCategory);
            renderContactAssignedTo(task.assignedTo);
            updateProgressBar(index);
            break;
          case "done":
            done.innerHTML += getNoteRef(task, colorCategory);
            renderContactAssignedTo(task.assignedTo);
            updateProgressBar(index);
            break;
        }
      }
    }
  }
}

