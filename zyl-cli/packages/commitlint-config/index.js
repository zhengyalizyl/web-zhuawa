module.exports={
  //https://commitlint.js.org/reference/rules.html
  parserPreset:'conventional-changelog-conventionalcommits',
  rules:{
    "body-leading-blank":[1,'always'],//0 disables,1 warning,2 error
    "body-max-line-length":[2,'always',100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'test', 'refactor', 'chore', 'revert']],
  }
}