let contactsArray = [];
let href = "";

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

const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePhoneInput(input) {
    input.value = input.value.replace(/\D/g, '');
}

const createContact = () => {
    const name = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    const phone = document.getElementById('inputPhone').value;

    if (!validateEmail(email)) {
        document.getElementById('inputEmail').value = "";
        alert('Bitte eine gültige E-Mail-Adresse eingeben.');
        return;
    }

    if (!/^\d+$/.test(phone)) {
        alert('Die Telefonnummer darf nur Zahlen enthalten.');
        return;
    }

    const contact = { name: name, email: email, phone: phone };
    document.getElementById('inputName').value = "";
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputPhone').value = "";
    postData('/contacts', contact);
    renderContacts();
    toggleOverlay();
};

function loadContactsView() {
    fetch('../contactsView/index.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentArea').innerHTML = data;
            renderContacts();
        })
        .catch(error => console.error('Error loading content:', error));
}

function loadBoardView() {
    fetch('../boardView/index.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentArea').innerHTML = data;
            renderNotesIntoTaskArray();
        })
        .catch(error => console.error('Error loading content:', error));
}

function loadAddTaskView() {
    fetch('../addTask/index.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentArea').innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

function loadSummaryView() {
    fetch('../summaryView/index.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentArea').innerHTML = data;
            loadTaskInfos();
        })
        .catch(error => console.error('Error loading content:', error));
}

const loadTaskInfos = async () => {
    const todoCount = document.getElementById('todoCountId');
    const doneCount = document.getElementById('doneCountId');
    const deadline = document.getElementById('urgentDeadlineId');
    const tasksCount = document.getElementById('taskCountId');
    const progressCount = document.getElementById('progressCountId');
    const awaitingFeedbackCount = document.getElementById('awaitingFeedbackCountId');
    const name = document.getElementById('profileNameId');
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser) {
        name.innerText = currentUser.name;
    }
    try {
        const taskData = await loadData("/tasks");
        const tasks = Object.values(taskData)
            .filter(task => task.title && task.dueDate && task.area)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const filterTodoTasks = tasks.filter(task => task.area == "toDo");
        const filterDoneTasks = tasks.filter(task => task.area == "done");
        const filterTasksInProgress = tasks.filter(task => task.area == "progress");
        const filterFeedbackTasks = tasks.filter(task => task.area == "feedback");
        const mostUrgentTask = tasks.reduce((earliest, currentTask) => {
            return new Date(currentTask.dueDate) < new Date(earliest.dueDate) ? currentTask : earliest;
        }, tasks[0]);

        if (mostUrgentTask) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            deadline.textContent = new Date(mostUrgentTask.dueDate).toLocaleDateString('en-US', options);
        } else {
            console.log("Keine Aufgaben gefunden.");
        }

        todoCount.innerText = filterTodoTasks.length;
        doneCount.innerText = filterDoneTasks.length;
        tasksCount.innerText = tasks.length;
        progressCount.innerText = filterTasksInProgress.length;
        awaitingFeedbackCount.innerText = filterFeedbackTasks.length;

    } catch (error) {
        console.error("Failed to load Tasks in summaryView: " + error);
    }
}

const renderContacts = async () => {
    try {
        const databaseJson = await loadData('/contacts');
        const content = document.getElementById('contactsContent');
        content.innerHTML = "";

        const contacts = Object.values(databaseJson)
            .filter(contact => contact.name && contact.email && contact.phone)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (databaseJson) {
            Object.keys(databaseJson).forEach(key => {
                contactsArray.push({
                    id: key,
                    name: databaseJson[key].name,
                    email: databaseJson[key].email,
                    phone: databaseJson[key].phone
                })
            })
        }

        let currentLetter = '';
        contacts.forEach((contact, index) => {
            const firstLetter = contact.name.charAt(0).toUpperCase();

            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                content.innerHTML += `<h2 style="margin-left: 33px" class="contactCategory">${currentLetter}</h2><hr>`;
            }

            content.innerHTML += getContact(contact, index);
        });
    } catch (error) {
        console.error('Failed to load contacts', error);
    }
};

const toggleContactExtended = (index) => {
    const contactExtendedDiv = document.getElementById('contactInfoExtendet');
    contactExtendedDiv.classList.toggle('d_none')
    if (!contactExtendedDiv.classList.contains('d_none')) {
        renderContactExtendet(index)
    } else {
        contactExtendedDiv.innerHTML = ""
    }
}

const renderContactExtendet = async (index) => {
    const databaseJson = await loadData('/contacts');
    const contacts = Object.values(databaseJson)
        .filter(contact => contact.name && contact.email && contact.phone)
        .sort((a, b) => a.name.localeCompare(b.name));
    const person = contacts[index];
    const color = colors[index % colors.length];
    const initials = person.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    const content = document.getElementById('contactInfoExtendet');
    content.innerHTML = "";
    content.innerHTML += getContactExtended(person, initials, color);
}

const deleteContact = async (person) => {
    const selectedPerson = contactsArray.find(contact => contact.name === person);

    if (selectedPerson) {
        await deleteData(`/contacts/${selectedPerson.id}`);
        contactsArray = contactsArray.filter(contact => contact.name !== person);
        renderContacts();
    }
};

function toggleOverlay() {
    const overlay = document.getElementById('overlayId');
    const rightSide = document.getElementById('headerId');
    const leftSide = document.getElementById('leftSideId');

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
};

const navigateToNavHeader = (link) => {
    sessionStorage.setItem("navigateTo", link);
    window.location.href = "../header-navbar/index.html";
};

document.addEventListener("DOMContentLoaded", () => {
    const href = sessionStorage.getItem("navigateTo");

    switch (href) {
        case "../contactsView/index.html":
            loadContactsView();
            break;
        case "../boardView/index.html":
            loadBoardView();
            break;
        case "../addTask/index.html":
            loadAddTaskView();
            break;
        case "../summaryView/index.html":
            loadSummaryView();
            break;
        default:
            loadSummaryView();
            break;
    }

    sessionStorage.removeItem("navigateTo");
});

function toggleEditOverlay(name, initials, color) {
    const overlay = document.getElementById('overlayEditContact');
    const rightSide = document.getElementById('rightSideId');
    const leftSide = document.getElementById('leftSideId');

    if (overlay.classList.contains('d_none')) {
        overlay.classList.remove('d_none');
        overlay.classList.remove('slide-out');
        overlay.classList.add('slide-in');
        renderEditContactOverlay(name, initials, color);
    } else {
        overlay.classList.remove('slide-in');
        overlay.classList.add('slide-out');

        setTimeout(() => {
            overlay.classList.add('d_none');
            overlay.classList.remove('slide-out');
        }, 1000);
    }
};