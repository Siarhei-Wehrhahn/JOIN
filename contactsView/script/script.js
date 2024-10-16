


//TODO: function zu ende schreiben 
const renderContacts = async () => {
    try {
        const databaseJson = await loadData('/contacts')
        console.log(databaseJson);
        const content = document.getElementById('contactsContent')
        content.innerHTML = ""
        for (let index = 0; index < databaseJson.length; index++) {
            const element = databaseJson[index];
            content.innerHTML += getContact(element);
        }
    } catch(error) {
        console.error('Faild to load data', error);
    }
}

const getContact = (person) => {
    const initials = person.name.split(' ').map(n => n[0]);

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