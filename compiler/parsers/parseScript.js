const constants = require('vue-native-scripts/src/util/constants');
const { registeredPlugins } = require('../../plugins');

const defaultScript = `const ${constants.SCRIPT_OPTIONS} = {}`;

function transformScriptContent(content, lang) {
  if (!lang) {
    return content;
  }

  const transform = registeredPlugins.script[lang];
  if (!transform) {
    return content;
  }
  return transform(content);
}

function parseScript(script) {
  if (!script) {
    return defaultScript;
  }

  const { content, lang } = script;
  const scriptContent = content.replace(/\/\/\n/g, '');
  const transformedContent = transformScriptContent(scriptContent, lang);
  const s = `const ${constants.SCRIPT_OPTIONS} = `;
  return transformedContent
    .replace(/[\s;]*module.exports[\s]*=/, `\n${s}`)
    .replace(/[\s;]*export[\s]+default[\s]*\{/, `\n${s} {`);
}

module.exports = parseScript;
