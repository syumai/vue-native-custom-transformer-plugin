const semver = require('semver');

const {
  version: reactNativeVersionString,
} = require('react-native/package.json');
const { minor: reactNativeMinorVersion } = semver(reactNativeVersionString);

const upstreamTransformer = (() => {
  if (reactNativeMinorVersion >= 59) {
    return require("metro-react-native-babel-transformer");
  } else if (reactNativeMinorVersion >= 56) {
    return require('metro/src/reactNativeTransformer');
  } else if (reactNativeMinorVersion >= 52) {
    return require('metro/src/transformer');
  } else if (reactNativeMinorVersion >= 47) {
    return require('metro-bundler/src/transformer');
  } else if (reactNativeMinorVersion === 46) {
    return require('metro-bundler/build/transformer');
  } else {
    // handle RN <= 0.45
    const oldUpstreamTransformer = require('react-native/packager/transformer');
    return {
      transform({ src, filename, options }) {
        return oldUpstreamTransformer.transform(src, filename, options);
      },
    };
  }
})();

module.exports = upstreamTransformer;
