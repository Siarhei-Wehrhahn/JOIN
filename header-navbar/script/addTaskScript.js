const toggleContactSelection1 = () => {
    const contentArea = document.getElementById("contactRender");
    const arrow = document.querySelector(".dropDownArrow");
  
    if (contentArea.classList.contains("d_none")) {
      contentArea.classList.toggle("d_none");
      arrow.classList.toggle("turnArrow");
      renderContactOverlay();
      updateCheckboxes();
    } else {
      contentArea.classList.toggle("d_none");
      arrow.classList.toggle("turnArrow");
    }
  };

  const renderContactOverlay = async () => {
    const loadContacts = await loadData("/contacts");
    const contacts = Object.values(loadContacts)
      .filter((contact) => contact.name && contact.email && contact.phone)
      .sort((a, b) => a.name.localeCompare(b.name));
    const overlay = document.getElementById("contactRender");
    overlay.innerHTML = "";

    if (contacts) {
      for (let index = 0; index < contacts.length; index++) {
        const person = contacts[index];
        const initials = person.name
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("");
        overlay.innerHTML += getContactAddTask(person, initials, index);
      }
    } else {
      console.log("Failed to load Contacts AddTaskView/script/script.js");
    }
  };