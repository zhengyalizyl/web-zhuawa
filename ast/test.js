const { tokenizer, parser, 
  transform ,
  compiler,
  codeGenerator,
  transformer
} =require('./utils.js')

const input='(add 2 (subtract 4 2))'; //lisp

const output ="add(2,subtract(4,2))"; //js

const a=tokenizer(input);
/**
 * [
  { type: 'paren', value: '(' },
  { type: 'name', value: 'add' },
  { type: 'number', value: '2' },
  { type: 'paren', value: '(' },
  { type: 'name', value: 'subtract' },
  { type: 'number', value: '4' },
  { type: 'number', value: '2' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' }
]
 */
const b= parser(a);
/**
 * {
  "type": "Program",
  "body": [
    {
      "type": "CallExpression",
      "name": "add",
      "params": [
        {
          "type": "NumberLiteral",
          "value": "2"
        },
        {
          "type": "CallExpression",
          "name": "subtract",
          "params": [
            {
              "type": "NumberLiteral",
              "value": "4"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ]
        }
      ]
    }
  ]
}
 */


const c=transform(b);
/**
 * {
  "type": "Program",
  "body": [
    {
      "type": "CallExpression",
      "name": "add",
      "params": [
        {
          "type": "NumberLiteral",
          "value": "2"
        },
        {
          "type": "CallExpression",
          "name": "subtract",
          "params": [
            {
              "type": "NumberLiteral",
              "value": "4"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ],
          "_context": [
            {
              "type": "NumberLiteral",
              "value": "4"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ]
        }
      ],
      "_context": [
        {
          "type": "NumberLiteral",
          "value": "2"
        },
        {
          "type": "CallExpression",
          "callee": {
            "type": "Identifier",
            "name": "subtract"
          },
          "arguments": [
            {
              "type": "NumberLiteral",
              "value": "4"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ]
        }
      ]
    }
  ],
  "_context": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "Identifier",
          "name": "add"
        },
        "arguments": [
          {
            "type": "NumberLiteral",
            "value": "2"
          },
          {
            "type": "CallExpression",
            "callee": {
              "type": "Identifier",
              "name": "subtract"
            },
            "arguments": [
              {
                "type": "NumberLiteral",
                "value": "4"
              },
              {
                "type": "NumberLiteral",
                "value": "2"
              }
            ]
          }
        ]
      }
    }
  ]
 */


  const d = codeGenerator(c);
/**
 * add(2,subtract(4,2))
 */
  console.log(d,'----d')