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
    updateCheckboxes();
  } else {
    contentArea.classList.toggle("d_none");
    arrow.classList.toggle("turnArrow");
  }
};

const addContactToArray = async (index) => {
  const loadContacts = await loadData('/contacts');
  const contacts = Object.values(loadContacts)
    .filter(contact => contact.name && contact.email && contact.phone)
    .sort((a, b) => a.name.localeCompare(b.name));

  const contact = contacts[index];
  let contactIndex = contactArrayAddTask.findIndex(c => c.email === contact.email);

  if (contactIndex === -1) {
    contactArrayAddTask.push(contact);
  } else {
    contactArrayAddTask.splice(contactIndex, 1);
  }

  document.querySelector(`#checkbox-${index}`).checked = contactIndex === -1;
};

const updateCheckboxes = async () => {
  const loadContacts = await loadData('/contacts');
  const contacts = Object.values(loadContacts)
    .filter(contact => contact.name && contact.email && contact.phone)
    .sort((a, b) => a.name.localeCompare(b.name));

  contacts.forEach((contact, index) => {
    const isSelected = contactArrayAddTask.some(c => c.email === contact.email);
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

const getOverlayAddTask = (user, initials, index) => {
  const color = colors[index % colors.length];
  return /*html*/`
    <div class="contact">
      <p id="initialsOverlay" style="background-color: ${color};">${initials}</p>
      <p id="contactName">${user.name}</p>
      <form>
        <input onchange="addContactToArray(${index})" 
               type="checkbox" 
               class="contact-checkbox" 
               id="checkbox-${index}" 
               data-index="${index}">
      </form>
    </div>
  `;
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
  try {
    const databaseJson = await loadData("/tasks");
    const todo = document.getElementById("contentTodo");
    const progress = document.getElementById("contentProgress");
    const feedback = document.getElementById("contentFeedback");
    const done = document.getElementById("contentDone");

    todo.innerHTML = "";
    progress.innerHTML = "";
    feedback.innerHTML = "";
    done.innerHTML = "";

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
          area: databaseJson[key].area,
        });
      });

      for (let index = 0; index < taskArray.length; index++) {
        const task = taskArray[index];
        switch (task.area) {
          case 'toDo':
            todo.innerHTML += getNoteRef(task);
            break;
          case 'progress':
            progress.innerHTML += getNoteRef(task);
            break;
          case 'feedback':
            feedback.innerHTML += getNoteRef(task);
            break;
          case 'done':
            done.innerHTML += getNoteRef(task);
            break;
          default:
            todo.innerHTML = /*html*/`<div class="no-task">No tasks To do</div>`;
            progress.innerHTML = /*html*/`<div class="no-task">No tasks in progress</div>`;
            feedback.innerHTML = /*html*/`<div class="no-task">No tasks in feedback</div>`;
            done.innerHTML = /*html*/`<div class="no-task">No tasks done</div>`;
        }
      }
    } else {
      todo.innerHTML = /*html*/`<div class="no-task">No tasks To do</div>`;
      progress.innerHTML = /*html*/`<div class="no-task">No tasks in progress</div>`;
      feedback.innerHTML = /*html*/`<div class="no-task">No tasks in feedback</div>`;
      done.innerHTML = /*html*/`<div class="no-task">No tasks done</div>`;
    }
  } catch (error) {
    console.error("Failed to load tasks in renderNotes", error);
    content.innerHTML =
      "<p>Fehler beim Laden der Aufgaben. Bitte versuchen Sie es später erneut.</p>";
  }
};

function getNoteRef(task) {
  return /*html*/ `
            <div draggable="true" ondragstart="drag(event)" class="boardNotes" onclick="renderTaskOverlay()">
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

// TODO
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
  document.getElementById("editInput").value = subtasksArray[index];
};

const saveEditSubtask = (i) => {
  const editSubtask = document.getElementById("editInput").value;
  subtasksArray[i] = editSubtask;
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

function renderTaskOverlay(){
  const taskOverlay = document.getElementById('taskOverlay')
  toggleTaskNoteOverlay();
  taskOverlay.innerHTML = getTaskOverlay();
}

function getTaskOverlay() {
  return /*html*/ `
<div class="taskOverlayContent"> 

  <div class="taskOverlayCategory">
    <p>Technical Task</p>
  </div>

  <div class="taskOverlayTitle">CSS Architecture Planning</div>

  <div class="taskOverlayDescription">Define CSS naming conventions and structure.</div>

 <div class="deadline-div">
  <div class="taskOverlaydeadline">Due date:</div>
  <div class="taskOverlaydeadlineContent">02/09/2023</div>
 </div>

 <div class="priority-div">
  <div class="taskOverlaypriority">Priority:</div>
  <div class="taskOverlayPriorityContent">Urgent</div>
 </div>

  <div class="assigned-to-div">
    <div class="taskOverlayassigned-to">Assigned To:</div>
    <div class="taskOverlayassigned-toContent"></div>
  </div>

  <div class="subtasks-div">
    <div class="taskOverlaysubtasks">Subtasks:</div>
    <div class="taskOverlaysubtasksContent"></div>
  </div>

  <div class="taskOverlay-edit-delete">
    <div class="taskOverlayDelete">
      <svg class="delete-button" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_379_4227" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_379_4227)">
        <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="black"/>
        </g>
        </svg>
        <p>Delete</p>
    </div>

    <div class="middle-line"></div>

    <div class="taskOverlayEdit">
      <svg class="edit-button" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_379_1603" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_379_1603)">
        <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="black" />
        </g>
        </svg>
        <p>Edit</p>
    </div>

  </div>

</div>
  `;
}

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
  selectedCategory = "";
  subtasksArray = [];
};

function updateInputValue() {
  const selectElement = document.getElementById("categorySelect");
  selectedCategory = selectElement.value;
  console.log("Selected Category:", selectedCategory);
}

const toggleArrow = () => {
  document
    .getElementById("dropDowmArrowCategoryId")
    .classList.toggle("turnArrow");
};

function toggleTaskNoteOverlay() {
  const overlay = document.getElementById('taskOverlay');
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