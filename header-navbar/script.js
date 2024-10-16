const createContact = () => {
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const phone = document.getElementById('inputPhone').value;
    const contact = { name: name, email: email, phone: phone }
    document.getElementById('inputName').value = "";
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputPhone').value = "";
    postData('/contacts', contact)
}

function loadContactsView() {
    fetch('../contactsView/index.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentArea').innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

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
}

window.onload = loadContactsView;