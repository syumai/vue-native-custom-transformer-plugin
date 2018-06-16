const compiler = require('vue-native-template-compiler');
const constants = require('vue-native-scripts/src/util/constants');
const addvm = require('vue-native-scripts/src/util/addvm');
const parsers = require('./parsers');

const imports = `import ${constants.VUE}, { observer as ${
  constants.OBSERVER
} } from 'vue-native-core';
import ${constants.REACT_NATIVE} from 'react-native';
import ${constants.PROP_TYPE} from 'prop-types';
import { buildNativeComponent as ${
  constants.BUILD_COMPONENT
} } from 'vue-native-helper';`;

const builder = `const ${constants.COMPONENT_BUILDED} = ${
  constants.BUILD_COMPONENT
}(${constants.TEMPLATE_RENDER}, ${constants.SCRIPT_OPTIONS}, {Component: ${
  constants.COMPONENT
}, PropTypes: ${constants.PROP_TYPE}, Vue: ${constants.VUE}, ReactNative: ${
  constants.REACT_NATIVE
}, css: ${constants.CSS}});`;

const exportDefault = `export default ${constants.OBSERVER}(${
  constants.COMPONENT_BUILDED
})`;

function compileVueToRn(resource) {
  const code = resource.toString();
  const cparsed = compiler.parseComponent(code, { pad: 'line' });

  const { parsedTemplate, parsedScript, parsedStyles } = parsers.parse(cparsed);

  return concatResults(
    imports,
    parsedTemplate.import,
    parsedScript,
    addvm(parsedTemplate.render),
    parsedStyles,
    builder,
    exportDefault
  );
}

function concatResults(...results) {
  return results.join('\n\n');
}

module.exports = { compile: compileVueToRn };
