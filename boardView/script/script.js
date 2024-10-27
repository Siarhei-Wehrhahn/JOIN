let subtaskArray = [];

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

let selectedPriority = null;

function selectPriority(priority) {
  const urgentButton = document.getElementById('urgent-button');
  const urgentText = document.getElementById('urgentText');
  const urgentIcon = document.getElementById('urgentIcon');
  const mediumButton = document.getElementById('medium-button');
  const mediumText = document.getElementById('mediumText');
  const mediumIcon = document.getElementById('mediumIcon');
  const lowButton = document.getElementById('low-button');
  const lowText = document.getElementById('lowText');
  const lowIcon = document.getElementById('lowIcon');
  if (selectedPriority === priority) {
    urgentButton.classList.remove('redButton');
    urgentText.classList.remove('whiteText');
    urgentIcon.classList.remove('whiteIcon');
    mediumButton.classList.remove('orangeButton');
    mediumText.classList.remove('whiteText');
    mediumIcon.classList.remove('whiteIcon');
    lowButton.classList.remove('greenButton');
    lowText.classList.remove('whiteText');
    lowIcon.classList.remove('whiteIcon');
    selectedPriority = null;
    console.log('Priority deselected');
    return;
  }
  urgentButton.classList.remove('redButton');
  urgentText.classList.remove('whiteText');
  urgentIcon.classList.remove('whiteIcon');
  mediumButton.classList.remove('orangeButton');
  mediumText.classList.remove('whiteText');
  mediumIcon.classList.remove('whiteIcon');
  lowButton.classList.remove('greenButton');
  lowText.classList.remove('whiteText');
  lowIcon.classList.remove('whiteIcon');
  if (priority === 'urgent') {
    urgentButton.classList.add('redButton');
    urgentText.classList.add('whiteText');
    urgentIcon.classList.add('whiteIcon');
  } else if (priority === 'medium') {
    mediumButton.classList.add('orangeButton');
    mediumText.classList.add('whiteText');
    mediumIcon.classList.add('whiteIcon');
  } else if (priority === 'low') {
    lowButton.classList.add('greenButton');
    lowText.classList.add('whiteText');
    lowIcon.classList.add('whiteIcon');
  }
  selectedPriority = priority;
  console.log(`Selected priority: ${selectedPriority}`);
}

const toggleContactSelection = () => {
  const contentArea = document.getElementById('contactRender');
  const arrow = document.querySelector('.dropDownArrow')
  if (contentArea.classList.contains('d_none')) {
    contentArea.classList.toggle('d_none');
    arrow.classList.toggle('turnArrow');
    renderAddTaskOverlay();
  } else {
    contentArea.classList.toggle('d_none');
    arrow.classList.toggle('turnArrow');
  }
}

const renderAddTaskOverlay = async () => {
  const loadContacts = await loadData('/contacts');
  const contacts = Object.values(loadContacts)
    .filter(contact => contact.name && contact.email && contact.phone)
    .sort((a, b) => a.name.localeCompare(b.name));
  const overlay = document.getElementById('contactRender');
  overlay.innerHTML = "";

  for (let index = 0; index < contacts.length; index++) {
    const person = contacts[index];
    const initials = person.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    overlay.innerHTML += getOverlayAddTask(person, initials, randomColor);
  }
}

const getOverlayAddTask = (user, initials, color) => {
  return /*html*/`
            <div class="contact">
              <p id="initialsOverlay" style="background-color: ${color};">${initials}</p>
              <p id="contactName">${user.name}</p>
              <form>
                <input type="checkbox" id="exampleCheckbox" name="exampleCheckbox">
              </form>
            </div>
      `;
}

function toggleAddTaskOverlay() {
  const overlay = document.getElementById('overlayAddTask');
  if (overlay.classList.contains('d_none')) {
    overlay.classList.remove('d_none');
    overlay.classList.remove('slide-out');
    overlay.classList.add('slide-in');
  } else {
    overlay.classList.remove('slide-in');
    overlay.classList.add('slide-out');
    setTimeout(() => {
      overlay.classList.add('d_none');
      overlay.classList.remove('slide-out');
    }, 1000);
  }
}

function triggerInputButtons() {
  const inputField = document.getElementById('subtaskInputId');
  const buttons = document.getElementById('deleteOrSave');
  const addIcon = document.getElementById('addIconId');

  if (inputField.value.length > 0) {
    buttons.classList.remove('d_none');
    buttons.classList.add('deleteOrSaveBtn');
    addIcon.classList.add('d_none');
  } else if (inputField.value.length <= 0) {
    buttons.classList.add('d_none');
    buttons.classList.remove('deleteOrSaveBtn');
    addIcon.classList.remove('d_none');
  }
}

const deleteInput = () => {
  document.getElementById('subtaskInputId').value = "";
  triggerInputButtons();
}

const addSubtaskToArray = () => {
  const inputField = document.getElementById('subtaskInputId').value;
  subtaskArray.push(inputField);
  deleteInput();
  renderSubtask();
}

const deleteSubtask = (i) => {
  subtaskArray.splice(i, 1)
  renderSubtask();
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
  return /*html*/`
      <div class="subtaskSingle">
        <p>ּ• ${ taskName}</p>
        <div class="editDeleteButtons">
          <img class="pointer" onclick="editSubtask(${index})" src="../assets/icon/edit.svg" alt="">
          <div class="smallLine"></div>
          <img class="pointer" onclick="deleteSubtask(${index})" src="../assets/icon/delete.svg" alt="">
        </div>
      </div>
  `
}
const editSubtask = (index) => {
  const subTaskContent = document.getElementById('subtasksContentId');
  subTaskContent.innerHTML = "";
  subTaskContent.innerHTML = getEditSubtask(index);
  document.getElementById('editInput').value = subtaskArray[index];
}

//TODO löschen funktion in der edit funktion geht nicht richtig und die addTask function

const saveEditSubtask = (i) => {
  const editSubtask = document.getElementById('editInput').value;
  subtaskArray[i] = editSubtask;
  renderSubtask();
} 

const getEditSubtask = (index) => {
  return /*html*/`
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
  `
}