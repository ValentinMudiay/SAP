import React from "react";

function App() {
  return (
    <div>
      <header>
        <img className="playlist-icon" src="./playlist-add.svg" alt="Add a playlist icon"/>
        <span>SAVE A PLAYLIST</span>
      </header>
      <div className="content">
        <img className="panda" src="./panda.gif" alt="Waving panda"/>
        <h1>COMING SOON</h1>
        <p>We'll be launching soon, subscribe to be notified when we do.</p>
        <form action="/notify-launch" method="post">
          <div className="input">
            <label for="email">Email</label>
            <input type="email" name="email" placeholder="Email Address" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" autofocus required/>
          </div>
          <div className="notify-btn">
            <input type="submit" value="Notify Me"/>
          </div>
        </form>
        

      </div>
    </div>
  );
}

export default App;
