module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
  ],
  env: {
    test: {
      presets: [
        'power-assert',
      ],
    },
  },
};
