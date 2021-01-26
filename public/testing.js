function addEventListeners() {

    const userBtn = document.getElementById("getId");
    userBtn.addEventListener("click", function(event) {
        console.log("userBtn clicked");

        // fetch("/save")
        // .then(response => response.text())
        // .then(data => console.log(data))
        // .catch(err => console.error(err));

    });

    const createPlaylistBtn = document.getElementById("createEmptyPlaylist");
    createPlaylistBtn.addEventListener("click", function(event) {
        console.log("createPlaylistBtn clicked");

        const data = { tracksUrl: "" };

        const dataStr = jsonToQueryStr(data);

        const options = {
            "method": "POST",
            "body": dataStr,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        };

        fetch("/save", options)
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(err => console.error(err));

    });
}

addEventListeners();

