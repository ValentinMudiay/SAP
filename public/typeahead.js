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
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(err => console.error(err));
}

let oldInputValue = "";
searchInput.addEventListener("keyup", (event) => {
    const input = searchInput.value;

    const searchStrNoWhiteSpace = input.replace(/ /g, "").toLowerCase();

    const { minimumCharsForTypeahead } = window.config;
    
    // New input is equivalent to old value
    if(searchStrNoWhiteSpace === oldInputValue) return;
    
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

    if (searchStrNoWhiteSpace.length < minimumCharsForTypeahead) {
        clearPlaylistResults();
    }
    
    oldInputValue = searchStrNoWhiteSpace;
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

function clearPlaylistResults() {
    const results = document.getElementById("result");
    if(results.firstElementChild) {
        results.removeChild(results.firstElementChild);
    }
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
        // totalTracks: playlist.tracks.total,
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