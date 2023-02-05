import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoadingSpinner from './LoadingSpinner';

export default function Movie() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useMovieSearch(id, setMovie, setError);

  if (error) {
    return <strong>{error}</strong>;
  }

  if (!movie) {
    return <LoadingSpinner />;
  }

  const { Title, Year, Runtime, Ratings, Plot, Poster } = movie;

  return (
    <article className="movie">
      <Helmet>
        <title>{Title}</title>
      </Helmet>
      <h2 className="movie__title">{Title}</h2>

      {Poster && (
        <img
          src={Poster}
          alt={`Filmplakat ${Title}`}
          className="movie__poster"
        />
      )}

      {Plot && <p className="movie__plot">{Plot}</p>}
      <h3>Details</h3>
      <dl className="movie__details">
        {Year && (
          <>
            <dt>Jahr</dt>
            <dd>{Year}</dd>
          </>
        )}
        {Runtime && (
          <>
            <dt>Dauer</dt>
            <dd>{Runtime}</dd>
          </>
        )}
      </dl>

      {Ratings.length > 0 && (
        <dl className="movie__ratings">
          {Ratings.map(({ Source, Value }) => (
            <div key={Source}>
              <dt>{Source}</dt>
              <dd>{Value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

function useMovieSearch(id, setMovie, setError) {
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(
          `https://omdbapi.com/?apikey=3df3b4a8&i=${id}&plot=full`
        );

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Daten');
        }

        const jsonData = await response.json();

        setMovie(jsonData);
      } catch (error) {
        setMovie(null);
        console.log(error);
        setError(error.message);
      }
    }
    fetchMovies();
  }, [id]);
}

/* 

<article class="movie">
  <h2 class="movie__title">Titel</h2>
  <!-- Bild nur anzeigen, wenn vorhanden -->
  <img src="" alt="" class="movie__poster" />
  <!-- Plot anzeigen, wenn vorhanden -->
  <p class="movie__plot">Plot</p>
  <h3>Details</h3>
  <dl class="movie__details">
    <!-- Auch Jahr und Dauer prüfen, ob sie vorhanden sind -->
    <dt>Jahr</dt>
    <dd>2000</dd>
    <dt>Dauer</dt>
    <dd>200 Minuten</dd>
  </dl>

  <!-- Bonus: Die Ratings ausgeben. Ihr könnt wieder eine dl-Liste verwenden. -->
  <dl class="movie__ratings">
    <div>
      <dt>Rotten Tomatoes</dt>
      <dd>90%</dd>
    </div>
  </dl>
</article>


*/

// https://www.mediaevent.de/xhtml/dl.html
// http://html5doctor.com/the-dl-element/
