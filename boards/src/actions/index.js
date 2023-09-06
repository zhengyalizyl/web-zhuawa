import { CALL_API } from '../middleware/api';
import { schema } from 'normalizr';
// import { push } from 'react-router-redux';
const _ = require('lodash');

export const SELECT_PULSE = 'SELECT_PULSE'

export function selectPulse(selectedPulseId) {
  return {
    type: SELECT_PULSE,
    selectedPulseId,
  };
}


const genericSchema = type => new schema.Entity(type.toLowerCase(), {}, { idAttribute: '_id' });
const genericArraySchema = type => new schema.Array(genericSchema(type));

export function getEntityActionTypes(entityName) {
  return [
    `${entityName.toUpperCase()}_REQUEST`,
    `${entityName.toUpperCase()}_SUCCESS`,
    `${entityName.toUpperCase()}_FAILURE`,
  ];
}

function fetchEntities(entityName, endpointUrl) {
  return {
    [CALL_API]: {
      types: getEntityActionTypes(entityName),
      endpoint: endpointUrl,
      schema: genericArraySchema(entityName),
    },
  };
}

export function loadEntities(entityName, options = { loadNextPage: true}) {
  return (dispatch, getState) => {
    const { pagination: { [`${entityName}Pagination`]: { nextPageUrl } }} = getState();
    if (nextPageUrl === null) {
      return;
    }
    const endpointUrl = nextPageUrl || entityName;
    dispatch(fetchEntities(entityName, endpointUrl))

  }
}


export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE,
  };
}
