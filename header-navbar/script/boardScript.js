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