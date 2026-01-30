import React, { useState, useEffect, useRef } from "react";
import "./Movies.css";
import noPoster from "../assets/noPoster.png";

function Movies({ goHome }) {
  const [rows, setRows] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [query, setQuery] = useState("");
  const rowRefs = useRef({}); // store row DOM refs

  const API = "https://www.omdbapi.com/?apikey=9eac46e9";

  function fetchRow(title, searchTerm, page = 1) {
    setRows(prev => ({
      ...prev,
      [title]: { ...prev[title], loading: true }
    }));

    fetch(`${API}&s=${searchTerm}&page=${page}`)
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
            loading: false,
            page,
            searchTerm
          }
        }));
      });
  }

  useEffect(() => {
    fetchRow("🔥 Popular", "avengers");
    fetchRow("💥 Action", "mission");
    fetchRow("😂 Comedy", "funny");
    fetchRow("🎭 Drama", "love");
  }, []);

  function searchMovies() {
    if (!query) return;
    fetchRow("🔎 Search Results", query);
  }

  function handleScrollLoad(e, title) {
    const el = e.target;
    const row = rows[title];
    if (!row || row.loading) return;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 50) {
      fetchRow(title, row.searchTerm, row.page + 1);
    }
  }

  function scrollRow(title, direction) {
    const el = rowRefs.current[title];
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth"
    });
  }

  function openModal(id) {
    fetch(`${API}&i=${id}`)
      .then(res => res.json())
      .then(data => setSelectedMovie(data));
  }

  function closeModal() {
    setSelectedMovie(null);
  }

  // Determine the order: Search row first if query exists
  const rowTitles = [];
  if (query && rows["🔎 Search Results"]) rowTitles.push("🔎 Search Results");
  Object.keys(rows).forEach(title => {
    if (title !== "🔎 Search Results") rowTitles.push(title);
  });

  return React.createElement(
    "div",
    { className: "moviesPage" },

    React.createElement("button", { className: "backBtn", onClick: goHome }, "← Home"),

    // 🔍 SEARCH BAR
    React.createElement(
      "div",
      { className: "searchBar" },
      React.createElement("input", {
        value: query,
        onChange: e => setQuery(e.target.value),
        placeholder: "Search for movies..."
      }),
      React.createElement("button", { onClick: searchMovies }, "Search")
    ),

    // 🎞 MOVIE ROWS
    rowTitles.map(title =>
      React.createElement(
        "div",
        { key: title, className: "rowWrapper" },

        React.createElement("h2", { className: "rowTitle" }, title),

        React.createElement(
          "div",
          { className: "rowContainer" },

          // ⬅ LEFT BUTTON
          React.createElement(
            "button",
            { className: "scrollBtn left", onClick: () => scrollRow(title, "left") },
            "❮"
          ),

          // 🎬 MOVIE ROW
          React.createElement(
            "div",
            {
              className: "movieRow",
              ref: el => (rowRefs.current[title] = el),
              onScroll: e => handleScrollLoad(e, title)
            },
            rows[title].movies?.map(movie =>
              React.createElement(
                "div",
                {
                  key: movie.imdbID,
                  className: "movieCard",
                  onClick: () => openModal(movie.imdbID)
                },
                React.createElement("img", {
                  src: movie.Poster && movie.Poster !== "N/A" ? movie.Poster : noPoster,
                  onError: e => (e.target.src = noPoster),
                  alt: movie.Title
                })
              )
            ),
            rows[title].loading &&
              React.createElement("div", { className: "loading" }, "Loading...")
          ),

          // ➡ RIGHT BUTTON
          React.createElement(
            "button",
            { className: "scrollBtn right", onClick: () => scrollRow(title, "right") },
            "❯"
          )
        )
      )
    ),

    // 🎬 MODAL
    selectedMovie &&
      React.createElement(
        "div",
        { className: "modalOverlay", onClick: closeModal },
        React.createElement(
          "div",
          { className: "modal", onClick: e => e.stopPropagation() },
          React.createElement("h2", null, selectedMovie.Title),
          React.createElement("img", {
            src: selectedMovie.Poster && selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : noPoster,
            onError: e => (e.target.src = noPoster),
            alt: selectedMovie.Title
          }),
          React.createElement("p", null, selectedMovie.Plot),
          React.createElement("button", { onClick: closeModal }, "Close")
        )
      )
  );
}

export default Movies;
