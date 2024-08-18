const mongoose = require('mongoose');

const tryConnect = () => {
    return mongoose.connect('mongodb://root:65f6f0a96966b768d81e86ba@39.101.162.138:27017/20230924?authSource=20230924');
}

const Model = (name, schema) => {
    return mongoose.model(name, new mongoose.Schema(schema, {
        collection: name,
    }))
}

module.exports = {
    tryConnect,
    Model
}
