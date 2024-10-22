function renderEditOverlay() {
    let overlayEditContact = document.getElementById('overlayEditContact');
    overlayEditContact.innerHTML = getEditOverlay();
}

const getEditOverlay = () => {
    return /*html*/`
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
        <p class="cancelBtn" onclick="singleContactDelete()">
          Delete<img src="/assets/icon/Close.svg" alt="cancelIcon" />
        </p>
        <button class="createBtn" onclick="">
          Save<img src="/assets/icon/check.svg" alt="" />
        </button>
      </div>
    </div>
  </div>
`
}
