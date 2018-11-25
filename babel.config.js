module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        'browsers': '> 0.25%, not dead',
      },
      useBuiltIns: 'usage',
    }],
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  env: {
    test: {
      presets: [
        'power-assert',
      ],
    },
  },
};
