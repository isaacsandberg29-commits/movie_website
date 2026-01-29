import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import "./App.css";

/* 🔥 PAGE TRANSITION SYSTEM */
function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = React.useState(location);
  const [transitionStage, setTransitionStage] = React.useState("fadeIn");

  React.useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  return React.createElement(
    "div",
    {
      className: transitionStage,
      onAnimationEnd: () => {
        if (transitionStage === "fadeOut") {
          setTransitionStage("fadeIn");
          setDisplayLocation(location);
        }
      }
    },
    React.createElement(
      Routes,
      { location: displayLocation },
      React.createElement(Route, {
        path: "/",
        element: React.createElement(Home)
      }),
      React.createElement(Route, {
        path: "/movies",
        element: React.createElement(Movies)
      })
    )
  );
}

/* 🚀 MAIN APP */
function App() {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(AnimatedRoutes)
  );
}

export default App;
