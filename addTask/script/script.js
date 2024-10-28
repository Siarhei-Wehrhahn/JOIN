// Funktion für das linke Dropdown-Menü
function toggleDropdown() {
    const dropdown = document.getElementById("dropdownContent");
    const arrow = document.querySelector(".arrow");
  
    // Dropdown-Menü anzeigen/verbergen
    dropdown.classList.toggle("show");
  
    // Pfeil drehen
    arrow.classList.toggle("rotate-arrow");
  }
  
  // Funktion für das rechte Dropdown-Menü
  function toggleDropdownRightSide() {
    const dropdown = document.getElementById("dropdownContentRightSide");
    const arrow = document.querySelector(".arrow");
  
    // Dropdown-Menü anzeigen/verbergen
    dropdown.classList.toggle("show");
  
    // Pfeil drehen
    arrow.classList.toggle("rotate-arrow");
  }
  
  // Auswahl einer Option für beide Dropdowns
  function selectOption(option) {
    alert("Du hast " + option + " gewählt!");
  }
  
  // Schließe die Dropdown-Menüs, wenn außerhalb geklickt wird
  window.onclick = function (event) {
    // Schließe das linke Dropdown, wenn außerhalb geklickt wird
    if (!event.target.matches(".dropbtn") && !event.target.matches(".arrow")) {
      const dropdown = document.getElementById("dropdownContent");
      const arrow = document.querySelector(".arrow");
  
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        arrow.classList.remove("rotate-arrow");
      }
    }
  
    // Schließe das rechte Dropdown, wenn außerhalb geklickt wird
    if (!event.target.matches(".dropbtn") && !event.target.matches(".arrow")) {
      const dropdown = document.getElementById("dropdownContentRightSide");
      const arrow = document.querySelector(".arrow");
  
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        arrow.classList.remove("rotate-arrow");
      }
    }
  };
  






// Speichert den aktuell aktiven Button
let activeBtn = null;

function setPrio(button) {
  // Wenn bereits ein aktiver Button vorhanden ist, entferne die alte 'active'-Klasse
  if (activeBtn) {
    activeBtn.classList.remove('active-red', 'active-orange', 'active-green');
  }

  // Je nach data-color Wert die entsprechende Klasse hinzufügen
  const color = button.getAttribute('data-color');
  if (color === 'red') {
    button.classList.add('active-red');
  } else if (color === 'orange') {
    button.classList.add('active-orange');
  } else if (color === 'green') {
    button.classList.add('active-green');
  }

  // Setze den aktuellen Button auf aktiv
  activeBtn = button;
}

// Überwachung von Klicks außerhalb des Buttons, um die Auswahl zu entfernen
window.addEventListener('click', function (e) {
  // Überprüfen, ob außerhalb eines prioBtn geklickt wird
  if (activeBtn && !e.target.matches('.prioBtn')) {
    activeBtn.classList.remove('active-red', 'active-orange', 'active-green');
    activeBtn = null; // Setze den aktiven Button zurück
  }
});






function addSubtask() {
    const input = document.getElementById('subtaskInput');
    const subtaskText = input.value.trim();
  
    // Überprüfen, ob das Eingabefeld leer ist
    if (subtaskText === "") {
      alert("Bitte eine Notiz eingeben!");
      return;
    }
  
    // Neues Listen-Element erstellen
    const li = document.createElement('li');
  
    // Container für den Text (links)
    const textContainer = document.createElement('div');
    textContainer.textContent = subtaskText;
  
    // Button-Container für Bearbeiten und Löschen (rechts)
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
  
    // Bearbeiten-Button hinzufügen
    const editBtn = document.createElement('button');
    editBtn.className = 'editBtn';
    editBtn.onclick = function() {
      const newText = prompt("Bearbeite die Notiz:", subtaskText);
      if (newText !== null && newText.trim() !== "") {
        textContainer.textContent = newText.trim();
      }
    };
  
    // Löschen-Button hinzufügen
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.onclick = function() {
      li.remove();
    };
  
    // Füge die Buttons zum Button-Container hinzu
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);
  
    // Füge die Text- und Button-Container zum Listen-Element hinzu
    li.appendChild(textContainer);
    li.appendChild(buttonContainer);
  
    // Füge das Listen-Element zur Liste hinzu
    document.getElementById('subtaskList').appendChild(li);
  
    // Eingabefeld nach dem Hinzufügen leeren
    input.value = "";
  }
  