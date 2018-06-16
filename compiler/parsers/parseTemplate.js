const compiler = require('vue-native-template-compiler');
const constants = require('vue-native-scripts/src/util/constants');

let pug;

try {
  pug = require('pug');
} catch (e) {
  console.log('pug not loaded');
}

const defaultTemplate = {
  import: `import { Component as ${constants.COMPONENT} } from 'react'`,
  render: `const ${constants.TEMPLATE_RENDER} = () => null`,
};

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

module.exports = parseTemplate;
