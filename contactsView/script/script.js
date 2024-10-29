function renderEditContactOverlay(name) {
  let overlayEditContact = document.getElementById('overlayEditContact');
  const selectedPerson = contactsArray.find(contact => contact.name === name);
  overlayEditContact.innerHTML = getEditOverlay(selectedPerson);
  document.getElementById('inputNameEdit').value = selectedPerson.name;
  document.getElementById('inputEmailEdit').value = selectedPerson.email;
  document.getElementById('inputPhoneEdit').value = selectedPerson.phone;
}

function editedContactSaveToStoredData(persoId) {
  const name = document.getElementById('inputNameEdit').value;
  const email = document.getElementById('inputEmailEdit').value;
  const phone = document.getElementById('inputPhoneEdit').value;
  let contact = { name: name, email: email, phone: phone };
  editContact(persoId, contact);
  toggleEditOverlay();
}

function getEditOverlay(person) {
  return /*html*/ `
        <div class="logoDiv">
    <div class="logo">
      <img src="/assets/icon/Capa 2.svg" alt="" />
    </div>

    <div class="margin_bottom">
      <p class="overlayBigTextExtended">Edit contact</p>
    </div>
  </div>

  <div class="addContactDiv">
    <div class="photoSelectionDiv">
      <img id="profileEditPic" src="/assets/icon/person.svg" alt="profilePic" />
    </div>
    <div class="inputFieldDiv">
      <div class="closeButton">
        <img src="/assets/icon/Close.svg" class="pointer" onclick="toggleEditOverlay()" alt="close_button" />
      </div>
      <input class="inputFields" id="inputNameEdit" type="text" placeholder="Name" />
      <input class="inputFields" id="inputEmailEdit" type="text" placeholder="Email" />
      <input class="inputFields" id="inputPhoneEdit" type="text" placeholder="Phone" oninput="validatePhoneInput(this)"  />
      <div class="buttons">
        <p class="cancelBtn" onclick="deleteContact('${person.name}')">
          Delete<img src="/assets/icon/Close.svg" alt="cancelIcon" />
        </p>
        <button class="createBtn" onclick="editedContactSaveToStoredData('${person.id}')">
          Save<img src="/assets/icon/check.svg" alt="" />
        </button>
      </div>
    </div>
  </div>
`;
};