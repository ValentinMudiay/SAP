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
            console.log(response); // TODO: Handle repsonse with search results
        });
    }
});