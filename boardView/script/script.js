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

let selectedPriority = null;

function selectPriority(priority) {
  const urgentButton = document.getElementById('urgent-button');
  const urgentText = document.getElementById('urgentText');
  const urgentIcon = document.getElementById('urgentIcon');
  
  const mediumButton = document.getElementById('medium-button');
  const mediumText = document.getElementById('mediumText');
  const mediumIcon = document.getElementById('mediumIcon');
  
  const lowButton = document.getElementById('low-button');
  const lowText = document.getElementById('lowText');
  const lowIcon = document.getElementById('lowIcon');
  
  if (selectedPriority === priority) {
    urgentButton.classList.remove('redButton');
    urgentText.classList.remove('whiteText');
    urgentIcon.classList.remove('whiteIcon');
    
    mediumButton.classList.remove('orangeButton');
    mediumText.classList.remove('whiteText');
    mediumIcon.classList.remove('whiteIcon');
    
    lowButton.classList.remove('greenButton');
    lowText.classList.remove('whiteText');
    lowIcon.classList.remove('whiteIcon');
    
    selectedPriority = null;
    console.log('Priority deselected');
    return;
  }
  
  urgentButton.classList.remove('redButton');
  urgentText.classList.remove('whiteText');
  urgentIcon.classList.remove('whiteIcon');
  
  mediumButton.classList.remove('orangeButton');
  mediumText.classList.remove('whiteText');
  mediumIcon.classList.remove('whiteIcon');
  
  lowButton.classList.remove('greenButton');
  lowText.classList.remove('whiteText');
  lowIcon.classList.remove('whiteIcon');
  
  if (priority === 'urgent') {
    urgentButton.classList.add('redButton');
    urgentText.classList.add('whiteText');
    urgentIcon.classList.add('whiteIcon');
  } else if (priority === 'medium') {
    mediumButton.classList.add('orangeButton');
    mediumText.classList.add('whiteText');
    mediumIcon.classList.add('whiteIcon');
  } else if (priority === 'low') {
    lowButton.classList.add('greenButton');
    lowText.classList.add('whiteText');
    lowIcon.classList.add('whiteIcon');
  }
  
  selectedPriority = priority;
  console.log(`Selected priority: ${selectedPriority}`);
}

function toggleAddTaskOverlay() {
  const overlay = document.getElementById('overlayAddTask');
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

const renderAddTaskOverlay = () => {
  const overlay = document.getElementById('contactRender');
  overlay.innerHTML = "";

  users.forEach(user => {
    const initials = user.name.split(' ').slice(0, 2).map(n => n[0]).join('');
    const randomColor = colors.randomElement();
    overlay.innerHTML += getOverlayAddTask(user, initials, randomColor);
  });
}

const getOverlayAddTask = (user, initials, color) => {
  return /*html*/`
            <div class="contact">
              <p id="initialsOverlay" style="background-color: ${color}; border-radius: 50%;">${initials}</p>
              <p id="contactName">${user.name}</p>
              <form>
                <input type="checkbox" id="exampleCheckbox" name="exampleCheckbox">
              </form>
            </div>
      `;
}