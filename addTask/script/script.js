let subtasksArray = [];
let contactArrayAddTask = [];
let selectedPriority = null;
let selectedCategory = "";
let taskArray = [];

const colors = [
  '#FF5733', // Rot-Orange
  '#33FF57', // Grün
  '#3357FF', // Blau
  '#FF33A6', // Pink
  '#FFBD33', // Gelb
  '#33FFF5', // Türkis
  '#A633FF', // Lila
  '#FF3333', // Rot
  '#33FF33', // Hellgrün
  '#3333FF'  // Dunkelblau
];

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
      subtasks: subtaskArray,
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
    subtaskArray = [];
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