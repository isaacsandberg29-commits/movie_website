import React, { useState, useEffect } from "react";
import "./App.css";


function App() {
 
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [rows, setRows] = useState({});


  function searchMovies() {
  if (!query) return;

  // TURN ON SKELETONS IMMEDIATELY
  setRows(prev => ({
    ...prev,
    Search: {
      movies: [],
      loading: true,
      page: 1,
      searchTerm: query
    }
  }));

  fetch(`https://www.omdbapi.com/?s=${query}&apikey=9eac46e9`)
    .then(res => res.json())
    .then(data => {
      if (data.Search) {
        setTimeout(() => {  
          setRows(prev => ({
            ...prev,
            Search: {
              movies: data.Search,
              loading: false,
              page: 1,
              searchTerm: query
            }
          }));
        }, 2000);
      }
    });
}




  function openModal(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=9eac46e9`)
      .then(res => res.json())
      .then(data => setSelectedMovie(data));
  }

  function closeModal() {
    setSelectedMovie(null);
  }

  function toggleFavorite(movie) {
    setFavorites(prev =>
      prev.find(m => m.imdbID === movie.imdbID)
        ? prev.filter(m => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
  }
  

function fetchRow(title, searchTerm, page = 1) {
  setRows(prev => ({
    ...prev,
    [title]: {
      ...prev[title],
      loading: true
    }
  }));

  fetch(`https://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=9eac46e9`)
    .then(res => res.json())
    .then(data => {
  if (data.Search) {
    setTimeout(() => {   
      setRows(prev => ({
        ...prev,
        [title]: {
          movies: prev[title]?.movies
            ? [...prev[title].movies, ...data.Search]
            : data.Search,
          page: page,
          searchTerm: searchTerm,
          loading: false
        }
      }));
    }, 1500); 
  }
});

}


useEffect(() => {
  fetchRow("Popular", "avengers");
  fetchRow("Action", "mission");
  fetchRow("Comedy", "funny");
  fetchRow("Drama", "love");
}, []);

function handleScroll(e, title) {
  const el = e.target;
  const row = rows[title];
  if (!row) return;

  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
    fetchRow(title, row.searchTerm, row.page + 1);
  }
}





  function isFavorite(id) {
    return favorites.some(m => m.imdbID === id);
  }
  

  return React.createElement(
  "div",
  { className: "container" },

  // HEADER (STICKY SEARCH)
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
            React.createElement("img", { src: movie.Poster, alt: movie.Title }),
            React.createElement("h3", null, movie.Title)
          )
        )
      )
    ),

  // MOVIE ROWS
 [
  ...(rows.Search ? ["Search"] : []),
  ...Object.keys(rows).filter(k => k !== "Search")
].map(title =>
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

      (() => {
        const items = [];

        if (rows[title]?.loading) {
          for (let i = 0; i < 6; i++) {
            items.push(
              React.createElement(
                "div",
                { key: "skeleton-" + i, className: "card skeletonCard" },
                React.createElement("div", { className: "skeletonImg" }),
                React.createElement("div", { className: "skeletonText" })
              )
            );
          }
        }

        if (rows[title]?.movies) {
          rows[title].movies.forEach(movie => {
            items.push(
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
                    src: movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300",
                    alt: movie.Title
                  }),

                  React.createElement("p", null, movie.Title)
                )
              )
            );
          });
        }

        return items;
      })()
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
      className: "modalPoster",
      src: selectedMovie.Poster !== "N/A"
        ? selectedMovie.Poster
        : "https://via.placeholder.com/400x600"
    }),

    React.createElement(
      "div",
      { className: "modalInfo" },

      React.createElement("h2", null, selectedMovie.Title),

      React.createElement(
        "p",
        { className: "meta" },
        `${selectedMovie.Year} • ${selectedMovie.Rated} • ${selectedMovie.Runtime}`
      ),

      React.createElement("p", null, selectedMovie.Genre),
      React.createElement("p", null, "⭐ IMDb: " + selectedMovie.imdbRating),
      React.createElement("p", null, "🎭 Actors: " + selectedMovie.Actors),

      React.createElement(
        "p",
        { className: "plot" },
        selectedMovie.Plot
      ),

      React.createElement(
        "button",
        { className: "closeBtn", onClick: closeModal },
        "Close"
      )
    )
  )
)
  );
}

export default App;

