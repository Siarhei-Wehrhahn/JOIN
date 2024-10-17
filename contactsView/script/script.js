


//TODO: function zu ende schreiben 
const renderContacts = async () => {
    try {
        const databaseJson = await loadData('/contacts');
        console.log(databaseJson);
        const content = document.getElementById('contactsContent');
        content.innerHTML = "";
        const contacts = Object.values(databaseJson);
        for (let index = 0; index < contacts.length; index++) {
            const element = contacts[index];
            if (element.name && element.email && element.phone) {
                content.innerHTML += getContact(element);
            }
        }
    } catch (error) {
        console.error('Failed to load data', error);
    }
};

const getContact = (person) => {
    const initials = person.name.split(' ').map(n => n[0]).join(''); 
    return /*html*/`
        <div class="contact">
            <div class="contactPhotoDiv">
                <div class="contactInitials">${initials}</div>
            </div>
            <div class="contactWithEmail">
                <p class="personName">${person.name}</p>
                <p class="emailAdress">${person.email}</p>
            </div>
        </div>`;
};

window.onload = renderContacts