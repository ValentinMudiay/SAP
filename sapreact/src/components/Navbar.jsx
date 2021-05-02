import React from "react";

function Navbar() {
    return (
      <header>
        <div className="topnavbar">
          <div className="topnavbar-left">
            <a href="">
              <img className="playlist-icon" src="./images/playlist-add-green.svg" alt="Add a playlist icon" />
              <span>SAVE A PLAYLIST</span>
            </a>
          </div>
          <div className="topnavbar-right">
            <a href="" id="howitworks">HOW IT WORKS</a>
            <a href="" id="connecttospotify">CONNECT TO SPOTIFY</a>
          </div>
        </div>
      </header>
    );
  }

  export default Navbar;
