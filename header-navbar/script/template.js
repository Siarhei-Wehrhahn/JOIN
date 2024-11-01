const getContact = (person, index) => {
    const nameParts = person.name.split(' ').slice(0, 2);
    const initials = nameParts.map(n => n[0]).join('');
    const color = colors[index % colors.length];

    return /*html*/`
        <div class="contact" onclick='toggleContactExtended(${index})'>
            <div class="contactPhotoDiv">
                <div class="contactInitials" style="background-color: ${color};">${initials}</div>
            </div>
            <div class="contactWithEmail">
                <p class="personName">${person.name}</p>
                <p class="emailAdress">${person.email}</p>
            </div>
        </div>`;
};

const getContactExtended = (person, initials, color) => {
    return /*html*/`
    <div class="contactExtendDiv">
        <div class="contactName">
            <div class="contactPhotoExtendedDiv">
                <div class="contactInitialsExtended" style="background-color: ${color};">${initials}</div>
            </div>
            <div class="rightSectionContact">
                <div class="contactName">
                    <p class="personNameExtended">${person.name}</p>
                </div>
            <div class="singleContactButtons">
                <div class="singleContactEdit" onclick="toggleEditOverlay('${person.name}', '${initials}', '${color}')">
                    <img onclick="renderOverlay()" src="../assets/icon/edit.svg" alt="edit pic">
                    <p>Edit</p>
                </div>
                <div class="singleContactEdit" onclick="deleteContact('${person.name}')">
                    <img src="../assets/icon/delete.svg" alt="trashcan">
                    <p>Delete</p>
                </div>
                </div>
            </div>
        </div>
        <div class="contactInfo">

        </div>
        <div class="contactInformation">
        <h3 class="contactInfoHeader">Contact Information</h3>
        <div class="contactMailAndPhone">
            <h3>Email</h3>
            <p class="emailAdress">${person.email}</p>
            <h3>Phone</h3>
            <p class="phoneNumber">${person.phone}</p>
        </div>
        </div>
    </div>`
};