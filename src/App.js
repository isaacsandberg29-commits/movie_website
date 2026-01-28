import React, { useState, useEffect } from "react";
import "./App.css";
import noPoster from "./assets/noPoster.png";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [rows, setRows] = useState({});

  // 🔍 SEARCH
  function searchMovies() {
    if (!query) return;

    setRows(prev => ({ ...prev, Search: { movies: [], loading: true } }));

    fetch(`https://www.omdbapi.com/?s=${query}&apikey=9eac46e9`)
      .then(res => res.json())
      .then(data => {
        setRows(prev => ({
          ...prev,
          Search: { movies: data.Search || [], loading: false }
        }));
      });
  }

  // 🎬 MODAL
  function openModal(id) {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=9eac46e9`)
      .then(res => res.json())
      .then(data => setSelectedMovie(data));
  }
  const closeModal = () => setSelectedMovie(null);

  // ❤️ FAVORITES
  function toggleFavorite(movie) {
    setFavorites(prev =>
      prev.find(m => m.imdbID === movie.imdbID)
        ? prev.filter(m => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
  }
  const isFavorite = id => favorites.some(m => m.imdbID === id);

  // 📦 FETCH ROWS
  function fetchRow(title, searchTerm, page = 1) {
  setRows(prev => ({
    ...prev,
    [title]: {
      movies: page === 1 ? [] : prev[title]?.movies || [],
      page,
      searchTerm,
      loading: true
    }
  }));

  fetch(`https://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=9eac46e9`)
    .then(res => res.json())
    .then(data => {
      setRows(prev => ({
        ...prev,
        [title]: {
          movies: data.Search
            ? [...(prev[title]?.movies || []), ...data.Search]
            : prev[title]?.movies || [],
          page,
          searchTerm,
          loading: false
        }
      }));
    })
    .catch(() => {
      setRows(prev => ({
        ...prev,
        [title]: { ...prev[title], loading: false }
      }));
    });
}


  useEffect(() => {
    fetchRow("Popular", "avengers");
    fetchRow("Action", "mission");
    fetchRow("Comedy", "funny");
    fetchRow("Drama", "love");
  }, []);

  // ♾ INFINITE SCROLL
  function handleScroll(e, title) {
    const el = e.target;
    const row = rows[title];
    if (!row) return;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
      fetchRow(title, row.searchTerm, row.page + 1);
    }
  }

  return React.createElement(
    "div",
    { className: "container" },

    // HEADER
    React.createElement(
      "div",
      { className: "header" },
      React.createElement("h1", null, "🎬 Movie Search"),
      React.createElement(
        "div",
        { className: "search" },
        React.createElement("input", {
          value: query,
          onChange: e => setQuery(e.target.value),
          placeholder: "Search movies..."
        }),
        React.createElement("button", { onClick: searchMovies }, "Search")
      )
    ),

    // FAVORITES
    favorites.length > 0 &&
      React.createElement(
        "div",
        null,
        React.createElement("h2", null, "❤️ My Favorites"),
        React.createElement(
          "div",
          { className: "grid" },
          favorites.map(movie =>
            React.createElement(
              "div",
              { key: movie.imdbID, className: "card" },
              React.createElement("img", {
                src: movie.Poster !== "N/A" ? movie.Poster : noPoster,
                onError: e => (e.target.src = noPoster)
              }),
              React.createElement("h3", null, movie.Title)
            )
          )
        )
      ),

    // MOVIE ROWS
    [...(rows.Search ? ["Search"] : []), ...Object.keys(rows).filter(k => k !== "Search")].map(title =>
      React.createElement(
        "div",
        { key: title, className: "rowSection" },
        React.createElement("h2", null, title),
        React.createElement(
          "div",
          { className: "rowGrid", onScroll: e => handleScroll(e, title) },

          // Skeletons
          rows[title]?.loading &&
            Array.from({ length: 6 }).map((_, i) =>
              React.createElement(
                "div",
                { key: "sk" + i, className: "card skeletonCard" },
                React.createElement("div", { className: "skeletonImg" }),
                React.createElement("div", { className: "skeletonText" })
              )
            ),

          // Movies
          rows[title]?.movies?.map(movie =>
            React.createElement(
              "div",
              { key: movie.imdbID, className: "card" },
              React.createElement(
                "button",
                { className: "favBtn", onClick: () => toggleFavorite(movie) },
                isFavorite(movie.imdbID) ? "❤️" : "🤍"
              ),
              React.createElement(
                "div",
                { onClick: () => openModal(movie.imdbID) },
                React.createElement("img", {
                  src: movie.Poster !== "N/A" ? movie.Poster : noPoster,
                  onError: e => (e.target.src = noPoster)
                }),
                React.createElement("p", null, movie.Title)
              )
            )
          ),

          // Not found
          title === "Search" &&
            !rows[title]?.loading &&
            rows[title]?.movies?.length === 0 &&
            React.createElement("p", { style: { color: "#aaa" } }, "Movie not found")
        )
      )
    ),

    // MODAL
    selectedMovie &&
      React.createElement(
        "div",
        { className: "modalOverlay", onClick: closeModal },
        React.createElement(
          "div",
          { className: "modal", onClick: e => e.stopPropagation() },
          React.createElement("img", {
            src: selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : noPoster,
            className: "modalPoster"
          }),
          React.createElement(
            "div",
            { className: "modalContent" },
            React.createElement("h2", null, selectedMovie.Title),
            React.createElement("p", null, selectedMovie.Plot),
            React.createElement("button", { onClick: closeModal }, "Close")
          )
        )
      )
  );
}

export default App;
