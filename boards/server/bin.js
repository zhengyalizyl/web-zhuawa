"use strict";
const Path = require('path');
const Server = require('./index');

const configPath = process.argv[2] && Path.resolve(process.argv[2]);

var config = {};

if (!configPath) {
  console.log("loading config from env vars");
  config.db = { url: process.env.dburl };
} else {
  console.log("loading config:", configPath);
  config = require(configPath)
}

if (config.db.url) {
  Server.init(config, (err, server) => {
    if (err)
      return console.error('server init err:', err);
    server.start();
  });
}
