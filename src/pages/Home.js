import React from "react";
import "./Home.css";

function Home({ goToMovies }) {
  return React.createElement(
    "div",
    { className: "homePage" },

    // Header
    React.createElement(
      "div",
      { className: "homeHeader" },
      React.createElement("h1", null, "🎬 My Movie App"),
      React.createElement(
        "button",
        { className: "enterBtn", onClick: goToMovies },
        "Browse Movies"
      )
    ),

    // Main Banner
    React.createElement(
      "div",
      { className: "homeBanner" },
      React.createElement("h2", null, "Welcome to Your Movie Library"),
      React.createElement("p", null, "Explore, search, and favorite your movies!")
    ),

    // Features / Sections
    React.createElement(
      "div",
      { className: "homeFeatures" },
      React.createElement(
        "div",
        { className: "featureCard" },
        React.createElement("h3", null, "Popular Movies"),
        React.createElement("p", null, "Check out the trending movies right now.")
      ),
      React.createElement(
        "div",
        { className: "featureCard" },
        React.createElement("h3", null, "Action & Comedy"),
        React.createElement("p", null, "Lots of fun and thrilling movies to enjoy.")
      ),
      React.createElement(
        "div",
        { className: "featureCard" },
        React.createElement("h3", null, "Favorites"),
        React.createElement("p", null, "Save movies you love for later.")
      )
    )
  );
}

export default Home;



