import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CountryList.css';

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [regionFilter, setRegionFilter] = useState('');
  const [subregionFilter, setSubregionFilter] = useState('');
  const [populationFilter, setPopulationFilter] = useState('');
  const [subregions, setSubregions] = useState([]); // Estado para armazenar sub-regiões

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
        setFilteredCountries(response.data);
      })
      .catch(error => console.error('Erro ao buscar países', error));
  }, []);

  // Filtrar e atualizar a lista de países
  useEffect(() => {
    let results = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (regionFilter) {
      results = results.filter(country => country.region === regionFilter);
    }
    
    if (subregionFilter) {
      results = results.filter(country => country.subregion === subregionFilter);
    }

    if (populationFilter) {
      results = results.filter(country => {
        const population = country.population;
        switch (populationFilter) {
          case '<1M':
            return population < 1000000;
          case '1M-10M':
            return population >= 1000000 && population <= 10000000;
          case '10M-100M':
            return population >= 10000000 && population <= 100000000;
          case '>100M':
            return population > 100000000;
          default:
            return true;
        }
      });
    }

    setFilteredCountries(results);
  }, [searchTerm, regionFilter, subregionFilter, populationFilter, countries]);

  // Atualiza as sub-regiões com base na região selecionada
  useEffect(() => {
    if (regionFilter) {
      const filteredSubregions = [...new Set(countries
        .filter(country => country.region === regionFilter)
        .map(country => country.subregion)
        .filter(subregion => subregion))]; // Filtra sub-regiões não vazias
      setSubregions(filteredSubregions);
    } else {
      setSubregions([]); // Limpa sub-regiões se nenhuma região for selecionada
    }
  }, [regionFilter, countries]);

  return (
    <div className="country-list-container">
      <h1>Lista de Países</h1>
      <input
        className="search-bar"
        type="text"
        placeholder="Buscar por país"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="filters-container">
        <select className="filter-select" onChange={(e) => setRegionFilter(e.target.value)}>
          <option value="">Filtrar por Região</option>
          <option value="Africa">África</option>
          <option value="Americas">Américas</option>
          <option value="Asia">Ásia</option>
          <option value="Europe">Europa</option>
          <option value="Oceania">Oceania</option>
        </select>
        
        <select className="filter-select" onChange={(e) => setSubregionFilter(e.target.value)}>
          <option value="">Filtrar por Sub-região</option>
          {subregions.map(subregion => (
            <option key={subregion} value={subregion}>{subregion}</option>
          ))}
        </select>

        <select className="filter-select" onChange={(e) => setPopulationFilter(e.target.value)}>
          <option value="">Filtrar por População</option>
          <option value="<1M">Menos de 1M</option>
          <option value="1M-10M">1M - 10M</option>
          <option value="10M-100M">10M - 100M</option>
          <option value=">100M">Mais de 100M</option>
        </select>
      </div>
      
      <div className="country-list">
        {filteredCountries.map((country) => (
          <div key={country.cca3} className="country-card">
            <Link to={`/country/${country.cca3}`}>
              <h2>{country.name.common}</h2>
              <img src={country.flags.svg} alt={`Bandeira de ${country.name.common}`} width="100" />
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
