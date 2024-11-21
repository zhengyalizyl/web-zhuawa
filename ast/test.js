const { tokenizer, parser, transform } =require('./utils.js')
const input='(add 2 (subtract 4 2))';
const output ="add (2, subtract (4, 2))";

const a=tokenizer(input);
const b= parser(a);
const c=transform(b)
console.log(a,b,c,'---a')