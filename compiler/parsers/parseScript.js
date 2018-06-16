const defaultScript = `const ${constants.SCRIPT_OPTIONS} = {}`;
const constants = require('vue-native-scripts/src/util/constants');

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

module.exports = parseScript;
