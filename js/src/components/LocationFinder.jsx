import { useEffect, useState } from 'react';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
export default function LocationFinder() {
  const [search, setSearch] = useState('');

  /* debouncedSearch enthält den Wert von search, sobald
  sich search 600 MS nicht geändert hat. */
  const debouncedSearch = useDebouncedValue(search, 600);

  const [locations, setLocations] = useState([]);

  useLocationSearch(debouncedSearch, setLocations);

  return (
    <div>
      <label htmlFor="search">PLZ oder Ortsname</label>
      <input
        id="search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Stellt den Inhalt von locations dar, für jeden Eintrag
ein li-Element mit Name und Postleitzahl. */}
      <ul>
        {locations.map(({ place, zipcode, longitude, latitude }, index) => {
          const url = `https://www.openstreetmap.org/#map=14/${latitude}/${longitude}`;
          return (
            <a key={index} href={url}>
              <li>{`${zipcode} ${place}`}</li>
            </a>
          );
        })}
      </ul>
    </div>
  );
}

function useLocationSearch(debouncedSearch, setLocations) {
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setLocations([]);
      return;
    }

    async function fetchLocations() {
      try {
        const response = await fetch(
          `http://localhost:8000/?search=${debouncedSearch}`
        );

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Daten');
        }

        const jsonData = await response.json();

        setLocations(jsonData);
      } catch (error) {
        setLocations([]);
        console.log(error);
      }
    }
    fetchLocations();
  }, [debouncedSearch]);
}
