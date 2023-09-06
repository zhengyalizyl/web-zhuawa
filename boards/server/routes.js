'use strict';
const isProduction = process.env.PRODUCTION || false;
const objectId = require('mongodb').ObjectID;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Boom = require('boom');
const _ = require('lodash');
const path = require('path');
const async = require('async');
const Schemas = require('./schemas');

const GET = 'get';
const PATCH = 'patch';
const POST = 'post';

const PULSES = 'pulses';

const sanitizeUpdate = update => _.omit(update, ['_id', 'created_at', 'updated_at']);

const getValidation = (resource, method) => {
  switch (method) {
    case GET:
      return {
        query: {
          limit: Joi.number().integer(),
          page: Joi.number().integer(),
          ids: Joi.array().items(Joi.objectId()).single(),
        },
      };
    case PATCH:
      return {
        params: { id: Joi.objectId() },
        payload: Schemas[resource][method],
      };
    case POST:
      return { payload: Schemas[resource][method] };
    default:
      console.error('Unsupported method: ', method);
      return null;
  }
};

const ensureDBIndex = (db, collectionName, fieldName, options) => {
  console.log('Creating index on field', fieldName, 'in collection', collectionName,
    '. (options: ', options, ')');
  db.collection(collectionName).createIndex(fieldName, options, (error, result) => {
    if (error) {
      console.error('Failed creating index:', error);
    } else {
      console.log('Index created successfully.');
    }
  });
};

exports.register = (plugin, options, done) => {

  plugin.dependency('hapi-mongodb');

  const db = plugin.mongo.db;

  const getPulses = query => {
    const queryOptions = {
      limit: query.limit,
      sort: [['_id', 1]],
      skip: query.limit * (query.page - 1),
    };
    const dataQuery = _.cloneDeep(query);
    delete dataQuery.limit;
    delete dataQuery.page;
    delete dataQuery.pagination;

    const pulseCollection = db.collection(PULSES);

    const res = pulseCollection.find(dataQuery, {}, queryOptions);

    return Promise.all([res.count(), res.toArray()])
  };

  const insertDocument = (record, collectionName) => {
    const collection = db.collection(collectionName);
    _.assign(record, { created_at: new Date() });
    return collection.insert(record);
  };

  plugin.route({
    method: POST,
    path: `/${PULSES}`,
    handler: (request, reply) => insertDocument(request.payload, PULSES).then((res) => reply(res)),
    config: {
      validate: getValidation(PULSES, POST),
    },
  });

  plugin.route({
    method: GET,
    path: `/${PULSES}`,
    handler: (request, reply) =>
      getPulses(request.query)
      .then(results => {
        request.totalCount = results[0];
        reply.paginate(results[1]);
      }),
    config: {
      // validate: getValidation(PULSES, GET),
      plugins: { pagination: { defaults: { limit: 10 } } },
    },
  });

  done();
}

exports.register.attributes = {
  name: 'Pulses',
  version: '1.0.0',
};
