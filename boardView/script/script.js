let subtasksArray = [];
let contactArrayAddTask = [];
let selectedPriority = null;
let selectedCategory = "";
let taskArray = [];

let currentDraggedElement;

function updateTaskList() {
const contentTodo = taskArray.filter(t => t['area'] === 'contentTodo');
document.getElementById('contentTodo').innerHTML = '';

for (let index = 0; index < contentTodo.length; index++) {
  const element = contentTodo[index];
  document.getElementById('contentTodo').innerHTML += generateTodoHTML(element);
}


const contentProgress = taskArray.filter(t => t['area'] === 'contentProgress');
document.getElementById('contentProgress').innerHTML = '';

for (let index = 0; index < contentProgress.length; index++) {
  const element = contentProgress[index];
  document.getElementById('contentProgress').innerHTML += generateTodoHTML(element);
}


const contentFeedback = taskArray.filter(t => t['area'] === 'contentFeedback');
document.getElementById('contentFeedback').innerHTML = '';

for (let index = 0; index < contentFeedback.length; index++) {
  const element = contentFeedback[index];
  document.getElementById('contentFeedback').innerHTML += generateTodoHTML(element);
}


const contentDone = taskArray.filter(t => t['area'] === 'contentDone');
document.getElementById('contentDone').innerHTML = '';

for (let index = 0; index < contentDone.length; index++) {
  const element = contentDone[index];
  document.getElementById('contentDone').innerHTML += getNoteRef(element, task);
}
}

function startDragging() {
  currentDraggedElement = id;
}

function moveTo(area) {
  taskArray[currentDraggedElement]['area'] = area;
}

function dragAndDropHighlight(id) {
  document.getElementById(id).classList.add('contentdragAndDrop');
}

function getNoteRef(element,task) {
  return /*html*/ `
            <div draggable="true" ondragstart="startDragging(${element['id']})" class="boardNotes" onclick="renderTaskOverlay()">
              <div class="boardNotesContent">
                <div class="boardNotesCategory">
                  <p>${task.category}</p>
                </div>
                <div class="boardTitle">${task.title}</div>
                <div class="boardDescription">${task.description}</div>

                <div id="subtask-div" >
                  <progress id="progressBar" class="subtaskLoadingBar" value="0" max="100"></progress>
                  <div id="subtaskAmount" class="subtaskList">${task.subtask}</div>
                </div>

                <div class="boardNotesFooter">
                  <div class="boardNotesContacts">
                  ${task.description}
                  </div>
                  <div class="boardNotesPrio">${task.prio}</div>
                </div>
              </div>
            </div>`;
}

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
  subtasksArray.push(inputField);
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
            todo.innerHTML += getNoteRef(task, index, colorCategory);
            renderContactAssignedTo(people, index);
            break;
          case "progress":
            progress.innerHTML += getNoteRef(task, index, colorCategory);
            renderContactAssignedTo(people, index);
            break;
          case "feedback":
            feedback.innerHTML += getNoteRef(task, index, colorCategory);
            renderContactAssignedTo(people, index);
            break;
          case "done":
            done.innerHTML += getNoteRef(task, index, colorCategory);
            renderContactAssignedTo(people, index);
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
  const content = document.getElementById('assignedToPeopleId');
  persons.forEach(person => {
    let color = getColorForName(person.name)
    const initials = person.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    content.innerHTML += getPersonLogo(initials, color);
  })
}

// TODO
function searchTaskNotes() {
  document.getElementById("input").addEventListener("input", function () {
    let lowCase = this.value.toLowerCase();
    const noResults = document.getElementById("tooltip");
    let hasResults = false;

    taskArray.taskNotes.forEach((taskNote) => {
      let title = taskNote.getAttribute("title").toLowerCase();
      let description = taskNote.getAttribute("description").toLowerCase();
      if (title.includes(lowCase) || description.includes(lowCase)) {
        taskNote.style.display = "";
        hasResults = true;
      } else {
        taskNote.style.display = "none";
      }
    });

    if (hasResults) {
      noResults.style.opacity = "0";
    } else {
      noResults.style.opacity = "1";
    }
  });
}

// TODO
function updateProgress() {
  const subtaskAmount = document.getElementById("subtaskAmount");
  const totalTasks = subtasksArray.length;
  const subtaskDiv = document.getElementById("subtask-div");

  if (totalTasks === 0) {
    subtaskDiv.style.display = "none";
    return;
  } else {
    subtaskDiv.style.display = "block";
  }

  const completedTasks = 0;

  subtasksArray.forEach((task) => {
    const checkbox = document.getElementById(task.id);
    if (checkbox.checked) completedTasks++;
  });
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const progress = document.getElementById("progressBar");
  progress.style.width = progressPercentage + "%";

  subtaskAmount.innerText = `${completedTasks}/${totalTasks} Subtasks`;
}

const renderSubtask = () => {
  const subTaskContent = document.getElementById("subtasksContentId");
  subTaskContent.innerHTML = "";
  for (let index = 0; index < subtasksArray.length; index++) {
    const task = subtasksArray[index];
    subTaskContent.innerHTML += getSubtask(task, index);
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

function renderTaskOverlay() {
  const taskOverlay = document.getElementById('taskOverlay')
  toggleTaskNoteOverlay();
  taskOverlay.innerHTML = getTaskOverlay();
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
  selectedPriority = "middle";
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
