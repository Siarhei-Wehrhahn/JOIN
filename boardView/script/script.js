let subtaskArray = [];
let contactArrayAddTask = [];
let selectedPriority = null;
let selectedCategory = '';
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
    console.log("Priority deselected");
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
  console.log(`Selected priority: ${selectedPriority}`);
}

const toggleContactSelection = () => {
  const contentArea = document.getElementById("contactRender");
  const arrow = document.querySelector(".dropDownArrow");
  if (contentArea.classList.contains("d_none")) {
    contentArea.classList.toggle("d_none");
    arrow.classList.toggle("turnArrow");
    renderAddTaskOverlay();
  } else {
    contentArea.classList.toggle("d_none");
    arrow.classList.toggle("turnArrow");
  }
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
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    overlay.innerHTML += getOverlayAddTask(person, initials, randomColor, index);
  }
};

const getOverlayAddTask = (user, initials, color, index) => {
  return /*html*/`
            <div class="contact">
              <p id="initialsOverlay" style="background-color: ${color};">${initials}</p>
              <p id="contactName">${user.name}</p>
              <form>
                <input onchange="addContactToArray(${index})" type="checkbox" id="exampleCheckbox" name="exampleCheckbox">
              </form>
            </div>
      `;
};

const addContactToArray = async (index) => {
  const loadContacts = await loadData('/contacts');
  const contacts = Object.values(loadContacts)
    .filter(contact => contact.name && contact.email && contact.phone)
    .sort((a, b) => a.name.localeCompare(b.name));
  const contact = contacts[index];
  let contactIndex = contactArrayAddTask.findIndex(c => c.email === contact.email);

  if (contactIndex == -1 || contactArrayAddTask[contactIndex].email != contact.email) {
    contactArrayAddTask.push(contact);
  } else {
    contactArrayAddTask.splice(contactIndex, 1);
  }
}

function toggleAddTaskOverlay() {
  const overlay = document.getElementById("overlayAddTask");
  if (overlay.classList.contains("d_none")) {
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
  subtaskArray.push(inputField);
  deleteInput();
  renderSubtask();
};

const deleteSubtask = (i) => {
  subtaskArray.splice(i, 1);
  renderSubtask();
};

const renderNotesIntoTaskArray = async () => {
  try {
    const databaseJson = await loadData("/tasks");
    const todo = document.getElementById("contentTodo");
    todo.innerHTML = "";

    if (databaseJson) {
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
          area: databaseJson[key].area
        });
      });

      for (let index = 0; index < taskArray.length; index++) {
        const task = taskArray[index];
        todo.innerHTML += getNoteRef(task);
      }
    } else {
      todo.innerHTML = /*html*/`<div class="no-task">No tasks To do</div>`
    }
  } catch (error) {
    console.error("Failed to load tasks in renderNotes", error);
    content.innerHTML =
      "<p>Fehler beim Laden der Aufgaben. Bitte versuchen Sie es später erneut.</p>";
  }
};

function getNoteRef(task) {
  return /*html*/ `
            <div draggable="true" ondragstart="drag(event) class="boardNotesCategory">
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
            </div>`
}

function searchTaskNotes() {
  document.getElementById("input").addEventListener("input", function () {
    let lowCase = this.value.toLowerCase();
    const noResults = document.getElementById("tooltip");
    let hasResults = false;

    taskArray.taskNotes.forEach((taskNote) => {
      let title = taskNote.getAttribute("data-title").toLowerCase();
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
  const subTaskContent = document.getElementById('subtasksContentId');
  subTaskContent.innerHTML = "";
  for (let index = 0; index < subtaskArray.length; index++) {
    const task = subtaskArray[index];
    subTaskContent.innerHTML += getSubtask(task, index)
  }
}

const getSubtask = (taskName, index) => {
  return /*html*/ `
      <div class="subtaskSingle">
        <p>ּ• ${taskName}</p>
        <div class="editDeleteButtons">
          <img class="pointer" onclick="editSubtask(${index})" src="../assets/icon/edit.svg" alt="">
          <div class="smallLine"></div>
          <img class="pointer" onclick="deleteSubtask(${index})" src="../assets/icon/delete.svg" alt="">
        </div>
      </div>
  `;
};

const editSubtask = (index) => {
  const subTaskContent = document.getElementById("subtasksContentId");
  subTaskContent.innerHTML = "";
  subTaskContent.innerHTML = getEditSubtask(index);
  document.getElementById("editInput").value = subtaskArray[index];
};

const saveEditSubtask = (i) => {
  const editSubtask = document.getElementById("editInput").value;
  subtaskArray[i] = editSubtask;
  renderSubtask();
};

const getEditSubtask = (index) => {
  return /*html*/ `
    <div class="editSubtaskDiv">
      <input type="text" id="editInput">
      <div class="editSubtask">
          <img onclick="deleteSubtask(${index})" class="pointer" src="../assets/icon/delete.svg" alt="">
          <div class="smallLine"></div>
          <svg class="pointer" onclick="saveEditSubtask(${index})" id="checkSubtasks" width="24" height="25" viewBox="0 0 24 25" fill="black" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_191_600" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
              <rect y="0.5" width="24" height="24"></rect>
            </mask>
            <g mask="url(#mask0_191_600)">
              <path d="M9.55069 15.65L18.0257 7.175C18.2257 6.975 18.4632 6.875 18.7382 6.875C19.0132 6.875 19.2507 6.975 19.4507 7.175C19.6507 7.375 19.7507 7.6125 19.7507 7.8875C19.7507 8.1625 19.6507 8.4 19.4507 8.6L10.2507 17.8C10.0507 18 9.81736 18.1 9.55069 18.1C9.28403 18.1 9.05069 18 8.85069 17.8L4.5507 13.5C4.3507 13.3 4.25486 13.0625 4.2632 12.7875C4.27153 12.5125 4.3757 12.275 4.5757 12.075C4.7757 11.875 5.0132 11.775 5.2882 11.775C5.5632 11.775 5.80069 11.875 6.00069 12.075L9.55069 15.65Z"></path>
            </g>
          </svg>
        </div>
    </div>
  `;
};

const addTaskToFirebase = () => {
  const title = document.getElementById('titleInputId').value;
  const description = document.getElementById('descriptionInputId').value;
  const dueDate = document.getElementById('dateInput').value;
  const taskObject = {
    title: title,
    description: description,
    assignedTo: contactArrayAddTask,
    dueDate: dueDate,
    prio: selectedPriority,
    category: selectedCategory,
    subtasks: subtaskArray,
    area: "toDo"
  }
  postData("/tasks", taskObject);
  title = "";
  description = "";
  contactArrayAddTask = [];
  dueDate = "";
  selectedPriority = "middle";
  selectedCategory = "";
  subtaskArray = [];
  toggleAddTaskOverlay();
  renderNotesIntoTaskArray();
}

function updateInputValue() {
  const selectElement = document.getElementById('categorySelect');
  selectedCategory = selectElement.value;
  console.log('Selected Category:', selectedCategory);
}

const toggleArrow = () => {
  document.getElementById('dropDowmArrowCategoryId').classList.toggle('turnArrow');
}

document.addEventListener('click', (event) => {
  const arrow = document.getElementById('dropDowmArrowCategoryId');
  if (!arrow.contains(event.target)) {
    arrow.classList.remove('turnArrow');
  }
});

