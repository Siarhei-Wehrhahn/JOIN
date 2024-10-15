const onloadFunc = () => {
  loadData();
};

const base_url =
  "https://join-bf706-default-rtdb.europe-west1.firebasedatabase.app/";

const loadData = async (path = "") => {
  let response = await fetch(base_url + path + ".json");
  return (responseToJson = response.json());
};

const postData = async (path = "", data = {}) => {
  let response = await fetch(base_url + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
};

const deleteData = async (path = "") => {
  let response = await fetch(base_url + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
};

const signUpNewUser = async () => {
  const nameInput = document.getElementById("nameInput").value;
  const emailInput = document.getElementById("emailInput").value;
  const passwordInput = document.getElementById("passwordInput").value;
  const passwordConfirmInput = document.getElementById("passwordConfirmInput").value;
  const user = { name: nameInput, email: emailInput, passwort: passwordInput };

  if (passwordInput != passwordConfirmInput) {
    alert("Dein Passwort stimmt nicht überein!");
    passwordInput = "";
    passwordConfirmInput = "";
    return;
  } else if (nameInput.length < 2 && passwordInput.length < 6) {
    alert("Dein Passwort/Name ist zu kurz!");
    return;
  }
  postData("/users", user);
};

const signIn = async () => {
  const emailInputLogin = document.getElementById("emailInputLogin").value;
  const passwordInputLogin = document.getElementById("passwordInputLogin").value;
  const usersData = loadData("/users");
  console.log(usersData);
};
