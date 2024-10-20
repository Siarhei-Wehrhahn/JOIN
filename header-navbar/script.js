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

const createContact = () => {
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const phone = document.getElementById('inputPhone').value;
    const contact = { name: name, email: email, phone: phone };
    document.getElementById('inputName').value = "";
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputPhone').value = "";
    postData('/contacts', contact);
    renderContacts();
    toggleOverlay();
}

function loadContactsView() {
    fetch('../contactsView/index.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentArea').innerHTML = data;
            renderContacts();
        })
        .catch(error => console.error('Error loading content:', error));
}

const renderContacts = async () => {
    try {
        const databaseJson = await loadData('/contacts'); 
        const content = document.getElementById('contactsContent');
        content.innerHTML = "";

        const contacts = Object.values(databaseJson)
            .filter(contact => contact.name && contact.email && contact.phone)
            .sort((a, b) => a.name.localeCompare(b.name));

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

const getContact = (person, index) => {
    const nameParts = person.name.split(' ').slice(0, 2);
    const initials = nameParts.map(n => n[0]).join('');
    const color = colors[index % colors.length];
    
    return /*html*/`
        <div class="contact" onclick='renderContactExtendet(${index})'>
            <div class="contactPhotoDiv">
                <div class="contactInitials" style="background-color: ${color};">${initials}</div>
            </div>
            <div class="contactWithEmail">
                <p class="personName">${person.name}</p>
                <p class="emailAdress">${person.email}</p>
            </div>
        </div>`;
}; 

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


const getContactExtended = (person, initials, color) => {
    return /*html*/`
    <div class="contactExtendDiv">
        <div class="contactName">
            <div class="contactPhotoDiv">
                <div class="contactInitials" style="background-color: ${color};">${initials}</div>
            </div>
            <div class="contactName">
            <p class="personName">${person.name}</p>
            </div>
            <div class="singleContactButtons">
                <div class="singleContactEdit">
                    <img src="../assets/icon/edit.svg" alt="edit pic">
                    <p>Edit</p>
                </div>
                <div class="singleContactDelete">
                    <img src="../assets/icon/delete.svg" alt="trashcan">
                    <p>Delete</p>
                </div>
            </div>
        </div>
        <div class="contactInfo">

        </div>
        <div class="contactMailAndPhone">
            <p>Email</p>
            <p class="emailAdress">${person.email}</p>
            <p>Phone</p>
            <p class="phoneNumber">${person.phone}</p>
        </div>
    </div>
    `
};


function toggleOverlay() {
    const overlay = document.getElementById('overlayId');
    const rightSide = document.getElementById('rightSideId');
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

window.onload = () => {
    loadContactsView();
};

function toggleEditOverlay(){ 
    const overlay = document.getElementById('overlayEditContact');
    const rightSide = document.getElementById('rightSideId');
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

// async function singleContactEdit(){ //opens Edit Overlay 

// };

// function singleContactSave(){ //saves the Contact

// };

// async function singleContactDelete(){ //deletes teh Contact

window.onload = () => {
    loadContactsView();
};
