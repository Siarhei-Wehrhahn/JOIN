function toggleAddTaskOverlay() {
  const overlay = document.getElementById('overlayAddTask');
  if (overlay.classList.contains('show')) {
      overlay.classList.remove('show');
      overlay.classList.add('hide');
  } 
  else {
      overlay.classList.remove('hide');
      overlay.classList.add('show');
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