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
    // see also: https://github.com/webpack/webpack/issues/6522
    globalObject: '(typeof window !== "undefined" ? window : this)',
  },
};
