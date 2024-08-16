const postcss = require("postcss");


const defaults = {
    functionName: "luyi",
    groups: {},
    darkThemeSelector: 'html[data-theme="dark"]',
    nestingPlugin: null,
}

// const resolveColor = (options, theme, group) => {
//     return options.groups[group][theme]
// }

module.exports = postcss.plugin("postcss-theme-colors", (options) => {

    options = Object.assign({}, defaults, options);
    // groups: --> white: { light: "#fff", dark: "#000", },

    const reGroup = new RegExp(`\\b${options.functionName}\\(([^)]+)\\)`, 'g')

    return (style, result) => {

        const hasPlugin = name => 
        name.replace(/^postcss-/, '') === options.nestingPlugin || 
        result.processor.plugins.some(p => p.postcssPlugin === name);

        const getValue = (value, theme) => {
            // match: luyi(gray50), group: gray50
            return value.replace(reGroup, (match, group) => {
                return options.groups[group][theme]
            })
        }

        style.walkDecls((decl) => {
            const value = decl.value;
            // 我去判断一下，这个 value 上，有没有 luyi(*)这个东西
            if(!value || !reGroup.test(value)) {
                return;
            }

            // 说明我匹配到了，value 是 luyi(*);
            // 对于 luyi(gray50);
            // lightValue:#f9fafb   darkValue:#030712
            const lightValue = getValue(value, 'light');
            const darkValue = getValue(value, 'dark');

            // decl 就是指一个样式的 AST
            const darkDecl = decl.clone({ value: darkValue });

            let darkRule;
            // 使用 nest 插件，生成 dark 样式。
            if(hasPlugin('postcss-nesting')) {
                darkRule = postcss.atRule({
                    name: 'nest',
                    params: `${options.darkThemeSelector} &`
                })
            } else if(hasPlugin('postcss-nested')) {
                darkRule = postcss.rule({
                    params: `${options.darkThemeSelector} &`
                })
            } else {
                decl.warn(result, "no plugins nest find");
            }

            if(darkRule) {
                darkRule.append(darkDecl);
                decl.after(darkRule);
            }

            const lightDecl = decl.clone({ value: lightValue });
            decl.replaceWith(lightDecl);

        })
    }
})