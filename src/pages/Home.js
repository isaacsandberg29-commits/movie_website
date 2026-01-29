import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return React.createElement(
    "div",
    { className: "home" },
    React.createElement("h1", null, "🎬 Movie Explorer"),
    React.createElement("p", null, "Search, favorite, and explore movies."),
    React.createElement(
      "button",
      { onClick: () => navigate("/movies"), className: "mainBtn" },
      "Enter Movies"
    )
  );
}

export default Home;
