const compiler = require('vue-native-template-compiler');
const cssParse = require('css-parse');
const constants = require('vue-native-scripts/src/util/constants');
const addvm = require('vue-native-scripts/src/util/addvm');
const parseCss = require('vue-native-scripts/src/util/parseCss');

let pug, sass;

try {
  pug = require('pug');
} catch (e) {
  console.log('pug not loaded');
}

try {
  sass = require('node-sass');
} catch (e) {
  console.log('node-sass not loaded');
}

const defaultTemplate = {
  import: `import { Component as ${constants.COMPONENT} } from 'react'`,
  render: `const ${constants.TEMPLATE_RENDER} = () => null`,
};

const defaultScript = `const ${constants.SCRIPT_OPTIONS} = {}`;

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

  const { template, script, styles } = cparsed;

  const parsedTemplate = parseTemplate(template);
  const parsedScript = parseScript(script);
  const parsedStyles = parseStyles(styles);

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

function transpileTemplateContent(content, lang) {
  if (lang === 'pug') {
    if (pug) {
      return pug.render(content);
    } else {
      throw new Error(`failed to load pug! please add pug as a dependency.`);
    }
  }
  return content;
}

function parseTemplate(template) {
  if (!template) {
    return defaultTemplate;
  }

  const { content, lang } = template;
  const trimmedContent = content.replace(/\/\/\n/g, '');
  const transpiledContent = transpileTemplateContent(trimmedContent, lang);
  if (transpiledContent) {
    const obj = compiler.nativeCompiler(transpiledContent);
    return {
      import: obj.importCode,
      render: `const ${constants.TEMPLATE_RENDER} = ${obj.renderCode}`,
    };
  }
}

function parseScript(script) {
  if (!script) {
    return defaultScript;
  }

  const scriptContent = script.content.replace(/\/\/\n/g, '').trim();
  const s = `const ${constants.SCRIPT_OPTIONS} = `;
  return scriptContent
    .replace(/[\s;]*module.exports[\s]*=/, `\n${s}`)
    .replace(/[\s;]*export[\s]+default[\s]*\{/, `\n${s} {`);
}

function transpileStylesContent(content, lang) {
  if (lang) {
    switch (lang) {
      case 'scss':
      case 'sass':
        if (sass) {
          return sass.renderSync({
            data: content,
            indentedSyntax: lang === 'sass',
          });
        } else {
          throw new Error(
            `failed to load node-sass! please add node-sass as a dependency.`
          );
        }
      default:
        throw new Error(`style type '${lang}' not supported.`);
    }
  }
  return content;
}

function parseStyles(styles) {
  const parsedStylesObj = styles.reduce((prev, curr) => {
    const { content, lang } = curr;
    const transpiledContent = transpileStylesContent(content, lang);
    const cssAST = cssParse(transpiledContent);
    return Object.assign({}, prev, parseCss(cssAST));
  }, {});
  return `const ${constants.CSS} = ${JSON.stringify(parsedStylesObj)}`;
}

function concatResults(...results) {
  return results.join('\n\n');
}

module.exports = { compile: compileVueToRn };
