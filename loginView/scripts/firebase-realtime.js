const onloadFunc = () => {
    loadData()
}

const base_url = "https://console.firebase.google.com/u/0/project/join-bf706/database/join-bf706-default-rtdb/data/~2F"

const loadData = async () => {
    let response = await fetch(base_url);
    let responseToJson = response.json();
    console.log(responseToJson);
}

