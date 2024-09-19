'use strict';

const rule = require('../../rules/no-http-url');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  valid: [
    {
      code: "var test = 'https://zyl.com';",
    },
  ],

  invalid: [
    {
      code: "var test = 'http://zyl.com';",
      output: "var test = 'http://zyl.com';",
      errors: [
        {
          message: '建议 "http://zyl.com" 切换成 HTTPS',
        },
      ],
    },
    {
      code: "<img src='http://zyl.com' />",
      output: "<img src='http://zyl.com' />",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [
        {
          message: '建议 "http://zyl.com" 切换成 HTTPS',
        },
      ],
    },
  ],
});
