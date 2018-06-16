module.exports = {
  // configure transformer plugins
  plugins: {
    template: ['pug'], // builtin plugins can be enabled by name
    script: [
      {
        lang: 'ts',
        transform(content) {
          // code to transform ts to js (transform must return string)
        },
      },
    ],
    styles: ['sass'],
  },
};
