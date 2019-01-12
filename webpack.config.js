const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {loader: 'ts-loader'},
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
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
