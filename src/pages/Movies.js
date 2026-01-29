import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_KEY = "9eac46e9"; // 🔥 PUT YOUR KEY HERE
const FALLBACK_IMG = "/noPoster.png"; // put this image in PUBLIC folder

function Movies() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [rows, setRows] = useState({});

  /* 🎬 FETCH MOVIE ROW */
  function fetchRow(title, searchTerm, page = 1) {
    setRows(prev => ({
      ...prev,
      [title]: { ...prev[title], loading: true }
    }));

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setRows(prev => ({
          ...prev,
          [title]: {
            movies: data.Search
              ? prev[title]?.movies
                ? [...prev[title].movies, ...data.Search]
                : data.Search
              : [],
            page,
            searchTerm,
            loading: false
          }
        }));
      });
  }

  /* 🎥 MODAL OPEN */
  function openModal(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(data => setSelectedMovie(data));
  }

  function closeModal() {
    setSelectedMovie(null);
  }

  /* ❤️ FAVORITES */
  function toggleFavorite(movie) {
    setFavorites(prev =>
      prev.find(m => m.imdbID === movie.imdbID)
        ? prev.filter(m => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
  }

  function isFavorite(id) {
    return favorites.some(m => m.imdbID === id);
  }

  /* 🚀 INITIAL LOAD */
  useEffect(() => {
    fetchRow("Popular", "avengers");
    fetchRow("Action", "mission");
    fetchRow("Comedy", "funny");
    fetchRow("Drama", "love");
  }, []);

  /* 🔁 INFINITE SCROLL */
  function handleScroll(e, title) {
    const el = e.target;
    const row = rows[title];
    if (!row || row.loading) return;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
      fetchRow(title, row.searchTerm, row.page + 1);
    }
  }

  return React.createElement(
    "div",
    { className: "container" },

    /* HEADER */
    React.createElement(
      "div",
      { className: "header" },
      React.createElement("h1", null, "🎬 Movies"),
      React.createElement(
        Link,
        { to: "/" },
        React.createElement("button", { className: "backBtn" }, "⬅ Home")
      )
    ),

    /* MOVIE ROWS */
    Object.keys(rows).map(title =>
      React.createElement(
        "div",
        { key: title, className: "rowSection" },

        React.createElement("h2", null, title),

        React.createElement(
          "div",
          {
            className: "rowGrid",
            onScroll: e => handleScroll(e, title)
          },

          rows[title]?.movies?.map(movie =>
            React.createElement(
              "div",
              { key: movie.imdbID, className: "card" },

              React.createElement(
                "button",
                {
                  className: "favBtn",
                  onClick: () => toggleFavorite(movie)
                },
                isFavorite(movie.imdbID) ? "❤️" : "🤍"
              ),

              React.createElement(
                "div",
                { onClick: () => openModal(movie.imdbID) },

                React.createElement("img", {
                  src:
                    movie.Poster && movie.Poster !== "N/A"
                      ? movie.Poster
                      : FALLBACK_IMG,
                  alt: movie.Title,
                  onError: e => (e.target.src = FALLBACK_IMG)
                }),

                React.createElement("p", null, movie.Title)
              )
            )
          )
        )
      )
    ),

    /* 🎥 MODAL */
    selectedMovie &&
      React.createElement(
        "div",
        { className: "modalOverlay", onClick: closeModal },

        React.createElement(
          "div",
          {
            className: "modal",
            onClick: e => e.stopPropagation()
          },

          React.createElement("img", {
            src:
              selectedMovie.Poster && selectedMovie.Poster !== "N/A"
                ? selectedMovie.Poster
                : FALLBACK_IMG,
            alt: selectedMovie.Title,
            onError: e => (e.target.src = FALLBACK_IMG)
          }),

          React.createElement(
            "div",
            { className: "modalContent" },
            React.createElement("h2", null, selectedMovie.Title),
            React.createElement("p", null, selectedMovie.Plot),
            React.createElement(
              "button",
              { onClick: closeModal },
              "Close"
            )
          )
        )
      )
  );
}

export default Movies;
