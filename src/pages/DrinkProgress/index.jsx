import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import fetchApi from '../../services';
import * as S from '../../components/Details/styled';
import TitleContainer from '../../components/Details/TitleContainer';
import {
  pathName,
  ingredientsArray,
  measureArray,
  sources,
} from '../../components/Details/services';

export default function DrinkProgress(props) {
  const [details, setDetails] = useState(null);

  const {
    match: { params, path },
  } = props;

  const { typePath, selectorPath } = pathName(path);

  const { id } = params;

  useEffect(() => {
    fetchApi(typePath, 'details', id).then((res) => setDetails(res[selectorPath][0]));
  }, [id, typePath, selectorPath]);
  return (
    <S.Container>
      <S.ThumbNail
        src={ sources('strMealThumb', 'strDrinkThumb', details, typePath) }
        alt="recipe"
        data-testid="recipe-photo"
      />
      <TitleContainer { ...props } item={ details } />
      <h3 data-testid="recipe-category">
        {details
          && (typePath === 'food' ? details.strCategory : details.strAlcoholic)}
      </h3>
      <ul>
        <h4>Ingredients:</h4>
        {details
          && ingredientsArray(details).map((item, index) => (
            <label
              key={ index }
              htmlFor={ index }
              data-testid={ `${index}-ingredient-step` }
            >
              <input
                id={ index }
                type="checkbox"
              />
              {measureArray(details)[index]}
              &nbsp;
              <strong>{item}</strong>
            </label>
          ))}
      </ul>
      <p data-testid="instructions">{details && details.strInstructions}</p>
      <Link
        data-testid="finish-recipe-btn"
        to="/receitas-feitas"
      >
        Finalizar Receita
      </Link>
    </S.Container>
  );
}

DrinkProgress.propTypes = {
  id: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.string),
    path: PropTypes.string.isRequired,
  }).isRequired,
};
