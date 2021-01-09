const searchInput = document.getElementById("search");

let searchStr = "";

function search(query) {
   return fetch(`/search?q=${query}&typeahead=true`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });
}

searchInput.addEventListener("keyup", (event) => {
    const input = searchInput.value;

    const searchStrNoWhiteSpace = input.replace(/ /g, "");

    const { minimumCharsForTypeahead } = window.config;

    if(searchStrNoWhiteSpace.length >= minimumCharsForTypeahead) {
        console.log(searchStrNoWhiteSpace.length, "Good");
        search(input);
    }
    else {
        console.log(searchStrNoWhiteSpace.length, "Bad");
    }
});