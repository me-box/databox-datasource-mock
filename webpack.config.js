var path = require("path");

module.exports = {
  
  target: 'node',
  
  node: {
  __dirname: false,
  __filename: false,
  },

  entry: {
    server: ["./source.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      // JavaScript / ES6
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ]
  }
};
