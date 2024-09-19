const path=require('path');
const RULE_NAME = 'no-broad-semantic-versioning';
module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'problem',
    fixable: null,
    messages: {
      noBroadSemanticVersioning:
      'The "{{dependencyName}}" 不建议使用 "{{versioning}}"',
    }
  },
  create(context) {
    if(path.basename(context.getFilename())!=='package.json'){
      return {}
    }
    const cwd =context.getCwd();
    return {
      Property: function handleRequires(node) {
        if (
          node.key &&
          node.key.value &&
          (node.key.value === 'dependencies' || node.key.value === 'devDependencies') &&
          node.value &&
          node.value.properties
        ) {
          //遍历
          node.value.properties.forEach((property) => {
            if (property.key && property.key.value) {
              const dependencyName = property.key.value;
              const dependencyVersion = property.value.value;
              if (
                // *
                dependencyVersion.indexOf('*') > -1 ||
                // x.x
                dependencyVersion.indexOf('x') > -1 ||
                // > x
                dependencyVersion.indexOf('>') > -1
              ) {
                context.report({
                  loc: property.loc,
                  messageId: 'noBroadSemanticVersioning',
                  data: {
                    dependencyName,
                    versioning: dependencyVersion,
                  },
                });
              }
            }
          });
        }
      },
    }
  }
}