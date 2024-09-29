import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function CountryDetails() {
  const { cca3 } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Faz uma requisição individual à API RestCountries para obter os detalhes do país
    axios.get(`https://restcountries.com/v3.1/alpha/${cca3}`)
      .then(response => {
        setCountry(response.data[0]); // A API retorna uma lista, por isso acessamos o primeiro elemento.
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do país:', error);
        setError('Ocorreu um erro ao buscar os detalhes do país.');
        setLoading(false);
      });
  }, [cca3]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!country) {
    return <div>País não encontrado.</div>;
  }

  return (
    <div className="country-details">
      <h1>{country.name.official}</h1>
      <img src={country.flags.png} alt={`${country.name.common} flag`} />
      <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Região:</strong> {country.region}</p>
      <p><strong>Sub-região:</strong> {country.subregion}</p>
      <p><strong>População:</strong> {country.population.toLocaleString()}</p>
      <p><strong>Área:</strong> {country.area.toLocaleString()} km²</p>
      <p><strong>Idiomas:</strong> {Object.values(country.languages).join(', ')}</p>
      <p><strong>Moeda:</strong> {Object.values(country.currencies)[0].name}</p>
      <p><strong>Fuso horário:</strong> {country.timezones.join(', ')}</p>
      <p><strong>Domínio de Internet (TLD):</strong> {country.tld.join(', ')}</p>

      <Link to="/" className="back-button">
        Voltar para a lista
      </Link>
    </div>
  );
}

export default CountryDetails;
