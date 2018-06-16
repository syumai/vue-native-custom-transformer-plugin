const compiler = require('vue-native-template-compiler');
const constants = require('vue-native-scripts/src/util/constants');
const { registeredPlugins } = require('../../plugins');

const defaultTemplate = {
  import: `import { Component as ${constants.COMPONENT} } from 'react'`,
  render: `const ${constants.TEMPLATE_RENDER} = () => null`,
};

function transformTemplateContent(content, lang) {
  if (!lang) {
    return content;
  }

  const transform = registeredPlugins.template[lang];
  if (!transform) {
    return content;
  }
  return transform(content);
}

function parseTemplate(template) {
  if (!template) {
    return defaultTemplate;
  }

  const { content, lang } = template;
  const trimmedContent = content.replace(/\/\/\n/g, '');
  const transformedContent = transformTemplateContent(trimmedContent, lang);
  if (transformedContent) {
    const obj = compiler.nativeCompiler(transformedContent);
    return {
      import: obj.importCode,
      render: `const ${constants.TEMPLATE_RENDER} = ${obj.renderCode}`,
    };
  }
}

module.exports = parseTemplate;
