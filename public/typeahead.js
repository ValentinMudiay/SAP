const searchInput = document.getElementById("search");


/**
 * Executes AJAX api call to fetch search results.
 * 
 * @param {string} query passed to Spotify for searching.
 * @returns Promise containing search results in the response.
 */
function search(query) {
   return fetch(`/search?q=${query}&typeahead=true`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
}

searchInput.addEventListener("keyup", (event) => {
    const input = searchInput.value;

    const searchStrNoWhiteSpace = input.replace(/ /g, "");

    const { minimumCharsForTypeahead } = window.config;

    if(searchStrNoWhiteSpace.length >= minimumCharsForTypeahead) {
        search(input)
        .then(response => {
            // console.log(response); // TODO: Handle repsonse with search results
            const playlists = response.playlists.items;
            displayPlaylistResults(playlists);
        })
        .catch(error => {
            console.error(error);
        });
    }
});

function displayPlaylistResults(playlists) {
    const ol = document.createElement("ol");

    for(let i = 0; i < playlists.length; i++) {
        const addBtn = getAddBtn(playlists[i]);

         const li = document.createElement("li");
         li.appendChild(addBtn);
         li.append(playlists[i].name);
         ol.appendChild(li);
    }

    const body = document.getElementById("body");

    const newResultsDiv = document.createElement("div");
    newResultsDiv.setAttribute("id", "result");
    newResultsDiv.appendChild(ol); // add list to new results div

    const currentResultsDiv  = document.getElementById("result");
    body.replaceChild(newResultsDiv, currentResultsDiv); // replace results div
}

function getAddBtn(playlist) {
    const addBtn = document.createElement("button");
    addBtn.innerText = " + ";

    // const playlistId = playlist.id;
    // const playlistId = playlist.tracks.href;
    
    addBtn.addEventListener("click", event => {
        addPlaylist(playlist)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
    });
    return addBtn;
}

function addPlaylist(playlist) {
    const data = {
        playlistId: playlist.id,
        tracksUrl: playlist.tracks.href,
        totalTracks: playlist.tracks.total,
    };

    const dataStr = jsonToQueryStr(data);

    return fetch("/save", {
       "method": "POST",
       "body": dataStr,
       "headers": {
           "Content-Type": "application/x-www-form-urlencoded",
       }
   })
    .then(res => res.text())
    .then(data => data)
    .catch(err => console.error(err));
}

/**
 * Converts a one dimensional Javascript object to query string format.
 * 
 * @param {object} json Object to be converted.
 * @returns {string} a query string that can be appended to a URL.
 */
function jsonToQueryStr(json) {
    let str = "";

    Object.keys(json).forEach((key, i, arr) => {
        str += `${key}=${json[key]}`;
        str += i !== arr.length-1 ? "&" : "";
    });

    return str;
}

/* Returned playlist
    {
        playlists:
        href: "https://api.spotify.com/v1/search?query=chi&type=playlist&market=US&offset=0&limit=7"
        items: Array(7)
            0:
                collaborative: false
                description: "Kick back to the best new and recent chill tunes."
                external_urls: {spotify: "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6"}
                href: "https://api.spotify.com/v1/playlists/37i9dQZF1DX4WYpdgoIcn6"
                id: "37i9dQZF1DX4WYpdgoIcn6"
                images: [{…}]
                name: "Chill Hits"
                owner: {display_name: "Spotify", external_urls: {…}, href: "https://api.spotify.com/v1/users/spotify", id: "spotify", type: "user", …}
                primary_color: null
                public: null
                snapshot_id: "MTYxMDg4NzI0NywwMDAwMDAwMGQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0Mjdl"
                tracks: {href: "https://api.spotify.com/v1/playlists/37i9dQZF1DX4WYpdgoIcn6/tracks", total: 130}
                type: "playlist"
                uri: "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6"
                __proto__: Object
            1: {collaborative: false, description: "¡Escucha los éxitos de hoy! ↵Foto: Myke Towers & Juhn", external_urls: {…}, href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXclgCwbk0uat", id: "37i9dQZF1DXclgCwbk0uat", …}
            2: {collaborative: false, description: "Country music to get you back to the basics.", external_urls: {…}, href: "https://api.spotify.com/v1/playlists/37i9dQZF1DWTkxQvqMy4WW", id: "37i9dQZF1DWTkxQvqMy4WW", …}
            3: {collaborative: false, description: "Just chill...", external_urls: {…}, href: "https://api.spotify.com/v1/playlists/37i9dQZF1DX889U0CL85jj", id: "37i9dQZF1DX889U0CL85jj", …}
            4: {collaborative: false, description: "Chill Out Songs and Relaxing Music. 🌞Including De…ref="https://wad.lnk.to/instagram">Instagram</a>!", external_urls: {…}, href: "https://api.spotify.com/v1/playlists/7ozIozDp260fjNOZy1yzRG", id: "7ozIozDp260fjNOZy1yzRG", …}
            5: {collaborative: false, description: "The perfect study beats, twenty four seven.", external_urls: {…}, href: "https://api.spotify.com/v1/playlists/37i9dQZF1DX8Uebhn9wzrS", id: "37i9dQZF1DX8Uebhn9wzrS", …}
            6: {collaborative: false, description: "Just lean back and enjoy relaxed beats.", external_urls: {…}, href: "https://api.spotify.com/v1/playlists/37i9dQZF1DWTvNyxOwkztu", id: "37i9dQZF1DWTvNyxOwkztu", …}
        length: 7
        __proto__: Array(0)
        limit: 7
        next: "https://api.spotify.com/v1/search?query=chi&type=playlist&market=US&offset=7&limit=7"
        offset: 0
        previous: null
        total: 2500004
    }
*/