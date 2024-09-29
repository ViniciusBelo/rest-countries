import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CountryList.css'; // Adicionando o CSS

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    // Faz a requisição para a API RestCountries
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
        setFilteredCountries(response.data);
      })
      .catch(error => console.error('Erro ao buscar países', error));
  }, []);

  // Filtrar países por nome
  useEffect(() => {
    const results = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(results);
  }, [searchTerm, countries]);

  return (
    <div className="country-list-container">
      <h1 className="title">Explorar Países</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Buscar por país"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="country-list">
        {filteredCountries.map((country) => (
          <div className="country-card" key={country.cca3}>
            <Link to={`/country/${country.cca3}`} className="country-link">
              <h2>{country.name.common}</h2>
              <img
                src={country.flags.svg}
                alt={`Bandeira de ${country.name.common}`}
                className="country-flag"
              />
              <p>Capital: {country.capital ? country.capital[0] : 'N/A'}</p>
              <p>Região: {country.region}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryList;
