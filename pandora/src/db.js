import Dexie from 'dexie';

const db = new Dexie('MyDatabase');
// Declare tables, IDs and indexes
db.version(1).stores({
    states: '++num, id, setting, components, create_time'
});

export default db;