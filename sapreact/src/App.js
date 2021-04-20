import React from "react";

function App() {
  return (
    <div>
      <header>
        <div className="topnavbar">
          <div className="topnavbar-left">
            <a href="">
              <img className="playlist-icon" src="./images/playlist-add-green.svg" alt="Add a playlist icon"/>
              <span>SAVE A PLAYLIST</span>
            </a>
          </div>
          <div className="topnavbar-right">
            <a href="" id="howitworks">HOW IT WORKS</a>
            <a href="" id="connecttospotify">CONNECT TO SPOTIFY</a>
          </div>
        </div>
      </header>
      <main>
        <div className="content">
          <h1>Never lose a playlist again.</h1>
          <p>Search for a playlist and click the "." to add as a personal playlist on your Spotify account.</p>

          {/* <img className="panda" src="./images/panda.gif" alt="Waving panda"/>

          <h1>COMING SOON</h1>
          <p>We'll be launching soon, subscribe to be notified when we do.</p> */}
          <form className="searchbar" action="" method="post">
            <div>
              <label for="search">Search</label>
              <input type="text" placeholder="Type the name of the playlist here" name="search" id="search"></input>
              <button type="submit"><i className="fa fa-search"></i></button>
            </div>
          </form>

          <div>

          </div>

          {/* <form action="/notify-launch" method="post">
            <div className="input">
              <label for="email">Email</label>
              <input type="email" name="email" placeholder="Email Address" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" autofocus required/>
            </div>
            <div className="notify-btn">
              <input type="submit" value="Notify Me"/>
            </div>
          </form> */}
        </div>
      </main>
      <footer>
        Hi
      </footer>

    </div>
  );
}

export default App;
