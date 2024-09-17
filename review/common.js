var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;
var lib=require('./lib')

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
console.log(lib.getCounter())//4