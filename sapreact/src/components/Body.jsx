import React from "react";
import Title from "../components/Title.jsx";
import SearchBar from "../components/SearchBar.jsx";

function Body() {
    return (
        <main>
            <div className="content">
                <Title />
                <SearchBar />
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
    );
}

export default Body;
