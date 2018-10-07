const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'Igata',
    libraryTarget: 'umd',
  },
};
