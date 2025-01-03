const path = require('path');
const FileListPlugin = require('./plugins/fileList');
module.exports = {
  entry: "./main.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.[chunkhash].js",
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /.(png|jpe?g|svg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /.md$/,
        use: [path.resolve(__dirname, './loaders/md-loader')]
      },
      {
        test: /.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          },
          // {
          //   loader:path.resolve(__dirname, './loaders/test-babel-loader.js'),
          //   options: {
          //     presets: ["@babel/preset-env"]
          //   }
          // },
          {
            loader: path.resolve(__dirname, './loaders/self-loader.js'),
            options: {
              name: 'hello self-loader'
            }
          }

        ]
      }
    ]
  },
  plugins:[
    // new FileListPlugin()
  ]
  
}