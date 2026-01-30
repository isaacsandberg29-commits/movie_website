import React, { useState } from "react";
import Home from "./pages/Home";
import Movies from "./pages/Movies";

function App() {
  const [page, setPage] = useState("home"); // tracks current page

  // Function to go to Movies page
  function goToMovies() {
    setPage("movies");
  }

  // Function to go back to Home page
  function goHome() {
    setPage("home");
  }

  return React.createElement(
    "div",
    null,
    page === "home"
      ? React.createElement(Home, { goToMovies: goToMovies })
      : React.createElement(Movies, { goHome: goHome })
  );
}

export default App;

