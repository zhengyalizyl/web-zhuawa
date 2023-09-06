"use strict";
const Hapi = require('hapi');
const Blipp = require('blipp');
const Hoek = require('hoek');
const CatboxMemory = require('catbox-memory');
const Routes = require('./routes');

const isProduction = process.env.PRODUCTION || false;

const { paginationOptions } = require('./pagination-options');

function createServer(options, callback) {
  console.log(`Runnning server in ${isProduction ? 'Production' : 'development'} mode.`);

  let settings = {};

  Hoek.merge(settings, options);

  const server = new Hapi.Server({
    cache: CatboxMemory,
    debug: isProduction ? undefined : { request: ['error'] },
  });

  const origin = isProduction ? ['*'] : ['*'];

  server.connection({
    routes: {
      cors: {
        origin,
        credentials: true,
      },
    },
    port: 8081,
    // to be seen on local lan use 0.0.0.0 for local only 127.0.0.1
    host: isProduction ? undefined : '0.0.0.0',
  });

  server.decorate('server', 'config', () => settings);

  server.register([
    { register: require('hapi-mongodb'), options: { url: settings.db.url, decorate: true } },
    { register: require('hapi-pagination'), options: paginationOptions },
    Blipp,
    Routes,
  ], err => callback(err, server));
}

module.exports.init = createServer;
