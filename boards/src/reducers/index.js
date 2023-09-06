import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { routerReducer } from 'react-router-redux';
import paginate from './paginate'


// Updates an entity cache in response to any action with response.entities.
function entities(state = {
  pulses: {},
}, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }
  return state;
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action;
  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return action.error;
  }

  return state;
}

function selectedPulseId(state = null, action) { //defines the name of the state key
  switch (action.type) {
    case ActionTypes.SELECT_PULSE:
      return action.selectedPulseId;
    default: // no selection
      return state;
  }
}

// Updates the pagination data for different actions.
const pagination = combineReducers({
  pulsesPagination: paginate({
    types: ActionTypes.getEntityActionTypes('pulses'),
  }),
});

const appReducer = combineReducers({
  pagination,
  entities,
  errorMessage,
  selectedPulseId,
  routing: routerReducer, // not in use for current example
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') { // simulate logout to clean state.
    const { routing } = state;
    return appReducer({ routing }, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
