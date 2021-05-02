import React from "react";

function SearchBar() {
    return (
        <form className="searchbar" action="" method="post">
            <div>
                <label for="search">Search</label>
                <input type="text" placeholder="Type the name of the playlist here" name="search" id="search"></input>
                <button type="submit"><i className="fa fa-search"></i></button>
            </div>
        </form>
    );
}

export default SearchBar;
