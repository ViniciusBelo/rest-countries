import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function CountryDetails() {
  const { cca3 } = useParams();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/alpha/${cca3}`)
      .then(response => {
        setCountry(response.data[0]);
      })
      .catch(error => console.error('Erro ao buscar país', error));
  }, [cca3]);

  if (!country) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <img src={country.flags.svg} alt={`Bandeira de ${country.name.common}`} width="200" />
      <p><strong>Nome Oficial:</strong> {country.name.official}</p>
      <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Região:</strong> {country.region}</p>
      <p><strong>Sub-região:</strong> {country.subregion}</p>
      <p><strong>População:</strong> {country.population.toLocaleString()}</p>
      <p><strong>Área:</strong> {country.area.toLocaleString()} km²</p>
      <p><strong>Idiomas:</strong> {Object.values(country.languages).join(', ')}</p>
      <p><strong>Moedas:</strong> {Object.values(country.currencies).map(c => c.name).join(', ')}</p>
      <p><strong>Fuso horário:</strong> {country.timezones.join(', ')}</p>
      <p><strong>Código de discagem internacional:</strong> +{country.idd.root}{country.idd.suffixes[0]}</p>
      <Link to="/">Voltar para a lista</Link>
    </div>
  );
}

export default CountryDetails;
