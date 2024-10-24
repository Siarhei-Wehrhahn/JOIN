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
    
    // Wenn das Overlay gerade sichtbar ist (Klasse "show"), entferne es
    if (overlay.classList.contains('show')) {
        overlay.classList.remove('show');
        overlay.classList.add('hide');
    } 
    // Wenn das Overlay gerade versteckt ist (Klasse "hide"), zeige es an
    else {
        overlay.classList.remove('hide');
        overlay.classList.add('show');
    }
}

const renderAddTaskOverlay = () => {
  const overlay = document.getElementById('contactRender');
  overlay.innerHTML = "";
  users.forEach( user => {
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