


//TODO: function zu ende schreiben 
const renderContacts = async () => {
    try {
        const databaseJson = await loadData('/Contacts')
        console.log(databaseJson);
        const content = document.getElementById('contactsContent')
        content.innerHTML = ""
        databaseJson[0].forEach(contact => {
            content.innerHTML += getContact(contact)
        });
    } catch(error) {
        console.error('Faild to load data', error);
    }
}

const getContact = (person) => {
    const initials = contact.name.split(' ').map(n => n[0]);

    return /*html*/`
        <div class="contact">
            <div class="contactPhotoDiv">
                <div class="contactInitials">${initials}</div>
            </div>
            <div class="contactWithEmail">
                <p class="personName">${person.name}</p>
                <p class="emailAdress">${person.email}</p>
            </div>
        </div>`
}