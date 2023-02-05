import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import defaultMovies from '../defaultMovies';
import FilterForm from './FilterForm';
import MovieTeasers from './MovieTeasers';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import Movie from './Movie';

export default function MoviesFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 600);

  const [movies, setMovies] = useState(defaultMovies);

  useMoviesSearch(debouncedSearchTerm, setMovies);

  return (
    <div className="movies-finder">
      <Router>
        <header>
          <nav className="main-navigation">
            <Link to="/">Start</Link>
            <Link to="/kontakt">Kontakt</Link>
          </nav>
        </header>
        <Switch>
          <Route exact path="/">
            <Helmet>
              <title>React Filmdatenbank</title>
            </Helmet>
            <FilterForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <MovieTeasers movies={movies} />
          </Route>
          <Route path="/kontakt">
            <Helmet>
              <title>Kontakt</title>
            </Helmet>
            <h2>Kontakt</h2>
          </Route>
          <Route path="/movie/:id">
            <Movie />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function useMoviesSearch(debouncedSearch, setMovies) {
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setMovies(defaultMovies);
      return;
    }

    async function fetchMovies() {
      try {
        const response = await fetch(
          `https://omdbapi.com/?apikey=3df3b4a8&s=${debouncedSearch}`
        );

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Daten');
        }

        const jsonData = await response.json();
        if (jsonData.Response === 'True') {
          setMovies(jsonData.Search);
        } else {
          setMovies([]);
        }
      } catch (error) {
        setMovies([]);
        console.log(error);
      }
    }
    fetchMovies();
  }, [debouncedSearch]);
}

/* 
1. Erschafft einen neuen state searchTerm und verknüpft ihn mit dem Eingabefeld
als kontrollierten Input.
2. Nutzt useDebouncedValue um den Wert debouncedSearchTerm zu erhalten.
3. Nutzt useEffect, um aus der Datenbank die zum Suchbegriff passenden Ergebnisse
zu laden. Achtet dabei darauf, dass mindestens 2 Buchstaben eingegeben wurden, bevor
die Anfrage gemacht wird. Wenn weniger Buchstaben eingegeben sind, sollen wieder
die defaultMovies angezeigt werden.
Basis-URL:
https://omdbapi.com/?apikey=3df3b4a8&s=Suchbegriff
*/
