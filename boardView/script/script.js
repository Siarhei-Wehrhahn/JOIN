function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function toggleOverlay() {
  const overlay = document.getElementById('overlayId');
  if (overlay.classList.contains('show')) {
    overlay.classList.remove('show');
    overlay.classList.add('hide');
  } else {
    overlay.classList.remove('hide');
    overlay.classList.add('show');
  }
}

function selectPriority(button) {
  const urgentButton = document.getElementById('urgent-button');
  const mediumButton = document.getElementById('medium-button');
  const lowButton = document.getElementById('low-button');

  urgentButton.classList.remove('redButton');
  mediumButton.classList.remove('orangeButton', 'whiteText', 'whiteIcon');
  lowButton.classList.remove('greenButton');

  if (button === urgentButton) {
    urgentButton.classList.add('redButton');
  } else if (button === mediumButton) {
    mediumButton.classList.add('orangeButton', 'whiteText', 'whiteIcon');
  } else if (button === lowButton) {
    lowButton.classList.add('greenButton');
  }
}

selectPriority(document.getElementById('medium-button'));

document.getElementById('urgent-button').addEventListener('click', function() {
  selectPriority(this);
});

document.getElementById('medium-button').addEventListener('click', function() {
  selectPriority(this);
});

document.getElementById('low-button').addEventListener('click', function() {
  selectPriority(this);
});

const renderAddTaskOverlay = () => {
  const overlay = document.getElementById('contactRender');
  overlay.innerHTML = "";
  users.forEach(user => {
    const initials = user.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    overlay.innerHTML += getOverlayAddTask(user, initials)
  })
}

const getOverlayAddTask = (user, initials) => {
  return /*html*/`
            <div class="contact">
              <p id="initialsOverlay">${initials}</p>
              <p id="contactName">${user.name}</p>
              <form>
                <input type="checkbox" id="exampleCheckbox" name="exampleCheckbox">
              </form>
            </div>
      `
}