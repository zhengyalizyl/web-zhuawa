import { normalize } from 'normalizr';
import 'isomorphic-fetch';
import _ from 'lodash';

const API_PORT = '8081';
const API_ROOT = window.location.port ? `http://${window.location.hostname}:${API_PORT}/` : process.env.API_ROOT;

function callApi(endpoint, schema, options) {
  console.log('callApi');
  const fullUrl = (endpoint.toLowerCase().indexOf('://') === -1) ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl, options)
  .then(response =>
    response.json().then(json => ({ json, response }))
  )
  .then(({ json, response }) => {
    if (!response.ok) {
      //handle errors
    }
    console.log(json);
    const result = normalize(json.results, schema);
    console.log(result);
    return _.assign({}, result, json.meta);
  });
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');
export const root = API_ROOT;


// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.

// Do you think WTF?
// well the middleware is wrapping a dispatch call to the store:
// store.dispatch
export default store => next => action => {
  const callAPI = action[CALL_API];

  // 1. continue
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;

  const {
    schema,
    types,
    options,
    page,
    // request,
    // revert, // previous to api call (not in use)
  } = callAPI;


  // not in use:
  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  // Warnings:
  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const [requestType, successType, failureType] = types;

  next({
    type: requestType,
    key: schema.schema.key,
  });

  return callApi(endpoint, schema, options).then(
    response => next({
      type: successType,
      response,
      key: schema.schema.key,
    }),
    error => next({
      type: failureType,
      error: error.error || error || 'Something went wrong',
      statusCode: error.statusCode,
      serverRequest: error.payload,
    }),
  );
};
