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

    function poptastic(url) {
        var newWindow = window.open(url, 'Spotify Login', 'toolbar=no, menubar=no, status=no, directories=no, height=750, width=600');
        if (window.focus) {
          newWindow.focus();
        }

        var pollTimer   =   window.setInterval(function() { 
            try {
                console.log(newWindow.document.URL);
                if (newWindow.document.URL.indexOf("/success") != -1) {
                    window.clearInterval(pollTimer);
                    var url =   newWindow.document.URL;
                    newWindow.close();
                }
            } catch(e) {
                console.error(e);
            }
        }, 100);
    }

    document.getElementById("login").addEventListener("click", event => {
        poptastic("/login");
    })
}

addEventListeners();

