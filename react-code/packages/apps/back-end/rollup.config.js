const babel = require("rollup-plugin-babel");

module.exports = {
    input: "./src/index.js",
    output: {
        file: './dist/bundle.js',
        format: 'umd',
        name: 'zylServer'
    },

    treeshake: false,

    plugins: [
        babel({
            runtimeHelpers: true,
            extensions: ['.js', '.ts'],
            exclude: 'node_modules/**',
            externalHelpers: true,
        })
    ]
}