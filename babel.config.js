module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        'browsers': '> 0.25%, not dead',
      },
      useBuiltIns: 'usage',
    }],
  ],
  env: {
    test: {
      presets: [
        'power-assert',
      ],
    },
  },
};
