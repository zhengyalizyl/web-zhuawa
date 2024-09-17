// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
function getCounter(){
  return counter
}
//拷贝
module.exports = {
  counter: counter,
  incCounter: incCounter,
    getCounter,
};