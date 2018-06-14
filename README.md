# vue-native-custom-transformer-plugin

## What is this?

* Plugin to add supports for custom languages like Pug, Sass in [vue-native](https://vue-native.io/) component.

## How to use

* `yarn add vue-native-custom-transformer-plugin`
* Open `vueTransformerPlugin.js` and replace `'vue-native-scripts'` to `'vue-native-custom-transformer-plugin'`.
* Add custom language packages you want to use. (ex. `yarn add pug`)

## Warning

* This is an experimental product.
* Do not use this package in production.

## Status

### template

* Pug (alpha)

### script

* None

### styles

* Sass (defined in code but not implemented)

## License

MIT

## Credits

* This project is based on
  - [Vue.js](https://vuejs.org/)
  - [react-vue-native-scripts](https://github.com/SmallComfort/react-vue-native-scripts)
  - [vue-native-core](https://github.com/GeekyAnts/vue-native-core)
