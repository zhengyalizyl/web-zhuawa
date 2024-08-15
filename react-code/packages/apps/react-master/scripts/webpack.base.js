const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = function(isDev) {
    return {
        // 1. 输入输出部分
        // 最基础的，就是我的入口
        entry: path.resolve(__dirname, "../src/index.tsx"),
        output: {
            // 打包输出的结果路径
            path: path.resolve(__dirname, "../dist"),
            // 每个输出的 JS 的名称
            // hash, contentHash, chunkHash
            filename: "static/js/[name].[hash:8].js",
            // webpack 5 内置，构建前删除一下 dist 
            // webpack 4 没有，clean-webpack-plugin
            clean: true,
            // 打包后的文件的公共前缀路径
            publicPath: '/'
        },

        // 2. resolve 部分
        // 我文件是如何优化搜索，依赖的。
        // 用于在引入模块时，可以不带文件后缀，本质也是一个优先级的顺序，可能会影响构建性能；
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js']
        },

        // 3. loader 部分
        module: {
            // loader 就是在你从入口文件，去解析各种 import, from 的文件时
            // 针对不同类型的文件，有不同的处理方法，这个不同后缀的文件
            // 需要有一个解析器，去识别这些文件内容的含义，从而保证可以最后形成一个 bundle
            rules: [
                {
                    test: /\.(tsx|ts)$/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                // postcss-loader: 帮我们处理一些语法转换问题，因为我们要用 tailwind
                // postcss, 相当于 css 界的 babel;
                // css-loader: 主要是处理路径, <link >
                // style-loader: 帮我们把 css 的属性，放到内联样式上
                // dev: css 嵌套在 style 标签里，可以方便热替换；
                // prod: 我们希望使用 mini-css-extract-plugin, 帮我们单独抽离出来，方便文件缓存
                {
                  oneOf: [
                    // 定义一个规则，模块化的，我们用 xxx.module.(css|less) 这种格式来处理
                    {
                        test: /\.module\.(less|css)$/,
                        include: [path.resolve(__dirname, "../src")],
                        use: [
                            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    modules: {
                                        // 我们这里就可以借助 css-module， 实现 BEM 风格
                                        localIdentName: "[path][name]__[local]--[hash:base64:5]"
                                    }
                                }
                            },
                            "postcss-loader",
                            "less-loader"
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                            "css-loader",
                            "postcss-loader"
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                            "css-loader",
                            "postcss-loader",
                            "less-loader"
                        ]
                    },
                  ]  
                },
                {
                    // webpack 5 之前，要用 loader(url, file), 去处理，现在内置了
                    test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
                    generator: {
                        filename: 'static/images/[name].[contenthash:8][ext]',
                    }
                },
                {
                    // webpack 5 之前，要用 loader(url, file), 去处理，现在内置了
                    test: /\.(woff2?|eot|ttf|otf)$/,
                    generator: {
                        filename: 'static/fonts/[name].[contenthash:8][ext]',
                    }
                },
                {
                    // webpack 5 之前，要用 loader(url, file), 去处理，现在内置了
                    test: /\.(mp4|flv|mp3|wav)$/,
                    generator: {
                        filename: 'static/media/[name].[contenthash:8][ext]',
                    }
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                // 这个就是把我们的js 和 css 注入到一个 html 的模板里
                template: path.resolve(__dirname, "../public/index.html"),
                // 自动注入资源文件
                inject: true,
            }),

            new MiniCssExtractPlugin({
                filename: isDev ? "static/css/[name].css" : 
                "static/css/[name].[contenthash:4].css"
            })
        ]
    }
}