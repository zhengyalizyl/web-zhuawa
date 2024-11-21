const { tokenizer, parser, 
  // transform 
} =require('./utils.js')

const input='(add 2 (subtract 4 2))'; //lisp

const output ="add (2, subtract (4, 2))"; //js

const a=tokenizer(input);
const b= parser(a);
// const c=transform(b)
console.log(a,b,'---a')