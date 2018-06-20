# vue-native-custom-transformer-plugin

## What is this?

* Plugin to add supports for custom languages like Pug, Sass in [vue-native](https://vue-native.io/) component.

## How to use

* `yarn add vue-native-custom-transformer-plugin`
* Open `vueTransformerPlugin.js` and replace `'vue-native-scripts'` to `'vue-native-custom-transformer-plugin'`.
* Add custom language packages you want to use. (ex. `yarn add pug typescript stylus`)
* Add config file named `vue-native-custom-transformer.config.js` to your project root.
  - Example: https://github.com/syumai/vue-native-custom-transformer-plugin/tree/master/examples

### Example app

* [vue-native-example-app](https://github.com/syumai/vue-native-example-app)
  - Example app with Pug / TypeScript / Stylus

## Warning

* This is an experimental product.
* Do not use this package in production.
* This plugin transpiles each files. (importing another file may causes something odd.)

## Builtin plugins

### template

* Pug (alpha)

### script

* TypeScript (alpha)

### styles

* Stylus (alpha)

## Custom plugins

### Example

* I've not tested if this coffee example works.

```js
const CoffeeScript = require('coffeescript')

module.exports = {
  // configure transformer plugins
  plugins: {
    template: ['pug'],
    script: [
      'ts',
      {
        lang: 'coffee', // This must set in "lang" attribute.
        transform(content) {
          return CoffeeScript.compile(code);
        },
      },
    ],
  },
};
```

## License

MIT

## Credits

* This project is based on
  - [Vue.js](https://vuejs.org/)
  - [react-vue-native-scripts](https://github.com/SmallComfort/react-vue-native-scripts)
  - [vue-native-core](https://github.com/GeekyAnts/vue-native-core)
