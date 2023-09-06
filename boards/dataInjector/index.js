const Server = require('../server');
const async = require('async');
const _ = require('lodash');
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const faker = require('faker');

const config = require('../configs/dev.json');

var server = null;

const collections = {
  pulses: _.times(12000, () => ({
    content: faker.hacker.phrase(),
    updates: _.times(Math.random().toString().slice(2,4), () => ({
      content: faker.hacker.phrase() || [],
    }))
  }))
}

const removeAll = (callback) => {
  console.log("Removing Collections:");
  MongoClient.connect(config.db.url, (err, db) => {
    const removeCollection = (collectionName, removedCallback) => {
      db.collection(collectionName, (err, records) => {
        records.remove({}, (err) => {
          console.log(`'${collectionName}' removed.`);
          removedCallback();
        });
      });
    };
    async.eachSeries(Object.keys(collections), removeCollection, () => {
      db.close();
      console.log('removed collections.');
      callback();
    });
  });
};

const initServer = (callback) => {
  Server.init(config, (err, _server) => {
    // _server.start();
    server = _server;
    if (err) {
      return console.error('server init err:', err);
    }
    console.log('Init Server for Data Injection');
    console.log('Using DB:', config.db.url);
    callback(err);
  });
};

const fillData = callback => {
  const keys = _.keys(collections);
  const dataFillers = [];

  keys.forEach(key => collections[key].forEach(item =>
      dataFillers.push(server.inject({
        method: 'POST',
        url: `/${key}`,
        payload: item,
      }))
    )
  );
  Promise.all(dataFillers).then(callback)
}

// const shutdownServer = () => {
//   setTimeout(() => { // TODO: fix this hack
//     console.log('finished.');
//     process.exit(0);
//   }, 2000);
// };

async.series([removeAll, initServer, fillData]);
