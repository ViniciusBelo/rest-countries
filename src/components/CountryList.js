import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CountryList.css';

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [region, setRegion] = useState('');
  const [subregion, setSubregion] = useState('');
  const [populationRange, setPopulationRange] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name'); // Padrão: ordenar por nome

  useEffect(() => {
    // Faz a requisição para a API RestCountries
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
        setFilteredCountries(response.data);
      })
      .catch(error => console.error('Erro ao buscar países', error));
  }, []);

  // Função para aplicar filtros
  useEffect(() => {
    let results = countries;

    // Filtro de busca
    if (searchTerm) {
      results = results.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por região
    if (region) {
      results = results.filter(country => country.region === region);
    }

    // Filtro por sub-região
    if (subregion) {
      results = results.filter(country => country.subregion === subregion);
    }

    // Filtro por intervalo de população
    if (populationRange) {
      results = results.filter(country => {
        const population = country.population;
        switch (populationRange) {
          case '<1M':
            return population < 1000000;
          case '1M-10M':
            return population >= 1000000 && population <= 10000000;
          case '10M-100M':
            return population > 10000000 && population <= 100000000;
          case '>100M':
            return population > 100000000;
          default:
            return true;
        }
      });
    }

    // Ordenação
    results = results.sort((a, b) => {
      if (sortCriteria === 'name') {
        return a.name.common.localeCompare(b.name.common);
      } else if (sortCriteria === 'population') {
        return a.population - b.population;
      } else if (sortCriteria === 'area') {
        return a.area - b.area;
      } else {
        return 0;
      }
    });

    setFilteredCountries(results);
  }, [searchTerm, region, subregion, populationRange, sortCriteria, countries]);

  return (
    <div className="country-list-container">
      <h1 className="title">Explorar Países</h1>

      {/* Campo de busca */}
      <input
        type="text"
        className="search-input"
        placeholder="Buscar por país"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filtros de Região e Sub-região */}
      <div className="filters">
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Filtrar por Região</option>
          <option value="Africa">África</option>
          <option value="Americas">Américas</option>
          <option value="Asia">Ásia</option>
          <option value="Europe">Europa</option>
          <option value="Oceania">Oceania</option>
        </select>

        <select value={subregion} onChange={(e) => setSubregion(e.target.value)}>
          <option value="">Filtrar por Sub-região</option>
          <option value="Southern Europe">Europa do Sul</option>
          <option value="Northern Africa">Norte da África</option>
          <option value="Central America">América Central</option>
          {/* Adicione outras sub-regiões conforme necessário */}
        </select>

        {/* Filtro por intervalo de população */}
        <select value={populationRange} onChange={(e) => setPopulationRange(e.target.value)}>
          <option value="">Filtrar por População</option>
          <option value="<1M">Menos de 1M</option>
          <option value="1M-10M">1M - 10M</option>
          <option value="10M-100M">10M - 100M</option>
          <option value=">100M">Mais de 100M</option>
        </select>

        {/* Ordenação */}
        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
          <option value="name">Ordenar por Nome</option>
          <option value="population">Ordenar por População</option>
          <option value="area">Ordenar por Área</option>
        </select>
      </div>

      {/* Lista de países */}
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
              <p>População: {country.population.toLocaleString()}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryList;
