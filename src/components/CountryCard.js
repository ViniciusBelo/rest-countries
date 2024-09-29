import React from 'react';
import PropTypes from 'prop-types';
import './CountryCard.css'; // Para adicionar estilo personalizado

function CountryCard({ name, flag, capital, region, population }) {
  return (
    <div className="card country-card">
      <img src={flag} className="card-img-top" alt={`${name} flag`} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Capital: {capital}</p>
        <p className="card-text">Região: {region}</p>
        <p className="card-text">População: {population}</p>
      </div>
    </div>
  );
}

CountryCard.propTypes = {
  name: PropTypes.string.isRequired,
  flag: PropTypes.string.isRequired,
  capital: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  population: PropTypes.number.isRequired,
};

export default CountryCard;
