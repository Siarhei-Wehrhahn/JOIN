let users = [];
let currentUser;

const onloadFunc = () => {
  loadData();
};

const base_url =
  "https://join-bf706-default-rtdb.europe-west1.firebasedatabase.app/";

const loadData = async (path = "") => {
  let response = await fetch(base_url + path + ".json");
  return response.json();
};

const postData = async (path = "", data = {}) => {
  let response = await fetch(base_url + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

const editContact = async (id, data = {}) => {
  await fetch(base_url + `/contacts/${id}` + ".json", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

const deleteData = async (path = "") => {
    let response = await fetch(base_url + path + ".json", {
        method: "DELETE"
    });
    return responseToJson = await response.json();
}

const loadUser = async () => {
    const usersData = loadData("/users");
    if(usersData) {
        Object.keys(usersData).forEach( key => {
            users.push( {
              id: key,
              name: usersData[key]['name'],
              email: usersData[key]['email'],
              phone: usersData[key]['phone']
            })
        })
    } else {
        console.log("Userdata load failed!");
    }
}

const signUpNewUser = async () => {
    const nameInput = document.getElementById("nameInput").value;
    const emailInput = document.getElementById("emailInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    const passwordConfirmInput = document.getElementById("passwordConfirmInput").value;
    const user = { name: nameInput, email: emailInput, passwort: passwordInput };
  
    if (passwordInput != passwordConfirmInput) {
      alert("Dein Passwort stimmt nicht Überein!");
      passwordInput = "";
      passwordConfirmInput = "";
      return;
    } else if (nameInput.length < 3 && passwordInput.length < 6) {
      alert("Dein Passwort/Name ist zu kurz!");
      return;
    }
    postData("/users", user);
    window.location.href = "header-navbar/index.html"
  };

  const signUpGuestUser = async () => {
    const user = { name: "Guest Anonym", email: "guest@guest.guest", passwort: "guest" };
    postData("/users", user);
    currentUser = user;
    window.location.href = "header-navbar/index.html"
  };
  
  //TODO: signIn function zu ende schreiben
  const signIn = async () => {
    const emailInputLogin = document.getElementById("emailInputLogin").value;
    const passwordInputLogin = document.getElementById("passwordInputLogin").value;
    const usersData = loadData("/users");
    console.log(usersData);
  };
