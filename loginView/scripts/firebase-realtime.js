const onloadFunc = () => {
    loadData()
}

const base_url = "https://join-bf706-default-rtdb.europe-west1.firebasedatabase.app/"

const loadData = async (path = "") => {
    let response = await fetch(base_url + path + ".json");
    return responseToJson = response.json();
}

const postData = async (path = "", data={}) => {
    let response = await fetch(base_url + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

const deleteData = async (path = "") => {
    let response = await fetch(base_url + path + ".json", {
        method: "DELETE"
    });
    return responseToJson = await response.json();
}